# 213_env_water5_pre: Environment water subcommittee meeting 5 BEFORE-meeting video

Thread "Videos: Environment committee meetings", 24 Nov 2569. Asked by "Site: Update automatically three times a day"
(24 Nov 05:52 UTC, item number 213 reserved). Routine content (VIDEO AUTO-APPROVAL + AUTO UPDATES).

**One self-contained file**: `213_env_water5_pre.sh` carries the video (mp4 + Thai vtt + poster) as base64 tar.gz after
`__PAYLOAD_BELOW__`, sha256-checked before use (payload sha256 236fbecbc5043fb74aed75145bb1f71bcc0cd16282bb90117f00a9499b3c6f52).
Needs only `$HUB` (and `$BUILD`, default /mnt/project-files/archive/build). No git, no network.

**Apply AFTER item 212** (water 5 time/room/agenda). The water 5 date card is already live on hub main, so the item also
works before 212; it only stops ("apply item 212 first") if the meeting 5 / 26 Nov card is missing from sub-water.json.

## What it adds (1080x1920, Thai voice + English subtitles burned in, one version)
| Page | Meeting | Video | Length | Source document (Rpublic = 1) |
|---|---|---|---|---|
| environment/2569/sub-water.html | water 5 (Thu 26 Nov 2569, 09.30, CA 331 + online) | BEFORE-meeting (kind pre) | 1:50 | notice 11236547 (ว1056, 23 Nov 2569); recap from the water 4 summary already on the page |

Surgical: only the "media" field of water meeting 5 (sub-water.html DATA + sub-water.json), its CAPS caption track, the
share page s/v-water-5-pre.html (video_share.py CARD_BIG=1) and no_video_dl. The home page is not touched by the item
(home newest-4 list and snapshot "v" count main-committee meetings only); run_bundle's usual hub_snap_sync step refreshes
the Environment "sub water" home card. video_offload.py then moves the mp4 to a video repo (in my test: video-2, because
video-1 stands at 899.1 of 900 MB).

## Content and legal notes
- Subcommittee chair นางสาวรัชนีกร ทองทิพย์ and committee chair นายชีวะภาพ ชีวะธรรม named with official photos.
- Agenda item 3 (illegal dumping of industrial and hazardous waste; illegal import of plastic and electronic waste) is
  described in the notice's own words as a study topic: no places, companies or people named.
- Climate subcommittee meeting 5 (26 Nov, notice 11244958) is marked cancelled in the Senate list (MCancel 1): no video.
- legal_check: STOP 0, WARN 3 (the three "illegal" words quote the notice's own agenda title). Approval pack (PDF with
  sources) kept with the master on local disk.

## Tests (hub origin/main 80ae0a16, video repo clones at their origin/main)
- Run 1: exit 0; sub-water.html + sub-water.json changed, share page + card + poster + vtt added; offload PASS (video-2);
  video_host_check PASS.
- Run 2 (full, with offload): exit 0, tree identical to run 1.
- data_match: PASS (223 pages, 0 differences) · symbol_check: PASS · footer_only: PASS · NO_NAME: PASS · no_video_dl --check: PASS
- hub_snap_sync --check: flags "environment sub water" until run_bundle's hub_snap_sync step (as expected for a new video).
- site_check.js on sub-water.html and the share pages, phone + PC: pages open, no layout problems. Its only "must fix" is
  "no Thai/English switch" on share pages s/v-*.html, which the live s/v-water-4.html shows the same way.
- video_share.py rewrites all Environment share pages and drops seo.py's head tags; run_bundle's "seo.py bundle" step puts
  them back (same as item 181, now live, whose share pages kept their VideoObject "duration"). In my sandbox seo.py ran
  after the offload and left "duration" out; the bundle's own order gave the full tags for 181.

STATUS: READY
