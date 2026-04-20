const express = require('express');
const router = express.Router();
const placesService = require('../services/placesService');
const pool = require('../db/pool');

router.get('/', async (req, res, next) => {
  try {
    const { lat, lng, segment, radius } = req.query;

    const googleResults = await placesService.searchNearby({ 
      lat, 
      lng, 
      radius, 
      keyword: segment 
    });

    const upsertQuery = `
      INSERT INTO businesses (google_id, name, segment, address, rating, review_count, location, raw_data)
      VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_MakePoint($7, $8), 4326), $9)
      ON CONFLICT (google_id) DO UPDATE SET
        name = EXCLUDED.name,
        rating = EXCLUDED.rating,
        review_count = EXCLUDED.review_count,
        updated_at = NOW()
      RETURNING 
        id, 
        google_id, 
        name, 
        segment, 
        address, 
        rating, 
        review_count, 
        ST_Y(location::geometry) AS lat, 
        ST_X(location::geometry) AS lng, 
        raw_data, 
        updated_at;
    `;

    const savedBusinesses = await Promise.all(
      googleResults.map(async (biz) => {
        const values = [
          biz.google_id,
          biz.name,
          segment,
          biz.address,
          biz.rating || 0,
          biz.review_count || 0,
          biz.location.lng,
          biz.location.lat,
          JSON.stringify(biz.raw_data)
        ];

        const resDb = await pool.query(upsertQuery, values);
        return resDb.rows[0];
      })
    );

    res.json({
      source: 'google_api_and_db_sync',
      count: savedBusinesses.length,
      results: savedBusinesses
    });

  } catch (error) {
    console.error("Erro no Business Route:", error);
    res.status(500).json({ error: "Erro ao processar mercado", details: error.message });
  }
});

module.exports = router;