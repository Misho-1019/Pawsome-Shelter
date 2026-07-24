# Pawsome Shelter — Site Vision & Roadmap

## 1. Project Overview

**Title:** Pawsome Shelter
**Type:** Full-stack one-page dog shelter adoption website
**Goal:** Enable visitors to browse adoptable dogs, submit adoption inquiries, and learn about the shelter. Admins can manage all content via a built-in CMS panel.

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18+ / TypeScript / Tailwind CSS v3 (Vite) |
| Backend | Node.js / Express / TypeScript |
| Database | PostgreSQL |
| Auth | JWT-based admin login |
| Design | Stitch (Google) for initial UI, converted to React components |

## 3. Site Vision

A warm, welcoming, professional single-page website for a dog shelter adoption agency. The public site showcases available dogs, the adoption process, success stories, and ways to get involved. A built-in admin panel gives shelter staff full control over all content without touching code.

## 4. Sitemap

### Public Site (Single Page, 8 Sections)
- [ ] Hero — "Find Your New Best Friend" + CTAs
- [ ] Available Dogs — Filterable grid of dog cards
- [ ] How to Adopt — 3-step process
- [ ] Success Stories — Testimonial cards
- [ ] Get Involved — Volunteer + Donate
- [ ] About — Mission + stat counters
- [ ] Contact — Address, map, social links
- [ ] Footer — Newsletter, nav, copyright

### Admin Panel (Protected Routes)
- [ ] Dashboard — Overview stats
- [ ] Dogs — CRUD for dog listings
- [ ] Content — Edit hero, about, testimonials, etc.
- [ ] Adoptions — View/manage adoption inquiries
- [ ] Settings — Site settings

## 5. Roadmap

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Create workspace structure | In Progress |
| 2 | Generate Stitch designs (desktop + mobile) | Pending |
| 3 | Download HTML + screenshots | Pending |
| 4 | Extract design system → DESIGN.md | Pending |
| 5 | Initialize React frontend | Pending |
| 6 | Initialize Express backend + PostgreSQL | Pending |
| 7 | Convert Stitch HTML → React components | Pending |
| 8 | Build API endpoints | Pending |
| 9 | Build admin panel | Pending |
| 10 | Connect frontend to API | Pending |
| 11 | Add interactivity (filtering, modal, scroll) | Pending |
| 12 | Polish & verify | Pending |

## 6. API Endpoints (Planned)

### Dogs
- `GET /api/dogs` — List all dogs
- `GET /api/dogs/:id` — Get dog by ID
- `POST /api/dogs` — Create dog (admin)
- `PUT /api/dogs/:id` — Update dog (admin)
- `DELETE /api/dogs/:id` — Delete dog (admin)

### Content
- `GET /api/content` — Get all site content
- `GET /api/content/:section` — Get section content
- `PUT /api/content/:section` — Update section (admin)

### Adoptions
- `POST /api/adoptions` — Submit adoption inquiry
- `GET /api/adoptions` — List inquiries (admin)
- `PUT /api/adoptions/:id` — Update status (admin)

### Auth
- `POST /api/auth/login` — Admin login
- `GET /api/auth/me` — Get current user
