# Bundle item 204_law30_post_video

From: "Videos: Law and Justice committee meetings", 23 Nov 2569 (asked by "Site: Update automatically three times a day").

**Run after 203_law30_summary_31** (Law site thread). The two are order-independent in practice, because 203 keeps live media.

## What it does
Adds the AFTER-meeting video of Law and Justice main meeting 30/2569 to parliamentx.com/law/2569/:

- **Meeting:** Wed 18 Nov 2569, 14.00, room 401.
- **Length:** 2:25.
- **Format:** 1080x1920, Thai voice with English subtitles burned in (one version), kind="post".
- **Placement:** it goes on DATA key `30|2026-11-18` in index.html and meetings.json. The live pre video (v30pre) is kept and stays first, so the meeting panel shows ก่อนการประชุม then หลังการประชุม.
- **Captions:** fills CAPS track `30`.
- **Home page:** refreshes the newest-4 video list (no change expected; 25 Nov pre videos are newer) and the Law 2569 snapshot "v" count (now 2).
- **Share page:** makes s/v-30.html (video_share.py, CARD_BIG=1), then no_video_dl and its check.
- **Video hosting:** video_offload moves v30.mp4 to a video repo.

## Source and checks
- **Source:** สรุปผลการประชุม ครั้งที่ 30/2569 ("สรุปข่าว 30-2569.pdf", ref 11236372, **Rpublic=1**).
- **Legal check:** STOP 0 · WARN 0.
- **What is named:** the chair and the 3 subcommittee chairs only.
- **Complaints:** the two complaints are shown as a count only ("2 เรื่อง", accepted for initial consideration). There are no names, agencies, places or findings, and the word "ตรวจสอบ" is not used.
- **Airport item:** worded as the agenda title and marked "a topic still under consideration, no conclusion".

## Self-contained
Payload: mp4 + Thai vtt + poster + media.json, as base64 tar.gz after `__PAYLOAD_BELOW__`. It needs only `$BUILD` (video_share.py, no_video_dl.py).

## Tested
Tested on main 20302351 with 203 (aaff5509) applied first:

- **First run:** rc 0, changed law/2569/index.html, meetings.json and index.html, then OK.
- **Second run:** "changed nothing (already applied)", with an identical git diff.
- **Phone browser (400 px):** meeting 30 panel shows the pre then post video. Share page v-30 plays (2:25). No page errors.

## Hashes
- Item .sh md5: `a72d2c34320df129ff6fd7c8499f78f7`.
- Master stream md5: `977b2815f0b906507562b9937dea3124`.
- The master and approval pack are on local disk (/home/user/law_jobs/main/2569-11-18_ครั้งที่30/output).
