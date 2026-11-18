#!/usr/bin/env bash
# Bundle item 143_edu_env_sub_text_oct (thread "Site: Add more committees and subcommittees", 18 Nov 2569; asked by
# "Site: Update automatically three times a day" at 06:09 UTC). Second half of 142: easy-read text for the 16 October 2569
# subcommittee meetings whose cards still showed only "การประชุมครั้งที่ N/2569", from the official summaries the Senate
# published (each Rpublic = 1 on the 18 Nov ~06:12 UTC lists):
#  - Education: higher 36/37, learning 19/20/21, vocational 30/31/32
#  - Environment: climate 1/2, land 1/2/3, water 1/2/3
# Chair shown only where the document says who presided (not climate 1/2 or land 3); no names of agency representatives,
# outside persons or private bodies (the UK university of higher 37 is not named). English lines added to i18n-en.json (add only).
# NEEDS 143_edu_env_sub_text_oct FIRST (made on top of it: same pages, SUBS line hash taken after 142). Same surgical method
# as 142: content fields + SHARE_V + UPDATED of those meetings, SUBS line of both main pages; media, audio and every other
# meeting untouched. Home cards and m/ pages are refreshed by run_bundle.sh. Idempotent; no git, no network. Needs $HUB.
set -euo pipefail
: "${HUB:?HUB not set}"
SRC=/mnt/project-files/archive/bundle/items/143_edu_env_sub_text_oct_files
[ -d "$SRC" ] || SRC=$(cd "$(dirname "$0")" && pwd)/143_edu_env_sub_text_oct_files
test -f "$SRC/payload.json" || { echo "143: payload missing in $SRC" >&2; exit 1; }
for p in education/2569/sub-higher.html education/2569/sub-learning.html education/2569/sub-vocational.html environment/2569/sub-climate.html environment/2569/sub-land.html environment/2569/sub-water.html education/2569/index.html environment/2569/index.html; do
  test -f "$HUB/$p" || { echo "143: $HUB/$p missing (needs 98_edu_env_energy)" >&2; exit 1; }
done
python3 - "$HUB/education/2569/sub-higher.json" <<'PY0' || { echo "143: apply 142_edu_env_sub_text_nov first" >&2; exit 1; }
import json, sys
m = [x for x in json.load(open(sys.argv[1], encoding="utf-8")) if x["n"] == 39 and x["date"] == "2026-11-11"][0]
sys.exit(0 if m.get("items") else 1)
PY0
python3 - "$HUB" "$SRC" <<'PY'
import hashlib, json, os, re, shutil, sys
HUB, SRC = sys.argv[1:3]
P = json.load(open(os.path.join(SRC, "payload.json"), encoding="utf-8"))
FIELDS = ("time", "chair", "chair_key", "chair_role", "agenda_only", "headline", "summary", "items", "tags", "places", "pending",
          "room", "map", "docs")
CMP = dict(ensure_ascii=False, separators=(",", ":"))
ser = lambda a: json.dumps(a, **CMP).replace("</", "<\\/")
dflt = lambda v: json.dumps(v, ensure_ascii=False)
key = lambda m: f"{m['n']}|{m['date']}"
changed = []

def put(path, text):
    old = open(path, encoding="utf-8").read()
    if old != text:
        open(path, "w", encoding="utf-8").write(text); changed.append(os.path.relpath(path, HUB))

def merge(m, new):
    for k in FIELDS:
        if k in new: m[k] = new[k]
        else: m.pop(k, None)

def one(lines, prefix, page):
    idx = [i for i, l in enumerate(lines) if l.startswith(prefix)]
    assert len(idx) == 1, f"{page}: {prefix} line not found once"
    return idx[0]

