// Known-item test for PDF text: take a phrase from a random indexed PDF page, search it, and check that the
// file's meeting is in the top 10. Usage: node eval/pdf_known_item.js <idx dir> <cache.jsonl.gz> [n]
const fs = require("fs"), path = require("path"), zlib = require("zlib");
const C = require("../core.js"), E = require("../engine.js");
const IDX = process.argv[2], CACHE = process.argv[3], NQ = +(process.argv[4] || 60);
const load = u => Promise.resolve(JSON.parse(fs.readFileSync(path.join(IDX, u.split("?")[0]), "utf8")));
(async () => {
  const eng = new E({ base: "", fetchJSON: load, today: "2026-11-16" }); await eng.init();
  const XM = JSON.parse(fs.readFileSync(path.join(IDX, "x/meta.json"), "utf8"));
  const recs = zlib.gunzipSync(fs.readFileSync(CACHE)).toString().split("\n").filter(Boolean).map(JSON.parse);
  const byRef = new Map(recs.map(r => [r.ref, r]));
  // file order in x/ = sorted by ref, same filter as the build: rebuild the list from x/d urls
  const per = eng.man.x.per; const xd = [];
  for (let i = 0; i < eng.man.x.N; i += per) xd.push(...JSON.parse(fs.readFileSync(path.join(IDX, "x/d", String(i / per).padStart(3, "0") + ".json"), "utf8")));
  let seed = 7; const rnd = n => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return (((t ^ (t >>> 14)) >>> 0) % n); };
  let hit1 = 0, hit10 = 0, n = 0, rows = [], tries = 0; const used = new Set();
  while (n < NQ && tries++ < 20000) {
    const x = rnd(xd.length), ref = (/[?&]ref=(\d+)/.exec(xd[x].u) || [])[1], r = byRef.get(ref); if (!r || !r.pages) continue;
    const pg = r.pages[rnd(r.pages.length)]; const words = C.terms(pg, null).words.filter(w => /^[ก-๛]{3,}$/.test(w));
    if (words.length < 20) continue;
    const i = rnd(words.length - 3); const qw = words.slice(i, i + 2 + rnd(2));
    const dfs = await Promise.all(qw.map(w => eng.xpostings([w]).then(m => m.has(w) ? m.get(w).length / 2 : 0)));
    if (!dfs.some(d => d > 0 && d <= 5)) continue;
    const real = await eng.postings(qw);   // only real words (ones the site's own text also uses): no broken-text fragments
    if (!qw.every(w => real.has(w) || eng.stop.has(w))) continue;
    const q = qw.join(""); if (used.has(q)) continue; used.add(q);
    const res = await eng.search(q); const pos = res.ids.indexOf(XM.m[x]);
    n++; if (pos === 0) hit1++; if (pos >= 0 && pos < 10) hit10++;
    rows.push(`${pos >= 0 && pos < 10 ? "ok " : "-- "} ${["sum", "min", "doc", "brief"][xd[x].k]} pos ${pos} / ${res.total}  ${q}`);
  }
  console.log(rows.join("\n")); console.log(`\nPDF known-item: ${n} phrases, found at #1 ${hit1} (${(hit1 / n).toFixed(2)}), in top 10 ${hit10} (${(hit10 / n).toFixed(2)})`);
})();
