var ALLOWED_ORIGINS = ["https://qurani.fr","https://www.qurani.fr","https://ayat-theta.vercel.app","capacitor://localhost","http://localhost","http://localhost:3000"];

export default async function handler(req, res) {
  var origin = (req.headers && req.headers.origin) || "";
  if (ALLOWED_ORIGINS.indexOf(origin) >= 0) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  var path = req.url.replace(/^\/api\/mawaqit/, "") || "/";
  if (path.indexOf("..") >= 0) return res.status(400).json({ error: "invalid path" });
  var url = "https://mawaqit.net" + path;
  try {
    var r = await fetch(url, {
      headers: { "Accept": "application/json", "X-Requested-With": "XMLHttpRequest", "User-Agent": "Qurani/3.0" }
    });
    var data = await r.text();
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
    res.status(r.status).send(data);
  } catch (e) {
    res.status(500).json({ error: "proxy error" });
  }
}
