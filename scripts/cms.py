#!/usr/bin/env python3
"""Website text editing for poweredbypfx.com.

The pages stay plain HTML. Editable text is marked with data-cms-* attributes.
At deploy time this script:
  1. reads those markers and writes content-schema.json, the list of editable
     fields and their current text (the internal tool builds its forms from it);
  2. downloads what was published from the internal tool (Supabase table
     site_content, public read-only) and writes it into the pages;
  3. removes the markers from the published HTML.

If nothing has been published yet, the pages deploy as they are. If Supabase
can't be reached, the deploy stops and the current live site stays up, because
deploying without the published text would quietly undo everyone's edits.

  python3 scripts/cms.py build public/landing-pages      (what deploy.yml runs)
  python3 scripts/cms.py schema public/landing-pages     (only write the schema)
  python3 scripts/cms.py build <dir> --content file.json (test with local content)

Markers:
  data-cms="key"            element text is editable (key "@x" = shared by pages)
  data-cms-type="rich"      text may hold links, written [words](url)
  data-cms-href="key"       the href is editable
  data-cms-toggle="key"     on/off switch; off removes the element
  data-cms-label / -max     label and character limit shown in the tool
  data-cms-list="key"       each child element is one item
  data-cms-mode="fixed"     items can be edited but not added or removed
  data-cms-min / -maxitems  allowed number of items
  data-cms-f="field"        inside an item: editable text
  data-cms-fhref="field"    inside an item: editable href
  data-cms-fattr="a=tpl;b=tpl"  inside an item: attributes built from fields,
                            e.g. src=https://x/{yt:video} ({slug:name}, {yt:video})
  data-cms-tpl="{name} x"   inside an item: text built from fields
  data-cms-if="field"       inside an item: remove this element if field is empty
  data-cms-auto="index"     inside an item: 01, 02, 03...
"""
import html as H
import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

SUPABASE_URL = "https://rhzhdtlmzogkfcgocdqk.supabase.co"
SUPABASE_KEY = "sb_publishable_sVcjNjTarvQlkZp_vFd2sA_m8YzBC-R"  # public, read-only

PAGES = {
    "home": ("index.html", "Home page"),
    "testimonials": ("testimonials.html", "Testimonials"),
    "kiosk-outdoor": ("kiosk-outdoor.html", "Outdoor Kiosk"),
    "kiosk-indoor": ("kiosk-indoor.html", "Indoor Kiosk"),
    "kiosk-atm": ("kiosk-atm.html", "ATM Kiosk"),
}
SHARED = "shared"

OPEN = re.compile(r'<([a-zA-Z][\w-]*)((?:\s+[\w:-]+(?:="[^"]*")?)*)\s*/?>')
ATTR = re.compile(r'([\w:-]+)="([^"]*)"')
SAFE_URL = re.compile(r'^(https?://|mailto:|tel:|/(?!/)|#)', re.I)
LINK = re.compile(r'\[([^\]\n]+)\]\(([^)\s]+)\)')
LINK_STYLE = "color:var(--red); text-decoration:underline;"


def attrs_of(open_tag):
    return {k: H.unescape(v) for k, v in ATTR.findall(open_tag)}


def cms_openers(s, start=0):
    for m in OPEN.finditer(s, start):
        if "data-cms" in m.group(2):
            yield m


def close_of(s, tag, start):
    """Index range (inner_end, element_end) of the tag opened just before start."""
    depth, pat = 1, re.compile(r'<(/?)%s\b[^<>]*?(/?)>' % re.escape(tag), re.I)
    for m in pat.finditer(s, start):
        if m.group(1):
            depth -= 1
            if depth == 0:
                return m.start(), m.end()
        elif not m.group(2):
            depth += 1
    raise ValueError("no closing </%s>" % tag)


def children(s, start, end):
    """(start, end) of each direct child element between two offsets."""
    out, pos = [], start
    while True:
        m = OPEN.search(s, pos, end)
        if not m:
            return out
        if s.count("<!--", pos, m.start()) > s.count("-->", pos, m.start()):
            pos = s.index("-->", m.start()) + 3
            continue
        _, e = close_of(s, m.group(1), m.end())
        out.append((m.start(), e))
        pos = e


