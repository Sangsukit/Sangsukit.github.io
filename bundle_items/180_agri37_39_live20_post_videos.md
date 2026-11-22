# Item 180: Agriculture POST-meeting videos: main 37, 38, 39 + livestock subcommittee 20

Thread: "Site: Build Agriculture committee archive", 22 Nov 2569.
Depends on: nothing new (meetings 37/38/39 and livestock 20 are already on the page; their summaries went live in bundle 49).
Runs in any order with 167/169/173.

What it does (agriculture/2569 main page, sub-livestock page, home page):
- copies v37.mp4 (3:04), v38.mp4 (3:45), v39.mp4 (3:06), sub-livestock-v20.mp4 (2:31), all 1080x1920, Thai voice +
  English subtitles burned in (one version), their .th.vtt and posters from this item's _files folder (ITEM_FILES);
- sets only the "media" field of main 37, 38, 39 (index.html DATA + meetings.json) and livestock 20 (sub-livestock.html +
  .json); kind="post". Meeting 39 keeps its live PRE video exactly as it is (link /video-1/.../v39pre.mp4, size 3583230)
  and gains the post video; the page shows the pre video first;
- makes s/v-37.html, s/v-38.html, s/v-39.html, s/v-livestock-20.html + cards (video_share.py CARD_BIG=1; needs the
  video-1 clone as in every bundle), runs no_video_dl and seo.py apply; live share pages restored byte for byte;
  refreshes the home newest-4 list and Agriculture 2569 snapshot "v" counts;
- moves the new mp4s to the video repos (video_offload.py); refuses to finish if an mp4 stays on the main site.

Source: thread "Videos: Agriculture committee meetings", branch claude/project-thread-uf9igb (2f41018b), folders
bundle_items/drop_agri37post, drop_agri38post, drop_agri39post, drop_agri_livestock20post. Each LEGAL_CHECK STOP 0 /
WARN 0. Facts only from public press releases 37/2569, 38/2569, 39/2569 and livestock newsletter 20/2569 (Rpublic=1);
no minutes or full agendas.

Tested 22 Nov 2569 on a fresh worktree of origin/main 044e0259 (bundle 49) after 167, 173, 169 (I97_TEST_NO_OFFLOAD=1,
video-1 clone stubbed): run twice, second run "changed 0 text files"; all non-media fields unchanged; legal_check STOP 0 /
WARN 0; no_video_dl --check PASS; #read-37, #read-39 (pre then post) and livestock #read-20 play in Thai and English at
400 px; share page s/v-38.html OK; 0 page errors.

STATUS: READY
