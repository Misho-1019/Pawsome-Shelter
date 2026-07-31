# Pawsome Shelter Backend

Express + Prisma + PostgreSQL API for the Pawsome Shelter adoption site.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in real values:

```bash
cp .env.example .env
```

Required environment variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (e.g. from Neon) |
| `JWT_SECRET` | 64+ char random string for signing JWTs |
| `CORS_ORIGIN` | Comma-separated allowed origins |
| `CSRF_SECRET` | 32+ char random string for CSRF token signing |
| `ADMIN_PASSWORD` | Random password for initial admin user |
| `FRONTEND_URL` | Frontend URL for email links |
| `API_URL` | Backend URL for unsubscribe links |
| `STRIPE_SECRET_KEY` | Stripe secret key (test/live) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `PAYPAL_CLIENT_ID` | PayPal client ID |
| `PAYPAL_CLIENT_SECRET` | PayPal client secret |
| `PAYPAL_MODE` | PayPal mode (sandbox/live) |
| `RESEND_API_KEY` | (Optional) Resend API key for emails |
| `EMAIL_FROM` | (Optional) Email from address |

Generate secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### 3. Set up the database

For **first-time setup** (dev):

```bash
npx prisma db push
npm run db:seed
```

For **production**:

```bash
npx prisma migrate deploy
npm run db:seed
```

### 4. Run the server

```bash
# Development (hot reload)
npm run dev

# Production
npm run build
npm start
```

## Architecture

```
backend/
  prisma/
    schema.prisma          # Database schema
    migrations/            # SQL migration files
  src/
    index.ts               # Express server entry point
    db/
      client.ts            # Prisma client singleton
      seed.ts              # Database seeder
    middleware/
      auth.ts              # JWT authentication
      csrf.ts              # CSRF token issuance + verification
      errorHandler.ts      # Global error handler
      requestId.ts         # Request ID for tracing
    routes/
      dogs.ts              # /api/v1/dogs (public read, admin write)
      testimonials.ts      # /api/v1/testimonials
      adoptions.ts         # /api/v1/adoptions
      auth.ts              # /api/v1/auth/login, /api/v1/auth/me
      content.ts           # /api/v1/content (CMS)
      volunteers.ts        # /api/v1/volunteers
      newsletter.ts        # /api/v1/newsletter
      donations.ts         # /api/v1/donations (Stripe)
      paypal-donations.ts  # /api/v1/paypal-donations (PayPal)
    services/
      email.ts             # Resend email service
      stripe.ts            # Stripe client initialization
      paypal.ts            # PayPal client initialization
    utils/
      parseId.ts           # URL param ID parser
      asyncHandler.ts      # Async route wrapper
      logger.ts            # Structured logger
      prismaErrorHandler.ts # Prisma error -> HTTP status mapping
    validation/
      schemas.ts           # Zod validation schemas
    __tests__/
      api.test.ts          # API integration tests
      integration.test.ts  # Full-stack integration tests
```

## API Endpoints

### Public
- `GET /api/v1/health` — Health check with DB connectivity
- `GET /api/v1/dogs` — List dogs (paginated, filterable)
- `GET /api/v1/dogs/:id` — Get dog by ID
- `GET /api/v1/testimonials` — List testimonials
- `GET /api/v1/content/:section` — Get CMS content section
- `POST /api/v1/adoptions` — Submit adoption inquiry
- `POST /api/v1/volunteers` — Submit volunteer application
- `POST /api/v1/newsletter` — Subscribe to newsletter
- `GET/POST /api/v1/newsletter/unsubscribe` — Unsubscribe with token
- `POST /api/v1/auth/login` — Admin login
- `POST /api/v1/donations/create-checkout` — Create Stripe checkout session
- `POST /api/v1/donations/webhook` — Stripe webhook receiver
- `POST /api/v1/paypal-donations/create-order` — Create PayPal order
- `POST /api/v1/paypal-donations/capture-order` — Capture PayPal payment
- `POST /api/v1/paypal-donations/webhook` — PayPal webhook receiver

### Admin only (requires JWT)
- `POST /api/v1/dogs` — Create dog
- `PUT /api/v1/dogs/:id` — Update dog
- `DELETE /api/v1/dogs/:id` — Delete dog
- `GET /api/v1/adoptions` — List adoption inquiries
- `GET /api/v1/adoptions/:id` — Get adoption inquiry
- `PUT /api/v1/adoptions/:id` — Update adoption status/notes
- `DELETE /api/v1/adoptions/:id` — Delete adoption
- `GET /api/v1/volunteers` — List volunteers
- `PUT /api/v1/volunteers/:id` — Update volunteer
- `DELETE /api/v1/volunteers/:id` — Delete volunteer
- `GET /api/v1/newsletter` — List subscribers
- `DELETE /api/v1/newsletter/:email` — Remove subscriber
- `PUT /api/v1/content/:section` — Update CMS content section
- `GET /api/v1/auth/me` — Get current user
- `GET /api/v1/donations` — List donations
- `GET /api/v1/donations/stats` — Get donation statistics
- `GET /api/v1/donations/:id` — Get specific donation
- `GET /api/v1/paypal-donations` — List PayPal donations

## Security

- **Helmet** for security headers (CSP, HSTS, X-Frame-Options)
- **CORS** with explicit origin allowlist (env-required)
- **CSRF** via double-submit cookie pattern
- **JWT** auth with 24h expiry
- **Rate limiting** (200 req/15min general, 200 req/15min for forms)
- **Zod** validation on all request bodies and query params
- **Bcrypt** password hashing
- **Newsletter** unsubscribe uses HMAC-signed tokens
- **Trust proxy** enabled for accurate client IPs behind reverse proxies
