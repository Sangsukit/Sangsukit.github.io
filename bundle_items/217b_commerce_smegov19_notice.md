# Bundle item 217b commerce_smegov19_notice

Thread "Site: Add Commerce and Industry committee", 25 Nov 2569, from the routine check at 05:49 UTC. Follows item 217 (split off so the urgent main 35 link swap could ship first).

Run: `HUB=<staging copy> bash 217b_commerce_smegov19_notice.sh`. It is self-contained (payload, apply.py and meeting_pages.py are embedded and md5-checked) and idempotent, with no git and no network.

- **smegov sub 19** (Tue 1 Dec 2569): new upcoming card from the notice, ref 11254314 (สว (กมธ ๑) ๐๐๐๙/ว๑๐๕๘, 24 Nov, Rpublic 1).
  - Time and place: 10.00, ห้องประชุมกรรมาธิการ CB 311 (สว.) ชั้น 3 อาคารรัฐสภา.
  - Agenda item 3: considering the draft study report on promoting the Kanchanaburi Special Economic Development Zone.
  - The card adds a share card (s/smegov-19.html plus picture and QR), the calendar file cal-sub/smegov/19.ics, the timeline entry, the EZ calendar, the UPDATED date, the home-page SUBS row (date and docs), and m/smegov-19.html.
  - It adds 5 English keys to i18n-en.json; only missing keys are added.
- **smegov 18** (24 Nov) is no longer flagged "upcoming". Its pre video is kept.

Tests on origin/main 903bf9dd:
- 217b on its own, run twice.
- 217 then 217b, and 217b then 217 (the second order without $BUILD). Both orders give an identical diff.
- data_match: PASS (209 pages, 0 differences).
- English check: no missing keys beyond the existing page-title line.
- Phone render at 390 px: card, meeting page and share page all fine, with no JS errors.

Legal: the notice is an official Senate document marked public. The card text comes only from the notice; no individual names appear and no wording is judgmental.
