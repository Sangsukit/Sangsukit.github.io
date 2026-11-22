# 156 lab_summaries_1122 (owner: "Site: Add Labour committee", 22 Nov 2569; asked by "Site: Update automatically three times a day")

Type: routine content (AUTO UPDATES), data only, no design change. Not time-sensitive (all four meetings are past).
Self-contained: the payload (payload.json + 12 files) is embedded at the end of the .sh as base64 tar.gz and unpacked to a
temp folder at run time, so it needs nothing from the shared folder. Run with HUB set as usual.

## Why
The Senate published the summaries of four Labour meetings that the site still shows as "upcoming" with agenda text only.
All four documents are Rpublic=1 in the Senate data fetched 22 Nov 2569 20:12 UTC:
- main 30/2569 (Thu 12 Nov, 13.00, ห้องประชุม 406–407 ชั้น 4): เอกสารข่าว, ref 11218909
- main 31/2569 (Thu 19 Nov, 13.00, ห้องประชุม 406–407 ชั้น 4): จดหมายข่าว, ref 11230558
- welfare sub 25/2569 (Wed 18 Nov, 09.00, CA 429 ชั้น 4): จดหมายข่าวฉบับที่ 25, ref 11217525
- employment sub 24/2569 (Wed 18 Nov, 13.30, CB 311 ชั้น 3): เอกสารข่าว, ref 11225884

## What changes (hub only, labour/2569/)
- index.html, sub-welfare.html, sub-employment.html: the four records in DATA are replaced by the new build's records:
  chair / chair_role (main 30 and 31: นายชินโชติ แสงสังข์ รองประธานคณะกรรมาธิการ คนที่หนึ่ง ทำหน้าที่ประธานในที่ประชุม, as both
  Senate documents say; welfare 25: พันตำรวจโท สุริยา บาราสัน; employment 24: นางนงลักษณ์ ก้านเขียว), headline, summary,
  items, tags, docs (summary link added), no "upcoming" / "agenda_only" / map. Main 30 now shows its room (406–407 ชั้น 4,
  from the notice; it was blank). The LIVE "media" of each record is kept exactly (pre-meeting videos on video-1, sizes).
- meetings.json, sub-welfare.json, sub-employment.json: the same four records, live media kept.
- SHARE_V 30, 31, welfare 25, employment 24 -> new share cards; EZ.cal entries of these four past meetings removed (a fresh
  build has none); the two "นัดประชุม" plan lines in the subcommittee timelines (TL) removed; UPDATED 2026-11-23.
- index.html SUBS: welfare 25 and employment 24 records (docs with the summary link) + fetched date.
- Replaced / new files: s/30.html, s/31.html, s/welfare-25.html, s/employment-24.html, img/s/30-5d942f52.jpg,
  img/s/31-c1d729da.jpg, img/s/welfare-25-e4326a8d.jpg, img/s/employment-24-c82491eb.jpg and the four qr-*.svg.
- i18n-en.json: ADD-ONLY, 48 English lines for the new text.
- Follows in run_bundle with no extra step: m/30.html, m/31.html, m/welfare-25.html, m/employment-24.html and the video share
  pages (seo.py bundle); the home Labour card and its welfare / employment boxes (hub_snap_sync.py).
- NOT touched: CAPS, video files, audio/. The old listen-button recordings for 31, welfare 25 and employment 24 stop playing by
  themselves (their text hash no longer matches); the auto-update thread records new ones after this is live.

## Wording and legal
- Written from the four Senate documents only. No contact details (the newsletters carry a phone number and many names; none
  are used), no names of private associations, a foundation, a provincial group, an academic or a research institute, no
  brand names. Only the presiding chairs are named. Complaints are written as allegations ("ผู้ร้องกล่าวอ้างว่า").
- The script asserts: no phone / contact strings, none of the private names in the source documents, the right chair and
  room, the summary link, the pre video kept, no calendar entry left, the live layers present, CAPS kept.
- legal_check.py text on all new Thai and English text: STOP 0, WARN 1. The warning is COURT_CASE matching the agency name
  "กรมสอบสวนคดีพิเศษ" (Department of Special Investigation) inside the screening committee's membership: a false positive.
  An earlier phrase about petitioners being suspects in other cases was removed for §11.

## Tests (22 Nov 2569, fresh worktrees: hub origin/main 13fd7d7f; archive-2569 e13f1a0, 2567 3d210b9, 2568 3cd7387)
- Clean run: 7 files changed + 4 new; repeat run: "changed 0 files" (idempotent).
- run_bundle post-steps on the copies: committee_symbols --refresh-hub "already right"; hub_snap_sync "3 updated: labour 2569;
  labour sub welfare; labour sub employment"; seo.py bundle rewrote the four m/ pages (other committees' m/ pages it touched
  are date drift that happens without this item).
- footer_only PASS, no_name PASS, data_match PASS (223 pages, 0 differences), hub_snap_sync --check PASS, no_video_dl PASS,
  seo --check PASS.
- English crawl of index.html, sub-welfare.html, sub-employment.html: only the three page-title lines are missing (same as live).
- Phone (iPhone 13, Thai and English): #read-30, #read-31, sub-welfare #read-25, sub-employment #read-24 open as "held"
  meetings with the pre video, new text and summary link; no page errors; nothing wider than 390 px.
- Browser checks limited to the Labour 2569 pages (RDC_PAGES / SYM_PAGES / UXG_PAGES; the full-site walk is too long for one
  container run): read_check 4 pages, 100 reading views, the only findings are 16 "file missing: /video-1/...mp4" because the
  video-repo clones are not in this container (same files are live today; the item does not touch media); symbol_check PASS;
  ux_guard PASS. Please let the bundle's own site_check.sh --quick cover the whole site as usual.

After live: tell thread "Site: Add Labour committee" (it tells the auto-update thread, which re-records the listen-button voice
for all four).

STATUS: READY
