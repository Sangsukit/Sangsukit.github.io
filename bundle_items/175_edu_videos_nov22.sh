#!/usr/bin/env bash
# Bundle item 175_edu_videos_nov22 (thread "Videos: Education committee meetings", 22 Nov 2569). Renumber freely.
# Adds 7 Education videos to parliamentx.com/education/2569 (1080x1920, Thai voice + English subtitles burned in, one version):
#   main: 46 post (18 Nov), 47 pre (25 Nov) ; learning 23 post ; vocational 34 post, 35 pre (25 Nov) ; higher 40 post, 41 pre (23 Nov).
# APPLY AFTER 165_edu_env_energy_nov22 (it adds the 47 / vocational 35 rows; higher 41 comes with 142-144). Stops if a row is missing.
# Surgical: copies mp4/vtt/poster, replaces only "media" of those 7 meetings (DATA line + page json; live videos at the same
# meeting, e.g. 46 pre, are kept exactly as live), adds CAPS tracks, remakes video share pages (CARD_BIG=1) + no_video_dl,
# refreshes the home newest-4 video list and the Education 2569 snapshot "v", then moves the mp4s to the video repos.
# Payload: 175_edu_videos_nov22_files/media/ next to this script. Idempotent; no git, no network. Needs $HUB ($BUILD optional).
set -euo pipefail
: "${HUB:?HUB not set}"; BUILD=${BUILD:-/mnt/project-files/archive/build}
SRC=$(cd "$(dirname "$0")" && pwd)/175_edu_videos_nov22_files/media
[ -d "$SRC" ] || SRC=/mnt/project-files/archive/bundle/items/175_edu_videos_nov22_files/media
L="$HUB/education/2569"
for p in index.html sub-learning.html sub-vocational.html sub-higher.html meetings.json; do test -f "$L/$p" || { echo "175_edu_videos_nov22: $L/$p missing" >&2; exit 1; }; done
for v in v46:200 v47pre:155 sub-learning-v23:168 sub-vocational-v34:79 sub-vocational-v35pre:126 sub-higher-v40:170 sub-higher-v41pre:153; do f=${v%%:*}; want=${v##*:}
  test -s "$SRC/$f.mp4" -a -s "$SRC/$f.th.vtt" || { echo "175_edu_videos_nov22: $SRC/$f missing" >&2; exit 1; }
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$SRC/$f.mp4")
  python3 -c "import sys; sys.exit(0 if abs(float('$dur')-$want)<1.5 else 1)" || { echo "175_edu_videos_nov22: $f length $dur, expected ~$want s" >&2; exit 1; }
  wh=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$SRC/$f.mp4"); [ "$wh" = "1080,1920" ] || { echo "175_edu_videos_nov22: $f size $wh" >&2; exit 1; }
  head -1 "$SRC/$f.th.vtt" | grep -q '^WEBVTT' || { echo "175_edu_videos_nov22: $f vtt header" >&2; exit 1; }
done
mkdir -p "$L/media" "$L/img"
# an mp4 already moved to the video repos (re-run) is not copied back
for f in v46.mp4 v47pre.mp4 sub-learning-v23.mp4 sub-vocational-v34.mp4 sub-vocational-v35pre.mp4 sub-higher-v40.mp4 sub-higher-v41pre.mp4; do if grep -q "/video-[0-9]*/education/2569/media/$f" "$L/meetings.json" "$L"/sub-*.json 2>/dev/null; then continue; fi
  cmp -s "$SRC/$f" "$L/media/$f" || cp -f "$SRC/$f" "$L/media/$f"; cmp -s "$SRC/$f" "$L/media/$f"; done
for f in v46.th.vtt v47pre.th.vtt sub-learning-v23.th.vtt sub-vocational-v34.th.vtt sub-vocational-v35pre.th.vtt sub-higher-v40.th.vtt sub-higher-v41pre.th.vtt; do cmp -s "$SRC/$f" "$L/media/$f" || cp -f "$SRC/$f" "$L/media/$f"; cmp -s "$SRC/$f" "$L/media/$f"; done
for f in poster46.jpg poster47pre.jpg poster-sub-learning-23.jpg poster-sub-vocational-34.jpg poster-sub-vocational-35pre.jpg poster-sub-higher-40.jpg poster-sub-higher-41pre.jpg; do cmp -s "$SRC/$f" "$L/img/$f" || cp -f "$SRC/$f" "$L/img/$f"; cmp -s "$SRC/$f" "$L/img/$f"; done
python3 - "$HUB" "$SRC" <<'PY'
import json, os, re, sys
HUB, SRC = sys.argv[1:3]; L = os.path.join(HUB, 'education', '2569')
D = json.loads(r"""{
"MEDIA": {
"index.html": {
"46|2026-11-18": {
"video": {
"src": "media/v46.mp4",
"poster": "img/poster46.jpg",
"vtt": "media/v46.th.vtt",
"kind": "post",
"label": "วิดีโอสรุปผลการประชุม",
"dur": "3:20",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "46"
},
"videos": [
{
"src": "media/v46.mp4",
"poster": "img/poster46.jpg",
"vtt": "media/v46.th.vtt",
"kind": "post",
"label": "วิดีโอสรุปผลการประชุม",
"dur": "3:20",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "46"
},
{
"src": "/video-1/education/2569/media/v46pre.mp4",
"poster": "img/poster46pre.jpg",
"vtt": "media/v46pre.th.vtt",
"kind": "pre",
"label": "วิดีโอก่อนการประชุม",
"dur": "2:34",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "46p",
"size": 6188506
}
]
},
"47|2026-11-25": {
"video": {
"src": "media/v47pre.mp4",
"poster": "img/poster47pre.jpg",
"vtt": "media/v47pre.th.vtt",
"kind": "pre",
"label": "วิดีโอก่อนการประชุม",
"dur": "2:35",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "47p"
},
"videos": [
{
"src": "media/v47pre.mp4",
"poster": "img/poster47pre.jpg",
"vtt": "media/v47pre.th.vtt",
"kind": "pre",
"label": "วิดีโอก่อนการประชุม",
"dur": "2:35",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "47p"
}
]
}
},
"sub-learning.html": {
"23|2026-11-18": {
"video": {
"src": "media/sub-learning-v23.mp4",
"poster": "img/poster-sub-learning-23.jpg",
"vtt": "media/sub-learning-v23.th.vtt",
"kind": "post",
"label": "วิดีโอสรุปผลการประชุม",
"dur": "2:48",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "learning-23"
},
"videos": [
{
"src": "media/sub-learning-v23.mp4",
"poster": "img/poster-sub-learning-23.jpg",
"vtt": "media/sub-learning-v23.th.vtt",
"kind": "post",
"label": "วิดีโอสรุปผลการประชุม",
"dur": "2:48",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "learning-23"
},
{
"src": "/video-1/education/2569/media/sub-learning-v23pre.mp4",
"poster": "img/poster-sub-learning-23pre.jpg",
"vtt": "media/sub-learning-v23pre.th.vtt",
"kind": "pre",
"label": "วิดีโอก่อนการประชุม",
"dur": "2:06",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "learning-23p",
"size": 5059624
}
]
}
},
"sub-vocational.html": {
"34|2026-11-18": {
"video": {
"src": "media/sub-vocational-v34.mp4",
"poster": "img/poster-sub-vocational-34.jpg",
"vtt": "media/sub-vocational-v34.th.vtt",
"kind": "post",
"label": "วิดีโอสรุปผลการประชุม",
"dur": "1:19",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "vocational-34"
},
"videos": [
{
"src": "media/sub-vocational-v34.mp4",
"poster": "img/poster-sub-vocational-34.jpg",
"vtt": "media/sub-vocational-v34.th.vtt",
"kind": "post",
"label": "วิดีโอสรุปผลการประชุม",
"dur": "1:19",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "vocational-34"
},
{
"src": "/video-1/education/2569/media/sub-vocational-v34pre.mp4",
"poster": "img/poster-sub-vocational-34pre.jpg",
"vtt": "media/sub-vocational-v34pre.th.vtt",
"kind": "pre",
"label": "วิดีโอก่อนการประชุม",
"dur": "1:56",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "vocational-34p",
"size": 4474624
}
]
},
"35|2026-11-25": {
"video": {
"src": "media/sub-vocational-v35pre.mp4",
"poster": "img/poster-sub-vocational-35pre.jpg",
"vtt": "media/sub-vocational-v35pre.th.vtt",
"kind": "pre",
"label": "วิดีโอก่อนการประชุม",
"dur": "2:06",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "vocational-35p"
},
"videos": [
{
"src": "media/sub-vocational-v35pre.mp4",
"poster": "img/poster-sub-vocational-35pre.jpg",
"vtt": "media/sub-vocational-v35pre.th.vtt",
"kind": "pre",
"label": "วิดีโอก่อนการประชุม",
"dur": "2:06",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "vocational-35p"
}
]
}
},
"sub-higher.html": {
"40|2026-11-17": {
"video": {
"src": "media/sub-higher-v40.mp4",
"poster": "img/poster-sub-higher-40.jpg",
"vtt": "media/sub-higher-v40.th.vtt",
"kind": "post",
"label": "วิดีโอสรุปผลการประชุม",
"dur": "2:50",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "higher-40"
},
"videos": [
{
"src": "media/sub-higher-v40.mp4",
"poster": "img/poster-sub-higher-40.jpg",
"vtt": "media/sub-higher-v40.th.vtt",
"kind": "post",
"label": "วิดีโอสรุปผลการประชุม",
"dur": "2:50",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "higher-40"
},
{
"src": "/video-1/education/2569/media/sub-higher-v40pre.mp4",
"poster": "img/poster-sub-higher-40pre.jpg",
"vtt": "media/sub-higher-v40pre.th.vtt",
"kind": "pre",
"label": "วิดีโอก่อนการประชุม",
"dur": "2:18",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "higher-40p",
"size": 5473740
}
]
},
"41|2026-11-23": {
"video": {
"src": "media/sub-higher-v41pre.mp4",
"poster": "img/poster-sub-higher-41pre.jpg",
"vtt": "media/sub-higher-v41pre.th.vtt",
"kind": "pre",
"label": "วิดีโอก่อนการประชุม",
"dur": "2:33",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "higher-41p"
},
"videos": [
{
"src": "media/sub-higher-v41pre.mp4",
"poster": "img/poster-sub-higher-41pre.jpg",
"vtt": "media/sub-higher-v41pre.th.vtt",
"kind": "pre",
"label": "วิดีโอก่อนการประชุม",
"dur": "2:33",
"cc": "เสียงบรรยายภาษาไทย มีคำบรรยายภาษาอังกฤษในวิดีโอ",
"ck": "higher-41p"
}
]
}
}
},
"CAPK": {
"index.html": {
"46": "media/v46.th.vtt",
"47p": "media/v47pre.th.vtt"
},
"sub-learning.html": {
"learning-23": "media/sub-learning-v23.th.vtt"
},
"sub-vocational.html": {
"vocational-34": "media/sub-vocational-v34.th.vtt",
"vocational-35p": "media/sub-vocational-v35pre.th.vtt"
},
"sub-higher.html": {
"higher-40": "media/sub-higher-v40.th.vtt",
"higher-41p": "media/sub-higher-v41pre.th.vtt"
}
},
"JSONS": {
"index.html": "meetings.json",
"sub-learning.html": "sub-learning.json",
"sub-vocational.html": "sub-vocational.json",
"sub-higher.html": "sub-higher.json"
}
}""")
MEDIA, CAPK, JSONS = D['MEDIA'], D['CAPK'], D['JSONS']
CMP = dict(ensure_ascii=False, separators=(',', ':'))
ser = lambda a: json.dumps(a, **CMP).replace('</', '<\\/')
changed = []

def put(path, text):
    old = open(path, encoding='utf-8').read()
    if old != text:
        open(path, 'w', encoding='utf-8').write(text); changed.append(os.path.relpath(path, HUB))

def sized(md, cur):
    md = json.loads(json.dumps(md)); have = {v['ck']: v for v in ((cur or {}).get('videos') or [])}
    for v in md['videos']:
        h = have.get(v['ck'])
        if v.get('size'):
            pass                                       # live video kept as live
        elif h and h['src'].startswith('/video-') and os.path.basename(h['src']) == os.path.basename(v['src']):
            v['src'], v['size'] = h['src'], h['size']  # re-run after the offload: keep the video-repo link
        else:
            v['size'] = os.path.getsize(os.path.join(L, v['src']))
    md['video'] = md['videos'][0]
    return md

def jline(lines, prefix, dump):
    idx = [i for i, l in enumerate(lines) if l.startswith(prefix)]
    assert len(idx) == 1, f'{prefix} line not found once'
    line = lines[idx[0]]; body = line[len(prefix):]; tail = body[len(body.rstrip().rstrip(';')):]
    val = json.loads(body[:len(body) - len(tail)])
    assert prefix + dump(val) + tail == line, f'{prefix} line does not round-trip; not touching it'
    return idx[0], val, tail

def nolink(md):   # compare ignoring src/size (video-repo rewrite) so live videos must otherwise match exactly
    return [{k: x for k, x in v.items() if k not in ('src', 'size')} for v in (md or {}).get('videos') or []]

for page, want in MEDIA.items():
    p = os.path.join(L, page); lines = open(p, encoding='utf-8').read().split('\n')
    i, arr, tail = jline(lines, 'const DATA=', ser)
    keys = {f"{m['n']}|{m['date']}": m for m in arr}
    for k, md in want.items():
        assert k in keys, f'{page}: meeting {k} not on the page (apply 142-144 and 165 first)'
        cur = keys[k].get('media') or {}
        keep = [v for v in nolink(cur) if v['ck'] not in CAPK[page]]
        assert all(v in nolink(md) for v in keep), f'{page} {k}: live media differs from what this item expects: {cur}'
        keys[k]['media'] = sized(md, cur)
    lines[i] = 'const DATA=' + ser(arr) + tail
    i, caps, tail = jline(lines, 'const CAPS=', lambda a: json.dumps(a, ensure_ascii=False))
    for ck, vtt in CAPK[page].items():
        caps[ck] = open(os.path.join(L, vtt), encoding='utf-8').read()
    lines[i] = 'const CAPS=' + json.dumps(caps, ensure_ascii=False) + tail
    put(p, '\n'.join(lines))
    p = os.path.join(L, JSONS[page]); raw = open(p, encoding='utf-8').read(); ms = json.loads(raw)
    assert json.dumps(ms, ensure_ascii=False, indent=1) == raw, f'{JSONS[page]} does not round-trip; not touching it'
    mk = {f"{m['n']}|{m['date']}": m for m in ms}
    for k, md in want.items():
        assert k in mk, f'{JSONS[page]}: meeting {k} missing'
        mk[k]['media'] = sized(md, mk[k].get('media'))
    put(p, json.dumps(ms, ensure_ascii=False, indent=1))

# home page: newest-4 video list (archive/hub/home.py rules) + Education 2569 snapshot "v" counts
ms = json.load(open(os.path.join(L, 'meetings.json'), encoding='utf-8'))
p = os.path.join(HUB, 'index.html'); t = open(p, encoding='utf-8').read(); dec = json.JSONDecoder()
mark = 'const HH = '
if t.count(mark) == 1:
    i = t.index(mark) + len(mark); hh, _ = dec.raw_decode(t[i:])
    old_s = ser(hh['videos'])
    assert t.count(old_s) == 1, 'home: video list text not found once'
    new = []
    for m in ms:
        for v in (m.get('media') or {}).get('videos') or []:
            new.append(dict(n=m['n'], date=m['date'], year=2569, who='กมธ.การศึกษา การอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม', label=v.get('label') or 'วิดีโอสรุป',
                            dur=v.get('dur', ''), poster='education/2569/' + v['poster'] if v.get('poster') else '',
                            headline='' if m.get('pending') else (m.get('headline') or ''), href=f"education/2569/#read-{m['n']}"))
    seen = {(v['href'], v['poster']) for v in hh['videos']}
    vids = hh['videos'] + [v for v in new if (v['href'], v['poster']) not in seen]
    vids.sort(key=lambda v: v['date'], reverse=True)
    t = t.replace(old_s, ser(vids[:4]), 1)
else:
    print('175_edu_videos_nov22: home page has no HH list (skipped)')
dm = 'const DATA = '
assert t.count(dm) == 1, 'home: DATA not found once'
j = t.index(dm) + len(dm); hub, _ = dec.raw_decode(t[j:])
nv = {(m['n'], m['date']): len((m.get('media') or {}).get('videos') or []) for m in ms}
for c in hub:
    if c.get('id') != 'education':
        continue
    for y in c.get('years', []):
        if y.get('year') != 2569:
            continue
        for s in y.get('snap') or []:
            w = nv.get((s['n'], s['date']))
            if w is not None and s.get('v') != w:
                a = ser(s); s['v'] = w; b = ser(s)
                assert t.count(a) == 1, f'home: snapshot entry {s["n"]} not found once'
                t = t.replace(a, b, 1)
put(p, t)
print('175_edu_videos_nov22: changed', len(changed), 'text files:', ', '.join(changed) or 'none (already applied)')
PY
CARD_BIG=1 python3 "$BUILD/video_share.py" "$L" https://parliamentx.com/education/2569 2569
python3 "$BUILD/no_video_dl.py" "$L/s"
python3 "$BUILD/no_video_dl.py" --check "$L"
for f in v-46 v-47-pre v-learning-23 v-vocational-34 v-vocational-35-pre v-higher-40 v-higher-41-pre; do test -f "$L/s/$f.html" || { echo "175_edu_videos_nov22: share page s/$f.html missing" >&2; exit 1; }; done
VR=/mnt/project-files/archive/video_repos
if [ "${I97_TEST_NO_OFFLOAD:-}" = 1 ]; then echo "175_edu_videos_nov22: offload skipped (sandbox test only)"
else
  test -f $VR/ACTIVE || { echo "175_edu_videos_nov22: video repos not active; refusing to leave videos on the main site" >&2; exit 1; }
  grep -qxF '*.mp4' $HUB/.gitignore 2>/dev/null || { echo "175_edu_videos_nov22: $HUB/.gitignore has no *.mp4 line" >&2; exit 1; }
  python3 "$BUILD/video_offload.py" "$HUB" --report $VR/OFFLOAD_175_edu_videos_nov22.md
  python3 /mnt/project-files/archive/check/video_host_check.py "$HUB"
  if find "$L" -name '*.mp4' | grep -q .; then echo "175_edu_videos_nov22: mp4 still on the main site after offload" >&2; exit 1; fi
fi
echo "175_edu_videos_nov22 OK"
