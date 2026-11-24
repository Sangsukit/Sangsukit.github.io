# Bundle item 210_transport_health_1124

**Thread:** Site: Add Transport and Foreign Affairs committees · **Asked by:** Site: Update automatically three times a day (05:52 UTC check, 24 Nov 2569) · **Urgent:** ride-hailing 4 meets Wed 25 Nov 10.00.

## What it does (every document Rpublic = 1)
- **Transport, ride-hailing subcommittee meeting 4/2569:** Wed 25 Nov 2569, 10.00, CA 432 floor 4, Parliament House (notice ว1030, ref 11243929). New next-meeting card (Thai + English), share page + card, calendar. The 18 Nov sitting was called off; it was never on the Senate list or the site, so nothing is removed. Invited companies not named.
- **Transport main 27 (Wed 25 Nov 14.00):** agenda PDF (ref 11244188) linked; summary and items 3.3 (draft-act progress) and 3.4 (complaints: U-turn on Highway 403 in Trang; keeping the Don Mueang–Nan flights) added. Row stays n=27; live pre video kept.
- **Health main 31 (10 Nov):** minutes PDF (ref 11244944) linked. Nothing else.

## Changes (surgical, idempotent, no git, no network; needs $HUB)
- transport/2569/index.html + meetings.json: DATA row 27 (media kept), SUBS ridehail row 4 (n=4, 2026-11-25), UPDATED
- transport/2569/sub-ridehail.html + sub-ridehail.json: row 4, TL, EZ calendar, SHARE_V, UPDATED
- health/2569/index.html + meetings.json: row 31 docs (media kept), UPDATED
- new: transport/2569/s/ridehail-4.html, transport/2569/img/s/ridehail-4-c1f9d234.jpg, transport/2569/cal-sub/ridehail/4.ics
- transport/2569/i18n-en.json: 6 English lines added (add-only)

## Order
Item 211 (Transport video thread: PRE videos ridehail 4 and remade main 27) runs after this item.

## Tests
- hubtest at origin/main 80ae0a16: applied twice (second run changed 0 files), self-check OK, page json equals DATA, every other meeting equals live; Thai and English render with no page errors ("พุธ 25 พ.ย. · นัดประชุมครั้งถัดไป · ครั้งที่ 4/2569 · 10.00").
- Legal check STOP 0 / WARN 0, plus human read below.

.sh md5: 6658dd027dec58676790154bb63813a5

# ผลตรวจกฎหมายอัตโนมัติ: ไฟล์ข้อความ

2026-11-24 06:05 · STOP 0 · WARN 0 · อ้างอิง `legal/กฎหมายการประชุมคณะกรรมาธิการ_Committee-Law-Reference.md`

> เครื่องมือช่วยคัดกรองเท่านั้น ไม่แทนการอ่านของคน และไม่ใช่ความเห็นทางกฎหมาย STOP = ต้องแก้ก่อนเผยแพร่ · WARN = ให้คนอ่านแล้วตัดสิน

ไม่พบประเด็น

## Human read (24 Nov 2569)
- Sources, all Rpublic = 1 on the fresh Senate lists (24 Nov ~05:55 UTC): ride-hailing subcommittee notice ว1030 (ref 11243929); Transport main 27 agenda "69.27 (ร)" (ref 11244188); Health main 31 minutes (ref 11244944, link only, no text taken).
- cl.92 / cl.104: notices and an agenda the Senate itself publishes; the agenda's blank "มติที่ประชุม" lines and proposed resolutions are NOT presented as decisions; only agenda topics are listed.
- Names: no person is named. Not named: the four platform companies invited to ride-hailing 4, the seaplane and other companies in the main 27 working group, the complainants (private persons and a provincial tourism body), the airline concerned, senators named as representatives on draft acts, the senator proposing the Thai Canal idea, and the official who signed the notice. Government agencies (OTP, CAAT, Department of Highways) are named. The reason given for calling off the 18 Nov sitting (members' other duties) is left out.
- Tone: neutral, plain, deferential; no judgement of any agency, company or person. English matches Thai.

STATUS: READY
