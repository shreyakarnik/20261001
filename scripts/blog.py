#!/usr/bin/env python3
"""Builds a real page for each published blog post.

Runs at deploy, after cms.py. For every published post in Supabase it writes
posts/<slug>.html from post.html, with the post's title, description, share
image and article already in the HTML, then lists those pages in sitemap.xml.
Search engines and social networks read these without running any JavaScript.

If Supabase can't be reached the deploy stops and the current site stays up.

  python3 scripts/blog.py public/landing-pages
  python3 scripts/blog.py <dir> --posts file.json    (test with local posts)
"""
import html
import json
import re
import shutil
import sys
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path

SITE = "https://www.poweredbypfx.com"
SUPABASE_URL = "https://rhzhdtlmzogkfcgocdqk.supabase.co"
SUPABASE_KEY = "sb_publishable_sVcjNjTarvQlkZp_vFd2sA_m8YzBC-R"  # public, read-only
SLUG = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")


def esc(value):
    return html.escape(str(value or ""), quote=True)


def absolute(url):
    return url if re.match(r"https?://", url) else SITE + "/" + url.lstrip("/")


def nice_date(iso):
    d = date.fromisoformat(iso[:10])
    return f"{d:%B} {d.day}, {d.year}"


def fetch_posts():
    url = SUPABASE_URL + "/rest/v1/posts?status=eq.published&select=*&order=date.desc"
    req = urllib.request.Request(url, headers={"apikey": SUPABASE_KEY})
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.load(r)


def set_tag(page, pattern, new):
    page, found = re.subn(pattern, lambda _: new, page, count=1)
    if not found:
        raise SystemExit("post.html is missing a tag this build needs: " + pattern)
    return page


def set_meta(page, attr, name, value):
    return set_tag(page, r'<meta %s="%s" content="[^"]*">' % (attr, re.escape(name)),
                   '<meta %s="%s" content="%s">' % (attr, name, esc(value)))


def article(post, posts):
    tags = "".join("<span>%s</span>" % esc(t) for t in post.get("tags") or [])
    meta = ""
    if post.get("date"):
        meta += "<b>%s</b>" % esc(nice_date(post["date"]))
    if post.get("author"):
        meta += "By " + esc(post["author"])
    if tags:
        meta += '<div class="bp-tags">%s</div>' % tags
    lede = '<p class="bp-lede">%s</p>' % esc(post["excerpt"]) if post.get("excerpt") else ""
    out = '<header class="bp-head"><div class="bp-meta">%s</div><div><h1>%s</h1>%s</div></header>' % (
        meta, esc(post["title"]), lede)
    if post.get("image"):
        out += '<figure class="bp-hero"><img src="%s" alt="%s"></figure>' % (
            esc(post["image"]), esc(post.get("image_alt") or post["title"]))
    body = post.get("body") or "<p>%s</p>" % esc(post.get("excerpt"))
    out += '<div class="bp-body"><article class="bp-article">%s</article></div>' % body
    others = [p for p in posts if p["slug"] != post["slug"]][:3]
    if others:
        items = "".join('<li><a href="/posts/%s"><b>%s</b><span>%s</span></a></li>' % (
            p["slug"], esc(p["title"]), esc(nice_date(p["date"])) if p.get("date") else "") for p in others)
        out += ('<section class="bp-more" aria-label="More posts"><div class="bp-more-head">'
                "<h2>More From the Blog</h2></div><ul>%s</ul></section>" % items)
    return out


def structured_data(post, title, description, url, image):
    data = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post["title"],
        "description": description,
        "image": image,
        "datePublished": post.get("date"),
        "dateModified": (post.get("updated_at") or post.get("date") or "")[:10],
        "author": {"@type": "Organization", "name": post.get("author") or "PFX Team"},
        "publisher": {"@type": "Organization", "name": "PFX",
                      "logo": {"@type": "ImageObject", "url": SITE + "/assets/pfx-light.png"}},
        "mainEntityOfPage": url,
    }
    return json.dumps(data, ensure_ascii=False).replace("</", "<\\/")


def build_page(template, post, posts):
    url = "%s/posts/%s" % (SITE, post["slug"])
    title = post.get("seo_title") or post["title"] + " | PFX Blog"
    description = post.get("seo_description") or post.get("excerpt") or ""
    page = template.replace("<head>", '<head>\n<base href="/">', 1)
    page = set_tag(page, r"<title>[^<]*</title>", "<title>%s</title>" % esc(title))
    page = set_tag(page, r'<link rel="canonical" href="[^"]*">', '<link rel="canonical" href="%s">' % url)
    page = set_meta(page, "name", "description", description)
    page = set_meta(page, "property", "og:type", "article")
    page = set_meta(page, "property", "og:title", title)
    page = set_meta(page, "property", "og:description", description)
    page = set_meta(page, "property", "og:url", url)
    page = set_meta(page, "name", "twitter:title", title)
    page = set_meta(page, "name", "twitter:description", description)
    image = re.search(r'<meta property="og:image" content="([^"]*)">', page).group(1)
    if post.get("image"):
        image = absolute(post["image"])
        page = set_meta(page, "property", "og:image", image)
        page = set_meta(page, "name", "twitter:image", image)
        page = set_meta(page, "property", "og:image:alt", post.get("image_alt") or post["title"])
        page = re.sub(r'<meta property="og:image:(width|height)" content="[^"]*">\n?', "", page)
    extra = '<script type="application/ld+json">%s</script>\n' % structured_data(post, title, description, url, image)
    if post.get("date"):
        extra = '<meta property="article:published_time" content="%s">\n' % esc(post["date"]) + extra
    page = page.replace("</head>", extra + "</head>", 1)
    return page.replace("</main>", article(post, posts) + "</main>", 1)


def update_sitemap(path, posts):
    xml = path.read_text(encoding="utf-8")
    old = re.compile(r"[ \t]*<url>\s*<loc>[^<]*/posts?(?:\?p=|/)[^<]*</loc>.*?</url>\n", re.S)
    first = old.search(xml)
    at = first.start() if first else xml.index("</urlset>")
    entries = "".join(
        "  <url>\n    <loc>%s/posts/%s</loc>\n    <lastmod>%s</lastmod>\n    <changefreq>monthly</changefreq>\n  </url>\n"
        % (SITE, p["slug"], (p.get("updated_at") or p.get("date"))[:10]) for p in posts)
    xml = old.sub("", xml[:at]) + entries + old.sub("", xml[at:])
    path.write_text(xml, encoding="utf-8")


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    root = Path(argv[1])
    if "--posts" in argv:
        posts = json.loads(Path(argv[argv.index("--posts") + 1]).read_text(encoding="utf-8"))
    else:
        try:
            posts = fetch_posts()
        except (urllib.error.URLError, OSError) as err:
            print("Couldn't read blog posts from Supabase: %s" % err)
            return 1
    posts = [p for p in posts if SLUG.match(p.get("slug") or "")]
    if not posts:
        print("no published posts in Supabase, so the built-in blog stays as it is")
        return 0
    template = (root / "post.html").read_text(encoding="utf-8")
    folder = root / "posts"
    shutil.rmtree(folder, ignore_errors=True)
    folder.mkdir()
    for post in posts:
        (folder / (post["slug"] + ".html")).write_text(build_page(template, post, posts), encoding="utf-8")
    update_sitemap(root / "sitemap.xml", posts)
    print("built %d post pages" % len(posts))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
