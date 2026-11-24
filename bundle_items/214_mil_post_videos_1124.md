# 214 mil_post_videos_1124: after-meeting videos of Military main 29, 30, 31 and military-affairs subcommittee 32

Owner: thread "Videos: make meeting videos" (24 Nov 2569). Asked by "Site: Update automatically three times a day" (relay 24 Nov 2569
05:52 UTC), which reserved number 214: make the 4 POST videos and queue them after 208_mil_summaries_1124.
Videos are auto-approved (VIDEO AUTO-APPROVAL, Sukit 9 Nov 2569 17:33 UTC). This is a routine content update with no design change and no flag change.

## Self-contained
`214_mil_post_videos_1124.sh` (46,214,228 bytes, md5 bbe1cebd5f92ee9219cad271d80377ec) carries its 12 files and a meta.json as a base64 tar.gz after the
`__PAYLOAD_BELOW__` line. The payload sha256 is 27b60cfb16606756a38be3c5e3ee5d0d2283d6d4156de8c49ab72757f8f535bc, and it is checked before anything is written. There is no payload folder.
Needs $HUB ($BUILD optional, default /mnt/project-files/archive/build). No git, no network.

## Run after 208_mil_summaries_1124
208 turns the four cards into written summaries. 214 only sets each meeting's `media`, so it also works before 208.
It stops with "nothing changed" (exit 1) only if one of the meetings, or its live before-meeting video, is missing from the page.

## What goes live (military/2569)

| Meeting | New files | `media.videos` after |
|---|---|---|
| main 29, Thu 5 Nov 2569 | media/v29.mp4 (4:11), v29.th.vtt, img/poster29.jpg | [post] (no pre video exists) |
| main 30, Thu 12 Nov 2569 | media/v30.mp4 (4:06), v30.th.vtt, img/poster30.jpg | [post, live pre v30pre] |
| main 31, Thu 19 Nov 2569 | media/v31.mp4 (4:07), v31.th.vtt, img/poster31.jpg | [post, live pre v31pre] |
| sub-military 32, Wed 18 Nov 2569 | media/sub-military-v32.mp4 (3:23), .th.vtt, img/poster-sub-military-32.jpg | [post, live pre] |

- Format: 1080x1920, Thai voice with English subtitles burned in, one version only. H.264 crf 24 + AAC 96k as prep_video.py; posters are 720x1280 from cover_9x16.png.
- Data: the DATA line of `index.html` / `sub-military.html` and `meetings.json` / `sub-military.json` (indent=1, round-trip asserted).
  The entry fields and order are the same as the live sub-military 31 after-meeting entry: kind "post", label "วิดีโอสรุปผลการประชุม", ck "29"/"30"/"31"/"military-32".
  The live pre entries (/video-N/...) are untouched.
- CAPS: "30", "31" and "military-32" go right before their "…p" track; "29" is added at the end.
- Share pages `s/v-29.html`, `s/v-30.html`, `s/v-31.html` and `s/v-military-32.html` (+ img/v cards) come from video_share.py with CARD_BIG=1.
  VSHARE now points to the after-meeting page. Every existing s/v-*.html is put back byte-identical, and cards made only for those restored pages are removed again.
  no_video_dl is re-applied and `--check` passes. mobile.py runs on the 4 new pages, as on the live Military share pages.
- `meeting_pages.py` refreshes m/29, m/30, m/31 and m/military-32 so they link to the new videos.
- Hub home "latest videos" (HH) uses the newest-4-by-meeting-date rule. It is unchanged today, because all four listed videos are 25 Nov.
- video_offload.py in run_bundle moves the 4 mp4s to a video repo as usual (about 37.3 MB in total).
- Shared Military build sources are not touched. If "Site: Build Military committee archive" keeps video lists in its own sources, it may want to record these 4 entries, as for 179.

## Content and checks
- Sources are the published summaries only, all Rpublic=1, plus the notices:

  | Meeting | Summary ref | Notice | Other |
  |---|---|---|---|
  | main 29 | 11244987 | ว ๙๘๕ | minutes 11244974 listed, not used |
  | main 30 | 11244991 | ว ๑๐๑๓ | |
  | main 31 | 11244997 | ว ๑๐๓๙ | ว ๑๐๖๖ (ref 11225702) for the urgent meeting 32 on 24 Nov |
  | sub-military 32 | 11244915 | ว ๑๐๓๒ | |

  Every fact quote is checked against the extracted source text by the spec; a missing quote stops the build.
- Names shown: only the committee chair นายสมบูรณ์ หนูนวล and the 3 subcommittee chairs, with face photos (roster checked 24 Nov 2569).
  Main 29 was presided over by the second vice-chair; the video says so without the name, following this committee's video practice.
  There are no petitioner, foundation, member, adviser or staff names. The complaint in main 29 carries "ยังไม่ใช่ข้อยุติ".
- Left out on purpose: purely internal items (personnel changes, honorary advisers, tickets, ceremonies), main 30 item 9.3(2)
  (large-scale war preparedness invitation, approval only), main 31 item 3.3(4) proposer and foundation, and details beyond the summaries.
- Source misprints:
  - main 30 prints the seminar as "19 ม.ค. 2569". The screen shows 2570, as in the sub-military 32 summary and notice ว ๑๐๓๒; the voice reads no year. This matches item 208.
  - main 30 also prints "สำนักงานกองฉลาก…". The video uses สำนักงานสลากกินแบ่งรัฐบาล.
- Main 31's next meeting: the summary says 3 Dec 09.30. The video also notes the later urgent meeting 32 on 24 Nov (notice ว ๑๐๖๖).
- Legal: `LEGAL_CHECK.md` STOP 0, WARN 0 for each video. The 4 legal packs (PDF with all sources) are kept with the video thread.
- Voice: ElevenLabs Nook, one take per scene, 27 new scenes, 11,024 credits. The chairs and closing scenes reuse shared takes.

## Tests
Tested on fresh sparse worktrees of hub origin/main 80ae0a16. VIDEO_CLONE_ROOT pointed at empty stub files for the live /video-N/ entries, as in the 179 test; video_share.py needs the video repo clones, as for every video item.

1. 208 first, then 214: both exit 0.
   - 214 changed index.html (only the DATA, CAPS and VSHARE lines), meetings.json, sub-military.html (the same 3 lines) and sub-military.json, plus m/29, m/30, m/31 and m/military-32 (video links added).
   - New files: 4 mp4, 4 .th.vtt, 4 posters, 4 share pages and 4 cards.
   - No existing s/v-*.html changed and no stray cards were left. VSHARE changed only for 29, 30, 31 and sub 32.
   - The meetings keep 208's headlines and summaries. The hub home list is unchanged.
2. Second run: "changed 0 text files", 0 git changes (idempotent).
3. 214 alone (no 208): exit 0, same result. Then 208 after 214: 208 keeps the new media (29 [post]; 30, 31 and sub 32 [post, pre]).
4. Phone 390x844 (local copy with 208 + 214): main #read-29, #read-30, #read-31, sub-military #read-32, s/v-30.html, s/v-military-32.html and m/31.html.
   - The new video shows with its label. Where there are two videos, the before video comes first and the after video follows, each with its band (ก่อน/หลังการประชุม).
   - No page errors, no sideways scroll, nothing stuck on "กำลังโหลด", no download links.

STATUS: READY
