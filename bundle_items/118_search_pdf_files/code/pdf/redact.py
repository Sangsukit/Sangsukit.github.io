"""Make the PDF text safe to search and quote, using the project's legal rules (legal/legal_check.py):
 - names of private people and companies near complaint words (ผู้ร้อง, ร้องเรียน ...) become "บุคคลเอกชน" / "บริษัทเอกชน",
   so the search never makes a complainant or a company in a complaint findable by name
 - phone numbers, e-mail addresses, ID numbers become "[ข้อมูลติดต่อ]"
 - a summary page that still trips any STOP rule is marked not quotable (nq): it is searchable, but the page shows no excerpt
Usage: python3 redact.py cache.jsonl.gz cache_safe.jsonl.gz"""
import gzip, json, re, sys
sys.path.insert(0, "/mnt/project-files/legal")
import legal_check as LC

NAME = re.compile(LC.TITLE + r"\s?[ก-๙]{2,}(?:\s+[ก-๙]{2,})?")
COMPANY = re.compile(r"(?:บริษัท|ห้างหุ้นส่วน(?:จำกัด|สามัญ)?|หจก\.)\s?(?!เอกชน|แห่งหนึ่ง|หนึ่ง)[ก-๙A-Za-z0-9][ก-๙A-Za-z0-9 .,&()-]{1,60}?(?:จำกัด\s*(?:\(มหาชน\))?|จากัด\s*(?:\(มหาชน\))?|(?=[\s,]))")
PDATA = re.compile(r"(?<![\d.:])(0[2-9]\d?[- ]?\d{3}[- ]?\d{3,4})(?:\s*-\s*\d)?(?![\d.:])|\b\d{13}\b|\d-\d{4}-\d{5}-\d{2}-\d|[\w.+-]+@[\w-]+\.[\w.]+")
CTX = re.compile(LC.COMPLAINT_CTX)
OFFICE = re.compile(LC.OFFICE)
# no quote when a page trips a STOP rule, or a WARN rule about guilt, courts, summons or closed meetings (the page stays
# searchable; the reader opens the official file). MOCKING fires on ordinary words (ล้มเหลว, เเละ): left out.
NOQUOTE_WARN = ("GUILT_WORDS", "COURT_CASE", "SUMMON_PRESSURE", "CLOSED_OR_UNRELEASED")
STOP_RULES = [r for r in LC.TEXT_RULES if (r[1] == "STOP" and r[0] != "MOCKING") or r[0] in NOQUOTE_WARN]

def near(text, a, b, rx, w):
    return rx.search(text[max(0, a - w):b + w])

def redact(page):
    flat = re.sub(r"\s*\n\s*", " ", page)          # PDF lines are short: judge the context across line breaks
    out, n = page, 0
    for m in NAME.finditer(flat):
        if near(flat, m.start(), m.end(), CTX, 160) and not near(flat, m.start(), m.end(), OFFICE, 45):
            for part in {m.group(0), re.sub(r"\s+", "\n", m.group(0), count=1)}:
                if part in out: out = out.replace(part, "บุคคลเอกชน"); n += 1
    for m in COMPANY.finditer(flat):
        if near(flat, m.start(), m.end(), CTX, 160):
            if m.group(0).strip() in out: out = out.replace(m.group(0).strip(), "บริษัทเอกชน"); n += 1
    approved = LC._approved_contacts()
    def pd(m): return m.group(0) if m.group(0).strip() in approved else "[ข้อมูลติดต่อ]"
    out2 = PDATA.sub(pd, out)
    if out2 != out: n += 1
    return out2, n

def quotable(page):
    return not LC.check_text(page, "x", rules=STOP_RULES)

def main(src, dst):
    st = {"files": 0, "pages_changed": 0, "pages_noquote": 0}
    with gzip.open(src, "rt", encoding="utf-8") as fi, gzip.open(dst, "wt", encoding="utf-8", compresslevel=9) as fo:
        for line in fi:
            if not line.strip(): continue
            r = json.loads(line); st["files"] += 1
            if r.get("pages"):
                new = []
                for p in r["pages"]:
                    q, n = redact(p); new.append(q)
                    if n: st["pages_changed"] += 1
                r["pages"] = new
                if r["k"] == "summary":
                    r["nq"] = [i for i, p in enumerate(new) if not quotable(p)]
                    st["pages_noquote"] += len(r["nq"])
            fo.write(json.dumps(r, ensure_ascii=False) + "\n")
    print(json.dumps(st))

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
