# 150_mil_1122_update — Military: main 32 + holistic 22 cards, cyber 26 + sub-military 31 summaries, main 31 agenda link

Committee: คณะกรรมาธิการการทหารและความมั่นคงของรัฐ (military/2569/, sub-holistic, sub-cyber, sub-military)
Owner thread: "Site: Build Military committee archive". Requested by the 3x-daily routine (22 Nov 2569 20:09 UTC).
Type: routine content (AUTO UPDATES). No design change. SELF-CONTAINED: payload embedded at the end of the .sh.

## What changes (all Senate documents checked Rpublic=1 in the source data, 22 Nov 20:13 UTC)
- Main 32 (Tue 24 Nov 2569, 14.30, room 301 ชั้น 3 ฝั่งวุฒิสภา; called as an urgent meeting), notice ref 11225702:
  upcoming card. Main item 3.1: framework for a holistic study on resolving the southern unrest; 3.2-3.5 carried over.
- Main 31 (19 Nov): agenda PDF ref 11207571 added as "เอกสารประกอบ" (replaces item 147, which never went live).
- Holistic 22 (Wed 25 Nov 2569, 09.00, CA 327), notice ref 11225951: upcoming card (agenda only); border security,
  Thep Satri Task Force and Chanthaburi-Trat Border Defence Command invited.
- Cyber 26 (18 Nov), summary ref 11216786: agenda card becomes a summary (government agencies on the defence industry
  ecosystem). Chair as printed: นายไชยยงค์ มณีรุ่งสกุล. Pre-meeting video kept.
- Sub-military 31 (11 Nov), summary ref 11216766: agenda card becomes a summary. Chair: ผู้ช่วยศาสตราจารย์นิฟาริด ระเด่นอาหมัด.
  The private petitioner named in the summary is NOT named; the royal-project land item is left out.
- English: 22 new lines, add-only into i18n-en.json (also merged into archive/i18n/en.json). Gregorian years.
- Lines touched: index.html (DATA 31 docs + 32, TL, EZ.cal, SHARE_V/QR 32, SUBS military/holistic/cyber, UPDATED);
  meetings.json; sub-holistic/sub-cyber/sub-military .html (DATA, TL, EZ.cal, SHARE, UPDATED) + .json; i18n-en.json.
  Files: cal/32.ics, cal-sub/holistic/22.ics, s/32.html, s/holistic-22.html, s/cyber-26.html, s/military-31.html + cards/QR.
  Live "media" kept everywhere (videos stay). Home cards: run_bundle.sh (hub_snap_sync.py).

## Tests (worktree of hub origin/main 13fd7d7f)
- Ran twice: "150_mil_1122_update OK" both times; second run changes 0 files (idempotent, same git diff md5).
- Browser (iPhone 13), Thai and English (arch-lang=en): main #read-32, #read-31, holistic #read-22, cyber #read-26,
  sub-military #read-31 all open with the new text; English view shows the new lines (only the auto tallies stay Thai,
  same as live). JS errors: none.

## Legal
- legal_check.py on all new Thai text + English lines: STOP 0 · WARN 0 (report bundle_2569-11-22/LEGAL_CHECK.md).
- No phone, email or signatory name (asserted in the item). No private names. "ศึกษาข้อเท็จจริง", never "สอบสวน".

## Run
HUB=<staging hub> bash 150_mil_1122_update.sh   (prints "150_mil_1122_update OK")

Depends on: nothing. Videos (pre main 32, pre holistic 22, post cyber 26, post sub-military 31) come as a later item.
After live: tell the routine thread (listen voice for sub-military 31 and cyber 26).

STATUS: READY
