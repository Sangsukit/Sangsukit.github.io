#!/usr/bin/env python3
"""Hot Topic for the ParliamentX home page (thread "Add Hot Topic to homepage", Sukit 11 Nov 2569:
"add Hot Topic in the homepage! hot topic is auto update. It matches the current hot news relating to topics of the committees").

What it does (runs by itself every 3 hours from .github/workflows/hot-topic.yml, or by hand):
  1. Reads the RSS feeds of the mainstream outlets in hot/sources.json (copy of archive/news_sources/NEWS_SOURCES.json;
     Sukit: "Only from mainstream trustable sources from both domestic and internationals").
  2. Keeps news from the last 72 hours whose HEADLINE names a committee subject in hot/topics.json (rice, floods,
     minimum wage ...). Subjects only, never people.
  3. Drops every headline with a blocked word (crime, courts, accusations, deaths, party politics, the Senate or its
     committees, the royal family, quarrels, gossip, companies and shares). When in doubt it leaves a story out.
  4. Ranks subjects by how many different outlets carry them, keeps the top 5 with up to 3 headlines each, and for each
     subject adds the committee/subcommittee page and its latest held meeting that mentions the same subject.
  5. Writes hot/hot.json. The home page shows only: headline, outlet, date, link out. No article text, no photos.

Safety: if fewer than 3 feeds answer, or nothing matches, the old hot.json is kept (the section never shows half-broken
news). Output words describe a subject "within the scope of" a committee; never that the committee said or did anything.

Usage: python3 hot/hot_topics.py [--root <site dir>] [--out hot/hot.json] [--now 2026-11-11T16:00:00Z]
No third-party packages (standard library only).
"""
import argparse, datetime as dt, email.utils, html, json, os, re, sys, urllib.request
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
UA = "Mozilla/5.0 (compatible; ParliamentX-HotTopic/1.0; +https://parliamentx.com/)"
MAX_AGE_H = 72
MAX_TOPICS = 5
MAX_ITEMS = 3
MIN_FEEDS = 3
PUBLIC = "https://parliamentx.com/"


def load(p):
    with open(p, encoding="utf-8") as f:
        return json.load(f)


