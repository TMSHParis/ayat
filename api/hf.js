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

const ALLOWED_ORIGINS = ["https://qurani.fr","https://www.qurani.fr","https://ayat-theta.vercel.app","capacitor://localhost","http://localhost","http://localhost:3000"];

export default async function handler(req, res) {
  // CORS — restrict to known origins (Capacitor app + web)
  const origin = (req.headers && req.headers.origin) || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = process.env.HF_TOKEN;
  if (!token) return res.status(500).json({ error: "Server configuration error" });

  // Collect raw body (max 25 MB)
  const MAX_BODY = 25 * 1024 * 1024;
  let bodySize = 0;
  const chunks = [];
  try {
    await new Promise((resolve, reject) => {
      req.on("data", (chunk) => {
        bodySize += chunk.length;
        if (bodySize > MAX_BODY) { reject(new Error("too large")); return; }
        chunks.push(chunk);
      });
      req.on("end", resolve);
      req.on("error", reject);
    });
  } catch (e) {
    return res.status(413).json({ error: "Request body too large" });
  }
  const rawBody = Buffer.concat(chunks);

  if (!rawBody.length) return res.status(400).json({ error: "Empty body" });

  // Decode base64 audio from JSON body { audio: "<base64>" }
  let audioBuffer;
  try {
    const json = JSON.parse(rawBody.toString("utf8"));
    if (!json.audio) return res.status(400).json({ error: "Missing audio field in JSON body" });
    audioBuffer = Buffer.from(json.audio, "base64");
  } catch (e) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  if (!audioBuffer.length) return res.status(400).json({ error: "Empty audio after base64 decode" });

  // Forward audio to HuggingFace Inference API with Arabic language hint
  // Using JSON payload with base64 audio + generate_kwargs for language=Arabic
  try {
    const audioBase64 = audioBuffer.toString("base64");
    const payload = JSON.stringify({
      inputs: audioBase64,
      parameters: {
        generation_parameters: {
          language: "<|ar|>",
          task: "transcribe",
        },
      },
    });

    let hfResp = await fetch(`${HF_BASE}/${HF_MODEL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: payload,
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
          "Content-Type": "application/json",
        },
        body: payload,
      });
    }

    // If JSON approach returned a client error (4xx), fallback to binary audio (no language hint)
    if (hfResp.status >= 400 && hfResp.status < 500 && hfResp.status !== 429) {
      console.log("JSON approach returned " + hfResp.status + ", falling back to binary audio");
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
      console.error("[hf] non-JSON response:", text.substring(0, 200));
      return res.status(502).json({ error: "Upstream service error" });
    }

    const result = await hfResp.json();
    return res.status(hfResp.status).json(result);
  } catch (err) {
    console.error("[hf]", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
