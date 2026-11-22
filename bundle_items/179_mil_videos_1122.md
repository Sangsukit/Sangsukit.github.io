# 179 mil_videos_1122

Owner: thread "Site: Build Military committee archive" (videos from "Videos: make meeting videos", handed over 22 Nov 2569 23:15 UTC on hub branch claude/video-handover-2569-11-22 @ ceefca24).
TIME-SENSITIVE: main 32 is an urgent meeting on Tue 24 Nov 14.30 Bangkok (07:30 UTC); holistic 22 meets Wed 25 Nov 09.00. Both PRE videos must be live before.

What (videos auto-approved; 1080x1920, Thai voice + English subtitles burned in; subtitles legal_check STOP 0 WARN 0; sources Rpublic=1; sub-military 31 names no petitioner or foundation):
- main 32 PRE, 2:34. Share page s/v-32-pre.html. Also goes into the hub home newest-4 video list (+1 English headline).
- holistic 22 PRE, 2:06. Share page s/v-holistic-22-pre.html.
- sub-military 31 POST, 3:26. 31 now has [post, pre]; the live pre entry (/video-1/...) is kept unchanged. Share page s/v-military-31.html.
- cyber 26 POST, 2:33. 26 now has [post, pre]; the live pre entry is kept unchanged. Share page s/v-cyber-26.html.
Web copies made with engine prep_video.py / prep_sub_video.py (crf 24) from the handed-over FINAL mp4s (md5s matched the video thread's MD5SUMS).

Needs item 150 (live since bundle 49). Fails cleanly if a meeting is missing.
Files: military/2569/index.html, meetings.json, sub-holistic.html/.json, sub-military.html/.json, sub-cyber.html/.json (DATA media + CAPS + VSHARE),
media/*.mp4 (ignored by git; run_bundle.sh moves them to a video repo) + .th.vtt, img/poster32pre.jpg, poster-sub-holistic-22pre.jpg,
poster-sub-military-31.jpg, poster-sub-cyber-26.jpg, img/v/ cards, the 4 new s/v-*.html (video_share.py CARD_BIG=1; every other s/v-*.html
restored byte-identical; mobile.py + no_video_dl on the new pages), m/32, m/holistic-22, m/military-31, m/cyber-26 via meeting_pages.py,
hub index.html (newest-4 video list) + hub i18n-en.json (+1).
Self-contained: media + scripts embedded (base64 tar, MD5SUMS checked, ffprobe length/size checked). Idempotent; no git, no network.

Test on fresh origin/main 044e0259 (bundle 49): run twice, identical result (second run changes nothing), 14 tracked files changed + new
posters/cards/share pages; data_match PASS (209 pages); no_video_dl --check PASS; phone render Thai + English: main #read-32 and holistic
#read-22 show 1 pre video, sub-military #read-31 and cyber #read-26 show 2 videos with the pre video first and before/after bands,
s/v-32-pre.html plays, home list includes main 32; no JS errors. (VIDEO_CLONE_ROOT pointed at stub files for the live /video-1/ entries.)
Voice: the routine thread records the listen voice for sub-military 31 and cyber 26 (text unchanged by this item).

md5 179_mil_videos_1122.sh: fe5bc24261ca55e7ebfdc58732a1fc96

v2 (22 Nov 23:55 UTC): the home check now accepts a newest-4 list that other items already filled with newer videos (bundle 50 failure). Tested: plain run, and a run with 4 newer home videos, each twice with identical results.

STATUS: READY
