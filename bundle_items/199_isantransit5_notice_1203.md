# Bundle item 199_isantransit5_notice_1203

**Thread:** Site: Add Transport and Foreign Affairs committees · **Asked by:** Site: Update automatically three times a day (18:51 Bangkok check, 23 Nov 2569)

## What it does
- Transport, Isan transit subcommittee meeting 5/2569: **Thursday 3 December 2569, 09.30, room 202 floor 2, Parliament House** (notice ว1052, ref 11236134, Rpublic = 1). New next-meeting card in Thai and English, share page + card, calendar (.ics / Google).
- The notice says the subcommittee decided not to meet on Wed 25 Nov 2569. The Senate never listed a 25 Nov meeting and the live site never showed one, so nothing is removed.
- Agenda: lessons on public bus management in Chiang Mai, Khon Kaen and Phuket. The invited companies are not named.

## Changes (surgical, idempotent, no git, no network; needs $HUB)
- transport/2569/sub-isantransit.html: DATA row 5, TL, EZ calendar, SHARE_V, UPDATED
- transport/2569/sub-isantransit.json: row 5
- transport/2569/index.html: home SUBS list row 5 (isantransit)
- new: transport/2569/s/isantransit-5.html, transport/2569/img/s/isantransit-5-f00867b0.jpg, transport/2569/cal-sub/isantransit/5.ics
- transport/2569/i18n-en.json: 3 English lines added (add-only)

## Order
Item 200 (Transport video thread, PRE video for 3 Dec) fills row 5's media and must run after this item.

## Tests
- Sandbox (hubtest at origin/main ccd52212): applied twice, second run "changed 0 files"; self-check OK; page json equals DATA; every other meeting equals live; no browser errors (Thai and English), card shows "พฤหัสฯ 3 ธ.ค. · นัดประชุมครั้งถัดไป · ครั้งที่ 5/2569 · 09.30".
- Legal check STOP 0 / WARN 0, plus human read (below).

## Note (not changed by this item)
The fresh Senate list shows 16 members for this subcommittee; the live home list says 13 (fetched 13 Nov). Left for the routine thread to decide.

.sh md5: 3313bb71af34d3256abb33f79008421f

# ผลตรวจกฎหมายอัตโนมัติ: ไฟล์ข้อความ

2026-11-23 12:10 · STOP 0 · WARN 0 · อ้างอิง `legal/กฎหมายการประชุมคณะกรรมาธิการ_Committee-Law-Reference.md`

> เครื่องมือช่วยคัดกรองเท่านั้น ไม่แทนการอ่านของคน และไม่ใช่ความเห็นทางกฎหมาย STOP = ต้องแก้ก่อนเผยแพร่ · WARN = ให้คนอ่านแล้วตัดสิน

ไม่พบประเด็น

## Human read (23 Nov 2569)
- Source: Senate notice ว1052 "งดและนัดประชุม" for the Isan transit subcommittee, ref 11236134, Rpublic = 1 on the fresh Senate list (23 Nov ~11:55 UTC). Only what the notice states: date, time, room, agenda item 3, and that the 18 Nov meeting decided not to meet on 25 Nov.
- cl.92 / cl.104: a meeting notice the Senate itself publishes; no closed-meeting content, no minutes, no opinions.
- Names: no person is named. The three invited companies (Phuket, Chiang Mai, Khon Kaen bus operators) are not named; written as "public bus operators in the three provinces". The official who signed the notice is not named. The reason given for not meeting on 25 Nov (members' other duties) is left out, so no member is implied to be absent.
- Tone: neutral, plain, deferential; no judgement of any agency or person. English matches Thai.
