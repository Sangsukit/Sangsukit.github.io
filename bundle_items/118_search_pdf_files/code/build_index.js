#!/usr/bin/env node
/* ParliamentX search index builder.
   Reads ONLY the published site files (the four site repos as they will go live) and writes a static,
   sharded search index into <hub>/search/idx/. Nothing outside the published pages is read, so nothing
   held back from the site can appear in search.

   node build_index.js --hub <sangsukit.github.io> --a69 <committee-archive-2569> --a68 <public-admin-2568> \
        --a67 <public-admin-2567> [--out <hub>/search/idx] [--dict dict.json] [--today YYYY-MM-DD]

   Output (all plain JSON, fetched piece by piece by the browser; no full download):
     manifest.json  build time, counts, shard sizes, coverage notes
     lex.json       committees, subcommittees, senators (the home page's vetted list), topics, dictionary
     meta.json      one compact row per record (type, committee, date, flags) for filters and facets
     vocab.json     every indexed word with its document count (suggestions, typo help)
     p/NN.json      word -> records with a precomputed BM25F weight and the fields it was found in
     d/NNN.json     what a result card shows (64 records per file)
   Idempotent: the same input gives the same files (sorted keys, stable ids). */
"use strict";
const fs = require("fs"), path = require("path");
const C = require("./core.js");

