# ParliamentX search engine (archive/search)

Owner thread: "Site: Upgrade search into research engine" (Sukit's master prompt, 16 Nov 2569).
Status: built and tested; **not live**. Live needs Sukit's go on the review copy (design change), then the publish bundle.

## What it is

A static, build-time index + a search engine that runs in the reader's browser. No server, no database, no
outside service, no cookies, no recurring cost, no AI for ordinary searches. Works on GitHub Pages as it is.

```
committee sites (published repos only)            build (Node, ~10 s)                    browser
 hub index.html (HH committees/people/videos) ┐                                     /search/      results page (app.js)
 <site>/index.html + sub-*.html  const DATA   ├─> build_index.js ──> <hub>/search/idx/ ─> engine.js + core.js
 <site>/i18n-en.json (English translations)   │     dict.json        (static JSON shards)   home page box (home_search.py layer)
 <site>/media/*.th.vtt (video narration)      ┘
```

Only what is already published on parliamentx.com is indexed (the repos as they will be published). Nothing held back
from the site, no closed-meeting material, no PDF text (yet). The index says so on the page ("ค้นจากข้อมูลอะไรบ้าง").

## Files

| file | what |
|---|---|
| `core.js` | Thai/English text handling shared by build and browser: normalisation (Thai digits, ส.ว.→สว, เเ→แ, zero-width, quotes), Thai word cutting (Intl.Segmenter "th", fallback dictionary DP), English stemming, query reading (meeting no. "36/2569", years BE/CE "ปี 2026"/"พ.ศ. 2568"/ranges, "budget year 2570" is NOT a filter, committee words, intents: latest, meeting, committee, senator, video, document, question). |
| `engine.js` | Loads the index piece by piece, plans the query (dictionary spans, abbreviations, Thai/English concept alternatives, typo fixes, word-start completion), ranks (BM25F + idf + coverage + phrase pairs + entity boosts), filters, facets, notes (corrected / did-you-mean / partial match), highlight terms, suggestions while typing. |
| `build_index.js` | Builds `<hub>/search/idx/`. Stable record ids (ids.json), frozen field lengths (params.json; refreshed only with --reparam or >15% drift), files written only when changed, stale files removed. Idempotent: a second run changes nothing. |
| `dict.json` | Curated vocabulary: abbreviation groups (สว./สมาชิกวุฒิสภา, กมธ., อนุ กมธ., พ.ร.บ., ครม. …), ~65 Thai⇄English topic concepts with related topics, committee aliases, stop words, intent words. Edit here to teach the engine a new word, then rebuild. |
| `ui/page.html`, `ui/app.css`, `ui/app.js` | The /search/ page. `make_page.py` assembles it into `<hub>/search/` and copies the shared site parts (committee symbols, language switch, tap feel) from the hub's alerts page so they never drift. |
| `ui/home_search.py` | Home page layer (flag HUB_SEARCH2): new placeholder, "related meetings" + "see all results" rows under the existing committee/senator list, Enter opens /search/?q=. Idempotent. |
| `eval/queries.json`, `eval/run_eval.js`, `eval/REPORT.md` | Relevance + speed test (40 queries incl. the 26 in Sukit's prompt). |
| `try.js` | `node try.js "คำค้น" ...` prints how a query was read and the top 5. |

## Index layout (`<hub>/search/idx/`, ~13.6 MB raw, ~3 MB gzip, 948 files)

| path | loaded | content |
|---|---|---|
| manifest.json | always (no-cache) | counts, coverage, data hash (= cache version for every other file), build time |
| lex.json (31 KB gz) | first use | committees, subcommittees, senators (the home page's vetted list only), topics, dictionary |
| meta.json (8 KB gz) | first use | per record: type, committee, sub, date, year, flags, parent meeting, committee mask, meeting no. |
| p/000-255.json (~5.5 KB gz each) | per query word | postings: word → [id gap, score·256 + field mask] |
| d/NNN.json (~10 KB gz, 16 records) | per result page | Thai card data |
| e/NNN.json (~6 KB gz) | English readers only | English card text |
| v/000-127.json | while typing | word starts, for completion |
| f/LL.json | only for a word the index does not know | words by length, for typo fixes |
| ids.json, params.json | build only | stable ids, frozen field lengths |

First search on a phone downloads about 110 KB gzip in total (page 16 KB, scripts 25 KB, lexicon+meta 40 KB, a few
postings and one card file). No full-dataset download.

Records: 21 committees, 86 subcommittees, 138 senators, 534 topics, 3,333 meetings (1,407 with easy-read summary text,
1,385 with only the official summary link, 541 upcoming/agenda-only), 162 videos with narration text.

## Build / rebuild (every publish bundle, after content changes)

```
S=/mnt/project-files/archive/search
node $S/build_index.js --hub $HUB --a69 $A69 --a68 $A68 --a67 $A67 --out $HUB/search/idx
python3 $S/ui/make_page.py --hub $HUB --src $S
python3 $S/ui/home_search.py $HUB/index.html          # only while HUB_SEARCH2 is on
```
Run it AFTER every other bundle item has changed the sites (it reads the published pages), e.g. as a run_bundle.sh step
next to hub_snap_sync. Takes ~10 s. Unchanged content = no changed files. A new committee site needs nothing extra if it
is in the hub's `DATA` list. Teaching a new word: add it to dict.json, rebuild, run `node eval/run_eval.js <idx>`.

Rule kept: senators come only from the home page's vetted people list (official Senate directory). A person's name is never
fuzzy-corrected into another person's name; close names are only offered as "หมายถึง ...?".

## Test results (eval/REPORT.md, 16 Nov 2569, Node 22)

P@5 0.889 · R@10 0.907 · MRR@10 0.956 · nDCG@10 0.906 · understanding checks 0 failures · zero-result rate 2.5% (only the
nonsense test). Engine time per query: warm p50 1.8 ms, p95 7.5 ms; cold (fresh engine, local files) p95 12.4 ms.
Phone browser (iPhone 13 emulation, local server): first results ~200 ms after page load.
Judgments are strict text rules over the real index (eval/queries.json "about"). Weakest: "สาธารณสุข" (P@5 0.2: top
results are Health committee meetings that do not contain the literal word), "การบริหารราชการแผ่นดิน" (0.6), "พ.ร.บ." (0.6).

## Deploy (after Sukit's go)

1. Copy `bundle/117_search_engine.sh/.md` into archive/bundle/items/ (status READY).
2. Bundle thread: add HUB_SEARCH2 to site_flags.HUB, a build_hub.py hook calling `home_search.apply_dir(out)` (after
   PURPOSE), and the rebuild step above to run_bundle.sh so the index follows every content update.
3. site_check.sh as usual (search page passes footer-only, no-name, symbol checks).

## Rollback

Revert the bundle's hub commit. Or by hand: `python3 ui/home_search.py --remove $HUB/index.html` (takes the layer out
and puts the old placeholder back; the old home search code underneath was never changed), then delete `$HUB/search/`.

## Not done / later

- AI answer mode, embeddings, search analytics: Sukit declined (16 Nov). Do not add without a new decision.
- OCR for the ~1,300 scanned PDFs (no OCR tool installed; would need a free engine and an accuracy check).
- Search box on each committee page (today: home page + /search/).

## PDF full text (Sukit "Go live, refresh weekly", 22 Nov 2569; bundle item 118_search_pdf)

- pdf/inventory.js lists every official document link on the published pages (docs.json). pdf/extract.py downloads each
  public file once, keeps only its text layer (pdftotext + thai_clean.py font fixes), deletes the PDF; cache.jsonl.gz
  (raw text) is resumable. Scans (no text layer) are marked and skipped.
- pdf/redact.py (legal/legal_check.py patterns): private names/companies near complaint words -> บุคคลเอกชน/บริษัทเอกชน,
  phones/e-mails/ID numbers -> [ข้อมูลติดต่อ]; summary pages that trip a STOP or guilt/court/summons/closed-meeting rule are
  searchable but never quoted. Output pdf/cache_safe.jsonl.gz is the ONLY input of the index.
- build_index.js --pdf <cache_safe> writes idx/x/ (p/ 2,048 posting shards, d/ file cards, s/ summary-page text for quotes,
  meta.json) and manifest.x. Without --pdf it keeps the existing x/ untouched (ordinary bundles change 0 files there).
- engine.js: a PDF counts only when it holds every searched part (Thai phrases of 3+ words close together); it adds to its
  meeting or brings the meeting in below site-text matches. Cards show "พบคำค้นในเอกสารต้นฉบับ: <kind> หน้า N" linking to the
  Senate original at that page (no copies hosted). Quotes only from official summary PDFs, never minutes/documents.
- Weekly refresh: `bash pdf/refresh.sh` with $HUB $A69 $A68 $A67 (inventory -> extract new -> redact -> build --pdf -> page).
- Tests: eval/run_eval.js (unchanged scores), eval/pdf_known_item.js <idx> pdf/cache_safe.jsonl.gz. Legal: LEGAL_CHECK_PDF.md.
