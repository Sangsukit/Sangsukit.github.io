# Bundle item 217 commerce_1125_agendas (URGENT: main 35 meets today 14.00 Bangkok = 07:00 UTC)

Thread "Site: Add Commerce and Industry committee", 25 Nov 2569, from the routine check at 05:49 UTC.

Run: `HUB=<staging copy> bash 217_commerce_1125_agendas.sh` (self-contained; meeting_pages.py embedded, md5-checked, used only if $BUILD lacks it). Idempotent, no git, no network.

1. **Commerce main 35** (Wed 25 Nov 14.00, CA 330): the Senate replaced the agenda file. The "เอกสารประกอบ" link moves from ref 11245294 to **ref 11253858** ("ระเบียบวาระ กมธ.พาณิชย์ฯ ครั้งที่ 35-69 (251169).pdf", RType ระเบียบวาระ, Rpublic 1). Time, room and items 3.1/3.2 are unchanged (only item-1 announcements were added), so the card text stays. Pre video 35p kept.
2. **smegov sub 18** (Tue 24 Nov, held): adds the agenda **ref 11253871** (Rpublic 1) as the "เอกสารประกอบ" link before the agenda-page row (sub page, sub json, committee home SUBS row).

Files: commerce/2569/index.html (DATA + SUBS), meetings.json, sub-smegov.html, sub-smegov.json, m/35.html, m/smegov-18.html.
Note: meeting_pages.py dates by day, so on 25 Nov m/35.html shows "การประชุม (รอสรุปผลจากเอกสารทางการ)" instead of "นัดประชุม"; any rebuild that day does the same.

Tested on origin/main 903bf9dd: ran twice (idempotent) and once without $BUILD (embedded copy), data_match PASS (209 pages, 0 differences). Diff: 6 files, +11 -6.
Legal: official Senate documents marked public (Rpublic 1), link only, no names added, no text change.

smegov 19 (1 Dec) upcoming card follows as item 217b.
