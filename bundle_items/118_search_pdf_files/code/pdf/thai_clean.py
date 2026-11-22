"""Clean Thai text pulled from PDF text layers: map font private-use glyphs back to Thai, rebuild sara am, drop junk."""
import re, unicodedata
PUA = {0xF700:'ฐ',0xF701:'ิ',0xF702:'ี',0xF703:'ึ',0xF704:'ื',0xF705:'่',0xF706:'้',0xF707:'๊',
       0xF708:'๋',0xF709:'์',0xF70A:'่',0xF70B:'้',0xF70C:'๊',0xF70D:'๋',0xF70E:'์',0xF70F:'ญ',
       0xF710:'ั',0xF711:'ํ',0xF712:'็',0xF713:'่',0xF714:'้',0xF715:'๊',0xF716:'๋',0xF717:'์',
       0xF718:'ุ',0xF719:'ู',0xF71A:'ฺ'}
TONE = '่้๊๋'
def clean(t):
    t = t.translate(PUA)
    t = re.sub('[-�​­]', '', t)
    t = re.sub('ํ([' + TONE + ']?)า', lambda m: m.group(1) + 'ำ', t)   # nikhahit + sara aa -> sara am
    t = t.replace('าํ', 'ำ')
    t = re.sub('([' + TONE + '])([ัิ-ื็])', r'\2\1', t)            # tone mark before upper vowel -> after
    t = re.sub('([ก-ฮ])\\s([ัิ-ฺ็-๎])', r'\1\2', t)  # stray space before a combining sign
    t = re.sub(r'[ \t]+', ' ', t)
    t = re.sub(r'\*{4,}|_{4,}|\.{5,}|-{5,}', ' ', t)
    lines = [l.strip() for l in t.split('\n')]
    out, prev = [], ''
    for l in lines:
        if not l: continue
        if l == prev or (len(l) < 40 and prev.startswith(l)): continue   # Canva draws some lines twice
        out.append(l); prev = l
    return '\n'.join(out)
def thai_ratio(t):
    th = len(re.findall('[ก-๛]', t)); al = len(re.findall(r'\w', t)) or 1
    return th / al
