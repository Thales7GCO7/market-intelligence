const axios = require('axios');
const config = require('../config');

const BASE_URL = config.google.placesBaseUrl;
const API_KEY = config.google.placesApiKey;

function normalizePlace(place) {
  const loc = place.geometry?.location;
  return {
    google_id: place.place_id,
    name: place.name,
    address: place.vicinity || place.formatted_address || 'Endereço não disponível',
    rating: place.rating || 0,
    review_count: place.user_ratings_total || 0,
    segment: place.types?.[0] || 'negócio',
    location: loc ? { lat: loc.lat, lng: loc.lng } : null,
    raw_data: place,
  };
}

async function searchNearby({ lat, lng, radius = 5000, keyword = '' }) {
  try {
    const response = await axios.get(`${BASE_URL}/nearbysearch/json`, {
      params: {
        location: `${lat},${lng}`,
        radius: radius,
        keyword: keyword,
        key: API_KEY,
      },
    });

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`Erro Google Places: ${response.data.status}`);
    }

    const results = response.data.results || [];
    return results.map(normalizePlace);
  } catch (error) {
    console.error('Erro na busca do Google Places:', error.message);
    throw error;
  }
}

async function getPlaceDetails(placeId) {
  try {
    const response = await axios.get(`${BASE_URL}/details/json`, {
      params: {
        place_id: placeId,
        fields: 'name,place_id,formatted_address,formatted_phone_number,website,rating,user_ratings_total,geometry,types',
        key: API_KEY,
      },
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Erro Google Places Details: ${response.data.status}`);
    }

    return normalizePlace(response.data.result);
  } catch (error) {
    console.error('Erro nos detalhes do Google Places:', error.message);
    throw error;
  }
}

module.exports = {
  searchNearby,
  getPlaceDetails,
};