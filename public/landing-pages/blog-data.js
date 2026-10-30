/* =========================================================
   PFX BLOG DATA
   -------------------------------------------------------
   Single source of truth for blog posts used by:
     - /blog      (renders the post cards)
     - /post      (renders one post: /post?p=<slug>)
     - site-search.js (powers the nav search button)

   To add/edit a post, edit this array, or write it in the
   admin tool (/admin) and press Publish: it downloads a
   new copy of this file with the post included. Replace this
   file with it and push, and the post is live.
   `slug` must be unique; it's the post's address.
   `image` is the card's featured image (optional).
   `body` is the post's HTML.
   ========================================================= */
const PFX_BLOG_POSTS = [
  {
    slug: "why-pizza-vending-is-the-future",
    image: "Images/blog/why-pizza-vending-is-the-future.webp?v=2",
    title: "Why Automated Pizza Vending Is the Future of Quick Service",
    date: "2026-06-02",
    author: "PFX Team",
    tags: ["Automation", "Industry Trends", "Quick Service"],
    excerpt: "Labor costs, long wait times, and inconsistent quality are pushing operators toward 24/7 automated kiosks. Here's what's driving the shift.",
    body: `
<p>Quick service has always been a trade-off between three things: speed, cost and consistency. Push on one and the others give. Staffing a counter late at night costs more than the sales it brings in. Rushing a kitchen at lunch hurts quality. And every location you add multiplies the number of people who have to get the recipe right.</p>
<p>Automated pizza vending breaks that trade-off. A PFX kiosk stores up to 70 pizzas, bakes each one to order in under five minutes and serves it through a self-serve touchscreen and payment terminal, around the clock, with nobody behind a counter.</p>

<h2>Labour is the cost that keeps climbing</h2>
<p>For most pizzerias, wages are the largest line on the P&amp;L after ingredients, and the hardest to flex. A kiosk changes the shape of that cost. Instead of staffing open hours, you staff restocking: loading fresh pizzas, a quick clean and you're done. In our white-label ROI model, restocking labour works out to about 4% of revenue, or roughly 20 minutes a day.</p>

<h2>Customers expect food whenever they want it</h2>
<p>Campuses, hospitals, stadiums and transit hubs don't keep business hours, and neither do the people in them. Night-shift workers, students studying late and fans leaving an event all want a hot meal when most kitchens are closed. A kiosk sells at 2&nbsp;a.m. exactly the way it sells at noon.</p>

<h2>Consistency is built in</h2>
<p>Every pizza is made by you, with your dough, sauce, cheese and toppings, then baked by the same pulsed-air convection oven to the same settings. There is no new hire learning the oven on a Friday night. Pizzas are baked directly in the box they arrive in, so nothing touches the inside of the machine, and an automated system tracks every pizza's best-before date and serves first in, first out.</p>

<h2>Small footprint, big reach</h2>
<p>A traditional storefront means a lease, a build-out and a full team. A kiosk fits where a storefront can't: the Indoor Kiosk is a freestanding unit for lobbies and cafeterias, the Outdoor Kiosk stands on its own in a parking lot or plaza, and the ATM Kiosk is recessed into a building's wall so customers order from outside while you restock from inside.</p>

<h2>The screen earns too</h2>
<p>Every kiosk has a 32-inch touchscreen. Between orders, that screen can run ads, for your own specials or for partners who want to reach the people standing in front of it. It's a second revenue stream from hardware you already own.</p>

<h2>What this means for operators</h2>
<p>Automation doesn't replace a great pizzeria. It extends one. Your brand, your recipes and your pricing stay yours; the kiosk simply lets you sell them in more places, for more hours, at a lower cost per pizza. That's why we think vending is where quick service is heading.</p>
<p>Want to see the numbers for your own site? <a href="/roicalculator">Try the ROI calculator</a> or <a href="/contact">talk to our team</a>.</p>
`
  },
  {
    slug: "roi-breakdown-first-year",
    image: "Images/blog/roi-breakdown-first-year.webp?v=2",
    title: "ROI Breakdown: What Licensees Actually Earn in Year One",
    date: "2026-05-14",
    author: "PFX Team",
    tags: ["ROI", "Licensee", "Earnings"],
    excerpt: "A real-numbers look at revenue, COGS, rent share, and payback period for a typical single-unit PFX licensee in their first 12 months.",
    body: `
<p>The first question every operator asks is simple: what does a kiosk actually make? Here's how our white-label ROI model answers it, line by line, so you can see exactly where the money goes. All figures assume a $15 sale price and a 30-day month.</p>

<h2>Revenue</h2>
<p>Revenue is pizzas sold multiplied by price. At 30 pizzas a day, that's 900 pizzas and $13,500 a month. At 70 pizzas a day, the kiosk's full capacity, it's 2,100 pizzas and $31,500 a month.</p>

<h2>Running costs</h2>
<ul>
<li><b>Ingredients:</b> 15% of revenue.</li>
<li><b>Boxes:</b> $0.83 per pizza, box with disk.</li>
<li><b>Waste:</b> 2% of revenue for expired or unsold product, once volume is stable.</li>
<li><b>Electricity:</b> about $110 to $170 a month depending on volume, based on Toronto rates.</li>
<li><b>Restocking labour:</b> 4% of revenue, about 20 minutes a day.</li>
<li><b>Card processing:</b> 3% of sales.</li>
</ul>
<p>At 30 pizzas a day, that adds up to $4,117 a month, leaving <b>$9,383 in monthly net profit</b>, or about $112,600 a year. At 70 pizzas a day, costs are $9,473 and monthly net profit is <b>$22,027</b>, about $264,300 a year.</p>

<h2>Payback</h2>
<p>Equipment is a one-time purchase: $85,078 for the ATM Kiosk, $96,216 for the Indoor Kiosk and $109,617 for the Outdoor Kiosk. Set against the model's profits, payback looks like this:</p>
<ul>
<li>10 pizzas a day: about 2 to 3 years</li>
<li>20 pizzas a day: 13 to 17 months</li>
<li>30 pizzas a day: 9 to 12 months</li>
<li>40 pizzas a day: 6 to 9 months</li>
<li>70 pizzas a day: 4 to 5 months</li>
</ul>

<h2>What the model leaves out</h2>
<p>Every site is different, so a few costs are yours to add. If your host charges rent or a share of revenue for the space, subtract it from monthly profit. The same goes for insurance, financing and any marketing spend. On the other side, ad revenue from the kiosk's screen isn't counted either.</p>

<h2>Year one in practice</h2>
<p>Most kiosks don't open at full volume. Expect a ramp as customers discover you, then a steady level that depends on foot traffic and pricing. The best way to plan is to model a conservative volume first, then see what the upside looks like.</p>
<p>This model is illustrative: outcomes depend on your site, your operations and your local market. Plug in your own numbers with the <a href="/roicalculator">ROI calculator</a>, or <a href="/contact">talk to us</a> about a specific location.</p>
`
  },
  {
    slug: "indoor-vs-outdoor-kiosk",
    image: "Images/blog/indoor-vs-outdoor-kiosk.webp?v=2",
    title: "Indoor vs. Outdoor Kiosks: Which PFX Model Fits Your Location?",
    date: "2026-04-22",
    author: "PFX Team",
    tags: ["Kiosk Models", "Site Selection"],
    excerpt: "ATM-style, indoor, or outdoor — how foot traffic, climate, and footprint should guide which PFX unit you deploy first.",
    body: `
<p>All three PFX kiosks do the same job: store up to 70 pizzas, bake each one in under five minutes and serve it 24/7. What changes is where they fit. The right model comes down to three questions: where your customers are, what the weather does, and how much space you have.</p>

<h2>Outdoor Kiosk: a pizzeria that stands on its own</h2>
<p>The Outdoor Kiosk is a complete, freestanding unit built for parks, campuses, parking lots, gas stations and stadiums. It's a weather-ready container with aluminum paneling, epoxy anti-rust protection, photocell-controlled exterior lighting and an LED roof sign that keeps it visible at night.</p>
<ul>
<li><b>Footprint:</b> 10'8" L × 8'0" W × 8'7" H</li>
<li><b>Power:</b> 208–240V 50A single phase with neutral</li>
<li><b>Best for:</b> high-traffic outdoor sites with no building to attach to</li>
</ul>

<h2>Indoor Kiosk: built for lobbies and hallways</h2>
<p>The Indoor Kiosk is a sleek freestanding unit for universities, workplaces and hospitals. It needs less power and space than the Outdoor Kiosk, and a see-through window lets customers watch their pizza move through the machine.</p>
<ul>
<li><b>Footprint:</b> 9'5" L × 4'5" W × 8'0" H</li>
<li><b>Power:</b> 208V 20A single phase, plus a 120V receptacle</li>
<li><b>Best for:</b> busy indoor spaces where people are around at all hours</li>
</ul>

<h2>ATM Kiosk: turn a wall into a storefront</h2>
<p>The ATM Kiosk is recessed into a building's exterior. Customers order from the street while you restock from inside, out of the weather. A side window shows the robotic arm at work, which turns the kiosk into a bit of a show.</p>
<ul>
<li><b>Footprint:</b> 8'0" L × 7'0" W × 8'0" H</li>
<li><b>Best for:</b> existing restaurants and retail spaces that want street-facing, after-hours sales</li>
</ul>

<h2>How to choose</h2>
<p><b>Follow the foot traffic.</b> A kiosk sells to the people who walk past it, so start where crowds already are, at the times your kitchen is usually closed.</p>
<p><b>Think about climate and access.</b> If you can restock from inside a building, the ATM or Indoor Kiosk keeps that work out of the rain and snow. If there's no building, the Outdoor Kiosk is designed to stand up to the elements.</p>
<p><b>Check your power and space.</b> The Outdoor Kiosk needs a 50A supply and room for a full container; the Indoor Kiosk runs on 20A.</p>
<p>Not sure which fits? <a href="/contact">Tell us about your site</a> and we'll help you decide, or compare the full specs on the <a href="/kiosk-outdoor">Outdoor</a>, <a href="/kiosk-indoor">Indoor</a> and <a href="/kiosk-atm">ATM</a> kiosk pages.</p>
`
  },
  {
    slug: "pizza13-case-study",
    image: "Images/blog/pizza13-case-study.webp?v=2",
    title: "Case Study: How Pizza13 Sold 2,500 Pizzas in 60 Days",
    date: "2026-03-18",
    author: "PFX Team",
    tags: ["Case Study", "New Brunswick", "Results"],
    excerpt: "An inside look at the launch strategy behind Pizza13's first two months in New Brunswick, Canada — and what other operators can copy.",
    body: `
<p>Pizza 13 was the first operator to launch on the PFX white-label program: its own brand on the wrap, its own recipes in the kiosk and PFX automation doing the baking, around the clock. In its first 60 days in New Brunswick, Canada, the kiosk sold 2,500 pizzas.</p>
<p>Here's what made the launch work, and the parts of it any operator can copy.</p>

<h2>A brand people already knew</h2>
<p>Pizza 13 didn't launch a new name. The kiosk carries the same brand and the same recipes its customers already trusted, so the first order felt familiar rather than experimental. That's the core idea of white-label: the kiosk extends your pizzeria instead of competing with it.</p>

<h2>Open when the kitchen is closed</h2>
<p>A kiosk earns the most in the hours a traditional kitchen can't cover. Late nights, early mornings and weekends are when a 24/7 unit has the street to itself.</p>

<h2>Recipes tuned for the oven</h2>
<p>Before launch, every PFX operator's pizzas go through recipe testing, so each one bakes properly in the kiosk's pulsed-air convection oven. Getting that right up front is what keeps customers coming back.</p>

<h2>What you can copy</h2>
<ul>
<li><b>Lead with your own brand.</b> Put the name and menu your customers already know on the wrap.</li>
<li><b>Pick a site with traffic at off-hours.</b> The busiest times for a kiosk are often the quietest for a storefront.</li>
<li><b>Tell people it's there.</b> A launch post, signage in your restaurant and a special for the first week all help a new kiosk get found.</li>
<li><b>Watch the data.</b> Cloud-based management shows what's selling and when, so you can adjust your mix and restocking.</li>
</ul>

<h2>Hear it from Antoine</h2>
<p>Antoine Attard of Pizza 13 talks through the switch to automation in his own words on our <a href="/testimonials#pizza-13">Testimonials page</a>.</p>
<p>Thinking about launching your own brand on PFX? <a href="/contact">Let's talk</a>.</p>
`
  },
  {
    slug: "franchise-fees-explained",
    image: "Images/blog/franchise-fees-explained.webp?v=2",
    title: "No Franchise Fees: How PFX Licensing Actually Works",
    date: "2026-02-27",
    author: "PFX Team",
    tags: ["Licensing", "Franchise", "Business Model"],
    excerpt: "PFX isn't a franchise — you own the equipment and keep the profits. Here's how the licensing model differs and why it matters for your margins.",
    body: `
<p>When operators hear "pizza kiosk program," many assume it works like a franchise: an upfront fee, ongoing royalties and someone else's brand on the sign. PFX works differently. You buy the equipment, you run it under your own name and you keep the profits.</p>

<h2>What you get with PFX</h2>
<ul>
<li><b>The kiosk itself.</b> Commercial-grade, NAMA and UL certified hardware that you own outright.</li>
<li><b>Your branding.</b> A full custom wrap with your colors, logo and messaging.</li>
<li><b>Your recipes and ingredients.</b> Your dough, sauce, cheese and toppings, made by you.</li>
<li><b>Your pricing and menu.</b> Set prices, run seasonal specials and update the menu remotely.</li>
<li><b>Your operations.</b> You prep, stock and manage on your own schedule, with no third party involved.</li>
</ul>

<h2>How that's different from a franchise</h2>
<p>A franchise typically charges an entry fee, takes a percentage of sales as royalties and sets the menu and prices for you. With PFX there are no franchise fees and no royalties on your sales. Once the equipment is paid for, the margin is yours.</p>
<p>That matters most as volume grows. A royalty grows with every pizza you sell; owning the equipment doesn't. In our ROI model, a kiosk selling 70 pizzas a day returns about $22,000 a month in net profit at a $15 price, and none of it is shared with a franchisor.</p>

<h2>What's included alongside the equipment</h2>
<p>Owning the kiosk doesn't mean going it alone. Every unit comes with turnkey installation and training, recipe testing so your pizzas bake properly in the oven, cloud-based management with remote updates, a 24/7 technical support helpline and a 1-year parts and labour warranty.</p>

<h2>Who it's for</h2>
<p>The model is built for independent operators, regional chains, franchisors and even convenience stores: anyone with a pizza people already love who wants to sell it in more places, for more hours.</p>
<p>See how the numbers work on the <a href="/roicalculator">ROI calculator</a>, or <a href="/contact">talk to our team</a> about licensing.</p>
`
  },
  {
    slug: "maintenance-and-support",
    image: "Images/blog/maintenance-and-support.webp?v=2",
    title: "What's Included: Warranty, Maintenance & 24/7 Support",
    date: "2026-01-30",
    author: "PFX Team",
    tags: ["Support", "Maintenance", "Warranty"],
    excerpt: "A plain-English rundown of the 1-year parts & labor warranty, optional maintenance plans, and the remote monitoring included with every unit.",
    body: `
<p>A kiosk that sells 24/7 needs support that keeps up. Here's exactly what comes with every PFX unit, and what you're responsible for day to day.</p>

<h2>1-year parts and labour warranty</h2>
<p>Every kiosk is covered by a 1-year parts and labour warranty from installation. If a covered component fails, we repair or replace it.</p>

<h2>24/7 technical support</h2>
<p>Our technical support helpline is open around the clock, because your kiosk is too. If something isn't right at 3&nbsp;a.m., there's someone to call.</p>

<h2>Remote monitoring</h2>
<p>Every unit is connected over 4G and monitored remotely. Through cloud-based management you can see what's selling, keep an eye on inventory, update prices and menus, and receive software updates without anyone visiting the site.</p>

<h2>Turnkey install and training</h2>
<p>We handle installation and train you and your team on restocking, cleaning and day-to-day operation, so you're comfortable running the kiosk from day one. Extended service plans and unit customization are available too.</p>

<h2>Food safety, built in</h2>
<p>Pizzas never touch the inside of the machine during loading, baking or serving: they're baked directly in the box they arrive in. An automated system tracks the best-before date of every pizza, serves them first in, first out, and removes anything past its shelf life from sale. The units are NAMA approved for sanitary food vending.</p>

<h2>What you take care of</h2>
<p>Operators handle routine restocking and cleaning. In our ROI model, restocking takes about 20 minutes a day. Regular cleaning of the interior and exterior keeps the kiosk looking as good as your pizza.</p>
<p>Questions about support for a specific site? <a href="/contact">Get in touch</a>.</p>
`
  }
];