def jline(lines, i, prefix, page, dumps):
    """parse a `const X=<json>;` line, check it round-trips with `dumps`, return (value, rebuild)"""
    line = lines[i]; body = line[len(prefix):]; tail = body[len(body.rstrip().rstrip(";")):]
    v = json.loads(body[:len(body) - len(tail)])
    assert prefix + dumps(v) + tail == line, f"{page}: {prefix} does not round-trip; not touching it"
    return v, (lambda nv: prefix + dumps(nv) + tail)

def apply_list(arr, spec, which, label):
    """set / add / delete meetings in a meeting list (DATA line or page json); returns the new list"""
    by = {key(m): m for m in arr}
    for k, new in spec["set"].items():
        assert k in by, f"{label}: meeting {k} not on the page"
        merge(by[k], new)
    arr = [m for m in arr if key(m) not in spec["delete"]]
    for k, a in spec["add"].items():
        if any(key(m) == k for m in arr):
            continue
        order = a["order"] if which == "data" else a["json_order"]
        prev = order[:order.index(k)]
        pos = 0
        for i, m in enumerate(arr):
            if key(m) in prev: pos = i + 1
        arr.insert(pos, a["data"] if which == "data" else a["json"])
    return arr

for page, spec in P["pages"].items():
    for k, a in spec["add"].items():
        a["order"] = spec["order"]
    p = os.path.join(HUB, page); lines = open(p, encoding="utf-8").read().split("\n")
    i = one(lines, "const DATA=", page); arr, mk = jline(lines, i, "const DATA=", page, ser)
    lines[i] = mk(apply_list(arr, spec, "data", page))
    if spec["tl"]:     # timeline: replace (or drop) the events of these meetings
        i = one(lines, "const TL=", page); tl, mk = jline(lines, i, "const TL=", page, dflt)
        for n, ev in spec["tl"].items():
            tl = [e for e in tl if str(e[6]) != n] + ev
        lines[i] = mk(sorted(tl, key=lambda e: e[0]))
    if spec["cal"]:    # calendar links of these meetings (None = meeting removed)
        i = one(lines, "const EZ=", page); ez, mk = jline(lines, i, "const EZ=", page, dflt)
        for n, cal in spec["cal"].items():
            if cal is None: ez["cal"].pop(n, None)
            else: ez["cal"][n] = cal
        ez["cal"] = dict(sorted(ez["cal"].items(), key=lambda kv: -int(kv[0]))) if all(x.isdigit() for x in ez["cal"]) else ez["cal"]
        lines[i] = mk(ez)
    if spec["sharev"]:  # share-card hashes (None = meeting removed); SHARE_V is kept newest first
        i = one(lines, "const SHARE_P=", page); l = lines[i]
        mt = re.search(r"SHARE_V=(\{.*?\}),SHARE_QR=", l); sv = json.loads(mt.group(1))
        assert dflt(sv) == mt.group(1), f"{page}: SHARE_V does not round-trip"
        for n, h in spec["sharev"].items():
            if h is None: sv.pop(n, None)
            else: sv[n] = h
        sv = dict(sorted(sv.items(), key=lambda kv: -int(kv[0])))
        lines[i] = l[:mt.start(1)] + dflt(sv) + l[mt.end(1):]
    i = one(lines, "const UPDATED=", page)
    if lines[i] < spec["updated"]:
        lines[i] = spec["updated"]
    put(p, "\n".join(lines))
    # the page's meeting list json (indent=1, no final newline, as csite writes it)
    jp = os.path.join(os.path.dirname(p), spec["json"]); raw = open(jp, encoding="utf-8").read(); ms = json.loads(raw)
    assert json.dumps(ms, ensure_ascii=False, indent=1) == raw, f"{spec['json']} does not round-trip; not touching it"
    put(jp, json.dumps(apply_list(ms, spec, "json", jp), ensure_ascii=False, indent=1))

