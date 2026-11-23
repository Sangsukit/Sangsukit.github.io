# English for content/2569.py (same meeting numbers, same item order). tools/make_i18n.py zips it with the Thai
# into committees/foreign/i18n_en.json (csite.py adds it to the site's English dictionary).
# Rules as the Thai: neutral and factual, no judgement of any foreign leader or country, security items as topics only,
# nothing from a proposed closed session (rule 92), no names of outside people appointed.
NOSUM = "The summary will be added after the Senate publishes it."
AG = "(The Senate has published only the meeting notice; there is no meeting summary yet.)"
def A(d):
    return "Meeting on Wednesday %s at 13.30 in committee meeting room CA 428, 4th floor, Parliament House, according to the meeting notice. " % d
GEN = "Consideration of foreign affairs"
EN = {}
EN[1] = dict(
 headline="Progress on Thailand's bid to join the OECD",
 summary="The committee was told that Thailand has completed the steps of expressing its intent and drawing up a work plan, and on 8 December 2568 submitted its Initial Memorandum, a self-assessment, to the Organisation for Economic Co-operation and Development (OECD). The next step is the technical review, in which about 34 Thai agencies, led by the Office of the National Economic and Social Development Council, the Ministry of Foreign Affairs and the Office of the Council of State, must work with the OECD's 25 committees. This is expected to take about 3–5 years, assessing laws, policies and actual practice. The committee proposed active public communication so that people understand the benefits of OECD membership.",
 items=["Progress on joining the OECD (Initial Memorandum filed on 8 December 2568 and the technical review stage)"])
EN[2] = dict(
 headline="OECD: the Anti-Bribery Convention and the work of the NACC",
 summary="The committee heard the Office of the National Anti-Corruption Commission (NACC), the lead agency for the OECD Anti-Bribery Convention, which aims to raise standards against bribery in international trade and investment. Thailand submitted its letter of intent to join on 8 December 2568. The NACC set up a steering committee to bring Thai law into line with OECD standards. The OECD has assessed Thailand's legal framework and proposed 6 further improvements. The next steps are to speed up legal amendments and prepare for the technical review.",
 items=["Joining the OECD Anti-Bribery Convention (NACC)"])
EN[3] = dict(
 headline="The situation in Iran and the safety of Thais, and the OECD on public governance",
 summary="A representative of the Ministry of Foreign Affairs reported on the unrest in Iran, which began with economic protests in Tehran at the end of December and spread to many cities. The ministry is following it closely through the Royal Thai Embassy in Tehran and has prepared an evacuation plan in advance. At the time about 190 Thais lived in Iran; all were safe and no one had asked to be evacuated. The committee also followed work on public governance for OECD membership with the Office of the Public Sector Development Commission (OPDC).",
 items=["The situation in Iran, its effects and care for Thais (Ministry of Foreign Affairs)",
        "Public administration for OECD membership (OPDC)"])
EN[4] = dict(
 headline="Appointing an honorary adviser, and following the international situation",
 summary="The committee approved appointing an honorary adviser and a secretary to the committee, and followed key international developments, such as the situation in the Middle East and politics in Myanmar after its election. As a neighbour sharing a border of more than 2,000 kilometres, Thailand should have flexible policies to protect its interests and peace along the border. The committee also considered a visit to the border area.",
 items=["Appointing an honorary adviser and a secretary to the committee",
        "International situation: the Middle East, and Myanmar after the election"])
EN[5] = dict(
 headline="Tourism in Phang Nga and the Andaman airport, and Nipah virus screening at airports",
 summary="The committee heard about tourism in Phang Nga, which focuses on wellness and family tourism. Most visitors come from Europe and Scandinavia and stay about 14–30 days; in 2567 tourism brought in more than 50,000 million baht. The planned Andaman airport in Khok Kloi Subdistrict, Takua Thung District, about 7,500 rai with an investment of more than 80,000 million baht, would serve the Andaman provinces. Problems include damaged roads in places and flooding at Khao Lak. The committee also heard about the Nipah virus surveillance and screening measures of Airports of Thailand and the international communicable disease control checkpoints for passengers from risk areas.",
 items=["Tourism potential of Phang Nga and the Andaman airport project",
        "Nipah virus screening at airports"])
