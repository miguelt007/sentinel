export default async function handler(req, res) {
  const hex = req.query.hex;
  const user = process.env.OPENSKY_USER;
  const pass = process.env.OPENSKY_PASS;

  console.log("Hex recebido:", hex);
  console.log("Credenciais:", user ? "OK" : "Faltam", pass ? "OK" : "Faltam");

  const auth = Buffer.from(`${user}:${pass}`).toString('base64');
  const url = `https://opensky-network.org/api/states/all?icao24=${hex}`;

  try {
    const resposta = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` }
    });

    console.log("Status da resposta:", resposta.status);

    if (!resposta.ok) {
      throw new Error(`Erro da API: ${resposta.status}`);
    }

    const dados = await resposta.json();
    res.status(200).json(dados);
  } catch (erro) {
    console.error("Erro na função /api/opensky:", erro);
    res.status(500).json({ error: "Erro ao obter dados da OpenSky" });
  }
}