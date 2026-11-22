# 172 labour31_post_video — Labour main committee meeting 31/2569 after-meeting video (SELF-CONTAINED)

Owner: "Videos: Labour committee meetings". Asked by "Site: Update automatically three times a day" (22 Nov 2569 20:11 UTC).
Video: kind="post", 4:16, 1080x1920, Thai voice + English subtitles burned in (one version). Fact-checked against the
published จดหมายข่าว ครั้งที่ 31/2569 (ref 11230558, Rpublic=1; every quote passes spec_lab_post_base); room from notice ว๑๑๕๗.
legal_check video: STOP 0 · WARN 0. Auto-approved video (Sukit 9 Nov 2569). No private names (complainant only "ภาคเอกชน").
Presiding: นายชินโชติ แสงสังข์, First Vice-Chair (per the newsletter); the chair is also shown.

## Self-contained
The shared folder is over its cap, so v31.mp4 / v31.th.vtt / poster31.jpg are embedded in the .sh as base64 (sha256 + size
checked on decode). Nothing is read from committees/labour/media. committee.py VIDEOS is NOT edited (shared folder);
the Labour csite entry to add later is: 31: [<existing pre dict>, dict(src="media/v31.mp4", poster="img/poster31.jpg",
vtt="media/v31.th.vtt", kind="post", label="วิดีโอสรุปผลการประชุม", dur="4:16", cc=_CC)].

## What changes (hub, labour/2569 + home)
- labour/2569/media/v31.mp4 (+ .th.vtt), img/poster31.jpg (then the mp4 moves to the video repos via video_offload.py).
- Meeting 31 (19 Nov) "media.videos" in index.html DATA and meetings.json: existing pre video first, new post second
  ("video" field unchanged); CAPS track "31"; share page s/v-31.html + card (video_share.py CARD_BIG=1, then no_video_dl.py);
  home newest-4 list and Labour 2569 snapshot "v" (31 -> 2).
- video_share.py rewrites the other Labour share pages without later SEO/i18n layers, as with every video item; the bundle's
  later steps put them back.

## Checks (sparse copy of main 13fd7d7, labour/2569 + index.html; stand-in video clone; offload skipped I97_TEST_NO_OFFLOAD=1)
- Applied twice: second run "changed 0 text files". NO_VIDEO_DL check PASS. s/v-31.html and s/v-31-pre.html present.

Depends on: nothing. Main 30, welfare 25 and employment 24 post videos follow in a later item (narration held for ElevenLabs credits).
STATUS: READY
