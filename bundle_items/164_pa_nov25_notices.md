# 164 pa_nov25_notices: Public Administration 2569, three agenda cards for Wed 25 Nov 2569

Owner: thread "Site: run the meeting archive" (23 Nov 2569 Bangkok). Asked by the auto-update thread (relay 22 Nov 20:11 UTC, first check
after the 4-day pause): main 38 notice 11216112 (ว1057), central sub 32 notice 11216675 (ว1061), dev sub 17 notice 11216256 (ว1058).
Routine content update under AUTO UPDATES (Sukit confirmed 11 Nov 12:28 UTC). No design change, no flag change.

## SELF-CONTAINED (shared folder over its cap)
The .sh carries its whole payload (12 new files + data entries + English lines, base64 tar.gz, ~0.4 MB) at the end of the file.
There is NO payload folder for this item. Needs only $A69. Touches no other repo.

## What goes live (committee-archive-2569 = A69)
- Main meeting 38/2569 (25 Nov): agenda card from notice ว 1057 (19 Nov 2569): 13.00, ห้องประชุมกรรมาธิการ CA 426 ชั้น 4 อาคารรัฐสภา,
  map, the 5 standard agenda items (approve minutes of 37/2569, subcommittee work, matters and petitions referred, matters within the
  committee's duties, next meeting). Same shape and wording as the 36 and 37 notice cards. Notice PDF link + Parliament agenda page.
  Timeline: planned entry for 25 Nov (37's entry stays as it is). Calendar button 37 -> 38 (`cal/38.ics`), share page `s/38.html`
  + card `img/s/38-7e5a59d5.jpg` + `img/s/qr-38.svg`, SHARE_V "38".
- Central and regional subcommittee 32/2569 (25 Nov): agenda card from notice ว 1061: 09.00, ห้องประชุมกรรมาธิการ CB 315 ชั้น 3 อาคารรัฐสภา;
  agenda = draft outline of the study report on specific town plans under the Town Planning Act 2562, urban conservation case study,
  Department of Public Works and Town & Country Planning invited (agency named, no person). agenda_only (shown as the notice's agenda,
  never as decisions). Time and room typed from the notice (its PDF text uses private-use Thai glyphs, same as 31).
  Timeline planned entry 31 -> 32, calendar 31 -> 32, share page `s/central-32.html` + card + QR, `cal-sub/central/32.ics`.
- State administration development subcommittee 17/2569 (25 Nov): agenda card from notice ว 1058: 09.30, ห้องประชุม 405 ชั้น 4 อาคารรัฐสภา;
  agenda = approve minutes of 16/2569 and consider the summary of the 20 Nov seminar on the new facilitation act (act name quoted exactly
  as the notice writes it). agenda_only. Chair = the subcommittee chair (senator), as on the disaster 12 agenda card (item 122).
  Room typed (the parser keeps a line break inside "ห้องประชุม 405"). Timeline planned entry 16 -> 17, calendar 16 -> 17,
  share page `s/dev-17.html` + card + QR, `cal-sub/dev/17.ics`.
- Main page subcommittee tabs (SUBS): central gets 32, dev gets 17; all five get fetched 2026-11-22 (all five lists were fetched).
- UPDATED on index.html, sub-central.html, sub-dev.html -> 2026-11-23 (max with live).
- English: 7 new lines in `A69/i18n-en.json` (add-only; also merged into the shared archive/i18n/en.json, cache 11874).
- Home page: nothing in this item. run_bundle.sh's hub_snap_sync.py refreshes the PA 2569, central and dev snapshots
  (tested: "3 updated", then --check PASS).

## Repos / paths touched
A69 edited: index.html (lines DATA, TL, EZ, SHARE_V, SUBS, UPDATED only), meetings.json, sub-central.html and sub-dev.html
(DATA, TL, EZ, SHARE_V, UPDATED only), sub-central.json, sub-dev.json, i18n-en.json.
A69 new: s/38.html, img/s/38-7e5a59d5.jpg, img/s/qr-38.svg, cal/38.ics, s/central-32.html, img/s/central-32-ee63a8e7.jpg,
img/s/qr-central-32.svg, cal-sub/central/32.ics, s/dev-17.html, img/s/dev-17-8cbaa921.jpg, img/s/qr-dev-17.svg, cal-sub/dev/17.ics
(refuses to overwrite a different file of the same name). HUB/A67/A68: none. site_flags.py: none.

## Shared build sources (already edited, so a full rebuild gives the same result)
build/content_37_40.py (M[38]), build/timeline.py (38 planned entry), build/sub_content/central.py (32), build/sub_content/dev.py (17),
build/doc_sizes.json (3 notice sizes), build/txt/38_notice.txt, build/sub_txt/central/32_notice.txt, build/sub_txt/dev/17_notice.txt,
build/meetings_new.json + build/subs_raw.json refreshed 22 Nov 20:2x UTC. Notice PDFs were not stored in the shared folder (cap).

## Checks
- Rpublic = 1 on all three notices (checked in the Senate lists fetched 22 Nov 2569 ~20:25 UTC).
- Legal: legal_check.py text STOP 0, WARN 0 on every new Thai and English text (cards, share pages, calendar files, English lines).
  Only published notices and the Senate meeting lists are used (cl.92 / cl.104). Names: the committee chair and the dev subcommittee
  chair only (senators). One government agency named. No complainants, private parties or non-office-holders. No emblem.
- Test on fresh clones of main (archive e13f1a0 #71, hub 13fd7d7): exit 0, 7 files edited + 12 new; second run "changed 0 files".
  Every new data entry, timeline, calendar and share value equals the private full build; every other meeting and line is exactly live
  (url tokens and known build drift left as live). data_match.py PASS (6 pages). hub_snap_sync --check PASS after the sync.
  timeline_check.js PASS on the main page, sub-central, sub-dev and sub-disaster (the whole-site run timed out in this container,
  so the bundle's own site_check.sh run is the full one).
- Phone 390x844, Thai and ?lang=en: main, sub-central, sub-dev, home and the 3 share pages: no page errors, no sideways scroll,
  nothing stuck on "กำลังโหลด"; meeting 38 shows 13.00 and CA 426, central 32 shows 09.00 and CB 315, dev 17 shows 09.30 and
  room 405; English headlines show.

## Depends on / notes
- Independent of other items. If a pre-meeting video item for any of these meetings runs first, this item keeps the `media` it finds.
- Meeting 37 (18 Nov) still has no published summary; its card is left as it is.

STATUS: READY
