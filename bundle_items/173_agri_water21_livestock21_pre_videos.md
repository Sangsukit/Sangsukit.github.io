# Item 173: Agriculture water 21 + livestock 21 PRE-meeting videos (meetings Tue 24 and Wed 25 Nov 2569, 14.00)

Thread: "Site: Build Agriculture committee archive", 22 Nov 2569.
Depends on: 160_agri40_water21_livestock21 (adds the water 21 and livestock 21 cards). Run after 160 (and after 167 if
in the same bundle; no file overlap with 167 except the VSHARE map, which video_share.py rebuilds from all pages).

What it does (agriculture/2569 subcommittee pages only):
- copies sub-water-v21pre.mp4 (2:16) and sub-livestock-v21pre.mp4 (2:06), both 1080x1920, Thai voice + English subtitles
  burned in (one version), their .th.vtt and posters from this item's _files folder (ITEM_FILES);
- sets only the "media" field of water 21 (2026-11-24) in sub-water.html/.json and livestock 21 (2026-11-25) in
  sub-livestock.html/.json, adds the Thai caption tracks (CAPS keys water-21p, livestock-21p), kind="pre";
- makes s/v-water-21-pre.html and s/v-livestock-21-pre.html + cards (video_share.py CARD_BIG=1), runs no_video_dl and
  seo.py apply; share pages that are already live are restored byte for byte;
- moves the mp4s to the video repos (video_offload.py); refuses to finish if an mp4 stays on the main site.

Source: thread "Videos: Agriculture committee meetings", branch claude/project-thread-uf9igb (05ba8b26), folders
bundle_items/drop_agri_water21pre/ and drop_agri_livestock21pre/. Legal packs: STOP 0 / WARN 0. Facts only from public
documents (Rpublic=1): notices ว1042 (water) and ว1041 (livestock) of 19 Nov 2569, the main committee press release of
meeting 39 and the livestock newsletter of meeting 20. Nobody is said to preside. The livestock notice does not name the
report, so the video does not say which report will be considered.

Tested 22 Nov 2569 on a fresh worktree of origin/main 13fd7d7f after items 160 and 167 (I97_TEST_NO_OFFLOAD=1, video-1
clone stubbed): run twice, second run "changed 0 text files"; legal_check STOP 0 / WARN 0; no_video_dl --check PASS;
both #read-21 panels show the video in Thai and English at 400 px, share pages OK, 0 page errors.

STATUS: READY
