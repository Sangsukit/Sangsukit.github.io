# Item 169: Agriculture main 34, 35, 36 POST-meeting videos (meetings 5, 19 and 26 Oct 2569)

Thread: "Site: Build Agriculture committee archive", 22 Nov 2569.
SUPERSEDES item 134 (meeting 34 post video, on HOLD since its mp4 was lost when the shared folder was full). Drop 134.
No dependency on 160/167/173; runs in any order with 146 (146 keeps the live media field of meeting 36).

What it does (agriculture/2569 + home page only):
- copies v34.mp4 (3:43), v35.mp4 (4:15), v36.mp4 (4:16), all 1080x1920, Thai voice + English subtitles burned in (one
  version), their .th.vtt and posters from this item's _files folder (ITEM_FILES);
- sets only the "media" field of meetings 34, 35, 36 (they had no media before) in index.html DATA and meetings.json,
  adds the Thai caption tracks, kind="post", label "วิดีโอสรุปผลการประชุม";
- makes s/v-34.html, s/v-35.html, s/v-36.html + cards (video_share.py CARD_BIG=1), runs no_video_dl and seo.py apply;
  share pages that are already live are restored byte for byte; refreshes the home newest-4 list (date order) and the
  Agriculture 2569 snapshot "v" counts;
- moves the mp4s to the video repos (video_offload.py); refuses to finish if an mp4 stays on the main site.

Sources: 35 and 36 masters from thread "Videos: Agriculture committee meetings", branch claude/project-thread-uf9igb,
folders bundle_items/drop_agri35post/ and drop_agri36post/ (facts only from the committee's public press releases,
Rpublic=1; 36 legal_check STOP 0 / WARN 0; 35 reviewed and handed over 17 Nov 2569). 34 is the 17 Nov web copy made for
item 134 from the published summary 34.69 (decoded end to end without error on 22 Nov).

Tested 22 Nov 2569 on a fresh worktree of origin/main 13fd7d7f after items 160, 167 and 173 (I97_TEST_NO_OFFLOAD=1,
video-1 clone stubbed): run twice, second run "changed 0 text files"; all other fields of 34/35/36 unchanged; legal_check
STOP 0 / WARN 0; #read-34 and #read-36 play in Thai and English at 400 px; share page s/v-35.html OK; 0 page errors.

STATUS: READY
