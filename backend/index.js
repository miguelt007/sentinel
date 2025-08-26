const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/opensky', async (req, res) => {
  try {
    const response = await axios.get('https://opensky-network.org/api/states/all', {
      auth: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD
      }
    });

    const filtered = response.data.states.map(state => ({
      icao24: state[0],
      callsign: state[1]?.trim(),
      origin_country: state[2],
      longitude: state[5],
      latitude: state[6],
      altitude: state[7]
    })).filter(p => p.latitude && p.longitude);

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter dados da OpenSky' });
  }
});

app.listen(PORT, () => console.log(`Servidor a correr na porta ${PORT}`));
