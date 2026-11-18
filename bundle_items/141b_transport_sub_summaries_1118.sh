#!/usr/bin/env bash
# Bundle item 141b_transport_sub_summaries_1118 (thread "Site: Add Transport and Foreign Affairs committees", 18 Nov 2569; asked by
# "Site: Update automatically three times a day", morning sweep 18 Nov). From a fresh Transport list (18 Nov ~06:20 UTC), every
# document Rpublic = 1, easy-read text for seven Transport subcommittee meetings that showed the placeholder headline:
#  - Isan transit (ขนส่งสาธารณะภาคอีสาน) 1 (29 Oct, ref 11078624), 2 (4 Nov, ref 11111247), 3 (11 Nov, ref 11166395).
#  - Andaman port (ท่าเรืออันดามัน) 1 (8 Oct, ref 10981923), 2 (21 Oct, ref 11032682).
#  - Ride-hail (รถรับจ้างผ่านแอป) 1 (22 Oct, ref 11041441), 2 (29 Oct, ref 11099230).
#  Time and room from each summary; the subcommittee chair presided (as each summary states). Legal check STOP 0 / WARN 0.
# Surgical, same engine as items 123 and 130: replaces only those meetings in the DATA line and the page's json (keeping each
# meeting's live media), their rows in the Transport home page's SUBS list, SHARE_V hashes and UPDATED; copies the 7 rebuilt share
# pages and their new picture cards; adds the new English lines to i18n-en.json (add-only).
# Home cards (hub_snap_sync) and m/ pages (seo.py bundle) are refreshed by run_bundle.sh. Idempotent; no git, no network. Needs $HUB.
set -euo pipefail
: "${HUB:?HUB not set}"
# use the first copy that really has the payload (the shared folder can show empty folders): next to this script, then the shared folder
SRC=""
for d in "$(cd "$(dirname "$0")" && pwd)/141b_transport_sub_summaries_1118_files" /mnt/project-files/archive/bundle/items/141b_transport_sub_summaries_1118_files /mnt/project-files/archive/bundle/items/141_transport_sub_summaries_1118_files; do
  if [ -f "$d/payload.json" ]; then SRC=$d; break; fi
done
test -f "$SRC/payload.json" || { echo "141: payload missing in $SRC" >&2; exit 1; }
python3 - "$HUB" "$SRC" <<'PY'
import json, os, re, shutil, sys
HUB, SRC = sys.argv[1:3]
P = json.load(open(os.path.join(SRC, "payload.json"), encoding="utf-8"))
CMP = dict(ensure_ascii=False, separators=(",", ":"))
ser = lambda a: json.dumps(a, **CMP).replace("</", "<\\/")
dft = lambda v: json.dumps(v, ensure_ascii=False)
K = lambda m: f"{m['n']}|{m['date']}"
changed = []

def put(path, text):
    if open(path, encoding="utf-8").read() != text:
        open(path, "w", encoding="utf-8").write(text); changed.append(os.path.relpath(path, HUB))

def one(lines, prefix, page):
    idx = [i for i, l in enumerate(lines) if l.startswith(prefix)]
    assert len(idx) == 1, f"{page}: {prefix} line not found once"
    return idx[0]

def jline(lines, prefix, page, dumps):
    i = one(lines, prefix, page); line = lines[i]; body = line[len(prefix):]; tail = body[len(body.rstrip().rstrip(";")):]
    v = json.loads(body[:len(body) - len(tail)])
    assert prefix + dumps(v) + tail == line, f"{page}: {prefix} does not round-trip; not touching it"
    return i, v, (lambda nv: prefix + dumps(nv) + tail)

def put_rows(ms, rows, where):
    """replace (keeping the live media) or insert the meetings; newest first, as csite writes them"""
    have = {K(m): m for m in ms}
    for k, r in rows.items():
        n = int(k.split("|")[0])
        assert not any(m["n"] == n and K(m) != k and not m.get("cancelled") for m in ms), f"{where}: meeting {n} is there with another date"
        new = dict(r)
        if k in have and "media" in have[k]:
            new["media"] = have[k]["media"]
        have[k] = new
    return sorted(have.values(), key=lambda x: (x["date"], x["n"]), reverse=True)

