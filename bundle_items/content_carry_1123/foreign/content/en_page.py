# English for the page lines of the Foreign Affairs site that are not meeting summaries (names, captions, titles).
# tools/make_i18n.py adds these to committees/foreign/i18n_en.json, together with patterns it builds itself
# (subcommittee page titles, timelines, document titles, senators' names from i18n/senators_th_en.json).
# Keys are normalised Thai (numbers -> {0}, {1}...); {n|ce} shows a Buddhist-era year as the Gregorian year.
EN_NAME = "Committee on Foreign Affairs"
SHORT = {
    "พันธกรณีระหว่างประเทศ การพัฒนาที่ยั่งยืน และความตกลงทางการค้า": "International Obligations, Sustainable Development and Trade Agreements",
    "การเข้าเป็นสมาชิก OECD ของประเทศไทย": "Thailand's OECD Membership",
    "ความร่วมมือระหว่างประเทศด้านเศรษฐกิจ การค้า การลงทุน และแรงงาน": "International Cooperation on Economy, Trade, Investment and Labour",
}
ENDED = ("(ยุติการพิจารณา)", "(consideration ended)")
HAND = {
    "คณะกรรมาธิการการต่างประเทศ": "Committee on Foreign Affairs",
    "คณะกรรมาธิการการต่างประเทศ วุฒิสภา": "Senate Committee on Foreign Affairs",
    "ประธานคณะอนุกรรมาธิการ · ปี {0} · คณะปัจจุบัน": "Chair of the subcommittee · {0|ce} · current subcommittee",
    "ประธานคณะอนุกรรมาธิการ · ปี {0}–{1} · คณะปัจจุบัน": "Chair of the subcommittee · {0|ce}–{1|ce} · current subcommittee",
    "ประธานคณะอนุกรรมาธิการ · ปี {0}–{1} · ยุติการพิจารณาแล้ว": "Chair of the subcommittee · {0|ce}–{1|ce} · work ended",
    "ประธานคณะอนุกรรมาธิการ · ปี {0} · ยุติการพิจารณาแล้ว": "Chair of the subcommittee · {0|ce} · work ended",
    "ประธานคณะกรรมาธิการตลอดปี {0}": "Chair of the committee throughout {0|ce}",
    "ประธานคณะกรรมาธิการ ปี {0} · ตั้งแต่การประชุมครั้งแรก {1} ก.ย. {2}": "Chair of the committee, {0|ce} · from the first meeting on {1} September {2|ce}",
    "คณะกรรมาธิการคือคณะของสมาชิกวุฒิสภาที่ทำงานเฉพาะด้าน คณะกรรมาธิการการต่างประเทศดูแลเรื่องความสัมพันธ์ระหว่างไทยกับต่างประเทศ คนไทยในต่างแดน ความตกลงระหว่างประเทศ และสถานการณ์โลกที่อาจกระทบประเทศไทย เช่น การเข้าเป็นสมาชิก OECD การค้าเสรี และการดูแลคนไทยในพื้นที่เสี่ยง โดยเชิญหน่วยงานรัฐมาชี้แจง ศึกษาเรื่องที่เกี่ยวข้อง และเสนอแนะต่อรัฐบาลและวุฒิสภา":
        "A committee is a group of senators who work on a particular area. The Committee on Foreign Affairs looks after Thailand's relations with other countries, Thais abroad, international agreements and world events that may affect Thailand, such as OECD membership, free trade and care for Thais in risk areas. It invites state agencies to explain, studies related matters and makes recommendations to the government and the Senate",
    "คณะกรรมาธิการการต่างประเทศดูแลเรื่องความสัมพันธ์ระหว่างไทยกับต่างประเทศ คนไทยในต่างแดน ความตกลงระหว่างประเทศ และสถานการณ์โลกที่อาจกระทบประเทศไทย เช่น การเข้าเป็นสมาชิก OECD การค้าเสรี และการดูแลคนไทยในพื้นที่เสี่ยง โดยเชิญหน่วยงานรัฐมาชี้แจง ศึกษาเรื่องที่เกี่ยวข้อง และเสนอแนะต่อรัฐบาลและวุฒิสภา":
        "The Committee on Foreign Affairs looks after Thailand's relations with other countries, Thais abroad, international agreements and world events that may affect Thailand, such as OECD membership, free trade and care for Thais in risk areas. It invites state agencies to explain, studies related matters and makes recommendations to the government and the Senate",
    "พิจารณาร่างพระราชบัญญัติ กระทำกิจการ พิจารณาสอบหาข้อเท็จจริง หรือศึกษาเรื่องใด ๆ ที่เกี่ยวกับการต่างประเทศ ความสัมพันธ์ระหว่างประเทศ บทบาทและการยอมรับประเทศไทยในประชาคมโลก ชาวไทยซึ่งตั้งถิ่นฐานหรือไปประกอบอาชีพในต่างประเทศ สถานการณ์ใด ๆ ที่เกิดขึ้น อันอาจส่งผลกระทบต่อผลประโยชน์ รวมทั้งภาพลักษณ์ของประเทศ และอื่น ๆ ที่เกี่ยวข้อง":
        "To consider bills, carry out activities, conduct fact-finding or study any matter concerning foreign affairs, international relations, Thailand's role and recognition in the world community, Thais who have settled or work abroad, any events that may affect the country's interests and image, and other related matters",
}
NAMES = {}
FULL = "Committee on Foreign Affairs"
HAND.update({
    "กมธ.การต่างประเทศ วุฒิสภา · สรุปการประชุม ปี {0} · ParliamentX": "Senate Committee on Foreign Affairs · Meeting summaries {0|ce} · ParliamentX",
    "ประธานที่ปรึกษาคณะกรรมาธิการด้านต่างประเทศ": "Chief Adviser to the committee on foreign affairs",
    "ประธานที่ปรึกษาคณะกรรมาธิการด้านเศรษฐกิจ": "Chief Adviser to the committee on the economy",
    "ตำแหน่ง: ประธานที่ปรึกษาคณะกรรมาธิการด้านเศรษฐกิจ": "Position: Chief Adviser to the committee on the economy",
    "คณะอนุกรรมาธิการด้านการเปลี่ยนแปลงสภาพภูมิอากาศและมลพิษทางอากาศ": "Subcommittee on Climate Change and Air Pollution",
    "คณะกรรมาธิการการเศรษฐกิจ การเงิน และการคลัง": "Committee on Economy, Monetary Affairs and Finance",
    "ตำแหน่ง: รองประธานคณะกรรมาธิการ คนที่ห้าและโฆษกคณะกรรมาธิการ": "Position: Fifth Vice-Chair and Spokesperson of the committee",
    "ตำแหน่ง: รองประธานคณะกรรมาธิการ คนที่หก และที่ปรึกษา": "Position: Sixth Vice-Chair and adviser",
    "คณะอนุกรรมาธิการการส่งเสริมการเรียนรู้ การศึกษาเอกชน การศึกษาพิเศษ และความเท่าเทียมทางการศึกษา": "Subcommittee on Promoting Learning, Private Education, Special Education and Educational Equality",
    "คณะกรรมาธิการการพาณิชย์และการอุตสาหกรรม วุฒิสภา": "Senate Committee on Commerce and Industry",
    "คณะอนุกรรมาธิการส่งเสริมและพัฒนาด้านการท่องเที่ยวและการกีฬา": "Subcommittee on Promoting and Developing Tourism and Sports",
    "โรงเรียน": "schools",
})
for _th, _en in SHORT.items():
    for _a, _b in ((_th, _en), (_th + " " + ENDED[0], _en + " " + ENDED[1])):
        HAND["คณะอนุกรรมาธิการ" + _a + " วุฒิสภา · สรุปการประชุม ปี {0} · ParliamentX"] = "Senate Subcommittee on " + _b + " · Meeting summaries {0|ce} · ParliamentX"
