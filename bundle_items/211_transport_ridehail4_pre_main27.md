# 211_transport_ridehail4_pre_main27

Thread "Videos: Transport committee meetings", 24 Nov 2569. Asked by "Site: Update automatically three times a day" (24 Nov 05:52 UTC, URGENT: ridehail 4 meets Wed 25 Nov 10.00). Number 211 reserved by that thread.

**One self-contained file.** `211_transport_ridehail4_pre_main27.sh` (14 MB) carries both web videos, their Thai caption files and posters inside (base64 tar.gz, sha256 checked). Run with `HUB=<hub clone> bash 211_transport_ridehail4_pre_main27.sh`. Idempotent, no git, no network; prints "211_transport_ridehail4_pre_main27 OK". Like 200 it ends by moving the mp4s to the video repos ($BUILD/video_offload.py); v27pre.mp4 REPLACES the live file of the same name in video-2 (same as the Health re-sync in bundle 44).

**Needs item 210_transport_health_1124 first** (adds ridehail row 4, 2026-11-25). Without it the item stops with "meeting ... not on the page" and changes nothing. Publish 210 and 211 together, or 210 first.

## What goes live
| Committee | Meeting | Source (Rpublic = 1) | Video |
|---|---|---|---|
| Transport: ride-hail app subcommittee | 4, Wed 25 Nov 2569 10.00, CA 432 floor 4 | notice ว1030 dated 17 Nov 2569 (ref 11243929) | NEW ก่อนการประชุม 1:55 |
| Transport main committee | 27, Wed 25 Nov 2569 14.00, CB 411 floor 4 | notice ว1044 + full agenda (ref 11244188) | REMADE ก่อนการประชุม 2:53 (was 2:33) |

Why main 27 was remade: the live video said agenda item 3 has "2 matters" (true for the notice). The full agenda published 24 Nov lists 4 (3.1 small airlines, 3.2 Khlong Thai new city, 3.3 progress on 4 draft acts, 3.4 two complaints). Scene 3 now says 4 matters and one short scene (3.3 + 3.4) was added. All other scenes keep the same voice and pictures; date, time and room did not change.

1080x1920, Thai voice + English subtitles burned in (one version), kind "pre", old book logo, chairs with official photos.

## Pages touched
transport/2569/index.html + meetings.json (media of row 27 + CAPS 27p), sub-ridehail.html + sub-ridehail.json (media of row 4 + CAPS ridehail-4p), posters + Thai .vtt, share pages s/v-ridehail-4-pre.html (new) and s/v-27-pre.html (updated) + cards; video_share.py rebuilds the other Transport share pages as usual (their SEO head tags come back with run_bundle's `seo.py bundle` step; checked in the sandbox: after `seo.py apply` only the tool's own uploadDate differs).

## Checks
- Fresh clone of origin/main 80ae0a16 + item 210 (md5 6658dd02…) applied, then 211 (I97_TEST_NO_OFFLOAD=1, fresh video clones video-1 849223e, video-2 706c56d, video-3 1f322b2): "OK"; second run no change (write-tree bf50b313 both times).
- Phone view (390 px): sub-ridehail #read-4 and main #read-27 each show the before-meeting video and poster; no script errors.
- Facts checked against the notice, the full agenda and the meeting-3 / meeting-26 summaries by the spec checks (0 misses); layout OK; legal check STOP 0 · WARN 0 for both; legal pack PDFs made.

## Human read (24 Nov 2569)
- Only signed/published Senate documents (Rpublic = 1).
- Ridehail 4: the notice names four ride-hailing companies; the video says only "กรรมการผู้จัดการของบริษัทผู้ให้บริการแพลตฟอร์มเรียกรถ 4 บริษัท". The 18 Nov call-off and its reason are not mentioned (the live meeting-3 video already gave 25 Nov). "Last time" items are said as proposals.
- Main 27: 3.3 names no bill titles or senators; 3.4 names no complainant, local body or airline, and the draft resolutions printed in the agenda are not read out. 3.2 wording unchanged (verbatim, no opinion).
- People: only the chairs, full titles. Result: OK to publish.

STATUS: READY
