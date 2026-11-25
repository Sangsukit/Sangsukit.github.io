# 223_en_be_year_fix: English Act years keep the Thai (B.E.) year

Thread "Site: Add more committees and subcommittees", 25 Nov 2569. Asked by the coordinator (bug reported by "Site: Update
automatically three times a day", found during the Health work, confirmed on the live site). English view only.
**One self-contained file** (`223_en_be_year_fix.sh`, no payload: it edits in place). Run with `HUB=<hub clone> bash 223_en_be_year_fix.sh`.

## The bug
English lines wrote an Act's year as `B.E. {n|ce}`. `|ce` converts the Thai year to the Christian era, so readers saw
"Act on the Summoning Powers of Committees B.E. 2025" (should be B.E. 2568) or "Health Promotion Foundation Act B.E. 2001"
(should be B.E. 2544).

## The fix
Every `B.E. {n|ce}` in an English value becomes `B.E. {n}` (the Thai year, correctly labelled B.E.). Every one of the 62
places was checked against its Thai key: each is "พ.ศ. {n}" (a Thai Buddhist-era year), so "B.E. {n}" is right in all.
Keys, Thai text and every other line are untouched; file format kept (compact JSON, round-trip checked before writing).

| File (hub) | Places |
|---|---|
| education/2569 | 3 |
| energy/2567, 2568, 2569 | 3 each |
| environment/2569 | 4 |
| health/2567, 2568, 2569 | 8 each |
| social/2567, 2568 | 5 each |
| social/2569 | 9 |
| transport/2567, 2568, 2569 | 1 each |

The script scans every `*/*/i18n-en.json` in the hub, so it is safe to run before or after other items (it also catches the
pattern if an item queued earlier adds it). Files stay in the site's compact JSON form, so items 219 and 221 apply in
either order. The archive repos (committee-archive-2569,
public-admin-2567/2568) have no such line.

## Sources fixed too (so a rebuild does not bring it back)
Same replacement made in the committee build sources: /mnt/project-files/committees/{energy,health,social,transport}/i18n_en.json
(3, 8, 9, 1 places) and this thread's local Education and Environment build copies. Owners told: Health, Social and
Transport threads (their own in-flight items should use "B.E. {n}" or "of {n|ce}" without B.E.).

Root cause also fixed: each committee's `tools/make_i18n.py` (pair()) turned every Buddhist-era year into `{n|ce}`, including
the one right after "B.E.". All 8 copies on /mnt/project-files/committees/*/tools/ (commerce, education, energy, environment,
foreign, health, social, transport) now keep `{n}` when the year follows "B.E." (tested: a rebuild of Environment gives
"B.E. {n}" in all 4 places). Thanks to the Transport thread for spotting this.

## Checks (sandbox = live main 903bf9dd + this item; applied twice: same tree 2afb029f)
- site_check (Health 2569, Social 2569, Environment 2569, Transport 2569, Energy 2568, Education 2569 main pages; phone + PC,
  incl. the English switch): PASS
- data_match: PASS (223 pages, 0 differences)
- self-check in the script: no English value anywhere keeps `B.E. {n|ce}`
- legal_check on the 62 changed English lines: STOP 0, WARN 0

STATUS: READY
