# 156 commerce_videos_1122

Owner: thread "Site: Add Commerce and Industry committee" (request from "Videos: Commerce and Industry committee meetings", 22 Nov 2569 22:40 UTC).
TIME-SENSITIVE: smegov 18 meets Tue 24 Nov 10.00 Bangkok (03:00 UTC); main 35 meets Wed 25 Nov 14.00. Both PRE videos must be live before.

What (videos auto-approved; 1080x1920, Thai voice + English subtitles burned in; video thread legal check STOP 0 WARN 0; sources Rpublic=1):
- main 35 PRE, 2:37 (notice ว๑๐๔๐, ref 11216585). Share page s/v-35-pre.html.
- smegov 18 PRE, 1:47 (notice ว๑๐๕๐, ref 11225978). Share page s/v-smegov-18-pre.html.
- main 34 POST, 4:24 (summary ref 11216297). 34 now has [pre, post]; the live pre entry (/video-1/...) is kept unchanged. Share page s/v-34.html.
Media from the video thread's branch claude/project-thread-e31pe2 (commit 5a720df7), md5s as in its MD5SUMS.txt:
v35pre.mp4 c96339180d1078f5d021527511158338, sub-smegov-v18pre.mp4 7ff4cb18075e34c6efb5997c2420af76, v34.mp4 387c79dd1fc5abdf4dec8801c8fb1518.

Needs item 152 first (meetings 35 and smegov 18; live since bundle 49). Fails cleanly if they are missing.
Files: commerce/2569/index.html (DATA media of 34/35, CAPS 34 + 35p, VSHARE), meetings.json, sub-smegov.html (DATA media of 18,
CAPS smegov-18p, VSHARE), sub-smegov.json, media/*.mp4 (ignored by git; run_bundle.sh moves them to a video repo) + .th.vtt,
img/poster34.jpg, poster35pre.jpg, poster-sub-smegov-18pre.jpg, img/v/ cards, s/v-34.html, s/v-35-pre.html, s/v-smegov-18-pre.html
(video_share.py CARD_BIG=1; every other s/v-*.html restored byte-identical; mobile.py + no_video_dl on the new pages),
m/34, m/35, m/smegov-18 via meeting_pages.py, commerce i18n-en.json (+1 key), hub index.html (newest-4 video list: Commerce 35 pre
is now first and in the "latest video" card) + hub i18n-en.json (+2 English headlines, indent=0).
Self-contained: media + scripts embedded (base64 tar, MD5SUMS checked, ffprobe length/size checked). Idempotent; no git, no network.

Test on fresh origin/main 044e0259 (bundle 49) + 152 (new version): run twice (second run changes nothing), 22 files changed;
data_match PASS; no_video_dl --check PASS; English mode: no new untranslated lines on the Commerce, smegov and home pages;
phone render: #read-34 shows 2 videos with the pre video first, #read-35 and smegov #read-18 show 1, s/v-35-pre.html plays,
home "latest video" = Commerce 35 pre; no JS errors. (VIDEO_CLONE_ROOT pointed at stub files, as for 140c.)
Voice: the routine thread records main 34 after this is live (text unchanged by this item).

STATUS: READY