EN[6] = dict(
 headline="Conflict in the Middle East escalates: care for Thais and evacuation plans",
 summary="The committee followed the conflict in the Middle East, which escalated into war with effects across the region, including energy shipping routes. About 110,000 Thais in the region may be affected, about 250–300 of them in Iran. The Royal Thai Embassy in Tehran prepared to evacuate a first group of 100 people by road through the Iran–Türkiye border on 7 March 2569. Most of the about 60,000 Thai workers in Israel chose to keep working.",
 items=["The conflict in the Middle East and care for Thais in the region"])
EN[7] = dict(
 headline="Thailand's energy reserves of 96 days, and evacuating Thais from risk areas",
 summary="The Ministry of Energy reported that Thailand has enough oil in reserve for about 96 days. 3 cargoes of liquefied natural gas (LNG) from Qatar could not be delivered because of force majeure around the Strait of Hormuz, so spot LNG was bought instead. The situation was still at the “green” level. Key measures include temporarily suspending fuel exports (except to Lao PDR and Myanmar), raising legal oil reserves, moving biodiesel from B5 to B7 for a time, and energy-saving campaigns. The Ministry of Foreign Affairs reported that Thais had been evacuated from Iran in 2 rounds, back-up plans were ready for Lebanon and Iraq through Türkiye, and Thailand keeps a neutral position, using diplomacy to protect the national interest and the safety of Thais.",
 items=["Energy security amid the Middle East situation (Ministry of Energy)",
        "Care for and evacuation of Thais in risk areas (Ministry of Foreign Affairs)"])
EN[8] = dict(
 headline="Education under SDG 4, and following the world situation",
 summary="Meeting on Wednesday 1 April 2569. The committee followed work on education under Sustainable Development Goal 4, such as lifelong learning, vocational skills and reducing school drop-outs. Challenges remain, such as rules, modern resources and PISA results, and the committee stressed raising the quality of education. It also followed the Middle East, OECD progress, Thai–Chinese relations, free trade agreements (FTA) and the Pink Economy.",
 items=["Driving SDG 4 on education",
        "International situation, the OECD, FTAs and the Pink Economy"])
EN[9] = dict(
 headline="Report of the subcommittee on the Sustainable Development Goals (SDGs)",
 summary="The committee heard the subcommittee following international obligations, the UN's sustainable development and international trade and economic agreements, which is studying how to drive the Sustainable Development Goals (SDGs) in an integrated way. It invited the Ministry of Foreign Affairs, the Ministry of Interior, the United Nations Development Programme (UNDP) and the National Economic and Social Development Council to give information, and met provincial governors and agencies in Phetchaburi, Mukdahan, Chachoengsao, Nakhon Phanom and Ubon Ratchathani, as well as making study visits.",
 items=["The subcommittee's report on driving the Sustainable Development Goals (SDGs)"])
EN[10] = dict(
 headline="Effects of the US–Iran situation, and Thailand–China in a new world order",
 summary="The committee followed the situation between the United States and Iran, which affects energy prices in the region, and proposed recommendations to the Senate so that Thailand, as a major food producer for the world, prepares for energy and food crises. It also considered Thailand–China in a new world order: the overall picture of East Asia, China's role towards Thailand and ASEAN, risks and opportunities for Thailand, the meaning of a “Thai–Chinese balance”, and the trade balance.",
 items=["The US–Iran situation and its energy and food effects on Thailand",
        "Thailand–China in a new world order and the Thai–Chinese balance"])
