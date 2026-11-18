# 143_edu_env_sub_text_oct: easy-read text for 16 October subcommittee meetings (Education + Environment)

Thread "Site: Add more committees and subcommittees", 18 Nov 2569. Second half of 142_edu_env_sub_text_nov, asked by
"Site: Update automatically three times a day" (sweep 18 Nov 06:09 UTC). Routine content (AUTO UPDATES rule).
**Apply after 142** (it is made on top of 142; on a hub without 142 it stops with "apply 142_edu_env_sub_text_nov first").

## What changes
| Page | Meetings (date) | Source (Rpublic = 1, 18 Nov ~06:12 UTC list) | Chair shown |
|---|---|---|---|
| education/2569/sub-higher | 36 (6 Oct), 37 (20 Oct) | summaries | yes (document says he presided) |
| education/2569/sub-learning | 19 (7 Oct), 20 (21 Oct), 21 (28 Oct) | summaries | yes |
| education/2569/sub-vocational | 30 (7 Oct), 31 (21 Oct), 32 (28 Oct) | press releases | yes |
| environment/2569/sub-climate | 1 (8 Oct), 2 (22 Oct) | press releases (text read from the images) | no (photo caption only / not stated) |
| environment/2569/sub-land | 1 (7 Oct), 2 (21 Oct), 3 (28 Oct) | press releases | 1, 2 yes; 3 no |
| environment/2569/sub-water | 1 (8 Oct), 2 (22 Oct), 3 (29 Oct) | press releases | yes |

Per meeting: headline, summary, items, tags, places, pending off, chair fields (DATA line + page json), new share card.
Main pages: SUBS line. i18n-en.json: 33 (education) + 32 (environment) English lines, add only. Cancelled rows with the same
number (higher 36 of 29 Sep, vocational 30 of 30 Sep) are not touched. Media, audio and every other meeting untouched.

## Rules followed
Official Senate documents only; no names of agency representatives, outside persons, private bodies or associations; the
UK university met by higher 37 is described, not named, and its own claims about itself are left out; no praise or criticism.

## Checks (sandbox = hub origin/main 3eddfd19 + item 142, item applied twice: same tree efe93db1)
- site_check (8 pages, phone + PC): PASS · timeline_check: PASS · ux_guard: PASS · symbol_check: PASS · data_match: PASS (209 pages)
- read_check: only "file missing: /video-1/..." (videos live in the video repos; expected)
- legal_check: STOP 0, WARN 3 (GUILT_WORDS): all three are the word "โกงกาง" (mangrove tree) in land 3, a false match. OK.

Generator: committees/education/build/bundle_item/gen_143.py (REF=base142).
