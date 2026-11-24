# 209 lab_minutes_29_30 (owner: "Site: Add Labour committee", 24 Nov 2569; asked by "Site: Update automatically three times a day")

Type: routine content (AUTO UPDATES), data only, no design change, no new text. Not time-sensitive (both meetings are past).
Self-contained: no payload, no shared-folder files. Run with HUB set as usual.

## Why
The Senate published the full minutes (บันทึกการประชุม) of two Labour main meetings. Both are Rpublic=1 in the Senate data
fetched 24 Nov 2569 05:53 UTC:
- main 29/2569 (Thu 5 Nov): "2569-29_5Nov-กมธ.แรงงาน.pdf", ref 11245165 (23 pages, scanned)
- main 30/2569 (Thu 12 Nov): "2569-30_12Nov-กมธ.แรงงาน.pdf", ref 11245168 (25 pages, scanned)
The main 29 file does NOT replace 11155667. That one is the meeting summary (สรุปผลการประชุม, a 10-page newsletter) and stays.
The names follow the same pattern as main 27 and 28: the summary is "2569-NN_DDMon_กมธ.แรงงาน.pdf", the minutes
"2569-NN_DDMon-กมธ.แรงงาน.pdf". The first pages were checked: "บันทึกการประชุม ครั้งที่ ๒๙/๒๕๖๙ วันพฤหัสบดีที่ ๕ พฤศจิกายน
๒๕๖๙" and "ครั้งที่ ๓๐/๒๕๖๙ วันพฤหัสบดีที่ ๑๒ พฤศจิกายน ๒๕๖๙", both in ห้องประชุม ๔๐๖–๔๐๗ ชั้น ๔.
The fresh Senate data has no other Labour change since 22 Nov (main or subcommittees).

## What changes (hub only, labour/2569/)
- index.html DATA and meetings.json: one {"k":"minutes","url":...} link added to meetings 29 and 30. It goes after the summary and
  before the agenda link, with no size, exactly as a fresh build writes it and as main 27 and 28 show it today. UPDATED 2026-11-24
  (never moved backwards).
- Follows in run_bundle with no extra step: m/29.html and m/30.html list the minutes link (seo.py bundle); the sitemap lastmod.
- NOT touched: text, English lines, share cards, media, CAPS, audio/ (the listen-button text does not change), alerts.

## Wording and legal
No new words. The links point to the Senate's own public files (Rpublic=1); nothing is copied or hosted. Linking minutes is
the existing practice (main 25 to 28 already link theirs).

## Tests (24 Nov 2569, fresh worktrees: hub origin/main 80ae0a16; archive-2569 f355b03, 2567 3d210b9, 2568 3cd7387)
- Clean run: "changed 2 files" (index.html, meetings.json); repeat run: "changed 0 files" (idempotent).
- The script asserts: meetings 29 and 30 found once by number and date, their summary links still there, each minutes ref
  appears once, the order summary < minutes < agenda, the meetings are held (not upcoming), DATA and meetings.json round-trip.
- run_bundle post-steps on the copies: committee_symbols --refresh-hub "already right"; hub_snap_sync "0 updated"; seo.py bundle
  added the minutes link to m/29.html and m/30.html (same place as m/28.html) and refreshed sitemap lastmod.
- footer_only PASS (7,695 pages), no_name PASS, data_match PASS (223 pages, 0 differences), hub_snap_sync --check PASS,
  no_video_dl PASS, seo --check PASS.
- Phone (iPhone 13), Thai and English: #read-29 and #read-30 show "บันทึกการประชุม ครั้งที่ 29/2569 / 30/2569" and "Minutes of
  Meeting No. 29/2569 / 30/2569", the same as #read-28; no page errors; nothing wider than 390 px.
- An old download link on the live site (main 28 minutes) still answers 200 application/pdf, so the links in this item keep working
  after their token ages.

After live: tell thread "Site: Add Labour committee" (it tells the auto-update thread). No voice or video work.

STATUS: READY