const A = {};
for (let i = 2; i < process.argv.length; i += 2) A[process.argv[i].replace(/^--/, "")] = process.argv[i + 1];
const HUB = A.hub, OUT = A.out || path.join(HUB, "search", "idx");
const DICT = JSON.parse(fs.readFileSync(A.dict || path.join(__dirname, "dict.json"), "utf8"));
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
const metaRowsMeeting = [];
const WEBOF = new Map();   // committee|year -> site path (the PDF text step finds meetings with it)
for (const c of DATA) {
  const ci = CIDX.get(c.id); if (ci == null) { console.warn("committee not in list:", c.id); continue; }
  const cm = CM[ci];
  for (const y of c.years) {
    const sd = siteDir(y.url); if (!sd || !fs.existsSync(path.join(sd.dir, "index.html"))) { console.warn("site missing:", y.url); continue; }
    siteCount++;
    WEBOF.set(c.id + "|" + y.year, sd.web);
    const tr = makeTr([loadJson(path.join(sd.dir, "i18n-en.json"), {}), HUB_EN]);
    if (!cm.en) cm.en = tr(cm.th);
    const pages = fs.readdirSync(sd.dir).filter(f => f === "index.html" || /^sub-[a-z0-9-]+\.html$/.test(f)).sort((a, b) => a === "index.html" ? -1 : b === "index.html" ? 1 : a < b ? -1 : 1);
    for (const pg of pages) {
      const s = read(path.join(sd.dir, pg));
      let D; try { D = rawJsonAfter(s, "const DATA="); } catch (e) { D = null; }
      if (!Array.isArray(D)) continue;
      pageCount++;
      const key = pg === "index.html" ? "" : pg.slice(4, -5);
      const desc = attr(s, /<meta name="description" content="([^"]*)"/);
      let subName = "", sub = null;
      if (key) {
        const m = /(คณะอนุกรรมาธิการ.+?)\s+ในคณะกรรมาธิการ/.exec(desc);
        subName = m ? m[1].trim() : attr(s, /<title>(.*?)<\/title>/).split(" · ")[0];
        const live = (c.sub_list || []).find(x => x.key === key);
        if (live && live.name) subName = live.name;
        sub = subOf(cm.id, key, subName, sd.web + pg, y.year, live && live.status);
        if (!sub.en) sub.en = tr(subName);
      }
      const org = [cm.th, cm.en, subName, sub ? sub.en : ""].filter(Boolean).join(" ");
      for (const m of D) {
        if (m.n == null || !m.date) continue;
        const stem = key ? key + "-" + m.n : String(m.n);
        const mpage = fs.existsSync(path.join(sd.dir, "m", stem + ".html")) ? sd.web + "m/" + stem + ".html" : sd.web + (key ? pg : "") + "#m-" + m.n;
        const ph = placeholder(m);
        const head = generic(m.headline) ? "" : m.headline;
        const titleTh = head || ("การประชุม" + (subName || cm.th) + " ครั้งที่ " + m.n + "/" + y.year);
        const titleEn = head ? tr(head) : ("Meeting " + m.n + "/" + y.year + " · " + ((sub && sub.en) || cm.en || ""));
        const items = (m.items || []).map(it => Array.isArray(it) ? it : [String(it), "", ""]);
        const summ = ph ? "" : (m.summary || "");
        const docsL = (m.docs || []).filter(d => d.url && DOCK[d.k]).sort((a, b) => (DOCO[a.k] - DOCO[b.k]));
        const vids = ((m.media || {}).videos || ((m.media || {}).video ? [m.media.video] : []));
        const vlist = [];
        for (const v of vids) {
          const pre = v.kind === "pre";
          const vstem = "v-" + (key ? key + "-" : "") + m.n + (pre ? "-pre" : "");
          const share = fs.existsSync(path.join(sd.dir, "s", vstem + ".html")) ? sd.web + "s/" + vstem + ".html" : "";
          const cap = v.vtt ? vttText(path.join(sd.dir, v.vtt)) : "";
          vlist.push({ l: v.label || (pre ? "วิดีโอก่อนการประชุม" : "วิดีโอสรุปผลการประชุม"), h: share || mpage, du: v.dur || "", k: pre ? "pre" : "post", po: v.poster ? sd.web + v.poster : "", cap });
        }
        const tags = m.tags || [];
        tags.forEach(t => { const k = C.norm(t); const e = tagCount.get(k) || { th: t, en: tr(t), n: 0, c: new Set() }; e.n++; e.c.add(cm.id); tagCount.set(k, e); });
        const en = x => tr(x);
        const f = ["", "", "", "", "", "", "", ""];
        f[0] = [titleTh, titleEn].join(" ");
        f[1] = tags.concat(tags.map(en)).join(" ");
        f[2] = items.map(it => it[0] + " " + en(it[0])).join(" ");
        f[3] = summ ? summ + " " + en(summ) : "";
        f[4] = m.chair || "";
        f[5] = org;
        f[7] = [m.chair_role || "", docsL.map(d => DOCK[d.k] + " " + DOCK_EN[d.k]).join(" "), m.agenda_only ? "ระเบียบวาระ agenda" : ""].join(" ");
        const hasSumDoc = docsL.some(d => d.k === "summary");
        coverage.meetings++;
        if (summ) coverage.with_summary_text++; else if (hasSumDoc) coverage.official_summary_only++; else coverage.upcoming_or_agenda++;
        const rec = add({
          k: "m", f, key: "m|" + sd.web + "|" + key + "|" + m.n + "|" + m.date, sumText: !!summ,
          docRef: Object.fromEntries(docsL.map(d => [((/[?&]ref=(\d+)/.exec(d.url) || [])[1] || ""), { url: d.url, k: d.k }]).filter(x => x[0])),
          disp: {
            k: "m", t: titleTh, te: titleEn, u: mpage, c: cm.id, sb: sub ? sub.i : -1, n: m.n, y: y.year, d: m.date, tm: m.time || "",
            r: (m.room || "").replace(/\s+/g, " ").trim(), s: summ, se: summ ? en(summ) : "",
            it: items.map(it => [it[0], it[1] || "", it[2] || "", en(it[0])]), tg: tags, tge: tags.map(en),
            ch: m.chair || "", cr: m.chair_role || "", cre: en(m.chair_role || ""), dk: [...new Set(docsL.map(d => d.k))], du0: docsL.length ? docsL[0].url : "", dk0: docsL.length ? docsL[0].k : "",
            v: vlist.map(v => ({ l: v.l, le: en(v.l), h: v.h, du: v.du, k: v.k })), ph: ph ? 1 : 0, ao: m.agenda_only ? 1 : 0, cx: m.cancelled ? 1 : 0,
            read: sd.web + (key ? pg : "") + "#read-" + m.n
          },
          meta: { c: ci, s: sub ? sub.i : -1, d: +m.date.replace(/-/g, ""), y: +m.date.slice(0, 4) + 543, fl: (vlist.length ? 1 : 0) | (docsL.length ? 2 : 0) | (hasSumDoc ? 4 : 0) | (m.cancelled ? 16 : 0) | (ph ? 32 : 0) | (m.agenda_only ? 64 : 0) }
        });
        for (const v of vlist) {
          coverage.videos++; if (v.cap) coverage.captions++;
          const vt = v.l + " · " + titleTh, vte = (en(v.l) || (v.k === "pre" ? "Pre-meeting video" : "Meeting summary video")) + " · " + titleEn;
          const vf = ["", "", "", "", "", "", "", ""];
          vf[0] = vt + " " + vte; vf[1] = f[1]; vf[5] = org; vf[6] = v.cap; vf[7] = "วิดีโอ video คลิป";
          add({
            k: "v", f: vf, par: rec.id, key: "v|" + sd.web + "|" + key + "|" + m.n + "|" + m.date + "|" + v.k,
            disp: { k: "v", t: vt, te: vte, u: v.h, c: cm.id, sb: sub ? sub.i : -1, n: m.n, y: y.year, d: m.date, du: v.du, vk: v.k, po: v.po, mu: mpage, cap: v.cap.slice(0, 1200), tg: tags, tge: tags.map(en) },
            meta: { c: ci, s: sub ? sub.i : -1, d: +m.date.replace(/-/g, ""), y: +m.date.slice(0, 4) + 543, fl: 1 | (docsL.length ? 2 : 0) }
          });
        }
      }
    }
  }
}

