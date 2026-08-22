# NBBL Gilbert Mobile

Next.js landing page for **NBBL Gilbert** — the first physical home of No Backboard Basketball in Gilbert, Arizona.

Opening September 1, 2026.

## Overview

A mobile-first marketing site with on-page forms for:

- **Session purchase** — HubSpot + PayPal checkout
- **Showcase registration** — HubSpot + PayPal ($360/club)
- **Creator access** — HubSpot inquiry only
- **Fundraiser inquiry** — HubSpot inquiry only

**Live site:** [nbbl-gilbert-mobile.vercel.app](https://nbbl-gilbert-mobile.vercel.app)

The site is designed as a sports magazine / performance brand / basketball media property, not a generic gym, SaaS, or corporate template.

## Recent Changes

### Visual polish and conversion pass

The approved homepage architecture and business proposition were kept. This pass raised the visual language so the site feels like an established sports property.

Preserved:

- Section order and NBBL story
- Approved pricing in `lib/catalog.ts`
- FormHub tabs, PayPal checkout, HubSpot APIs, and environment variable names
- URL hashes `#book`, `#showcase-register`, `#creator-access`, `#fundraiser-inquiry`
- Package preselection via `/?package=school-eval#book`
- Sticky CTA, header navigation, and mobile menu

Visual and UX updates:

- Hero is full viewport with cinematic grading, condensed headline entrance, and Ken Burns movement on the strongest UHoop action photo
- **The Futsal of Basketball** uses oversized type, negative space, and a UHoop image that bleeds into Swish
- **Swish / Speed / Skill** are editorial chapters, not cards
  - Swish includes a large `16″` typographic treatment
  - Speed uses live-ball language and horizontal image drift
  - Skill stacks Think / Communicate / Pass / Finish / Decide
- **Practice your system / Scrimmage our system** is a vertical `01 → 02 → 03` training sequence, not a three-column feature row
- Team development still leads with the **$1,900 Four Session Development Evaluation**; other school packages stay behind progressive disclosure
- **Measure the work** is framed as sports performance technology, not a SaaS dashboard
- Competition, audience, and fundraising chapters use full-bleed photography and larger statements
- Showcase economics now reads **Event → Audience → Value → Shared participation**, then the equal 20% split as one band
- Gym #000 is a photo tour: Exterior → Court → UHoop → Bleachers/Stage → Production area, with a mobile swipe gallery and desktop mosaic
- Final CTA (**Start with your team.**) is visually separated from the form. The form follows under **Ready to get started?**
- Buttons, form tabs, and panels use a sharper editorial treatment instead of pill / card UI
- Image focal points are set per section and breakpoint so athletes and the UHoop stay in frame
- Motion is limited to fade/slide reveals, image scale, and subtle drift, and honors `prefers-reduced-motion`

### About and founder

- Homepage **Why NBBL?** section introduces the founder, Mark Tee Armstrong, without a long biography
- Founder portrait uses a vertical frame so the photo is not cropped into a banner
- **About** in the header and footer opens the homepage `#why` section
- **Learn About NBBL →** opens [remixed.nobackboard.com](https://remixed.nobackboard.com/)
- A dedicated `/about` route is not used

### Contact email

Site-wide contact email is [info@nobackboard.com](mailto:info@nobackboard.com), including footer, form fallback, PayPal notices, and HubSpot error copy.

### Next.js migration (from static HTML)

The site was rebuilt from a single `index.html` static page into a Next.js App Router application:

- **Framework:** Next.js 15 + React 19 + TypeScript
- **Forms:** Four tabbed forms in `FormHub` (sessions, showcase, creator, fundraiser)
- **Payments:** Server-side PayPal order create/capture via API routes
- **CRM:** HubSpot form submissions via server-side API
- **Assets:** Moved from `assets/` to `public/assets/`
- **Removed:** `index.html` (replaced by `app/page.tsx`)

## CTA and form navigation

All primary CTAs route to the on-page form hub and open the correct tab:

| Hash | Opens |
|------|-------|
| `#book` | Book Sessions (default) |
| `#showcase-register` | Register Showcase |
| `#creator-access` | Creator Access |
| `#fundraiser-inquiry` | Fundraiser Inquiry |

Pricing rows can pre-select a package via query string, e.g. `/?package=school-eval#book`.

`FormHub` syncs the active tab from the URL hash, scrolls to the form (not the section heading), and retries after hydration so Next.js does not leave the page at the top. `scroll-padding-top` accounts for the fixed header. `scroll-padding-bottom` keeps mobile content clear of the sticky CTA.

## Header navigation

The main menu links to on-page sections:

| Link | Target |
|------|--------|
| Train Your Team | `/#book` |
| Showcases | `/#showcases` |
| The NBBL Difference | `/#difference` |
| Fundraising | `/#fundraiser` |
| The Gym | `/#gym` |
| Creators | `/#creators` |
| About | `/#why` |

The header primary action is **Book Your Team →** and routes to `/#book`. The sticky mobile bar is **Train Your Team →** and also routes to `/#book`. The sticky bar hides on the hero and over the form hub.

## Approved pricing

Do not change these values in copy or in `lib/catalog.ts` without an explicit business decision.

| Product | Price |
|---------|-------|
| Four Session Development Evaluation | $1,900 |
| 12 Week Weekly Residency | $5,100 |
| 12 Week Twice Weekly Residency | $10,200 |
| Two Hour Team Session | $560 |
| Two Session Development Cycle | $1,000 |
| Four Session Development Cycle | $1,900 |
| Club Team Showcase entry | $360 per club |
| PPV | $9.99 |

Showcase economics: **20% NBBL / 20% Club 1 / 20% Club 2 / 20% Club 3 / 20% Club 4**.

## Tech Stack

- Next.js (App Router) + TypeScript + React
- PayPal Checkout (server-side order create/capture)
- HubSpot Forms API (server-side submission)
- Google Fonts (Barlow Condensed, Inter)
- Static assets in `public/assets/`

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment placeholders:

```bash
cp .env.example .env.local
```

3. Start the dev server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |

## Environment Variables

Add these to `.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | PayPal REST app client ID (public) |
| `PAYPAL_CLIENT_SECRET` | PayPal REST app secret (server only) |
| `PAYPAL_ENV` | `sandbox` or `live` |
| `HUBSPOT_PORTAL_ID` | HubSpot portal ID (server) |
| `NEXT_PUBLIC_HUBSPOT_PORTAL_ID` | HubSpot portal ID (tracking script) |
| `HUBSPOT_FORM_SESSIONS` | Form GUID for session purchases |
| `HUBSPOT_FORM_SHOWCASE` | Form GUID for showcase registration |
| `HUBSPOT_FORM_CREATOR` | Form GUID for creator access |
| `HUBSPOT_FORM_FUNDRAISER` | Form GUID for fundraiser inquiries |

Until these are configured, paid forms show a PayPal setup notice and inquiry forms return a configuration error. Email fallback: [info@nobackboard.com](mailto:info@nobackboard.com).

## HubSpot Setup

Create four forms in HubSpot:

1. **NBBL Session Purchase**
2. **NBBL Showcase Registration**
3. **NBBL Creator Access**
4. **NBBL Fundraiser Inquiry**

Map custom properties used by the API (examples):

- `program_name`, `organization_type`, `package`, `athlete_count`
- `preferred_start`, `preferred_dates`, `notes`
- `content_type`, `project_description`
- `expected_clubs`, `referral_source`
- `payment_status`, `paypal_order_id`, `amount_paid`

Paste each form GUID into the matching `HUBSPOT_FORM_*` env var.

## PayPal Setup

1. Create a PayPal Business REST app.
2. Use sandbox credentials first (`PAYPAL_ENV=sandbox`).
3. Put the client ID in `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and secret in `PAYPAL_CLIENT_SECRET`.
4. Switch to live credentials when ready for production.

Prices are locked on the server in `lib/catalog.ts` — the browser cannot change checkout amounts.

## Page Sections

The homepage story stays in this order:

| Section | ID | Description |
|---------|-----|-------------|
| Hero | — | The Home of No Backboard Basketball. Gilbert, Arizona. Opening September 1, 2026. |
| Difference | `#difference` | The Futsal of Basketball. Swish. Speed. Skill. |
| Swish | `#swish` | 16 inch UHoop. No backboard. |
| Speed | `#speed` | The game doesn't stop. |
| Skill | `#skill` | Think. Communicate. Pass. Finish. Decide. |
| Train | `#train` | Practice your system. Scrimmage our system. |
| Pricing | `#pricing` | School evaluation, residencies, and club training |
| Performance | — | Don't just practice. Measure the work. |
| Showcases | `#showcases` | Train here. Then compete here. |
| Showcase experience | `#showcase-experience` | Compete locally. Build an audience. Fund the game. PPV $9.99. |
| Audience | — | Play the game. Build the audience. Share the value. |
| Fundraiser | `#fundraiser` | Basketball becomes the fundraiser. |
| Economics | — | Event → Audience → Value → Shared participation, then 20% split |
| The Gym | `#gym` | Gym #000 facility tour |
| Why NBBL | `#why` | Founder, origin, and link to remixed.nobackboard.com |
| Creators | `#creators` | Your content. Our court. |
| Contact / close | `#contact` | Start with your team, then Ready to get started? and FormHub |

## Project Structure

```
app/
  layout.tsx
  page.tsx
  globals.css
  api/paypal/create-order/route.ts
  api/paypal/capture-order/route.ts
  api/forms/inquiry/route.ts
components/
  Header.tsx
  Footer.tsx
  StickyCta.tsx
  FormHub.tsx
  BleedImage.tsx
  Reveal.tsx
  TeamOffers.tsx
  forms/
    SessionForm.tsx
    ShowcaseForm.tsx
    CreatorForm.tsx
    FundraiserForm.tsx
    PayPalCheckout.tsx
lib/
  catalog.ts
  paypal.ts
  hubspot.ts
  validation.ts
public/assets/
```

## Deployment

Deploy to Vercel or any Node host that supports Next.js:

```bash
npm run build
npm run start
```

Set the same environment variables in your hosting provider.

## Contact

- **Email:** [info@nobackboard.com](mailto:info@nobackboard.com)
- **Location:** Gilbert, Arizona

## License

© 2026 No Backboard Basketball League
