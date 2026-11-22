# Item 163: Agriculture main 40 PRE-meeting video (meeting Mon 23 Nov 2569, 14.00)

Thread: "Site: Build Agriculture committee archive", 22 Nov 2569.
Depends on: 160_agri40_water21_livestock21 (adds the meeting 40 card). Run 160 first, in the same bundle (49).
URGENT: should be live before 07:00 UTC 23 Nov (meeting starts 14.00 Bangkok).

What it does (agriculture/2569 + home page only):
- copies v40pre.mp4 (2:08, 1080x1920, Thai voice + English subtitles burned in, one version), v40pre.th.vtt and
  poster40pre.jpg from this item's _files folder (ITEM_FILES) into agriculture/2569/media and img;
- sets only the "media" field of meeting 40 (2026-11-23) in the DATA line of index.html and in meetings.json,
  adds the Thai caption track (CAPS key 40p), kind="pre", label "วิดีโอก่อนการประชุม";
- makes the share page s/v-40-pre.html + card img/v/40-pre-*.jpg (video_share.py CARD_BIG=1), runs no_video_dl
  and seo.py apply; share pages that are already live are restored byte for byte (no layer is lost);
- home page newest-4 video list gets the 40 video; Agriculture 2569 snapshot "v" count updated;
- moves the mp4 to the video repos (video_offload.py) and refuses to finish if an mp4 stays on the main site.
  Push + merge the video repo BEFORE the main site.

Source of the video: thread "Videos: Agriculture committee meetings", branch claude/project-thread-uf9igb,
folder bundle_items/drop_agri40pre/ (legal pack LEGAL_SUMMARY.md: STOP 0 / WARN 0; sources: notice ว1045 and the
published press release of meeting 38; nobody named as presiding).

Tested 22 Nov 2569 on a fresh worktree of origin/main 13fd7d7f after item 160 (I97_TEST_NO_OFFLOAD=1, video-1 clone
stubbed): run twice, second run "changed 0 text files"; legal_check STOP 0 / WARN 0; no_video_dl --check PASS;
#read-40 renders the video in Thai and English at 400 px, share page OK, home list shows it, 0 page errors.

STATUS: READY
