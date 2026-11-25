#!/usr/bin/env bash
# Bundle item 223_en_be_year_fix (thread "Site: Add more committees and subcommittees", 25 Nov 2569; asked by the coordinator,
# relaying a bug found by "Site: Update automatically three times a day"). English view only. Act years written
# "B.E. {n|ce}" were converted to the Christian-era year but kept the "B.E." label (e.g. "Act on the Summoning Powers of
# Committees B.E. 2025" instead of B.E. 2568). This item rewrites every "B.E. {n|ce}" to "B.E. {n}" (Thai year kept) in the
# English translation values of the hub's i18n-en.json files. Thai text, keys and every other line are untouched.
# Live main 903bf9dd: 61 such places in 14 files (Education 2569; Energy, Health, Social, Transport 2567-2569;
# Environment 2569). Scans every */*/i18n-en.json, so files that gain the pattern later are fixed too.
# Idempotent; no git, no network, no payload. Needs $HUB.
set -euo pipefail
: "${HUB:?HUB not set}"
python3 - "$HUB" <<'PY'
import glob, json, os, re, sys
HUB = sys.argv[1]
CMP = dict(ensure_ascii=False, separators=(",", ":"))
RX = re.compile(r"B\.E\.( *)\{(\d+)\|ce\}")
files = sorted(glob.glob(os.path.join(HUB, "*", "*", "i18n-en.json")))
assert len(files) >= 30 and os.path.exists(os.path.join(HUB, "CNAME")), f"only {len(files)} i18n-en.json files found under {HUB}; wrong HUB?"
changed, places = [], 0
for p in files:
    raw = open(p, encoding="utf-8").read()
    if not RX.search(raw):
        continue
    d = json.loads(raw)
    assert json.dumps(d, **CMP) == raw, f"{os.path.relpath(p, HUB)} format changed; not touching it"
    n = 0
    for k, v in d.items():
        if isinstance(v, str) and RX.search(v):
            nv, c = RX.subn(lambda m: f"B.E.{m.group(1)}{{{m.group(2)}}}", v)
            d[k] = nv; n += c
    out = json.dumps(d, **CMP)
    if out != raw:
        open(p, "w", encoding="utf-8").write(out)
        changed.append(f"{os.path.relpath(p, HUB)} ({n})"); places += n
print("223_en_be_year_fix: changed", len(changed), "files,", places, "places:", ", ".join(changed) if changed else "none (already applied)")
# self-check: no English value anywhere keeps a converted year under a B.E. label
for p in files:
    d = json.load(open(p, encoding="utf-8"))
    bad = [k for k, v in d.items() if isinstance(v, str) and RX.search(v)]
    assert not bad, f"{os.path.relpath(p, HUB)}: still has B.E. {{n|ce}} in {len(bad)} lines"
print("223_en_be_year_fix OK")
PY
exit 0