def to_text(inner):
    t = re.sub(r'<[^>]+>', '', inner)
    return re.sub(r'\s+', ' ', H.unescape(t)).strip()


def to_rich(inner):
    def link(m):
        return "[%s](%s)" % (to_text(m.group(2)), H.unescape(m.group(1)))
    t = re.sub(r'<a\b[^>]*?href="([^"]*)"[^>]*>(.*?)</a>', link, inner, flags=re.S)
    return to_text(t)


def esc(v):
    return H.escape(str(v), quote=False)


def render(value, kind):
    value = str(value)
    if kind != "rich":
        return esc(value)
    out, pos = [], 0
    for m in LINK.finditer(value):
        out.append(esc(value[pos:m.start()]))
        url = m.group(2)
        if SAFE_URL.match(url):
            ext = ' target="_blank" rel="noopener"' if url.lower().startswith("http") else ""
            out.append('<a href="%s" style="%s"%s>%s</a>' % (H.escape(url), LINK_STYLE, ext, esc(m.group(1))))
        else:
            out.append(esc(m.group(1)))
        pos = m.end()
    out.append(esc(value[pos:]))
    return "".join(out)


def youtube_id(v):
    m = re.search(r'(?:youtu\.be/|v=|embed/|shorts/)([\w-]{6,})', str(v))
    return m.group(1) if m else str(v).strip()


def slug(v):
    return re.sub(r'[^a-z0-9]+', '-', str(v).lower()).strip('-')


def fill_template(tpl, item):
    def sub(m):
        fn, name = m.group(1), m.group(2)
        val = item.get(name, "")
        return {"slug": slug, "yt": youtube_id}.get(fn, str)(val)
    return re.sub(r'\{(?:(slug|yt):)?(\w+)\}', sub, tpl)


def read_template(tpl, value):
    """The reverse of fill_template: pull field values back out of an attribute."""
    names, rx, pos = [], "", 0
    for m in re.finditer(r'\{(?:(slug|yt):)?(\w+)\}', tpl):
        rx += re.escape(tpl[pos:m.start()]) + "(.*?)"
        names.append(None if m.group(1) == "slug" else m.group(2))
        pos = m.end()
    m = re.fullmatch(rx + re.escape(tpl[pos:]), value)
    return {n: g for n, g in zip(names, m.groups()) if n} if m else {}


def set_attr(open_tag, name, value):
    value = H.escape(str(value))
    pat = re.compile(r'(\s%s=")[^"]*(")' % re.escape(name))
    if pat.search(open_tag):
        return pat.sub(lambda m: m.group(1) + value + m.group(2), open_tag, 1)
    return re.sub(r'(\s*/?>)$', ' %s="%s"\\1' % (name, value), open_tag, 1)


def fattrs(a):
    return [p.split("=", 1) for p in a.get("data-cms-fattr", "").split(";") if "=" in p]


# ---------- reading the pages ----------
def read_item(s):
    item, fields = {}, []
    for m in cms_openers(s):
        a = attrs_of(m.group(0))
        if "data-cms-f" in a:
            kind = a.get("data-cms-type", "text")
            inner_end, _ = close_of(s, m.group(1), m.end())
            inner = s[m.end():inner_end]
            item[a["data-cms-f"]] = (to_rich if kind == "rich" else to_text)(inner)
            fields.append({"key": a["data-cms-f"], "label": a.get("data-cms-label", a["data-cms-f"]),
                           "type": kind, "max": int(a.get("data-cms-max", 0)) or None})
        if "data-cms-fhref" in a:
            item[a["data-cms-fhref"]] = a.get("href", "")
            fields.append({"key": a["data-cms-fhref"], "label": a.get("data-cms-label", "Link"), "type": "link", "max": None})
        for name, tpl in fattrs(a):
            for k, v in read_template(tpl, a.get(name, "")).items():
                if k not in item:
                    item[k] = v
                    label = a.get("data-cms-label-" + k, k)
                    fields.append({"key": k, "label": label, "type": "link" if "yt:" + k in tpl else "text", "max": None})
    # a field read from an attribute and from text is listed once, with its real label
    best = {}
    for f in fields:
        if f["key"] not in best or best[f["key"]]["label"] == f["key"]:
            best[f["key"]] = f
    return item, list(best.values())


