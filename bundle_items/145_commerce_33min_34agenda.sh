#!/usr/bin/env bash
# Bundle item 145 commerce_33min_34agenda (thread "Site: Add Commerce and Industry committee", 18 Nov 2569, routine request 11:52 UTC)
# Commerce 2569 main committee, link-only update (no text, no design change), self-contained (no payload folder):
#   34/2569 (18 Nov): the Senate replaced the agenda PDF; doc link ref 11195070 -> ref 11204700
#     ("ระเบียบวาระ กมธ.พาณิชย์ฯ ครั้งที่ 34-69 (181169).pdf", Rpublic 1). Card text already matches the new agenda.
#   33/2569 (11 Nov): add the published minutes, ref 11204694 ("บันทึกการประชุมค.33-69(111169).pdf", Rpublic 1),
#     placed like meetings 1-32 (after the summary in DATA/meetings.json; after the agenda link on m/33.html).
# Files: index.html (const DATA=), meetings.json, m/33.html, m/34.html. Idempotent; no git, no network.
set -euo pipefail
: "${HUB:?HUB not set}"
M="$HUB/commerce/2569"
for f in index.html meetings.json m/33.html m/34.html; do
  test -f "$M/$f" || { echo "145_commerce_33min_34agenda: $M/$f missing" >&2; exit 1; }; done
python3 - "$M" <<'PY'
import json, os, sys, html
M = sys.argv[1]
AG = 'https://pis.parliament.go.th/PARFileDownloadProxy/download?s=KN2ZfAxpnUspaBniWDp93XaybIBcEIzuuQyOjrceD_cQfDFcPDkUFGAk_aIOQRjzfAXnXxDg4M5Zw94W0mGVrngfF26O7Jteh72qEwMi6yV6YSVkB56c6uIKAR2x2o9AiGV2SvRKy5hXJe04Fw_YT42L4aLz-syacAricQ==&ref=11204700'
MN = 'https://pis.parliament.go.th/PARFileDownloadProxy/download?s=0RHe-IaAalkXwv1n3zfOVJarFRhaaj3kANlYd_gQxoiPtCRfGpR-R8Kjgg3ULOlBT5XvBu4Ddxb_xWfJ__L_DaSOUpPnbwCHUHPGRMgVz2_68ucll4yqjpHm9QQDT1X6JlY3KSwMolwuEQ8Y29s_6HJ-m86MhCKc0bkfSQ==&ref=11204694'
dec = json.JSONDecoder()
def fix(arr):
    d = {m['n']: m for m in arr}
    m34 = d[34]; hit = [x for x in m34['docs'] if x['k'] == 'doc']
    assert len(hit) == 1 and (hit[0]['url'].endswith('ref=11195070') or hit[0]['url'] == AG), '145: 34 doc link changed on live'
    hit[0]['url'] = AG
    m33 = d[33]; ks = [x['k'] for x in m33['docs']]
    if not any(x['k'] == 'minutes' for x in m33['docs']):
        assert 'summary' in ks, '145: 33 has no summary row'
        m33['docs'].insert(ks.index('summary') + 1, {'k': 'minutes', 'url': MN})
    else:
        assert [x['url'] for x in m33['docs'] if x['k'] == 'minutes'] == [MN], '145: 33 has other minutes'
    return arr
# index.html DATA
p = os.path.join(M, 'index.html'); L = open(p, encoding='utf-8').read().split('\n')
idx = [i for i, l in enumerate(L) if l.startswith('const DATA=')]; assert len(idx) == 1
i = idx[0]; body = L[i][11:]; val, end = dec.raw_decode(body); tail = body[end:]
dumps = [lambda a: json.dumps(a, ensure_ascii=False), lambda a: json.dumps(a, ensure_ascii=False, separators=(',', ':'))]
dump = next((f for f in dumps if 'const DATA=' + f(val) + tail == L[i]), None)
assert dump, '145: DATA does not round-trip; not touching it'
L[i] = 'const DATA=' + dump(fix(val)) + tail
t = '\n'.join(L)
if open(p, encoding='utf-8').read() != t: open(p, 'w', encoding='utf-8').write(t); print('145 changed index.html')
# meetings.json
jp = os.path.join(M, 'meetings.json'); raw = open(jp, encoding='utf-8').read(); ms = json.loads(raw)
assert json.dumps(ms, ensure_ascii=False, indent=1) == raw.rstrip('\n'), '145: meetings.json does not round-trip'
out = json.dumps(fix(ms), ensure_ascii=False, indent=1) + ('\n' if raw.endswith('\n') else '')
if out != raw: open(jp, 'w', encoding='utf-8').write(out); print('145 changed meetings.json')
# m/34.html: swap the agenda PDF link
p = os.path.join(M, 'm/34.html'); s = open(p, encoding='utf-8').read()
old = [l for l in s.split('\n') if 'ref=11195070' in l]
if old:
    assert len(old) == 1 and 'เอกสารประกอบ' in old[0]
    a = old[0].index('href="') + 6; b = old[0].index('"', a)
    s2 = s.replace(old[0], old[0][:a] + html.escape(AG) + old[0][b:])
    open(p, 'w', encoding='utf-8').write(s2); print('145 changed m/34.html')
# m/33.html: add the minutes link after the agenda link (same order as m/32.html)
p = os.path.join(M, 'm/33.html'); s = open(p, encoding='utf-8').read()
if 'ref=11204694' not in s:
    L = s.split('\n'); k = [j for j, l in enumerate(L) if 'MeetingAgendaDetailForQRCode' in l and l.startswith('<li>')]
    assert len(k) == 1, '145: m/33 agenda row'
    L.insert(k[0] + 1, f'<li><a href="{html.escape(MN)}" target="_blank" rel="noopener">บันทึกการประชุม</a></li>')
    open(p, 'w', encoding='utf-8').write('\n'.join(L)); print('145 changed m/33.html')
PY
python3 - "$M" <<'PY'
import json, sys
M = sys.argv[1]; dec = json.JSONDecoder()
for l in open(f'{M}/index.html', encoding='utf-8').read().split('\n'):
    if l.startswith('const DATA='): d = {m['n']: m for m in dec.raw_decode(l[11:])[0]}
js = {m['n']: m for m in json.load(open(f'{M}/meetings.json', encoding='utf-8'))}
for src in (d, js):
    assert [x['url'][-8:] for x in src[34]['docs'] if x['k'] == 'doc'] == ['11204700'], '34 doc'
    assert [x['k'] for x in src[33]['docs']].count('minutes') == 1 and any(x['url'].endswith('ref=11204694') for x in src[33]['docs']), '33 minutes'
    assert (src[34].get('upcoming') or any(x['url'].endswith('ref=11216297') for x in src[34]['docs'])) and src[34]['time'] == '14.00' and 'CA 330' in src[34]['room'], '34 card unchanged'
    assert src[33]['media']['video']['ck'] == '33' and src[34]['media']['video']['ck'] == '34p', 'videos kept'
m33 = open(f'{M}/m/33.html', encoding='utf-8').read(); m34 = open(f'{M}/m/34.html', encoding='utf-8').read()
assert m33.count('ref=11204694') == 1 and 'ref=11195070' not in m34 and m34.count('ref=11204700') == 1
print('145_commerce_33min_34agenda OK')
PY
