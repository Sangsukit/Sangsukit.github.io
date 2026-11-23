# 182_edu_env_past_flags: six past Education/Environment meetings no longer marked "upcoming"

Thread "Site: Add more committees and subcommittees", 23 Nov 2569. Asked by "Site: Update automatically three times a day"
(after-publish check of bundle 50, 23 Nov 02:00 UTC). Routine content fix. **One self-contained file** (payload embedded,
sha256-checked). Made on top of live main after bundle 50 (1e3df306); needs 165_edu_env_energy_nov22 (it checks).

## Why
Item 165 added the summaries of these meetings but its generator did not carry the `upcoming` flag, so the cards still
said the meeting was pending next to a published summary. Fixed in the generator (gen_182 / later items include `upcoming`).

## What changes (fresh csite builds from the 23 Nov ~02:10 UTC Senate lists; no document changes since 22 Nov)
| Page | Meeting | Change |
|---|---|---|
| education/2569 (main) | 46 (18 Nov) | upcoming flag removed |
| education sub-higher | 40 (17 Nov) | upcoming -> false |
| education sub-learning | 23 (18 Nov) | upcoming -> false |
| education sub-vocational | 34 (18 Nov) | upcoming -> false |
| environment/2569 (main) | 41 (17 Nov) | upcoming flag removed |
| environment sub-climate | 4 (19 Nov) | upcoming -> false |

Card text, chair, time, room, media and audio unchanged; document links carry fresh Senate download tokens (same refs).
SUBS tab line of both main pages refreshed from the same build (sha-guarded). UPDATED -> 2026-11-23.
No new text, so no legal text check needed (all wording already passed in item 165).

## Checks (sandbox = live main 1e3df306; item applied twice: same tree c77014d6)
- site_check (6 pages, phone + PC): PASS · timeline_check: PASS (223 pages) · ux_guard: PASS · symbol_check: PASS
- data_match: PASS (223 pages, 0 differences)
- read_check: only "file missing: /video-N/..." (41; videos live in the video repos; expected)

STATUS: READY
