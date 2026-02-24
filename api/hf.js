// Vercel serverless proxy — forwards audio to HuggingFace Inference API
// The HF_TOKEN is stored as an environment variable on Vercel (never exposed to the client)

export const config = {
  api: {
    bodyParser: false, // raw binary audio — skip Vercel's body parser
  },
};

const HF_MODEL = "tarteel-ai/whisper-base-ar-quran";

export default async function handler(req, res) {
  // CORS — needed for Capacitor iOS app calling from a different origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = process.env.HF_TOKEN;
  if (!token) return res.status(500).json({ error: "HF_TOKEN not configured on server" });

  // Collect raw body (WAV audio blob)
  const chunks = [];
  await new Promise((resolve, reject) => {
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", resolve);
    req.on("error", reject);
  });
  const body = Buffer.concat(chunks);

  if (!body.length) return res.status(400).json({ error: "Empty audio body" });

  // Forward to HuggingFace
  try {
    let hfResp = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "audio/wav",
      },
      body,
    });

    // If model is loading, wait and retry once
    if (hfResp.status === 503) {
      const data = await hfResp.json();
      const wait = Math.min((data.estimated_time || 20) * 1000, 30000);
      await new Promise((r) => setTimeout(r, wait));
      hfResp = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "audio/wav",
        },
        body,
      });
    }

    const result = await hfResp.json();
    return res.status(hfResp.status).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Proxy error" });
  }
}
