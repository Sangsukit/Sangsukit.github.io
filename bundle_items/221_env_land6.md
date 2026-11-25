# 221_env_land6: Environment land subcommittee 6 (Wed 25 Nov 2569), added as a held meeting

Thread "Site: Add more committees and subcommittees", 25 Nov 2569. Asked by "Site: Update automatically three times a day"
(25 Nov 05:49 UTC check). Routine content (AUTO UPDATES rule). **One self-contained file**: `221_env_land6.sh` carries its
payload (base64 tar.gz at the end, sha256-checked before use). Made on top of live main 903bf9dd (after bundle 59).
Run with `HUB=<hub clone> bash 221_env_land6.sh`.

## What changes (Senate list fetched 25 Nov ~05:56 UTC)
| Page | Meeting | Change | Source |
|---|---|---|---|
| environment sub-land | 6 (Wed 25 Nov) | new card, **held** meeting: 09.30, CA 330 floor 3; headline and agenda sentence "the subcommittee's framework of work"; badge "กำลังจัดทำสรุป" (summary to come); notice link and Senate agenda page; share card | notice 11244932 (Rpublic = 1, letter ว1054 dated 23 Nov 2569) |

Also: the Environment main page SUBS tab line (fresh fetch date, land 6 links) and 1 English line (i18n-en.json, add only;
the headline already had one). Nothing else changes.

## Why "held", not "upcoming"
The meeting started at 09.30 Bangkok (02:30 UTC) on 25 Nov, before this item can go live, so the card is built as a past
meeting (not upcoming, no calendar file, no timeline plan entry, no "นัดประชุม" badge). The scratch build was made with
the subcommittee engine's date set to 26 Nov (scratch copy of csite.py only; no shared file changed). Water 5 and climate 5
(26 Nov) keep their live state; the generator confirmed no other meeting differs from live. When the Senate publishes the
summary, a routine item replaces the agenda text. No chair shown (the notice does not say who presides); nobody named.

## Checks (sandbox = live main 903bf9dd + this item; applied twice: same tree a3b0bc50)
- site_check (sub-land, main; phone + PC): PASS · ux_guard: PASS · symbol_check: PASS
- data_match: PASS (223 pages, 0 differences) · read_check: only "file missing: /video-N/..." (expected)
- timeline_check: PASS (223 pages)
- every linked ref in the payload (217) is Rpublic = 1 on the 25 Nov list; the self-check refuses the Environment lists'
  non-public refs
- legal_check (new Thai and English text): STOP 0, WARN 0

STATUS: READY

Generator: gen_221.py (from gen_212; REF=live58 = origin/main 903bf9dd).
