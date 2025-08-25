export default async function handler(req, res) {
  const { hex } = req.query;

  // Verifica se o parâmetro 'hex' foi fornecido
  if (!hex) {
    return res.status(400).json({ error: 'Parâmetro "hex" em falta' });
  }

  // Usa variáveis de ambiente para proteger credenciais
  const user = process.env.OPENSKY_USER;
  const pass = process.env.OPENSKY_PASS;

  const auth = Buffer.from(`${user}:${pass}`).toString('base64');
  const url = `https://opensky-network.org/api/states/all?icao24=${hex}`;

  try {
    const resposta = await fetch(url, {
      headers: {
        Authorization: `Basic ${auth}`
      }
    });

    const dados = await resposta.json();
    res.status(200).json(dados);
  } catch (erro) {
    res.status(500).json({ error: 'Erro ao obter dados da OpenSky' });
  }
}