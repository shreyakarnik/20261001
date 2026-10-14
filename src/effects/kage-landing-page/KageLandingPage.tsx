import { useEffect, useRef, useState, type CSSProperties } from "react";
import { applyPageCustomization, splitTypographyProps, usePageTypography, type LandingPageCustomization, type PageTypographyProps } from "./pageTypography";
import { KAGE_TYPOGRAPHY } from "./pageRecipes";

/* Local copy of ThreeUI's landing-page host (src/shaders/landing-pages/LandingPages.tsx),
   reduced to the Kage page. The frame and the customization contract are unchanged. */

export type LandingPageFrameProps = { className?: string; sourceUrl: string; srcDoc?: string; style?: CSSProperties; title: string; customization?: LandingPageCustomization };
export type LandingPageProps = Omit<LandingPageFrameProps, "sourceUrl" | "title" | "customization">;
const FRAME_SANDBOX = "allow-downloads allow-forms allow-modals allow-popups allow-same-origin allow-scripts";

export function LandingPageFrame({ className = "", customization, sourceUrl, srcDoc, style, title }: LandingPageFrameProps) {
  const [ready, setReady] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => { applyPageCustomization(frameRef.current, customization); }, [customization]);
  return <div className={`threeui-background landing-page-frame${className ? ` ${className}` : ""}`} data-state={ready ? "ready" : "loading"} style={{ position: "relative", overflow: "hidden", background: "#080808", pointerEvents: "auto", ...style }}>
    <iframe ref={frameRef} title={title} {...(srcDoc ? { srcDoc } : { src: sourceUrl })} sandbox={FRAME_SANDBOX} loading="eager" onLoad={(event) => { applyPageCustomization(event.currentTarget, customization); setReady(true); }} style={{ position: "absolute", inset: 0, display: "block", width: "100%", height: "100%", border: 0, background: "#080808" }} />
  </div>;
}

export function KageLandingPage(props: LandingPageProps & PageTypographyProps) {
  const [type, frame] = splitTypographyProps(props);
  const customization = usePageTypography(KAGE_TYPOGRAPHY, type);
  return <LandingPageFrame {...frame} customization={customization} title="PFX — Where stillness reveals the unseen" sourceUrl={`${import.meta.env.BASE_URL}landing-pages/kage.html`} />;
}
