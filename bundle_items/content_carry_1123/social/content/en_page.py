# English for the page lines of the Social Development site that are not meeting summaries (names, captions, titles).
# tools/make_i18n.py adds these to committees/social/i18n_en.json, together with patterns it builds itself
# (subcommittee page titles, timelines, document titles, senators' names from i18n/senators_th_en.json).
# Keys are normalised Thai (numbers -> {0}, {1}...); {n|ce} shows a Buddhist-era year as the Gregorian year.
EN_NAME = "Committee on Social Development"
FULL = ("Committee on Social Development and Affairs of Children, Youth, Women, the Elderly, Persons with Disabilities, "
        "the Disadvantaged and Social Diversity")   # same as committee.py EN
SHORT = {
    "กิจการเด็ก เยาวชน และกลุ่มชาติพันธุ์": "Children, Youth and Ethnic Groups",
    "กิจการผู้สูงอายุ คนพิการ และผู้ด้อยโอกาส": "Older Persons, Persons with Disabilities and the Disadvantaged",
    "กิจการสตรี และผู้มีความหลากหลายทางเพศ": "Women and People of Diverse Genders",
}
ENDED = ("(ยุติการพิจารณา)", "(consideration ended)")
HAND = {
    "คณะกรรมาธิการการพัฒนาสังคม และกิจการเด็ก เยาวชน สตรี ผู้สูงอายุ คนพิการ ผู้ด้อยโอกาส และความหลากหลายทางสังคม": FULL,
    "คณะกรรมาธิการการพัฒนาสังคม และกิจการเด็ก เยาวชน สตรี ผู้สูงอายุ คนพิการ ผู้ด้อยโอกาส และความหลากหลายทางสังคม วุฒิสภา": "Senate " + FULL,
    "นายป.ไท มนตรี": "Mr. Porthai Montri",
    "ประธาน นายป.ไท มนตรี": "Chair: Mr. Porthai Montri",    "ประธานคณะอนุกรรมาธิการ · ปี {0} · คณะปัจจุบัน": "Chair of the subcommittee · {0|ce} · current subcommittee",
    "ประธานคณะอนุกรรมาธิการ · ปี {0}–{1} · คณะปัจจุบัน": "Chair of the subcommittee · {0|ce}–{1|ce} · current subcommittee",
    "ประธานคณะอนุกรรมาธิการ · ปี {0}–{1} · ยุติการพิจารณาแล้ว": "Chair of the subcommittee · {0|ce}–{1|ce} · work ended",
    "ประธานคณะอนุกรรมาธิการ · ปี {0} · ยุติการพิจารณาแล้ว": "Chair of the subcommittee · {0|ce} · work ended",
    "· รองประธานคณะกรรมาธิการ คนที่หนึ่ง ทำหน้าที่ประธานในการประชุม": "· First Vice-Chair of the committee, presiding at the meeting",
    "รองประธานคณะกรรมาธิการ คนที่หนึ่ง ทำหน้าที่ประธานในการประชุม": "First Vice-Chair of the committee, presiding at the meeting",
    "รองเลขานุการคณะกรรมาธิการ คนที่หนึ่ง": "First Deputy Secretary of the committee",
    "กรรมาธิการและที่ปรึกษาคณะกรรมาธิการ": "Committee members and advisers to the committee",
    "มติ: อนุมัติในหลักการ": "Resolution: Approved in principle",
    "มติ: เลือก": "Resolution: Elected",
    "มติ: พิจารณา พร้อมข้อสังเกต": "Resolution: Considered, with observations",
    "มติ: รับทราบ พร้อมข้อสังเกต": "Resolution: Noted, with observations",
    "· ประธานคณะกรรมาธิการ (ขอลาออกจากตำแหน่งประธานในการประชุมครั้งนี้)": "· Chair of the committee (asked to resign as chair at this meeting)",
    "ประธานคณะกรรมาธิการ (ขอลาออกจากตำแหน่งประธานในการประชุมครั้งนี้)": "Chair of the committee (asked to resign as chair at this meeting)",
    "ประธานคณะกรรมาธิการ ({0} ก.ย. {1} – {2} เม.ย. {3})": "Chair of the committee ({0} Sep {1|ce} – {2} Apr {3|ce})",
    "ประธานคณะกรรมาธิการ ครั้งที่ {0}–{1}/{2} · ขอลาออกจากตำแหน่งประธาน {3} เม.ย. {4}":
        "Chair of the committee, meetings {0}–{1}/{2} · asked to resign as chair on {3} Apr {4|ce}",
    "ประธานคณะกรรมาธิการ ตั้งแต่ {0} เม.ย. {1} (ได้รับเลือกในครั้งที่ {2}/{3})":
        "Chair of the committee since {0} Apr {1|ce} (elected at meeting No. {2}/{3})",
    "ตั้งคณะทำงานประเมินกฎหมาย {0} ด้าน และข้อเสนอการศึกษาสำหรับบุคคลออทิสติก":
        "working groups set up to assess laws in {0} areas, and proposals on education for autistic persons",
    "คณะกรรมาธิการคือคณะของสมาชิกวุฒิสภาที่ทำงานเฉพาะด้าน คณะกรรมาธิการการพัฒนาสังคมฯ ดูแลเรื่องเด็ก เยาวชน สตรี ผู้สูงอายุ คนพิการ ผู้ด้อยโอกาส กลุ่มชาติพันธุ์ และผู้มีความหลากหลายทางเพศ รวมถึงสวัสดิการสังคมและคุณภาพชีวิต เช่น ลงพื้นที่รับฟังปัญหา เชิญหน่วยงานรัฐมาชี้แจง ศึกษากฎหมายที่เกี่ยวข้อง และเสนอแนะต่อรัฐบาลและวุฒิสภา":
        "A committee is a group of senators who work on a particular area. The Committee on Social Development looks after children, youth, women, older persons, persons with disabilities, the disadvantaged, ethnic groups and people of diverse genders, as well as social welfare and quality of life. For example, it visits areas to hear about problems, invites state agencies to explain, studies the laws concerned and makes recommendations to the government and the Senate",
    "พิจารณาร่างพระราชบัญญัติ กระทำกิจการ พิจารณาสอบหาข้อเท็จจริง หรือศึกษาเรื่องใด ๆ ที่เกี่ยวกับการพัฒนาสังคม เด็ก เยาวชน สตรี ผู้สูงอายุ คนพิการ ผู้ด้อยโอกาส กลุ่มชาติพันธุ์ และผู้มีความหลากหลายทางเพศ รวมทั้งประสานกับองค์กรหรือประชาคมภายในประเทศและต่างประเทศ การส่งเสริมศักยภาพของชุมชนด้านการพัฒนาชีวิตความเป็นอยู่ การคุ้มครองและดูแลผู้ยากไร้ การส่งเสริมความเสมอภาค การส่งเสริมและพัฒนาสวัสดิการสังคม การเสริมสร้างพลังทางสังคม การสร้างหลักประกัน ความมั่นคง และการพัฒนาคุณภาพชีวิตของคนไทยโดยรวม และอื่น ๆ ที่เกี่ยวข้อง":
        "To consider bills, carry out activities, conduct fact-finding or study any matter concerning social development, children, youth, women, older persons, persons with disabilities, the disadvantaged, ethnic groups and people of diverse genders, including coordination with organisations or communities in Thailand and abroad, strengthening communities to improve their livelihoods, protecting and caring for the poor, promoting equality, promoting and developing social welfare, strengthening social power, building security and stability and improving the quality of life of Thai people as a whole, and other related matters",
    # other committees on the senators' cards
    "คณะอนุกรรมาธิการด้านศิลปะสร้างสรรค์": "Subcommittee on Creative Arts",
    "คณะอนุกรรมาธิการพิจารณาและติดตามการดำเนินการเพื่อเข้าสู่การเป็นสมาชิก OECD ของประเทศไทย": "Subcommittee to Consider and Follow Thailand's Steps towards OECD Membership",
    "คณะกรรมาธิการการเศรษฐกิจ การเงิน และการคลัง": "Committee on Economy, Monetary Affairs and Finance",
    "คณะอนุกรรมาธิการการส่งเสริมการเรียนรู้ การศึกษาเอกชน การศึกษาพิเศษ และความเท่าเทียมทางการศึกษา": "Subcommittee on Promoting Learning, Private Education, Special Education and Educational Equality",
    "คณะอนุกรรมาธิการกิจการเด็ก เยาวชน และกลุ่มชาติพันธุ์": "Subcommittee on Children, Youth and Ethnic Groups",
    "คณะอนุกรรมาธิการกิจการผู้สูงอายุ คนพิการ และผู้ด้อยโอกาส": "Subcommittee on Older Persons, Persons with Disabilities and the Disadvantaged",
    "คณะอนุกรรมาธิการกิจการสตรี และผู้มีความหลากหลายทางเพศ": "Subcommittee on Women and People of Diverse Genders",
}
NAMES = {"นายป.ไท มนตรี": "Mr. Porthai Montri"}

