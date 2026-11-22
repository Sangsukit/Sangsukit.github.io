# 171_transport_pre27_andaman6

Thread "Videos: Transport committee meetings", 22 Nov 2569. Asked by "Site: Update automatically three times a day" (22 Nov 20:12 UTC).

**One self-contained file.** `171_transport_pre27_andaman6.sh` (15.6 MB) carries the two web videos, their Thai caption files and posters inside (base64 tar.gz, sha256 checked before use). Run it with `HUB=<hub clone> bash 171_transport_pre27_andaman6.sh`. It is idempotent, uses no git and no network, and prints "171_transport_pre27_andaman6 OK". Like items 97 and 127 it then moves the mp4s to the video repos ($BUILD/video_offload.py; refuses to leave mp4s on the main site). The share-page step needs the video repo clones (VIDEO_CLONE_ROOT, default /home/user), as before.

**Needs item 163 first** (it adds the meeting rows Transport 27 and Andaman port 6). Without 163 the item stops with "meeting ... not on the page" and changes nothing.

## What goes live (both before-meeting videos, Nov 2569 scope)
| Committee | Meeting | Source (Rpublic = 1) | Video |
|---|---|---|---|
| Transport (main) | 27, Wed 25 Nov 2569 14.00, CB 411 | notice 11216957 (ว1044) | ก่อนการประชุม 2:33 |
| Transport: Andaman port sub | 6, Thu 26 Nov 2569 09.30, CA 427 | notice 11225635 (ว1047) | ก่อนการประชุม 2:39 |

1080x1920, Thai voice + English subtitles burned in (one version), kind "pre", old book logo, chairs with official photos. The "last time" scenes use the published summaries of main 26 (11216407) and Andaman 4 (12 Nov; meeting 5 has no summary yet).

## Pages touched
transport/2569: index.html, meetings.json, sub-andamanport.html, sub-andamanport.json (media field of the two rows + CAPS), new share pages s/v-27-pre.html and s/v-andamanport-6-pre.html with cards, posters and Thai .vtt; video_share.py rebuilds the other Transport share pages as usual (seo.py in run_bundle.sh puts the search tags back). Home: newest-4 video list and the Transport 2569 snapshot count.

## Checks
- Fresh clone of origin/main (13fd7d7f) + item 163 applied, then 171 (I97_TEST_NO_OFFLOAD=1, VIDEO_CLONE_ROOT = sparse clones of video-1/2/3): 29 files changed, "OK". Second run: no change (git write-tree equal).
- Phone view (390 px): both pages load with no script errors; the posters for 27 and Andaman 6 are on the pages.
- Every script line fact-checked against the notice/summary (0 misses); layout check OK; legal check STOP 0 · WARN 0 for both videos, with a legal pack PDF each (kept with the masters on the Transport video thread's disk).

## Human read (22 Nov 2569)
- Only documents the Senate published (Rpublic = 1). Notices give the agenda only; nothing is said about how members will speak or vote (cl.92 / cl.104).
- Main 27 agenda 3.2 (Khlong Thai New City investment concept, with the Senate Economy, Finance and Fiscal Affairs committee invited): notice wording only, no opinion.
- People: only the committee and subcommittee chairs, with full titles. Not named: the private shipping company invited to Andaman 6 (said as "one private shipping company"), airline operators, agency staff.
- Tone neutral and humble; numbers copied from the documents.
- Result: OK to publish.

STATUS: READY
