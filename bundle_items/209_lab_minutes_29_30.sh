#!/usr/bin/env bash
# Bundle item 209 lab_minutes_29_30 (thread "Site: Add Labour committee", 24 Nov 2569; asked by "Site: Update automatically
# three times a day"). Labour 2569, data only, no design change, no new text.
# The Senate published the full minutes (RType "บันทึกการประชุม") of two main meetings, both Rpublic=1 (checked 24 Nov
# 2569 05:53 UTC):
#   main 29/2569 (Thu 5 Nov 2569)  "2569-29_5Nov-กมธ.แรงงาน.pdf"  ref 11245165 (23 pages)
#   main 30/2569 (Thu 12 Nov 2569) "2569-30_12Nov-กมธ.แรงงาน.pdf" ref 11245168 (25 pages)
# The main 29 file does NOT replace 11155667: that one is the summary (สรุปผลการประชุม, the 10-page newsletter) and stays.
# This adds one {"k":"minutes"} link to each meeting's docs, after the summary and before the agenda link, exactly as a
# fresh build writes it and as main 27 and 28 already show it (no size, like every other Labour minutes link).
# Files: labour/2569/index.html (DATA, UPDATED) and labour/2569/meetings.json. m/29.html and m/30.html follow from DATA
# in run_bundle (seo.py bundle). Nothing else: no media, CAPS, audio, share cards, text or English lines.
# Idempotent; no git, no network. Needs $HUB.
set -euo pipefail
: "${HUB:?HUB not set}"
NAME=209_lab_minutes_29_30
M="$HUB/labour/2569"
for f in index.html meetings.json; do test -f "$M/$f" || { echo "$NAME: $M/$f missing" >&2; exit 1; }; done
python3 - "$M" "$HUB" <<'PY'
import json, os, sys
M, HUB = sys.argv[1], sys.argv[2]
NEW = {  # n: (date, ref, url)
 29: ('2026-11-05', '11245165', 'https://pis.parliament.go.th/PARFileDownloadProxy/download?s=Khb5nY5kDgxkydMmd9YaqxF3Bn2NKrGrzuiFMCBZoyBwA7z43QleMdLKFV5KFW5o5eSzjJJ6JCVOth3T-k4VV1cEgkK41snhyhK03AVCeMNa6-POBBlUHI-WQigrmtcFm3Bsi1AVWS-xg8gH5aYF3X-yBhXepLp9c2JJ3A==&ref=11245165'),
 30: ('2026-11-12', '11245168', 'https://pis.parliament.go.th/PARFileDownloadProxy/download?s=EM4IL_oiqHzfCllp0AnnGVOeGc0umULBmUda5qDKA02LmfCuS3qOQW8AvttXNxlQP09H0RfCM0OWGUQS6vPkUZBFGgLcGhHdcvAMi7o1oNcgGUL_pnsIu2xZ3I--s4HlGiOkCJcqtjA94BCM_KSbC7vuelOZo3IZLqJG4g==&ref=11245168'),
}
SUMMARY = {29: '11155667', 30: '11218909'}   # must still be there, untouched
DAY = '2026-11-24'
dec = json.JSONDecoder(); changed = []
ser = lambda a: json.dumps(a, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
def put(p, t):
    if open(p, encoding='utf-8').read() != t:
        open(p, 'w', encoding='utf-8').write(t); changed.append(os.path.relpath(p, HUB))
def ref(d):
    u = d.get('url') or ''; return u.rsplit('ref=', 1)[1] if 'ref=' in u else None
def add(arr, where):
    for n, (date, r, url) in NEW.items():
        k = [m for m in arr if m.get('n') == n and m.get('date') == date]
        assert len(k) == 1, f'{where}: meeting {n} ({date}) not found once'
        docs = k[0].setdefault('docs', [])
        assert any(d.get('k') == 'summary' and ref(d) == SUMMARY[n] for d in docs), f'{where}: {n} summary {SUMMARY[n]} missing'
        have = [d for d in docs if ref(d) == r]
        if have:
            assert len(have) == 1 and have[0].get('k') == 'minutes', f'{where}: {n} has ref {r} in an unexpected form'
            continue
        assert not any(d.get('k') == 'minutes' for d in docs), f'{where}: {n} already has another minutes link'
        at = next((i for i, d in enumerate(docs) if d.get('k') == 'agenda'), len(docs))
        docs.insert(at, {'k': 'minutes', 'url': url})
# index.html: the DATA line (+ UPDATED, never moved backwards)
p = os.path.join(M, 'index.html'); lines = open(p, encoding='utf-8').read().split('\n')
idx = [i for i, l in enumerate(lines) if l.startswith('const DATA=')]
assert len(idx) == 1, 'const DATA= not found once'
i = idx[0]; body = lines[i][len('const DATA='):]; arr, end = dec.raw_decode(body); tail = body[end:]
assert 'const DATA=' + ser(arr) + tail == lines[i], 'DATA does not round-trip; not touching it'
before = ser(arr); add(arr, 'index.html')
if ser(arr) != before:
    lines[i] = 'const DATA=' + ser(arr) + tail
    u = [j for j, l in enumerate(lines) if l.startswith('const UPDATED=')]
    assert len(u) == 1, 'const UPDATED= not found once'
    cur = lines[u[0]][len('const UPDATED="'):len('const UPDATED="') + 10]
    if cur < DAY: lines[u[0]] = f'const UPDATED="{DAY}";'
put(p, '\n'.join(lines))
# meetings.json (indent 1, no final newline)
p = os.path.join(M, 'meetings.json'); t = open(p, encoding='utf-8').read(); arr = json.loads(t)
assert json.dumps(arr, ensure_ascii=False, indent=1) == t, 'meetings.json does not round-trip; not touching it'
add(arr, 'meetings.json'); put(p, json.dumps(arr, ensure_ascii=False, indent=1))
# checks
for f in ('index.html', 'meetings.json'):
    t = open(os.path.join(M, f), encoding='utf-8').read()
    for n, (date, r, url) in NEW.items():
        assert t.count('ref=' + r) == 1, f'{f}: ref {r} should appear once'
        assert url in t, f'{f}: {n} minutes link missing'
        assert 'ref=' + SUMMARY[n] in t, f'{f}: {n} summary link lost'
lines = open(os.path.join(M, 'index.html'), encoding='utf-8').read().split('\n')
arr = dec.raw_decode([l for l in lines if l.startswith('const DATA=')][0][len('const DATA='):])[0]
for n in NEW:
    m = [x for x in arr if x.get('n') == n][0]
    ks = [d.get('k') for d in m['docs']]
    assert ks.index('summary') < ks.index('minutes') < (ks.index('agenda') if 'agenda' in ks else 99), f'{n}: docs order {ks}'
    assert not m.get('upcoming'), f'{n}: should be a held meeting'
print('209_lab_minutes_29_30: changed %d files%s' % (len(changed), (': ' + ', '.join(changed)) if changed else ''))
PY
