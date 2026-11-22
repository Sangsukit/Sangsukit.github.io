#!/usr/bin/env node
/* List every official document link on the published committee pages (for the PDF text search).
   OUT=docs.json node pdf/inventory.js --hub <sangsukit.github.io> --a69 <committee-archive-2569> --a68 <public-admin-2568> --a67 <public-admin-2567> */
"use strict";
const fs = require("fs"), path = require("path");
const C = require(path.join(__dirname, "..", "core.js"));

const A = {};
for (let i = 2; i < process.argv.length; i += 2) A[process.argv[i].replace(/^--/, "")] = process.argv[i + 1];
const HUB = A.hub, OUT = A.out || path.join(HUB, "search", "idx");
const DICT = JSON.parse(fs.readFileSync(A.dict || path.join(__dirname, "..", "dict.json"), "utf8"));
const REPOS = { "committee-archive-2569": A.a69, "public-admin-2568": A.a68, "public-admin-2567": A.a67 };
if (!HUB || !fs.existsSync(path.join(HUB, "index.html"))) { console.error("--hub <sangsukit.github.io> is required"); process.exit(2); }

const P_SHARDS = 256, D_PER = 16, V_SHARDS = 128;
const FIELDS = ["title", "tags", "items", "summary", "people", "org", "captions", "extra"];
const W = [3.0, 2.2, 1.6, 1.0, 1.5, 0.35, 0.7, 0.6];
const B = [0.5, 0.3, 0.6, 0.75, 0.3, 0.3, 0.75, 0.5];
const K1 = 1.2;
const STOP = new Set(DICT.stop_th.concat(DICT.stop_en).map(w => C.norm(w)));
const DOCK = { summary: "สรุปผลการประชุม", notice: "หนังสือนัดประชุม", minutes: "บันทึกการประชุม", agenda: "ระเบียบวาระในระบบรัฐสภา", doc: "เอกสารประกอบ", brief: "เอกสารผู้ชี้แจง" };
const DOCK_EN = { summary: "meeting summary", notice: "meeting notice", minutes: "minutes", agenda: "agenda", doc: "supporting document", brief: "briefing document" };
const DOCO = { summary: 0, notice: 1, agenda: 2, minutes: 3, doc: 4, brief: 5 };

const read = f => fs.readFileSync(f, "utf8");
function rawJsonAfter(s, marker) {
  const i = s.indexOf(marker); if (i < 0) return null;
  let j = s.indexOf("=", i) + 1; while (/\s/.test(s[j])) j++;
  // walk the JSON literal
  let depth = 0, inS = false, esc = false, k = j;
  for (; k < s.length; k++) {
    const ch = s[k];
    if (inS) { if (esc) esc = false; else if (ch === "\\") esc = true; else if (ch === '"') inS = false; continue; }
    if (ch === '"') inS = true; else if (ch === "[" || ch === "{") depth++; else if (ch === "]" || ch === "}") { depth--; if (!depth) { k++; break; } }
  }
  return JSON.parse(s.slice(j, k));
}
const attr = (s, re) => { const m = re.exec(s); return m ? m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">") : ""; };

/* ---------- English from the site's own translation cache (same rule as the site's language switch) ---------- */
function i18nNorm(s) {
  s = s.replace(/[๐-๙]/g, c => String("๐๑๒๓๔๕๖๗๘๙".indexOf(c))).replace(/\s+/g, " ").trim(); const n = [];
  s = s.replace(/\d+(?:[.,:]\d+)*/g, m => { n.push(m); return "{" + (n.length - 1) + "}"; }); return [s, n];
}
function makeTr(dicts) {
  return s => {
    if (!s || !/[฀-๿]/.test(s)) return s || "";
    const [k, n] = i18nNorm(s);
    for (const d of dicts) {
      const t = d[k];
      if (t != null) return t.replace(/\{(\d+)(\|ce)?\}/g, (m, i, ce) => { const v = n[+i]; if (v == null) return ""; return ce ? String(parseInt(v.replace(/,/g, ""), 10) - 543) : v; });
    }
    return "";
  };
}
const loadJson = (f, dflt) => { try { return JSON.parse(read(f)); } catch (e) { return dflt; } };
const HUB_EN = loadJson(path.join(HUB, "i18n-en.json"), {});

