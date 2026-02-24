// Vercel serverless proxy — forwards audio to HuggingFace Inference API
// The HF_TOKEN is stored as an environment variable on Vercel (never exposed to the client)
// Body format: JSON { audio: "<base64-encoded WAV>" }  (base64 required for Capacitor iOS compatibility)

export const config = {
  api: {
    bodyParser: false, // we parse manually to handle large base64 payloads
  },
};

// Switched to openai/whisper-large-v3 (multilingual, supports Arabic)
// Old tarteel-ai/whisper-base-ar-quran is no longer available on HF serverless inference
const HF_MODEL = "openai/whisper-large-v3";
const HF_BASE  = "https://router.huggingface.co/hf-inference/models";

export default async function handler(req, res) {
  // CORS — needed for Capacitor iOS app calling from a different origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = process.env.HF_TOKEN;
  if (!token) return res.status(500).json({ error: "HF_TOKEN not configured on server" });

  // Collect raw body
  const chunks = [];
  await new Promise((resolve, reject) => {
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", resolve);
    req.on("error", reject);
  });
  const rawBody = Buffer.concat(chunks);

  if (!rawBody.length) return res.status(400).json({ error: "Empty body" });

  // Decode base64 audio from JSON body { audio: "<base64>" }
  let audioBuffer;
  try {
    const json = JSON.parse(rawBody.toString("utf8"));
    if (!json.audio) return res.status(400).json({ error: "Missing audio field in JSON body" });
    audioBuffer = Buffer.from(json.audio, "base64");
  } catch (e) {
    return res.status(400).json({ error: "Invalid JSON body: " + e.message });
  }

  if (!audioBuffer.length) return res.status(400).json({ error: "Empty audio after base64 decode" });

  // Forward WAV binary to HuggingFace Inference API (new router endpoint)
  try {
    let hfResp = await fetch(`${HF_BASE}/${HF_MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "audio/wav",
      },
      body: audioBuffer,
    });

    // If model is loading, wait and retry once
    if (hfResp.status === 503) {
      const data = await hfResp.json();
      const wait = Math.min((data.estimated_time || 20) * 1000, 30000);
      await new Promise((r) => setTimeout(r, wait));
      hfResp = await fetch(`${HF_BASE}/${HF_MODEL}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "audio/wav",
        },
        body: audioBuffer,
      });
    }

    // Handle non-JSON responses (e.g. HTML error pages)
    const contentType = hfResp.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await hfResp.text();
      return res.status(hfResp.status).json({ error: "HF returned non-JSON: " + text.substring(0, 200) });
    }

    const result = await hfResp.json();
    return res.status(hfResp.status).json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Proxy error" });
  }
}
