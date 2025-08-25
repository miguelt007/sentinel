import axios from 'axios';

export default async function handler(req, res) {
  const { hex } = req.query;
  const user = process.env.OPENSKY_USER;
  const pass = process.env.OPENSKY_PASS;

  const url = `https://opensky-network.org/api/states/all?icao24=${hex}`;

  try {
    const response = await axios.get(url, {
      auth: {
        username: user,
        password: pass
      },
      timeout: 10000 // 10 segundos
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Erro na chamada à OpenSky:", error.message);

    // Resposta mais informativa para debugging
    res.status(500).json({
      error: "Falha na ligação à OpenSky",
      details: error.code || error.message
    });
  }
}