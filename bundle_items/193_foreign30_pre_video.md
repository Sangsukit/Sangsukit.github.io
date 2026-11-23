# 193_foreign30_pre_video

Thread "Videos: Foreign Affairs committee meetings", 23 Nov 2569. Asked by "Site: Update automatically three times a day" (23 Nov 05:52 UTC).

**Run after 191_social_foreign_notices_1123.** Item 191 adds the main meeting 30 row; this item only fills in that row's video. If 191 has not run, this item stops with "meeting 30|2026-11-25 not on the page" and changes nothing.

**One self-contained file.** `193_foreign30_pre_video.sh` (sha256 b6d8cac5466caa4576a928180755066d4b488fb6e5963fec3d2184d4a6147d00) carries the mp4, the Thai .vtt and the poster inside, as base64 tar.gz (sha256 f56f0dc53706f6bb23cb28fa8b68902bc5e7333ced4be811bf27e96eeb165661, checked before use). It reads nothing from the shared media folder. Like every video item, it uses the usual build tools ($BUILD video_share.py, no_video_dl.py, video_offload.py). Run it with `HUB=<hub clone> bash 193_foreign30_pre_video.sh`. It is idempotent and uses no git and no network.

## What goes live
| Page | Meeting | Video |
|---|---|---|
| foreign/2569/index.html | Foreign Affairs main committee 30, Wed 25 Nov 2569 13.30, CA 428 floor 4 | before-meeting video, 2:31, 1080x1920, Thai voice with English subtitles burned in, kind "pre" |

It also makes the share page s/v-30-pre.html and its card img/v/30-pre-*.jpg (video_share.py, CARD_BIG=1), then re-applies the no-download layer. Step 6 moves the mp4 to the video repos (video_offload.py) and runs video_host_check.py, as in items 101 and 166.

## Source and checks
- **Notice:** ที่ สว (กมธ ๒) ๐๐๑๐/ว ๑๐๗๐ ลงวันที่ 20 พ.ย. 2569 (ref 11235113), **Rpublic = 1** on the fresh Senate list (23 Nov ~05:50 UTC). The same-day subcommittee meeting comes from notice ว ๑๐๖๙ (ref 11226568, Rpublic = 1).
- **Video content:**
  - Date, time, room, and the committee chair (นายนิรัตน์ อยู่ภักดี) with an official photo.
  - The two active subcommittees and their chairs, with official photos.
  - The 5 agenda items as the notice gives them. Item 4 is only "พิจารณากิจการด้านต่างประเทศ", so the video says the notice names no sub-topics and does not guess any.
  - The committee's remit under Senate rules cl.78.
  - The SDG subcommittee meeting the same morning (ILO Conventions 87 and 98 ratification process, worded as in its notice).
  - A chart of monthly meetings from June, counted from the parliament system's meeting list and leaving out cancelled meetings.
- **Handling:**
  - Invitees are described by type, not named.
  - Ratification status is not stated.
  - No opinion is given and no result is predicted.
  - Nothing comes from inside a closed meeting (cl.92); only the agenda allowed under cl.104 is used.
- **Approval pack:** 13 of 13 facts match the source text. Legal check STOP 0 / WARN 0 on both the video and the pack.
- **Sandbox:** fresh origin/main (b2594e0a), then item 191, then this item twice.
  - First run: 2 page files, the vtt, the poster, and the share page and card.
  - Second run: no change (same git tree 5ed68c96).
  - video_share.py ran with placeholder clones of the live video-1 files (VIDEO_CLONE_ROOT); the real bundle uses the video repo clones.
  - video_share.py's rewrite of the four existing s/v-*.html share pages drops their SEO lines. run_bundle's seo.py step puts them back, the same as for every earlier video item.

## Afterwards
- After LIVE, the video thread pastes the main 30 entry into committees/foreign/committee.py VIDEOS.

STATUS: READY
