# 152 commerce_1122_updates

Owner: thread "Site: Add Commerce and Industry committee" (routine request 22 Nov 2569 20:11 UTC, first check after the 4-day pause).

What: Commerce 2569 routine content (no design change). Every Senate file used is Rpublic=1 (checked 22 Nov).
- main 33 (11 Nov): file 11216651 is the re-issued AGENDA (RType ระเบียบวาระ, named as the agenda), not minutes, so it replaces
  the old agenda link 11147054 ("เอกสารประกอบ"). Minutes 11204694 added (same URL as item 145).
- main 34 (18 Nov): now past. Easy-read summary from ref 11216297 (semiconductor/manpower draft report, SME help "Surat model",
  public procurement transparency, nominee persons in industry). No private organisation or person named. Agenda link 11204700
  (same URL as item 145). Pre video kept.
- main 35 (Wed 25 Nov, 14.00, CA 330): NEW upcoming card from notice 11216585 (ว1040). The halal certification complaint is
  written neutrally as a complaint asking for a review (a claim, not a finding).
- smegov 15 (2 Nov): minutes 11225596 added.
- smegov 17 (19 Nov): text from agenda 11216282 (EEC transport model, anti-corruption, Kanchanaburi visit 27-28 Nov,
  SME CONNECT 2027 seminar); the invited private person is not named. Pre video kept.
- smegov 18 (Mon 24 Nov, 10.00, CB 311): NEW card from notice 11225978 (ว1050), seminar preparation.
- smeurgent 18 (24 Nov) and industry 19 (Mon 23 Nov): NEW date cards, no documents published yet.
  smeurgent 17 and industry 18 are no longer marked upcoming.

Files: commerce/2569/index.html (DATA, SUBS, SHARE_V, EZ, UPDATED lines), meetings.json, sub-smegov/-smeurgent/-industry .html
(DATA, SHARE_V, TL, EZ, UPDATED) + .json, share cards s/ + img/s/ for main 34, 35, smegov 17, 18, smeurgent 17, 18, industry 18, 19,
cal/35.ics, cal-sub/{smegov/18,smeurgent/18,industry/19}.ics, i18n-en.json (25 missing keys only), then meeting_pages.py rebuilds
m/*.html (new m/35, m/smegov-18, m/smeurgent-18, m/industry-19). Surgical line swaps, every line round-trip checked.

Number: renamed from 146 on 22 Nov (146 is the Agriculture item 146_agri36_summary). Same content.

Self-contained: payload, apply.py and a copy of meeting_pages.py embedded (base64 tar, md5-checked). Uses
archive/build/meeting_pages.py when present. Idempotent; no git, no network; needs $HUB.

Order: includes item 145's links and agrees with it. Tested on fresh origin/main 13fd7d7f: alone twice (second run changes
nothing); 145 -> 140c -> 152 (number order) and 140c -> 152 -> 145 give identical trees; 152 first, then 145 and 140c, also pass
(only i18n key order differs, and m/smegov-16.html waits for the next meeting_pages run, because 140c does not run it).
Checks: data_match PASS, timeline_check PASS on the 4 Commerce pages, no new untranslated lines in English mode, phone render of
#read-34, #read-35, smegov #read-17/#read-18, smeurgent #read-18, industry #read-19, m/35, m/smegov-17: no JS errors.
legal_check.py text: STOP 0, WARN 0. No private names in the new text.
Home card: hub_snap_sync in run_bundle.sh refreshes the Commerce home card after the items.
Voice: the routine thread records the main 34 listen-button voice after this is live.

STATUS: READY
