#!/usr/bin/env bash
# Bundle item 197 pa36_minutes (thread "Site: run the meeting archive", 23 Nov 2569 Bangkok)
# Routine content update (AUTO UPDATES, Sukit 11 Nov 2569), Public Administration 2569 archive.
# Main committee meeting 36/2569 (Wed 11 Nov 2569): the Senate list now carries its minutes (บันทึกการประชุม, ref 11236482,
# Rpublic 1, 15 pages). This adds the official link (with its size) to meeting 36's documents, between the summary and the
# agenda link, exactly as meetings 1-35 already show their minutes. Link only: no text from the minutes is shown on the site.
# Changes (committee-archive-2569 only): index.html DATA (meeting 36 docs only), meetings.json (meeting 36 docs only).
# m/36.html, the search index and the home page snapshot follow through run_bundle.sh (seo.py / search / hub_snap_sync).
# Self-contained, idempotent, no git, no network. Needs $A69.
set -euo pipefail
T=197_pa36_minutes
: "${A69:?A69 not set}"
for f in index.html meetings.json; do test -f "$A69/$f" || { echo "$T: A69/$f missing" >&2; exit 1; }; done
python3 - "$A69" <<'PY'
import json, os, sys
A69 = sys.argv[1]
MIN = json.loads('''{"k": "minutes", "url": "https://pis.parliament.go.th/PARFileDownloadProxy/download?s=CJCxjGouCTN1frraIvk7tKbgubuz8R86NFAXlFHCnFukaf8IaaAnDeydvWwOHS4C6PoCruiNGdKQwMcm69tB2e4Nlm_lK6mJRMzOcf8j7OPoAnI3-eCU85c3ZQqtTrwDtN84J-7K66DPtE_h2wAG2AtjAlJ-blacMX96LA==&ref=11236482", "size": 5930477}''')
N, DATE, REF = 36, '2026-11-11', 'ref=11236482'
dec = json.JSONDecoder()
SERS = [lambda v: json.dumps(v, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/'),
        lambda v: json.dumps(v, ensure_ascii=False),
        lambda v: json.dumps(v, ensure_ascii=False, separators=(',', ':')),
        lambda v: json.dumps(v, ensure_ascii=False).replace('</', '<\\/')]
changed = []

def add_minutes(arr):
    i = [k for k, m in enumerate(arr) if (m['n'], m['date']) == (N, DATE)]
    assert len(i) == 1, f'meeting {N} ({DATE}) not found once'
    docs = arr[i[0]]['docs']
    mins = [d for d in docs if d.get('k') == 'minutes']
    if mins:
        assert len(mins) == 1 and mins[0]['url'].endswith(REF), f'meeting {N} already has other minutes: {mins}'
        return arr
    at = next((k for k, d in enumerate(docs) if d.get('k') == 'agenda'), len(docs))
    docs.insert(at, dict(MIN))
    return arr

p = os.path.join(A69, 'index.html'); src = open(p, encoding='utf-8').read(); lines = src.split('\n')
pfx = 'const DATA='
idx = [k for k, l in enumerate(lines) if l.startswith(pfx)]
assert len(idx) == 1, 'index.html: const DATA= not found once'
l = lines[idx[0]]; v, e = dec.raw_decode(l[len(pfx):]); rest = l[len(pfx) + e:]
ser = next((s for s in SERS if pfx + s(v) + rest == l), None)
assert ser, 'index.html: const DATA= does not round-trip; not touching it'
lines[idx[0]] = pfx + ser(add_minutes(v)) + rest
new = '\n'.join(lines)
if new != src:
    open(p, 'w', encoding='utf-8').write(new); changed.append('index.html')

p = os.path.join(A69, 'meetings.json'); raw = open(p, encoding='utf-8').read(); ms = json.loads(raw)
assert json.dumps(ms, ensure_ascii=False, indent=1) == raw, 'meetings.json does not round-trip; not touching it'
new = json.dumps(add_minutes(ms), ensure_ascii=False, indent=1)
if new != raw:
    open(p, 'w', encoding='utf-8').write(new); changed.append('meetings.json')

for f in ('index.html', 'meetings.json'):   # final check
    t = open(os.path.join(A69, f), encoding='utf-8').read()
    assert t.count(REF) == 1, f'{f}: {REF} found {t.count(REF)} times'
print('197_pa36_minutes: changed', len(changed), 'files:', ', '.join(changed) or 'none (already applied)')
PY
echo "$T: done"
