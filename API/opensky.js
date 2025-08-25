export default async function handler(req, res) {
  const hex = req.query.hex;
  if (!hex) return res.status(400).json({ error: 'Hex code em falta' });

  const auth = Buffer.from(`${process.env.OPENSKY_USER}:${process.env.OPENSKY_PASS}`).toString('base64');
  const url = `https://opensky-network.org/api/states/all?icao24=${hex}`;

  try {
    const resposta = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` }
    });
    const dados = await resposta.json();
    res.status(200).json(dados);
  } catch (erro) {
    res.status(500).json({ error: 'Erro ao obter dados da OpenSky' });
  }
}
