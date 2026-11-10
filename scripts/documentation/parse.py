"""Parse the downloaded PizzaForno documentation pages into clean article HTML.

Usage: python3 -I parse.py <folder of downloaded .html pages> <output .json>
Keeps headings, text, lists, tables, images and YouTube embeds from each page's
<article>; drops scripts, icons and navigation. Run by run.sh.
"""
import sys, os, re, json, html
from html.parser import HTMLParser
KEEP_BLOCK={'h1','h2','h3','h4','p','ul','ol','li','table','thead','tbody','tr','th','td','blockquote','figure','figcaption','hr'}
INLINE={'a','strong','b','em','i','br','code'}
class P(HTMLParser):
    def __init__(s):
        super().__init__(convert_charrefs=True); s.out=[]; s.depth=0; s.on=False; s.skip=0
    def handle_starttag(s,t,a):
        a=dict(a)
        if t=='article' and not s.on: s.on=True; s.adepth=0; return
        if not s.on: return
        if t in('script','style','svg','nav'): s.skip+=1; return
        if s.skip: return
        if t=='iframe':
            s.out.append(f'<iframe src="{html.escape(a.get("src",""))}"></iframe>'); return
        if t=='img':
            src=a.get('src','');
            if src: s.out.append(f'<img src="{html.escape(src)}" alt="{html.escape(a.get("alt",""))}">')
            return
        if t in KEEP_BLOCK:
            idt=f' id="{html.escape(a["id"])}"' if t in('h1','h2','h3','h4') and a.get('id') else ''
            sp=''
            if t in('td','th'):
                for k in('colspan','rowspan'):
                    if a.get(k): sp+=f' {k}="{a[k]}"'
            s.out.append(f'<{t}{idt}{sp}>')
        elif t in INLINE:
            if t=='a': s.out.append(f'<a href="{html.escape(a.get("href",""))}">')
            elif t=='br': s.out.append('<br>')
            else: s.out.append(f'<{ {"b":"strong","i":"em"}.get(t,t)}>')
    def handle_endtag(s,t):
        if not s.on: return
        if t=='article': s.on=False; return
        if t in('script','style','svg','nav'): s.skip=max(0,s.skip-1); return
        if s.skip: return
        if t in KEEP_BLOCK and t not in('hr',): s.out.append(f'</{t}>')
        elif t in INLINE and t!='br': s.out.append(f'</{ {"b":"strong","i":"em"}.get(t,t)}>')
    def handle_data(s,d):
        if s.on and not s.skip: s.out.append(html.escape(d))
res={}
for f in sorted(os.listdir(sys.argv[1])):
    p=P(); p.feed(open(os.path.join(sys.argv[1],f)).read())
    h=''.join(p.out)
    h=re.sub(r'\s+',' ',h)
    res[f[:-5]]=h
    title=re.search(r'<h1[^>]*>(.*?)</h1>',h)
    print(f[:-5][:50].ljust(52), len(h), (title.group(1) if title else '?')[:60])
json.dump(res,open(sys.argv[2],'w'))
