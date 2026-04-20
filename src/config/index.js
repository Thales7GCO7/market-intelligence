require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  db: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },

  google: {
    placesApiKey: process.env.GOOGLE_PLACES_API_KEY,
    placesBaseUrl: 'https://maps.googleapis.com/maps/api/place',
  },
};