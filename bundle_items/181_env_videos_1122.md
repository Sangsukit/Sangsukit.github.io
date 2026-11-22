# 166_env_videos_1122: Environment committee videos from the 22 Nov list

Thread "Videos: Environment committee meetings", 22 Nov 2569. Asked by "Site: Update automatically three times a day" (22 Nov).
Routine content (VIDEO AUTO-APPROVAL + AUTO UPDATES). Renumber freely.

**One self-contained file**: `166_env_videos_1122.sh` carries the three videos (mp4 + Thai vtt + poster) as base64 tar.gz after
`__PAYLOAD_BELOW__`, sha256-checked before use (payload sha256 90a1eb0113c760bf2b841d2b70cb520960a67146eb6422666c550a0521a57384).
Needs only `$HUB` (and `$BUILD`, default archive/build). No git, no network.

**Apply AFTER 165_edu_env_energy_nov22** (it adds the 41 summary, the 42 date card and the climate 4 summary). Without it the
script stops with "apply 165_edu_env_energy_nov22 first".

## What it adds (1080x1920, Thai voice + English subtitles burned in, one version)
| Page | Meeting | Video | Length | Source document (Rpublic = 1) |
|---|---|---|---|---|
| environment/2569/index.html | 42 (Tue 24 Nov 2569, 14.00, CA 429) | BEFORE-meeting (kind pre) | 2:56 | notice 11227765 (ว1048, 20 Nov 2569); recap from summary 11226642 |
| environment/2569/index.html | 41 (17 Nov 2569) | AFTER-meeting (kind post), beside the live before-meeting video | 4:29 | summary 11226642 |
| environment/2569/sub-climate.html | climate 4 (19 Nov 2569) | AFTER-meeting (kind post), beside the live before-meeting video | 2:17 | summary 11227922 |

Surgical: only the "media" field of those three meetings changes (live videos, listen-button audio and all other fields kept;
before-meeting video listed first), their CAPS caption tracks, the share pages (video_share.py CARD_BIG=1; s/v-42-pre, s/v-41,
s/v-climate-4 are new), no_video_dl, the home newest-4 video list and the Environment 2569 snapshot "v" counts. Then
video_offload.py moves the mp4s to the video repos (in my test: v42pre + v41 to video-2, sub-climate-v4 to video-1, which then
stood at 898.8 of 900 MB; the tool picks the repo).

## Content and legal notes
- Chair นายชีวะภาพ ชีวะธรรม and the three subcommittee chairs named with official photos; climate 4 shows its chair นายชวภณ วัธนเวคิน.
- Ginger complaint written as a complaint under review: agencies only, no villages, people or companies named.
- Climate 4: the Trat trip is said to be "postponed" from 11-13 Dec 2569 with no new date (the summary prints 29-31 Dec "2570",
  likely a typo). The site text from item 165 shows "29-31 ธันวาคม" without a year, so the two do not conflict.
- legal_check per video: STOP 0, WARN 0. Approval packs (PDF with sources) kept with the masters on local disk.

## Tests (hub origin/main 13fd7d7f + 142 + 143 + 144 + 165, video repo clones at their origin/main)
- Run 1: exit 0, 5 page/json files + home changed, 3 share pages + cards added; offload PASS; video_host_check PASS.
- Run 2 (full, with offload): exit 0, tree identical to run 1.
- data_match: PASS (209 pages, 0 differences) · symbol_check: PASS · footer_only: PASS · NO_NAME: PASS · no_video_dl --check: PASS
- hub_snap_sync --check: PASS after run_bundle's usual hub_snap_sync step (before it, 165's Education/Environment/Energy cards
  are out of date too, as expected).
- site_check.js on the changed pages (home, environment index + sub-climate, 4 share pages), phone + PC: pages open, no
  layout problems. Its only "must fix" is "no Thai/English switch" on the share pages s/v-*.html, which the live
  s/v-41-pre.html shows the same way (share pages are outside the normal site_check page list).
- seo.py --check flags the sitemap until run_bundle's "seo.py bundle" step, as for every item that adds pages.
- The whole-site site_check.sh --quick did not finish in my container in 25 min: please let the bundle's own run cover it.

STATUS: READY
