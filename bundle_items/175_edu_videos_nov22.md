# 175_edu_videos_nov22: 7 Education videos (2 before-meeting for 25 Nov, 1 for 23 Nov, 4 after-meeting)

Thread "Videos: Education committee meetings", 22 Nov 2569. Asked by "Site: Update automatically three times a day"
(22 Nov 20:12 UTC). Routine video content (VIDEO AUTO-APPROVAL + AUTO UPDATES). Renumber freely.

**Apply after 165_edu_env_energy_nov22** (it adds the main 47 and vocational 35 date cards; higher 41
comes with 142-144). On a hub without those rows the script stops with "meeting ... not on the page" before any page text changes (only the new media files may be left in place).

## Videos (1080x1920, Thai voice + English subtitles burned in, one version, kind set)
| Page | Meeting | Kind | Length | Source (all Rpublic = 1) |
|---|---|---|---|---|
| education/2569 (main) | 46 (18 Nov) | post | 3:20 | summary 11216756 |
| education/2569 (main) | 47 (Wed 25 Nov, 10.30, CA 426) | pre | 2:35 | notices 11216302 / 11216064 |
| sub-learning | 23 (18 Nov) | post | 2:48 | summary 11216597 |
| sub-vocational | 34 (18 Nov) | post | 1:19 | summary 11216662 (short paper: topic, invitees, outcome only) |
| sub-vocational | 35 (Wed 25 Nov, 13.30, CA 328) | pre | 2:06 | notices 11217794 / 11216360 |
| sub-higher | 40 (17 Nov) | post | 2:50 | summary 11216622 |
| sub-higher | 41 (Mon 23 Nov, 10.30, room 301) | pre | 2:33 | notice 11205183 (11216527 same text) |

Main 46, learning 23, vocational 34 and higher 40 already have their before-meeting video live; the script keeps that entry
exactly as live (its /video-1/ link and size) and adds the after-meeting one. In media.videos the order is post then pre and
media.video is the post one, as the engine writes it (subsite.py / build.py); the page shows the before-meeting video first.

## What the script does
Copies 7 mp4 + 7 Thai .vtt (education/2569/media/) and 7 posters (education/2569/img/) from
`175_edu_videos_nov22_files/media/` next to it; replaces only "media" of the 7 meetings in the DATA line and the page json;
adds the 7 CAPS tracks; video_share.py (CARD_BIG=1) + no_video_dl.py; home newest-4 video list + Education 2569 snapshot "v";
then video_offload.py + video_host_check.py (needs archive/video_repos/ACTIVE, as earlier video items).
Live videos at other meetings are untouched. No git, no network.

## Checks
- Every video: layout check (no overlaps, no orphan last lines), legal_check STOP 0 · WARN 0 (copies in `_files/legal/`),
  source-pack PDF made. Chairs named with official titles and Senate photos; no universities, companies, presenters,
  private people or document signers named. Higher 40 governance topic said neutrally ("การบริหารจัดการและธรรมาภิบาล").
- Sandbox = hub main 13fd7d7f with the 3 new rows simulated (142-144 payloads were not readable here): clean run changed
  8 page/json files + home index.html and added 21 media/img files and 7 share pages; a second run changed 0 files; after a
  test run, rows show the expected video lists (e.g. 46: post 46 + live pre 46p). Offload not run in the sandbox (needs all
  three video-repo clones); please let run_bundle do it as usual.
- video_share.py regenerates all 28 Education share pages without the SEO/description layers, same as earlier Education
  video items; run_bundle's usual post-steps (seo etc.) put them back. Please run site_check.sh --quick on the whole site.

Payload md5 (`cd 175_edu_videos_nov22_files && find . -type f | sort | xargs md5sum | md5sum`): see the handover message.

STATUS: READY
