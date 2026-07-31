# Pawsome Shelter Frontend

React + TypeScript + Tailwind CSS v4 SPA for the Pawsome Shelter adoption site.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (empty = same-origin via proxy) |
| `VITE_FRONTEND_URL` | Frontend URL for email links |
| `VITE_PAYPAL_CLIENT_ID` | PayPal client ID for JS SDK |

### 3. Run the dev server

```bash
npm run dev
```

Open `http://localhost:5173`.

## Architecture

```
frontend/
  src/
    App.tsx                # Root component (route detection)
    main.tsx               # React entry point
    index.css              # Tailwind v4 theme + custom animations
    config.ts              # API URL helpers
    pages/
      DogShelter.tsx       # Main public page (lazy-loaded sections)
      DonationSuccess.tsx  # Post-donation success page
      DonationCancel.tsx   # Post-donation cancel page
    components/
      layout/              # Header, Footer, Layout wrapper
      dog-shelter/         # 17 public-facing components
      admin/               # 13 admin panel components
      ui/                  # 17 reusable UI components
      seo/                 # Structured data (JSON-LD)
    contexts/
      AuthContext.tsx       # Auth state management (JWT)
    hooks/
      useDogs.ts           # TanStack Query wrapper
      useTestimonials.ts   # TanStack Query wrapper
      useContent.ts        # CMS content fetcher
      useFavorites.ts      # localStorage-based favorites
      useForm.ts           # Generic controlled form hook
    services/
      api.ts               # API client (all endpoints, CSRF)
    types/
      dog-shelter.ts       # TypeScript types mirroring Prisma
    data/
      dogs.ts              # Static fallback data
```

## Key Components

### Public Site (dog-shelter/)

- **HeroSection** — CMS-driven hero with scroll CTAs
- **DogGrid** — Filterable dog grid with 7 filter modes
- **DogCard** — Memoized dog card with favorite toggle
- **DogDetailDrawer** — Full dog profile in drawer
- **AdoptionDrawer** — Adoption inquiry form
- **VolunteerDrawer** — Volunteer application form
- **GetInvolved** — Donation UI with Stripe + PayPal buttons
- **SuccessStories** — Desktop 3D + mobile swipe carousel
- **TestimonialsCarousel** — Testimonials with ratings

### Admin Panel (admin/)

- **AdminApp** — Auth gate (login vs admin page)
- **AdminPage** — Single-page admin with 6 sections
- **DogsSection** — Dog CRUD with table + form
- **InquiriesSection** — Adoption + volunteer tables
- **ContentSection** — Hero/About/Contact editors
- **DonationsSection** — Donation tracking with provider badges
- **SubscribersSection** — Newsletter subscriber table

### UI Components (ui/)

- **Drawer** — Accessible slide-in panel with focus trap
- **Button** — Variant/size system with forwardRef
- **Card** — Keyboard accessible with role="button"
- **Toast** — Toast notification system with auto-dismiss
- **ErrorBoundary** — Graceful crash recovery
- **FormField** — Label + input + error with aria attributes
- **SubmitButton** — Loading state with spinner
- **HeartButton** — Favorite toggle with aria-label

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests |
| `npm run lint` | Lint with Oxlint |
| `npm run typecheck` | TypeScript check without emitting |