/* ---------- entities: committees, subcommittees, senators, topics ---------- */
const ent = [];
CM.forEach((c, i) => {
  const al = (DICT.committees[c.id] || { th: [], en: [] });
  const f = ["", "", "", "", "", "", "", ""];
  f[0] = [c.th, c.en, c.short, c.short_en].join(" ");
  f[1] = al.th.concat(al.en).join(" ");
  f[7] = c.kw + " คณะกรรมาธิการ กมธ committee";
  const firstYear = (DATA.find(x => x.id === c.id) || { years: [] }).years[0];
  const sd = firstYear ? siteDir(firstYear.url) : null;
  ent.push({ k: "c", key: "c|" + c.id, f, disp: { k: "c", t: c.th, te: c.en, u: c.have && sd ? sd.web : c.senate, ext: c.have ? 0 : 1, c: c.id, ic: c.icon, kw: c.kw, senate: c.senate, have: c.have ? 1 : 0 }, meta: { c: i, s: -1, d: 0, y: 0, fl: 0 } });
});
SUBS.forEach(s => {
  const ci = CIDX.get(s.cid), c = CM[ci];
  const f = ["", "", "", "", "", "", "", ""];
  f[0] = [s.th, s.en].join(" "); f[5] = [c.th, c.en].join(" "); f[7] = "คณะอนุกรรมาธิการ อนุกรรมาธิการ subcommittee";
  ent.push({ k: "s", key: "s|" + s.cid + "|" + s.key, f, disp: { k: "s", t: s.th, te: s.en, u: s.url, c: s.cid, sb: s.i, st: s.status, ys: s.years.sort() }, meta: { c: ci, s: s.i, d: 0, y: 0, fl: 0 } });
});
const PEOPLE = (HH.people || []).map(p => {
  let mask = 0; const roles = p.r || [];
  CM.forEach((c, i) => { if (roles.some(r => r.indexOf(c.short) >= 0)) mask |= (1 << i); });
  return { n: p.n, r: roles, re: roles.map(r => r.split(" · ").map(x => trHub(x) || x).join(" · ")), h: p.href, img: p.img || "", mask };
});
PEOPLE.forEach((p, pi) => {
  const f = ["", "", "", "", "", "", "", ""];
  f[0] = p.n; f[4] = p.n; f[7] = p.r.join(" ") + " " + p.re.join(" ") + " สมาชิกวุฒิสภา senator";
  const ci = CM.findIndex((c, i) => p.mask & (1 << i));
  ent.push({ k: "p", key: "p|" + C.compact(p.n), f, disp: { k: "p", t: p.n, te: p.n, u: p.h, img: p.img, r: p.r, re: p.re }, meta: { c: ci, s: pi, d: 0, y: 0, fl: 0, cm: p.mask } });
});
const TOPICS = [...tagCount.values()].filter(t => t.n >= 2).sort((a, b) => b.n - a.n || (a.th < b.th ? -1 : 1));
TOPICS.forEach(t => {
  const f = ["", "", "", "", "", "", "", ""]; f[0] = t.th + " " + t.en; f[1] = f[0];
  ent.push({ k: "t", key: "t|" + C.norm(t.th), f, disp: { k: "t", t: t.th, te: t.en, n: t.n, cs: [...t.c].sort() }, meta: { c: -1, s: -1, d: 0, y: 0, fl: 0 } });
});
/* ---------- stable ids: a record keeps its number for ever (ids.json), so a rebuild rewrites only the files of
   records that really changed (small git history, quick publishes). Removed records leave an empty slot. ---------- */
