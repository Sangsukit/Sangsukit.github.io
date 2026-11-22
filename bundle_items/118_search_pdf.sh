#!/bin/bash
# 118 search_pdf (owner: thread "Site: Upgrade search into research engine"; Sukit "Go live, refresh weekly" 22 Nov 2569).
# Self-contained: needs only the folder 118_search_pdf_files/ next to this script (no downloads, no shared-folder payload).
#  1. puts the new search code into archive/search (PDF-aware build_index.js, engine.js, ui/app.js + app.css, pdf/ tools),
#  2. puts the prebuilt PDF index (idx/x/, about 41 MB) into $HUB/search/idx/ and records it in manifest.json (.x),
#  3. rebuilds the main index (without --pdf, so x/ is kept as is) and the /search/ page with the new code.
# Idempotent: a second run changes nothing. Later ordinary bundle rebuilds keep x/ (0 changed files).
set -e
F="$(cd "$(dirname "$0")" && pwd)/118_search_pdf_files"
S="${SEARCH_SRC:-/mnt/project-files/archive/search}"
[ -f "$F/payload/manifest_x.json" ] && [ -f "$F/payload/x/meta.json" ] || { echo "118: payload missing in $F" >&2; exit 1; }
mkdir -p "$S/ui" "$S/pdf" "$S/eval"
cp "$F/code/build_index.js" "$F/code/engine.js" "$F/code/README.md" "$F/code/LEGAL_CHECK_PDF.md" "$S/"
cp "$F/code/ui/app.js" "$F/code/ui/app.css" "$S/ui/"
cp "$F/code/pdf/"* "$S/pdf/"
cp "$F/code/eval/pdf_known_item.js" "$S/eval/"
I="$HUB/search/idx"
[ -f "$I/manifest.json" ] || { echo "118: $I/manifest.json missing (search page not live?)" >&2; exit 1; }
rm -rf "$I/x" && cp -r "$F/payload/x" "$I/x"
node -e 'const fs=require("fs"),[m,x]=process.argv.slice(1);const o=JSON.parse(fs.readFileSync(m,"utf8"));o.x=JSON.parse(fs.readFileSync(x,"utf8"));fs.writeFileSync(m,JSON.stringify(o))' "$I/manifest.json" "$F/payload/manifest_x.json"
node "$S/build_index.js" --hub "$HUB" --a69 "$A69" --a68 "$A68" --a67 "$A67" --out "$I"
python3 "$S/ui/make_page.py" --hub "$HUB" --src "$S"
node -e 'const m=require(process.argv[1]);if(!m.x||!m.x.N)process.exit(3);console.log("118: PDF files searchable",m.x.N)' "$I/manifest.json"
