# English for content/sub/2569/<key>.py (same meeting numbers, same item order). tools/make_i18n.py zips it with the Thai.
# Rules as the Thai: neutral, no names of agency representatives or private bodies, official English names of agencies.
EN_SUB = {
 "oecd": {
  19: dict(headline="Following Thailand's progress towards OECD membership",
   summary="Meeting on Tuesday 17 November 2569 at 13.30 hrs, Meeting Room 202, floor 2, Parliament House; members may also join online. The agenda is to adopt the record of the previous meeting, No. 18, and to consider and follow the progress of Thailand's work towards OECD membership, as set out in the meeting notice. A summary will be added after the Senate publishes the meeting summary.",
   items=["Considering and following the progress of Thailand's work towards OECD membership"]),
 },
 "sdg": {
  30: dict(headline="Following the ratification of ILO Conventions No. 87 and No. 98",
   summary="Meeting on Wednesday 18 November 2569 at 10.00 hrs, Committee Meeting Room CA 320, floor 3, Parliament House. The agenda is to consider and follow the process of ratifying International Labour Organization (ILO) Convention No. 87 on freedom of association and protection of the right to organise, and Convention No. 98 on the right to organise and collective bargaining, and related issues. Representatives of labour organisations are invited, as set out in the meeting notice. A summary will be added after the Senate publishes the meeting summary.",
   items=["Considering and following the ratification of International Labour Organization (ILO) Conventions No. 87 and No. 98, and related issues"]),
  31: dict(headline="Following the ratification of ILO Conventions No. 87 and No. 98: hearing the private sector and employers",
   summary="Meeting on Wednesday 25 November 2569 at 10.00 hrs, Committee Meeting Room CA 320, floor 3, Parliament House. The agenda is to consider and follow the process of ratifying International Labour Organization (ILO) Conventions No. 87 and No. 98 and related issues, with representatives of the private sector and employers' organisations invited, as set out in the meeting notice. A summary will be added after the Senate publishes the meeting summary.",
   items=["Considering and following the ratification of ILO Conventions No. 87 and No. 98 and related issues (hearing the private sector and employers)"]),
 },
}
WORDS = {"แรงงาน": "labour", "อนุสัญญาระหว่างประเทศ": "international conventions",
 # page lines made from these meetings (numbers are examples; make_i18n turns them into {0}, {1}...)
 "3 วาระ ตามหนังสือนัดประชุม: งานคณะอนุกรรมาธิการ 2": "3 agenda items in the meeting notice: subcommittee work 2",
 "วันอังคารที่ 17 พฤศจิกายน 2569 เวลา 13.30 น. · ห้องประชุม 202 ชั้น 2 อาคารรัฐสภา": "Tuesday 17 November 2569 at 13.30 hrs · Meeting room 202, floor 2, Parliament House"}
RESULTS = {"วาระที่ 3": "Agenda item 3"}
