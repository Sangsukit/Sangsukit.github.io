#!/usr/bin/env bash
# Bundle item 160 agri40_water21_livestock21 (Agriculture archive thread, 22 Nov 2569; asked by "Site: Update automatically three times a day")
# Adds three upcoming meetings to agriculture/2569, each with time, room and agenda from the Senate notice letter:
#   main committee 40/2569  Mon 23 Nov 2569 14.00, CA 331 (notice ว๑๐๔๕, ref 11217028)
#   water subcommittee 21   Tue 24 Nov 2569 14.00, CA 320 (notice ว๑๐๔๒, ref 11216382)
#   livestock subcommittee 21 Wed 25 Nov 2569 14.00, CA 319 (notice ว๑๐๔๑, ref 11216523)
# Surgical, like items 47 and 86: copies the new share pages, card images, QR codes and calendar files; then adds only the new
# meeting to DATA (newest first) + SHARE_V + EZ.cal in index.html / sub-water.html / sub-livestock.html, adds it to
# meetings.json / sub-water.json / sub-livestock.json, puts meeting 21 into SUBS (water, livestock) on index.html, replaces the
# sub pages' TL up-next plan entry, sets UPDATED, and adds new English lines to i18n-en.json. Nothing else on the pages changes.
# Idempotent; no git, no network. Needs $HUB.
set -euo pipefail
: "${HUB:?HUB not set}"
F="${ITEM_FILES:-/mnt/project-files/archive/bundle/items/160_agri40_water21_livestock21_files}"
L="$HUB/agriculture/2569"
for p in index.html sub-water.html sub-livestock.html meetings.json sub-water.json sub-livestock.json i18n-en.json; do
  test -f "$L/$p" || { echo "160: $L/$p missing" >&2; exit 1; }
done
for p in s/40.html img/s/40-fcab4bd0.jpg img/s/qr-40.svg cal/40.ics \
         s/water-21.html img/s/water-21-7f7b6dbb.jpg img/s/qr-water-21.svg cal-sub/water/21.ics \
         s/livestock-21.html img/s/livestock-21-47de0200.jpg img/s/qr-livestock-21.svg cal-sub/livestock/21.ics; do
  mkdir -p "$(dirname "$L/$p")"
  cmp -s "$F/$p" "$L/$p" || cp -f "$F/$p" "$L/$p"
done
python3 - "$L" "$F" <<'PY'
import json, os, re, sys
L, F = sys.argv[1], sys.argv[2]
P = json.load(open(os.path.join(F, "patch.json"), encoding="utf-8"))
dump = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))
key = lambda x: (x.get("date", ""), x.get("n", 0))

def put(lst, e):
    lst = [x for x in lst if not (x.get("n") == e["n"] and x.get("date") == e["date"])]
    lst.append(e); lst.sort(key=key, reverse=True); return lst

def sub_line(h, name, fn, pat=None):
    m = re.search(pat or (r"^const %s=(.*);$" % name), h, re.M)
    if not m: raise SystemExit(f"160: {name} not found")
    new = fn(m.group(1))
    return h[:m.start(1)] + new + h[m.end(1):]

def share(h, n, v):
    def f(s):
        S = json.loads(s)
        if S.get(n) == v: return s
        S = {n: v, **{k: x for k, x in S.items() if k != n}}
        return json.dumps(S, ensure_ascii=False)
    return sub_line(h, "SHARE_V", f, r"SHARE_V=(\{[^}]*\})")

def ezcal(h, n, c):
    def f(s):
        E = json.loads(s); cal = E.get("cal") or {}
        if cal.get(n) == c: return s
        E["cal"] = {n: c, **{k: x for k, x in cal.items() if k != n}}
        return json.dumps(E, ensure_ascii=False)
    return sub_line(h, "EZ", f)

def updated(h):
    return re.sub(r'^const UPDATED="[0-9-]+";$', 'const UPDATED="2026-11-23";', h, count=1, flags=re.M)

def page(fn, entry, n, sv, cal, extra=None):
    hp = os.path.join(L, fn); h = open(hp, encoding="utf-8").read(); h0 = h
    h = sub_line(h, "DATA", lambda s: dump(put(json.loads(s), entry)))
    h = share(h, n, sv); h = ezcal(h, n, cal)
    if extra: h = extra(h)
    h = updated(h)
    if h != h0: open(hp, "w", encoding="utf-8").write(h)

def jfile(fn, entry):
    jp = os.path.join(L, fn); raw = open(jp, encoding="utf-8").read()
    J = put(json.loads(raw), entry)
    ind = 1 if raw.lstrip().startswith("[\n") else None
    out = json.dumps(J, ensure_ascii=False, indent=ind) + ("\n" if raw.endswith("\n") else "")
    if out != raw: open(jp, "w", encoding="utf-8").write(out)

def subs(h):
    def f(s):
        S = json.loads(s)
        for e in S:
            m = P["subs_meet"].get(e.get("key"))
            if m:
                e["meetings"] = put(e.get("meetings") or [], m)
                e["fetched"] = max(e.get("fetched") or "", P["subs_fetched"])
        return json.dumps(S, ensure_ascii=False)
    return sub_line(h, "SUBS", f)

def tl(k):
    def f(h):
        return sub_line(h, "TL", lambda s: json.dumps(P[k + "_tl"], ensure_ascii=False), r"^const TL=(\[.*\]);$")
    return f

page("index.html", P["main40"], "40", P["share_v40"], P["cal40"], subs)
jfile("meetings.json", P["main40_json"])
for k in ("water", "livestock"):
    page(f"sub-{k}.html", P[k + "21"], "21", P[k + "_share_v21"], P[k + "_cal21"], tl(k))
    jfile(f"sub-{k}.json", P[k + "21_json"])

ip = os.path.join(L, "i18n-en.json")
raw = open(ip, encoding="utf-8").read(); cur = json.loads(raw)
new = {k: v for k, v in json.load(open(os.path.join(F, "i18n_add.json"), encoding="utf-8")).items() if k not in cur}
if new:
    cur.update(new)
    kw = dict(indent=0) if raw.count("\n") > 2 else dict(separators=(",", ":"))
    open(ip, "w", encoding="utf-8").write(json.dumps(cur, ensure_ascii=False, sort_keys=True, **kw) + ("\n" if raw.endswith("\n") else ""))
print("160_agri40_water21_livestock21: main 40 + water 21 + livestock 21 upcoming cards applied")
PY
