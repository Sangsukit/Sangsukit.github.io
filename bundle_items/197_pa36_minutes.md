# 197 pa36_minutes: Public Administration 2569, minutes link for meeting 36/2569 (Wed 11 Nov 2569)

Owner: thread "Site: run the meeting archive" (23 Nov 2569 Bangkok). Asked by the auto-update thread (relay 23 Nov 11:52 UTC):
main 36 minutes ref 11236482 "ครั้งที่ 36.pdf". Routine content update under AUTO UPDATES (Sukit confirmed 11 Nov 12:28 UTC).
No design change, no flag change, no new text.

## Source check
- Senate list for cid 79731 fetched 23 Nov 2569 ~11:55 UTC: RType บันทึกการประชุม, RName "ครั้งที่ 36.pdf", Rpublic = 1.
- PDF (15 pages, 5,930,477 bytes, scanned) page 1 reads "บันทึกการประชุม คณะกรรมาธิการการบริหารราชการแผ่นดิน วุฒิสภา
  ครั้งที่ ๓๖/๒๕๖๙ วันพุธที่ ๑๑ พฤศจิกายน ๒๕๖๙ เวลา ๑๓.๐๐ นาฬิกา ณ ห้องประชุมกรรมาธิการ CA 426".

## What goes live (committee-archive-2569 = A69)
- Meeting 36's documents get the official minutes link (k "minutes", with size), between the summary and the agenda link, the same
  way meetings 1-35 already show their minutes. The reading view's "progress" line then shows the minutes step as published.
- Link only: nothing from the minutes is copied onto the site (cl.104: only what the Senate itself published is linked).
- m/36.html, the search index and the home snapshot follow through run_bundle.sh (seo.py / search / hub_snap_sync).

## Repos / paths touched
A69 edited: index.html (line DATA, meeting 36 docs only), meetings.json (meeting 36 docs only). Nothing new. HUB/A67/A68: none.
Self-contained (no payload, no files folder). Needs only $A69. Refuses if meeting 36 already has a different minutes link.

## Shared build sources (written to the shared folder, which takes writes again)
build/doc_sizes.json (+11236482), build/meetings_new.json refreshed 23 Nov ~11:55 UTC; a full private rebuild gives the same
meeting 36 documents.

## Checks
- Test on a fresh clone of main (archive 0753809 #73): exit 0, 2 files edited; second run "changed 0 files". Only meeting 36 differs
  in DATA and meetings.json, and only by the added minutes entry (the other links keep their live tokens).
- data_match.py PASS (223 pages). hub_snap_sync --check PASS. Reading view #read-36 (phone 390x844, Thai and ?lang=en): no page
  errors; English shows "Meeting minutes | Published".
- Legal: no new wording on the site. The link is the Senate's own public document (Rpublic 1).

STATUS: READY
