# English for the page lines of the Transport site that are not meeting summaries (names, captions, titles).
# tools/make_i18n.py adds these to committees/transport/i18n_en.json, together with patterns it builds itself
# (subcommittee page titles, timelines, document titles, senators' names from i18n/senators_th_en.json).
# Keys are normalised Thai (numbers -> {0}, {1}...); {n|ce} shows a Buddhist-era year as the Gregorian year.
EN_NAME = "Committee on Transportation"
SHORT = {
    "การกำกับดูแลรถรับจ้างสาธารณะผ่านแอปพลิเคชัน": "Oversight of Ride-Hailing Apps",
    "ระบบขนส่งสาธารณะในเมืองหลักภาคตะวันออกเฉียงเหนือ": "Public Transport in the Main Cities of the Northeast",
    "ท่าเรือน้ำลึกฝั่งอันดามันสู่ท่าเรืออัจฉริยะ (Smart Port)": "Andaman Deep-Sea Ports as Smart Ports",
    "ความปลอดภัยในการก่อสร้างโครงสร้างพื้นฐานทางบกและทางราง": "Safety in Building Land and Rail Infrastructure",
    "ระบบขนส่งและโลจิสติกส์ด้วยนวัตกรรมและเทคโนโลยีดิจิทัล": "Transport and Logistics with Digital Technology",
    "เทคโนโลยีอากาศยานซึ่งไม่มีนักบิน": "Unmanned Aircraft Technology",
    "การป้องกันและลดอุบัติเหตุด้านการคมนาคม": "Preventing and Reducing Transport Accidents",
    "รถไฟความเร็วสูงเชื่อมสามสนามบิน และรถไฟความเร็วสูงไทย - จีน": "High-Speed Railway Linking Three Airports and Thai–Chinese High-Speed Railway",
    "การขนส่งทางน้ำและพาณิชยนาวี": "Water Transport and Merchant Marine",
    "กฎหมายและเรื่องร้องเรียนด้านการคมนาคม": "Transport Laws and Complaints",
    "โครงสร้างพื้นฐานทางบกและทางราง": "Land and Rail Infrastructure",
    "โครงสร้างพื้นฐานทางน้ำและทางอากาศ": "Water and Air Infrastructure",
}
ENDED = ("(ยุติการพิจารณา)", "(consideration ended)")
HAND = {
    "คณะกรรมาธิการการคมนาคม": "Committee on Transportation",
    "คณะกรรมาธิการการคมนาคม วุฒิสภา": "Senate Committee on Transportation",
    "ประธานคณะอนุกรรมาธิการ · ปี {0} · คณะปัจจุบัน": "Chair of the subcommittee · {0|ce} · current subcommittee",
    "ประธานคณะอนุกรรมาธิการ · ปี {0}–{1} · คณะปัจจุบัน": "Chair of the subcommittee · {0|ce}–{1|ce} · current subcommittee",
    "ประธานคณะอนุกรรมาธิการ · ปี {0}–{1} · ยุติการพิจารณาแล้ว": "Chair of the subcommittee · {0|ce}–{1|ce} · work ended",
    "ประธานคณะอนุกรรมาธิการ · ปี {0} · ยุติการพิจารณาแล้ว": "Chair of the subcommittee · {0|ce} · work ended",
    "ประธานคณะกรรมาธิการตลอดปี {0}": "Chair of the committee throughout {0|ce}",
    "ประธานคณะกรรมาธิการ ปี {0} · ได้รับเลือก {1} ก.ย. {2}": "Chair of the committee, {0|ce} · elected {1} September {2|ce}",
    "ประธานคณะกรรมาธิการ (ได้รับเลือก {0} ก.ย. {1})": "Chair of the committee (elected {0} September {1|ce})",
    "คณะกรรมาธิการคือคณะของสมาชิกวุฒิสภาที่ทำงานเฉพาะด้าน คณะกรรมาธิการการคมนาคมดูแลเรื่องการเดินทางและการขนส่งทั้งทางถนน ราง น้ำ และอากาศ เช่น รถไฟ รถไฟฟ้า สนามบิน ท่าเรือ ความปลอดภัยบนท้องถนนและในงานก่อสร้าง และระบบโลจิสติกส์ โดยเชิญหน่วยงานรัฐมาชี้แจง ศึกษาร่างกฎหมายด้านคมนาคม ลงพื้นที่ และเสนอแนะต่อรัฐบาลและวุฒิสภา":
        "A committee is a group of senators who work on a particular area. The Committee on Transportation looks after travel and transport by road, rail, water and air, such as railways, electric trains, airports, ports, safety on the roads and in construction, and logistics. It invites state agencies to explain, studies transport bills, visits the areas concerned and makes recommendations to the government and the Senate",
    "คณะกรรมาธิการการคมนาคมดูแลเรื่องการเดินทางและการขนส่งทั้งทางถนน ราง น้ำ และอากาศ เช่น รถไฟ รถไฟฟ้า สนามบิน ท่าเรือ ความปลอดภัยบนท้องถนนและในงานก่อสร้าง และระบบโลจิสติกส์ โดยเชิญหน่วยงานรัฐมาชี้แจง ศึกษาร่างกฎหมายด้านคมนาคม ลงพื้นที่ และเสนอแนะต่อรัฐบาลและวุฒิสภา":
        "The Committee on Transportation looks after travel and transport by road, rail, water and air, such as railways, electric trains, airports, ports, safety on the roads and in construction, and logistics. It invites state agencies to explain, studies transport bills, visits the areas concerned and makes recommendations to the government and the Senate",
    "พิจารณาร่างพระราชบัญญัติ กระทำกิจการ พิจารณาสอบหาข้อเท็จจริง หรือศึกษาเรื่องใด ๆ ที่เกี่ยวกับการคมนาคม ทั้งการจราจรทางบก ทางน้ำ ทางอากาศ ทางอวกาศ การขนส่งมวลชน การพาณิชยนาวี ระบบโลจิสติกส์ โครงสร้างพื้นฐานด้านการคมนาคม และอื่น ๆ ที่เกี่ยวข้อง":
        "To consider bills, carry out activities, conduct fact-finding or study any matter concerning transport, including traffic on land, on water, in the air and in space, mass transit, the merchant marine, logistics systems, transport infrastructure, and other related matters",
}
NAMES = {}
FULL = "Committee on Transportation"
HAND.update({
    "กมธ.การคมนาคม วุฒิสภา · สรุปการประชุม ปี {0} · ParliamentX": "Senate Committee on Transportation · Meeting summaries {0|ce} · ParliamentX",
    "ตำแหน่ง: รองประธานคณะกรรมาธิการ คนที่สอง และโฆษกคณะกรรมาธิการ": "Position: Second Vice-Chair and Spokesperson of the committee",
    "คณะกรรมาธิการการเศรษฐกิจ การเงิน และการคลัง": "Committee on Economy, Monetary Affairs and Finance",
    "คณะอนุกรรมาธิการในคณะกรรมาธิการการบริหารราชการแผ่นดิน": "Subcommittee under the Committee on Public Administration",
    "คณะกรรมาธิการการพาณิชย์และการอุตสาหกรรม วุฒิสภา": "Senate Committee on Commerce and Industry",
    "คณะอนุกรรมาธิการในคณะกรรมาธิการการพาณิชย์และการอุตสาหกรรม วุฒิสภา": "Subcommittee under the Senate Committee on Commerce and Industry",
    "คณะอนุกรรมาธิการพิจารณาศึกษาแนวทางและมาตรการช่วยเหลือ SMEs ระยะเร่งด่วนและการยกระดับสู่ผู้ประกอบการที่เข้มแข็ง แข่งขันได้ และเติบโตอย่างยั่งยืน":
        "Subcommittee to Study Urgent Measures to Help SMEs and Raise Them into Strong, Competitive and Sustainably Growing Businesses",
    "เรื่องเดียวกัน: Seaplane · ครั้งที่ {0} · {1} ต.ค. {2}": "Same topic: seaplanes · Meeting {0} · {1} Oct {2|ce}",
    "ห้องประชุมกรรมาธิการ CB{0} ชั้น {1} อาคารรัฐสภา": "Committee meeting room CB{0}, Floor {1}, Parliament House",
    "สรุปการประชุมของคณะอนุกรรมาธิการศึกษาโครงการรถไฟความเร็วสูงเชื่อมสามสนามบิน และโครงการรถไฟความเร็วสูงไทย - จีน ระยะที่ {0} (กรุงเทพมหานคร - นครราชสีมา) ซึ่งคณะกรรมาธิการการคมนาคม วุฒิสภา ตั้งขึ้นเพื่อช่วยศึกษาเรื่องเฉพาะด้าน ทุกครั้งที่เผยแพร่ พร้อมเอกสารต้นฉบับ เลือกได้เลยว่าต้องการทำอะไร":
        "Summaries of every published meeting of the Subcommittee to Study the High-Speed Railway Linking Three Airports and Phase {0} of the Thai–Chinese High-Speed Railway (Bangkok–Nakhon Ratchasima), set up by the Senate Committee on Transportation to help study a particular area, with the original documents. Choose what you would like to do",
    "ไทม์ไลน์คณะอนุกรรมาธิการศึกษาโครงการรถไฟความเร็วสูงเชื่อมสามสนามบิน และโครงการรถไฟความเร็วสูงไทย - จีน ระยะที่ {0} (กรุงเทพมหานคร - นครราชสีมา)":
        "Timeline of the Subcommittee to Study the High-Speed Railway Linking Three Airports and Phase {0} of the Thai–Chinese High-Speed Railway (Bangkok–Nakhon Ratchasima)",
    "ประธานคณะอนุกรรมาธิการศึกษาโครงการรถไฟความเร็วสูงเชื่อมสามสนามบิน และโครงการรถไฟความเร็วสูงไทย - จีน ระยะที่ {0} (กรุงเทพมหานคร - นครราชสีมา)":
        "Chair of the Subcommittee to Study the High-Speed Railway Linking Three Airports and Phase {0} of the Thai–Chinese High-Speed Railway (Bangkok–Nakhon Ratchasima)",
})
for _th, _en in SHORT.items():
    for _a, _b in ((_th, _en), (_th + " " + ENDED[0], _en + " " + ENDED[1])):
        HAND["คณะอนุกรรมาธิการ" + _a + " วุฒิสภา · สรุปการประชุม ปี {0} · ParliamentX"] = "Senate Subcommittee on " + _b + " · Meeting summaries {0|ce} · ParliamentX"