def fetch(url, timeout=25):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/rss+xml, application/xml, text/xml, */*"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def parse_date(s):
    if not s:
        return None
    s = s.strip()
    try:
        d = email.utils.parsedate_to_datetime(s)
    except Exception:
        d = None
    if d is None:
        try:
            d = dt.datetime.fromisoformat(s.replace("Z", "+00:00"))
        except Exception:
            return None
    if d.tzinfo is None:
        d = d.replace(tzinfo=dt.timezone(dt.timedelta(hours=7)))  # Thai feeds without zone are Bangkok time
    return d.astimezone(dt.timezone.utc)


def clean(s):
    s = html.unescape(re.sub(r"<[^>]+>", " ", s or ""))
    return re.sub(r"\s+", " ", s).strip()


def items_of(xml_bytes):
    root = ET.fromstring(xml_bytes)
    out = []
    for it in root.iter():
        tag = it.tag.split("}")[-1]
        if tag not in ("item", "entry"):
            continue
        f = {c.tag.split("}")[-1]: c for c in it}
        title = clean(f["title"].text if "title" in f else "")
        link = ""
        if "link" in f:
            link = (f["link"].text or f["link"].get("href") or "").strip()
        if not link and "guid" in f:
            link = (f["guid"].text or "").strip()
        when = None
        for k in ("pubDate", "published", "updated", "date"):
            if k in f and f[k].text:
                when = parse_date(f[k].text)
                if when:
                    break
        desc = clean(f["description"].text if "description" in f else (f["summary"].text if "summary" in f else ""))
        if title and link.startswith("http"):
            out.append({"title": title, "url": link, "when": when, "desc": desc})
    return out


def en_rx(term):
    t = term.strip().lower()
    if t.endswith("*"):
        return re.compile(r"(?<![a-z])" + re.escape(t[:-1]))
    return re.compile(r"(?<![a-z])" + re.escape(t) + r"(?:s|es)?(?![a-z])")


class Matcher:
    def __init__(self, cfg):
        self.topics = cfg["topics"]
        self.block_th = cfg["block_th"]
        self.block_en = [en_rx(t) for t in cfg["block_en"]]
        self.need_en = cfg["need_en"]
        for t in self.topics:
            t["_en"] = [(k, en_rx(k)) for k in t.get("kw_en", [])]

    def blocked(self, title):
        low = title.lower()
        if any(w in title for w in self.block_th):
            return True
        return any(r.search(low) for r in self.block_en)

    def topic(self, title, desc, lang):
        """Best topic for one headline: the longest keyword wins (so 'ค่าแรงขั้นต่ำ' beats 'แรงงาน')."""
        if self.blocked(title):
            return None, None
        low = title.lower()
        if lang == "en":
            ctx = (title + " " + desc).lower()
            if not any(n in ctx for n in self.need_en):
                return None, None
        best, kw = None, ""
        for t in self.topics:
            if lang == "en":
                for k, r in t["_en"]:
                    if r.search(low) and len(k) > len(kw):
                        best, kw = t, k
            else:
                for k in t.get("kw_th", []):
                    if k in title and len(k) > len(kw):
                        best, kw = t, k
        return best, kw


def is_thai(s):
    return bool(re.search(r"[฀-๿]", s))


def meetings_for(root, body, cache):
    rel = body["json"]
    if rel in cache:
        return cache[rel]
    data = []
    p = os.path.join(root, rel)
    if not os.path.exists(p):  # local preview: sibling clone of the archive repo (committee-archive-2569/...)
        p2 = os.path.join(os.path.dirname(os.path.abspath(root)), rel)
        p = p2 if os.path.exists(p2) else p
    try:
        if os.path.exists(p):
            data = load(p)
        else:
            data = json.loads(fetch(PUBLIC + rel).decode("utf-8"))
    except Exception as e:
        print("  meetings not read:", rel, e, file=sys.stderr)
    cache[rel] = data if isinstance(data, list) else []
    return cache[rel]


def related_meeting(root, body, topic, cache):
    """Latest HELD meeting of this body whose published title/summary/items mention the subject; else None.
    Uses only text already published on our own pages (released material)."""
    ms = [m for m in meetings_for(root, body, cache) if not m.get("upcoming") and not m.get("pending") and m.get("date")]
    ms.sort(key=lambda m: m.get("date", ""), reverse=True)
    kws = topic.get("kw_th", [])
    for m in ms:
        txt = " ".join([m.get("headline", ""), m.get("summary", "")] + [json.dumps(m.get("items", []), ensure_ascii=False)] +
                       [" ".join(m.get("tags", []) or [])])
        if any(k in txt for k in kws):
            return {"n": m.get("n"), "date": m["date"], "url": body["url"] + "#read-%s" % m.get("n")}
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default=os.path.dirname(HERE), help="site folder (home repo) for meetings json")
    ap.add_argument("--out", default=os.path.join(HERE, "hot.json"))
    ap.add_argument("--now", default="")
    ap.add_argument("--sources", default=os.path.join(HERE, "sources.json"))
    ap.add_argument("--topics", default=os.path.join(HERE, "topics.json"))
    a = ap.parse_args()
    now = dt.datetime.fromisoformat(a.now.replace("Z", "+00:00")) if a.now else dt.datetime.now(dt.timezone.utc)

    src = load(a.sources)
    cfg = load(a.topics)
    m = Matcher(cfg)
    outlets = src["domestic"] + src["international"]

    ok_feeds, seen, picked = 0, set(), []
    for o in outlets:
        for url in o.get("feeds", []):
            try:
                its = items_of(fetch(url))
                ok_feeds += 1
            except Exception as e:
                print("  feed failed:", o["id"], url, type(e).__name__, file=sys.stderr)
                continue
            n = 0
            for it in its:
                if not it["when"] or (now - it["when"]).total_seconds() > MAX_AGE_H * 3600 or it["when"] > now + dt.timedelta(hours=1):
                    continue
                key = re.sub(r"\W+", "", it["title"].lower())[:80]
                if it["url"] in seen or key in seen:
                    continue
                lang = "th" if is_thai(it["title"]) else "en"
                t, kw = m.topic(it["title"], it["desc"], lang)
                if not t:
                    continue
                seen.update([it["url"], key])
                picked.append({"topic": t["id"], "kw": kw, "title": it["title"], "url": it["url"], "lang": lang,
                               "outlet": o["id"], "outlet_th": o["name_th"], "outlet_en": o["name_en"],
                               "when": it["when"]})
                n += 1
            print("  %-12s %3d items, %2d matched  %s" % (o["id"], len(its), n, url), file=sys.stderr)

    if ok_feeds < MIN_FEEDS or not picked:
        print("Not enough news (feeds ok %d, matched %d): keeping the old hot.json" % (ok_feeds, len(picked)), file=sys.stderr)
        return 0

    bodies = cfg["bodies"]
    by = {}
    for p in picked:
        by.setdefault(p["topic"], []).append(p)
    rank = []
    for tid, ps in by.items():
        ps.sort(key=lambda p: p["when"], reverse=True)
        fresh = [p for p in ps if (now - p["when"]).total_seconds() <= 48 * 3600]
        rank.append((len({p["outlet"] for p in fresh}), len(fresh), len(ps), ps[0]["when"], tid))
    rank.sort(reverse=True)

    cache, topics = {}, []
    tmap = {t["id"]: t for t in cfg["topics"]}
    for outlets_n, fresh_n, total_n, newest, tid in rank:  # all; hot.json keeps the top MAX_TOPICS
        t = tmap[tid]
        body = bodies[t["body"]]
        ps, chosen, used = by[tid], [], set()
        for p in ps:  # one headline per outlet first, newest first
            if p["outlet"] not in used:
                chosen.append(p); used.add(p["outlet"])
            if len(chosen) == MAX_ITEMS:
                break
        for p in ps:
            if len(chosen) == MAX_ITEMS:
                break
            if p not in chosen:
                chosen.append(p)
        parent = bodies.get(body.get("parent", ""), None)
        topics.append({
            "id": tid, "th": t["th"], "en": t["en"], "icon": body["icon"], "photo": t.get("photo"),
            "outlets": outlets_n or len(used), "count": total_n,
            "body": {"th": body["th"], "en": body["en"], "url": body["url"]},
            "parent": ({"th": parent["th"], "en": parent["en"], "url": parent["url"]} if parent else None),
            "meeting": related_meeting(a.root, body, t, cache),
            "items": [{"title": p["title"], "url": p["url"], "lang": p["lang"], "outlet_th": p["outlet_th"],
                       "outlet_en": p["outlet_en"], "date": p["when"].isoformat().replace("+00:00", "Z")} for p in chosen],
        })

    head = {"updated": now.replace(microsecond=0).isoformat().replace("+00:00", "Z"), "feeds_ok": ok_feeds, "window_h": MAX_AGE_H}
    os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
    # hot.json = home page (top MAX_TOPICS); hot_all.json = every matched topic, same shape, read by the meeting
    # preparation box on committee pages (thread "Add preparation guide for upcoming meetings").
    for path, ts in ((a.out, topics[:MAX_TOPICS]), (os.path.join(os.path.dirname(os.path.abspath(a.out)), "hot_all.json"), topics)):
        with open(path, "w", encoding="utf-8") as f:
            json.dump(dict(head, topics=ts), f, ensure_ascii=False, indent=1)
    print("Wrote %s: %d topics from %d feeds" % (a.out, len(topics), ok_feeds), file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
