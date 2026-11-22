# 163_social_transport_foreign_1122

Thread "Site: Add Transport and Foreign Affairs committees", 22 Nov 2569. Asked by "Site: Update automatically three times a day" (22 Nov 20:11 UTC).

**One self-contained file.** `163_social_transport_foreign_1122.sh` carries its payload inside (base64 tar.gz, sha256 checked before use). It needs nothing from the shared folder. Run it with `HUB=<hub clone> bash 163_social_transport_foreign_1122.sh`. It is idempotent, uses no git and no network, and prints "OK" after its self-check.

## What goes live (all documents Rpublic = 1)
| Committee | Meeting | Source | Shown as |
|---|---|---|---|
| Social Development | main 37, Thu 26 Nov 09.00, CA 330 + online | notice 11225916 | next meeting (agenda) |
| Social: elderly sub | 26, Wed 25 Nov 10.00, room 302 | notice 11226520 | next meeting (agenda) |
| Transport | main 27, Wed 25 Nov 14.00, CB 411 | notice 11216957 | next meeting (agenda) |
| Transport | main 26, 18 Nov | summary 11216407 | easy-read summary |
| Transport | main 25, 11 Nov | minutes 11216802 | document link added |
| Transport: ride-hail sub | 3, 12 Nov | summary 11230998 | easy-read summary |
| Transport: Isan transit sub | 4, 18 Nov | summary 11216864 | easy-read summary |
| Transport: Andaman port sub | 6, Thu 26 Nov 09.30, CA 427 | notice 11225635 | next meeting (agenda) |
| Foreign Affairs: SDG sub | 31, Wed 25 Nov 10.00, CA 320 | notice 11226568 (agenda 11226576 is the same PDF) | next meeting (agenda) |

Thai and English for every row. Share pages and picture cards are rebuilt; .ics calendar files are added for the new upcoming meetings.

**Also included, as a full build would do it:**
- Item 141b's seven Transport subcommittee rows: Isan 1-3, Andaman 1-2 and ride-hail 1-2. The text and share hashes are identical to 141b. Tested both ways: 141b then 163 gives the same pages as 163 alone, apart from i18n key order. 163 then 141b only puts back 141b's older Senate download tokens, which still work. If 163 goes in, 141b can be skipped.
- These meetings now have a past date and leave "upcoming", with their calendar links removed: Andaman 5, SDG 30, OECD 19. On the home pages, the calendars for main Social 36, Transport 26 and Foreign 29 are removed the same way.

## Pages touched
- social/2569: index, sub-elderly
- transport/2569: index, sub-isantransit, sub-ridehail, sub-andamanport
- foreign/2569: index, sub-sdg, sub-oecd

For each of these pages the item changes:
- the target rows in DATA and in the page json, keeping live media;
- the target rows in the home SUBS list;
- TL and EZ calendar entries;
- SHARE_V and UPDATED.

It also copies 41 files (share pages, cards, .ics) and adds English lines (add-only) to the 2569 i18n-en.json of each committee: Social 12, Transport 63, Foreign 3.

Every other meeting on these pages was checked equal to live before the payload was made, ignoring download tokens, video host paths and Senate file sizes. Two things were left out on purpose because they are not live yet and belong to the video threads: the women 27/28 and elderly 25 videos.

## Checks
- Tested twice on a fresh copy of origin/main (13fd7d7f).
  - First run: 61 files changed, self-check OK.
  - Second run: no change.
  - After applying, every touched page equals a full scratch build of DATA, SUBS, TL, EZ and SHARE_V.
- Rendered in Thai and English on a phone viewport: 16 views, no script errors.
- Legal check: STOP 0, WARN 0, plus a human read. See LEGAL_CHECK below.

## Afterwards
- run_bundle.sh refreshes the home cards (hub_snap_sync) and the m/ pages (seo.py) as usual.
- Voice for the Nov summaries (Transport 26, ride-hail 3, Isan 4, and 141b's Isan 2/3) is to be recorded by the routine thread once this is live.

### ผลตรวจกฎหมายอัตโนมัติ: ไฟล์ข้อความ

2026-11-22 20:44 · STOP 0 · WARN 0 · อ้างอิง `legal/กฎหมายการประชุมคณะกรรมาธิการ_Committee-Law-Reference.md`

> เครื่องมือช่วยคัดกรองเท่านั้น ไม่แทนการอ่านของคน และไม่ใช่ความเห็นทางกฎหมาย STOP = ต้องแก้ก่อนเผยแพร่ · WARN = ให้คนอ่านแล้วตัดสิน

ไม่พบประเด็น

## Human read (22 Nov 2569)
- Sources: only documents with Rpublic = 1 on the fresh Senate lists (22 Nov ~20:15 UTC): notices 11225916, 11226520, 11216957, 11225635, 11226568 (11226576 is the same PDF); summaries 11216407, 11230998, 11216864; minutes 11216802 shown as a document link only (scanned, not summarised).
- Closed-meeting rules (cl.92 / cl.104): only what the Senate itself published; notices give the agenda only; no member's speech, vote or opinion is attributed.
- People: only the committee and subcommittee chairs, with full titles, as the documents name them. Not named: the senator who moved the elderly-fund motion, agency representatives, advisers, the private bus company in the Isan 4 summary, the airline operators in Transport 26, the private bodies and associations invited to Andaman 6, and the private-sector and employer organisations invited to SDG 31. Government agencies are named as the documents name them.
- Ride-hail 3: the summary is printed "ครั้งที่ 2" but dated 12 Nov 2569, which is meeting 3 on the Senate list; the page follows the list (noted in the content file).
- Tone: neutral, humble wording; numbers copied from the summaries; no judgement of any person, agency or company.
- Result: OK to publish.
