# 178 pa_nov25_pre_videos: Public Administration 2569, three BEFORE-meeting videos for Wed 25 Nov 2569

Owner: thread "Videos: make meeting videos" (22-23 Nov 2569). Asked by "Site: Update automatically three times a day"
(relay 22 Nov 2569 UTC): PRE videos for main 38 (ว 1057), central sub 32 (ว 1061), dev sub 17 (ว 1058).
Routine content under VIDEO AUTO-APPROVAL (Sukit 9 Nov 17:33 UTC) and AUTO UPDATES. No design change, no flag change.

## SELF-CONTAINED (shared folder over its cap)
`178_pa_nov25_pre_videos.sh` (22,811,388 bytes, md5 1296b08dc47d3b2fcd5a3f3273d022cc) carries its 9 files as a base64 tar.gz
after the `__PAYLOAD_BELOW__` line (payload sha256 364d9b5622ea1b734d75ecf69e478ad91ac6de5c37b073eebbd3801cdf4eba24, checked
before anything is written). No payload folder. Needs $HUB $A69 $BUILD. No git, no network.

## NEEDS item 164_pa_nov25_notices FIRST (bundle 50)
164 adds the three 25 Nov meeting cards. Without them this item stops BEFORE changing anything
("run item 164_pa_nov25_notices first; nothing changed", exit 1). Run order in the bundle: 164, then 178. (Renumbered from 168, which is taken by 168_energy_pre52.)

## What goes live
- Main meeting 38/2569 (25 Nov, 13.00, CA 426): video `media/v38.mp4` (1:40, 4,516,814 B), captions `media/v38.th.vtt`,
  poster `img/poster38.jpg`; index.html DATA media + CAPS key "38p" (new key last, as build.py orders it); meetings.json
  (indent=1, round-trip asserted); share page `s/v-38-pre.html` + card `img/v/38-pre-<hash>.jpg`; VSHARE "38".
- Central and regional subcommittee 32/2569 (25 Nov, 09.00, CB 315): `media/sub-central-v32pre.mp4` (2:20, 6,014,387 B),
  `media/sub-central-v32pre.th.vtt`, `img/poster-sub-central-32pre.jpg`; sub-central.html DATA media + CAPS "central-32p"
  (newest first, as subsite.py orders it); sub-central.json; share page `s/v-central-32-pre.html` + card; VSHARE "32".
- State administration development subcommittee 17/2569 (25 Nov, 09.30, room 405): `media/sub-dev-v17pre.mp4` (2:55,
  7,508,046 B), `media/sub-dev-v17pre.th.vtt`, `img/poster-sub-dev-17pre.jpg`; sub-dev.html DATA media + CAPS "dev-17p";
  sub-dev.json; share page `s/v-dev-17-pre.html` + card; VSHARE "17".
- Every video: kind "pre", label "วิดีโอก่อนการประชุม", 1080x1920 H.264 crf 24 + AAC 96k (prep_video.py settings), Thai voice
  with English subtitles burned in (one version only). Downloads stay off (no_video_dl.py run on the new share pages, --check PASS).
- Home page: "latest videos" list (HH) gains PA 38 pre (25 Nov) at the top; Social 36 (19 Nov) drops off (newest 4 by meeting
  date, same entry shape as the live list). Snapshot counts follow through run_bundle.sh hub_snap_sync.py.
- PA archive videos stay in committee-archive-2569 (as v36/v37 and disaster 12 did); video_offload.py decides as usual.

## Repos / paths touched
A69 edited: index.html, meetings.json, sub-central.html, sub-central.json, sub-dev.html, sub-dev.json (media of the three
meetings, CAPS and VSHARE only; every other meeting exactly live).
A69 new: media/v38.mp4, media/v38.th.vtt, media/sub-central-v32pre.mp4, media/sub-central-v32pre.th.vtt, media/sub-dev-v17pre.mp4,
media/sub-dev-v17pre.th.vtt, img/poster38.jpg, img/poster-sub-central-32pre.jpg, img/poster-sub-dev-17pre.jpg,
s/v-38-pre.html, s/v-central-32-pre.html, s/v-dev-17-pre.html, img/v/38-pre-*.jpg, img/v/central-32-pre-*.jpg, img/v/dev-17-pre-*.jpg.
Existing share pages: kept byte-identical (video_share.py rewrites them all; the item puts the live copies back).
HUB edited: index.html (HH line only). A67/A68: none. site_flags.py: none.
Shared build sources (best effort; prints a NOTE and carries on if the shared folder refuses the write): build.py VIDEOS[38],
build/sub_videos.py central 32 and dev 17, archive/site media copies.

## Checks
- Rpublic = 1 on all three notices (Senate lists fetched 22 Nov 2569 ~20:25 UTC). Only the notices and published press releases used.
- Legal: legal check STOP 0, WARN 0 on all three videos (scripts, on-screen text, Thai and English captions). Names only the committee
  chair and subcommittee chairs (senators), with photos. No petitioners, private parties or officials named. No emblem.
  Agenda shown as the notice's agenda, never as decisions (cl.92 / cl.104). Legal packs and source lists kept with the video thread.
- Test on fresh clones (archive e13f1a0 #71 + item 164 applied; hub 13fd7d7, again on hub 044e025 #98 with the same archive result): exit 0, 6 files edited + 15 new; second run
  "changed 0 files", home "unchanged"; without 164 it refuses with nothing changed; re-running 164 after it changes 0 files.
  VSHARE only gains the three keys. data_match PASS. NO_VIDEO_DL check PASS.
- Phone 390x844 on a local copy: main page #read-38, sub-central #read-32, sub-dev #read-17 show the "ก่อนการประชุม" video card with
  poster, no page errors, no sideways scroll; the three share pages play at 1:40, 2:20 and 2:55.

STATUS: READY
