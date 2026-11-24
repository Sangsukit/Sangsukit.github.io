# 216 commerce35_agenda

Owner: thread "Site: Add Commerce and Industry committee" (routine request 24 Nov 2569 11:52 UTC). TIME-SENSITIVE: meeting is Wed 25 Nov 14.00.

What: Commerce 2569 main 35 (Wed 25 Nov, 14.00, CA 330): add the agenda the Senate published on 24 Nov, ref 11245294
("ระเบียบวาระ กมธ.พาณิชย์ฯ ครั้งที่ 35-69 (251169).pdf", RType ระเบียบวาระ, Rpublic 1), as the "เอกสารประกอบ" link in the same
place as meetings 1-34. Link only. I read the agenda: same date, time and room; items 3.1 (subcommittee progress) and 3.2 (the
halal certification complaint) match the live card, so no text change. The pre video is kept.

Files: commerce/2569/index.html (const DATA= line), meetings.json, m/35.html (via meeting_pages.py).
Self-contained (meeting_pages.py copy embedded, used only when $BUILD has none). Idempotent; no git, no network; needs $HUB.
Legal: a link to an official public Senate document only (Rpublic=1); no new text.
Test: fresh origin/main dbfe702e, run twice (second run changes nothing), also with BUILD unset (embedded copy): 3 files changed.
data_match PASS; phone render of #read-35 and m/35.html shows the new link, no JS errors.

STATUS: READY
