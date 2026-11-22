"""Download each official document the site links to (public only: the site links Rpublic=1 docs), keep only its text.
Usage: python3 extract.py docs.json cache.jsonl [workers]   (resumable; skips refs already in cache; deletes every PDF after reading)"""
import json, sys, os, re, subprocess, tempfile, threading, time, urllib.parse
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from thai_clean import clean, thai_ratio
src, cache = sys.argv[1], sys.argv[2]; W = int(sys.argv[3]) if len(sys.argv) > 3 else 6
docs = [d for d in json.load(open(src)) if d['k'] in ('summary', 'minutes', 'doc', 'brief', 'notice')]
def ref(u): q = urllib.parse.parse_qs(urllib.parse.urlparse(u).query); return (q.get('ref') or [''])[0]
done = set()
if os.path.exists(cache):
    for l in open(cache, encoding='utf-8'):
        try: done.add(json.loads(l)['ref'])
        except Exception: pass
todo, seen = [], set()
for d in docs:
    r = ref(d['url'])
    if not r or r in done or r in seen: continue
    seen.add(r); d['ref'] = r; todo.append(d)
print(f"{len(docs)} docs, {len(done)} cached, {len(todo)} to fetch", flush=True)
lock = threading.Lock(); out = open(cache, 'a', encoding='utf-8'); n = [0, 0, 0]; T0 = time.time()
TMP = tempfile.mkdtemp(prefix='pdfx_')
def one(d):
    f = os.path.join(TMP, d['ref'] + '.pdf'); rec = {'ref': d['ref'], 'k': d['k'], 'c': d['c'], 'y': d['y'], 'key': d['key'], 'n': d['n'], 'date': d['date']}
    try:
        for a in range(3):
            r = subprocess.run(['curl', '-sS', '-m', '120', '-o', f, '-w', '%{http_code}', d['url']], capture_output=True, text=True)
            if r.stdout == '200' and os.path.exists(f) and os.path.getsize(f) > 500: break
            time.sleep(3 * (a + 1))
        else:
            rec['err'] = 'download ' + r.stdout; return rec
        with open(f, 'rb') as fh:
            if fh.read(5) != b'%PDF-': rec['err'] = 'not pdf'; return rec
        info = subprocess.run(['pdfinfo', f], capture_output=True, text=True, timeout=60).stdout
        m = re.search(r'Pages:\s+(\d+)', info); rec['np'] = int(m.group(1)) if m else 0
        raw = subprocess.run(['pdftotext', '-layout', '-enc', 'UTF-8', f, '-'], capture_output=True, text=True, timeout=180).stdout
        pages = [clean(p) for p in raw.split('\f')]
        while pages and not pages[-1]: pages.pop()
        txt = '\n'.join(pages)
        thp = [len(re.findall('[\u0e01-\u0e5b]', p)) for p in pages]
        rec['empty_pages'] = sum(1 for i in range(max(rec['np'], len(pages))) if i >= len(thp) or thp[i] < 30)
        rec['scanned'] = rec['empty_pages'] > 0.6 * max(1, rec['np']) or thai_ratio(txt) < 0.4
        rec['pages'] = [] if rec['scanned'] else pages
    except Exception as e:
        rec['err'] = str(e)[:120]
    finally:
        try: os.remove(f)
        except OSError: pass
    return rec
def write(rec):
    with lock:
        out.write(json.dumps(rec, ensure_ascii=False) + '\n'); out.flush()
        n[0] += 1; n[1] += 1 if rec.get('scanned') else 0; n[2] += 1 if rec.get('err') else 0
        if n[0] % 100 == 0: print(f"{n[0]}/{len(todo)} scanned {n[1]} errors {n[2]} {time.time()-T0:.0f}s", flush=True)
with ThreadPoolExecutor(W) as ex:
    for rec in ex.map(one, todo): write(rec)
print(f"done {n[0]} scanned {n[1]} errors {n[2]} {time.time()-T0:.0f}s", flush=True)
