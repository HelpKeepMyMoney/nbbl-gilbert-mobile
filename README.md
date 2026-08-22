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

## Recent Changes

### Next.js migration (from static HTML)

The site was rebuilt from a single `index.html` static page into a Next.js App Router application:

- **Framework:** Next.js 15 + React 19 + TypeScript
- **Forms:** Four tabbed forms in `FormHub` (sessions, showcase, creator, fundraiser)
- **Payments:** Server-side PayPal order create/capture via API routes
- **CRM:** HubSpot form submissions via server-side API
- **Assets:** Moved from `assets/` to `public/assets/`
- **Removed:** `index.html` (replaced by `app/page.tsx`)

### CTA and form navigation

All primary CTAs route to the on-page form hub and open the correct tab:

| Hash | Opens |
|------|-------|
| `#book` | Book Sessions (default) |
| `#showcase-register` | Register Showcase |
| `#creator-access` | Creator Access |
| `#fundraiser-inquiry` | Fundraiser Inquiry |

Pricing cards can pre-select a package via query string, e.g. `/?package=school-eval#book`.

`FormHub` syncs the active tab from the URL hash, scrolls to the form (not the section heading), and retries after hydration so Next.js does not leave the page at the top. `scroll-padding-top` accounts for the fixed header.

### Header navigation

The main menu links to on-page sections:

| Link | Target |
|------|--------|
| Train | `#train` |
| Showcases | `#showcases` |
| Difference | `#difference` |
| Fundraising | `#fundraiser` |
| The Gym | `#gym` |
| Creators | `#creators` |

The **Fundraising** link scrolls to the "Your Next Fundraiser Could Be a No Backboard Basketball Game!" section.

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

Until these are configured, paid forms show a PayPal setup notice and inquiry forms return a configuration error. Email fallback: [info@nbblgilbert.com](mailto:info@nbblgilbert.com).

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

| Section | ID | Description |
|---------|-----|-------------|
| Hero | — | Opening date and primary CTAs |
| Difference | `#difference` | "The Futsal of Basketball" positioning |
| Train | `#train` | Team development sessions |
| Pricing | `#pricing` | School and club training tiers |
| Performance | — | Athlete tracking roadmap |
| Showcases | `#showcases` | Club competition and PPV |
| Fundraiser | `#fundraiser` | "Your Next Fundraiser" fundraising section |
| The Gym | `#gym` | Facility details and photos |
| Creators | `#creators` | Media and content access |
| Contact / Forms | `#contact` | Form hub with all four forms |

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
  StickyCta.tsx
  FormHub.tsx
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

- **Email:** [info@nbblgilbert.com](mailto:info@nbblgilbert.com)
- **Location:** Gilbert, Arizona

## License

© 2026 No Backboard Basketball League
