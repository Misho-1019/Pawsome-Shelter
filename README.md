# Pawsome Shelter

A full-stack dog shelter adoption website. Visitors browse adoptable dogs, submit inquiries, and subscribe to updates. Staff manage everything through a built-in admin panel.

## Tech Stack

- **Frontend:** React 19, TypeScript 6, Tailwind CSS v4, Vite 8
- **Backend:** Node.js, Express 5, TypeScript 7, Prisma 5
- **Database:** PostgreSQL (Neon serverless)
- **Auth:** JWT (admin only, single-page app, no public registration)
- **Email:** Resend API
- **State:** TanStack Query for data fetching/caching
- **Animations:** Framer Motion
- **Forms:** Zod validation (server) + native React forms (client)
- **Testing:** Vitest

## Project Structure

```
pawsome-shelter/
├── backend/                # Express API
│   ├── prisma/             # Database schema + migrations
│   ├── src/
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth, CSRF, request ID, error handler
│   │   ├── services/       # Email service
│   │   ├── utils/          # Shared utilities
│   │   ├── validation/     # Zod schemas
│   │   ├── db/             # Prisma client + seed
│   │   └── index.ts        # Server entry
│   └── README.md           # Backend-specific docs
├── frontend/               # React SPA
│   ├── src/
│   │   ├── pages/          # Top-level page components
│   │   ├── components/     # UI, layout, sections, admin
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API client
│   │   ├── types/          # TypeScript types
│   │   └── data/           # Static fallback data
│   └── README.md           # (see root README)
└── package.json            # Root scripts (monorepo)
```

## Quick Start

### 1. Install dependencies

From the project root:

```bash
npm install
```

This installs the root dev dependencies (concurrently). Each subproject has its own `package.json` — install those too:

```bash
npm install --prefix backend
npm install --prefix frontend
```

### 2. Configure environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with real values (DATABASE_URL, JWT_SECRET, etc.)

# Frontend
cp frontend/.env.example frontend/.env
# Default values work for local dev
```

Generate strong secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### 3. Set up the database

```bash
# Apply schema (uses prisma db push — see backend/README.md for migration workflow)
npm run db:seed
```

### 4. Run the app

```bash
npm run dev
```

This starts both the backend (port 3001) and frontend (port 5173) in parallel.

Open http://localhost:5173 to see the public site.
Visit http://localhost:5173/admin/login to access the admin panel.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start backend + frontend together |
| `npm run dev:backend` | Backend only |
| `npm run dev:frontend` | Frontend only |
| `npm run build` | Production build of both |
| `npm run test` | Run all tests |
| `npm run typecheck` | TypeScript check both |
| `npm run db:migrate` | Create new Prisma migration |
| `npm run db:seed` | Seed initial data |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run lint` | Lint frontend |

## Public Site Features

- Browse available dogs with filters (size, puppies, seniors, favorites)
- Read testimonials from successful adoptions
- Submit adoption inquiry (name, email, phone, message)
- Apply to volunteer
- Subscribe to newsletter
- Read FAQ, Privacy Policy, Terms of Service
- Login link in header to access admin

## Admin Panel Features

Single long page (mirrors the public site's philosophy) with section nav and 5 sections:

- **Overview** — Stats cards: dogs available, total dogs, pending inquiries, active volunteers, subscribers
- **Dogs** — Table with create/edit/delete, drawer-based form
- **Inquiries** — Adoption and volunteer tables with inline status change
- **Content** — CMS editor for Hero / About / Contact sections
- **Subscribers** — Searchable table of newsletter subscribers

## Architecture Notes

- **No public auth.** Only staff with admin accounts can log in. The public site is fully anonymous.
- **Single SPA, two modes.** The app detects `/admin` paths and mounts the admin shell with auth. All other paths show the public site. No client-side router — switching is a full page reload.
- **API versioning.** All endpoints under `/api/v1/`. Backwards-incompatible changes will bump the version.
- **CSRF protection.** Double-submit cookie pattern. Login and newsletter unsubscribe are exempt (use their own protection).
- **Schema-driven types.** Frontend types mirror Prisma models in `frontend/src/types/`.
- **CMS-driven content.** Hero, About, Contact sections fetch from `/api/v1/content/:section` with hardcoded fallbacks for offline rendering.

## Security

- All secrets in `.env` files (excluded from git)
- Helmet for security headers
- CORS allowlist from `CORS_ORIGIN` env (no localhost fallback)
- CSRF tokens issued + verified on state-changing requests
- JWT auth with 24h expiry
- Rate limiting (100/15min general, 10/15min for forms)
- Zod validation on all request bodies and query params
- Bcrypt password hashing (10 rounds)
- HMAC-signed newsletter unsubscribe tokens

## Documentation

- [`backend/README.md`](./backend/README.md) — Backend setup, API reference, architecture, security
- [`.stitch/DESIGN.md`](./.stitch/DESIGN.md) — Design system specification
- [`.stitch/SITE.md`](./.stitch/SITE.md) — Project roadmap and API spec

## License

MIT — see [LICENSE](./LICENSE)
