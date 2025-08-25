export default async function handler(req, res) {
  const username = process.env.OPENSKY_USERNAME;
  const password = process.env.OPENSKY_PASSWORD;

  if (!username || !password) {
    return res.status(500).json({ error: "Credenciais OpenSky em falta." });
  }

  try {
    const response = await fetch("https://opensky-network.org/api/states/all", {
      headers: {
        Authorization: "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
      },
    });

    const data = await response.json();

    // Opcional: filtrar apenas os hex codes definidos
    const hexCodes = ["407CAF", "4952CD", "4CA77F"];
    const filtered = data.states.filter(state => hexCodes.includes(state[0]?.toUpperCase()));

    res.status(200).json({ states: filtered });
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter dados da OpenSky." });
  }
}