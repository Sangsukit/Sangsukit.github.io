# 145_edu_env_energy_nov22: Education, Environment, Energy updates from the 22 Nov lists

Thread "Site: Add more committees and subcommittees", 22 Nov 2569. Asked by "Site: Update automatically three times a day"
(22 Nov 20:12 UTC). Routine content (AUTO UPDATES rule). **One self-contained file**: `145_edu_env_energy_nov22.sh` carries
its payload (base64 tar.gz at the end, sha256-checked before use), so nothing else has to be copied.
**Apply after 142, 143 and 144** (made on top of them; on a hub without them it stops with "apply 142..., 143... and 144... first").

## What changes (every linked document Rpublic = 1 on the 22 Nov ~20:15 UTC lists, checked one by one)
| Page | Meeting | Change | Source refs |
|---|---|---|---|
| education/2569 (main) | 46 (18 Nov) | summary: report on schooling for children without Thai nationality and children of migrant workers approved for the Senate (ข้อ 98, 99); higher-education sub progress; Chon Buri visit approved | summary 11216756, notice 11216745 |
| education/2569 (main) | 47 (Wed 25 Nov) | new date card: 10.30, CA 426 floor 4 and online; agenda: Thailand's education readiness for OECD membership | notices 11216302, 11216064 (same text) |
| education/2569 (main) | 45 (11 Nov) | approved minutes link (docs only, every other field as live) | 11216449 |
| education sub-learning | 23 (18 Nov) | summary: early-childhood policy "3 เร่ง 3 ลด 3 เพิ่ม", screen time | 11216597 |
| education sub-vocational | 34 (18 Nov) | summary: draft PISA policy report | 11216662 |
| education sub-vocational | 35 (Wed 25 Nov) | new date card: 13.30, CA 328 floor 3; agenda: dual vocational education draft report | notices 11217794, 11216360 (same text) |
| education sub-higher | 40 (17 Nov) | summary: 7 study topics for FY 2570 (governance topic written neutrally), Chon Buri visit plan | summary 11216622, notice 11216617 |
| education sub-higher | 41 (23 Nov) | second notice link (docs only; same text as 11205183) | 11216527 |
| environment/2569 (main) | 41 (17 Nov) | summary: complaint about upstream forest encroachment for ginger, Chai Prakan (written as a complaint under review, agencies only, no private names); Trat carbon-credit visit approved; time 14.30, CA 429 | 11226642 (image PDF, read by OCR and checked) |
| environment/2569 (main) | 42 (Tue 24 Nov) | new date card: 14.00, CA 429 floor 4; agenda: ginger complaint, heavy metals in the Kok, Sai, Ruak and Mekong rivers | 11227765 |
| environment/2569 (main) | 40 (10 Nov) | approved minutes link (docs only) | 11227206 |
| environment sub-climate | 4 (19 Nov) | summary: Trat mangrove carbon-credit visit moved from 11–13 Dec 2569 to 29–31 Dec; PM2.5 report questions assigned | 11227922 |
| energy/2569 (main) | 52 (Tue 24 Nov) | new date card: 15.00–17.00, CA 427 floor 4; agenda: progress of subcommittees and working group | 11216654 |
| energy/2569 (main) | 23 (8 Apr) | presiding person corrected: นายสัมพันธ์ ชัยวิเศษจินดา, รองประธานคณะกรรมาธิการ คนที่สาม ทำหน้าที่ประธานในที่ประชุม (directory spelling; page-top chair unchanged). Asked by the weekly accuracy check 22 Nov | approved minutes 10010191 p.2 |

Share cards, calendar files (past meetings' calendar files removed), timeline entries, 43 English lines (i18n-en.json, add only)
and the SUBS tab lines of the Education and Environment main pages. Media, audio and every other meeting untouched.

## Not used (Rpublic = 2, not public)
All sign-in sheets, fee reports and invitation letters; agendas of higher 40, vocational 34 and learning 23; minutes of
higher 39, vocational 33 and learning 22; every Energy waste 6, 7, 8 and 9 document (notices, agendas, summaries, minutes).
The self-check refuses if any of these refs is linked.

## Notes
- Several notice PDFs lose glyphs when read as text (ฬ, ้), so the engine could not read time and room for Energy 51/52 and
  Environment 41/42; they were read from each PDF by eye and match it. Energy 51 keeps its live 14.00, CA 427.
- Two dates are written without a year because the document's year looks like a typo: Chon Buri visit "25–26 มกราคม"
  (document says 2569) and the climate visit's new date "29–31 ธันวาคม" (document says 2570).
- Subcommittee chairs shown only where the summary says who presided (learning 23, vocational 34, higher 40); climate 4 and
  vocational 35 show none. No sub members, presenters, universities or private bodies named.
- New date cards that may want pre-meeting videos: Education 47, vocational 35, Environment 42, Energy 52 (video threads).

## Checks (sandbox = hub origin/main 13fd7d7f + 142 + 143 + 144; item applied twice: same tree e19a5e9c)
- site_check (7 pages, phone + PC): PASS · timeline_check: PASS (223 pages) · ux_guard: PASS · symbol_check: PASS
- data_match: PASS (223 pages, 0 differences) · NO_NAME: PASS · footer-only: PASS (7592 pages)
- read_check: only "file missing: /video-1/..." (videos live in the video repos; expected)
- every linked ref in the payload (475) is Rpublic = 1 on the 22 Nov lists; self-check refuses the 19 non-public refs
- legal_check (new text only): STOP 0, WARN 1 (COURT_CASE on "ร่วมดำเนินคดีบุกรุกป่าปลูกขิงในพื้นที่ 5 คดี": a count reported
  by the police unit in the official summary, no person named, nothing about a court; kept). Docs-only cards keep live text.
- Energy 23 change re-checked on its own: site_check, ux_guard, symbol_check, data_match PASS.

STATUS: READY

Generator: gen_145.py (from gen_144; REF=base144; doc sizes and Senate link tokens ignored when comparing other meetings).
