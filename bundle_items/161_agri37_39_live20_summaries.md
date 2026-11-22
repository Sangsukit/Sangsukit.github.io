# 161 agri37_39_live20_summaries — easy-read summaries for Agriculture main 37, 38, 39 and livestock subcommittee 20

Owner: Agriculture archive thread. Asked by "Site: Update automatically three times a day" (22 Nov 2569 20:09 UTC; 37/38 re-confirmed
by them 20:31 UTC). Routine content update (AUTO UPDATES rule). The update thread records the listen-button voice after go-live,
so the Thai text here is final.

## What changes (repo sangsukit.github.io only, path agriculture/2569/)
- index.html + meetings.json: records n=37 (2 Nov), 38 (9 Nov), 39 (16 Nov) replaced by the new build's records (headline, summary,
  items, tags, places, docs incl. summary/agenda, and 38 minutes); "upcoming"/"agenda_only"/"map" dropped; live "media" kept
  (39 pre-meeting video). SHARE_V 37/38/39. SUBS: livestock meeting 20 docs (summary now linked).
- sub-livestock.html + sub-livestock.json: record n=20 (18 Nov) replaced (summary text, time 14.00, room CA 319 ชั้น 3,
  chair นายฤชุ แก้วลาย); "pending" dropped. SHARE_V 20.
- New share pages and cards: s/37.html, s/38.html, s/39.html, s/livestock-20.html, img/s/37-296c17d1.jpg, 38-99fd2a71.jpg,
  39-104b4a8c.jpg, livestock-20-b341dece.jpg, qr-37/38/39/livestock-20.svg.
- i18n-en.json: up to 27 new English lines (only missing keys added; also merged into archive/i18n/en.json).

## Sources (all Rpublic=1; each PDF's heading checked to be the 2569 meeting, since the Senate list also holds 37/38 of 2568)
- 37: เอกสารข่าว ฉบับที่ ๓๗/๒๕๖๙ (ref 11217030), ระเบียบวาระ (11216636). Krabi small-scale fishers' fishing-zone request;
  Department of Fisheries to submit to the conservation-measures committee by Dec 2569; asked to report back.
- 38: เอกสารข่าว ฉบับที่ ๓๘/๒๕๖๙ (11217130), ระเบียบวาระ (11217104), บันทึกการประชุม (11226152, linked). Three subcommittee
  progress reports + petition from the Senators Meet the People project (lower South) about บจธ. and a land bank decree.
  An internal staffing item (committee secretary post) is left out.
- 39: เอกสารข่าว ฉบับที่ ๓๙/๒๕๖๙ (11225869), ระเบียบวาระ (11217507). Draft water report (3 phases; deemed approved if no
  amendments), Suphan Buri public-land complaint, raw-milk reply, World Horticultural Expo visit 17–19 Dec 2569.
- Livestock 20: จดหมายข่าว ครั้งที่ 20/2569 (11216511, image only, read by eye), ระเบียบวาระ (11216509).
- Wording: neutral, complaints shown as requests, no private persons, no private business or learning-centre names.

## Checks (fresh worktree of origin/main 13fd7d7f)
- Alone, and together with 146 and 160 in either order: applies cleanly; legal_check.py archive agriculture/2569 STOP 0 · WARN 0.
- Rendered at 400 px, Thai and ?lang=en: #read-37, #read-38, #read-39, sub-livestock #read-20 show the new text, docs and
  English; no page errors.
- Idempotent: second run = no change.

## After it is live
- Tell "Site: Update automatically three times a day" (they record the listen-button voice for 37, 38, 39 and livestock 20).

Files come from GitHub branch claude/project-thread-c5tcxm (bundle_items/), or set ITEM_FILES to the _files folder.
Depends on: nothing.
STATUS: READY
