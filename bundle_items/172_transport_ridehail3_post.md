# 172_transport_ridehail3_post

Thread "Videos: Transport committee meetings", 23 Nov 2569. Part of the batch asked by "Site: Update automatically three times a day" (22 Nov 20:12 UTC).

**One self-contained file.** `172_transport_ridehail3_post.sh` (10.9 MB) carries the web video, its Thai caption file and poster inside (base64 tar.gz, sha256 checked). Run with `HUB=<hub clone> bash 172_transport_ridehail3_post.sh`. Idempotent, no git, no network; prints "172_transport_ridehail3_post OK". Like 171 it ends by moving the mp4 to the video repos ($BUILD/video_offload.py); the share-page step needs the video repo clones (VIDEO_CLONE_ROOT).

Needs item 163 (live since bundle 50).

## What goes live
| Committee | Meeting | Source (Rpublic = 1) | Video |
|---|---|---|---|
| Transport: ride-hail app sub | 3, Thu 12 Nov 2569 10.00, CA 320 | summary 11230998 (+ notice ว974) | สรุปผลการประชุม 3:39 |

1080x1920, Thai voice + English subtitles burned in (one version), kind "post", old book logo, chairs with official photos.

## Pages touched
transport/2569/sub-ridehail.html + sub-ridehail.json (media field of row 3 + CAPS), new share page s/v-ridehail-3.html + card, poster, Thai .vtt; video_share.py rebuilds the other Transport share pages as usual (seo.py in run_bundle.sh restores the search tags). Home page unchanged (subcommittee video).

## Checks
- Fresh clone of origin/main 1e3df306 (bundle 50 live): first run 2 text files + share page/card/poster/vtt, "OK"; second run no change (write-tree equal).
- Phone view (390 px): page loads, poster for meeting 3 present, no script errors.
- Every script line fact-checked against the summary (0 misses); layout OK; legal check STOP 0 · WARN 0; legal pack PDF made.

## Human read (23 Nov 2569)
- Only the published summary and notice (Rpublic = 1). Proposals are said as proposals of the meeting, not resolutions (this summary has no resolution heading).
- The summary header misprints "ครั้งที่ ๒"; the notice ว974 and the Senate list date 12 Nov 2569 as meeting 3. The video says 3 and does not quote the misprinted header.
- People: only the subcommittee chair and committee chair with full titles. No adviser, agency staff or platform company is named; platforms are spoken of in general terms only.
- Tone neutral and humble; amounts (80,000 / 500,000 baht) copied from the summary's statement of the Road Accident Victims Protection Act.
- Result: OK to publish.

STATUS: READY