for page, spec in P["pages"].items():
    p = os.path.join(HUB, page); assert os.path.exists(p), f"{page} missing"
    lines = open(p, encoding="utf-8").read().split("\n")
    if spec["rows"]:
        i, arr, mk = jline(lines, "const DATA=", page, ser)
        lines[i] = mk(put_rows(arr, spec["rows"], page))
    if spec["subs"]:
        i, subs, mk = jline(lines, "const SUBS=", page, ser)
        assert {s["key"] for s in subs} >= set(spec["subs"]), f"{page}: SUBS key missing"
        for s in subs:
            if s["key"] in spec["subs"]:
                s["meetings"] = put_rows(s["meetings"], spec["subs"][s["key"]], f"{page} SUBS {s['key']}")
        lines[i] = mk(subs)
    if spec["tl"]:
        i, tl, mk = jline(lines, "const TL=", page, dft)
        ns = {int(n) for n in spec["tl"]}
        lines[i] = mk(sorted([e for e in tl if e[6] not in ns] + [e for ev in spec["tl"].values() for e in ev], key=lambda e: e[0]))
    if spec["cal"]:
        i, ez, mk = jline(lines, "const EZ=", page, dft)
        for n, cal in spec["cal"].items():
            if cal is None:
                ez["cal"].pop(n, None)   # the meeting is past: no calendar links
            else:
                ez["cal"][n] = cal
        lines[i] = mk(ez)
    if spec["sharev"]:
        i = one(lines, "const SHARE_P=", page); l = lines[i]
        for n, h in spec["sharev"].items():
            if re.search(r'"%s": "[0-9a-f]+"' % n, l):
                l = re.sub(r'("%s": ")[0-9a-f]+(")' % n, r"\g<1>%s\g<2>" % h, l)
            else:
                l, c = re.subn(r'SHARE_V=\{', 'SHARE_V={"%s": "%s", ' % (n, h), l, count=1); assert c == 1, f"{page}: SHARE_V not found"
        lines[i] = l
    i = one(lines, "const UPDATED=", page)
    if lines[i] < 'const UPDATED="2026-11-18";':
        lines[i] = 'const UPDATED="2026-11-18";'
    put(p, "\n".join(lines))
    if spec["json"]:
        jp = os.path.join(os.path.dirname(p), spec["json"]); raw = open(jp, encoding="utf-8").read(); ms = json.loads(raw)
        assert json.dumps(ms, ensure_ascii=False, indent=1) == raw, f"{spec['json']} does not round-trip; not touching it"
        put(jp, json.dumps(put_rows(ms, spec["rows"], spec["json"]), ensure_ascii=False, indent=1))

for rel in P["files"]:
    s, d = os.path.join(SRC, rel), os.path.join(HUB, rel)
    os.makedirs(os.path.dirname(d), exist_ok=True)
    if not (os.path.exists(d) and open(s, "rb").read() == open(d, "rb").read()):
        shutil.copyfile(s, d); changed.append(rel)

for rel, add in P["i18n"].items():
    p = os.path.join(HUB, rel); raw = open(p, encoding="utf-8").read(); d = json.loads(raw)
    assert json.dumps(d, **CMP) == raw, f"{rel} format changed; not touching it"
    for k, v in add.items():
        d.setdefault(k, v)
    put(p, json.dumps(d, **CMP))
print("141b_transport_sub_summaries_1118: changed", len(changed), "files:", ", ".join(changed[:14]) + (" ..." if len(changed) > 14 else "") if changed else "none (already applied)")

# self-check: each target meeting is there once with the new text; json equals DATA rows; share pages name their cards
for page, spec in P["pages"].items():
    p = os.path.join(HUB, page); t = open(p, encoding="utf-8").read()
    data = json.loads([l for l in t.split("\n") if l.startswith("const DATA=")][0][len("const DATA="):].rstrip().rstrip(";")) if spec["rows"] else []
    for k, r in spec["rows"].items():
        got = [m for m in data if K(m) == k]
        assert len(got) == 1 and got[0]["headline"] == r["headline"] and got[0]["summary"] == r["summary"], f"{page}: {k} not right"
    if spec["json"]:
        ms = json.load(open(os.path.join(os.path.dirname(p), spec["json"]), encoding="utf-8"))
        assert ms == data, f"{spec['json']}: differs from the page's DATA"
    for n, h in spec["sharev"].items():
        assert f'"{n}": "{h}"' in t, f"{page}: SHARE_V {n}"
for rel in P["files"]:
    assert os.path.getsize(os.path.join(HUB, rel)) > 500, rel
    m = re.match(r"(.*)/s/(.+)\.html$", rel)
    if m:
        card = [f for f in P["files"] if f.startswith(f"{m.group(1)}/img/s/{m.group(2)}-")][0]
        assert os.path.basename(card) in open(os.path.join(HUB, rel), encoding="utf-8").read(), f"{rel}: card not linked"
print("141b_transport_sub_summaries_1118 OK")
PY