const REG_F = path.join(OUT, "ids.json");
const REG = loadJson(REG_F, { next: 0, ids: {} });
const cur = ent.concat(docs);
const byOld = new Map(docs.map(d => [d.id, d]));
const seenKey = new Set();
for (const d of cur) {
  if (seenKey.has(d.key)) { console.warn("duplicate record key, later one skipped:", d.key); d.skip = 1; continue; }
  seenKey.add(d.key);
  if (REG.ids[d.key] == null) REG.ids[d.key] = REG.next++;
}
for (const d of cur) if (d.par != null) { const p = byOld.get(d.par); d.parKey = p ? p.key : null; }
const NID = REG.next;
const all = new Array(NID).fill(null);
for (const d of cur) if (!d.skip) { d.id = REG.ids[d.key]; all[d.id] = d; }
for (const d of cur) if (d.parKey) d.par = REG.ids[d.parKey];
const live = all.filter(Boolean);

/* ---------- BM25F (the idf part is added in the browser from the list length, so adding records does not
   rewrite every list). Average field lengths are kept in params.json and only refreshed when they drift. ---------- */
const N = live.length;
const dtf = new Map();
for (const d of live) dtf.set(d.id, d.f.map(txt => {
  const t = C.terms(txt, STOP);
  const m = new Map(); for (const w of t.words) m.set(w, (m.get(w) || 0) + 1); for (const p of t.pairs) m.set(p, (m.get(p) || 0) + 1);
  return { m, len: t.words.length, words: t.words };
}));
const avgNow = new Array(8).fill(0), cnt = new Array(8).fill(0);
dtf.forEach(fs_ => fs_.forEach((x, i) => { if (x.len) { avgNow[i] += x.len; cnt[i]++; } }));
for (let i = 0; i < 8; i++) avgNow[i] = cnt[i] ? avgNow[i] / cnt[i] : 1;
const PAR_F = path.join(OUT, "params.json");
let PAR = loadJson(PAR_F, null);
if (!PAR || A.reparam || PAR.avg.some((a, i) => Math.abs(a - avgNow[i]) / Math.max(1, avgNow[i]) > 0.15)) PAR = { avg: avgNow.map(x => +x.toFixed(2)), W, B, K1, set: new Date().toISOString().slice(0, 10) };
const avg = PAR.avg;
const df = new Map(), nonName = new Set(), isWord = new Set();
dtf.forEach((fs_, id) => { const seen = new Set(); const pd = all[id].k === "p"; fs_.forEach((x, fi) => { x.m.forEach((v, t) => { seen.add(t); if (fi !== 4 && !pd) nonName.add(t); }); x.words.forEach(w => isWord.add(w)); }); seen.forEach(t => df.set(t, (df.get(t) || 0) + 1)); });
const post = new Map();
const MAXDF = Math.floor(N * 0.5);
[...dtf.keys()].sort((a, b) => a - b).forEach(id => {
  const acc = new Map();
  dtf.get(id).forEach((x, fi) => x.m.forEach((tf, t) => {
    const nl = 1 - B[fi] + B[fi] * (x.len / avg[fi]);
    const a = acc.get(t) || { w: 0, mask: 0 }; a.w += W[fi] * tf / nl; a.mask |= (1 << fi); acc.set(t, a);
  }));
  acc.forEach((a, t) => {
    if (df.get(t) > MAXDF) return;
    const sc = Math.max(1, Math.round(100 * a.w / (K1 + a.w)));
    let L = post.get(t); if (!L) post.set(t, L = []); L.push(id, sc * 256 + a.mask);
  });
});

