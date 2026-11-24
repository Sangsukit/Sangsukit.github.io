#!/usr/bin/env bash
# Bundle item 207 agri40_agenda (Agriculture archive thread, 24 Nov 2569; asked by "Site: Update automatically three times a day").
# Main meeting 40/2569 (Mon 23 Nov 2569, held): the Senate now lists the full agenda "ระเบียบวาระ 40.69.pdf" (ref 11240487,
# Rpublic=1; checked: ครั้งที่ ๔๐/๒๕๖๙, 23 พ.ย. ๒๕๖๙, CA 331). No summary yet. The card changes from an upcoming card to an
# agenda card (agenda_only: items are agenda, not decisions; nobody named as presiding), with the agenda PDF linked.
# Left out on purpose: the farm's and project's names in agenda 5.2 (private business), the proposed next meeting date.
# Surgical: record n=40 in index.html DATA and meetings.json replaced by the new build's record (live "media" with the
# pre-meeting video kept); SHARE_V 40; new s/40.html + img/s/40-3763c24d.jpg + img/s/qr-40.svg; new English lines in
# i18n-en.json. Nothing else changes. Idempotent; no git, no network. Needs $HUB.
set -euo pipefail
: "${HUB:?HUB not set}"
F="${ITEM_FILES:-/mnt/project-files/archive/bundle/items/207_agri40_agenda_files}"
L="$HUB/agriculture/2569"
for p in index.html meetings.json i18n-en.json; do
  test -f "$L/$p" || { echo "207: $L/$p missing" >&2; exit 1; }
done
for p in s/40.html img/s/40-3763c24d.jpg img/s/qr-40.svg; do
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
    if not m: raise SystemExit(f"207: pattern {pat[:30]} not found")
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

page("index.html", repl(P["main"], "main"), P["share_main"])
jfile("meetings.json", repl(P["main"], "mainj"))
need = {"main40", "mainj40"}
if not need <= hit: raise SystemExit(f"207: records not found: {sorted(need - hit)}")

ip = os.path.join(L, "i18n-en.json")
raw = open(ip, encoding="utf-8").read(); cur = json.loads(raw)
new = {k: v for k, v in json.load(open(os.path.join(F, "i18n_add.json"), encoding="utf-8")).items() if k not in cur}
if new:
    cur.update(new)
    kw = dict(indent=0) if raw.count("\n") > 2 else dict(separators=(",", ":"))
    open(ip, "w", encoding="utf-8").write(json.dumps(cur, ensure_ascii=False, sort_keys=True, **kw) + ("\n" if raw.endswith("\n") else ""))
print("207_agri40_agenda: main 40 agenda applied")
PY
