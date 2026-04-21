const express = require('express');
const router = express.Router();
const placesService = require('../services/placesService');
const pool = require('../db/pool');

router.get('/', async (req, res, next) => {
  try {
    const { lat, lng, segment, radius } = req.query;

    if (!segment) {
      return res.status(400).json({ error: "O segmento é obrigatório." });
    }

    const googleResults = await placesService.searchNearby({ lat, lng, segment, radius });
    console.log(`[DEBUG] Google retornou ${googleResults ? googleResults.length : 0} resultados.`);

    if (!googleResults || googleResults.length === 0) {
      return res.json({ source: 'google_api', count: 0, results: [] });
    }

    const filteredResults = googleResults.filter(estabelecimento => {
      const termoBusca = segment.toLowerCase();
      const nomeEstabelecimento = (estabelecimento.name || "").toLowerCase();
      const tiposGoogle = estabelecimento.raw_data?.types || [];

      const categoriaMap = {
        'café': ['cafe', 'bakery', 'restaurant'],
        'cafeteria': ['cafe'],
        'farmácia': ['pharmacy', 'drugstore', 'health'],
        'farmacia': ['pharmacy', 'drugstore', 'health'],
        'padaria': ['bakery'],
        'mercado': ['supermarket', 'grocery_or_supermarket', 'convenience_store'],
        'academia': ['gym', 'health'],
        'restaurante': ['restaurant', 'food']
      };
    
      const nomeBate = nomeEstabelecimento.includes(termoBusca);
    
      const tiposAlvo = categoriaMap[termoBusca] || [];
      const tipoBate = tiposGoogle.some(t => tiposAlvo.includes(t));
    
      const ehBloqueado = tiposGoogle.some(t => 
        ['lodging', 'hotel', 'school', 'university', 'city_hall', 'local_government_office', 'church'].includes(t)
      );
    
      return (nomeBate || tipoBate) && !ehBloqueado;
    });

    console.log(`[DEBUG] Após filtro restaram ${filteredResults.length} resultados.`);

    const upsertQuery = `
      INSERT INTO businesses (google_id, name, segment, address, rating, review_count, location, raw_data)
      VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_MakePoint($7, $8), 4326), $9)
      ON CONFLICT (google_id) DO UPDATE SET
        name = EXCLUDED.name,
        rating = EXCLUDED.rating,
        review_count = EXCLUDED.review_count,
        updated_at = NOW()
      RETURNING id, google_id, name, segment, address, rating, review_count, 
                ST_Y(location::geometry) AS lat, ST_X(location::geometry) AS lng, raw_data;
    `;

    const savedBusinesses = await Promise.all(
      filteredResults.map(async (est) => {
        try {
          
          const latitude = est.location?.lat || est.geometry?.location?.lat;
          const longitude = est.location?.lng || est.geometry?.location?.lng;

          if (!latitude || !longitude) {
            console.error(`[ERRO] Localização ausente para: ${est.name}`);
            return null;
          }

          const values = [
            est.google_id || est.place_id,
            est.name,
            segment,
            est.address || est.vicinity,
            est.rating || 0,
            est.review_count || est.user_ratings_total || 0,
            longitude,
            latitude,
            JSON.stringify(est.raw_data || est)
          ];

          const resDb = await pool.query(upsertQuery, values);
          return resDb.rows[0];
        } catch (dbErr) {
          console.error(`[ERRO BANCO] Falha ao salvar ${est.name}:`, dbErr.message);
          return null;
        }
      })
    );

    const resultadosFinais = savedBusinesses.filter(item => item !== null);
    console.log(`[DEBUG] Enviando ${resultadosFinais.length} resultados para o browser.`);

    res.json({
      source: 'market_intelligence_sync',
      segmento_pesquisado: segment,
      count: resultadosFinais.length,
      results: resultadosFinais
    });

  } catch (error) {
    console.error("Erro crítico na rota:", error);
    res.status(500).json({ error: "Erro interno", details: error.message });
  }
});

module.exports = router;