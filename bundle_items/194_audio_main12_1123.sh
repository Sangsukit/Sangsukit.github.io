set -e
# Recorded "ฟังสรุปนี้" voice for 12 meetings (Agri 37/38/39, Labour 30/31 + employment 24 + welfare 25, Commerce 34, Social 37,
# Transport 26, Education 46, Environment 41). Texts are the live pages of hub b2594e0 (bundle 52).
F=/mnt/project-files/archive/bundle/items/194_audio_main12_1123_files
python3 - "$F" <<'PY'
import json, os, shutil, sys
F = sys.argv[1]
roots = {'A69': os.environ.get('A69', ''), 'HUB': os.environ['HUB']}
for it in json.load(open(os.path.join(F, 'entries.json'), encoding='utf-8')):
    site = os.path.join(roots[it['root']], it['site'])
    adir = os.path.join(site, 'audio'); os.makedirs(adir, exist_ok=True)
    idx = os.path.join(adir, 'index.json')
    try: d = json.load(open(idx, encoding='utf-8'))
    except FileNotFoundError: d = {}
    if it.get('remove'):
        e = d.pop(it['key'], None)
        if e:
            p = os.path.join(site, e['f'])
            if os.path.exists(p): os.remove(p)
            print('audio entry removed:', it['site'], it['key'], e['f'])
        else:
            print('audio entry already gone:', it['site'], it['key'])
        json.dump(d, open(idx, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
        continue
    old = d.get(it['key'], {}).get('f')
    shutil.copy(os.path.join(F, os.path.basename(it['entry']['f'])), adir)
    if old and old != it['entry']['f'] and os.path.exists(os.path.join(site, old)):
        os.remove(os.path.join(site, old)); print('removed old', old)
    d[it['key']] = it['entry']
    json.dump(d, open(idx, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print('audio entry set:', it['site'], it['key'], it['entry']['f'])
PY
