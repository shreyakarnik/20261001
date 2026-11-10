"""Build the PFX documentation hub from the parsed PizzaForno documentation (docs.json).

Usage: python3 -I build_docs.py docs.json <landing-pages dir>
"""
import sys, os, re, json, html

SRC, SITE = sys.argv[1], sys.argv[2]
d = json.load(open(SRC))
OUT = os.path.join(SITE, 'documentation')
os.makedirs(OUT, exist_ok=True)

def newslug(s):
    return re.sub(r'pizzaforno', 'pfx', s)

# the sidebar, as on the source site; (label, source slug, sub-items)
NAV = [
    ('Introduction to PFX', [('Automated Pizza Vending', 'pioneering-the-future-of-automated-pizza-vending'),
                             ('Documentation Guide', 'pizzaforno-documentation-guide')]),
    ('Growth and Trends', [('Pizza Market Growth', 'global-pizza-market-growth-and-pizzaforno'),
                           ('QSR and Intelligent Vending', 'the-rise-of-qsr-and-intelligent-vending-opportunities-for-pizzaforno')]),
    ('Mechanics of PFX', [('How It Works', 'how-our-pizza-vending-machine-works'),
                          ('Storage, Cooking, Delivery', 'pizzaforno-storage-cooking-and-delivery-system')]),
    ('Pizza Vending Solutions', [('Our Vending Technology', 'pizzaforno-advanced-vending-technology'),
                                 ('Technical Specifications', 'technical-specifications-of-pizzaforno-units'),
                                 ('Machine Safety Protocols', 'pizzaforno-machine-safety-protocols'),
                                 ('Vending Machine Options', 'exploring-pizzaforno-machine-options'),
                                 ('ATM Pizza Machine', 'pizzaforno-atm-pizza-vending-machine', 1),
                                 ('Outdoor Pizza Machine', 'pizzaforno-outdoor-pizza-vending-machine', 1),
                                 ('Indoor Pizza Machine', 'pizzaforno-indoor-pizza-vending-machine', 1)]),
    ('Licensing Opportunities', [('Licensing Overview', 'overview-of-pizzaforno-licensing-opportunities'),
                                 ('Getting Started', 'getting-started-as-a-pizzaforno-licensee'),
                                 ('Onboarding Process', 'pizzaforno-licensing-onboarding-process-and-information'),
                                 ('Investment Breakdown', 'pizzaforno-licensing-investment-breakdown')]),
    ('Operational Insights', [('Owning a Machine', 'operational-insights-owning-a-pizzaforno-machine'),
                              ('Supply Chain', 'the-pizzaforno-supply-chain'),
                              ('Machine Stocking Process', 'pizzaforno-machine-stocking-process'),
                              ('Remote Management', 'pizzaforno-real-time-monitoring-remote-management-software'),
                              ('Food-Safe Area', 'setting-up-a-food-safe-area')]),
    ('Pizza Timeline', [('Evolution Of Our Pizza', 'pizza-timeline-the-evolution-of-our-pizza')]),
    ('Why Choose PFX', [('Marketing & Support', 'marketing-customer-service-support-at-pizzaforno'),
                        ('Our Competitive Advantage', 'pizzaforno-benefits-and-competitive-advantage'),
                        ('NAMA & UL Approved', 'nama-ul-approval-for-pizzaforno-pizza-vending-machines'),
                        ('PFX vs. Competitors', 'pizzaforno-vs-competitors'),
                        ('Licensee Testimonials', 'testimonials'),
                        ('Loyalty Program & App', 'loyalty-program-and-mobile-app')]),
    ('PFX Summary', [('Overview of PFX', 'overview-of-pizzaforno'),
                     ('PFX FAQs', 'pizzaforno-faqs'),
                     ('Becoming a Licensee', 'becoming-a-pizzaforno-licensee'),
                     ('Envisioning the Future', 'envisioning-the-future-with-pizzaforno')]),
]
ORDER = ['index'] + [it[1] for _, items in NAV for it in items]
assert set(ORDER) == set(d), set(d) ^ set(ORDER)
LABEL = {it[1]: it[0] for _, items in NAV for it in items}
LABEL['index'] = 'Documentation Home'

def url(slug):
    return '/documentation' if slug == 'index' else '/documentation/' + newslug(slug)

APPLY = 'https://www.poweredbypfx.com/#inquiry'

