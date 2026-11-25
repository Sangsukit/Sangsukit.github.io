#!/usr/bin/env bash
# Bundle item 217 commerce_1125_agendas (thread "Site: Add Commerce and Industry committee", 25 Nov 2569, routine check 05:49 UTC)
# URGENT (main 35 meets today 14.00 Bangkok = 07:00 UTC).
# 1) Commerce 2569 main 35 (Wed 25 Nov 14.00, CA 330): the Senate REPLACED the agenda file. Swap the "เอกสารประกอบ" link from
#    ref 11245294 to ref 11253858 ("ระเบียบวาระ กมธ.พาณิชย์ฯ ครั้งที่ 35-69 (251169).pdf", RType ระเบียบวาระ, Rpublic 1).
#    Time, room and agenda items 3.1/3.2 are unchanged (only item-1 announcements were added), so the card text stays. Pre video kept.
# 2) smegov sub 18 (Tue 24 Nov, held): add the agenda ref 11253871 (Rpublic 1) as the "เอกสารประกอบ" link before the agenda-page row.
# Files: commerce/2569/index.html (DATA + SUBS lines), meetings.json, sub-smegov.html (DATA line), sub-smegov.json,
#        then meeting_pages.py rebuilds m/*.html (m/35.html and m/smegov-18.html get the links).
# Self-contained (a copy of meeting_pages.py is embedded, md5-checked, used only if $BUILD has none). Idempotent; no git, no network.
# smegov 19 (1 Dec) upcoming card follows as a separate item 217b.
set -euo pipefail
: "${HUB:?HUB not set}"; BUILD=${BUILD:-/mnt/project-files/archive/build}
T=217_commerce_1125_agendas
M="$HUB/commerce/2569"
for f in index.html meetings.json sub-smegov.html sub-smegov.json; do test -f "$M/$f" || { echo "$T: $M/$f missing" >&2; exit 1; }; done
python3 - "$M" <<'PY'
import json, os, sys
M = sys.argv[1]
A35 = 'https://pis.parliament.go.th/PARFileDownloadProxy/download?s=6j39jgbAeiP5x3XRRAykq2wafUf4voKNzdSVHQLYi5i83AxVuF37Ck3H723V-YML1YUqMD9jyQ9HW4PEApTkgtKZRPesDjYwnUL2IDNg8fhiqL79hk9_I4cXQwSiu-uNRF4_hDYUPHFOyEfIVV_PZUCO0ptCeBRE1DJo_Q==&ref=11253858'
A18 = 'https://pis.parliament.go.th/PARFileDownloadProxy/download?s=pdRZMtk5e0FBgFOG5TvoRaZgd1u8gUUWMZOutAWETi3FbfCz3ZeOtWPGexKndoPT1Yx98lGjN9NqrFX5NVF1yRZc3zD24e6hl3UIY621kyyZaXO7u6D1X9JHTT7DVknd-rK2X1Xku4z3T2p5awcdc6VCsBMPsDX9Z4YuwQ==&ref=11253871'
OLD35 = 'ref=11245294'
dec = json.JSONDecoder()
def fix35(arr):
    hit = [m for m in arr if m.get('n') == 35 and m.get('date') == '2026-11-25']
    assert len(hit) == 1, '217: main 35 (25 Nov) not found once'
    ds = hit[0]['docs']
    if any(d['url'].endswith('ref=11253858') for d in ds):
        hit[0]['docs'] = [d for d in ds if not d['url'].endswith(OLD35)]; return arr
    old = [i for i, d in enumerate(ds) if d['url'].endswith(OLD35)]
    if old:
        assert ds[old[0]]['k'] == 'doc', '217: old 35 agenda is not a doc link'
        ds[old[0]] = {'k': 'doc', 'url': A35}
    else:
        assert not any(d['k'] == 'doc' for d in ds), '217: 35 has an unexpected doc link'
        k = next((i for i, d in enumerate(ds) if d['k'] == 'agenda'), len(ds)); ds.insert(k, {'k': 'doc', 'url': A35})
    return arr
def fix18(arr):
    hit = [m for m in arr if m.get('n') == 18 and m.get('date') == '2026-11-24']
    assert len(hit) == 1, '217: smegov 18 (24 Nov) not found once'
    ds = hit[0]['docs']
    if any(d['url'].endswith('ref=11253871') for d in ds): return arr
    assert not any(d['k'] == 'doc' for d in ds), '217: smegov 18 already has another doc link'
    k = next((i for i, d in enumerate(ds) if d['k'] == 'agenda'), len(ds)); ds.insert(k, {'k': 'doc', 'url': A18}); return arr
def fixsubs(arr):
    s = [x for x in arr if x.get('key') == 'smegov']; assert len(s) == 1, '217: SUBS smegov'
    fix18(s[0]['meetings']); return arr