def read_page(s):
    entries = []
    pos = 0
    while True:
        m = next(cms_openers(s, pos), None)
        if not m:
            return entries
        a, pos = attrs_of(m.group(0)), m.end()
        base = {"label": a.get("data-cms-label", ""), "max": int(a.get("data-cms-max", 0)) or None}
        if "data-cms-list" in a:
            inner_end, close_end = close_of(s, m.group(1), m.end())
            items, fields = [], []
            for b, e in children(s, m.end(), inner_end):
                item, f = read_item(s[b:e])
                items.append(item)
                known = {x["key"] for x in fields}
                fields += [x for x in f if x["key"] not in known]
            fixed = a.get("data-cms-mode") == "fixed"
            entries.append({**base, "key": a["data-cms-list"], "type": "list", "fixed": fixed, "fields": fields,
                            "min": int(a.get("data-cms-min", 0)), "maxItems": int(a.get("data-cms-maxitems", 0)) or None,
                            "default": items})
            if not fixed:
                pos = close_end
            else:
                # fixed items can hold shared values; keep scanning inside them
                pos = m.end()
            continue
        if "data-cms" in a:
            kind = a.get("data-cms-type", "text")
            inner_end, _ = close_of(s, m.group(1), m.end())
            inner = s[m.end():inner_end]
            entries.append({**base, "key": a["data-cms"], "type": kind,
                            "default": (to_rich if kind == "rich" else to_text)(inner)})
        if "data-cms-href" in a:
            entries.append({"key": a["data-cms-href"], "type": "link", "max": None,
                            "label": a.get("data-cms-label-href", a.get("data-cms-label", "Link")), "default": a.get("href", "")})
        if "data-cms-toggle" in a:
            entries.append({"key": a["data-cms-toggle"], "type": "toggle", "max": None,
                            "label": a.get("data-cms-label", "Show"), "default": True})


def build_schema(root):
    schema, shared = {"pages": []}, {}
    for page, (fname, title) in PAGES.items():
        entries = read_page((root / fname).read_text(encoding="utf-8"))
        own = []
        for e in entries:
            if e["key"].startswith("@"):
                shared.setdefault(e["key"], e)
            else:
                own.append(e)
        schema["pages"].append({"page": page, "title": title, "path": "/" if page == "home" else "/" + page, "entries": own})
    schema["pages"].append({"page": SHARED, "title": "Kiosk prices", "path": "/kiosk-outdoor",
                            "entries": list(shared.values())})
    return schema


# ---------- writing the pages ----------
def fill_item(s, item, index):
    pos = 0
    while True:
        m = next(cms_openers(s, pos), None)
        if not m:
            return s
        a, tag, opener = attrs_of(m.group(0)), m.group(1), m.group(0)
        if "data-cms-if" in a and not str(item.get(a["data-cms-if"], "")).strip():
            _, e = close_of(s, tag, m.end())
            s = s[:m.start()] + s[e:]
            pos = m.start()
            continue
        for name, tpl in fattrs(a):
            opener = set_attr(opener, name, fill_template(tpl, item))
        if "data-cms-fhref" in a and SAFE_URL.match(str(item.get(a["data-cms-fhref"], ""))):
            opener = set_attr(opener, "href", item[a["data-cms-fhref"]])
        inner = None
        if "data-cms-f" in a:
            inner = render(item.get(a["data-cms-f"], ""), a.get("data-cms-type", "text"))
        elif "data-cms-tpl" in a:
            inner = esc(fill_template(a["data-cms-tpl"], item))
        elif "data-cms-auto" in a:
            inner = "%02d" % (index + 1)
        if inner is None:
            s = s[:m.start()] + opener + s[m.end():]
        else:
            inner_end, _ = close_of(s, tag, m.end())
            s = s[:m.start()] + opener + inner + s[inner_end:]
        pos = m.start() + len(opener)


