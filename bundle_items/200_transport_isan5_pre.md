# 200_transport_isan5_pre

Thread "Videos: Transport committee meetings", 23 Nov 2569. Asked by "Site: Update automatically three times a day" (23 Nov 11:52 UTC). Number 200 assigned by that thread so it runs after 199.

**One self-contained file.** `200_transport_isan5_pre.sh` (6.4 MB) carries the web video, its Thai caption file and poster inside (base64 tar.gz, sha256 checked). Run with `HUB=<hub clone> bash 200_transport_isan5_pre.sh`. Idempotent, no git, no network; prints "200_transport_isan5_pre OK". Like 171/172/195 it ends by moving the mp4 to the video repos ($BUILD/video_offload.py); the share-page step needs fresh video repo clones (VIDEO_CLONE_ROOT; video-2 must include bundle 54's v26.mp4).

**Needs item 199_isantransit5_notice_1203 first** (adds row 5, 2026-12-03, to sub-isantransit). Without it the item stops with "meeting ... not on the page" and changes nothing.

## What goes live
| Committee | Meeting | Source (Rpublic = 1) | Video |
|---|---|---|---|
| Transport: Isan transit sub | 5, Thu 3 Dec 2569 09.30, room 202 floor 2 | notice ว1052 dated 23 Nov 2569 (ref 11236134) | ก่อนการประชุม 2:08 |

1080x1920, Thai voice + English subtitles burned in (one version), kind "pre", old book logo, chairs with official photos. The "last time" scene uses the published summary of meeting 4 (ref 11216864).

## Pages touched
transport/2569/sub-isantransit.html + sub-isantransit.json (media field of row 5 + CAPS key isantransit-5p), poster + Thai .vtt, share page s/v-isantransit-5-pre.html + card; video_share.py rebuilds the other Transport share pages as usual. Home page unchanged (subcommittee video).

## Checks
- Fresh clone of origin/main 20302351 + item 199 (md5 3313bb71…) applied, then 200 (I97_TEST_NO_OFFLOAD=1, fresh video clones): "OK"; second run no change (write-tree 898e8ac5 both times).
- Phone view (390 px): #read-5 shows the before-meeting video and poster; no script errors.
- Every fact checked against the notice and the meeting-4 summary by the spec check (0 misses); layout OK; legal check STOP 0 · WARN 0; legal pack PDF made.

## Human read (23 Nov 2569)
- Only the signed notice and the published meeting-4 summary (Rpublic = 1).
- The notice names three bus companies/operators as invitees; the video does not name them ("ผู้ให้บริการเดินรถสาธารณะในทั้ง 3 จังหวัด รวม 3 ราย").
- Says the 25 Nov meeting was called off by the meeting's decision (as the notice says); the reason is not stated. Room written as in the notice ("ห้องประชุม 202 ชั้น 2").
- "Problems, obstacles" read as the agenda heading only; nobody is said to be at fault. People: only the subcommittee chair and committee chair, full titles.
- Result: OK to publish.

STATUS: READY
