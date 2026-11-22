# 175_social_posts_elderly25_women27_28

STATUS: READY  ·  thread "Videos: Social Development committee meetings"  ·  22 Nov 2569

Three AFTER-meeting videos for parliamentx.com/social/2569 (Thai voice, English subtitles burned in, 1080x1920, kind "post"):

| page | meeting | length | source (Senate, Rpublic 1, re-checked 22 Nov) | share page |
|---|---|---|---|---|
| sub-elderly.html | 25 · 4 Nov 2569 | 1:41 | เอกสารข่าวอนุสูงอายุ ครั้งที่ 25 (4 พ.ย.69) | s/v-elderly-25.html |
| sub-women.html | 27 · 3 Nov 2569 | 1:48 | เอกสารข่าวอนุสตรี ครั้งที่ 27 (3 พ.ย.69) | s/v-women-27.html |
| sub-women.html | 28 · 17 Nov 2569 | 2:19 | เอกสารข่าวอนุสตรี ครั้งที่ 28 (17 พ.ย.69) | s/v-women-28.html |

- Replaces the held items 134/135 of 17 Nov (never published). The meeting cards and summaries are already live.
- Independent of 174_social_pre37_elderly26_videos: either order works (tested both; only the key order inside CAPS differs).
- SELF-CONTAINED (videos inside the file, md5-checked); reads nothing from committees/social/media. Needs $HUB and $BUILD, like 174.
- The item name comes from the file name, so renumbering is just renaming the file.
- Legal: legal_check video STOP 0 / WARN 0 for all three (re-run 22 Nov). Companion packs: social/sub_elderly/2569-11-04_ครั้งที่25/output, social/sub_women/2569-11-03_ครั้งที่27/output, social/sub_women/2569-11-17_ครั้งที่28/output.
- Dry run on a copy of origin/main social/2569 (044e0259): changed sub-elderly.html/.json, sub-women.html/.json, m/elderly-25.html, m/women-27.html, m/women-28.html; added 3 share pages, 3 mp4 + 3 vtt + 3 posters; every other file identical. Second run changes nothing. no_video_dl check PASS. Run with the video repos cloned (VIDEO_CLONE_ROOT), as for every video item.
- Backup copy on GitHub: sangsukit/sangsukit.github.io, branch claude/project-thread-2ez729, bundle_items/ (handover only, do not merge).