def write_page(s, values, shared):
    pos = 0
    while True:
        m = next(cms_openers(s, pos), None)
        if not m:
            break
        a, tag, opener = attrs_of(m.group(0)), m.group(1), m.group(0)
        pos = m.end()
        if "data-cms-toggle" in a and values.get(a["data-cms-toggle"]) is False:
            _, e = close_of(s, tag, m.end())
            s = s[:m.start()] + s[e:]
            pos = m.start()
            continue
        if "data-cms-list" in a:
            items = values.get(a["data-cms-list"])
            inner_end, close_end = close_of(s, tag, m.end())
            kids = children(s, m.end(), inner_end)
            fixed = a.get("data-cms-mode") == "fixed"
            if isinstance(items, list) and kids:
                if fixed:
                    for i in reversed(range(min(len(kids), len(items)))):
                        b, e = kids[i]
                        s = s[:b] + fill_item(s[b:e], items[i], i) + s[e:]
                else:
                    first = s[kids[0][0]:kids[0][1]]
                    lead = re.search(r'[ \t]*$', s[:kids[0][0]]).group(0)
                    body = ("\n" + lead).join(fill_item(first, it, i) for i, it in enumerate(items))
                    s = s[:kids[0][0]] + body + s[kids[-1][1]:inner_end] + s[inner_end:]
                    pos = m.end() + len(body)
            elif not fixed:
                pos = close_end
            continue
        key = a.get("data-cms")
        if key:
            source = shared if key.startswith("@") else values
            if key in source:
                inner_end, _ = close_of(s, tag, m.end())
                s = s[:m.end()] + render(source[key], a.get("data-cms-type", "text")) + s[inner_end:]
        href_key = a.get("data-cms-href")
        if href_key and SAFE_URL.match(str(values.get(href_key, ""))):
            new = set_attr(opener, "href", values[href_key])
            s = s[:m.start()] + new + s[m.end():]
            pos = m.start() + len(new)
    # the markers aren't needed on the live site
    s = re.sub(r'\sdata-cms(?:-[\w-]+)?(?:="[^"]*")?', '', s)
    return re.sub(r'<bdi>(.*?)</bdi>', r'\1', s, flags=re.S)


def fetch_published():
    req = urllib.request.Request(SUPABASE_URL + "/rest/v1/site_content?select=page,published",
                                 headers={"apikey": SUPABASE_KEY})
    with urllib.request.urlopen(req, timeout=20) as r:
        return {row["page"]: row["published"] or {} for row in json.load(r)}


def main(argv):
    if len(argv) < 3 or argv[1] not in ("build", "schema"):
        print(__doc__)
        return 2
    root = Path(argv[2])
    schema = build_schema(root)
    (root / "content-schema.json").write_text(json.dumps(schema, ensure_ascii=False, indent=1), encoding="utf-8")
    n = sum(len(p["entries"]) for p in schema["pages"])
    print("content-schema.json: %d editable entries" % n)
    if argv[1] == "schema":
        return 0
    if "--content" in argv:
        content = json.loads(Path(argv[argv.index("--content") + 1]).read_text(encoding="utf-8"))
    else:
        try:
            content = fetch_published()
        except urllib.error.HTTPError as err:
            if err.code != 404:  # 404: the table isn't set up yet, so nothing is published
                print("Couldn't read published text from Supabase: %s" % err)
                return 1
            content = {}
        except OSError as err:
            print("Couldn't reach Supabase: %s" % err)
            return 1
    print("published content for: %s" % (", ".join(sorted(content)) or "nothing yet"))
    shared = content.get(SHARED, {})
    for page, (fname, _) in PAGES.items():
        path = root / fname
        path.write_text(write_page(path.read_text(encoding="utf-8"), content.get(page, {}), shared), encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
