#!/usr/bin/env node
// Export App Store screenshots — iPhone 16 Pro Max 6.9" (1320×2868px)
// Usage: node mockups/export.js
// Requires: npm install puppeteer  (une seule fois)

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const W     = 440;   // CSS px → 1320px à 3x
const H     = 956;   // CSS px → 2868px à 3x
const SCALE = 3;
const N     = 10;
const URL   = 'http://localhost:3000/mockups/';
const OUT   = path.join(__dirname, 'export');

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  console.log('🚀 Lancement Puppeteer…');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page    = await browser.newPage();

  await page.setViewport({ width: W, height: H, deviceScaleFactor: SCALE });
  await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });

  // Attendre que TOUTES les images soient chargées
  await page.waitForFunction(() => {
    const imgs = document.querySelectorAll('img');
    return imgs.length > 0 && Array.from(imgs).every(img => img.complete && img.naturalHeight > 0);
  }, { timeout: 30000 });

  // Polices Google Fonts
  await new Promise(r => setTimeout(r, 1500));

  // Sélectionner tous les slides par leur élément DOM
  const slides = await page.$$('.slide');

  for (let i = 0; i < slides.length; i++) {
    const file = path.join(OUT, `qurani-${String(i + 1).padStart(2, '0')}.png`);
    await slides[i].screenshot({ path: file });
    console.log(`  ✓ ${i + 1}/${slides.length} → ${path.basename(file)}`);
  }

  await browser.close();
  console.log(`\n✅ Export terminé → mockups/export/`);
  console.log(`   Format : ${W * SCALE} × ${H * SCALE} px (iPhone 16 Pro Max 6.9")`);
})().catch(err => { console.error('❌', err.message); process.exit(1); });
