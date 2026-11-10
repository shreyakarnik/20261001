#!/bin/sh
# Rebuild /documentation from https://pizzaforno.com/documentation.
#
#   sh scripts/documentation/run.sh
#
# 1. downloads every documentation page into a temporary folder (never the repo),
# 2. parse.py pulls the article out of each page,
# 3. build.py rebrands it to PFX, removes the Brand Ambassador and Pizza With a
#    Purpose content, and writes public/landing-pages/documentation/*.html.
# The sidebar and page list live in NAV at the top of build.py: a page added on
# pizzaforno.com needs adding there too. Add the new URLs to sitemap.xml by hand.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
SITE="$HERE/../../public/landing-pages"
TMP=$(mktemp -d)
mkdir "$TMP/src"
SLUGS=$(python3 -I -c "import re,sys; print(' '.join(dict.fromkeys(re.findall(r\"\\('[^']*', '([a-z0-9-]+)'\", open(sys.argv[1]).read()))))" "$HERE/build.py")
curl -sfL -A "Mozilla/5.0" "https://pizzaforno.com/documentation" -o "$TMP/src/index.html"
for s in $SLUGS; do
  curl -sfL -A "Mozilla/5.0" "https://pizzaforno.com/documentation/$s" -o "$TMP/src/$s.html"
  sleep 0.3
done
python3 -I "$HERE/parse.py" "$TMP/src" "$TMP/docs.json"
python3 -I "$HERE/build.py" "$TMP/docs.json" "$SITE"
rm -rf "$TMP"
