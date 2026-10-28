/* =========================================================
   PFX BLOG DATA
   -------------------------------------------------------
   Single source of truth for blog posts used by:
     - blog.html      (renders the post cards)
     - site-search.js (powers the nav search button)

   To add/edit a post, just edit this array — both the blog
   listing page and the search results update automatically.
   `slug` must be unique; it's used as the #anchor on blog.html.
   `image` is the card's featured image (optional).
   ========================================================= */
const PFX_BLOG_POSTS = [
  {
    slug: "why-pizza-vending-is-the-future",
    image: "Images/blog/why-pizza-vending-is-the-future.webp?v=2",
    title: "Why Automated Pizza Vending Is the Future of Quick Service",
    date: "2026-06-02",
    tags: ["Automation", "Industry Trends", "Quick Service"],
    excerpt: "Labor costs, long wait times, and inconsistent quality are pushing operators toward 24/7 automated kiosks. Here's what's driving the shift."
  },
  {
    slug: "roi-breakdown-first-year",
    image: "Images/blog/roi-breakdown-first-year.webp?v=2",
    title: "ROI Breakdown: What Licensees Actually Earn in Year One",
    date: "2026-05-14",
    tags: ["ROI", "Licensee", "Earnings"],
    excerpt: "A real-numbers look at revenue, COGS, rent share, and payback period for a typical single-unit PFX licensee in their first 12 months."
  },
  {
    slug: "indoor-vs-outdoor-kiosk",
    image: "Images/blog/indoor-vs-outdoor-kiosk.webp?v=2",
    title: "Indoor vs. Outdoor Kiosks: Which PFX Model Fits Your Location?",
    date: "2026-04-22",
    tags: ["Kiosk Models", "Site Selection"],
    excerpt: "ATM-style, indoor, or outdoor — how foot traffic, climate, and footprint should guide which PFX unit you deploy first."
  },
  {
    slug: "pizza13-case-study",
    image: "Images/blog/pizza13-case-study.webp?v=2",
    title: "Case Study: How Pizza13 Sold 2,500 Pizzas in 60 Days",
    date: "2026-03-18",
    tags: ["Case Study", "New Brunswick", "Results"],
    excerpt: "An inside look at the launch strategy behind Pizza13's first two months in New Brunswick, Canada — and what other operators can copy."
  },
  {
    slug: "franchise-fees-explained",
    image: "Images/blog/franchise-fees-explained.webp?v=2",
    title: "No Franchise Fees: How PFX Licensing Actually Works",
    date: "2026-02-27",
    tags: ["Licensing", "Franchise", "Business Model"],
    excerpt: "PFX isn't a franchise — you own the equipment and keep the profits. Here's how the licensing model differs and why it matters for your margins."
  },
  {
    slug: "maintenance-and-support",
    image: "Images/blog/maintenance-and-support.webp?v=2",
    title: "What's Included: Warranty, Maintenance & 24/7 Support",
    date: "2026-01-30",
    tags: ["Support", "Maintenance", "Warranty"],
    excerpt: "A plain-English rundown of the 1-year parts & labor warranty, optional maintenance plans, and the remote monitoring included with every unit."
  }
];
