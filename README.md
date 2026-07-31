# 🐾 Pawsome Shelter

### Full-Stack Dog Shelter Adoption Website

A production-oriented full-stack web application designed to manage **dog listings, adoption inquiries, donations, volunteer applications, and newsletter subscriptions** for animal shelters.

This project focuses on **real-world nonprofit workflows**, secure payment processing (Stripe + PayPal), email automation, and CMS-driven content — not just UI demos.

---

## 🎯 Project Purpose

Animal shelters often rely on manual processes such as phone calls, emails, and paper forms to manage adoptions and community engagement.

**Pawsome Shelter** replaces this workflow with a centralized platform that allows shelter staff to:

- showcase available dogs with detailed profiles
- accept adoption inquiries and volunteer applications
- process one-time and recurring donations via Stripe and PayPal
- manage content through a built-in CMS panel
- communicate with the community via newsletter emails

The project was built to simulate **production-level nonprofit requirements**, making it suitable as both a foundation for real use and a strong portfolio project.

---

## 🚀 Core Features

### Public Site

- Browse available dogs with filters (size, puppies, seniors, favorites)
- Dog detail drawer with personality bio, compatibility flags, and adoption CTA
- Adoption inquiry form with household information
- Volunteer application form with availability and experience
- Newsletter subscription with welcome email
- Testimonials carousel (desktop 3D + mobile swipe)
- CMS-driven Hero, About, and Contact sections
- FAQ, Privacy Policy, and Terms of Service modals
- Favorites system (localStorage-based)
- Responsive design with mobile-first approach
- Scroll-triggered animations (Framer Motion)
- SEO structured data (JSON-LD: AnimalShelter + FAQPage)

### Admin Panel

- Dashboard with 7 stat cards (dogs, inquiries, volunteers, donations, subscribers)
- Dog management with full CRUD (table + drawer-based form)
- Adoption inquiry management with status workflow (Pending → InReview → MeetGreet → Approved/Rejected → Completed)
- Volunteer application management with status workflow
- Donation tracking with Stripe/PayPal provider badges
- Content management for Hero, About, and Contact sections
- Newsletter subscriber management with search

### Payments & Donations

- **Stripe integration** — one-time, monthly, and annual recurring donations
- **PayPal SDK integration** — direct PayPal checkout alongside Stripe
- Stripe Checkout hosted payment page (PCI-compliant)
- Stripe webhook handling (checkout completed, expired, refunded)
- PayPal order creation, capture, and webhook handling
- Donation statistics for admin dashboard

### Email Automation

- Resend API integration for transactional emails
- Volunteer application confirmation emails
- Adoption inquiry confirmation emails
- Newsletter welcome emails with unsubscribe links
- HMAC-signed unsubscribe tokens

### Security & Robustness

- JWT authentication with 24h expiry (admin only)
- CSRF protection via double-submit cookie pattern
- Rate limiting (200 req/15min general, 200 req/15min for forms)
- Helmet security headers (CSP, HSTS, X-Frame-Options)
- CORS allowlist from environment variable
- Zod validation on all request bodies and query params
- Bcrypt password hashing (10 rounds)
- Input sanitization in email templates

---

## 🌐 Live Demo

- **Frontend:** https://pawsomeshelter.vercel.app
- **Backend API:** https://pawsome-shelter-api.fly.dev
- **Admin Panel:** https://pawsomeshelter.vercel.app/admin/login

> ⚠️ Note:
> This is a portfolio deployment.
> PayPal is in sandbox mode — no real money is processed.
> Stripe is in test mode — use test card numbers for testing.

---

## 🔑 Demo Credentials

### Admin Panel

- **URL:** https://pawsomeshelter.vercel.app/admin/login
- **Email:** admin@pawsomeshelter.com
- **Password:** hRIQqw7dxfEt6_RrKt2TJg

### PayPal Sandbox (for testing donations)

**Merchant Account (receives payments):**

- **Email:** sb-p8ybo51806322@business.example.com
- **Sandbox URL:** https://sandbox.paypal.com

**Buyer Account (tests donations):**

- **Email:** sb-x23ge52300119@personal.example.com
- **Sandbox URL:** https://sandbox.paypal.com

> ⚠️ Note:
> PayPal is in sandbox mode. No real money is processed.
> Use the buyer account to test the donation flow.

---

## 🖼️ Screenshots

### 1️⃣ Public Site — Hero & Dog Grid

![Public Site](screenshots/public-site.png)

### 2️⃣ Dog Detail Drawer

![Dog Detail](screenshots/dog-detail.png)