/* ---------- write (a file is rewritten only when its content changed; stale files are removed) ---------- */
const written = new Set();
function writeJson(f, o) {
  const s = JSON.stringify(o); fs.mkdirSync(path.dirname(f), { recursive: true });
  written.add(path.resolve(f));
  let old = null; try { old = fs.readFileSync(f, "utf8"); } catch (e) {}
  if (old !== s) fs.writeFileSync(f, s);
  return Buffer.byteLength(s);
}
const pad = (n, w) => String(n).padStart(w, "0");
const shards = Array.from({ length: P_SHARDS }, () => ({}));
[...post.keys()].sort().forEach(t => {
  const L = post.get(t), o = []; let prev = 0;
  for (let i = 0; i < L.length; i += 2) { o.push(L[i] - prev, L[i + 1]); prev = L[i]; }
  shards[C.hash(t) % P_SHARDS][t] = o;
});
let pBytes = 0, pMax = 0;
shards.forEach((s, i) => { const b = writeJson(path.join(OUT, "p", pad(i, 3) + ".json"), s); pBytes += b; pMax = Math.max(pMax, b); });
// card data: Thai in d/, English in e/ (fetched only when the reader chose English)
const EN_KEYS = ["te", "se", "tge", "cre", "re"];
let dBytes = 0, dMax = 0, eBytes = 0;
for (let i = 0; i < NID; i += D_PER) {
  const sl = all.slice(i, i + D_PER);
  const th = sl.map(d => { if (!d) return null; const o = {}; for (const k in d.disp) if (EN_KEYS.indexOf(k) < 0) o[k] = d.disp[k]; if (o.it) o.it = o.it.map(x => x.slice(0, 3)); if (o.v) o.v = o.v.map(v => { const w = Object.assign({}, v); delete w.le; return w; }); return o; });
  const en = sl.map(d => { if (!d) return null; const o = {}; for (const k of EN_KEYS) if (d.disp[k] != null && d.disp[k] !== "") o[k] = d.disp[k]; if (d.disp.it) o.it = d.disp.it.map(x => x[3] || ""); if (d.disp.v) o.v = d.disp.v.map(v => v.le || ""); return o; });
  const b = writeJson(path.join(OUT, "d", pad(i / D_PER, 3) + ".json"), th); dBytes += b; dMax = Math.max(dMax, b);
  eBytes += writeJson(path.join(OUT, "e", pad(i / D_PER, 3) + ".json"), en);
}
const TYPES = { c: 0, s: 1, p: 2, t: 3, m: 4, v: 5 };
const meta = { k: [], c: [], s: [], d: [], y: [], fl: [], par: [], cm: [], n: [] };
all.forEach(d => {
  if (!d) { meta.k.push(-1); meta.c.push(-1); meta.s.push(-1); meta.d.push(0); meta.y.push(0); meta.fl.push(0); meta.par.push(-1); meta.cm.push(0); meta.n.push(0); return; }
  meta.n.push(d.disp.n && (d.k === "m" || d.k === "v") ? d.disp.n : 0);
  meta.k.push(TYPES[d.k]); meta.c.push(d.meta.c); meta.s.push(d.meta.s); meta.d.push(d.meta.d); meta.y.push(d.meta.y); meta.fl.push(d.meta.fl);
  meta.par.push(d.par == null ? -1 : d.par); meta.cm.push(d.meta.cm || (d.meta.c >= 0 ? (1 << d.meta.c) : 0));
});
const mBytes = writeJson(path.join(OUT, "meta.json"), meta);
// word list: v/ = by the first two letters (suggestions while typing), f/ = by length (typo help), never one big file
const vt = [...df.keys()].sort((a, b) => df.get(b) - df.get(a) || (a < b ? -1 : 1));
const vs = Array.from({ length: V_SHARDS }, () => []), fl = {};
for (const t of vt) {
  const n = df.get(t), nm = nonName.has(t) ? 0 : 1;
  vs[C.hash(t.slice(0, 2)) % V_SHARDS].push(nm ? [t, n, 1] : [t, n]);
  if (t.length >= 3 && (n >= 2 || isWord.has(t)) && !/^\d+$/.test(t)) { const L = Math.min(t.length, 30); (fl[L] = fl[L] || []).push(nm ? [t, n, 1] : [t, n]); }
}
let vBytes = 0; vs.forEach((s, i) => { vBytes += writeJson(path.join(OUT, "v", pad(i, 3) + ".json"), s); });
Object.keys(fl).forEach(L => { vBytes += writeJson(path.join(OUT, "f", pad(L, 2) + ".json"), fl[L]); });
const lex = {
  committees: CM.map(c => ({ id: c.id, th: c.th, en: c.en, short: c.short, short_en: c.short_en, have: c.have ? 1 : 0, ic: c.icon, senate: c.senate })),
  subs: SUBS.map(s => ({ cid: s.cid, key: s.key, th: s.th, en: s.en, u: s.url, st: s.status })),
  people: PEOPLE.map(p => ({ n: p.n, r: p.r, re: p.re, h: p.h, img: p.img, m: p.mask })),
  topics: TOPICS.slice(0, 600).map(t => [t.th, t.en, t.n]),
  dict: { abbr: DICT.abbr, concepts: DICT.concepts, committees: DICT.committees, stop_th: DICT.stop_th, stop_en: DICT.stop_en, intent: DICT.intent },
  types: Object.keys(TYPES)
};
const lBytes = writeJson(path.join(OUT, "lex.json"), lex);
writeJson(PAR_F, PAR);
writeJson(REG_F, REG);
/* ---------- text inside the Senate's official PDF files (x/): from the text cache made by pdf/extract.py.
   Only files the site links (public, Rpublic 1); scanned files with no text layer are left out and counted.
   Site summaries already hold the summary text, so a summary PDF is indexed only for meetings without one.
   No notices (their agenda is already in the meeting record). Excerpts are kept only for summary PDFs. ---------- */