def clean(slug, h):
    # the source's "Jump to section" anchors inside headings
    h = re.sub(r'(<h[1-4][^>]*>)(.*?)(</h[1-4]>)',
               lambda m: m.group(1) + re.sub(r'<a [^>]*>.*?</a>', '', m.group(2)).strip() + m.group(3), h)
    h = re.sub(r'<h[1-4][^>]*>(?:\s|<strong>|</strong>|<br>)*</h[1-4]>', '', h)      # empty headings
    h = re.sub(r'<p>\s*</p>', '', h)

    # Brand Ambassador and Pizza With a Purpose: removed entirely
    if slug == 'index':
        h = re.sub(r'\s*If you are passionate about representing our brand, apply to be a <a [^>]*>Brand Ambassador</a>\.', '', h)
        h = re.sub(r'\s*Additionally, learn how to join our community-focused initiatives through the <a [^>]*>Pizza With a Purpose Application</a>\.', '', h)
        h = re.sub(r'<p>Brand Ambassador Application:.*?</p>', '', h)
        h = re.sub(r'<p>Pizza With a Purpose Application:.*?</p>', '', h)
    h = re.sub(r'<h2 id="innovative-brand-ambassador-program">.*?(?=<h2)', '', h)     # marketing & support
    h = re.sub(r'<h3 id="brand-ambassador-program">.*?(?=<h[23])', '', h)               # vs. competitors

    # links: the hub's own pages, the application form and contact on this site
    def link(m):
        href = html.unescape(m.group(1))
        mm = re.match(r'(?:https://pizzaforno\.com)?/documentation/?([^#]*)(#.*)?$', href)
        if mm:
            s = mm.group(1) or 'index'
            frag = newslug(mm.group(2) or '')
            return 'href="%s%s"' % (url(s) if s in d else '/documentation', frag)
        if re.match(r'https://pizzaforno\.com/(inquiry|licensing)/?$', href):
            return 'href="%s"' % APPLY
        if re.match(r'https://pizzaforno\.com/contact/?$', href):
            return 'href="/contact"'
        if href.startswith('http'):
            return 'href="%s" target="_blank" rel="noopener"' % html.escape(href)
        return m.group(0)
    h = re.sub(r'href="([^"]*)"', link, h)
    # the same addresses where they are written out as text
    h = h.replace('https://pizzaforno.com/inquiry', APPLY).replace('https://pizzaforno.com/licensing', APPLY)
    h = h.replace('https://pizzaforno.com/contact', 'https://www.poweredbypfx.com/contact')
    # bare text addresses become links
    h = re.sub(r'(?<![">/])(https://www\.poweredbypfx\.com/(?:#inquiry|contact))(?![^<]*</a>)', r'<a href="\1">\1</a>', h)

    # the brand, in text and anchor ids; the remaining pizzaforno.com address (the app download page) stays real
    h = h.replace('pizzaforno.com/apps', '\0APPS\0')
    h = re.sub(r'(id="|#)([^"]*)', lambda m: m.group(1) + newslug(m.group(2)), h)
    parts = re.split(r'(<[^>]+>)', h)
    parts = [p if p.startswith('<') else re.sub(r'Pizza ?Forno', 'PFX', p, flags=re.I) for p in parts]
    h = ''.join(parts).replace('\0APPS\0', 'pizzaforno.com/apps')

    # media
    h = re.sub(r'<img src="([^"]*)" alt="([^"]*)">',
               lambda m: '<figure class="doc-fig"><img src="%s" alt="%s" loading="lazy"></figure>' % (m.group(1).replace('tr=w-550', 'tr=w-1200'), m.group(2)), h)
    h = re.sub(r'<iframe src="([^"]*)"></iframe>',
               r'<div class="doc-video"><iframe src="\1" title="Video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>', h)
    h = re.sub(r'<table>', '<div class="doc-table"><table>', h).replace('</table>', '</table></div>')
    return h.strip()

pages = {s: clean(s, d[s]) for s in ORDER}
for s, h in pages.items():
    low = re.sub(r'<[^>]+>', ' ', h).lower()
    assert 'ambassador' not in low and 'with a purpose' not in low, s
    assert not re.search(r'pizza ?forno', re.sub(r'pizzaforno\.com/apps', '', low)), s

# ---- the page around the content, from the privacy policy page ----
tpl = open(os.path.join(SITE, 'privacy-policy.html')).read()
head_a, head_b = tpl.index('<!-- pfx:head -->'), tpl.index('<!-- /pfx:head -->') + len('<!-- /pfx:head -->')
body_a, body_b = tpl.index('<div class="policy-layout">'), tpl.index('<footer>')
script_a = tpl.index('<script>', body_a)
toc_script = tpl[script_a:tpl.index('</script>', script_a) + 9]

