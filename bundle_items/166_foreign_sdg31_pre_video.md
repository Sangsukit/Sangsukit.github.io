# 166_foreign_sdg31_pre_video

Thread "Videos: Foreign Affairs committee meetings", 22 Nov 2569. Asked by "Site: Update automatically three times a day" (22 Nov 20:12 UTC).

**Run after 163_social_transport_foreign_1122** (163 adds the SDG meeting 31 row; this item only fills that row's video). If 163 is not in, this item stops with "meeting 31|2026-11-25 not on the page" and changes nothing.

**One self-contained file.** `166_foreign_sdg31_pre_video.sh` (sha256 a44b134a3def532f5cd2441704605f1f9d27cad35ec1c2dc674031266738781f) carries the mp4, Thai .vtt and poster inside (base64 tar.gz, sha256 checked before use). It reads nothing from the shared media folder; it uses the usual build tools ($BUILD video_share.py, no_video_dl.py, video_offload.py) like every video item. Run with `HUB=<hub clone> bash 166_foreign_sdg31_pre_video.sh`. Idempotent, no git, no network.

## What goes live
| Page | Meeting | Video |
|---|---|---|
| foreign/2569/sub-sdg.html | SDG subcommittee 31, Wed 25 Nov 2569 10.00, CA 320 | before-meeting video, 2:30, 1080x1920, Thai voice + English subtitles burned in, kind "pre" |

Share page s/v-sdg-31-pre.html + card img/v/sdg-31-pre-*.jpg (video_share.py, CARD_BIG=1), no-download layer re-applied. Step 6 moves the mp4 to the video repos (video_offload.py) and runs video_host_check.py, as in item 101.

## Source and checks
- Notice ที่ สว (กมธ ๒) ๐๐๑๐/ว ๑๐๖๙ ลงวันที่ 20 พ.ย. 2569 (ref 11226568; agenda link 11226576 is the same PDF), both **Rpublic = 1** on the fresh Senate list (22 Nov ~20:15 UTC).
- Video content: date, time, room, chair (นางจุฑารัตน์ นิลเปรม) and committee chair (นายนิรัตน์ อยู่ภักดี) with official photos; agenda 4 items; the matter (ILO Conventions 87 and 98 ratification process) as worded in the notice; what the two conventions are (ILO); how the matter continued from meetings 20 (published summary), 28 and 30 (notices only).
- Invitees are described ("ผู้แทนภาคเอกชน และองค์กรด้านนายจ้างของไทย"), not named, the same treatment as the labour organisations in meeting 30. Ratification status is not stated; no opinion; no result is predicted.
- Approval pack: every fact checked against the source text; legal check STOP 0 / WARN 0 (video and pack).
- Sandbox: fresh origin/main (13fd7d7f) + 163, then this item twice: first run 2 page files + vtt + poster + share page/card; second run no change (same git tree c1bfc071). video_share.py was run with placeholder clones of the live video-1 files (VIDEO_CLONE_ROOT); in the real bundle the video repo clones are used. Its rewrite of the three existing s/v-*.html share pages drops the SEO lines, which run_bundle's seo.py step puts back (same as every earlier video item).

## Afterwards
- After LIVE: the video thread pastes the sdg 31 entry into committees/foreign/committee.py SUB_VIDEOS (when the shared folder accepts writes again).

STATUS: READY
