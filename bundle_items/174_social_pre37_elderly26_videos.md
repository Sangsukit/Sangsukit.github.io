# 174 social_pre37_elderly26_videos — Social Development: two BEFORE-meeting videos (main 37, elderly sub 26)

Owner: "Videos: Social Development committee meetings" (22 Nov 2569 ~22:50 UTC), asked by "Site: Update automatically three times a day".
**Run after 163_social_transport_foreign_1122** (that item adds the main 37 and elderly 26 notice cards).

**Self-contained**: the two videos, captions and posters are inside the .sh (base64 tar at the end, md5-checked on unpack).
Nothing is read from committees/social/media (shared folder over cap). One file to run: `HUB=<hub worktree> bash 174_social_pre37_elderly26_videos.sh`.

## Videos (1080x1920, Thai voice + English subtitles burned in, one version, kind="pre"; VIDEO AUTO-APPROVAL)
- Main committee meeting 37/2569, Thu 26 Nov 2569 09.00, CA 330 + online · notice ว๑๑๘๙ (ref 11225916, Rpublic 1) · 2:23 ·
  web copy v37pre.mp4 5.9 MB · share page s/v-37-pre.html · background scene from summary 35/2569 (ref 11137526, Rpublic 1).
- Elderly subcommittee meeting 26/2569 (joint with the disadvantaged-support working group), Wed 25 Nov 2569 10.00, room 302 ·
  notice ว๑๑๘๗ (ref 11226520, Rpublic 1) · 2:27 · sub-elderly-v26pre.mp4 5.7 MB · s/v-elderly-26-pre.html ·
  background scene from elderly summary 25/2569 (ref 11195183, Rpublic 1).
- Legal: legal_check video STOP 0 WARN 0 (both); every quote checked against notice/summary text by the pack spec.
  Named people: only the committee chair and subcommittee chair (official photos). Not named: signer, the senator who filed
  the motion in elderly item 3.2 (shown as "a senator's motion"), agency representatives, the good citizens in main item 3.1.
  Legal packs: social/<folder>/output/ชุดเอกสารขออนุมัติ_*_FINAL.pdf (masters stay on this thread's local disk).

## What changes (hub, social/2569/ only)
- media/v37pre.mp4 (+.th.vtt), media/sub-elderly-v26pre.mp4 (+.th.vtt), img/poster37pre.jpg, img/poster-sub-elderly-26pre.jpg.
- Only the "media" of index.html meeting 37 and sub-elderly.html meeting 26 (DATA line + meetings.json / sub-elderly.json),
  before-meeting video first, any other video on the meeting kept; CAPS tracks "37p" and "elderly-26p".
- New share pages s/v-37-pre.html, s/v-elderly-26-pre.html (+ img/v cards) via video_share.py CARD_BIG=1, then mobile.py and
  no_video_dl.py; every other share page restored byte-identical. Video block added to m/37.html, m/elderly-26.html if they exist.
- Then video_offload.py moves the mp4s to the video repos like the other video items.

## Depends on
- **The notice cards for main 37 (26 Nov) and elderly 26 (25 Nov) must already be on the pages** (the update thread's notice item).
  Without them the script stops with "waiting for the notice card ..." and changes nothing (exit 1). It is item 163_social_transport_foreign_1122.

## Checks (scratch copy of hub main 13fd7d7, social/ only, with stand-in cards for 37 and elderly 26)
- Without the cards: stops cleanly, nothing changed.
- With the cards: 4 text files changed + 8 new files; everything else under social/ identical; second run "changed 0" (idempotent).
- Final asserts OK (36 pre and elderly 22-24 post untouched; VSHARE/CAPS present; phone + no-download layers on the share pages).
- legal_check archive social/2569: STOP 0 · WARN 0. NO_VIDEO_DL check PASS.

STATUS: READY (waits for the two notice cards)
