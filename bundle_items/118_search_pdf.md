# 118 search_pdf: search inside official Senate PDF documents
Owner: thread "Site: Upgrade search into research engine". Ready 22 Nov 2569 ~22:45 UTC.
- What: /search/ also finds words inside the public PDF files the site links (summaries the site has no text for, minutes,
  meeting documents). Meeting cards get "พบคำค้นในเอกสารต้นฉบับ: บันทึกการประชุม หน้า N" linking to the Senate original
  at that page (no copies hosted). Quotes only from official summary PDFs after redaction (pdf/redact.py).
- Self-contained: 118_search_pdf.sh + 118_search_pdf_files/ (code/ -> archive/search, payload/x + manifest_x.json -> $HUB/search/idx).
  Changes only $HUB/search/ (app.js, engine.js, index.html, idx/manifest.json, new idx/x/ ~41 MB, 3,215 files) + archive/search code. Hub 788 -> ~830 MB.
- Built on the live sites of 22 Nov (hub 13fd7d7f): 2,592 PDFs indexed (summary 1,126, minutes 472, doc 992, brief 2).
- Tested 22 Nov from the OLD archive/search code on a fresh copy of live hub 13fd7d7f: same output as the reviewed build, second run 0 changes, ordinary rebuild after it 0 changes.
- Tests 22 Nov: eval P@5 0.895 MRR 0.956 nDCG 0.905 (unchanged), zero tests flagged 2/2; PDF known-item 9/12 in top 10;
  ux_guard /search/ + home PASS 0; phone check (results + PDF page links) no script errors; slow phone 1.4-2.8 s.

- Legal: archive/search/LEGAL_CHECK_PDF.md on all quotable summary text: STOP 6 = MOCKING false alarms only
  (startup "ล้มเหลว" failure-rate wording in research context; the typo "เเละ"), WARN = ROYAL/SELF_PROMOTION on official text.
  Same as the 16 Nov check reviewed with the preview. Page wording: STOP 0 / WARN 0.
- Rollback: revert the hub commit (idx/x/ goes with it; the page falls back to "PDF text not searched").
- Weekly refresh: owner thread runs pdf/refresh.sh (needs pis.parliament.go.th) and hands in a new x/ payload item each week.

Approval: Sukit chose "Go live, refresh weekly" on 22 Nov 2569 22:22 UTC (review copy https://claude.ai/artifact/SujiQ83wTKtUt5ikaRXzxm).

STATUS: READY
