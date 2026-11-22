#!/usr/bin/env bash
# Bundle item 161 agri37_39_live20_summaries (Agriculture archive thread, 23 Nov 2569; asked by "Site: Update automatically three times a day")
# Easy-read text from the Senate's published papers (all Rpublic=1, each checked to be the 2569 meeting):
# 1) Main 37/2569 (2 Nov 2569): press release ฉบับที่ ๓๗/๒๕๖๙ (ref 11217030) + agenda (ref 11216636); was an agenda card.
# 2) Main 38/2569 (9 Nov 2569): press release ฉบับที่ ๓๘/๒๕๖๙ (ref 11217130) + agenda (11217104) + minutes (11226152); was "upcoming".
# 3) Main 39/2569 (16 Nov 2569): press release ฉบับที่ ๓๙/๒๕๖๙ (ref 11225869) + agenda (ref 11217507); was "upcoming".
# 4) Livestock subcommittee 20/2569 (18 Nov 2569): newsletter (ref 11216511, image PDF read by eye) + agenda (ref 11216509);
#    time 14.00, room CA 319 ชั้น 3, chair นายฤชุ แก้วลาย; was a placeholder ("pending").
# Surgical, like items 132/146: each record is replaced by the new build's record, keeping the live "media" (video) field;
# SHARE_V for 37/38/39 and livestock 20; new share pages s/37.html, s/38.html, s/39.html, s/livestock-20.html with their card images and
# QR codes; livestock meeting 20 in SUBS on index.html; new English lines in i18n-en.json. Nothing else changes.
# Idempotent; no git, no network. Needs $HUB. Independent of items 146 and 160 (any order).
set -euo pipefail
: "${HUB:?HUB not set}"
F="${ITEM_FILES:-/mnt/project-files/archive/bundle/items/161_agri37_39_live20_summaries_files}"
L="$HUB/agriculture/2569"
for p in index.html sub-livestock.html meetings.json sub-livestock.json i18n-en.json; do
  test -f "$L/$p" || { echo "161: $L/$p missing" >&2; exit 1; }
done
for p in s/37.html s/38.html s/39.html s/livestock-20.html \
         img/s/37-296c17d1.jpg img/s/38-99fd2a71.jpg img/s/39-104b4a8c.jpg img/s/livestock-20-b341dece.jpg \
         img/s/qr-37.svg img/s/qr-38.svg img/s/qr-39.svg img/s/qr-livestock-20.svg; do
  mkdir -p "$(dirname "$L/$p")"
  cmp -s "$F/$p" "$L/$p" || cp -f "$F/$p" "$L/$p"
done
python3 - "$L" "$F" <<'PY'
import json, os, re, sys
L, F = sys.argv[1], sys.argv[2]
P = json.load(open(os.path.join(F, "patch.json"), encoding="utf-8"))
dump = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))
hit = set()

def repl(recs, tag):
    def f(lst):
        out = []
        for x in lst:
            e = recs.get(str(x.get("n")))
            if e and x.get("date") == e["date"] and not x.get("cancelled"):
                y = dict(e)
                if "media" in x: y["media"] = x["media"]
                x = y; hit.add(f"{tag}{e['n']}")
            out.append(x)
        return out
    return f

def sub_line(h, pat, fn):
    m = re.search(pat, h, re.M)
    if not m: raise SystemExit(f"161: pattern {pat[:30]} not found")
    return h[:m.start(1)] + fn(m.group(1)) + h[m.end(1):]

def share(h, upd):
    def f(s):
        S = json.loads(s)
        if all(S.get(k) == v for k, v in upd.items()): return s
        S.update(upd); return json.dumps(S, ensure_ascii=False)
    return sub_line(h, r"SHARE_V=(\{[^}]*\})", f)

def subs(h):
    def f(s):
        S = json.loads(s); m20 = P["subs_live20"]
        for e in S:
            if e.get("key") == "livestock":
                e["meetings"] = [m20 if (m.get("n") == 20 and m.get("date") == m20["date"]) else m for m in e.get("meetings") or []]
        return json.dumps(S, ensure_ascii=False)
    return sub_line(h, r"^const SUBS=(.*);$", f)

def page(fn, fx, upd, extra=None):
    hp = os.path.join(L, fn); h = open(hp, encoding="utf-8").read(); h0 = h
    h = sub_line(h, r"^const DATA=(\[.*\]);$", lambda s: dump(fx(json.loads(s))))
    h = share(h, upd)
    if extra: h = extra(h)
    if h != h0: open(hp, "w", encoding="utf-8").write(h)

def jfile(fn, fx):
    jp = os.path.join(L, fn); raw = open(jp, encoding="utf-8").read()
    J = fx(json.loads(raw))
    ind = 1 if raw.lstrip().startswith("[\n") else None
    out = json.dumps(J, ensure_ascii=False, indent=ind) + ("\n" if raw.endswith("\n") else "")
    if out != raw: open(jp, "w", encoding="utf-8").write(out)

page("index.html", repl(P["main"], "main"), P["share_main"], subs)
jfile("meetings.json", repl(P["main"], "mainj"))
page("sub-livestock.html", repl(P["livestock"], "live"), P["share_livestock"])
jfile("sub-livestock.json", repl(P["livestock"], "livej"))
need = {"main39", "main38", "main37", "mainj39", "mainj38", "mainj37", "live20", "livej20"}
if not need <= hit: raise SystemExit(f"161: records not found: {sorted(need - hit)}")

ip = os.path.join(L, "i18n-en.json")
raw = open(ip, encoding="utf-8").read(); cur = json.loads(raw)
new = {k: v for k, v in json.load(open(os.path.join(F, "i18n_add.json"), encoding="utf-8")).items() if k not in cur}
if new:
    cur.update(new)
    kw = dict(indent=0) if raw.count("\n") > 2 else dict(separators=(",", ":"))
    open(ip, "w", encoding="utf-8").write(json.dumps(cur, ensure_ascii=False, sort_keys=True, **kw) + ("\n" if raw.endswith("\n") else ""))
print("161_agri37_39_live20_summaries: main 37, 38, 39 and livestock 20 summaries applied")
PY
