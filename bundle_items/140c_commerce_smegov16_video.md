# 140c commerce_smegov16_video (rewrite of 140: files vanished from the shared folder)

Owner: thread "Site: Add Commerce and Industry committee" (request from "Videos: Commerce and Industry committee meetings",
18 Nov 2569 06:20 UTC).

What: Commerce 2569, sub-smegov meeting 16/2569 (12 Nov 2569):
- adds the POST-meeting video (1080x1920, 3:27, Thai voice + English subtitles burned in; master and legal pack in
  commerce/sub_smegov/2569-11-12_ครั้งที่16/output/, LEGAL STOP 0 WARN 0; VIDEO AUTO-APPROVAL);
- sets the easy-read text of 138b with one wording change: the invited organisation is no longer named
  ("องค์กรภาคเอกชนด้านการต่อต้านคอร์รัปชัน"), to match the video and the no-private-names rule. Headline unchanged.

Self-sufficient: sets the whole meeting-16 entry (text, docs incl. summary ref 11204323, media) whether or not 138b ran.
Changes: sub-smegov.html DATA[16] + SHARE_V[16] (b349fd23) + CAPS["smegov-16"] + VSHARE["16"]; sub-smegov.json[16];
index.html SUBS[smegov][16] (docs); files media/sub-smegov-v16.{mp4,th.vtt}, img/poster-sub-smegov-16.jpg, s/v-smegov-16.html,
img/v/smegov-16-<v>.jpg (made by video_share.py, CARD_BIG=1; every existing share page restored byte-identical; phone layer
+ no_video_dl on the new page); 138b's share files. i18n-en.json: up to +5 keys (missing keys only).
The mp4 is copied to commerce/2569/media/ like item 75; video_offload.py in run_bundle.sh moves it to a video repo.
video_share.py needs the video repo clones (VIDEO_CLONE_ROOT), as for item 134.

Test (VIDEO_CLONE_ROOT pointed at stub files): fresh origin/main 3eddfd19 alone, and on top of 138b + 139c; second run
changes nothing. Phone render #read-16: new text, summary PDF row, 1 video, no JS errors; s/v-smegov-16.html loads with its
video; videos of 12, 13 and 17 kept; no new untranslated lines. legal_check.py text: STOP 0, WARN 0.
Listen-button voice: the routine thread records it from the summary in this item (not the 138b wording).
Payload: committees/commerce/bundle_2569-11-18d/payload_140h.json (+ 3 share files in files/). Video, vtt and poster are read
from the video thread's web copy committees/commerce/media/ (mp4 md5 7da97fc9e2ea3b30ecd95993ea9bbf69, vtt 2354e818c8535597c0c0dc0e94e4ece1,
poster cbec75f1190c19f3e87cffec155f32f8).

Delivery (18 Nov 12:20 UTC): 140c replaces 140b. The payload is embedded in the .sh (base64 tar), so the item is ONE .sh + this .md;
the video, vtt and poster are still read from committees/commerce/media/ (mp4 7da97fc9e2ea3b30ecd95993ea9bbf69).

STATUS: READY
