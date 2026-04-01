export const config = { runtime: 'edge' };

const MODEL_URL = 'https://github.com/yazinsai/offline-tarteel/releases/download/v0.1.0/fastconformer_ar_ctc_q8.onnx';
const ALLOWED_ORIGINS = ["https://qurani.fr","https://www.qurani.fr","https://ayat-theta.vercel.app","capacitor://localhost","http://localhost","http://localhost:3000"];

function corsHeaders(req) {
  const origin = req.headers.get('origin') || '';
  const h = {};
  if (ALLOWED_ORIGINS.includes(origin)) {
    h['Access-Control-Allow-Origin'] = origin;
    h['Vary'] = 'Origin';
  }
  return h;
}

export default async function handler(req) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        ...corsHeaders(req),
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  try {
    const response = await fetch(MODEL_URL, {
      headers: { 'User-Agent': 'Qurani/3.0' },
    });

    if (!response.ok) {
      return new Response('Service unavailable', {
        status: 502,
        headers: corsHeaders(req),
      });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': response.headers.get('content-length') || '131652337',
        ...corsHeaders(req),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    console.error('[model]', e);
    return new Response('Service unavailable', {
      status: 502,
      headers: corsHeaders(req),
    });
  }
}
