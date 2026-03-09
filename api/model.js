export const config = { runtime: 'edge' };

const MODEL_URL = 'https://github.com/yazinsai/offline-tarteel/releases/download/v0.1.0/fastconformer_ar_ctc_q8.onnx';

export default async function handler(req) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
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
      return new Response('Model fetch failed: ' + response.status, {
        status: response.status,
        headers: { 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': response.headers.get('content-length') || '131652337',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    return new Response('Proxy error: ' + e.message, {
      status: 502,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}
