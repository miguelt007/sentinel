// opensky.js

const axios = require('axios');

const OPENKY_BASE_URL = 'https://api.openky.io/v1';

const getAccessToken = async () => {
  try {
    const response = await axios.post(`${OPENKY_BASE_URL}/auth/token`, {
      client_id: process.env.OPENSKY_CLIENT_ID,
      client_secret: process.env.OPENSKY_CLIENT_SECRET,
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Erro ao obter token de acesso:', error.response?.data || error.message);
    throw new Error('Falha na autenticação com a OpenSky API');
  }
};

const fetchFlightData = async (icao24) => {
  const token = await getAccessToken();

  try {
    const response = await axios.get(`${OPENKY_BASE_URL}/flights/${icao24}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados de voo:', error.response?.data || error.message);
    throw new Error('Falha ao obter dados de voo da OpenSky');
  }
};

module.exports = {
  fetchFlightData,
};