### 3️⃣ Donation Flow (Stripe + PayPal)

![Donation Flow](screenshots/donation-flow.png)

### 4️⃣ Admin Dashboard

![Admin Dashboard](screenshots/admin-dashboard.png)

### 5️⃣ Admin — Dog Management

![Admin Dogs](screenshots/admin-dogs.png)

### 6️⃣ Admin — Donation Tracking

![Admin Donations](screenshots/admin-donations.png)

---

## 🏗️ Architecture Overview

The application follows a classic client–server architecture:

```
┌─────────────────────────────────────────────────┐
│          React 19 + Vite + Tailwind CSS v4       │
│    TanStack Query + Framer Motion + PayPal JS    │
└────────────────────┬────────────────────────────┘
                     │ REST API + CSRF
┌────────────────────▼────────────────────────────┐
│             Express 5 + TypeScript               │
│   Routes → Services → Prisma → PostgreSQL        │
│   JWT Auth + CSRF + Rate Limiting + Zod          │
├────────────────┬───────────────┬────────────────┤
│                │               │                │
┌──▼──────────┐ ┌▼────────┐ ┌───▼──────┐  ┌─────▼─────┐
│  Postgres  │ │ Stripe  │ │ PayPal   │  │  Resend   │
│  (Neon)    │ │ API     │ │ SDK      │  │  (Email)  │
└────────────┘ └─────────┘ └──────────┘  └───────────┘
```

### Client Layer (React 19 + Vite + Tailwind v4)

- Component-based UI with lazy-loaded sections
- TanStack Query for server state management (caching, background refetch)
- Context-based auth state (JWT in localStorage)
- Drawer-based UX for dog details, adoption, volunteering, and donations
- Favorites system with localStorage persistence
- Responsive design with mobile-first approach
- Scroll-triggered animations with Framer Motion

### API Layer (Express 5 + TypeScript)

- 9 route modules: dogs, testimonials, adoptions, auth, content, volunteers, newsletter, donations, PayPal donations
- Middleware pipeline: Helmet → CORS → Cookie Parser → Rate Limiting → CSRF → Routes → Error Handler
- Zod validation on all request bodies and query parameters
- Structured JSON logging with request ID tracing

### Data Layer (Prisma + PostgreSQL)

- 9 models: Dog, Testimonial, Adoption, Content, Volunteer, Newsletter, User, Donation
- 8 enums for type-safe status workflows
- 10+ composite indexes for query performance
- Serverless PostgreSQL via Neon with connection pooling

### Payment Layer

- **Stripe:** Checkout Sessions for one-time and recurring (subscription) donations
- **PayPal:** Orders API for one-time donations with capture flow
- Webhook handling for both providers with signature verification

### Email Layer (Resend)

- 3 email templates: newsletter welcome, adoption confirmation, volunteer confirmation
- HTML email templates with shared wrapper and branded design
- HMAC-signed unsubscribe tokens for GDPR compliance

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| TypeScript 6 | Type safety |
| Vite 8 | Build tool & dev server |
| Tailwind CSS v4 | Utility-first styling with custom design tokens |
| TanStack Query | Server state management (caching, background refetch) |
| Framer Motion | Scroll-triggered animations |
| @paypal/react-paypal-js | PayPal button integration |
| react-phone-number-input | International phone input |

### Backend

| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime |
| Express 5 | HTTP framework |
| TypeScript 7 | Type safety |
| Prisma 5 | ORM with PostgreSQL |
| PostgreSQL (Fly.io) | Database |
| Stripe SDK | Payment processing (one-time + recurring) |
| PayPal Server SDK | Payment processing (PayPal checkout) |
| Resend | Transactional email service |
| Zod | Input validation |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |

### Deployment

| Service | Technology |
|---------|-----------|
| Frontend | Vercel |
| Backend | Fly.io (Docker) |
| Database | Fly.io Postgres |
| Email | Resend |
| Payments | Stripe + PayPal (sandbox) |

---

## 🔒 Security Considerations

- **JWT authentication** with 24h expiry for admin access
- **CSRF protection** via double-submit cookie pattern (header-based for cross-origin)
- **Rate limiting:** 200 req/15min general, 200 req/15min for forms
- **Helmet** security headers (CSP, HSTS, X-Frame-Options)
- **CORS** restricted to configured frontend origin
- **Zod validation** on all request bodies and query parameters
- **Bcrypt** password hashing (10 rounds)
- **HMAC-signed** newsletter unsubscribe tokens
- **Stripe webhook** signature verification
- **Input sanitization** in email templates (HTML escaping)
- **Environment variable validation** on startup — fails fast if secrets are missing
- **Request body size limit** (1 MB)

