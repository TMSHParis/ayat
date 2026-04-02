// Scraper phonétique — le-coran.com → quran-phonetic.json
// Usage: node scrape-phonetic.js

const fs = require('fs');
const https = require('https');

// Surah verse counts (1-indexed, includes basmala for relevant surahs)
// We'll derive from scraped data directly

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'fr-FR,fr;q=0.9'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchPage(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(parseInt(code, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function stripTags(str) {
  return str.replace(/<[^>]+>/g, '');
}

function extractPhoneticFromHtml(html, surahNum) {
  const ayahs = [];

  // Extract basmala (not for surahs 1 and 9)
  // .verset_arabe contains the basmala plain text
  if (surahNum !== 1 && surahNum !== 9) {
    const basmalaMatch = html.match(/class="verset_arabe[^"]*"[^>]*>([\s\S]*?)<\/div>/);
    if (basmalaMatch) {
      const basmalaText = decodeHtmlEntities(stripTags(basmalaMatch[1])).trim();
      if (basmalaText) ayahs.push(basmalaText);
    }
    if (ayahs.length === 0) {
      // Fallback: standard basmala
      ayahs.push('Bismi Allāhi Ar-Raĥmāni Ar-Raĥīmi');
    }
  }

  // Extract verses from span.pd-behind inside p.ayah_wrapper
  // Pattern: <p ... class="ayah_wrapper ..."> ... <span class="pd-behind">TEXT</span>
  const versePattern = /<p[^>]+class="[^"]*ayah_wrapper[^"]*"[^>]*>[\s\S]*?<span[^>]+class="[^"]*pd-behind[^"]*"[^>]*>([\s\S]*?)<\/span>/g;
  let match;
  while ((match = versePattern.exec(html)) !== null) {
    const text = decodeHtmlEntities(stripTags(match[1])).trim();
    if (text) ayahs.push(text);
  }

  return ayahs;
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function scrapeAll() {
  const result = {};
  const errors = [];

  for (let i = 1; i <= 114; i++) {
    const url = `https://www.le-coran.com/coran-en-phonetique/coran-phonetique-sourate-${i}-0.html`;
    process.stdout.write(`Sourate ${i}/114... `);

    try {
      const html = await fetchPage(url);
      const ayahs = extractPhoneticFromHtml(html, i);
      result[i] = ayahs;
      console.log(`✓ ${ayahs.length} ayahs`);
    } catch (err) {
      console.log(`✗ ERREUR: ${err.message}`);
      errors.push({ surah: i, error: err.message });
    }

    // Respectful delay between requests
    if (i < 114) await sleep(800);
  }

  if (errors.length > 0) {
    console.log('\nErreurs:', JSON.stringify(errors, null, 2));
  }

  fs.writeFileSync('quran-phonetic.json', JSON.stringify(result, null, 2), 'utf8');
  console.log('\n✅ quran-phonetic.json créé avec', Object.keys(result).length, 'sourates');

  // Verify counts
  console.log('\nVérification:');
  [1, 2, 5, 9, 36, 67, 114].forEach(n => {
    if (result[n]) console.log(`  Sourate ${n}: ${result[n].length} ayahs`);
  });
}

scrapeAll().catch(console.error);
