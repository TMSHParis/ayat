// Node.js serverless function (Vercel)
// Échange un Apple identity token natif (aud=bundle_id) contre un Firebase custom token
// Env vars requises : FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
import crypto from 'crypto';

const ALLOWED_ORIGINS = ["https://qurani.fr","https://www.qurani.fr","https://ayat-theta.vercel.app","capacitor://localhost","http://localhost","http://localhost:3000"];

function buildCors(req) {
  const origin = (req.headers && req.headers.origin) || "";
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }
  return headers;
}

let _appleKeysCache = null;
let _appleKeysCacheTime = 0;
const APPLE_KEYS_TTL = 3600000; // 1 hour

async function getApplePublicKey(kid) {
  const now = Date.now();
  if (!_appleKeysCache || now - _appleKeysCacheTime > APPLE_KEYS_TTL) {
    const res = await fetch('https://appleid.apple.com/auth/keys');
    _appleKeysCache = (await res.json()).keys;
    _appleKeysCacheTime = now;
  }
  const jwk = _appleKeysCache.find(k => k.kid === kid);
  if (!jwk) throw new Error('Apple key not found');
  return crypto.createPublicKey({ key: jwk, format: 'jwk' });
}

async function verifyAppleToken(idToken) {
  if (typeof idToken !== 'string' || idToken.length > 8192) throw new Error('Invalid token');
  const parts = idToken.split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT format');
  const header  = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
  const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
  if (!header.kid) throw new Error('Missing kid');
  if (payload.aud !== 'com.tmshparis.qurani') throw new Error('Invalid audience');
  if (payload.iss !== 'https://appleid.apple.com') throw new Error('Invalid issuer');
  const now = Date.now() / 1000;
  if (now > payload.exp) throw new Error('Token expired');
  if (payload.nbf && now < payload.nbf) throw new Error('Token not yet valid');
  const pubKey = await getApplePublicKey(header.kid);
  const verifier = crypto.createVerify('SHA256');
  verifier.update(parts[0] + '.' + parts[1]);
  if (!verifier.verify(pubKey, Buffer.from(parts[2], 'base64url'))) throw new Error('Invalid signature');
  return payload;
}

function createFirebaseCustomToken(uid, email) {
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey  = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  if (!clientEmail || !privateKey) throw new Error('Variables FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY manquantes dans Vercel');
  const now = Math.floor(Date.now() / 1000);
  const header  = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const body    = Buffer.from(JSON.stringify({
    iss: clientEmail, sub: clientEmail,
    aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
    iat: now, exp: now + 3600,
    uid: 'apple:' + uid,
    claims: { email: email || '', provider: 'apple.com' }
  })).toString('base64url');
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(header + '.' + body);
  const sig = signer.sign(privateKey, 'base64url');
  return header + '.' + body + '.' + sig;
}

export default async function handler(req, res) {
  // CORS preflight
  const cors = buildCors(req);
  Object.entries(cors).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { idToken, displayName } = req.body || {};
    if (!idToken || typeof idToken !== 'string') return res.status(400).json({ error: 'Missing token' });
    const payload     = await verifyAppleToken(idToken);
    const customToken = createFirebaseCustomToken(payload.sub, payload.email);
    res.status(200).json({ customToken, appleUid: payload.sub, email: payload.email || '', displayName: displayName || '' });
  } catch (err) {
    console.error('[apple-auth]', err.message);
    res.status(400).json({ error: 'Authentication failed' });
  }
}
