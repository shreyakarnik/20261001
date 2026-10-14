/* =========================================================
   PFX ANALYTICS
   -------------------------------------------------------
   Loads three free tools on every page:
     - Google Analytics (GA4) — visit counts, traffic sources,
       which pages people view, how long they stay.
     - Microsoft Clarity — heatmaps + anonymized session
       recordings showing what people actually click and how
       they scroll/move through each page.
     - HubSpot tracking code — ties anonymous site visits to
       the same contacts who fill out your HubSpot forms (Let's
       Talk, ROI calculator gate), so a lead's page shows their
       visit history, not just their form answers.

   SETUP — edit the three lines below, once, right here:
     1. Google Analytics: go to analytics.google.com, create a
        free GA4 property + a "Web" data stream for your site,
        and copy the Measurement ID (looks like "G-XXXXXXXXXX").
     2. Microsoft Clarity: go to clarity.microsoft.com, create a
        free project with your site's URL, and copy the Project
        ID from the Setup page (a short string of letters/numbers).
     3. HubSpot: in your HubSpot account, go to Settings (gear
        icon) → Tracking & Analytics → Tracking Code, and copy
        the numeric ID from the script URL shown there (it looks
        like //js.hs-scripts.com/12345678.js — the number is your
        ID). This is the SAME number as the HUBSPOT_PORTAL_ID /
        GATE_HUBSPOT_PORTAL_ID placeholders already in index.html,
        contact.html, and roi_calculator.html — once you know it,
        you can fill in all of those with the same number too.
     Paste all three below. Until you do, this file safely does
     nothing — no broken requests, no console errors.
   ========================================================= */
var GA_MEASUREMENT_ID = "G-XXXXXXXXXX";
var CLARITY_PROJECT_ID = "YOUR_CLARITY_PROJECT_ID";
var HUBSPOT_TRACKING_ACCOUNT_ID = "YOUR_HUBSPOT_ACCOUNT_ID";

// ---- Google Analytics (GA4) ----
(function () {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.indexOf("XXXX") !== -1) return;
  var s = document.createElement('script');
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
})();

// ---- Microsoft Clarity ----
(function () {
  if (!CLARITY_PROJECT_ID || CLARITY_PROJECT_ID.indexOf("YOUR_") !== -1) return;
  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
    t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
})();

// ---- HubSpot tracking code ----
(function () {
  if (!HUBSPOT_TRACKING_ACCOUNT_ID || HUBSPOT_TRACKING_ACCOUNT_ID.indexOf("YOUR_") !== -1) return;
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.id = 'hs-script-loader';
  s.async = true;
  s.defer = true;
  s.src = '//js.hs-scripts.com/' + HUBSPOT_TRACKING_ACCOUNT_ID + '.js';
  document.head.appendChild(s);
})();
