# Bundle item 170_law_sub20_21_pre_videos

From: "Videos: Law and Justice committee meetings", 22 Nov 2569 (asked by "Site: Update automatically three times a day").

**Run after 148_law_notices_1122.** Item 148 adds the two meetings as upcoming cards. This item stops with a clear message if they are missing.

## What it does
It puts two BEFORE-meeting videos on parliamentx.com/law/2569/sub-law.html (the Law subcommittee, คณะอนุกรรมาธิการการกฎหมาย).

| Meeting | Date and room | Notice (Rpublic=1) | Length | DATA key |
|---|---|---|---|---|
| 20/2569 | Tue 24 Nov 2569, 10.00, CA 327 | ว1068, ref 11225919 | 1:40 | `20\|2026-11-24` |
| 21/2569 | Thu 26 Nov 2569, 10.00, CA 429 | ว1068.01, ref 11225932 | 2:04 | `21\|2026-11-26` |

- **Cancelled meeting stays without a video.** The cancelled 19 Nov meeting (also numbered 20, key `20|2026-11-19`) keeps NO media. The item asserts this.
- **Format.** Each video is 1080x1920, with Thai voice and English subtitles burned in (one version), kind="pre", label วิดีโอก่อนการประชุม.
- **Content.** Agenda items only. Invitees are named by agency only (สำนักงานศาลยุติธรรม; สมาคมคอนเทนต์ครีเอเตอร์ไทย). Bills are named as written in the notice.
- **Checks passed.** Legal check STOP 0 · WARN 0 for both. Layout check ok.
- **Self-contained.** The payload (2 mp4, 2 Thai vtt, 2 posters, media.json) is embedded as base64 tar.gz after `__PAYLOAD_BELOW__`. It needs nothing from the shared folder except `$BUILD` (video_share.py, no_video_dl.py).

## The edits
These edits are surgical and use the same engine as items 41 and 72:

1. Copies the media files to `law/2569/media/` and the posters to `law/2569/img/`.
2. Sets "media" for those two meetings only, in the `const DATA=` line of sub-law.html and in sub-law.json.
3. Adds CAPS tracks `law-20p` and `law-21p`.
4. Runs `CARD_BIG=1 video_share.py`, which writes the new share pages s/v-law-20-pre.html and s/v-law-21-pre.html and refreshes the others.
5. Runs `no_video_dl.py`, then `no_video_dl.py --check`.

After that, run_bundle's `video_offload.py` moves the two mp4s to video-1. The names are the same as the old cancelled file that item 129 removed; the content is new.

seo.py (run_bundle) puts the SEO tags back on the share pages that video_share rewrites. Sub videos do not change the home newest-4 list or the snapshot.

## Tested
I tested on a clone of main 13fd7d7f with 148 (commit 5d464744) applied first:

- **First run:** rc 0, `changed sub-law.html, sub-law.json`, OK.
- **Second run:** `changed nothing (already applied)`, and an identical `git diff` (idempotent).
- **Phone browser (400 px):**
  - both posters show on the cards;
  - the 26 Nov video is in the "วิดีโอล่าสุด" box;
  - the share page v-law-21-pre plays (2:04);
  - no page errors.

## Hashes
- Item .sh md5: `2d7f34eb453a31b9f39e4c15b5056afb`.
- Master stream md5 (`ffmpeg -map 0 -c copy -f streamhash -hash md5`):
  - 20 = `ab8277289925723a0279cc82d4e7192f`
  - 21 = `0d3fbd26a1341389bb5d5d2f5f16e148`
- The masters and approval packs stay on local disk under /home/user/law_jobs/sub_law/ (the shared folder is over its cap).
