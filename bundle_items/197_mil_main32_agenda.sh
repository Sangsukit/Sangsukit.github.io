#!/usr/bin/env bash
# Bundle item 197_mil_main32_agenda (thread "Site: Build Military committee archive", 23 Nov 2569)
# Military main committee meeting 32/2569 (urgent, Tue 24 Nov 14.30): the Senate's agenda PDF (ref 11236468, Rpublic=1,
# "01ระเบียบวาระประชมค32อังคาร24พย69.pdf", 23 Nov) added to its documents as kind "doc" (เอกสารประกอบ), like meetings 28-31.
# The agenda matches the live card (14.30, room 301 ชั้น 3, items 3.1-3.5), so no text changes.
# Surgical: docs of meeting 32 in index.html DATA + meetings.json, UPDATED, then meeting_pages.py for m/32.
# Needs item 150 (live). Idempotent; no git, no network. Needs $HUB ($BUILD optional).
set -euo pipefail
: "${HUB:?HUB not set}"; BUILD=${BUILD:-/mnt/project-files/archive/build}
T=197_mil_main32_agenda
M="$HUB/military/2569"
for f in index.html meetings.json; do test -f "$M/$f" || { echo "$T: $M/$f missing" >&2; exit 1; }; done
python3 - "$M" 'https://pis.parliament.go.th/PARFileDownloadProxy/download?s=y2pbT80OYmZyWQqsPWKEthAfWGHH9b0qbPaQpRTDTTS8VP02gWzgIggXriZRg1zmx7CrC8AwTnxbpwfuZquzy2STfpNZgOOfTHfq2MZ-FO71ABPVqqPCSkj3mFlibbkp8l-M-beDSnx67VrUxd411wzkicLpETWX5jShcg==&ref=11236468' <<'PY'
import json, os, sys
M, URL = sys.argv[1], sys.argv[2]; dec = json.JSONDecoder(); DAY = '2026-11-23'; T = '197'
DUMPS = [lambda a: json.dumps(a, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/'),
         lambda a: json.dumps(a, ensure_ascii=False, separators=(',', ':')), lambda a: json.dumps(a, ensure_ascii=False)]
def one(L, pre):
    idx = [i for i, l in enumerate(L) if l.startswith(pre)]
    assert len(idx) == 1, f'{T}: {pre} not found once'; return idx[0]
def jline(L, pre):
    i = one(L, pre); body = L[i][len(pre):]; v, end = dec.raw_decode(body); tail = body[end:]
    for d in DUMPS:
        if pre + d(v) + tail == L[i]: return i, v, tail, d
    raise SystemExit(f'{T}: {pre} does not round-trip; not touching it')
def add(arr):
    hit = [m for m in arr if m['n'] == 32 and m['date'] == '2026-11-24']
    assert len(hit) == 1, f'{T}: meeting 32 (24 Nov) missing (item 150 must be live)'
    m = hit[0]
    if any('ref=11236468' in d.get('url', '') for d in m['docs']): return False
    at = next((i for i, d in enumerate(m['docs']) if d.get('k') == 'agenda'), len(m['docs']))
    m['docs'].insert(at, {'k': 'doc', 'url': URL}); return True
p = os.path.join(M, 'index.html'); t0 = open(p, encoding='utf-8').read(); L = t0.split('\n')
i, arr, tail, d = jline(L, 'const DATA=')
if add(arr):
    L[i] = 'const DATA=' + d(arr) + tail
    k = one(L, 'const UPDATED="'); cur = L[k][15:25]
    if cur < DAY: L[k] = L[k].replace(cur, DAY, 1)
t = '\n'.join(L)
if t != t0: open(p, 'w', encoding='utf-8').write(t); print(f'{T} changed index.html')
jp = os.path.join(M, 'meetings.json'); raw = open(jp, encoding='utf-8').read(); ms = json.loads(raw)
assert json.dumps(ms, ensure_ascii=False, indent=1) == raw.rstrip('\n'), f'{T}: meetings.json does not round-trip'
if add(ms):
    open(jp, 'w', encoding='utf-8').write(json.dumps(ms, ensure_ascii=False, indent=1) + ('\n' if raw.endswith('\n') else ''))
    print(f'{T} changed meetings.json')
for src in (dec.raw_decode(open(p, encoding='utf-8').read().split('const DATA=', 1)[1])[0], json.load(open(jp, encoding='utf-8'))):
    m = [x for x in src if x['n'] == 32][0]
    assert [x['k'] for x in m['docs']] == ['notice', 'doc', 'agenda'] and 'ref=11236468' in m['docs'][1]['url'], f'{T}: main 32 docs {m["docs"]}'
    assert m['time'] == '14.30' and m.get('upcoming') and [v['ck'] for v in m['media']['videos']] == ['32p'], f'{T}: main 32 card or video changed'
t = open(p, encoding='utf-8').read()
assert 'id="vidkind-js"' in t and 'id="novdl-css"' in t and 'id="friction-js"' in t, f'{T}: live layer missing'
print(f'{T} OK')
PY
MP="$BUILD/meeting_pages.py"; test -s "$MP" && python3 "$MP" "$M" >/dev/null || echo "$T: meeting_pages.py not found, m/32 not refreshed"
