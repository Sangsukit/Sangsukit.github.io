# 173_transport_main26_isan4_post

Thread "Videos: Transport committee meetings", 23 Nov 2569. Last part of the batch asked by "Site: Update automatically three times a day" (22 Nov 20:12 UTC). Voices recorded after the ElevenLabs top-up: one take per scene, zero re-takes, 5,642 credits.

**One self-contained file.** `173_transport_main26_isan4_post.sh` (36.6 MB) carries the web videos, Thai caption files and posters inside (base64 tar.gz, sha256 checked). Run with `HUB=<hub clone> bash 173_transport_main26_isan4_post.sh`. Idempotent, no git, no network; prints "173_transport_main26_isan4_post OK". Like 171/172 it ends by moving the mp4s to the video repos ($BUILD/video_offload.py); the share-page step needs the video repo clones (VIDEO_CLONE_ROOT).

Both meetings already show a live before-meeting video. The item replaces each row's whole "media" field, so the payload also carries those two live pre videos byte-for-byte (v26pre 6,405,233 B; sub-isantransit-v4pre 4,875,881 B, copied from video-1). video_offload sees identical bytes already hosted, deletes the local copy and points back to /video-1/. No new bytes go to the video repo for them.

## What goes live
| Committee | Meeting | Source (Rpublic = 1) | Video |
|---|---|---|---|
| Transport main committee | 26, Wed 18 Nov 2569 14.00, CB 411 | summary 11216407 (+ notice ว1011) | สรุปผลการประชุม 4:21 |
| Transport: Isan transit sub | 4, Wed 18 Nov 2569 09.30, CA 333 | summary 11216864 (+ notice ว1020) | สรุปผลการประชุม 3:45 |

1080x1920, Thai voice + English subtitles burned in (one version), kind "post", old book logo, chairs with official photos. On each row: before-meeting video first, then after-meeting (same order as the Labour rows).

## Pages touched
transport/2569/index.html + meetings.json (row 26), sub-isantransit.html + sub-isantransit.json (row 4), CAPS for the 4 keys (26p, 26, isantransit-4p, isantransit-4), new posters + Thai .vtt for the two post videos, share pages s/v-26.html and s/v-isantransit-4.html + cards. video_share.py rebuilds the other Transport share pages as usual. The home page newest-video list and the Transport snapshot "v" count change (main 26 is a main-committee video).

## Checks
- Fresh clone of origin/main b2594e0a (bundle 52 live): first run gives the text files, posters, vtt, share pages and "OK". Second run makes no change (write-tree b4a73aea both times).
- Phone view (390 px): #read-26 and #read-4 each show 2 videos (pre then post) with the ก่อน/หลังการประชุม bands; no script errors.
- Every script line fact-checked against the summary (0 misses); layout OK; legal check STOP 0 · WARN 0 for both; legal pack PDF made for both.

## Human read (23 Nov 2569)
- Only the published summaries and notices (Rpublic = 1).
- Main 26: no airline, operator or company is named. The 30,000 baht fee is said as what operators raised, with no airport named. Proposals are said as proposals; the only resolutions are those under the summary's resolution heading. Distances and the 2575 opening year are given as what the agencies reported.
- Isan 4: the private bus company that the summary names as a possible future invitee is not named or mentioned. Network, EV-bus and route figures are given as what สนข. and the Department of Land Transport presented, not as approved plans. "40–86 percent overlap" is the summary's range; no operator is said to be affected.
- People: only the committee and subcommittee chairs, with full titles and official photos.
- Tone neutral and humble.
- Result: OK to publish.

STATUS: READY
