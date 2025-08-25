import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const username = process.env.OPENSKY_USERNAME;
  const password = process.env.OPENSKY_PASSWORD;

  if (!username || !password) {
    return res.status(500).json({ error: "Credenciais OpenSky em falta." });
  }

  try {
    // Lê hexCodes.json
    const filePath = path.join(process.cwd(), "hexCodes.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    const { hexCodes } = JSON.parse(fileData);
    const hexSet = new Set(hexCodes.map(h => h.toUpperCase()));

    // Chamada à OpenSky
    const response = await fetch("https://opensky-network.org/api/states/all", {
      headers: {
        Authorization: "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
      },
    });

    const data = await response.json();
    const filtered = data.states?.filter(state => hexSet.has(state[0]?.toUpperCase())) || [];

    res.status(200).json({ states: filtered });
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter ou filtrar dados da OpenSky." });
  }
}