// Rebuilt only when asked (--pdf <cache>), e.g. by the weekly run: the PDF lists are big, so an ordinary bundle
// keeps them as they are (meeting ids are stable, see ids.json) instead of rewriting ~40 MB every time.
let XMAN = null;
const XCACHE = A.pdf;
if (!XCACHE) {
  const om = loadJson(path.join(OUT, "manifest.json"), {});
  if (om.x && fs.existsSync(path.join(OUT, "x", "meta.json"))) { XMAN = om.x; coverage.pdf_fulltext = om.x.N; }
} else if (fs.existsSync(XCACHE)) {
  let raw = fs.readFileSync(XCACHE); if (/\.gz$/.test(XCACHE)) raw = require("zlib").gunzipSync(raw);
  const mByKey = new Map(); for (const d of live) if (d.k === "m") mByKey.set(d.key, d);
  const XK = { summary: 0, minutes: 1, doc: 2, brief: 3 };
  const xs = { files: 0, scanned: 0, errors: 0, not_linked: 0, summary_dup: 0, used: 0, pages: 0 };
  const xd = [], seenRef = new Set();
  for (const line of raw.toString("utf8").split("\n")) {
    if (!line) continue; let r; try { r = JSON.parse(line); } catch (e) { continue; }
    if (XK[r.k] == null || seenRef.has(r.ref)) continue;
    seenRef.add(r.ref); xs.files++;
    if (r.err) { xs.errors++; continue; }
    if (r.scanned || !r.pages || !r.pages.length) { xs.scanned++; continue; }
    const web = WEBOF.get(r.c + "|" + r.y);
    const m = web && mByKey.get("m|" + web + "|" + r.key + "|" + r.n + "|" + r.date);
    const link = m && m.docRef[r.ref];
    if (!link) { xs.not_linked++; continue; }
    if (r.k === "summary" && m.sumText) { xs.summary_dup++; continue; }
    xd.push({ mid: m.id, k: XK[r.k], np: r.np || r.pages.length, url: link.url, ref: +r.ref, pages: r.pages, nq: r.nq || [] });
  }
  xd.sort((a, b) => a.ref - b.ref);   // Senate file numbers only grow: new files go to the end, old shards stay as they are
  xs.used = xd.length;
  const XN = xd.length, XB = 0.75, XMAXDF = Math.max(50, Math.floor(XN * 0.4)), X_SHARDS = 2048, X_PER = 64;
  const xtf = xd.map(d => {
    const m = new Map(); let len = 0;
    // some Thai fonts map the glyph of า to ำ (นำงสำว): when ำ outnumbers า, index the repaired text as well
    const all_ = d.pages.join(""), am = (all_.match(/\u0e33/g) || []).length, aa = (all_.match(/\u0e32/g) || []).length;
    const bad = am > 20 && am > 1.2 * aa; if (bad) xs.fixed_sara_am = (xs.fixed_sara_am || 0) + 1;
    d.pages.forEach((pg0, pi) => {
      const pg = bad ? pg0 + "\n" + pg0.replace(/\u0e33/g, "\u0e32") : pg0;
      const t = C.terms(pg, STOP); len += bad ? t.words.length / 2 : t.words.length; xs.pages++;
      const add = (w, pr) => { const a = m.get(w); if (a) { a.tf++; if (!pr) a.pr = 0; } else m.set(w, { tf: 1, pg: pi + 1, pr: pr ? 1 : 0 }); };
      t.words.forEach(w => add(w, 0)); t.pairs.forEach(w => add(w, 1));
    });
    return { m, len };
  });
  const xs_pairOnly = new Set(); xtf.forEach(x => x.m.forEach((v, t) => { if (v.pr) xs_pairOnly.add(t); }));
  xtf.forEach(x => x.m.forEach((v, t) => { if (!v.pr) xs_pairOnly.delete(t); }));
  const xavg = xtf.reduce((a, x) => a + x.len, 0) / Math.max(1, XN);
  const xdf = new Map(); xtf.forEach(x => x.m.forEach((v, t) => xdf.set(t, (xdf.get(t) || 0) + 1)));
  const xpost = new Map();
  xtf.forEach((x, id) => {
    const nl = 1 - XB + XB * (x.len / xavg);
    x.m.forEach((v, t) => {
      const n = xdf.get(t); if (n > XMAXDF) return;
      if (n < 2 && v.pr) return;   // a word pair seen in one file only: noise, and most of the size
      const w = v.tf / nl, sc = Math.max(1, Math.round(100 * w / (K1 + w)));
      let L = xpost.get(t); if (!L) xpost.set(t, L = []); L.push(id, sc * 64 + Math.min(v.pg, 63));
    });
  });
  const xsh = Array.from({ length: X_SHARDS }, () => ({}));
  [...xpost.keys()].sort().forEach(t => { const L = xpost.get(t), o = []; let prev = 0; for (let i = 0; i < L.length; i += 2) { o.push(L[i] - prev, L[i + 1]); prev = L[i]; } xsh[C.hash(t) % X_SHARDS][t] = o; });
  // many small files: a search fetches only the few lists of its own words (a phone should not download megabytes)
  let xpB = 0, xpMax = 0; xsh.forEach((sh, i) => { const b = writeJson(path.join(OUT, "x", "p", pad(i, 4) + ".json"), sh); xpB += b; xpMax = Math.max(xpMax, b); });
  let xdB = 0, xsB = 0;
  for (let i = 0; i < XN; i += X_PER) xdB += writeJson(path.join(OUT, "x", "d", pad(i / X_PER, 3) + ".json"), xd.slice(i, i + X_PER).map(d => ({ k: d.k, np: d.np, u: d.url })));
  // summary PDFs only (meetings with no easy-read text on the site): short page text for the excerpt, one file each
  // (pages that the legal rules flag, see pdf/redact.py, are left empty: searchable, never quoted)
  xd.forEach((d, i) => { if (d.k === 0) xsB += writeJson(path.join(OUT, "x", "s", i + ".json"), d.pages.map((p, pi) => d.nq.indexOf(pi) >= 0 ? "" : p.slice(0, 1200))); });
  const xmB = writeJson(path.join(OUT, "x", "meta.json"), { m: xd.map(d => d.mid), k: xd.map(d => d.k) });
  XMAN = { N: XN, shards: X_SHARDS, per: X_PER, maxdf: XMAXDF, terms: xpost.size, stats: xs,
    common: [...xdf.keys()].filter(t => xdf.get(t) > XMAXDF && !xs_pairOnly.has(t)).sort(),
    kinds: Object.keys(XK).reduce((o, k) => (o[k] = xd.filter(d => d.k === XK[k]).length, o), {}),
    bytes: { postings: xpB, postings_max_file: xpMax, docs: xdB, summaries: xsB, meta: xmB } };
  coverage.pdf_fulltext = XN;
}
const manifest = {
  v: 1, N, NID, shards: P_SHARDS, per: D_PER, vshards: V_SHARDS, flens: Object.keys(fl).map(Number), k1: K1, maxdf: MAXDF,
  sites: siteCount, pages: pageCount,
  counts: { committees: CM.length, subcommittees: SUBS.length, senators: PEOPLE.length, topics: TOPICS.length, meetings: coverage.meetings, videos: coverage.videos },
  coverage, terms: post.size, vocab: vt.length, common: [...df.keys()].filter(t => df.get(t) > MAXDF).sort(),
  bytes: { postings: pBytes, postings_max_file: pMax, docs: dBytes, docs_max_file: dMax, docs_en: eBytes, meta: mBytes, vocab: vBytes, lex: lBytes },
  x: XMAN,
  data: require("crypto").createHash("sha1").update(JSON.stringify([meta, Object.keys(REG.ids).length, post.size, vt.length, XMAN && [XMAN.N, XMAN.terms, XMAN.bytes]])).digest("hex").slice(0, 10),
  note: XMAN ? "Searches the site's own summaries, agenda items, keywords, chairs, video captions and English translations, plus the text layer of the Senate's public PDF files the site links (scanned files without a text layer are not searched)." : "Searches the site's own summaries, agenda items, keywords, chairs, video captions and English translations. The text inside the Senate's PDF files is not searched yet."
};
// "built" changes only when the data changed (no churn from rebuilding the same content)
const oldM = loadJson(path.join(OUT, "manifest.json"), {});
manifest.built = oldM.data === manifest.data && oldM.built ? oldM.built : new Date().toISOString();
writeJson(path.join(OUT, "manifest.json"), manifest);
// remove files from earlier builds that this build did not write
(function sweep(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const p = path.resolve(dir, f), st = fs.statSync(p);
    if (st.isDirectory()) { if (!(f === "x" && path.resolve(dir) === path.resolve(OUT) && !XCACHE)) sweep(p); } else if (/\.json$/.test(f) && !written.has(p)) fs.unlinkSync(p);
  }
})(OUT);
console.log(JSON.stringify(manifest, null, 1));
