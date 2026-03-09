export default async function handler(req, res) {
  var url = "https://nominatim.openstreetmap.org" + (req.url.replace(/^\/api\/geocode/, "") || "/");
  try {
    var r = await fetch(url, {
      headers: { "User-Agent": "Qurani/3.0 (contact@tmshparis.com)", "Accept-Language": "fr,en" }
    });
    var data = await r.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
    res.status(r.status).send(data);
  } catch (e) {
    res.status(500).json({ error: "proxy error" });
  }
}