EN[11] = dict(
 headline="Committee representatives for the 2570 budget committee and a background check",
 summary="Meeting on Wednesday 6 May 2569. The committee considered its representatives in the standing committee checking the background, conduct and ethics of the person nominated as Secretary-General of the Council of State, and in the special committee studying the Annual Appropriations Bill for fiscal year 2570, naming 2 of its vice-chairs.",
 items=["Committee representative in the background check of the nominee for Secretary-General of the Council of State",
        "Committee representatives in the special committee on the 2570 budget bill"])
EN[12] = dict(
 headline="SDG 2 on farming, comparing the Thai Canal, Dawei and the Land Bridge, and state enterprises under the OECD",
 summary="The committee discussed following SDG 2 on ending hunger and developing farming, proposing that each ministry's 5-year action plan be used to track results, and reflected structural problems of farmers such as low income, high costs and debt. It compared 3 large shipping and logistics projects: the Thai Canal, the Dawei deep-sea port and the Land Bridge, and found the Land Bridge the most feasible in terms of sovereignty, security and investment. It also discussed trade competition and the oversight of state enterprises for OECD membership with the State Enterprise Policy Office, the Board of Investment and the Trade Competition Commission, and set a seminar to present the Pink Economy report on 12 June 2569 at Parliament House.",
 items=["Following SDG 2 and agriculture",
        "Comparing the Thai Canal, the Dawei deep-sea port and the Land Bridge",
        "Trade competition and state enterprise oversight under OECD guidelines",
        "Seminar to present the Pink Economy report (12 June 2569)"])
EN[13] = dict(
 headline="Considering 5 international documents and agreements",
 summary="The committee considered 5 international matters: the draft Plan of Action for the Thailand–Viet Nam comprehensive strategic partnership 2569–2574; the State Audit Office holding the chair and secretariat of the environmental auditing working group of the International Organization of Supreme Audit Institutions; the draft Dushanbe Declaration for the high-level conference on the Decade for Action “Water for Sustainable Development”; recommendations on joining ILO Conventions No. 87 and 98 and the Convention on the Protection of the Rights of All Migrant Workers and Members of Their Families; and draft guidelines for defence cooperation on undersea infrastructure.",
 items=["Draft Plan of Action for the Thailand–Viet Nam comprehensive strategic partnership 2569–2574",
        "Draft Dushanbe Declaration (water for sustainable development) and ILO Conventions No. 87 and 98",
        "Positions in an international environmental auditing working group, and guidelines on cooperation on undersea infrastructure"])
EN[14] = dict(
 headline="Following the security situation on the Thai–Cambodian border",
 summary="The committee followed news of military equipment delivered from China to Cambodia and assessed its effects on security along the Thai–Cambodian border, as well as relations between China and Cambodia and Thailand's approach.",
 items=["The security situation on the Thai–Cambodian border"])
EN[15] = dict(
 headline="Child nutrition, Chinese investment and technology, the OECD and the Thai–Cambodian border",
 summary="The SDG subcommittee discussed child malnutrition with the Ministry of Higher Education, Science, Research and Innovation and the Ministry of Public Health. It comes more from the wrong nutrients than from a lack of food, and the subcommittee will make observations such as agencies working separately and the quality of school lunches and school milk. The committee also considered balancing Thai–Chinese trade by attaching conditions to foreign direct investment (FDI), such as research centres with Thai universities, noted progress in OECD cooperation such as King Prajadhipok's Institute's OECD 101 course, and followed the Thai–Cambodian border situation.",
 items=["Child nutrition under the SDGs (Ministry of Higher Education and Ministry of Public Health)",
        "Thai–Chinese trade balance, investment and technology upgrading",
        "Progress on OECD membership and the Thai–Cambodian border situation"])
EN[16] = dict(
 headline="China's role in the Mekong subregion (National Security Council)",
 summary="A representative of the National Security Council said the Mekong subregion is a strategic area important to Thailand's security interests. The NSC follows China's role in the region continuously, especially in Lao PDR, Cambodia and Myanmar, including through economic and infrastructure projects, and sees a need for Thailand to have a long-term policy on how it wants the Mekong subregion to develop over the next 10–20 years.",
 items=["China's role in the Mekong subregion and its effects on Thailand (NSC)"])
