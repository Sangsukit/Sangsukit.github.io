# 160 agri40_water21_livestock21 — three upcoming Agriculture meetings (main 40 is TODAY, Mon 23 Nov 2569)

Owner: Agriculture archive thread. Asked by "Site: Update automatically three times a day" (22 Nov 2569 20:09 UTC,
"URGENT first: main 40 is TOMORROW ... get its card (time, room, agenda) into the bundle tonight").
Routine content update (AUTO UPDATES rule). Please run in the next bundle; meeting 40 starts 14.00 Bangkok (07:00 UTC) 23 Nov.

## What changes (repo sangsukit.github.io only, path agriculture/2569/)
- New files: s/40.html, img/s/40-fcab4bd0.jpg, img/s/qr-40.svg, cal/40.ics; s/water-21.html, img/s/water-21-7f7b6dbb.jpg,
  img/s/qr-water-21.svg, cal-sub/water/21.ics; s/livestock-21.html, img/s/livestock-21-47de0200.jpg,
  img/s/qr-livestock-21.svg, cal-sub/livestock/21.ics (from a 22 Nov csite.py build, all usual flags on).
- index.html: DATA (+ meeting 40, newest first), SHARE_V (+40), EZ.cal (+40), SUBS (meeting 21 added to water and livestock), UPDATED.
- sub-water.html / sub-livestock.html: DATA (+21), SHARE_V (+21), EZ.cal (+21), TL (up-next plan entry now meeting 21), UPDATED.
- meetings.json, sub-water.json, sub-livestock.json: the new meeting added. i18n-en.json: 13 new English lines (also merged into
  archive/i18n/en.json). No other record changes (meeting 36 stays with item 146; 37/38/39 and livestock 20 come in a later item).

## Facts (Senate documents, all Rpublic=1)
- Main 40: notice ที่ สว (กมธ ๑) ๐๐๐๙/ว๑๐๔๕ (19 Nov 2569, ref 11217028): Mon 23 Nov 2569, 14.00, ห้องประชุมกรรมาธิการ CA 331
  ชั้น 3 อาคารรัฐสภา; agenda 5 = draft study report "การบริหารเครือข่ายระบบเกษตรครบวงจร ตามมาตรฐานสากลเพื่อสิ่งแวดล้อมและความยั่งยืน".
  (The 39 agenda said 15.00 for the next meeting; the later notice says 14.00, which is used.)
- Water 21: notice ว๑๐๔๒ (19 Nov, ref 11216382): Tue 24 Nov 2569, 14.00, CA 320 ชั้น 3; final draft study report to go to the Senate.
- Livestock 21: notice ว๑๐๔๑ (19 Nov, ref 11216523): Wed 25 Nov 2569, 14.00, CA 319 ชั้น 3; minutes 20/2569 + draft study report.
- Shown as agenda ("นัดประชุม"), not resolutions. Chair on main 40 = นายสุนทร เชาว์กิจค้า (as on 34–39).

## Checks (fresh worktree of origin/main 13fd7d7f with this item applied)
- legal_check.py archive agriculture/2569: STOP 0 · WARN 0.
- Rendered at 400 px, Thai and ?lang=en: main page, #read-40, sub-water, sub-livestock show date, 14.00, rooms CA 331/320/319,
  agenda text; no page errors.
- Idempotent: second run = no change.
- Independent of item 146 (different record); either order works.

## After it is live
- Tell "Site: Update automatically three times a day" (they asked) and the Agriculture thread.

Files come from GitHub branch claude/project-thread-c5tcxm (bundle_items/), or set ITEM_FILES to the _files folder.
Depends on: nothing.
STATUS: READY
