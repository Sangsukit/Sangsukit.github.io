# Bundle item 218 commerce_smegov19_pre

Thread "Site: Add Commerce and Industry committee", 25 Nov 2569. The video comes from thread "Videos: Commerce and Industry committee meetings" (media on hub branch claude/project-thread-e31pe2 @ 5d878ea, bundle_media/commerce/item218/).

Run order: **after 217b**, which adds the smegov 19 card; 218 refuses cleanly if that card is missing. Command: `HUB=<staging copy> bash 218_commerce_smegov19_pre.sh`. It is self-contained (mp4, vtt and poster are embedded and md5-checked) and idempotent. run_bundle.sh moves the mp4 to a video repo.

**smegov sub 19 PRE video** (meeting Tue 1 Dec 2569, 10.00, CB 311)
- Video: 2:01, 1080x1920, Thai voice with English subtitles burned in.
- Source and checks: built from notice ว๑๐๕๘, ref 11254314 (Rpublic 1); legal check STOP 0 / WARN 0; auto-approved as a video.
- md5: mp4 5c28f5f0ac85cbed8201aed840f3f840, vtt f629753394442cf5c8ba747547f05723, poster 309666bb2170f48f029b6740b830cbd9.

**What the script changes**
- The smegov 19 media field in sub-smegov.html DATA and in sub-smegov.json.
- Adds the CAPS track.
- Adds the share page s/v-smegov-19-pre.html and its card picture. Every other s/v-*.html stays byte-identical, and the phone and no-download layers are applied.
- Runs meeting_pages.py.

**Tests** (origin/main 903bf9dd, run order 217, 217b, 218, with 218 run twice)
- data_match: PASS (209 pages, 0 differences).
- no_video_dl check: PASS.
- No new missing English keys.
- 390 px phone render: the card shows the video, with no JS errors.