EN[17] = dict(
 headline="Progress of the Thailand–EU free trade agreement negotiations",
 summary=A("15 July 2569") + "The agenda is following the status and progress of negotiations on a free trade agreement between Thailand and the European Union, with representatives of the Ministry of Foreign Affairs and the Ministry of Commerce invited. " + AG,
 items=["Progress of the Thailand–EU FTA negotiations"])
EN[18] = dict(
 headline="Results of the ASEAN Foreign Ministers' Meeting",
 summary=A("5 August 2569") + "(It could also be joined online.) The agenda is following the results of the ASEAN Foreign Ministers' Meeting, with representatives of the Ministry of Foreign Affairs invited. " + AG,
 items=["Results of the ASEAN Foreign Ministers' Meeting"])
EN[19] = dict(
 headline="Progress of the OECD accession process",
 summary=A("19 August 2569") + "The agenda is following progress in Thailand's OECD accession process, with the Assistant to the Minister of Foreign Affairs, representatives of the Ministry of Foreign Affairs, the Office of the National Economic and Social Development Council and the Office of the Council of State invited. " + AG,
 items=["Progress of the OECD accession process"])
EN[20] = dict(headline=GEN, summary=A("26 August 2569") + "The agenda is the consideration of foreign affairs. " + AG, items=[GEN])
EN[21] = dict(
 headline="The situation in the southern border provinces",
 summary=A("9 September 2569") + "The agenda is following the situation in the southern border provinces and related issues, with representatives of the Ministry of Foreign Affairs, the National Security Council, the National Intelligence Agency and the Army Military Intelligence Command invited. " + AG,
 items=["The situation in the southern border provinces"])
EN[22] = dict(headline=GEN, summary=A("16 September 2569") + "The agenda is the consideration of foreign affairs. " + AG, items=[GEN])
EN[23] = dict(
 headline="Policy on granting and revoking Thai nationality and national security",
 summary=A("23 September 2569") + "The agenda is following the policy and practice of granting and revoking Thai nationality to prevent threats to national security in various dimensions, with representatives of the Ministry of Interior and the Office of the National Security Council invited. " + AG,
 items=["Policy and practice of granting and revoking Thai nationality"])
EN[24] = dict(
 headline="Consideration of foreign affairs (moved from 30 September because of flooding)",
 summary="Meeting on Wednesday 7 October 2569 in committee meeting room CA 428, 4th floor, Parliament House, moved from 30 September 2569 because of flooding in Bangkok (the 30 September meeting had an agenda on Thai–Philippine relations), according to the meeting notice. The agenda is the consideration of foreign affairs. " + AG,
 items=[GEN])
EN[25] = dict(
 headline="Cooperation with the Chinese Embassy on the image of Chinese people in Thailand",
 summary="Meeting on Wednesday 21 October 2569 at 13.30 in special reception room 202, 2nd floor, Parliament House, according to the meeting notice. The agenda is cooperation between the committee and the Embassy of the People's Republic of China in Thailand to promote the image of Chinese people who do business, travel or live in Thailand, with the Ambassador of the People's Republic of China to Thailand invited. " + AG,
 items=["Cooperation with the Chinese Embassy to promote the image of Chinese people in Thailand"])
EN[26] = dict(headline=GEN, summary=A("28 October 2569") + "The agenda is the consideration of foreign affairs. " + AG, items=[GEN])
EN[27] = dict(headline=GEN, summary=A("4 November 2569") + "The agenda is the consideration of foreign affairs. " + AG, items=[GEN])
EN[28] = dict(headline=GEN, summary=A("11 November 2569") + "The agenda is the consideration of foreign affairs. " + AG, items=[GEN])
EN[29] = dict(headline=GEN, summary=A("18 November 2569") + "The agenda is the consideration of foreign affairs. " + AG, items=[GEN])
EN[30] = dict(headline=GEN, summary=A("25 November 2569") + "The agenda is the consideration of foreign affairs. " + NOSUM, items=[GEN])

