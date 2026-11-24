# 208_mil_summaries_1124

STATUS: READY

Thread: "Site: Build Military committee archive". Asked by the 3x-daily routine on 24 Nov 2569, which reserved number 208.

## What it does

This is a Military 2569 update that only changes data, with no design change. It runs surgically on live `military/2569/`.

All Senate documents used have Rpublic=1, and their meeting numbers and dates were checked.

| Meeting | Date | Document | Change |
|---|---|---|---|
| Main committee 29 | Thu 5 Nov 2569 | summary ref 11244987, minutes ref 11244974 | Agenda card becomes an easy-read summary. The chair shown is นายวิรัตน์ รักษ์พันธ์ (vice-chair 2, presiding), as in the minutes. |
| Main committee 30 | Thu 12 Nov | summary ref 11244991 | Upcoming card becomes a summary. |
| Main committee 31 | Thu 19 Nov | summary ref 11244997 | Upcoming card becomes a summary. The agenda doc and pre video are kept. |
| Military-affairs subcommittee 32 | Wed 18 Nov | press summary ref 11244915 | Agenda card becomes a summary. The live pre video is kept. |

Files touched:

- `index.html` and `meetings.json`: DATA swap with live `media` kept, plus SHARE_V for 29–31, EZ.cal, TL, UPDATED and SUBS (military only).
- `sub-military.html` and `.json`: the same changes for meeting 32.
- `i18n-en.json`: 43 English lines, added only (Gregorian years).
- Share pages and images: `s/29.html`, `s/30.html`, `s/31.html`, `s/military-32.html`, with new cards and QR codes.
- Meeting pages: `meeting_pages.py` refreshes `m/NN.html`. It uses $BUILD, or the copy embedded in the item.

The item is self-contained: the payload is embedded as a base64 tar.gz after `__PAYLOAD_BELOW__`. It needs `$HUB` and makes no git or network calls.

## Content and legal

- Wording is easy-read and respectful. Complaints are written as allegations ("กล่าวอ้าง" / "complaint").
- No private person, petitioner or foundation is named. This covers sub-military 32 item 1 and main 31 item 3.3(4), which are left unnamed.
- No contact details, staff names or signatory appear.
- Security topics stay at overview level.
- The royal-ceremony note in main 30 is left out on purpose, so no royal wording needs an approver.
- The source misprint "19 ม.ค. 2569" for the seminar is written as 2570. This matches the sub-military 32 paper and the live sub-military 31 card.
- `legal_check.py` on the Thai text and on the English text: STOP 0, WARN 0.

## Tests

The tests ran on a worktree of origin/main at 80ae0a16:

- Run 1 changed 5 data files plus the share and meeting pages.
- Run 2 changed 0 files, and the diff md5 was identical.
- `data_match`: PASS (209 pages, 0 differences).
- Phone check (iPhone 13) in Thai and English: #read-29, #read-31, sub-military #read-32 and m/30. The new text, minutes and summary links all show, with no JS errors.

## After live

The 3x-daily routine records the listen voices for main 29, 30 and 31. The sub 32 voice waits until 12 Dec. Post-meeting videos are for the video thread.
