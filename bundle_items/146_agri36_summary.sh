#!/usr/bin/env bash
# Bundle item 146 agri36_summary (Agriculture archive thread, 18 Nov 2569; asked by "Site: Update automatically three times a day")
# Main meeting 36/2569 (26 Oct): the Senate published summary 36.69 (ref 11204391), minutes (11204392) and agenda 36.69
# (11204388), all Rpublic=1. Easy-read text from the summary replaces the agenda-only text. Only chair, chair_role, headline,
# summary, items, tags, places, docs, time of that record change in agriculture/2569/index.html DATA and meetings.json;
# "agenda_only"/"pending"/"upcoming" removed; media untouched. SHARE_V 36 -> new card; s/36.html + img/s/36-4978554d.jpg + qr-36.svg.
# Idempotent; no git, no network. Needs $HUB.
set -euo pipefail
: "${HUB:?HUB not set}"
F="${ITEM_FILES:-/mnt/project-files/archive/bundle/items/146_agri36_summary_files}"
L="$HUB/agriculture/2569"
test -f "$L/index.html" -a -f "$L/meetings.json" || { echo "146: agriculture/2569 pages missing" >&2; exit 1; }
for p in s/36.html img/s/36-4978554d.jpg img/s/qr-36.svg; do cmp -s "$F/$p" "$L/$p" || cp -f "$F/$p" "$L/$p"; done
python3 - "$L" "$F" <<'PY'
import json, os, re, sys
L, F = sys.argv[1], sys.argv[2]
P = json.load(open(os.path.join(F, "patch.json"), encoding="utf-8"))
dump = lambda o: json.dumps(o, ensure_ascii=False, separators=(",", ":"))
DATES = {36: "2026-10-26"}
hit = set()
def upd(x):
    n = x.get("n")
    if n in DATES and x.get("date") == DATES[n] and not x.get("cancelled"):
        x.update(P[f"main{n}"])
        for k in ("agenda_only", "pending", "upcoming"): x.pop(k, None)
        hit.add(n)

def patch_page(hp):
    h = open(hp, encoding="utf-8").read(); h0 = h
    m = re.search(r"^const DATA=(\[.*\]);$", h, re.M)
    D = json.loads(m.group(1)); [upd(x) for x in D]
    h = h[:m.start(1)] + dump(D) + h[m.end(1):]
    m = re.search(r"SHARE_V=(\{[^}]*\})", h); S = json.loads(m.group(1))
    if S.get("36") != P["share_v36"]:
        S["36"] = P["share_v36"]
        h = h[:m.start(1)] + json.dumps(S, ensure_ascii=False) + h[m.end(1):]
    if h != h0: open(hp, "w", encoding="utf-8").write(h)

def patch_json(jp):
    raw = open(jp, encoding="utf-8").read(); J = json.loads(raw); [upd(x) for x in J]
    ind = 1 if raw.lstrip().startswith("[\n") else None
    out = json.dumps(J, ensure_ascii=False, indent=ind) + ("\n" if raw.endswith("\n") else "")
    if out != raw: open(jp, "w", encoding="utf-8").write(out)

patch_page(os.path.join(L, "index.html"))
if hit != {36}: sys.exit("146: record 36 not found in index.html DATA")
hit.clear(); patch_json(os.path.join(L, "meetings.json"))
if hit != {36}: sys.exit("146: record 36 not found in meetings.json")

ip = os.path.join(L, "i18n-en.json")
raw = open(ip, encoding="utf-8").read(); cur = json.loads(raw)
new = {k: v for k, v in json.load(open(os.path.join(F, "i18n_add.json"), encoding="utf-8")).items() if k not in cur}
if new:
    cur.update(new)
    kw = dict(indent=0) if raw.count("\n") > 2 else dict(separators=(",", ":"))
    open(ip, "w", encoding="utf-8").write(json.dumps(cur, ensure_ascii=False, sort_keys=True, **kw) + ("\n" if raw.endswith("\n") else ""))
print("146_agri36_summary: meeting 36 summary applied")
PY
