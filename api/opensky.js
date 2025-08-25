export default async function handler(req, res) {
  const username = process.env.OPENSKY_USERNAME;
  const password = process.env.OPENSKY_PASSWORD;

  const response = await fetch("https://opensky-network.org/api/states/all", {
    headers: {
      Authorization: "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
    },
  });

  const data = await response.json();

  // Filtrar pelos hex codes
  const hexCodes = ["407CAF", "4952CD", "4CA77F"];
  const filtered = data.states.filter(state => hexCodes.includes(state[0]));

  res.status(200).json({ states: filtered });
}