dumps = [lambda a: json.dumps(a, ensure_ascii=False), lambda a: json.dumps(a, ensure_ascii=False, separators=(',', ':')),
         lambda a: json.dumps(a, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/'),
         lambda a: json.dumps(a, ensure_ascii=False).replace('</', '<\\/')]
def edit_html(name, pairs):
    p = os.path.join(M, name); src = open(p, encoding='utf-8').read(); L = src.split('\n')
    for pre, fn in pairs:
        idx = [i for i, l in enumerate(L) if l.startswith(pre)]; assert len(idx) == 1, f'217: {name} {pre} line'
        i = idx[0]; body = L[i][len(pre):]; val, end = dec.raw_decode(body); tail = body[end:]
        dump = next((f for f in dumps if pre + f(val) + tail == L[i]), None)
        assert dump, f'217: {name} {pre} does not round-trip; not touching it'
        L[i] = pre + dump(fn(val)) + tail
    t = '\n'.join(L)
    if t != src: open(p, 'w', encoding='utf-8').write(t); print('217 changed', name)
def edit_json(name, fn):
    jp = os.path.join(M, name); raw = open(jp, encoding='utf-8').read(); ms = json.loads(raw)
    ind = next((n for n in (1, 2, None) if json.dumps(ms, ensure_ascii=False, indent=n) == raw.rstrip('\n')), 'x')
    assert ind != 'x', f'217: {name} does not round-trip'
    out = json.dumps(fn(ms), ensure_ascii=False, indent=ind) + ('\n' if raw.endswith('\n') else '')
    if out != raw: open(jp, 'w', encoding='utf-8').write(out); print('217 changed', name)
edit_html('index.html', [('const DATA=', fix35), ('const SUBS=', fixsubs)])
edit_json('meetings.json', fix35)
edit_html('sub-smegov.html', [('const DATA=', fix18)])
edit_json('sub-smegov.json', fix18)
PY
MP="$BUILD/meeting_pages.py"
if [ ! -s "$MP" ]; then
  TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT; MP="$TMP/meeting_pages.py"
  echo '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' | base64 -d | gunzip > "$MP"
  test "$(md5sum < "$MP" | cut -c1-32)" = 6a115e8dce53e6b83bd9db5a477f1f55 || { echo "$T: embedded meeting_pages.py damaged" >&2; exit 1; }
fi
python3 "$MP" "$M" >/dev/null
python3 - "$M" <<'PY'
import json, sys
M = sys.argv[1]; dec = json.JSONDecoder()
def line(f, pre):
    for l in open(f'{M}/{f}', encoding='utf-8').read().split('\n'):
        if l.startswith(pre): return dec.raw_decode(l[len(pre):])[0]
d = {m['n']: m for m in line('index.html', 'const DATA=')}
js = {m['n']: m for m in json.load(open(f'{M}/meetings.json', encoding='utf-8'))}
for src in (d, js):
    ks = [(x['k'], x['url'].rsplit('ref=', 1)[-1]) for x in src[35]['docs']]
    assert ('doc', '11253858') in ks and ('notice', '11216585') in ks, '217: 35 docs'
    assert not any(r == '11245294' for _, r in ks), '217: old 35 agenda still linked'
    assert src[35].get('upcoming') and src[35]['time'] == '14.00', '217: 35 card'
    assert [v['ck'] for v in src[35]['media']['videos']] == ['35p'], '217: 35 pre video kept'
sd = {m['n']: m for m in line('sub-smegov.html', 'const DATA=') if m['date'] == '2026-11-24'}
sj = {m['n']: m for m in json.load(open(f'{M}/sub-smegov.json', encoding='utf-8')) if m['date'] == '2026-11-24'}
ss = {m['n']: m for m in [x for x in line('index.html', 'const SUBS=') if x['key'] == 'smegov'][0]['meetings'] if m['date'] == '2026-11-24'}
for src in (sd, sj, ss):
    ks = [(x['k'], x['url'].rsplit('ref=', 1)[-1]) for x in src[18]['docs']]
    assert ('doc', '11253871') in ks and ('notice', '11225978') in ks, '217: smegov 18 docs'
for v in (sd, sj): assert [x['ck'] for x in v[18]['media']['videos']] == ['smegov-18p'], '217: smegov 18 pre video kept'
m35 = open(f'{M}/m/35.html', encoding='utf-8').read()
assert m35.count('ref=11253858') == 1 and 'ref=11245294' not in m35, '217: m/35.html link'
assert open(f'{M}/m/smegov-18.html', encoding='utf-8').read().count('ref=11253871') == 1, '217: m/smegov-18.html link'
print('217_commerce_1125_agendas OK')
PY
