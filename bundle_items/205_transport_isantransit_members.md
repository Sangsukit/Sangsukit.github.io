# Bundle item 205_transport_isantransit_members

**Thread:** Site: Add Transport and Foreign Affairs committees · **Asked by:** Site: Update automatically three times a day (23 Nov 2569)

**Needs Sukit's OK before publishing** (members.py rule 6: member-list changes need legal check + Sukit's OK).

## What changed on the Senate lists (fetched 23 Nov 2569 ~12:13 UTC)
- Transport committee, Andaman port and ride-hailing subcommittees: no change against the published list (13 Nov).
- Isan transit subcommittee: 16 people listed (was 13); senators 8 (was 5). Added, as the Senate lists them, from 11 Nov 2569:
  - นางณัฏฐินีภรณ์ จันทรโณทัย, อนุกรรมาธิการ
  - นางนงลักษณ์ ก้านเขียว, อนุกรรมาธิการ
  - นางสาวนิชาภา สุวรรณนาค, ที่ปรึกษาคณะอนุกรรมาธิการ
- Chair unchanged: นางธารนี ปรีดาสันติ์. Nobody removed. Non-senators (6 members, 2 advisers) counted only.

## Changes (surgical, idempotent, no git, no network; needs $HUB)
- transport/2569/index.html: MEMBERS isantransit group and list date (23 Nov 2569), SUBS member count 13 -> 16, XSHARE version of the members card
- transport/2569/share/members-isantransit.html: "5 ท่าน" -> "8 ท่าน", card version (the page's other layers stay)
- new: transport/2569/img/share/members-isantransit-c2defa75.jpg, transport/2569/img/m/25691109_115149.jpg (official portrait)
- Independent of items 199 and 200 (tested in both orders).

## Tests
- hubtest at origin/main ccd52212: alone and on top of 199, each applied twice (second run changed 0 files), self-check OK; MEMBERS equals a full engine build from the fresh list; Thai and English members panel render with no errors and no broken portraits ("สว. 8 ท่าน", "ณ 23 พฤศจิกายน 2569").
- Legal check STOP 0 / WARN 0, plus human read below.

.sh md5: a4aebb3c8cf9ba139d9d7b853155ad32

# ผลตรวจกฎหมายอัตโนมัติ: ไฟล์ข้อความ

2026-11-23 12:20 · STOP 0 · WARN 0 · อ้างอิง `legal/กฎหมายการประชุมคณะกรรมาธิการ_Committee-Law-Reference.md`

> เครื่องมือช่วยคัดกรองเท่านั้น ไม่แทนการอ่านของคน และไม่ใช่ความเห็นทางกฎหมาย STOP = ต้องแก้ก่อนเผยแพร่ · WARN = ให้คนอ่านแล้วตัดสิน

ไม่พบประเด็น

## Human read (23 Nov 2569)
- Source: the senate.go.th subcommittee page (scid 85211, loadMemberJson) and the senators directory (200 senators), fetched 23 Nov 2569 ~12:13 UTC; checked with members.py (rules in its header, legal reference section 7A).
- Only senators are named, each with title, name and position exactly as the Senate page lists them; the 8 non-senators are counted only. Official directory portrait only (1 new: นางนงลักษณ์ ก้านเขียว), resized, not cropped.
- No reason, date guess or comment about why anyone joined; positions only. The chair is unchanged. Nobody is removed.
- English: names come from the site's existing English name list (the same spellings already live elsewhere on the site); นางนงลักษณ์ ก้านเขียว has no senator-profile entry yet, so no "About this senator" link for her; the weekly people check can add it.
- members.py rule 6: member-list changes need Sukit's OK before they are published.
