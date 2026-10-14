# Kage landing page

A standalone copy of ThreeUI's `<KageLandingPage />`, built from its original source so you can turn it into your own version. It does not depend on the `@designcodeio/threeui` package.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

- `npm run build` type-checks and builds to `dist/`.
- `npm run verify:assets` checks the page and its 16 assets against the original ThreeUI hashes.

**Quick look without installing anything:** double-click `index.html`. Opened from disk it forwards to `public/landing-pages/kage.html`, which runs on its own. The one thing missing that way is the rippling cloth effect on the three garden cards (the browser blocks it on `file://`, so the cards show as still images); the dev server gives you the complete page plus the prop controls.

## How it is put together

```
index.html                       Vite entry
src/
  main.tsx                       mounts <Scene />
  Scene.tsx                      the configured <KageLandingPage /> usage
  app.css                        sizes .shader-frame to the viewport
  effects/kage-landing-page/
    KageLandingPage.tsx          React host: a sandboxed full-size iframe
    pageTypography.ts            font / weight / colour / size controls
    pageRecipes.ts               the Kage recipe: which CSS each control rewrites
    styles.css                   the shared frame rule
public/landing-pages/
  kage.html                      the whole experience (HTML + CSS + Three.js scene)
  secret-pathways-assets/
    three.min.js                 local Three.js runtime
    fonts.css                    Onest, Noto JP and the wordmark face, embedded
    generated/*.webp             4 card / preview stills
    foreground/png/*.webp        10 foreground cut-outs
```

Two layers do the work:

1. **`kage.html` is the page.** It is one self-contained document: the markup, all the CSS, and a single inline script that builds the temple scene at runtime (procedural textures, the hall, torii, moon, lanterns, maples, leaf fall, cursor wisps, cloth cards, bloom and grading) and wires scroll to the camera path. It makes no network requests beyond its own folder.
2. **The React host only frames it.** `KageLandingPage` renders an iframe pointing at `/landing-pages/kage.html`. Once the frame loads, `applyPageCustomization` appends one `<style>` to the frame's `<head>` that restates the page's own selectors with your prop values. The HTML file itself is never rewritten.

## Making it your own

**Quick changes — props in `src/Scene.tsx`:**

| Prop | Options |
| --- | --- |
| `headingFont` | `onest`, `instrument-serif`, `newsreader`, `geist` |
| `bodyFont` | `onest`, `geist`, `newsreader`, `instrument-serif` |
| `headingWeight` | `400`, `500`, `600`, `700` |
| `bodyWeight` | `300`, `400`, `500`, `600` |
| `primaryColor` | any hex; drives `--vermilion` and the ember tint |
| `headingSize` | 30–72 (px ceiling) |
| `bodySize` | 13–24 |
| `headingLetterSpacing` | -0.06 to 0.12 (em) |

Fonts other than Onest are fetched from Google Fonts when chosen. The colour prop recolours the DOM accents only; the 3D scene's reds (moon, torii, lanterns) are set inside the scene script.

**Deeper changes — edit `public/landing-pages/kage.html` directly:**

- Copy, chapter names, nav links, footer: the markup between `<body>` and the first `<script>`.
- Palette and spacing: the `:root` tokens at the top of the `<style>` block.
- Section layouts: the `data-layout-*="b"` attributes on `<body>`. Remove one to fall back to that section's base layout.
- The wordmark: `const word = 'KAGE'` in `buildWordmark()`. The embedded wordmark font only contains the glyphs it needs, so a different word needs a different font.
- Camera path: the `CAM` array (one waypoint per section).
- Scene objects: `buildTemple`, `buildTorii`, `buildMoon`, `buildLantern`, `buildMaple`, `buildForeground`, `buildAtmosphere`.
- Images: replace files in `secret-pathways-assets/` keeping the same names, or change the paths in the HTML.

Useful debug switches when opening `/landing-pages/kage.html` directly: `?q=low`, `?post=0`, `?shadow=0`, `?nogl=1` (static fallback), `?shot=0`…`5` (jump to a chapter with everything revealed).

Once you edit `kage.html`, `npm run verify:assets` will report it as changed. That is expected.

## Where the source came from

- `kage.html`, `fonts.css`, `three.min.js` and all 14 `.webp` files were copied from the published npm package `@designcodeio/threeui@1.2.0` and match the SHA-256 values in the ThreeUI integration brief exactly.
- `pageTypography.ts` is byte-identical to the registered source.
- `KageLandingPage.tsx` and `pageRecipes.ts` come from the public repository (github.com/MengTo/threeui) and are trimmed to the Kage page only. The public files differ from the private revision hashed in the brief, so these two are faithful to the published source rather than hash-identical to that revision.

## License

ThreeUI Community is MIT licensed (© 2026 Meng To). The original license and the font, asset and third-party notices are in `licenses/`. Keep them with the project if you publish or share it.
