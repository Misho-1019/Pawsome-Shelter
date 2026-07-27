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
| `RESEND_API_KEY` | (Optional) Resend API key for emails |

Generate secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

### 3. Set up the database

For **first-time setup** (dev):

```bash
# Push the schema directly (no migration history yet)
npx prisma db push

# Seed initial data (admin user, dogs, testimonials, content sections)
npm run db:seed
```

For **production**:

```bash
# Apply all pending migrations
npx prisma migrate deploy

# Seed initial data
npm run db:seed
```

> **Windows note:** Prisma 5.22.0 has a known bug where the migration resolver cannot find migration files in the `prisma/migrations/` directory on Windows, even when they exist. If `prisma migrate deploy` or `prisma migrate dev` fails with `P3015` ("Could not find the migration file"), use `npx prisma db push` instead, which works correctly. This is fixed in later Prisma versions.

### 4. Run the server

```bash
# Development (hot reload)
npm run dev

# Production
npm run build
npm start
```

## Database Migrations

This project uses **Prisma migrations** (not `db push`) for schema management.

### Create a new migration after schema changes

```bash
npx prisma migrate dev --name <descriptive-name>
```

This will:
1. Generate a new SQL migration file in `prisma/migrations/`
2. Apply it to the dev database
3. Regenerate the Prisma client

### Apply migrations in production

```bash
npx prisma migrate deploy
```

### Reset the database (drops all data)

```bash
npm run db:reset
```

⚠️ **Never run `prisma migrate reset` in production.**

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production server |
| `npm run typecheck` | Type-check without emitting |
| `npm test` | Run all tests |
| `npm run db:migrate` | Create + apply a new migration (dev) |
| `npm run db:migrate:deploy` | Apply pending migrations (prod) |
| `npm run db:seed` | Seed database with initial data |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |
| `npm run db:reset` | Reset database (dev only) |

## Architecture

```
backend/
  prisma/
    schema.prisma          # Database schema
    migrations/            # SQL migration files (committed)
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
      dogs.ts              # /api/dogs (public read, admin write)
      testimonials.ts      # /api/testimonials
      adoptions.ts         # /api/adoptions
      auth.ts              # /api/auth/login, /api/auth/me
      content.ts           # /api/content (CMS)
      volunteers.ts        # /api/volunteers
      newsletter.ts        # /api/newsletter
    services/
      email.ts             # Resend email service
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

## Security

- **Helmet** for security headers (CSP, HSTS, X-Frame-Options)
- **CORS** with explicit origin allowlist (env-required)
- **CSRF** via double-submit cookie pattern
- **JWT** auth with 24h expiry
- **Rate limiting** (100 req/15min general, 10 req/15min for forms)
- **Zod** validation on all request bodies and query params
- **Bcrypt** password hashing
- **Newsletter** unsubscribe uses HMAC-signed tokens
- **Trust proxy** enabled for accurate client IPs behind reverse proxies

## API Endpoints

### Public
- `GET /api/health` — Health check with DB connectivity
- `GET /api/dogs` — List dogs (paginated, filterable)
- `GET /api/dogs/:id` — Get dog by ID
- `GET /api/testimonials` — List testimonials
- `GET /api/content/:section` — Get CMS content section
- `POST /api/adoptions` — Submit adoption inquiry
- `POST /api/volunteers` — Submit volunteer application
- `POST /api/newsletter` — Subscribe to newsletter
- `GET/POST /api/newsletter/unsubscribe` — Unsubscribe with token
- `POST /api/auth/login` — Admin login

### Admin only (requires JWT)
- `POST /api/dogs` — Create dog
- `PUT /api/dogs/:id` — Update dog
- `DELETE /api/dogs/:id` — Delete dog
- `GET /api/adoptions` — List adoption inquiries
- `GET /api/adoptions/:id` — Get adoption inquiry
- `PUT /api/adoptions/:id` — Update adoption status/notes
- `DELETE /api/adoptions/:id` — Delete adoption
- `GET /api/volunteers` — List volunteers
- `PUT /api/volunteers/:id` — Update volunteer
- `DELETE /api/volunteers/:id` — Delete volunteer
- `GET /api/newsletter` — List subscribers
- `DELETE /api/newsletter/:email` — Remove subscriber
- `PUT /api/content/:section` — Update CMS content section
- `GET /api/auth/me` — Get current user