CSS = '''
  /* DOCUMENTATION: section nav, the page, and its "On this page" list */
  .doc-layout{ max-width:1320px; margin:0 auto; padding:0 24px; display:grid; grid-template-columns:240px minmax(0,1fr) 230px; gap:48px; align-items:start; }
  .doc-side{ position:sticky; top:110px; margin-top:64px; max-height:calc(100vh - 140px); overflow-y:auto; scrollbar-width:thin; padding-right:6px; }
  .doc-side summary{ display:none; }
  .doc-side h4{ font-size:12px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#fff; margin:22px 0 8px; }
  .doc-side h4:first-of-type{ margin-top:0; }
  .doc-side ul{ list-style:none; margin:0; padding:0; }
  .doc-side a{ display:block; padding:5px 0 5px 12px; font-size:14px; color:rgba(255,255,255,.82); border-left:1px solid rgba(255,255,255,.14); }
  .doc-side li.sub a{ padding-left:26px; }
  .doc-side a:hover{ color:#fff; }
  .doc-side a.on{ color:#fff; font-weight:600; border-left:2px solid #c00022; }
  .doc-side .home{ border-left:0; padding-left:0; margin-bottom:6px; font-weight:600; color:#fff; }
  .doc-main{ min-width:0; }
  .doc-main .toc{ display:none; }
  .doc-crumb{ margin-top:64px; font-size:13px; letter-spacing:.12em; text-transform:uppercase; color:rgba(255,255,255,.82); }
  .doc-crumb a:hover{ color:#fff; }
  article.policy.doc h1{ font-size:40px; font-weight:600; letter-spacing:-.5px; color:#fff; margin:12px 0 18px; line-height:1.15; scroll-margin-top:120px; }
  article.policy.doc{ margin-top:0; }
  .policy table{ width:100%; border-collapse:collapse; font-size:14.5px; }
  .doc-table{ overflow-x:auto; margin:8px 0 24px; border:1px solid rgba(255,255,255,.14); }
  .policy th, .policy td{ text-align:left; vertical-align:top; padding:12px 14px; border-bottom:1px solid rgba(255,255,255,.1); border-right:1px solid rgba(255,255,255,.08); }
  .policy th{ color:#fff; font-weight:600; background:rgba(255,255,255,.04); }
  .policy td p, .policy th p{ margin:0; }
  .doc-fig{ margin:10px 0 26px; }
  .doc-fig img{ display:block; width:100%; height:auto; }
  .doc-video{ position:relative; aspect-ratio:16/9; margin:10px 0 26px; background:#111; }
  .doc-video iframe{ position:absolute; inset:0; width:100%; height:100%; border:0; }
  .doc-lede{ font-size:18px; color:rgba(255,255,255,.82); max-width:60ch; margin-bottom:22px; }
  .doc-start{ display:inline-block; background:#c00022; color:#fff !important; text-decoration:none !important; padding:12px 22px; font-weight:600; font-size:15px; }
  .doc-pager{ display:grid; grid-template-columns:1fr 1fr; gap:16px; margin:8px 0 80px; }
  .doc-pager a{ display:block; padding:16px 18px; border:1px solid rgba(255,255,255,.16); color:#fff; }
  .doc-pager a:hover{ border-color:#fff; }
  .doc-pager span{ display:block; font-size:13px; color:rgba(255,255,255,.82); margin-bottom:4px; }
  .doc-pager .next{ text-align:right; grid-column:2; }
  @media (max-width:1180px){ .doc-layout{ grid-template-columns:220px minmax(0,1fr); } .doc-layout > .toc{ display:none; } }
  @media (max-width:900px){
    .doc-layout{ grid-template-columns:1fr; gap:0; }
    .doc-side{ position:static; max-height:none; margin-top:24px; border:1px solid rgba(255,255,255,.14); padding:14px 16px; }
    .doc-side summary{ display:flex; justify-content:space-between; align-items:center; cursor:pointer; font-size:16px; font-weight:600; color:#fff; list-style:none; }
    .doc-side summary::-webkit-details-marker{ display:none; }
    .doc-side summary::after{ content:""; width:8px; height:8px; border-right:2px solid currentColor; border-bottom:2px solid currentColor; transform:rotate(45deg); margin:-4px 4px 0 0; }
    .doc-side[open] summary{ margin-bottom:14px; }
    .doc-side[open] summary::after{ transform:rotate(-135deg); margin-top:4px; }
    .doc-crumb{ margin-top:32px; }
    article.policy.doc h1{ font-size:30px; }
    .doc-pager{ grid-template-columns:1fr; }
    .doc-pager .next{ grid-column:1; }
  }
'''

