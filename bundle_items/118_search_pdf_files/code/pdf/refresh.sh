#!/bin/bash
# Weekly PDF text refresh for /search/ (owner: thread "Site: Upgrade search into research engine"; Sukit "Go live, refresh
# weekly" 22 Nov 2569). Lists the official documents the published pages link, reads only the NEW ones (cache keeps the
# rest; every PDF is deleted right after reading), hides private names / contact details again, then rebuilds idx/x/.
# Env: $HUB $A69 $A68 $A67 (as in bundle items). Needs curl, pdfinfo, pdftotext, node, python3. Network: pis.parliament.go.th.
set -e
S=/mnt/project-files/archive/search; P=$S/pdf; T=$(mktemp -d)
OUT=$T/docs.json node $P/inventory.js --hub "$HUB" --a69 "$A69" --a68 "$A68" --a67 "$A67" >/dev/null
[ -s $T/docs.json ] && cp $T/docs.json $P/docs.json
gunzip -c $P/cache.jsonl.gz > $T/cache.jsonl
python3 $P/extract.py $P/docs.json $T/cache.jsonl 6 | tail -1
gzip -9 -c $T/cache.jsonl > $P/cache.jsonl.gz.new && mv $P/cache.jsonl.gz.new $P/cache.jsonl.gz
python3 $P/redact.py $P/cache.jsonl.gz $P/cache_safe.jsonl.gz.new && mv $P/cache_safe.jsonl.gz.new $P/cache_safe.jsonl.gz
rm -rf $T
node "$S/build_index.js" --hub "$HUB" --a69 "$A69" --a68 "$A68" --a67 "$A67" --out "$HUB/search/idx" --pdf "$P/cache_safe.jsonl.gz" >/dev/null
python3 "$S/ui/make_page.py" --hub "$HUB" --src "$S"
