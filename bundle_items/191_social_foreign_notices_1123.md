# 191_social_foreign_notices_1123

Thread "Site: Add Transport and Foreign Affairs committees", 23 Nov 2569. Asked by "Site: Update automatically three times a day" (05:51 UTC check). Women 29 meets on 24 Nov, so please run this item early.

**One self-contained file.** `191_social_foreign_notices_1123.sh` carries its payload inside (base64 tar.gz, sha256 checked). Run it with `HUB=<hub> bash 191_social_foreign_notices_1123.sh`. It is idempotent, uses no git and no network, and prints "OK" after its self-check.

| Committee | Meeting | Source (Rpublic = 1) | Shown as |
|---|---|---|---|
| Social: women's sub | 29, Tue 24 Nov 2569 09.00, room 201 floor 2 + online | notice ว1190, ref 11235014 | next meeting: work plan for the next stage |
| Foreign Affairs | main 30, Wed 25 Nov 2569 13.30, CA 428 floor 4 | notice ว1070, ref 11235113 | next meeting: consideration of foreign affairs |
| Social | main 36, 19 Nov | (no summary published yet) | upcoming → agenda_only ("from the meeting notice; the Senate has not yet published the summary") |
| Foreign Affairs | main 29, 18 Nov | (no summary published yet) | upcoming → agenda_only, like 26-28 |

Pages touched: social/2569/index (row 36; SUBS women 29), social/2569/sub-women (row 29, TL, calendar) and foreign/2569/index (rows 30 and 29, calendar). On each, the item changes DATA plus the page json (keeping live media, such as the live 36 and 29 pre-meeting videos), SHARE_V and UPDATED.

It copies 10 files:
- 4 rebuilt share pages and their cards
- women 29 .ics
- Foreign 30 .ics

It also adds 3 English lines to social/2569/i18n-en.json (add-only). Every other meeting on these pages was checked equal to live, apart from video media added by other items and Senate file sizes. Neither of those is touched.

**Checks:**
- Tested twice on a fresh copy of origin/main 06ae3e32: the first run changed 17 files, the second changed nothing.
- The target rows equal a scratch build, and the other rows are byte-identical to live.
- Thai and English render with no script errors.
- Legal check: STOP 0, WARN 0, plus a human read (below).

### ผลตรวจกฎหมายอัตโนมัติ: ไฟล์ข้อความ

2026-11-23 06:05 · STOP 0 · WARN 0 · อ้างอิง `legal/กฎหมายการประชุมคณะกรรมาธิการ_Committee-Law-Reference.md`

> เครื่องมือช่วยคัดกรองเท่านั้น ไม่แทนการอ่านของคน และไม่ใช่ความเห็นทางกฎหมาย STOP = ต้องแก้ก่อนเผยแพร่ · WARN = ให้คนอ่านแล้วตัดสิน

ไม่พบประเด็น

## Human read (23 Nov 2569)
- Sources: notices ว1190 (ref 11235014) and ว1070 (ref 11235113), both Rpublic = 1 on the fresh Senate lists (23 Nov ~06:00 UTC). Time and room read from each notice.
- Notices give the agenda only (cl.104); nothing from inside a closed meeting (cl.92). No person is named beyond the committee chair as listed; the officials who signed the notices are not named.
- Social 36 and Foreign 29: only a status change (past meeting, the Senate has not yet published a summary), with no new claims.
- Tone neutral. Result: OK to publish.
