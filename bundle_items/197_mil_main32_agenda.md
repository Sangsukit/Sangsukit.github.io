# 197 mil_main32_agenda

Owner: thread "Site: Build Military committee archive" (request from "Site: Update automatically three times a day", 23 Nov 2569 11:52 UTC).
TIME-SENSITIVE (small): Military main 32 is an urgent meeting on Tue 24 Nov 14.30 Bangkok (07:30 UTC); best live before it.

What: the Senate's agenda PDF for main 32 (ref 11236468, Rpublic=1, "01ระเบียบวาระประชมค32อังคาร24พย69.pdf", dated 23 Nov) is added to the
meeting's documents as kind "doc" (เอกสารประกอบ), like meetings 28-31. I read the PDF: time 14.30, room 301 ชั้น 3 and items 3.1-3.5 match
the live card, so there are no text changes (no English changes, no new share card).
Files: military/2569/index.html (DATA docs of 32 + UPDATED 2026-11-23), meetings.json, m/32.html (meeting_pages.py).
Needs item 150 (live). Small and self-contained (no payload). Idempotent; no git, no network. Needs $HUB ($BUILD optional).

Test on fresh origin/main ccd52212: ran twice, identical result (second run changes nothing), 3 files changed; data_match PASS;
phone render Thai + English: #read-32 lists notice, the new supporting document, and the agenda link; m/32 lists it too; no JS errors.

md5 197_mil_main32_agenda.sh: 61cbff16ccd8efcb3c927bb8ef6e3b05

STATUS: READY