# main pages: subcommittee tab data, whole line from the fresh build; refuse if live changed since the payload was made
for page, (base, line) in P["subs"].items():
    p = os.path.join(HUB, page); lines = open(p, encoding="utf-8").read().split("\n")
    i = one(lines, "const SUBS=", page)
    if lines[i] != line:
        assert hashlib.sha256(lines[i].encode()).hexdigest() == base, f"{page}: SUBS line changed since item 142; not touching it"
        lines[i] = line
    i = one(lines, "const UPDATED=", page)
    if lines[i] < 'const UPDATED="2026-11-18";':
        lines[i] = 'const UPDATED="2026-11-18";'
    put(p, "\n".join(lines))

for rel in P["files"]:
    s, d = os.path.join(SRC, rel), os.path.join(HUB, rel)
    os.makedirs(os.path.dirname(d), exist_ok=True)
    if not (os.path.exists(d) and open(s, "rb").read() == open(d, "rb").read()):
        shutil.copyfile(s, d); changed.append(rel)
for rel in P["delete"]:
    d = os.path.join(HUB, rel)
    if os.path.exists(d):
        os.remove(d); changed.append("-" + rel)

for rel, add in P["i18n"].items():
    p = os.path.join(HUB, rel); raw = open(p, encoding="utf-8").read(); d = json.loads(raw)
    assert json.dumps(d, **CMP) == raw, f"{rel} format changed; not touching it"
    for k, v in add.items():
        d.setdefault(k, v)
    put(p, json.dumps(d, **CMP))
print("143_edu_env_sub_text_oct: changed", len(changed), "files:", ", ".join(changed[:14]) + (" ..." if len(changed) > 14 else "") if changed else "none (already applied)")

# self-check
for page, spec in P["pages"].items():
    p = os.path.join(HUB, page); d = os.path.dirname(p); t = open(p, encoding="utf-8").read().replace("<\\/", "</")
    data = {key(m): m for m in json.loads([l for l in t.split("\n") if l.startswith("const DATA=")][0][len("const DATA="):].rstrip(";"))}
    ms = {key(m): m for m in json.load(open(os.path.join(d, spec["json"]), encoding="utf-8"))}
    for k, new in spec["set"].items():
        for src in (data, ms):
            assert all(src[k].get(f) == new.get(f) for f in FIELDS), f"{page}: {k} not updated"
    for k, a in spec["add"].items():
        assert k in data and k in ms and data[k]["headline"] == a["data"]["headline"], f"{page}: {k} not added"
    for k in spec["delete"]:
        assert k not in data and k not in ms, f"{page}: {k} still there"
    for n, h in spec["sharev"].items():
        sp = os.path.join(d, "s", f"{spec['prefix']}{n}.html")
        if h:
            assert f"img/s/{spec['prefix']}{n}-{h}.jpg" in open(sp, encoding="utf-8").read(), f"{sp}: new card not linked"
            assert os.path.getsize(os.path.join(d, "img", "s", f"{spec['prefix']}{n}-{h}.jpg")) > 5000, f"{n}: card missing"
            assert f'"{n}": "{h}"' in t, f"{page}: SHARE_V {n}"
        else:
            assert not os.path.exists(sp) and f'"{n}": "' not in re.search(r"SHARE_V=\{.*?\}", t).group(0), f"{page}: {n} share left"
    for n, ev in spec["tl"].items():
        tl = json.loads([l for l in t.split("\n") if l.startswith("const TL=")][0][len("const TL="):].rstrip(";"))
        assert [e for e in tl if str(e[6]) == n] == ev, f"{page}: TL {n}"
for page, k in (("education/2569/sub-higher.json", "37|2026-10-20"), ("environment/2569/sub-water.json", "3|2026-10-29")):
    m = {key(x): x for x in json.load(open(os.path.join(HUB, page), encoding="utf-8"))}[k]
    assert m.get("items") and not m.get("pending") and m["headline"] != f"การประชุมครั้งที่ {m['n']}/2569", f"{page} {k} text"
for page, (base, line) in P["subs"].items():
    assert line in open(os.path.join(HUB, page), encoding="utf-8").read().split("\n"), f"{page}: SUBS"
print("143_edu_env_sub_text_oct OK")
PY
