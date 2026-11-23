# 203_law30_summary_31

Owner: thread "Site: Add Law and Justice committee". Asked by the 3x-daily routine on 23 Nov 2569 at 11:52 UTC. The item number 203 was assigned by the routine. The Law video thread uses 204 for the meeting 30 post video, so 204 should run after 203.

**One self-contained file.** The payload is embedded in the .sh as base64 tar.gz, because the shared folder is over its cap.

## Senate list (fetched 23 Nov 2569, 11:55 UTC)

- **Main 30** (Wed 18 Nov 2569, MID 353872). New documents, both **Rpublic=1**:
  - "สรุปข่าว 30-2569.pdf" (summary, ref 11236372)
  - "ระเบียบวาระและเอกสารประกอบ.pdf" (agenda and supporting papers, ref 11236379; 102 pages, 61 MB)

  Both are now linked. The card's agenda text becomes an easy-read summary written from the Senate's summary:
  - Chair: พลตำรวจโท บุญจันทร์ นวลสาย. Time and place: 14.00, room 401.
  - The committee noted the progress of its 3 subcommittees and the working group on foreign investment and nominee structures.
  - It accepted 2 complaints for preliminary consideration. The first is about the slow revocation of an น.ส. 3 ก. land certificate. The second asks for an inquiry into a matter concerning วัดพระธาตุพนมวรมหาวิหาร. Both are written as allegations with no finding. No names are given, and nothing describes any person's conduct.
  - It accepted the issue of transferring housing ownership for Thai spouses of foreigners for preliminary consideration.
  - It agreed to invite agencies on 25 Nov about how laws and rules apply to the work of Thai airport officials.
  - Next meeting: Wed 25 Nov, 13.00, room 401.
- **Main 31** (Wed 25 Nov 2569, MID 354091): a new meeting with a date only and no documents yet.
  - It gets an upcoming date card and an all-day calendar file (cal/31.ics).

## How the edits are made

Surgical, JSON-level edits using the same engine as items 69, 119, 148 and 190:
- law/2569/index.html: DATA (30 and 31 only), EZ.cal (+31), SHARE_V and UPDATED.
- meetings.json.
- i18n-en.json: 25 missing keys only.
- Share pages and cards for 30 and 31, plus the QR code for 31. The QR code for 30 is unchanged because its link is the same.

Live "media" is kept, including meeting 30's pre video. audio/ is untouched, and the routine will re-record the listen voice for meeting 30. seo.py rebuilds m/30.html and m/31.html in the bundle. The item is idempotent and uses no git or network.

## Tests

Run on a fresh copy of hub main ccd52212 (#102):
- Two runs; the second is a no-op.
- hub_snap_sync --check: PASS.
- data_match: PASS (209 pages, 0 differences).
- footer_only_check: PASS (251 pages).
- seo --check: PASS.
- timeline_check: PASS.
- Legal check on the new text and the s/ and m/ pages: STOP 0, WARN 0.
- Playwright render of law/2569/index.html: card 30 shows the summary and the "สรุปผลการประชุม" link, and its pre video is still there. Meeting 31 shows as "นัดประชุมครั้งถัดไป · พุธ 25 พ.ย.".

STATUS: READY