def side(cur):
    out = ['<details class="doc-side" id="docSide" open><summary>Documentation</summary>',
           '<a class="home%s" href="/documentation">Documentation Home</a>' % (' on' if cur == 'index' else '')]
    for group, items in NAV:
        out.append('<h4>%s</h4><ul>' % html.escape(group))
        for it in items:
            sub = ' class="sub"' if len(it) > 2 else ''
            on = ' class="on" aria-current="page"' if it[1] == cur else ''
            out.append('<li%s><a%s href="%s">%s</a></li>' % (sub, on, url(it[1]), html.escape(it[0])))
        out.append('</ul>')
    out.append('</details>')
    # phones: the section list starts folded so the page itself comes first
    out.append("<script>if (matchMedia('(max-width: 900px)').matches) document.getElementById('docSide').open = false;</script>")
    return '\n'.join(out)

def toc(h):
    items = []
    for lvl, i, t in re.findall(r'<h([1-3]) id="([^"]+)">(.*?)</h\1>', h):
        t = re.sub(r'<[^>]+>', '', t).strip()
        if not t: continue
        items.append('    <li%s><a href="#%s">%s</a></li>' % (' class="sub"' if lvl == '3' else '', i, t))
    return '<details class="toc" open>\n  <summary>On this page</summary>\n  <div class="toc-scroll">\n  <ol>\n%s\n  </ol>\n  </div>\n</details>' % '\n'.join(items)

def text_of(h):
    return html.unescape(re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', h))).strip()

def esc_attr(s):
    return html.escape(s, quote=True)

sitemap = []
for n, s in enumerate(ORDER):
    h = pages[s]
    if s == 'index':
        h = ('<h1 id="pfx-documentation">PFX Documentation</h1>'
             '<p class="doc-lede">Learn all about PFX with our comprehensive guide, covering everything from our unique business model and licensing process to the intricacies of our machines.</p>'
             '<p><a class="doc-start" href="#purpose-of-the-documentation">Get started</a></p>'
             '<figure class="doc-fig"><img src="https://ik.imagekit.io/cr32zgyto/20/1720121553664_LOAGFs3DF.jpg?tr=w-1600" alt="A pizza vending kiosk"></figure>' + h)
        title = 'Pizza Vending Machine Documentation: Business Model, Specs & FAQs | PFX'
    else:
        t = re.search(r'<h1[^>]*>(.*?)</h1>', h)
        title = (text_of(t.group(1)) if t else LABEL[s]) + ' | PFX Documentation'
    first_p = re.search(r'<p(?: class="doc-lede")?>(.*?)</p>', h)
    desc = text_of(first_p.group(1)) if first_p else title
    if len(desc) > 158: desc = desc[:155].rsplit(' ', 1)[0] + '…'
    group = next((g for g, items in NAV if any(it[1] == s for it in items)), None)
    crumb = '<div class="doc-crumb"><a href="/documentation">Documentation</a>%s</div>' % (' &middot; ' + html.escape(group) if group else '')
    prev_s = ORDER[n - 1] if n > 0 else None
    next_s = ORDER[n + 1] if n + 1 < len(ORDER) else None
    pager = '<nav class="doc-pager" aria-label="Documentation pages">%s%s</nav>' % (
        '<a class="prev" href="%s"><span>&larr; Previous</span>%s</a>' % (url(prev_s), html.escape(LABEL[prev_s])) if prev_s else '',
        '<a class="next" href="%s"><span>Next &rarr;</span>%s</a>' % (url(next_s), html.escape(LABEL[next_s])) if next_s else '')
    body = ('<div class="doc-layout">\n%s\n<div class="doc-main">\n%s\n<article class="policy doc">\n%s\n</article>\n%s\n</div>\n%s\n</div>\n\n%s\n\n'
            % (side(s), crumb, h, pager, toc(h), toc_script))

    page = tpl[:head_a] + tpl[head_a:head_b] + tpl[head_b:body_a] + body + tpl[body_b:]
    canon = 'https://www.poweredbypfx.com' + url(s)
    page = page.replace('Privacy Policy | PFX', esc_attr(title))
    page = re.sub(r'https://www\.poweredbypfx\.com/privacy-policy', canon, page)
    old_desc = re.search(r'<meta name="description" content="([^"]*)"', page).group(1)
    page = page.replace(old_desc, esc_attr(desc))
    page = page.replace('</style>', CSS + '</style>', 1)
    # pages live one folder down: every site path from the root
    page = re.sub(r'(href|src)="(?!https?:|/|#|mailto:|tel:|data:)([^"]+)"', r'\1="/\2"', page)
    page = page.replace('<a href="/#">Documentation</a>', '<a href="/documentation">Documentation</a>')
    page = page.replace('<a href="#">Documentation</a>', '<a href="/documentation">Documentation</a>')
    fn = 'index.html' if s == 'index' else newslug(s) + '.html'
    open(os.path.join(OUT, fn), 'w').write(page)
    sitemap.append(canon)
    print(fn, len(page))
open(os.path.join(SRC + '.urls'), 'w').write('\n'.join(sitemap))
