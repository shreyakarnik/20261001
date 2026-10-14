import { lazy, Suspense } from "react";
import "./effects/kage-landing-page/styles.css";

/* Only the small React host is lazy-loaded. The page itself is never imported
   into the JavaScript graph: it is served as a static file from
   public/landing-pages/kage.html and loaded by the iframe. */
const KageLandingPage = lazy(() =>
  import("./effects/kage-landing-page/KageLandingPage").then((module) => ({ default: module.KageLandingPage })),
);

export function Scene() {
  return (
    <div className="shader-frame">
      <Suspense fallback={null}>
        <KageLandingPage
          headingFont="onest"
          bodyFont="onest"
          headingWeight="400"
          bodyWeight="300"
          primaryColor="#e0231c"
          headingSize={46}
          bodySize={17}
          headingLetterSpacing={-0.012}
        />
      </Suspense>
    </div>
  );
}
