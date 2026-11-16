/* ParliamentX search core: text normalisation, Thai-aware tokenising and query understanding.
   One file for both sides: the index builder (Node, archive/search/build_index.js) and the browser
   (parliamentx.com/search/core.js), so the words in the index and the words of a query are cut the same way.
   Thai words are cut with the Unicode/ICU word dictionary (Intl.Segmenter "th"), the same engine in Node and in
   phone browsers; old browsers without it fall back to longest-match against the index's own word list.
   No network, no storage, no tracking. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.PXCore = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const TH_DIG = "๐๑๒๓๔๕๖๗๘๙";
  const THL = "ก-ฮะ-ฺเ-ๅ็-๎"; // Thai letters, vowels, tone marks (not ฯ ๆ ๏)
  const RUN = new RegExp("[" + THL + "]+|[a-z0-9]+(?:[.'\\-][a-z0-9]+)*", "g");
  const IS_TH = new RegExp("^[" + THL + "]");
  let SEG = null;
  try { SEG = new Intl.Segmenter("th", { granularity: "word" }); } catch (e) { SEG = null; }

  /* ---------- normalising ---------- */
  function norm(s) {
    s = String(s == null ? "" : s);
    if (s.normalize) s = s.normalize("NFC");
    s = s.replace(/[​-‍⁠﻿­]/g, "")           // zero-width characters
      .replace(/[๐-๙]/g, c => String(TH_DIG.indexOf(c)))               // Thai digits = Arabic digits
      .replace(/ํา/g, "ำ")                                // นิคหิต + า = สระอำ
      .replace(/เเ/g, "แ")                                                // two เ typed for แ
      .replace(/[“”«»„]/g, '"').replace(/[‘’`´]/g, "'").replace(/[‐‑‒–—―−]/g, "-")
      .toLowerCase()
      .replace(new RegExp("([" + THL + "])\\.", "g"), "$1")              // ส.ว. -> สว, พ.ร.บ. -> พรบ (dots in Thai abbreviations)
      .replace(/\bpm\s*2[.,]?5\b/g, "pm2.5").replace(/\bpm25\b/g, "pm2.5")
      .replace(/\s+/g, " ").trim();
    return s;
  }
  // a key without spaces, for comparing names and phrases ("ส ว" = "สว", "แผ่น ดิน" = "แผ่นดิน")
  const compact = s => norm(s).replace(/[\s"'()\[\],:;!?·•\/|]+/g, "");

  /* ---------- English: a light, predictable stemmer (meetings = meeting, floods/flooding = flood) ---------- */
  function stemEn(w) {
    if (w.length <= 3 || /\d/.test(w)) return w;
    if (w.endsWith("'s")) w = w.slice(0, -2);
    if (/ies$/.test(w) && w.length > 4) return w.slice(0, -3) + "y";
    if (/(sses|ches|shes|xes|zes)$/.test(w)) return w.slice(0, -2);
    if (/(ss|us|is)$/.test(w)) return w;
    if (/s$/.test(w)) w = w.slice(0, -1);
    const dbl = x => (/([^aeiou])\1$/.test(x) && !/(ll|ss|zz)$/.test(x)) ? x.slice(0, -1) : x;
    if (/ing$/.test(w) && w.length > 5) return dbl(w.slice(0, -3));
    if (/ed$/.test(w) && w.length > 4) return dbl(w.slice(0, -2));
    return w;
  }

  /* ---------- Thai word cutting ---------- */
  // fallback for browsers without Intl.Segmenter: longest match against the index word list (has(term) -> bool)
  function dpSeg(run, has) {
    if (!has) return [run];
    const n = run.length, best = new Array(n + 1).fill(null);
    best[0] = { unk: 0, cnt: 0, prev: -1 };
    for (let i = 0; i < n; i++) {
      if (!best[i]) continue;
      for (let j = Math.min(n, i + 20); j > i; j--) {
        const w = run.slice(i, j), known = has(w), unk = best[i].unk + (known ? 0 : j - i), cnt = best[i].cnt + 1;
        if (!known && j - i > 1) continue;
        const b = best[j];
        if (!b || unk < b.unk || (unk === b.unk && cnt < b.cnt)) best[j] = { unk, cnt, prev: i };
      }
    }
    const out = []; let j = n;
    while (j > 0) { const i = best[j].prev; out.unshift(run.slice(i, j)); j = i; }
    // glue unknown single characters back together
    const g = [];
    for (const w of out) { if (w.length === 1 && !has(w) && g.length && !has(g[g.length - 1])) g[g.length - 1] += w; else g.push(w); }
    return g;
  }
  function segThai(run, has) {
    if (SEG) { const o = []; for (const x of SEG.segment(run)) if (x.isWordLike) o.push(x.segment); return o.length ? o : [run]; }
    return dpSeg(run, has);
  }

  /* runs: [{s:text, th:bool, toks:[...]}] in order; a run is a stretch of Thai letters or of Latin letters/digits */
  function runs(text, has) {
    const s = norm(text), out = [];
    let m; RUN.lastIndex = 0;
    while ((m = RUN.exec(s))) {
      const r = m[0];
      if (IS_TH.test(r)) out.push({ s: r, th: true, at: m.index, toks: segThai(r, has) });
      else out.push({ s: r, th: false, at: m.index, toks: [stemEn(r.replace(/'s$/, ""))] });
    }
    return out;
  }
  /* index terms of a text: words (stop words removed) and Thai word pairs ("น้ำ|ท่วม" -> "น้ำท่วม") */
  function terms(text, stop, has) {
    const words = [], pairs = [];
    for (const r of runs(text, has)) {
      const t = r.toks;
      for (let i = 0; i < t.length; i++) {
        if (!stop || !stop.has(t[i])) words.push(t[i]);
        if (r.th && i + 1 < t.length) {
          const p = t[i] + t[i + 1];
          if (p.length <= 16 && !(stop && stop.has(t[i]) && stop.has(t[i + 1]))) pairs.push(p);
        }
      }
    }
    return { words, pairs };
  }

  /* ---------- edit distance (Damerau, bounded) ---------- */
  function dist(a, b, max) {
    const la = a.length, lb = b.length;
    if (Math.abs(la - lb) > max) return max + 1;
    let p2 = null, p = new Array(lb + 1), c = new Array(lb + 1);
    for (let j = 0; j <= lb; j++) p[j] = j;
    for (let i = 1; i <= la; i++) {
      c[0] = i; let mn = c[0];
      for (let j = 1; j <= lb; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        let v = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + cost);
        if (p2 && i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, p2[j - 2] + 1);
        c[j] = v; if (v < mn) mn = v;
      }
      if (mn > max) return max + 1;
      p2 = p; p = c; c = new Array(lb + 1);
    }
    return p[lb];
  }

  /* ---------- hashing (index shards) ---------- */
  function hash(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return h >>> 0; }

  /* ---------- dates ---------- */
  const TH_MS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const TH_ML = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const EN_MS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function fmtDate(iso, lang, long) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-").map(Number);
    if (lang === "en") return d + " " + EN_MS[m - 1] + " " + y;
    return d + " " + (long ? TH_ML : TH_MS)[m - 1] + " " + (y + 543);
  }
  // a 4-digit year -> Buddhist Era (2026 -> 2569, 2569 -> 2569); null when it is not a plausible year
  function toBE(y, ce) {
    y = +y;
    if (ce || (y >= 1990 && y <= 2100)) { const b = y + 543; return b >= 2540 && b <= 2640 ? b : null; }
    return y >= 2540 && y <= 2640 ? y : null;
  }

  /* ---------- query understanding ----------
     L = lexicon from the index (committee aliases, dictionary, stop words). Explicit rules only, no AI:
     years (พ.ศ./ค.ศ./ปี/2026/2569, ranges), meeting numbers (ครั้งที่ 36, 36/2569), "latest", a committee named
     together with a committee word (กมธ. เกษตร, agriculture committee), the kind of thing wanted (meetings,
     senators, videos, documents) and question words. Every rule that changes the results becomes a chip the
     reader can remove. */
  function parse(raw, L) {
    const P = { raw: String(raw || ""), filters: {}, chips: [], intents: {}, rest: "" };
    let q = norm(raw);
    const I = L.intent || {};
    const has = (list, w) => (list || []).indexOf(w) >= 0;
    // meeting number with year: 36/2569, ครั้งที่ 36/2569
    q = q.replace(/(?:ครั้งที่\s*)?(\d{1,3})\s*\/\s*(25\d\d)\b/, (m, n, y) => { P.filters.n = +n; P.filters.y0 = P.filters.y1 = +y; return " "; });
    q = q.replace(/ครั้งที่\s*(\d{1,3})(?!\d)/, (m, n) => { P.filters.n = +n; return " "; });
    // year ranges and single years; "ปีงบประมาณ 2570" stays a topic (budget year), not a meeting-date filter
    const YR = /(พศ|คศ|ปี|year|in|during|of)?\s*(\d{4})(?:\s*(?:-|ถึง|to|and|–)\s*(?:(พศ|คศ)\s*)?(\d{4}))?/g;
    q = q.replace(YR, (m, pre, a, pre2, b, off, str) => {
      const before = str.slice(Math.max(0, off - 12), off);
      if (/งบประมาณ\s*$|budget\s*$|fiscal\s*$/.test(before)) return m;
      if (/[.\d]$/.test(before) || /^[.\d]/.test(str.slice(off + m.length))) return m; // part of another number
      const ce = pre === "คศ" || pre2 === "คศ";
      const y0 = toBE(a, ce), y1 = b ? toBE(b, ce) : y0;
      if (!y0 || !y1) return m;
      P.filters.y0 = Math.min(y0, y1); P.filters.y1 = Math.max(y0, y1);
      return " ";
    });
    // multi-word intent phrases (English)
    for (const ph of I.discover_en || []) if (q.indexOf(ph) >= 0) { P.intents.discover = 1; q = q.replace(ph, " "); }
    for (const ph of I.latest_en || []) if (ph.indexOf(" ") > 0 && q.indexOf(ph) >= 0) { P.intents.latest = 1; q = q.replace(ph, " "); }
    // committee named with a committee word -> committee filter
    const cq = q.replace(/\s+/g, "");
    const cword = /(กมธ|คณะกรรมาธิการ|กรรมาธิการ)/.test(cq) || /\bcommittees?\b/.test(q);
    const subword = /(อนุกมธ|อนุกรรมาธิการ)/.test(cq) || /\bsub-?committees?\b/.test(q);
    let cid = null, best = 0, alias = null;
    for (const id in (L.committees || {})) {
      const A = L.committees[id];
      for (const a of A.th || []) { const k = a.replace(/\s+/g, ""); if (k.length > best && cq.indexOf(k) >= 0) { best = k.length; cid = id; alias = a; } }
      for (const a of A.en || []) { if (a.length > best && new RegExp("\\b" + a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b").test(q)) { best = a.length; cid = id; alias = a; } }
    }
    if (cid && (cword || subword)) {
      P.filters.cid = cid;
      // remove the committee words and the alias from the text
      q = q.replace(/คณะกรรมาธิการ|กรรมาธิการ|กมธ|\bcommittees?\b|\bon\b/g, " ");
      const A0 = L.committees[cid], al = [...new Set((A0.th || []).concat(A0.th.map(x => x.replace(/^การ/, ""))).concat(A0.en || []))].sort((x, y) => y.length - x.length);
      for (const x of al) {
        if (!x) continue;
        if (/[a-z]/.test(x)) q = q.replace(new RegExp("\\b" + x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b"), " ");
        else q = q.replace(new RegExp(x.split("").map(c => c === " " ? "\\s*" : c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s*")), " ");
      }
    } else if (cid) P.intents.cidHint = cid;
    // single-word intents
    const toks = runs(q, null);
    const keep = [], pieces = [];
    for (const r of toks) { let cur = []; const flush = () => { if (cur.length) pieces.push(r.th ? cur.join("") : cur.join(" ")); cur = []; };
     for (const t0 of r.toks) {
      const t = t0, raw0 = r.th ? t0 : r.s;
      const kept = keep.length;
      (function () {
      if (has(I.latest_th, t) || has(I.latest_en, t) || has(I.latest_en, r.s)) { P.intents.latest = 1; return; }
      if (has(I.meeting_th, t) || has(I.meeting_en, r.s) || has(I.meeting_en, t)) { P.intents.meeting = 1; return; }
      if (has(I.video_th, t) || has(I.video_en, r.s) || has(I.video_en, t)) { P.intents.video = 1; return; }
      if (has(I.person_th, t) || has(I.person_en, r.s) || has(I.person_en, t)) { P.intents.person = 1; keep.push(raw0); return; }
      if (has(I.doc_en, r.s) || has(I.doc_en, t) || t === "เอกสาร") { P.intents.doc = 1; return; }
      if (has(I.question_th, t) || has(I.question_en, r.s) || has(I.question_en, t)) { P.intents.question = 1; return; }
      if (has(I.committee_th, t) || has(I.committee_en, r.s) || has(I.committee_en, t)) { P.intents.committee = 1; return; }
      keep.push(raw0);
      })();
      if (keep.length > kept) cur.push(raw0); else flush();
     }
     flush(); }
    // Thai question/intent words are often cut into pieces (เมื่อ|ใด, เกี่ยว|กับ): compact check on the original
    if (/(เมื่อใด|เมื่อไร|เมื่อไหร่|อย่างไร|ใดบ้าง|หรือไม่)/.test(cq)) P.intents.question = 1;
    if (/(คณะใด|คณะไหน|กรรมาธิการใด|กมธใด)/.test(cq)) P.intents.discover = 1;
    if (/(ประชุมล่าสุด|ครั้งล่าสุด)/.test(cq)) P.intents.latest = 1;
    P.rest = pieces.join(" ").trim();
    // what the reader most likely wants
    const stop = new Set((L.stop_th || []).concat(L.stop_en || []));
    const content = keep.filter(t => !stop.has(t));
    if (P.intents.video) P.filters.type = "v";
    else if (P.intents.person && !content.filter(t => !has(I.person_th, t) && !has(I.person_en, t)).length) P.filters.type = "p";
    else if (P.intents.meeting || P.intents.latest || P.filters.n || (P.filters.y0 && !content.length)) P.filters.type = "m";
    else if (P.intents.committee && !content.length && !P.filters.cid) P.filters.type = "c";
    if (P.intents.doc) P.filters.doc = 1;
    if (P.intents.latest) P.filters.sort = "new";
    return P;
  }

  return { norm, compact, stemEn, segThai, dpSeg, runs, terms, dist, hash, fmtDate, toBE, parse, TH_MS, TH_ML, EN_MS, hasSeg: !!SEG };
});