RESULTS = {"พิจารณา": "Considered", "รับทราบ": "Noted", "เห็นชอบ": "Approved", "วาระที่ 4": "Agenda item 4"}
WORDS = {"FTA": "FTA", "ILO": "ILO", "OECD": "OECD", "Pink Economy": "Pink Economy", "SDGs": "SDGs", "UNDP": "UNDP",
         "การศึกษา": "education", "คณะอนุกรรมาธิการ": "subcommittees", "คนไทยในต่างแดน": "Thais abroad",
         "ความตกลงระหว่างประเทศ": "international agreements", "ความมั่นคง": "security",
         "ความมั่นคงทางอาหาร": "food security", "งบประมาณ 2570": "2570 budget",
         "จังหวัดชายแดนภาคใต้": "southern border provinces", "จีน": "China", "ชายแดน": "borders",
         "ตรวจสอบประวัติ": "background checks", "ตะวันออกกลาง": "Middle East", "ต่อต้านสินบน": "anti-bribery",
         "ท่องเที่ยว": "tourism", "นมโรงเรียน": "school milk", "น้ำ": "water", "น้ำมันสำรอง": "oil reserves",
         "ป.ป.ช.": "NACC", "พลังงาน": "energy", "ฟิลิปปินส์": "Philippines", "ลาว": "Laos",
         "ลุ่มแม่น้ำโขง": "Mekong", "วาระการประชุม": "meeting agenda", "สนามบินอันดามัน": "Andaman airport",
         "สมช.": "NSC", "สหภาพยุโรป": "European Union", "สัญชาติ": "nationality", "อาเซียน": "ASEAN",
         "อิสราเอล": "Israel", "อิหร่าน": "Iran", "กัมพูชา": "Cambodia", "เมียนมา": "Myanmar", "เวียดนาม": "Viet Nam",
         "เกษตรกร": "farmers", "เศรษฐกิจระหว่างประเทศ": "international economy", "แผนอพยพ": "evacuation plans",
         "แลนด์บริดจ์": "Land Bridge", "โภชนาการเด็ก": "child nutrition", "ไทย–กัมพูชา": "Thai–Cambodian",
         "ไทย–จีน": "Thai–Chinese", "ไวรัสนิปาห์": "Nipah virus",
         # places
         "กระบี่": "Krabi", "ฉะเชิงเทรา": "Chachoengsao", "นครพนม": "Nakhon Phanom", "นราธิวาส": "Narathiwat",
         "ปัตตานี": "Pattani", "พังงา": "Phang Nga", "ภูเก็ต": "Phuket", "มุกดาหาร": "Mukdahan", "ยะลา": "Yala",
         "อุบลราชธานี": "Ubon Ratchathani", "เพชรบุรี": "Phetchaburi",
         # subcommittee names (pages, home card)
         "คณะอนุกรรมาธิการติดตามการดำเนินการตามพันธกรณีระหว่างประเทศ การพัฒนาที่ยั่งยืนของสหประชาชาติ และความตกลงทางด้านการค้า การเศรษฐกิจระหว่างประเทศ":
             "Subcommittee to Follow International Obligations, the United Nations' Sustainable Development and International Trade and Economic Agreements",
         "คณะอนุกรรมาธิการพิจารณาและติดตามการดำเนินการเพื่อเข้าสู่การเป็นสมาชิก OECD ของประเทศไทย":
             "Subcommittee to Consider and Follow Thailand's Steps towards OECD Membership",
         "คณะอนุกรรมาธิการติดตามความร่วมมือระหว่างประเทศด้านเศรษฐกิจ การค้า การลงทุน และแรงงานของไทย":
             "Subcommittee to Follow Thailand's International Cooperation on Economy, Trade, Investment and Labour",
         "กมธ.การต่างประเทศ": "Committee on Foreign Affairs",
         "กมธ.ต่างประเทศ": "Foreign Affairs Committee",
         }
