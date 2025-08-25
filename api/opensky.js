import axios from 'axios';

let tokenCache = null;
let tokenExpiry = 0;

async function obterToken() {
  if (tokenCache && Date.now() < tokenExpiry) return tokenCache;

  const response = await axios.post(
    'https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token',
    new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.OPENSKY_CLIENT_ID,
      client_secret: process.env.OPENSKY_CLIENT_SECRET
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  tokenCache = response.data.access_token;
  tokenExpiry = Date.now() + 29 * 60 * 1000; // 29 minutos
  return tokenCache;
}

export default async function handler(req, res) {
  const { hex } = req.query;
  if (!hex) return res.status(400).json({ error: 'Hex code em falta' });

  try {
    const token = await obterToken();
    const resposta = await axios.get(`https://opensky-network.org/api/states/all?icao24=${hex}`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 20000
    });

    res.status(200).json(resposta.data);
  } catch (erro) {
    console.error("Erro na chamada à OpenSky:", erro.message);
    res.status(500).json({ error: "Falha na ligação à OpenSky" });
  }
}