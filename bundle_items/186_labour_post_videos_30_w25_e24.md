# 186 labour_post_videos_30_w25_e24 — Labour after-meeting videos: main 30, welfare sub 25, employment sub 24 (SELF-CONTAINED)

Owner: "Videos: Labour committee meetings". Asked by "Site: Update automatically three times a day" (22 Nov 2569 20:11 UTC);
narration released by the coordinator 23 Nov 01:55 UTC (one take each). All three: kind="post", 1080x1920, Thai voice +
English subtitles burned in (one version), legal_check video STOP 0 · WARN 0, auto-approved video (Sukit 9 Nov 2569).
Every fact quote passes spec_lab_post_base against the published Senate document (all Rpublic=1). No private names.

| Video | Meeting | Length | Source |
|---|---|---|---|
| media/v30.mp4 | main 30/2569, 12 Nov | 4:26 | เอกสารข่าว ref 11218909 (scan); room from notice. Presiding นายชินโชติ แสงสังข์, First Vice-Chair; chair shown too. |
| media/sub-welfare-v25.mp4 | welfare sub 25/2569, 18 Nov | 2:47 | จดหมายข่าว ref 11217525; notice ๑๑๓๑ + change ว๑๑๕๖ |
| media/sub-employment-v24.mp4 | employment sub 24/2569, 18 Nov | 3:14 | เอกสารแถลงผล ref 11225884 (scan); notice ๑๑๕๒. Complaint item carries "รวบรวมข้อเท็จจริงเบื้องต้น ยังไม่ใช่ข้อสรุป". |

## Self-contained
Shared folder over cap, so the 3 mp4 + 3 Thai vtt + 3 posters are embedded as base64 (sha256 + size checked on decode).
Nothing is read from committees/labour/media; committee.py VIDEOS / SUB_VIDEOS are NOT edited. csite entries to add later:
- VIDEOS 30: [<existing pre>, dict(src="media/v30.mp4", poster="img/poster30.jpg", vtt="media/v30.th.vtt", kind="post", label="วิดีโอสรุปผลการประชุม", dur="4:26", cc=_CC)]
- SUB_VIDEOS "welfare" 25: [<existing pre>, dict(src="media/sub-welfare-v25.mp4", poster="img/poster-sub-welfare-25.jpg", vtt="media/sub-welfare-v25.th.vtt", kind="post", label="วิดีโอสรุปผลการประชุม", dur="2:47", cc=_CC)]
- SUB_VIDEOS "employment" 24: [<existing pre>, dict(src="media/sub-employment-v24.mp4", poster="img/poster-sub-employment-24.jpg", vtt="media/sub-employment-v24.th.vtt", kind="post", label="วิดีโอสรุปผลการประชุม", dur="3:14", cc=_CC)]

## What changes (hub, labour/2569 + home)
- The 9 media files above (mp4s then move to the video repos via video_offload.py).
- "media.videos" for main 30 (index.html DATA + meetings.json), welfare 25 (sub-welfare.html + .json) and employment 24
  (sub-employment.html + .json): existing pre first, new post second ("video" field unchanged); CAPS tracks "30",
  "welfare-25", "employment-24"; share pages s/v-30.html, s/v-welfare-25.html, s/v-employment-24.html (video_share.py
  CARD_BIG=1, then no_video_dl.py); home Labour 2569 snapshot "v" for 30 (1 -> 2). Home newest-4 list unchanged (25 Nov
  videos are newer).

## Checks (sparse copy of main 1e3df30, labour/2569 + index.html; stand-in video clone; offload skipped I97_TEST_NO_OFFLOAD=1)
- Changed 7 text files; applied twice: second run "changed 0 text files". NO_VIDEO_DL check PASS. All 6 share pages present.

Depends on: item 172 (main 31, already live). With this, all four Labour after-meeting videos asked on 22 Nov are done.
STATUS: READY