---

## ▶️ Running Locally

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon account)
- Stripe account (test mode)
- PayPal Developer account (sandbox)
- Resend account (optional, for emails)

### 1️⃣ Clone & Install

```bash
git clone https://github.com/Misho-1019/Pawsome-Shelter.git
cd Pawsome-Shelter
npm install
npm install --prefix backend
npm install --prefix frontend
```

### 2️⃣ Set up environment variables

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your database URL, Stripe keys, PayPal keys, etc.

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your API URL
```

### 3️⃣ Set up the database

```bash
cd backend
npx prisma db push
npm run db:seed
```

### 4️⃣ Start both servers

```bash
# From root — starts API + client concurrently
npm run dev
```

Or start them separately:

```bash
cd backend && npm run dev    # Express API on port 3001
cd frontend && npm run dev   # Vite dev server on port 5173
```

Open `http://localhost:5173` — the app is fully functional.

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `JWT_SECRET` | Yes | — | JWT signing secret (64+ chars) |
| `CORS_ORIGIN` | Yes | — | Comma-separated allowed origins |
| `CSRF_SECRET` | Yes | — | CSRF token signing secret |
| `ADMIN_EMAIL` | Yes | — | Admin login email |
| `ADMIN_PASSWORD` | Yes | — | Admin login password |
| `FRONTEND_URL` | Yes | `http://localhost:5173` | Frontend URL for redirects |
| `API_URL` | Yes | `http://localhost:3001` | Backend URL for email links |
| `PORT` | No | `3001` | Server port |
| `NODE_ENV` | No | `development` | Environment |
| `STRIPE_SECRET_KEY` | No | — | Stripe secret key (test/live) |
| `STRIPE_PUBLISHABLE_KEY` | No | — | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | No | — | Stripe webhook signing secret |
| `PAYPAL_CLIENT_ID` | No | — | PayPal client ID |
| `PAYPAL_CLIENT_SECRET` | No | — | PayPal client secret |
| `PAYPAL_MODE` | No | `sandbox` | PayPal mode (sandbox/live) |
| `RESEND_API_KEY` | No | — | Resend API key for emails |
| `EMAIL_FROM` | No | — | Email from address |
| `UNSUBSCRIBE_SECRET` | No | — | Newsletter unsubscribe token secret |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|----------|:--------:|---------|-------------|
| `VITE_API_URL` | No | — | Backend API URL (empty = same-origin) |
| `VITE_FRONTEND_URL` | No | `http://localhost:5173` | Frontend URL |
| `VITE_PAYPAL_CLIENT_ID` | No | — | PayPal client ID for JS SDK |

---

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Type Checking

```bash
npm run typecheck
```

---

## 📋 Changelog

### v1.0 — July 2026

**Core Features**
- Full-stack dog shelter adoption website
- Public site with 8 sections (Hero, Dogs, How to Adopt, Testimonials, Get Involved, About, Contact, Footer)
- Admin panel with 6 sections (Overview, Dogs, Inquiries, Content, Donations, Subscribers)
- CMS-driven content for Hero, About, and Contact sections

**Payments**
- Stripe integration (one-time, monthly, annual recurring donations)
- PayPal SDK integration (sandbox mode)
- Stripe webhook handling (checkout completed, expired, refunded)
- PayPal webhook handling (capture completed, denied, refunded)

**Email**
- Resend integration for transactional emails
- Volunteer confirmation emails
- Adoption confirmation emails
- Newsletter welcome emails with unsubscribe

**Security**
- JWT authentication with 24h expiry
- CSRF protection via double-submit cookie pattern
- Rate limiting (200 req/15min)
- Helmet security headers
- Zod validation on all inputs
- Bcrypt password hashing

**Deployment**
- Frontend deployed to Vercel
- Backend deployed to Fly.io (Docker)
- Database on Fly.io Postgres
- SEO: robots.txt, sitemap.xml, JSON-LD structured data

---

## 👤 Author Note

Built with a production mindset, focusing on **real-world nonprofit requirements** — secure payment processing (Stripe + PayPal), email automation, CMS-driven content, and a polished, accessible user experience.

This project demonstrates applied full-stack engineering with **dual payment provider integration, recurring donations, email automation, and SEO optimization** — reflecting real production scenarios beyond basic CRUD applications.

---

Built by [Mihail Todorov](https://github.com/Misho-1019)
