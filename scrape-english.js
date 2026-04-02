// Fetch English translation (Sahih International) from alquran.cloud
// → quran-en.json (same structure as quran-fr.json)

const fs = require('fs');
const https = require('https');

const BISMILLAH_EN = "In the name of Allah, the Entirely Merciful, the Especially Merciful.";

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function buildEnglish() {
  const result = [];
  const errors = [];

  for (let n = 1; n <= 114; n++) {
    process.stdout.write(`Sourate ${n}/114... `);
    try {
      const data = await fetchJson(
        `https://api.alquran.cloud/v1/surah/${n}/en.sahih`
      );
      const raw = data.data.ayahs; // [{number, text}, ...]
      let ayahs = raw.map(a => a.text);

      // For surahs other than 1 and 9: prepend Bismillah as ayahs[0]
      // to match the in-app structure (basmala split out as separate entry)
      if (n !== 1 && n !== 9) {
        ayahs = [BISMILLAH_EN, ...ayahs];
      }

      result.push({ surahNumber: n, ayahs });
      console.log(`✓ ${ayahs.length} ayahs`);
    } catch(err) {
      console.log(`✗ ERREUR: ${err.message}`);
      errors.push({ surah: n, error: err.message });
    }
    if (n < 114) await sleep(300);
  }

  if (errors.length) console.log('\nErreurs:', errors);

  // Verify counts vs quran.json
  const quran = JSON.parse(fs.readFileSync('quran.json', 'utf8'));
  let mismatches = 0;
  quran.forEach(s => {
    const en = result.find(r => r.surahNumber === s.surahNumber);
    if (!en || en.ayahs.length !== s.ayahs.length) {
      console.log(`Décalage S${s.surahNumber}: quran=${s.ayahs.length} en=${en ? en.ayahs.length : 0}`);
      mismatches++;
    }
  });
  if (mismatches === 0) console.log('\n✅ Tous les comptes correspondent!');

  fs.writeFileSync('quran-en.json', JSON.stringify(result), 'utf8');
  const kb = (fs.statSync('quran-en.json').size / 1024).toFixed(0);
  console.log(`✅ quran-en.json créé — ${result.length} sourates, ${kb} KB`);

  // Sample
  const s2 = result.find(r => r.surahNumber === 2);
  console.log('\nSample S2[0]:', s2.ayahs[0].substring(0, 80));
  console.log('Sample S2[1]:', s2.ayahs[1].substring(0, 80));
}

buildEnglish().catch(console.error);
