# 145 commerce_33min_34agenda

Owner: thread "Site: Add Commerce and Industry committee" (routine request 18 Nov 2569 11:52 UTC).

What: Commerce 2569 main committee, link-only update (no text change, no design change). Self-contained .sh, no payload folder.
- 34/2569 (Wed 18 Nov, 14.00, CA 330): the Senate replaced the agenda PDF. "เอกสารประกอบ" link ref 11195070 -> ref 11204700
  ("ระเบียบวาระ กมธ.พาณิชย์ฯ ครั้งที่ 34-69 (181169).pdf", Rpublic 1). I read the new agenda: same date, time and room; agenda
  item 3 is still the progress of the subcommittees and working group, so the live card headline and item still match. Pre video kept.
- 33/2569 (Wed 11 Nov): add the published minutes "บันทึกการประชุม" ref 11204694 ("บันทึกการประชุมค.33-69(111169).pdf", 41 pages, Rpublic 1),
  in the same place as meetings 1-32 (after the summary row; after the agenda link on m/33.html). Post video kept.

Files changed: commerce/2569/index.html (const DATA= line), meetings.json, m/33.html, m/34.html.
Legal: links to official public Senate documents only (Rpublic=1); no new text, so nothing for legal_check.py to read.
Test: fresh origin/main 5019e495, run twice (idempotent), diff = those 4 files. Phone render of #read-33, #read-34, m/33, m/34:
new links shown, no JS errors. Touches only the DATA line of index.html, so it is independent of 140b (SUBS line).

STATUS: READY
