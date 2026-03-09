export default async function handler(req, res) {
  var path = req.url.replace(/^\/api\/aladhan/, "") || "/";
  var url = "https://api.aladhan.com" + path;
  try {
    var r = await fetch(url, {
      headers: { "Accept": "application/json", "User-Agent": "Qurani/3.0" }
    });
    var data = await r.text();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
    res.status(r.status).send(data);
  } catch (e) {
    res.status(500).json({ error: "proxy error" });
  }
}
