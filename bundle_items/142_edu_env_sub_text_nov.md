# 142_edu_env_sub_text_nov: easy-read text for 7 November subcommittee meetings (Education + Environment)

Thread "Site: Add more committees and subcommittees", 18 Nov 2569. Asked by "Site: Update automatically three times a day"
(sweep 18 Nov 06:09 UTC): cards that still showed only "การประชุมครั้งที่ N/2569" with no items although the Senate has
published a summary. Routine content (AUTO UPDATES rule): goes live after the bundle's site + legal checks.

## What changes
| Page | Meeting | Source (Rpublic = 1 on the 18 Nov ~06:12 UTC list) | Chair shown |
|---|---|---|---|
| education/2569/sub-higher | 38 (3 Nov) | summary, 5 pages | yes, the document says he presided |
| education/2569/sub-higher | 39 (11 Nov) | summary | yes |
| education/2569/sub-learning | 22 (11 Nov) | summary, 2 pages | yes |
| education/2569/sub-vocational | 33 (4 Nov) | press release, 1 page | yes ("ดร.สุทิน แก้วพนา เป็นประธานในที่ประชุม") |
| environment/2569/sub-climate | 3 (12 Nov) | press release | no (header only, no "presided" line) |
| environment/2569/sub-land | 5 (11 Nov) | press release | no (header only) |
| environment/2569/sub-water | 4 (12 Nov) | press release | yes |

Per meeting: headline, summary, items, tags, places, pending off, chair fields (DATA line + page json), new share card
(s/<key>-N.html + img/s/<key>-N-<hash>.jpg, SHARE_V). Main pages of both committees: SUBS line (subcommittee tab).
i18n-en.json: 18 (education) + 19 (environment) English lines, add only. Media, audio and every other meeting untouched.
Past date cards still marked upcoming (higher 40) are left as they are live.

Not included: Energy waste 4/5/6 summaries are Rpublic 2 (not public) on the 18 Nov list, so their cards stay link-free
and waste 5's wording "เว็บไซต์วุฒิสภายังไม่ได้เผยแพร่สรุปผลการประชุมครั้งนี้" is still accurate. October meetings come
as a second item.

## Rules followed
Official Senate documents only; no names of agency representatives, outside persons, proposers, individual universities or
private bodies; organisations named only as information givers; no praise or criticism; land 5 rosewood item reports the
National Forest Policy Committee resolution and that views differ, without naming anyone.

## Checks (sandbox = hub origin/main 3eddfd19, item applied twice: same tree c415287c)
- site_check (8 pages, phone + PC): PASS · timeline_check: PASS · ux_guard: PASS · symbol_check: PASS · data_match: PASS (209 pages)
- read_check: only "file missing: /video-1/..." (videos live in the video repos; expected)
- legal_check: STOP 0, WARN 1 (GUILT_WORDS "ที่ผิดกฎหมาย" in the land 5 item): read by a person, it is the official agenda
  title "สถานการณ์และปัญหาการส่งออกไม้พะยูง ไม้ท่อน และไม้แปรรูปที่ผิดกฎหมายในประเทศไทย" and accuses no one. OK.

Generator: committees/education/build/bundle_item/gen_142.py (scratch builds of both committees from the 18 Nov lists).
