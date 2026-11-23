# 189 pa37_post_video: after-meeting video of Public Administration main meeting 37/2569 (Wed 18 Nov 2569)

Owner: thread "Videos: make meeting videos" (23 Nov 2569). Asked by "Site: Update automatically three times a day"
(relays 23 Nov 2569 05:52, 06:09 and 06:18 UTC): the meeting 37 summary is out (ref 11232488); make the POST video as item
189_pa37_post_video, record after the ElevenLabs top-up, one take per scene, and queue it after 188_pa37_summary.
Videos are auto-approved (VIDEO AUTO-APPROVAL, Sukit 9 Nov 2569 17:33 UTC); routine content update, no design change, no flag change.

## SELF-CONTAINED (shared folder over its cap)
`189_pa37_post_video.sh` (15,244,837 bytes, md5 49759d2b2a34b79f6d8c693a0494455d) carries its 3 files as a base64 tar.gz after the
`__PAYLOAD_BELOW__` line (payload sha256 60ed69eb1a9ffffc44a8726199ce696bf3bfe598bd4981ce41d31a31a97f649f, checked before anything is written). No payload folder.
Needs $HUB $A69 $BUILD. No git, no network.

## RUN AFTER 188_pa37_summary (routine order)
188 adds the meeting 37 written summary. This item only sets meeting 37's `media`, so it also works before 188 (it stops with
"nothing changed", exit 1, only if meeting 37 of 2026-11-18 or its live before-meeting video is missing from the page).

## What goes live
- committee-archive-2569: `media/v37post.mp4` (5:01, 1080x1920, Thai voice + English subtitles burned in, one version only,
  12,244,936 B, H.264 crf 24 + AAC 96k as prep_video.py), `media/v37post.th.vtt`, `img/poster37post.jpg` (720x1280 from cover_9x16.png).
- Meeting 37 `media` in the DATA line of index.html and in meetings.json (indent=1, round-trip asserted): `video` = the after-meeting
  video, `videos` = [post, existing pre] (same fields and order as meeting 36). kind "post", label "วิดีโอสรุปผลการประชุม".
  The pre-meeting video keeps its files and share page (`media/v37.*`, `img/poster37.jpg`, `s/v-37-pre.html`): nothing renamed.
- `CAPS` gets track "37" right before "37p" (as the live page has "36" before "36p").
- `s/v-37.html` + `img/v/37-<hash>.jpg` via video_share.py with CARD_BIG=1; VSHARE "37" now points to s/v-37.html (as for 36).
  Every existing share page is put back byte-identical; no_video_dl.py re-applied, `--check` PASS (downloads stay off).
- Home page "latest videos" list (HH): the 37 post video goes right before the 37 pre video if meeting 37 is in the newest 4 by
  meeting date (same rule as hub/home.py); otherwise unchanged.

## Shared build sources (best effort; prints a NOTE and carries on if the shared folder refuses the write)
- `archive/build/build.py` VIDEOS[37] becomes the list [post (cc), pre].
- `archive/site/media/v37post.mp4`, `v37post.th.vtt`, `archive/site/img/poster37post.jpg` copied (needed by build.py CAPS).
- Item 188 reports that the shared folder can silently drop writes while it is over its cap. So the branch also carries
  `bundle_items/189_build_sources.patch` (build.py VIDEOS[37] only; dry-run clean against the shared build.py of 23 Nov 06:38 UTC).
  If VIDEOS[37] is still the pre-only dict later, apply it from /mnt/project-files/archive with `patch -p1 --dry-run` first, and copy
  the 3 files from the live committee-archive-2569 (media/v37post.*, img/poster37post.jpg) into archive/site.

## Repos / paths touched
A69 edited: index.html, meetings.json. A69 new: media/v37post.mp4, media/v37post.th.vtt, img/poster37post.jpg, s/v-37.html,
img/v/37-*.jpg. HUB edited: index.html (HH line only, when meeting 37 is in the newest 4). A67/A68: none. site_flags.py: none.
PA archive videos stay in committee-archive-2569 (as v36post/v38); video_offload.py decides as usual.

## Content and checks
- Source: only the published press release ข่าวประชาสัมพันธ์ ครั้งที่ 37/2569 (ref 11232488, Rpublic 1) and the notice ว ๑๐๒๖
  (cl.92/cl.104). The press release prints the date as "19 พฤศจิกายน"; the notice, the Senate list and the meeting 38 notice
  ว 1057 say Wed 18 Nov 2569, so the video says 18 Nov and never 19 (as the site card). Noted in the legal pack's cautions.
- Covers: 2 complaints (state land in the 4th Army Area: letter to the Treasury Department; a village headman candidate's
  qualifications in Mueang Phang Nga: progress noted), the 3 subcommittees (town plans study and the Bangkok plan complaint on
  roads Kho 2/Kho 3 in Nong Chok; the 20 Nov seminar on the 2569 facilitation act; disaster education in schools), and the domestic
  violence victims bill (sections 6 to 15, five suggested improvements). Next meeting Wed 25 Nov 13.00 CA 426.
- Names shown: the committee chair นายธวัช สุระบาล and the 3 subcommittee chairs only (with face photos, roster pulled
  23 Nov 2569). No complainant, candidate, adviser or private names. Complaints carry "ยังไม่ใช่ข้อยุติ"; wording
  "ขอให้ตรวจสอบข้อเท็จจริง". No emblem; old book logo. 37 fact quotes checked against the source text by the spec.
- Legal: `LEGAL_CHECK.md` STOP 0, WARN 0; legal pack `ชุดเอกสารขออนุมัติ_สรุปการประชุม_37-2569_FINAL.pdf` kept with the video thread.
- Voice: ElevenLabs Nook, one take per scene (14 new scenes, 3,680 credits; scene 3 reuses the shared chairs take).
- Tested on fresh worktrees of origin/main (archive 6c6981a #72, hub b2594e0 #101): (a) 189 alone: exit 0; A69 diff = index.html (lines DATA, CAPS, VSHARE only) + meetings.json + 5 new files; HUB unchanged
  (meeting 37 is not in the newest 4: all four are 25 Nov videos); second run "changed 0 files", no git change (idempotent).
  (b) 188 from branch claude/bundle-item-188-pa37-summary (8e1469a) first, then 189: both exit 0; meeting 37 keeps the 188 headline
  and summary and gets videos [post, pre]; s/v-37-pre.html stays exactly as 188 left it; card img/v/37-d27ea3e5.jpg.
  Phone 390x844 (local copy): #read-37 shows before then after video with labels, s/v-37.html and s/v-37-pre.html load;
  no page errors, no sideways scroll, nothing stuck on "กำลังโหลด", no download links.

STATUS: READY
