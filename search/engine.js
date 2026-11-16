/* ParliamentX search engine (browser and Node). Loads the static index piece by piece:
   manifest + lexicon + meta (small) on first use, then only the word lists and cards a query needs.
   Ranking: BM25F weights from the index x idf computed here, summed per query part ("clause"); a record that
   matches every part of the query ranks above one that matches only some. Thai/English dictionary forms and
   abbreviations are alternatives inside a clause (weight < 1, so the words the reader typed count most).
   Committees, senators and topics are their own records, shown as "best matches" when the name fits.
   No ordinary search ever calls an outside service. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(require("./core.js"));
  else root.PXEngine = factory(root.PXCore);
})(typeof self !== "undefined" ? self : this, function (C) {
  "use strict";
  const TYPES = ["c", "s", "p", "t", "m", "v"];
  const HONOR = /^(นาย|นางสาว|นาง|ว่าที่ร้อยตรี|ว่าที่ร้อยโท|ว่าที่พันตรี|ผู้ช่วยศาสตราจารย์|รองศาสตราจารย์|ศาสตราจารย์|พลตำรวจเอก|พลตำรวจโท|พลตำรวจตรี|พันตำรวจเอก|พันตำรวจโท|พลเอก|พลโท|พลตรี|พลอากาศเอก|พลอากาศโท|พลเรือเอก|พลเรือโท|พันเอก|ดร|นายแพทย์|แพทย์หญิง|ทันตแพทย์|เภสัชกร)+/;

  function Engine(opt) {
    this.base = (opt.base || "").replace(/\/?$/, "/");
    this.fetchJSON = opt.fetchJSON;
    this.cache = new Map();
    this.today = opt.today || new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
  }
  const P = Engine.prototype;
  P.get = function (rel) {
    if (!this.cache.has(rel)) this.cache.set(rel, this.fetchJSON(this.base + rel).catch(e => { this.cache.delete(rel); throw e; }));
    return this.cache.get(rel);
  };
  P.init = function () {
    if (this._init) return this._init;
    return (this._init = Promise.all([this.get("manifest.json"), this.get("lex.json"), this.get("meta.json")]).then(([m, l, meta]) => {
      this.man = m; this.lex = l; this.meta = meta;
      const D = l.dict;
      this.stop = new Set(D.stop_th.concat(D.stop_en).map(C.norm).concat(m.common || []));
      // dictionary forms -> groups (compact keys, so "water management" = "watermanagement", "ส.ว." = "สว")
      this.forms = new Map();
      const addF = (form, g) => { const k = C.compact(form); if (!k) return; let a = this.forms.get(k); if (!a) this.forms.set(k, a = []); if (a.indexOf(g) < 0) a.push(g); };
      D.abbr.forEach((grp, i) => { const g = { kind: "abbr", id: "a" + i, th: grp, en: [] }; grp.forEach(f => addF(f, g)); });
      this.concept = new Map();
      D.concepts.forEach(c => { const g = { kind: "concept", id: c.id, th: c.th, en: c.en, related: c.related || [] }; this.concept.set(c.id, g); c.th.concat(c.en).forEach(f => addF(f, g)); });
      this.maxSpan = 6;
      this.people = l.people.map(p => Object.assign({ key: C.compact(p.n), bare: C.compact(p.n.replace(HONOR, "")) }, p));
      this.cm = l.committees; this.cmIdx = new Map(l.committees.map((c, i) => [c.id, i]));
      this.subs = l.subs;
      this.N = m.N;
      return this;
    }));
  };
  P.parse = function (q) { return C.parse(q, this.lex.dict); };

  /* ---------- word lists ---------- */
  P.postings = function (terms) {
    const need = new Map();
    terms.forEach(t => { const s = C.hash(t) % this.man.shards; if (!need.has(s)) need.set(s, []); need.get(s).push(t); });
    return Promise.all([...need.keys()].map(s => this.get("p/" + String(s).padStart(3, "0") + ".json"))).then(arr => {
      const out = new Map(); let i = 0;
      for (const s of need.keys()) { const sh = arr[i++]; for (const t of need.get(s)) if (sh[t]) out.set(t, sh[t]); }
      return out;
    });
  };
  P.idf = function (L) { const df = L.length / 2; return Math.log(1 + (this.N - df + 0.5) / (df + 0.5)); };
  P.vshard = function (pre) { return this.get("v/" + String(C.hash(pre.slice(0, 2)) % this.man.vshards).padStart(3, "0") + ".json"); };
  // words starting with `pre` (most common first); names are left out unless names=true
  P.complete = function (pre, n, names) {
    if (pre.length < 2) return Promise.resolve([]);
    return this.vshard(pre).then(V => V.filter(x => x[0].length > pre.length && x[0].indexOf(pre) === 0 && (names || !x[2]) && !this.stop.has(x[0])).slice(0, n || 6));
  };
  // close spellings of a word that the index knows (Damerau distance 1, or 2 for long words)
  P.near = function (w, names) {
    const L = w.length, max = L >= 8 ? 2 : 1, lens = [];
    for (let l = Math.max(3, L - max); l <= Math.min(30, L + max); l++) if (this.man.flens.indexOf(l) >= 0) lens.push(l);
    return Promise.all(lens.map(l => this.get("f/" + String(l).padStart(2, "0") + ".json"))).then(arr => {
      const out = [];
      arr.forEach(list => list.forEach(x => { if (!names && x[2]) return; const d = C.dist(w, x[0], max); if (d <= max && x[0] !== w) out.push({ t: x[0], df: x[1], d, name: !!x[2] }); }));
      out.sort((a, b) => a.d - b.d || b.df - a.df);
      return out.slice(0, 5);
    });
  };

  /* ---------- query plan: clauses of alternatives ---------- */
  P.plan = function (P0) {
    const rs = C.runs(P0.rest, null);
    const toks = [];
    rs.forEach((r, ri) => {
      if (r.th) r.toks.forEach(t => toks.push({ t, raw: t, th: true, run: ri }));
      else toks.push({ t: r.toks[0], raw: r.s, th: false, run: ri });
    });
    const clauses = [], used = new Array(toks.length).fill(false), concepts = [];
    // longest dictionary span first
    for (let len = Math.min(this.maxSpan, toks.length); len >= 1; len--) {
      for (let i = 0; i + len <= toks.length; i++) {
        if (used.slice(i, i + len).some(Boolean)) continue;
        const key = C.compact(toks.slice(i, i + len).map(x => x.raw).join(" "));
        const gs = this.forms.get(key);
        if (!gs) continue;
        const own = toks.slice(i, i + len).map(x => x.raw).join(toks[i].th ? "" : " ");
        const alts = [this.alt(own, 1, own)];
        gs.forEach(g => {
          g.th.concat(g.en).forEach(f => { if (C.compact(f) !== key) alts.push(this.alt(f, g.kind === "abbr" ? 0.95 : 0.8, f)); });
          if (g.kind === "concept" && concepts.indexOf(g) < 0) concepts.push(g);
        });
        const ok = alts.filter(a => a.words.length);
        if (!ok.length) continue;
        clauses.push({ label: own, alts: ok, span: [i, i + len], dict: true });
        for (let k = i; k < i + len; k++) used[k] = true;
      }
    }
    // remaining words, one clause each (stop words dropped)
    toks.forEach((x, i) => {
      if (used[i] || this.stop.has(x.t)) return;
      clauses.push({ label: x.raw, alts: [{ words: [x.t], pairs: [], w: 1, form: x.raw }], span: [i, i + 1] });
    });
    clauses.sort((a, b) => a.span[0] - b.span[0]);
    // pairs of neighbouring Thai words across clauses (น้ำ|ท่วม) = phrase bonus
    const bonus = [];
    for (let i = 0; i + 1 < toks.length; i++) if (toks[i].th && toks[i + 1].th && toks[i].run === toks[i + 1].run) bonus.push(toks[i].t + toks[i + 1].t);
    const runsTh = rs.filter(r => r.th && r.s.length >= 3).map(r => r.s);
    return { clauses, bonus, concepts, runsTh, toks };
  };
  P.alt = function (form, w, label) { const t = C.terms(form, this.stop); return { words: [...new Set(t.words)], pairs: [...new Set(t.pairs)], w, form: label }; };

  /* ---------- search ---------- */
  P.search = async function (q, o) {
    o = o || {};
    await this.init();
    const P0 = this.parse(q);
    const F = Object.assign({}, P0.filters, o.filters || {});
    (o.drop || []).forEach(k => { delete F[k]; if (k === "y") { delete F.y0; delete F.y1; } });
    const plan = this.plan(P0);
    const notes = { corrected: [], didYouMean: [], expanded: [] };
    // collect every word we need
    const allT = new Set();
    const addAlt = a => { a.words.forEach(t => allT.add(t)); a.pairs.forEach(t => allT.add(t)); };
    plan.clauses.forEach(c => c.alts.forEach(addAlt));
    plan.bonus.forEach(t => allT.add(t));
    plan.runsTh.forEach(t => allT.add(t));
    let PL = await this.postings([...allT]);
    // unknown words: Thai stretches / English words the index has never seen -> close spellings, then word starts
    const extra = new Set();
    const known = s => PL.has(s) || this.stop.has(s);
    const fixes = [];
    for (const r of plan.runsTh) {
      if (r.length < 4) continue;
      const rt = C.terms(r, null);
      const attested = known(r) || (rt.pairs.length && rt.pairs.every(known)) || (!rt.pairs.length && rt.words.every(known));
      if (!attested) fixes.push({ w: r, th: true });
    }
    plan.toks.filter(x => !x.th && x.t.length >= 4 && !/\d/.test(x.t) && !known(x.t) && !this.stop.has(x.t)).forEach(x => fixes.push({ w: x.t, th: false, raw: x.raw }));
    for (const fx of (o.exact ? [] : fixes)) {
      const near = await this.near(fx.w, true);
      const good = near.filter(x => !x.name);
      const nameNear = near.filter(x => x.name);
      let added = null;
      if (good.length && (good[0].df >= 2 || good[0].d === 1)) {
        added = good[0].t; notes.corrected.push({ from: fx.raw || fx.w, to: added });
      } else {
        const comp = await this.complete(fx.w, 4, false);
        if (comp.length) { added = comp.map(x => x[0]); notes.expanded.push({ from: fx.w, to: added.slice(0, 3) }); }
      }
      if (nameNear.length) notes.didYouMean.push(...nameNear.slice(0, 2).map(x => x.t));
      if (added) {
        const forms = Array.isArray(added) ? added : [added];
        // attach to the clauses of that stretch (or make one)
        const cl = plan.clauses.filter(c => fx.th ? c.alts[0].words.some(w => fx.w.indexOf(w) >= 0) || C.compact(c.label).indexOf(fx.w) >= 0 || fx.w.indexOf(C.compact(c.label)) >= 0 : c.label === (fx.raw || fx.w));
        const alts = forms.map(f => ({ words: [f], pairs: [], w: Array.isArray(added) ? 0.7 : 0.9, form: f }));
        alts.forEach(a => extra.add(a.words[0]));
        if (fx.th && cl.length > 1) {
          // a mistyped Thai word cut into pieces: replace those pieces by one clause
          plan.clauses = plan.clauses.filter(c => cl.indexOf(c) < 0);
          plan.clauses.push({ label: fx.w, alts: [{ words: C.terms(fx.w, this.stop).words, pairs: [], w: 0.6, form: fx.w }].concat(alts), span: cl[0].span });
        } else if (cl.length) cl[0].alts.push(...alts);
        else plan.clauses.push({ label: fx.w, alts, span: [0, 0] });
      }
    }
    // a mistyped word that turns out to be a search word (คณะกรรมมาธิการ -> คณะกรรมาธิการ): read the corrected query again
    if (!o._fixed && notes.corrected.length) {
      let q2 = C.norm(q); notes.corrected.forEach(c => { q2 = q2.split(c.from).join(c.to); });
      const P2 = this.parse(q2);
      if (JSON.stringify(P2.filters) !== JSON.stringify(P0.filters) || JSON.stringify(P2.intents) !== JSON.stringify(P0.intents)) {
        const r2 = await this.search(q2, Object.assign({}, o, { _fixed: 1 }));
        r2.q = q; r2.notes.corrected = notes.corrected.concat(r2.notes.corrected); return r2;
      }
    }
    if (extra.size) { const more = await this.postings([...extra].filter(t => !PL.has(t))); more.forEach((v, k) => PL.set(k, v)); }

    // score
    const M = this.meta, NID = M.k.length;
    const score = new Float64Array(NID), hit = new Uint16Array(NID), mask = new Uint16Array(NID);
    const nc = plan.clauses.length;
    const dense = L => { const m = new Map(); let d = 0; for (let i = 0; i < L.length; i += 2) { d += L[i]; m.set(d, L[i + 1]); } return m; };
    const DM = new Map(); const dm = t => { if (!DM.has(t)) DM.set(t, PL.has(t) ? dense(PL.get(t)) : null); return DM.get(t); };
    plan.clauses.forEach((c, ci) => {
      const best = new Map();
      c.alts.forEach(a => {
        const per = new Map(), cntw = new Map();
        a.words.forEach(t => { const m = dm(t); if (!m) return; const idf = this.idf(PL.get(t)); m.forEach((v, d) => { per.set(d, (per.get(d) || 0) + idf * (v >> 8) / 100); cntw.set(d, (cntw.get(d) || 0) + 1); mask[d] |= v & 255; }); });
        a.pairs.forEach(t => { const m = dm(t); if (!m) return; const idf = this.idf(PL.get(t)); m.forEach((v, d) => { if (per.has(d)) per.set(d, per.get(d) + 0.6 * idf * (v >> 8) / 100); }); });
        const nw = a.words.length || 1;
        per.forEach((s, d) => { const f = cntw.get(d) / nw; const v = a.w * s * f * f; if (v > (best.get(d) || 0)) best.set(d, v); });
      });
      best.forEach((v, d) => { score[d] += v; hit[d]++; });
    });
    plan.bonus.forEach(t => { const m = dm(t); if (!m) return; const idf = this.idf(PL.get(t)); m.forEach((v, d) => { if (score[d] > 0) score[d] += 0.5 * idf * (v >> 8) / 100; }); });
    // which records, before filters
    const cands = [];
    if (nc) {
      for (let d = 0; d < NID; d++) if (score[d] > 0) { const cov = hit[d] / nc; score[d] *= nc > 1 ? cov * cov : 1; cands.push(d); }
    } else {
      // no words left (only filters such as a year, a committee or "latest"): everything that fits the filters
      for (let d = 0; d < NID; d++) if (M.k[d] >= 0) { cands.push(d); score[d] = M.d[d] ? 1 : 0.5; }
    }
    // names of committees, subcommittees, senators and topics that fit the query well
    const cq = C.compact(P0.rest), cqAll = C.compact(q);
    for (const d of cands) {
      const k = TYPES[M.k[d]];
      if (k === "c") { const c = this.cm[M.c[d]]; if (c && (c.id === F.cid || c.id === P0.intents.cidHint || (cq.length >= 3 && (C.compact(c.th).indexOf(cq) >= 0 || C.compact(c.short) === cq)))) score[d] = score[d] * 3 + 8; }
    }
    this.people.forEach(p => { p.hit = 0; });
    if (cq.length >= 2) {
      this.people.forEach(p => { if ((p.bare.length >= 2 && cqAll.indexOf(p.bare) >= 0) || (cq.length >= 3 && p.bare.indexOf(cq) >= 0)) p.hit = 1; else p.hit = 0; });
    }
    for (const d of cands) if (M.k[d] === 2) { const p = this.people[M.s[d]]; if (p && p.hit) score[d] = score[d] * 3 + 6; }
    // committee pinned by the query with no other words: show the committee itself first
    if (F.cid && !nc) for (let d = 0; d < NID; d++) if (M.k[d] === 0 && this.cm[M.c[d]] && this.cm[M.c[d]].id === F.cid && cands.indexOf(d) < 0) { cands.push(d); score[d] = 9; }
    if (P0.intents.cidHint && nc) { const hi = this.cmIdx.get(P0.intents.cidHint); for (const d of cands) if (M.k[d] >= 4 && M.c[d] === hi) score[d] *= 1.2; }
    // filters
    const ci = F.cid ? this.cmIdx.get(F.cid) : null;
    const today = +this.today.replace(/-/g, "");
    const pass = (d, skip) => {
      const k = TYPES[M.k[d]];
      if (k == null) return false;
      if (skip !== "type" && F.type) {
        if (F.type === "c" ? !(k === "c" || k === "s") : F.type === "doc" ? !(k === "m" && (M.fl[d] & 2)) : k !== F.type) return false;
      }
      if (skip !== "cid" && ci != null && !(M.cm[d] & (1 << ci))) return false;
      if (F.sub != null && F.sub !== "" && M.s[d] !== +F.sub) return false;
      if (skip !== "y" && F.y0 && !(M.y[d] >= F.y0 && M.y[d] <= F.y1)) return false;
      if (F.n && !(k === "m" || k === "v")) return false;
      if (F.n && M.n[d] !== F.n) return false;
      if (F.doc && !(M.fl[d] & 2)) return false;
      if (F.video && !(M.fl[d] & 1)) return false;
      if (F.up && !(M.d[d] >= today)) return false;
      return true;
    };
    // meeting number filter needs the card (number is not in meta): keep records of that number only after loading
    let list = cands.filter(d => pass(d));
    // a video whose meeting is also in the results is folded into that meeting (unless the reader asked for videos)
    if (F.type !== "v") {
      const inSet = new Set(list);
      list = list.filter(d => { if (M.k[d] !== 5) return true; const p = M.par[d]; if (p >= 0 && inSet.has(p)) { score[p] += 0.3 * score[d]; mask[p] |= 64; return false; } return true; });
    }
    // honest note: when no record has every searched word, the list only holds partial matches
    if (nc > 1) { let full = 0; for (const d of list) if (hit[d] >= nc) full++; notes.full = full; if (!full && list.length) notes.partial = true; }
    // facets (each one ignores its own filter)
    const facet = (skip, keyf) => { const o = {}; for (const d of cands) { if (!pass(d, skip)) continue; const k = keyf(d); if (k == null) continue; o[k] = (o[k] || 0) + 1; } return o; };
    const facets = {
      type: facet("type", d => { const k = TYPES[M.k[d]]; return k === "s" ? "c" : k; }),
      cid: facet("cid", d => (M.k[d] === 4 || M.k[d] === 5) && M.c[d] >= 0 ? this.cm[M.c[d]].id : null),
      y: facet("y", d => M.y[d] || null)
    };
    facets.type.doc = cands.filter(d => M.k[d] === 4 && (M.fl[d] & 2) && pass(d, "type")).length;
    // order
    const sortNew = F.sort === "new", sortOld = F.sort === "old";
    let top = 0; list.forEach(d => { if (score[d] > top) top = score[d]; });
    if ((sortNew || sortOld) && nc) list = list.filter(d => score[d] >= top * 0.3 || M.k[d] < 4);
    const ent = list.filter(d => M.k[d] < 4), docs = list.filter(d => M.k[d] >= 4);
    const cmp = (a, b) => sortNew ? (M.d[b] - M.d[a] || score[b] - score[a]) : sortOld ? (M.d[a] - M.d[b] || score[b] - score[a]) : (score[b] - score[a] || M.d[b] - M.d[a]);
    ent.sort((a, b) => score[b] - score[a]);
    docs.sort(cmp);
    // best matches strip: committees / subcommittees / senators / topics whose score is strong
    const bestTop = docs.length ? score[docs[0]] : 0;
    let best = ent.filter(d => score[d] >= Math.max(0.6 * bestTop, 0.5) || (M.k[d] === 0 && score[d] >= 8)).slice(0, 4);
    const typeOnly = F.type && F.type !== "m" && F.type !== "v" && F.type !== "doc";
    const ordered = typeOnly ? ent : (F.type ? docs : docs);
    // related topics: dictionary neighbours of what was asked (never merged into results)
    const related = [];
    plan.concepts.forEach(g => (g.related || []).forEach(id => { const r = this.concept.get(id); if (r && related.indexOf(r) < 0 && plan.concepts.indexOf(r) < 0) related.push(r); }));
    // words to highlight on the cards
    const hl = new Set();
    plan.runsTh.forEach(r => hl.add(r));
    plan.clauses.forEach(c => c.alts.forEach(a => { if (a.form && a.form.length >= 2) hl.add(C.norm(a.form)); a.words.forEach(w => { if (w.length >= 2 && !/^[a-z]{1,2}$/.test(w)) hl.add(w); }); a.pairs.forEach(w => hl.add(w)); }));
    plan.bonus.forEach(w => hl.add(w));
    return {
      q, parsed: P0, filters: F, total: ordered.length, ids: ordered, best: typeOnly ? [] : best, score, mask,
      facets, related, notes, hl: [...hl].filter(Boolean).sort((a, b) => b.length - a.length),
      clauses: plan.clauses.map(c => ({ label: c.label, alts: c.alts.map(a => a.form) })), peopleHit: this.people.filter(p => p.hit)
    };
  };

  /* ---------- cards ---------- */
  P.cards = function (ids, lang) {
    const per = this.man.per, need = [...new Set(ids.map(d => Math.floor(d / per)))];
    const pads = s => String(s).padStart(3, "0");
    return Promise.all(need.map(s => Promise.all([this.get("d/" + pads(s) + ".json"), lang === "en" ? this.get("e/" + pads(s) + ".json") : Promise.resolve(null)]))).then(arr => {
      const by = new Map(); need.forEach((s, i) => by.set(s, arr[i]));
      return ids.map(d => {
        const [th, en] = by.get(Math.floor(d / per)); const o = th[d % per]; if (!o) return null;
        const r = Object.assign({ id: d }, o);
        if (en && en[d % per]) { const e = en[d % per]; Object.assign(r, { te: e.te, se: e.se, tge: e.tge, cre: e.cre, re: e.re, ite: e.it, ve: e.v }); }
        return r;
      });
    });
  };

  /* ---------- suggestions while typing (instant part: from the lexicon only) ---------- */
  P.suggestNow = function (q) {
    const out = { committees: [], subs: [], people: [], topics: [], abbr: null };
    const k = C.compact(q); if (!k) return out;
    const en = /[a-z]/.test(k);
    const D = this.lex.dict;
    this.cm.forEach(c => {
      const al = (D.committees[c.id] || { th: [], en: [] });
      const keys = [c.th, c.short, c.en || "", c.short_en || ""].concat(al.th, al.en).map(C.compact);
      if (keys.some(x => x && (x.indexOf(k) >= 0 || (k.length >= 4 && k.indexOf(x) >= 0 && x.length >= 4)))) out.committees.push(c);
    });
    out.committees.sort((a, b) => b.have - a.have);
    if (k.length >= 2) {
      this.subs.forEach(s => { if (C.compact(s.th).indexOf(k) >= 0 || (en && C.compact(s.en || "").indexOf(k) >= 0)) out.subs.push(s); });
      this.people.forEach(p => { if (p.bare.indexOf(k) >= 0 || p.key.indexOf(k) >= 0) out.people.push(p); });
      const T = []; this.lex.topics.forEach(t => { const a = C.compact(t[0]), b = C.compact(t[1] || ""); const s = a.indexOf(k) === 0 || b.indexOf(k) === 0 ? 2 : (a.indexOf(k) >= 0 || b.indexOf(k) >= 0 ? 1 : 0); if (s) T.push([s, t]); });
      T.sort((x, y) => y[0] - x[0] || y[1][2] - x[1][2]); out.topics = T.slice(0, 6).map(x => x[1]);
      // dictionary topics (both languages) that start with what was typed
      this.concept.forEach(g => { if (out.topics.length >= 8) return; const f = g.th.concat(g.en).find(x => C.compact(x).indexOf(k) === 0); if (f && !out.topics.some(t => C.compact(t[0]) === C.compact(g.th[0]))) out.topics.push([g.th[0], g.en[0], 0, 1]); });
    }
    const g = this.forms.get(k); if (g) { const a = g.find(x => x.kind === "abbr"); if (a) out.abbr = a.th; }
    out.subs = out.subs.slice(0, 3); out.people = out.people.slice(0, 4); out.committees = out.committees.slice(0, 3);
    return out;
  };
  return Engine;
});
