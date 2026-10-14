import type { PageTypographyRecipe } from "./pageTypography";

/* The Kage recipe, taken unchanged from ThreeUI's pageRecipes.ts. The other
   pages' recipes (Sylva, Complete Shelf, Bestsellers) are left out. */

const n = (value: number) => Number(value.toFixed(3));
const px = (value: number) => `${n(value)}px`;

export const KAGE_TYPOGRAPHY: PageTypographyRecipe = {
  "headingFonts": [
    {
      "value": "onest",
      "label": "Onest",
      "stack": "'Onest', system-ui, -apple-system, 'Helvetica Neue', sans-serif"
    },
    {
      "value": "instrument-serif",
      "label": "Instrument Serif",
      "stack": "\"Instrument Serif\", Georgia, serif",
      "google": "Instrument+Serif"
    },
    {
      "value": "newsreader",
      "label": "Newsreader",
      "stack": "\"Newsreader\", Georgia, serif",
      "google": "Newsreader:wght@200..700"
    },
    {
      "value": "geist",
      "label": "Geist",
      "stack": "\"Geist\", system-ui, -apple-system, \"Segoe UI\", Helvetica, Arial, sans-serif",
      "google": "Geist:wght@100..900"
    }
  ],
  "bodyFonts": [
    {
      "value": "onest",
      "label": "Onest",
      "stack": "'Onest', system-ui, -apple-system, 'Helvetica Neue', sans-serif"
    },
    {
      "value": "geist",
      "label": "Geist",
      "stack": "\"Geist\", system-ui, -apple-system, \"Segoe UI\", Helvetica, Arial, sans-serif",
      "google": "Geist:wght@100..900"
    },
    {
      "value": "newsreader",
      "label": "Newsreader",
      "stack": "\"Newsreader\", Georgia, serif",
      "google": "Newsreader:wght@200..700"
    },
    {
      "value": "instrument-serif",
      "label": "Instrument Serif",
      "stack": "\"Instrument Serif\", Georgia, serif",
      "google": "Instrument+Serif"
    }
  ],
  "headingWeights": [
    "400",
    "500",
    "600",
    "700"
  ],
  "headingWeight": "400",
  "bodyWeights": [
    "300",
    "400",
    "500",
    "600"
  ],
  "bodyWeight": "300",
  "primaryColor": "#e0231c",
  "headingSize": [
    30,
    46,
    72
  ],
  "bodySize": [
    13,
    17,
    24
  ],
  "headingLetterSpacing": [
    -0.06,
    -0.012,
    0.12
  ],
  css: (type) => `
:root {
  --vermilion: ${type.primary};
  --ember: ${type.retone("#ff5a3c")};
}
body { font-family: ${type.body}; }
body, .body, .body-lg, .num { font-weight: ${type.bodyWeight}; }
h1:not(.jp), h2:not(.jp), h3:not(.jp), .display:not(.jp) {
  font-family: ${type.heading};
  font-weight: ${type.headingWeight};
}
.display { letter-spacing: ${type.headingLetterSpacing}em; }
.h-hero { font-size: clamp(26px, 3.05vw, ${px(type.headingSize)}); }
.h-sec { font-size: clamp(30px, 4vw, ${px(type.headingSize * 60 / 46)}); }
.body-lg { font-size: clamp(14px, 1.02vw, ${px(type.bodySize)}); }
.body { font-size: ${px(Math.max(11, type.bodySize - 3))}; }
`
};