/* ---------- the home page: committees, senators, which sites exist ---------- */
const home = read(path.join(HUB, "index.html"));
const HH = rawJsonAfter(home, "const HH =");
const DATA = rawJsonAfter(home, "const DATA =");
if (!HH || !DATA) { console.error("home page data (HH / DATA) not found"); process.exit(3); }
const trHub = makeTr([HUB_EN]);
const CM = HH.cm.map(c => {
  const id = c.id || c.fid; // committees not on the site yet: their follow key (s<portal>)
  return { id, have: !!c.have, th: c.name, en: trHub(c.name) || trHub(c.short), short: c.short, short_en: trHub(c.short), senate: c.senate, icon: c.icon, kw: c.kw || "", fid: c.fid };
});
const CIDX = new Map(CM.map((c, i) => [c.id, i]));

function siteDir(url) {
  // 'agriculture/2569/' -> hub dir; 'https://parliamentx.com/committee-archive-2569/' -> that repo
  const m = /^https:\/\/parliamentx\.com\/([^/]+)\/(.*)$/.exec(url);
  if (m) { const r = REPOS[m[1]]; return r ? { dir: path.join(r, m[2]), web: "/" + m[1] + "/" + m[2] } : null; }
  return { dir: path.join(HUB, url), web: "/" + url.replace(/^\/+/, "") };
}

/* ---------- records ---------- */
const docs = [];      // {k, f:[8 texts], disp:{...}, meta:{...}}
function add(rec) { rec.id = docs.length; docs.push(rec); return rec; }
const subIdx = new Map(), SUBS = [];
function subOf(cid, key, th, url, year, status) {
  const k = cid + "/" + key;
  let s = subIdx.get(k);
  if (!s) { s = { i: SUBS.length, cid, key, th, en: "", url, years: [], status: status || "old" }; SUBS.push(s); subIdx.set(k, s); }
  if (year && s.years.indexOf(year) < 0) s.years.push(year);
  if (year && (!s.ly || year > s.ly)) { s.ly = year; s.url = url; if (th) s.th = th; }
  if (status === "current") s.status = "current";
  return s;
}
const tagCount = new Map();
const placeholder = m => !!m.pending || /^การประชุมครั้งที่\s*\d+/.test(m.headline || "") && /(เปิดอ่านสรุปผล|ยังไม่ได้เผยแพร่สรุปผล)/.test(m.summary || "");
const generic = h => !h || /^การประชุมครั้งที่\s*\d+/.test(h);
const vttText = f => { try { return read(f).split(/\r?\n/).filter(l => l && !/-->/.test(l) && !/^(WEBVTT|NOTE|\d+$)/.test(l.trim())).join(" ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(); } catch (e) { return ""; } };

let siteCount = 0, pageCount = 0;
const coverage = { meetings: 0, with_summary_text: 0, official_summary_only: 0, upcoming_or_agenda: 0, videos: 0, captions: 0, pdf_fulltext: 0 };
const out=[];
for (const c of DATA) { const ci=CIDX.get(c.id); if(ci==null) continue;
 for (const y of c.years) { const sd=siteDir(y.url); if(!sd||!fs.existsSync(path.join(sd.dir,"index.html"))) continue;
  const pages=fs.readdirSync(sd.dir).filter(f=>f==="index.html"||/^sub-[a-z0-9-]+\.html$/.test(f));
  for (const pg of pages){ let D; try{D=rawJsonAfter(read(path.join(sd.dir,pg)),"const DATA=");}catch(e){D=null}
   if(!Array.isArray(D)) continue; const key=pg==="index.html"?"":pg.slice(4,-5);
   for(const m of D){ if(m.n==null||!m.date) continue; for(const d of (m.docs||[])) if(d.url) out.push({c:c.id,y:y.year,key,n:m.n,date:m.date,k:d.k,url:d.url,hasSum:!!(m.summary&&m.summary.length>40)}); } } } }
fs.writeFileSync(process.env.OUT, JSON.stringify(out));
const by={}; for(const d of out){ const h=(d.url.match(/^https?:\/\/([^/]+)/)||[0,'rel'])[1]; const k=d.k+' '+h; by[k]=(by[k]||0)+1; }
console.log(out.length, 'doc links;', new Set(out.map(d=>d.url)).size,'unique'); console.log(by);
