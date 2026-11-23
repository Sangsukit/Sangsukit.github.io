# 188 pa37_summary: Public Administration 2569, meeting 37/2569 (Wed 18 Nov 2569) summary

Owner: thread "Site: run the meeting archive" (23 Nov 2569 Bangkok). Asked by the auto-update thread (relay 23 Nov 05:52 UTC):
main 37 summary ref 11232488 "ครั้งที่ 37.pdf". Routine content update under AUTO UPDATES (Sukit confirmed 11 Nov 12:28 UTC).
No design change, no flag change. The listen-button voice follows later from the auto-update thread.

## SELF-CONTAINED (shared folder over its cap)
The .sh carries its whole payload (s/37.html, the new card, data entry, 18 English lines; base64 tar.gz, ~0.12 MB) at the end.
There is NO payload folder for this item. Needs only $A69. Touches no other repo.

## Source check
- Rpublic = 1 (Senate list for cid 79731 fetched 23 Nov 2569 ~05:55 UTC, RType สรุปผลการประชุม, 3 pages, 3,487,213 bytes).
- Heading reads "ครั้งที่ 37/2569", chair นายธวัช สุระบาล. The release text says "เมื่อวันที่ 19 พฤศจิกายน 2569", but the Senate
  list (MSDate 2026-11-18) and the notice for meeting 38 (ว 1057: "รับรองบันทึกการประชุม ครั้งที่ 37/2569 วันพุธที่ 18 พ.ย. 2569")
  both say Wed 18 Nov, so the card keeps 18 Nov and never shows 19 (internal_note in content_37_40.py).

## What goes live (committee-archive-2569 = A69)
- Meeting 37 card: the "upcoming" agenda card becomes the summary. Headline "ร่าง พ.ร.บ.ความรุนแรงในครอบครัว: ข้อเสนอแนะ 5 ด้าน
  (มาตรา 6–15) และผลงานคณะอนุกรรมาธิการ 3 คณะ"; a plain summary; 6 items with resolutions:
  1) complaint asking for a fact-check on state land in the 4th Army Area: letter to the Treasury Department (Royal Decree progress);
  2) complaint asking for a check of village-head candidates' qualifications, Mueang Phang Nga: progress noted;
  3) central and regional subcommittee (specific town plans, urban conservation; Nong Chok road lines Kh.2/Kh.3): noted;
  4) development subcommittee (20 Nov seminar on the facilitation act, name as the summary writes it): noted;
  5) disaster subcommittee (disaster education and school safety): noted;
  6) draft Domestic Violence Act, sections 6–15, observations and recommendations in 5 areas.
  Summary PDF link (with size) added; 13.00 and CA 426 kept; live media (pre-meeting video) kept.
- Timeline: the "นัดประชุมครั้งที่ 37/2569" planned entry is removed (meeting held), as was done for 36.
- Share page `s/37.html` (replaced only if it is the live version this item was built on) + card `img/s/37-aba30d59.jpg`, SHARE_V 37.
- `s/v-37-pre.html`: its 2 descriptions use the meeting headline (as v-36-pre does after the 36 summary).
- English: 18 new lines in `A69/i18n-en.json` (add-only; also in the private en.json cache, 11892).
- Home page / m/37.html / search index: nothing in this item. run_bundle.sh's hub_snap_sync.py refreshes the PA 2569 snapshot
  (tested: "1 updated", then --check PASS); seo.py bundle rewrites m/37.html and the search step re-indexes from DATA.

## Repos / paths touched
A69 edited: index.html (lines DATA, TL, SHARE_V, UPDATED only), meetings.json, s/37.html, s/v-37-pre.html, i18n-en.json.
A69 new: img/s/37-aba30d59.jpg (refuses to overwrite a different file of the same name). HUB/A67/A68: none. site_flags.py: none.

## Shared build sources: NOT in the shared folder (writes are lost while it is over its cap)
The shared folder silently reverted my earlier edits for item 164 (content_37_40.py has no M[38]; central 32, dev 17, timeline 38,
doc sizes and notice texts are gone). A full rebuild from the shared sources would therefore drop live cards 38, central 32 and dev 17,
and this item's 37 summary. The branch carries `bundle_items/188_build_sources.patch` (diff -ruN against the shared folder as it is now:
content_37_40.py M[37] summary + M[38], timeline.py 37 out / 38 in, sub_content/central.py 32, sub_content/dev.py 17,
doc_sizes.json +4, txt/37_summary.txt, txt/38_notice.txt, sub_txt/central/32_notice.txt, sub_txt/dev/17_notice.txt).
Apply from /mnt/project-files/archive with `patch -p1 --dry-run < 188_build_sources.patch` first, once the folder accepts writes.

## Checks
- Legal: legal_check.py text STOP 0, WARN 0 on every new Thai and English text (card, share page, video page description,
  English lines). Only the published summary and the Senate list are used (cl.92 / cl.104). Names: the committee chair only (senator).
  Agencies named (Treasury Department, Ministry of Finance; the House ad hoc committee). No complainants, candidates, private parties
  or non-office-holders; complaints are worded as requests to check facts. No emblem.
- Test on fresh clones of main (archive 6c6981a #72, hub b2594e0a): exit 0, 5 files edited + 1 new; second run "changed 0 files".
  Only meeting 37 differs in DATA and meetings.json; TL lost only the 37 planned entry; SHARE_V only 37; no English line changed.
  data_match.py PASS (223 pages). hub_snap_sync --check PASS after the sync. timeline_check.js PASS on the main page.
- Phone 390x844, Thai and ?lang=en: main page, #read-37 reading view, home, s/37.html, s/v-37-pre.html: no page errors,
  no sideways scroll, nothing stuck on "กำลังโหลด"; the reading view shows the new headline, summary and resolutions in both languages.

## Depends on / notes
- Independent of other items. If a post-meeting video item for 37 runs first, this item keeps the `media` it finds.
- Listen-button voice: to be recorded from the new reading text by the auto-update thread after this is live.

STATUS: READY
