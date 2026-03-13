#!/usr/bin/env node
/**
 * scrape-warsh.js — Generate quran-warsh.json from fawazahmed0 API
 * Output format matches quran.json: [{ surahNumber, surahNameAr, ayahs: [...] }]
 */

const fs = require("fs");
const path = require("path");

const API_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranwarsh.json";

async function main() {
  console.log("Fetching Warsh data from API...");
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch: " + res.status);
  const raw = await res.json();
  const data = raw.quran || raw;

  // data is an array of { chapter, verse, text }
  console.log("Total verses from API:", data.length);

  // Load existing quran.json to get surahNameAr
  const hafsPath = path.join(__dirname, "quran.json");
  const hafs = JSON.parse(fs.readFileSync(hafsPath, "utf-8"));
  const surahNames = {};
  hafs.forEach(function (s) { surahNames[s.surahNumber] = s.surahNameAr; });

  // Group by chapter
  const chapters = {};
  data.forEach(function (entry) {
    if (!chapters[entry.chapter]) chapters[entry.chapter] = [];
    chapters[entry.chapter].push(entry.text);
  });

  // Build output array
  var result = [];
  for (var i = 1; i <= 114; i++) {
    if (!chapters[i]) {
      console.error("ERROR: Missing surah", i);
      process.exit(1);
    }
    result.push({
      surahNumber: i,
      surahNameAr: surahNames[i] || "سورة " + i,
      ayahs: chapters[i]
    });
  }

  // Validate
  var totalAyat = result.reduce(function (sum, s) { return sum + s.ayahs.length; }, 0);
  console.log("Surahs:", result.length);
  console.log("Total ayat:", totalAyat);

  if (result.length !== 114) {
    console.error("ERROR: Expected 114 surahs, got", result.length);
    process.exit(1);
  }
  if (totalAyat !== 6236) {
    console.warn("WARNING: Expected 6236 ayat, got", totalAyat);
  }

  // Write output
  var outPath = path.join(__dirname, "quran-warsh.json");
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf-8");
  console.log("Written to", outPath, "(" + (fs.statSync(outPath).size / 1024).toFixed(0) + " KB)");

  // Show sample: Al-Fatiha verse 1 comparison
  console.log("\n--- Comparison: Al-Fatiha v1 ---");
  console.log("Hafs:  ", hafs[0].ayahs[0]);
  console.log("Warsh: ", result[0].ayahs[0]);
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
