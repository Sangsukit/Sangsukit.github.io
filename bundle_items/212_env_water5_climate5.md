# 212_env_water5_climate5: Environment water 5 notice and climate 5 cancelled (Thu 26 Nov 2569)

Thread "Site: Add more committees and subcommittees", 24 Nov 2569. Asked by "Site: Update automatically three times a day"
(24 Nov 05:52 UTC). Routine content (AUTO UPDATES rule). **One self-contained file**: `212_env_water5_climate5.sh` carries its
payload (base64 tar.gz at the end, sha256-checked before use). Made on top of live main 80ae0a16 (after bundle 56); needs
item 202 (water 5 date card), which is live. Run with `HUB=<hub clone> bash 212_env_water5_climate5.sh`.

## What changes (Senate list fetched 24 Nov ~05:57 UTC; both documents Rpublic = 1)
| Page | Meeting | Change | Source |
|---|---|---|---|
| environment sub-water | 5 (Thu 26 Nov) | live date card gets time 09.30, room CA 331 floor 3 (also online via Zoom), headline and agenda sentence: study of illegal dumping of industrial and hazardous waste and illegal imports of plastic and electronic waste; notice link; calendar file and share card updated | notice 11236547 (ว1056, 23 Nov 2569) |
| environment sub-climate | 5 (Thu 26 Nov) | new **cancelled** card (engine's standard "งดการประชุม" card, notice link kept, no time/room, no calendar file, no share card) | Senate list: meeting name "งดการประชุมคณะกรรมาธิการ คณะอนุกรรมาธิการด้านการเปลี่ยนแปลงสภาพภูมิอากาศและมลพิษทางอากาศ", MCancel = 1; notice 11244958 |

Also: the Environment main page SUBS tab line (fresh fetch date, water 5 and climate 5 links) and 3 English lines
(i18n-en.json, add only). Nothing else changes. Media, audio and every other meeting untouched.

## Climate 5: why it is shown as cancelled
The file name and the letter (ว1051, dated 20 Nov 2569) are an ordinary notice for 26 Nov at 13.30, CA 330 (agenda: COP 31
climate policy). The Senate has not published a separate cancellation letter, but its own meeting list now titles the
meeting "งดการประชุม..." and sets the cancelled flag. That is the Senate saying so, so the card follows the list, exactly as
the engine does for every other cancelled meeting (Labour, Public Admin). If the Senate later clears the flag, the next
routine build shows it as a normal meeting again. Climate 5 has no pre-meeting video to make.

## Checks (sandbox = live main 80ae0a16 + this item; applied twice: same tree cea49678)
- site_check (sub-water, sub-climate, main; phone + PC): PASS · ux_guard: PASS · symbol_check: PASS
- data_match: PASS (223 pages, 0 differences) · read_check: only "file missing: /video-N/..." (expected)
- timeline_check: PASS (223 pages)
- every linked ref in the payload (216) is Rpublic = 1 on the 24 Nov list; the self-check refuses the 39 non-public refs of
  the Environment lists
- legal_check (new Thai and English text): STOP 0, WARN 1 (GUILT_WORDS on "การนำเข้า...โดยผิดกฎหมาย": the official agenda
  wording of a study topic, no person or company named; kept)
- No names added (no chair shown: the notice does not say who presides); no agencies or private bodies named.
- Note: the water 5 share card image is new (water-5-7c58cc45.jpg); the old one (water-5-4f39f791.jpg) is left in place, as
  in earlier items.

STATUS: READY

Generator: gen_212.py (from gen_210; REF=live57 = origin/main 80ae0a16).
