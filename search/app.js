/* ParliamentX search page. Everything runs in the reader's browser over the static index in ./idx/
   (no outside service, no cookies, nothing logged). Thai + English UI; follows the site language switch (arch-lang). */
(function () {
  "use strict";
  var C = window.PXCore, E = window.PXEngine;
  var $ = function (id) { return document.getElementById(id); };
  var KEY = "arch-lang";
  var lang = "th";
  try { lang = new URLSearchParams(location.search).get("lang") || localStorage.getItem(KEY) || "th"; } catch (e) {}
  if (lang !== "en") lang = "th";
  var L = function (th, en) { return lang === "en" ? en : th; };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var ic = function (id, cls) { return '<svg class="' + (cls || "ico") + '" aria-hidden="true"><use href="#' + id + '"/></svg>'; };
  var sym = function (icn) { return icn ? '<span class="sym" aria-hidden="true"><svg viewBox="0 0 48 48"><use href="#' + esc(icn) + '"/></svg></span>' : ""; };
  var ORIGIN = window.PX_ORIGIN || ""; // set only by the private review copy, so site links open the real site
  var safeUrl = function (u) { u = String(u || ""); if (!/^(https?:\/\/|\/|\.\.?\/|#)/i.test(u) || /^\s*javascript:/i.test(u)) return "#"; return ORIGIN && /^\/[^\/]/.test(u) ? ORIGIN + u : u; };
  var ext = function (u) { return /^https?:\/\//i.test(u) && !/^https?:\/\/(www\.)?parliamentx\.com/i.test(u); };

  /* ---------- index loading: the manifest is always fresh, every other file is versioned by its data hash ---------- */
  var ver = null, manP = null;
  var bundle = null; // the private review copy ships the whole index as one file (window.PX_BUNDLE)
  function fetchJSON(path) {
    if (window.PX_BUNDLE) {
      bundle = bundle || fetch(window.PX_BUNDLE).then(function (r) { if (!r.ok) throw new Error("index " + r.status); return r.json(); }).then(function (b) { ver = b["manifest.json"].data; return b; });
      return bundle.then(function (b) { var k = path.replace(/^idx\//, ""); if (!(k in b)) throw new Error("missing " + k); return b[k]; });
    }
    if (/manifest\.json$/.test(path)) {
      manP = manP || fetch(path, { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error("index " + r.status); return r.json(); }).then(function (m) { ver = m.data; return m; });
      return manP;
    }
    return (manP || fetchJSON("idx/manifest.json")).then(function () {
      return fetch(path + "?v=" + encodeURIComponent(ver || "")).then(function (r) { if (!r.ok) throw new Error("index " + r.status); return r.json(); });
    });
  }
  var eng = new E({ base: "idx/", fetchJSON: fetchJSON });
  var ready = null;
  function boot() { return ready || (ready = eng.init()); }

  /* ---------- state <-> URL ---------- */
  var S = { q: "", type: "", cid: "", y: "", sort: "", video: "", doc: "", up: "", drop: [], exact: "" };
  function readURL() {
    var p = new URLSearchParams(location.search);
    S.q = (p.get("q") || "").slice(0, 200);
    ["type", "cid", "y", "sort", "video", "doc", "up", "exact"].forEach(function (k) { S[k] = (p.get(k) || "").slice(0, 40); });
    S.drop = (p.get("drop") || "").split(",").filter(Boolean).slice(0, 8);
  }
  function writeURL(push) {
    var p = new URLSearchParams();
    if (S.q) p.set("q", S.q);
    ["type", "cid", "y", "sort", "video", "doc", "up", "exact"].forEach(function (k) { if (S[k]) p.set(k, S[k]); });
    if (S.drop.length) p.set("drop", S.drop.join(","));
    var u = location.pathname + (p.toString() ? "?" + p.toString() : "");
    try { if (u !== location.pathname + location.search) history[push ? "pushState" : "replaceState"](null, "", u); } catch (e) {}
  }
  function userFilters() {
    var f = {};
    if (S.type) f.type = S.type;
    if (S.cid) f.cid = S.cid;
    if (S.y) { var m = S.y.match(/^(\d{4})(?:-(\d{4}))?$/); if (m) { f.y0 = +m[1]; f.y1 = +(m[2] || m[1]); } }
    if (S.sort === "new" || S.sort === "old") f.sort = S.sort;
    if (S.video) f.video = 1;
    if (S.doc) f.doc = 1;
    if (S.up) f.up = 1;
    return f;
  }

  /* ---------- names ---------- */
  var cmById = {};
  function cmName(id, long) { var c = cmById[id]; if (!c) return ""; return lang === "en" ? (long ? c.en : c.short_en || c.en) : (long ? c.th : c.short); }
  function subName(i) { var s = eng.subs[i]; return s ? (lang === "en" ? s.en || s.th : s.th) : ""; }
  var TYPE_NAME = {
    m: ["การประชุม", "Meetings"], v: ["วิดีโอ", "Videos"], c: ["คณะกรรมาธิการ", "Committees"], p: ["สมาชิกวุฒิสภา", "Senators"], t: ["หัวข้อ", "Topics"], doc: ["มีเอกสารทางการ", "With official document"]
  };
  var DOC = { summary: ["สรุปผลการประชุม (ฉบับทางการ)", "Official meeting summary"], notice: ["หนังสือนัดประชุม", "Meeting notice"], minutes: ["บันทึกการประชุม", "Meeting minutes"], agenda: ["ระเบียบวาระ", "Agenda"], doc: ["เอกสารประกอบ", "Supporting document"], brief: ["เอกสารผู้ชี้แจง", "Briefing document"] };
  var FIELD = [["ชื่อเรื่อง", "title"], ["คำสำคัญ", "keywords"], ["วาระการประชุม", "agenda items"], ["สรุปผล", "summary"], ["ชื่อบุคคล", "names"], ["ชื่อคณะ", "committee name"], ["คำบรรยายวิดีโอ", "video narration"], ["", ""]];
  var today = eng.today;

  /* ---------- highlight + excerpt ---------- */
  var HL = null;
  function setHL(list) {
    var t = (list || []).filter(function (x) { return x && x.length >= 2; }).slice(0, 30).map(function (x) { return x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); });
    HL = t.length ? new RegExp("(" + t.join("|") + ")", "gi") : null;
  }
  function mark(s) {
    s = String(s || "");
    if (!HL) return esc(s);
    var out = "", last = 0; HL.lastIndex = 0; var m;
    while ((m = HL.exec(s))) { if (!m[0]) { HL.lastIndex++; continue; } out += esc(s.slice(last, m.index)) + "<mark>" + esc(m[0]) + "</mark>"; last = m.index + m[0].length; }
    return out + esc(s.slice(last));
  }
  function firstHit(s) { if (!HL || !s) return -1; HL.lastIndex = 0; var m = HL.exec(s); return m ? m.index : -1; }
  function cut(s, i, n) {
    n = n || 170; s = String(s || "");
    if (s.length <= n) return s;
    var a = Math.max(0, i - 50); if (a > 0) { var sp = s.lastIndexOf(" ", a); if (sp > a - 30 && sp > 0) a = sp + 1; }
    var b = Math.min(s.length, a + n); var sp2 = s.indexOf(" ", b); if (sp2 > 0 && sp2 - b < 25) b = sp2;
    return (a > 0 ? "… " : "") + s.slice(a, b) + (b < s.length ? " …" : "");
  }

  /* ---------- cards ---------- */
  function fmt(d) { return C.fmtDate(d, lang, false); }
  function ent(c, compact) {
    var t = lang === "en" ? c.te || c.t : c.t, h = "";
    if (c.k === "c") {
      var cm = cmById[c.c] || {};
      var inSite = c.have || cm.have;
      var href = inSite ? c.u : c.senate;
      h = '<div class="card ent">' + sym(c.ic || cm.ic) + '<div><p class="k">' + L("คณะกรรมาธิการ", "Committee") + '</p><h3><a href="' + esc(safeUrl(href)) + '"' + (ext(href) ? ' target="_blank" rel="noopener"' : "") + ">" + mark(t) + "</a></h3>" +
        "<p>" + (inSite ? L("มีคลังการประชุมในเว็บไซต์นี้", "Meeting archive on this site") : L("ยังไม่มีในเว็บไซต์นี้ · เปิดเว็บไซต์วุฒิสภา", "Not on this site yet · opens the Senate website")) + "</p></div>" +
        (compact ? "" : '<div class="act">' + (inSite ? '<button type="button" class="btn ghost" data-cid="' + esc(c.c) + '">' + ic("i-search") + L("ค้นเฉพาะคณะนี้", "Search this committee only") + "</button>" : "") + "</div>") + "</div>";
    } else if (c.k === "s") {
      var cm2 = cmById[c.c] || {};
      h = '<div class="card ent">' + sym(cm2.ic) + '<div><p class="k">' + L("คณะอนุกรรมาธิการ", "Subcommittee") + (c.st && c.st !== "current" ? " · " + L("ชุดก่อน", "earlier") : "") + '</p><h3><a href="' + esc(safeUrl(c.u)) + '">' + mark(t) + "</a></h3><p>" + esc(L("ภายใต้", "Under") + " " + cmName(c.c, true)) + "</p></div></div>";
    } else if (c.k === "p") {
      var roles = lang === "en" ? c.re || c.r || [] : c.r || [];
      h = '<div class="card ent">' + (c.img ? '<img src="' + esc(safeUrl(c.img)) + '" alt="" loading="lazy" width="52" height="52">' : '<span class="oi">' + ic("i-person") + "</span>") +
        '<div><p class="k">' + L("สมาชิกวุฒิสภา", "Senator") + '</p><h3><a href="' + esc(safeUrl(c.u)) + '">' + mark(c.t) + "</a></h3>" + roles.slice(0, 3).map(function (r) { return "<p>" + esc(r) + "</p>"; }).join("") + "</div></div>";
    } else if (c.k === "t") {
      h = '<div class="card ent"><span class="oi">' + ic("i-tag") + '</span><div><p class="k">' + L("หัวข้อ", "Topic") + "</p><h3>" + mark(t) + "</h3><p>" +
        esc(L("พบใน " + c.n + " การประชุม", "In " + c.n + " meetings")) + (c.cs && c.cs.length ? " · " + esc(c.cs.length > 2 ? L("จาก " + c.cs.length + " คณะ", "from " + c.cs.length + " committees") : c.cs.map(function (x) { return cmName(x); }).join(", ")) : "") + "</p></div>" +
        '<div class="act"><button type="button" class="btn ghost" data-q="' + esc(c.t) + '">' + ic("i-search") + L("ดูการประชุมเรื่องนี้", "See these meetings") + "</button></div></div>";
    }
    return h;
  }
  function meeting(c, r) {
    var en = lang === "en", M = eng.meta, fl = M.fl[c.id] || 0;
    var t = en ? c.te || c.t : c.t;
    var up = c.d && c.d >= today, cx = c.cx;
    var kind = cx ? '<p class="k cx">' + ic("i-cal") + L("ประชุมนัดนี้ถูกยกเลิก", "Meeting cancelled") + "</p>"
      : up ? '<p class="k up">' + ic("i-cal") + L("นัดประชุมที่กำลังจะมาถึง", "Upcoming meeting") + "</p>"
        : '<p class="k">' + ic("i-doc") + L("การประชุม", "Meeting") + "</p>";
    var who = cmName(c.c) + (c.sb >= 0 ? " · " + subName(c.sb) : "");
    var meta = '<p class="meta"><span class="who">' + sym((cmById[c.c] || {}).ic) + esc(who) + "</span><span>" + esc(L("ครั้งที่ ", "No. ") + c.n + "/" + c.y) + "</span><span>" + esc(fmt(c.d)) + (c.tm ? esc(L(" เวลา " + c.tm + " น.", " " + c.tm)) : "") + "</span></p>";
    // excerpt: the agenda item that matched, else the summary
    var ex = "", items = c.it || [], itemsT = en ? (c.ite || []) : items.map(function (x) { return x[0]; });
    var mask = r.mask[c.id] || 0;
    if (c.ph) ex = '<p class="ex ph">' + L("ยังไม่มีสรุปอ่านง่ายของการประชุมนี้ในเว็บไซต์นี้ ท่านเปิดอ่านเอกสารทางการได้จากปุ่มด้านล่าง", "There is no easy-read summary of this meeting on this site yet. The official document is linked below.") + "</p>";
    else {
      var s = en ? c.se || "" : c.s || "";
      var iHit = -1, k;
      for (k = 0; k < itemsT.length; k++) if (firstHit(itemsT[k]) >= 0) { iHit = k; break; }
      var sHit = firstHit(s);
      if (sHit >= 0 || iHit < 0) ex = '<p class="ex">' + mark(cut(s, Math.max(0, sHit))) + "</p>";
      if (iHit >= 0 && sHit < 0) ex += '<p class="ex"><span class="lab">' + esc(!en && items[iHit] && items[iHit][1] ? items[iHit][1] : L("วาระ", "Agenda item")) + ":</span> " + mark(cut(itemsT[iHit], firstHit(itemsT[iHit]), 150)) + "</p>";
    }
    var where = [];
    FIELD.forEach(function (f, i) { if (f[0] && (mask & (1 << i)) && i !== 5) where.push(L(f[0], f[1])); });
    var mi = where.length ? '<p class="mi">' + esc(L("พบคำค้นใน: ", "Found in: ") + where.join(L(" · ", ", "))) + "</p>" : "";
    var tags = (en ? c.tge || c.tg : c.tg) || [];
    var tg = tags.length ? '<div class="tg">' + tags.slice(0, 5).map(function (x, i) { return '<button type="button" data-q="' + esc((c.tg || [])[i] || x) + '">' + mark(x) + "</button>"; }).join("") + "</div>" : "";
    var act = '<div class="act">';
    if (c.u && !c.ph) act += '<a class="btn" href="' + esc(safeUrl(c.u)) + '">' + ic("i-doc") + L("อ่านสรุป", "Read summary") + "</a>";
    else if (c.u) act += '<a class="btn ghost" href="' + esc(safeUrl(c.u)) + '">' + L("ดูในคลังการประชุม", "Open in the archive") + "</a>";
    (c.v || []).slice(0, 2).forEach(function (v, i) {
      var lab = en ? ((c.ve || [])[i] || (v.k === "pre" ? "Pre-meeting video" : "Video summary")) : v.l || (v.k === "pre" ? "วิดีโอก่อนการประชุม" : "วิดีโอสรุป");
      act += '<a class="btn ghost" href="' + esc(safeUrl(v.h)) + '">' + ic("i-play") + esc(lab) + (v.du ? " · " + esc(v.du) : "") + "</a>";
    });
    if (c.du0) act += '<a class="btn ghost" href="' + esc(safeUrl(c.du0)) + '" target="_blank" rel="noopener">' + ic("i-ext") + esc(L((DOC[c.dk0] || DOC.doc)[0], (DOC[c.dk0] || DOC.doc)[1])) + "</a>";
    act += "</div>";
    return '<li class="card">' + kind + '<h3><a href="' + esc(safeUrl(c.u || "#")) + '">' + mark(t) + "</a></h3>" + meta + ex + mi + tg + act + "</li>";
  }
  function video(c) {
    var en = lang === "en";
    var t = en ? c.te || c.t : c.t;
    var who = cmName(c.c) + (c.sb >= 0 ? " · " + subName(c.sb) : "");
    var capHit = firstHit(c.cap);
    return '<li class="card vid">' + (c.po ? '<img src="' + esc(safeUrl(c.po)) + '" alt="" loading="lazy" width="72" height="128">' : "<span></span>") + "<div>" +
      '<p class="k">' + ic("i-play") + (c.vk === "pre" ? L("วิดีโอก่อนการประชุม", "Pre-meeting video") : L("วิดีโอสรุปผลการประชุม", "Post-meeting video")) + "</p>" +
      '<h3><a href="' + esc(safeUrl(c.u)) + '">' + mark(t) + "</a></h3>" +
      '<p class="meta"><span>' + esc(who) + "</span><span>" + esc(L("ครั้งที่ ", "No. ") + c.n + "/" + c.y) + "</span><span>" + esc(fmt(c.d)) + "</span>" + (c.du ? "<span>" + esc(L("ยาว " + c.du + " นาที", c.du + " min")) + "</span>" : "") + "</p>" +
      (capHit >= 0 && !en ? '<p class="ex"><span class="lab">' + L("คำบรรยาย:", "Narration:") + "</span> " + mark(cut(c.cap, capHit, 150)) + "</p>" : "") +
      '<div class="act"><a class="btn" href="' + esc(safeUrl(c.u)) + '">' + ic("i-play") + L("ดูวิดีโอ", "Watch") + "</a>" + (c.mu ? '<a class="btn ghost" href="' + esc(safeUrl(c.mu)) + '">' + L("อ่านสรุปการประชุม", "Read the meeting") + "</a>" : "") + "</div></div></li>";
  }
  function card(c, r) {
    if (!c) return "";
    if (c.k === "m") return meeting(c, r);
    if (c.k === "v") return video(c);
    return "<li>" + ent(c) + "</li>";
  }

  /* ---------- search + render ---------- */
  var R = null, shown = 0, PAGE = 20, seq = 0;
  function chip(label, act, val, title) {
    return '<button type="button" class="chip" data-act="' + act + '" data-val="' + esc(val || "") + '" aria-label="' + esc(L("เอาออก: ", "Remove: ") + (title || label)) + '">' + esc(label) + ic("i-x") + "</button>";
  }
  function yearLabel(f) { return f.y0 === f.y1 ? L("ปี " + f.y0, "Year " + (f.y0 - 543) + " (" + f.y0 + " BE)") : L("ปี " + f.y0 + "–" + f.y1, (f.y0 - 543) + "–" + (f.y1 - 543)); }
  function drawUnderstood(r) {
    var f = r.filters, h = [];
    var own = userFilters();
    if (f.type) h.push(chip(L("ประเภท: ", "Type: ") + L(TYPE_NAME[f.type][0], TYPE_NAME[f.type][1]), "rm", "type"));
    if (f.cid) h.push(chip(L("คณะ: ", "Committee: ") + cmName(f.cid), "rm", "cid"));
    if (f.y0) h.push(chip(yearLabel(f), "rm", "y"));
    if (f.n) h.push(chip(L("ครั้งที่ " + f.n, "Meeting no. " + f.n), "rm", "n"));
    if (f.sort === "new") h.push(chip(L("ใหม่ล่าสุดก่อน", "Newest first"), "rm", "sort"));
    if (f.sort === "old") h.push(chip(L("เก่าที่สุดก่อน", "Oldest first"), "rm", "sort"));
    if (f.video) h.push(chip(L("มีวิดีโอ", "Has video"), "rm", "video"));
    if (f.doc) h.push(chip(L("มีเอกสารทางการ", "Has official document"), "rm", "doc"));
    if (f.up) h.push(chip(L("นัดที่กำลังจะมาถึง", "Upcoming"), "rm", "up"));
    var auto = Object.keys(f).some(function (k) { return f[k] && own[k] == null; });
    var out = h.length ? '<span class="lbl">' + (auto ? L("ค้นหาแบบนี้:", "Searching for:") : L("ตัวกรอง:", "Filters:")) + "</span>" + h.join("") : "";
    var n = r.notes;
    if (n.corrected.length) out += '<p class="note">' + esc(L("ค้นหาคำว่า ", "Showing results for ")) + "<b>" + esc(n.corrected.map(function (c) { return c.to; }).join(", ")) + "</b>" +
      esc(L(" แทน ", " instead of ")) + "“" + esc(n.corrected.map(function (c) { return c.from; }).join(", ")) + "” · <button type=\"button\" data-act=\"exact\">" + esc(L("ค้นหาตามที่พิมพ์", "Search exactly as typed")) + "</button></p>";
    else if (n.expanded.length) out += '<p class="note">' + esc(L("รวมคำที่ขึ้นต้นด้วย “", "Including words starting with “") + n.expanded.map(function (c) { return c.from; }).join(", ") + L("” เช่น ", "”, e.g. ") + n.expanded[0].to.join(", ")) + "</p>";
    if (n.didYouMean.length) out += '<p class="note">' + esc(L("หมายถึง ", "Did you mean ")) + n.didYouMean.map(function (w) { return '<button type="button" data-q="' + esc(w) + '">' + esc(w) + "</button>"; }).join(L(" หรือ ", " or ")) + " ?</p>";
    if (n.partial) out += '<p class="note">' + esc(L("ไม่พบรายการที่มีครบทุกคำที่ค้นหา ด้านล่างคือรายการที่ตรงบางคำ", "No record contains every word you searched for. Below are records that match some of the words.")) + "</p>";
    $("und").innerHTML = out;
  }
  function drawTabs(r) {
    var ft = r.facets.type, cur = r.filters.type || "";
    var tabs = [["", L("ทั้งหมด", "All")], ["m", 0], ["v", 0], ["c", 0], ["p", 0], ["t", 0], ["doc", 0]];
    $("tabs").innerHTML = tabs.map(function (t) {
      var k = t[0], name = t[1] || L(TYPE_NAME[k][0], TYPE_NAME[k][1]), n = k ? ft[k] || 0 : null;
      if (k && !n && cur !== k) return "";
      return '<button type="button" class="tab" data-type="' + k + '" aria-pressed="' + (cur === k) + '">' + esc(name) + (n != null ? ' <span class="n">' + n.toLocaleString() + "</span>" : "") + "</button>";
    }).join("");
  }
  function drawFilters(r) {
    var f = r.filters, fc = r.facets, h = "";
    var cids = eng.cm.filter(function (c) { return fc.cid[c.id] || c.id === f.cid; });
    h += '<label class="f">' + L("คณะกรรมาธิการ", "Committee") + '<select id="f-cid"><option value="">' + L("ทุกคณะ", "All committees") + "</option>" + cids.map(function (c) { return '<option value="' + esc(c.id) + '"' + (f.cid === c.id ? " selected" : "") + ">" + esc(cmName(c.id)) + " (" + (fc.cid[c.id] || 0) + ")</option>"; }).join("") + "</select></label>";
    var ys = Object.keys(fc.y).map(Number).sort(function (a, b) { return b - a; });
    var ycur = f.y0 ? (f.y0 === f.y1 ? String(f.y0) : f.y0 + "-" + f.y1) : "";
    h += '<label class="f">' + L("ปี", "Year") + '<select id="f-y"><option value="">' + L("ทุกปี", "All years") + "</option>" + (ycur && ys.indexOf(+ycur) < 0 ? '<option value="' + esc(ycur) + '" selected>' + esc(yearLabel(f)) + "</option>" : "") + ys.map(function (y) { return '<option value="' + y + '"' + (ycur === String(y) ? " selected" : "") + ">" + esc(L(String(y), (y - 543) + " (" + y + " BE)")) + " (" + fc.y[y] + ")</option>"; }).join("") + "</select></label>";
    h += '<label class="f">' + L("เรียงลำดับ", "Sort by") + '<select id="f-sort"><option value="">' + L("ตรงกับคำค้นมากที่สุด", "Most relevant") + '</option><option value="new"' + (f.sort === "new" ? " selected" : "") + ">" + L("ใหม่ล่าสุดก่อน", "Newest first") + '</option><option value="old"' + (f.sort === "old" ? " selected" : "") + ">" + L("เก่าที่สุดก่อน", "Oldest first") + "</option></select></label>";
    h += '<div><label class="ck"><input type="checkbox" id="f-video"' + (f.video ? " checked" : "") + ">" + L("เฉพาะที่มีวิดีโอ", "Only with a video") + '</label><label class="ck"><input type="checkbox" id="f-doc"' + (f.doc ? " checked" : "") + ">" + L("เฉพาะที่มีเอกสารทางการ", "Only with an official document") + '</label><label class="ck"><input type="checkbox" id="f-up"' + (f.up ? " checked" : "") + ">" + L("เฉพาะนัดประชุมที่กำลังจะมาถึง", "Only upcoming meetings") + "</label></div>";
    $("fbody").innerHTML = h;
    var n = ["cid", "y0", "sort", "video", "doc", "up"].filter(function (k) { return f[k]; }).length;
    $("fcount").hidden = !n; $("fcount").textContent = n;
  }
  function statusText(r) {
    if (!r.total && !r.best.length) return "";
    var n = r.total.toLocaleString();
    var what = r.filters.type ? L(TYPE_NAME[r.filters.type][0], TYPE_NAME[r.filters.type][1].toLowerCase()) : L("รายการ", "results");
    return r.q ? L("พบ " + n + " " + what + " สำหรับ “" + r.q + "”", n + " " + what + " for “" + r.q + "”") : L("พบ " + n + " " + what, n + " " + what);
  }
  function drawEmpty(r) {
    var h = "<h2>" + esc(L("ไม่พบผลลัพธ์ที่ตรงกับคำค้น", "No matching results")) + "</h2><p>" + esc(L("ลองใช้คำที่ใกล้เคียงหรือขยายช่วงเวลาการค้นหา", "Try a similar word, or widen the time range.")) + "</p>";
    var f = r.filters, any = ["type", "cid", "y0", "n", "video", "doc", "up"].some(function (k) { return f[k]; });
    if (any) h += '<div class="row"><button type="button" class="btn" data-act="clear">' + esc(L("ค้นหาโดยไม่ใช้ตัวกรอง", "Search without filters")) + "</button></div>";
    if (r.related.length) h += "<h2>" + esc(L("หัวข้อที่ใกล้เคียง", "Related topics")) + '</h2><div class="row">' + r.related.slice(0, 6).map(function (g) { var w = lang === "en" ? g.en[0] : g.th[0]; return '<button type="button" class="chip plain" data-q="' + esc(w) + '">' + esc(w) + "</button>"; }).join("") + "</div>";
    h += "<h2>" + esc(L("หรือลองค้นหา", "Or try")) + '</h2><div class="row">' + examples().slice(0, 6).map(function (w) { return '<button type="button" class="chip plain" data-q="' + esc(w) + '">' + esc(w) + "</button>"; }).join("") + "</div>";
    $("empty").innerHTML = h; $("empty").hidden = false;
  }
  function examples() { return lang === "en" ? ["flood", "border security", "PM2.5", "migrant workers", "public health", "latest meetings"] : ["น้ำท่วม", "ชายแดน", "ฝุ่น PM2.5", "แรงงานต่างด้าว", "สาธารณสุข", "ประชุมล่าสุด", "พ.ร.บ.", "ภัยแล้ง"]; }
  function drawStart() {
    var h = "<h2>" + esc(L("ลองค้นหา", "Try searching")) + '</h2><div class="row">' + examples().map(function (w) { return '<button type="button" class="chip plain" data-q="' + esc(w) + '">' + esc(w) + "</button>"; }).join("") + "</div>";
    h += "<h2>" + esc(L("หรือดูการประชุมของคณะ", "Or browse a committee's meetings")) + '</h2><div class="row">' + eng.cm.filter(function (c) { return c.have; }).map(function (c) { return '<button type="button" class="chip plain" data-cid="' + esc(c.id) + '">' + esc(cmName(c.id)) + "</button>"; }).join("") + "</div>";
    $("start").innerHTML = h; $("start").hidden = false;
  }
  function drawAbout() {
    var m = eng.man, cv = m.coverage || {}, ct = m.counts || {};
    var built = m.built ? C.fmtDate(m.built.slice(0, 10), lang, true) : "";
    $("about-b").innerHTML = "<p>" + esc(L("ค้นจากข้อมูลที่เผยแพร่ในเว็บไซต์นี้เท่านั้น:", "Searches only what is published on this site:")) + "</p><ul>" +
      "<li>" + esc(L("การประชุม " + (ct.meetings || 0).toLocaleString() + " ครั้ง (มีสรุปอ่านง่าย " + (cv.with_summary_text || 0).toLocaleString() + " ครั้ง ที่เหลือมีเฉพาะลิงก์เอกสารทางการ หรือเป็นนัดประชุม)", (ct.meetings || 0).toLocaleString() + " meetings (" + (cv.with_summary_text || 0).toLocaleString() + " with an easy-read summary; the rest have only an official document link or are announced meetings)")) + "</li>" +
      "<li>" + esc(L("วาระการประชุม คำสำคัญ ชื่อประธาน และคำแปลภาษาอังกฤษของสรุปแต่ละครั้ง", "Agenda items, keywords, chairs and the English translation of each summary")) + "</li>" +
      "<li>" + esc(L("คำบรรยายในวิดีโอ " + (ct.videos || 0) + " เรื่อง", "Narration of " + (ct.videos || 0) + " videos")) + "</li>" +
      "<li>" + esc(L("คณะกรรมาธิการ " + ct.committees + " คณะ คณะอนุกรรมาธิการ " + ct.subcommittees + " คณะ และสมาชิกวุฒิสภา " + ct.senators + " ท่าน", ct.committees + " committees, " + ct.subcommittees + " subcommittees and " + ct.senators + " senators")) + "</li></ul>" +
      "<p><b>" + esc(L("ยังไม่ได้ค้นข้อความภายในไฟล์ PDF ของสำนักงานเลขาธิการวุฒิสภา", "The text inside the Senate Secretariat's PDF files is not searched yet.")) + "</b> " + esc(L("หากไม่พบ โปรดเปิดเอกสารทางการของการประชุมนั้นโดยตรง", "If you cannot find something, please open that meeting's official document.")) + "</p>" +
      (built ? "<p>" + esc(L("ปรับปรุงข้อมูลสำหรับค้นหาล่าสุด: ", "Search data last updated: ") + built) + "</p>" : "");
  }
  function skeleton() { $("list").innerHTML = '<li class="skel"></li><li class="skel"></li><li class="skel"></li>'; }

  function run(push) {
    var my = ++seq;
    writeURL(push);
    $("q").value = S.q;
    $("qx").hidden = !S.q;
    $("app").classList.toggle("has-q", !!(S.q || Object.keys(userFilters()).length));
    var has = S.q || Object.keys(userFilters()).length;
    if (!has) { R = null; $("bar").hidden = true; $("best").hidden = true; $("list").innerHTML = ""; $("more").hidden = true; $("empty").hidden = true; $("und").innerHTML = ""; $("status").textContent = ""; boot().then(drawStart); document.title = L("ค้นหาในคลังการประชุม · ParliamentX", "Search the meeting archive · ParliamentX"); return Promise.resolve(); }
    $("start").hidden = true; $("empty").hidden = true;
    skeleton();
    return boot().then(function () {
      return eng.search(S.q, { filters: userFilters(), drop: S.drop, exact: !!S.exact });
    }).then(function (r) {
      if (my !== seq) return;
      R = r; setHL(r.hl);
      document.title = (S.q ? S.q + " · " : "") + L("ค้นหา · ParliamentX", "Search · ParliamentX");
      drawUnderstood(r); drawTabs(r); drawFilters(r);
      $("bar").hidden = false;
      $("status").textContent = statusText(r);
      shown = 0; $("list").innerHTML = "";
      var bestIds = r.best || [];
      var first = r.ids.slice(0, PAGE);
      return eng.cards(bestIds.concat(first), lang).then(function (cs) {
        if (my !== seq) return;
        var b = cs.slice(0, bestIds.length).filter(Boolean);
        $("best").innerHTML = b.length ? "<h2>" + esc(L("ตรงกับคำค้นที่สุด", "Best matches")) + "</h2>" + b.map(function (c) { return ent(c); }).join("") : "";
        $("best").hidden = !b.length;
        $("list").innerHTML = cs.slice(bestIds.length).map(function (c) { return card(c, r); }).join("");
        shown = first.length;
        if (!r.total && !b.length) drawEmpty(r); else $("empty").hidden = true;
        moreBtn();
      });
    }).catch(function (e) {
      if (my !== seq) return;
      $("list").innerHTML = ""; $("status").textContent = "";
      $("empty").innerHTML = "<h2>" + esc(L("ขออภัย โหลดข้อมูลสำหรับค้นหาไม่สำเร็จ", "Sorry, the search data could not be loaded")) + "</h2><p>" + esc(L("โปรดตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง", "Please check your connection and try again.")) + '</p><div class="row"><button type="button" class="btn" data-act="retry">' + esc(L("ลองอีกครั้ง", "Try again")) + "</button></div>";
      $("empty").hidden = false; ready = null; eng = new E({ base: "idx/", fetchJSON: fetchJSON }); manP = null;
      if (window.console) console.warn(e);
    });
  }
  function moreBtn() {
    var left = R ? R.ids.length - shown : 0;
    $("more").hidden = left <= 0;
    if (left > 0) $("more").textContent = L("แสดงเพิ่มอีก " + Math.min(PAGE, left) + " รายการ (เหลือ " + left.toLocaleString() + ")", "Show " + Math.min(PAGE, left) + " more (" + left.toLocaleString() + " left)");
  }
  $("more").addEventListener("click", function () {
    if (!R) return; var r = R, ids = r.ids.slice(shown, shown + PAGE);
    eng.cards(ids, lang).then(function (cs) {
      if (r !== R) return;
      var tmp = document.createElement("ol"); tmp.innerHTML = cs.map(function (c) { return card(c, r); }).join("");
      var firstNew = tmp.firstElementChild;
      while (tmp.firstChild) $("list").appendChild(tmp.firstChild);
      shown += ids.length; moreBtn();
      if (firstNew) { var a = firstNew.querySelector("h3 a,button,a"); if (a) a.focus({ preventScroll: false }); }
    });
  });

  /* ---------- actions ---------- */
  function go(q, keep) {
    S.q = String(q || "").trim().slice(0, 200);
    if (!keep) { S.type = ""; S.cid = ""; S.y = ""; S.sort = ""; S.video = ""; S.doc = ""; S.up = ""; }
    S.drop = []; S.exact = "";
    closeSug(); run(true);
  }
  function removeFilter(k) {
    var own = userFilters();
    var map = { y: "y", type: "type", cid: "cid", sort: "sort", video: "video", doc: "doc", up: "up", n: "n" };
    var key = map[k];
    if (key && key !== "n" && (own[key] != null || (key === "y" && own.y0))) S[key] = "";
    else if (S.drop.indexOf(k) < 0) S.drop.push(k);
    run(true);
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest ? e.target.closest("[data-act],[data-q],[data-cid],[data-type]") : null;
    if (!t || !$("app").contains(t)) return;
    if (t.hasAttribute("data-type") && t.classList.contains("tab")) { S.type = t.getAttribute("data-type"); S.drop = S.drop.filter(function (x) { return x !== "type"; }); if (!S.type && R && R.parsed.filters.type) S.drop.push("type"); run(true); return; }
    if (t.hasAttribute("data-cid") && !t.hasAttribute("data-q")) { S.cid = t.getAttribute("data-cid"); S.drop = []; if (t.closest("#start")) { S.q = ""; S.type = "m"; S.sort = "new"; } run(true); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (t.hasAttribute("data-q")) { go(t.getAttribute("data-q")); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    var a = t.getAttribute("data-act");
    if (a === "rm") removeFilter(t.getAttribute("data-val"));
    else if (a === "exact") { S.exact = "1"; run(true); }
    else if (a === "clear") { S.type = S.cid = S.y = S.sort = S.video = S.doc = S.up = ""; S.drop = ["type", "cid", "y", "n", "sort"]; run(true); }
    else if (a === "retry") run(false);
  });
  $("fbody").addEventListener("change", function (e) {
    var id = e.target.id;
    if (id === "f-cid") { S.cid = e.target.value; if (!S.cid) S.drop.push("cid"); }
    else if (id === "f-y") { S.y = e.target.value; if (!S.y) S.drop.push("y"); }
    else if (id === "f-sort") { S.sort = e.target.value; if (!S.sort) S.drop.push("sort"); }
    else if (id === "f-video" || id === "f-doc" || id === "f-up") S[id.slice(2)] = e.target.checked ? "1" : "";
    else return;
    run(true).then(function () { var el = $(id); if (el) el.focus(); });
  });
  $("f").addEventListener("submit", function (e) {
    e.preventDefault();
    var a = activeOpt();
    if (a) { pick(a); return; }
    go($("q").value);
    $("q").blur();
  });
  $("qx").addEventListener("click", function () { $("q").value = ""; $("qx").hidden = true; closeSug(); $("q").focus(); });
  window.addEventListener("popstate", function () { readURL(); run(false); });

  /* ---------- suggestions (combobox) ---------- */
  var sugT = 0, composing = false, act = -1, opts = [];
  function closeSug() {
    var s = $("sug"); if (s.hidden) return;
    $("q").setAttribute("aria-expanded", "false"); $("q").removeAttribute("aria-activedescendant"); act = -1;
    s.classList.add("out"); setTimeout(function () { s.hidden = true; s.classList.remove("out"); }, 120);
  }
  function activeOpt() { return act >= 0 && !$("sug").hidden ? opts[act] : null; }
  function setAct(i) {
    var els = $("sug").querySelectorAll("[role=option]");
    els.forEach(function (el, k) { el.setAttribute("aria-selected", String(k === i)); });
    act = i;
    if (i >= 0 && els[i]) { $("q").setAttribute("aria-activedescendant", els[i].id); els[i].scrollIntoView({ block: "nearest" }); } else $("q").removeAttribute("aria-activedescendant");
  }
  function pick(o) {
    closeSug();
    if (o.href) { location.href = o.href; return; }
    go(o.q);
  }
  function suggest() {
    var v = $("q").value, k = v.trim();
    $("qx").hidden = !v;
    if (!k) { closeSug(); return; }
    boot().then(function () {
      if ($("q").value !== v) return;
      var s = eng.suggestNow(k), h = "", i = 0; opts = [];
      var add = function (o, inner) { opts.push(o); h += '<li role="option" id="so-' + i + '" aria-selected="false" data-i="' + i + '">' + inner + "</li>"; i++; };
      add({ q: k }, '<span class="oi">' + ic("i-search") + "</span><span>" + esc(L("ค้นหา “", "Search for “")) + "<b>" + esc(k) + "</b>”<small>" + esc(L("การประชุม วาระ สรุป วิดีโอ ทั้งหมด", "All meetings, agendas, summaries and videos")) + "</small></span>");
      if (s.abbr) h += '<li class="abbr" role="presentation">' + esc(L("รวมคำเต็ม: ", "Also searching: ") + s.abbr.slice(0, 3).join(" · ")) + "</li>";
      if (s.committees.length) { h += '<li class="gh" role="presentation">' + esc(L("คณะกรรมาธิการ", "Committees")) + "</li>"; s.committees.forEach(function (c) { var href = c.have ? "/" + (c.id === "public-admin" ? "committee-archive-2569" : c.id + "/2569") + "/" : c.senate; add({ q: "", cid: c.id, href: null, c: c }, sym(c.ic) + "<span>" + esc(cmName(c.id, true)) + "<small>" + esc(c.have ? L("ค้นการประชุมของคณะนี้", "Search this committee's meetings") : L("ยังไม่มีในเว็บไซต์นี้", "Not on this site yet")) + "</small></span>"); opts[opts.length - 1].href = c.have ? null : href; }); }
      if (s.subs.length) { h += '<li class="gh" role="presentation">' + esc(L("คณะอนุกรรมาธิการ", "Subcommittees")) + "</li>"; s.subs.forEach(function (x) { add({ href: x.u }, sym((cmById[x.cid] || {}).ic) + "<span>" + esc(lang === "en" ? x.en || x.th : x.th) + "<small>" + esc(cmName(x.cid)) + "</small></span>"); }); }
      if (s.people.length) { h += '<li class="gh" role="presentation">' + esc(L("สมาชิกวุฒิสภา", "Senators")) + "</li>"; s.people.forEach(function (p) { add({ href: p.h }, (p.img ? '<img src="' + esc(safeUrl(p.img)) + '" alt="" loading="lazy">' : '<span class="oi">' + ic("i-person") + "</span>") + "<span>" + esc(p.n) + "<small>" + esc(((lang === "en" ? p.re : p.r) || [])[0] || "") + "</small></span>"); }); }
      if (s.topics.length) { h += '<li class="gh" role="presentation">' + esc(L("หัวข้อ", "Topics")) + "</li>"; s.topics.slice(0, 5).forEach(function (t) { var w = lang === "en" && t[1] ? t[1] : t[0]; add({ q: t[0] }, '<span class="oi">' + ic("i-tag") + "</span><span>" + esc(w) + (t[2] ? "<small>" + esc(L(t[2] + " การประชุม", t[2] + " meetings")) + "</small>" : "") + "</span>"); }); }
      var el = $("sug"); el.innerHTML = h; el.hidden = false; el.classList.remove("out");
      $("q").setAttribute("aria-expanded", "true"); act = -1;
    }).catch(function () {});
  }
  // a committee picked from the list: search that committee's meetings
  var _pick = pick;
  pick = function (o) {
    if (o.c && o.c.have) { closeSug(); S.q = ""; S.type = "m"; S.cid = o.c.id; S.sort = "new"; S.y = S.video = S.doc = S.up = ""; S.drop = []; S.exact = ""; run(true); return; }
    _pick(o);
  };
  $("q").addEventListener("compositionstart", function () { composing = true; });
  $("q").addEventListener("compositionend", function () { composing = false; clearTimeout(sugT); sugT = setTimeout(suggest, 120); });
  $("q").addEventListener("input", function () { if (composing) return; clearTimeout(sugT); sugT = setTimeout(suggest, 120); });
  $("q").addEventListener("focus", function () { boot(); });
  $("q").addEventListener("keydown", function (e) {
    var n = opts.length, open = !$("sug").hidden;
    if (e.key === "ArrowDown") { e.preventDefault(); if (!open) { suggest(); return; } setAct(act + 1 >= n ? 0 : act + 1); }
    else if (e.key === "ArrowUp") { if (!open) return; e.preventDefault(); setAct(act - 1 < 0 ? n - 1 : act - 1); }
    else if (e.key === "Escape") { if (open) { e.preventDefault(); closeSug(); } }
  });
  $("sug").addEventListener("mousedown", function (e) { e.preventDefault(); });
  $("sug").addEventListener("click", function (e) { var li = e.target.closest("[role=option]"); if (li) pick(opts[+li.getAttribute("data-i")]); });
  document.addEventListener("click", function (e) { if (!$("f").contains(e.target)) closeSug(); });

  /* ---------- voice (only where the browser offers it; the browser's own speech service hears the words) ---------- */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    var mic = $("qmic"), rec = null; mic.hidden = false;
    mic.addEventListener("click", function () {
      if (rec) { rec.stop(); return; }
      rec = new SR(); rec.lang = lang === "en" ? "en-US" : "th-TH"; rec.interimResults = true; rec.maxAlternatives = 1;
      mic.classList.add("on"); mic.setAttribute("aria-pressed", "true");
      rec.onresult = function (ev) { var t = ""; for (var i = 0; i < ev.results.length; i++) t += ev.results[i][0].transcript; $("q").value = t; if (ev.results[ev.results.length - 1].isFinal) go(t); };
      rec.onend = rec.onerror = function () { mic.classList.remove("on"); mic.setAttribute("aria-pressed", "false"); rec = null; };
      try { rec.start(); } catch (x) { rec = null; mic.classList.remove("on"); }
    });
  }

  /* ---------- static text in the reader's language ---------- */
  function texts() {
    document.documentElement.lang = lang;
    $("h1").textContent = L("ค้นหาในคลังการประชุม", "Search the meeting archive");
    $("lead").textContent = L("ค้นได้ทั้งการประชุม วาระ สรุปผล วิดีโอ คณะกรรมาธิการ และสมาชิกวุฒิสภา พิมพ์ภาษาไทยหรือภาษาอังกฤษก็ได้", "Search meetings, agenda items, summaries, videos, committees and senators, in Thai or English.");
    $("q").placeholder = L("ค้นหาการประชุม คณะกรรมาธิการ สว. หรือหัวข้อที่สนใจ...", "Search meetings, committees, senators, or policy topics...");
    $("qlab").textContent = L("คำค้นหา", "Search words");
    $("qhelp").textContent = L("พิมพ์แล้วจะมีคำแนะนำ ใช้ลูกศรขึ้นลงเพื่อเลือก", "Suggestions appear as you type; use the arrow keys to choose.");
    $("qgo").textContent = L("ค้นหา", "Search");
    $("qx").setAttribute("aria-label", L("ล้างคำค้นหา", "Clear"));
    $("qmic").setAttribute("aria-label", L("พูดเพื่อค้นหา", "Search by voice"));
    $("sug").setAttribute("aria-label", L("คำแนะนำ", "Suggestions"));
    $("tabs").setAttribute("aria-label", L("ประเภทผลการค้นหา", "Result type"));
    $("filt-t").textContent = L("ตัวกรองและการเรียงลำดับ", "Filters and sorting");
    $("about-t").textContent = L("ค้นจากข้อมูลอะไรบ้าง", "What this search covers");
    $("priv").textContent = L("การค้นหาประมวลผลในเครื่องของท่าน เว็บไซต์นี้ไม่บันทึกคำค้นหา ไม่ใช้คุกกี้ และไม่เก็บสถิติการค้นหา" + (SR ? " ปุ่มไมโครโฟนใช้ระบบรับเสียงของเบราว์เซอร์ เสียงของท่านจะถูกส่งไปแปลงเป็นข้อความที่ผู้ให้บริการเบราว์เซอร์ (เช่น Google หรือ Apple) เฉพาะเมื่อท่านกดปุ่ม" : ""),
      "Your search is processed on your own device. This site does not record what you search, uses no cookies and keeps no search statistics." + (SR ? " The microphone button uses your browser's speech input: your voice goes to the browser's provider (such as Google or Apple) to be turned into text, only when you press it." : ""));
  }
  function start() {
    eng.cm = eng.cm || [];
    texts(); readURL();
    boot().then(function () { eng.cm.forEach(function (c) { cmById[c.id] = c; }); drawAbout(); });
    boot().then(function () { return run(false); }).catch(function () { run(false); });
    if (!S.q && !location.search) setTimeout(function () { try { $("q").focus({ preventScroll: true }); } catch (e) {} }, 50);
  }
  // the site's language switch: English is applied without a reload, Thai reloads the page
  new MutationObserver(function () {
    var l = document.documentElement.lang === "en" ? "en" : "th";
    if (l !== lang) { lang = l; texts(); if (eng.man) drawAbout(); run(false); }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  start();
})();
