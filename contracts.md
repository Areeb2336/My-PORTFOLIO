# API Contracts — Areeb Rayyan Portfolio

## Overview
Convert frontend mock-driven portfolio into a self-serve full-stack app where Areeb (non-technical) can update gallery, messages, and editable text via `/admin` panel.

## Auth
- Single admin user. Credentials stored in `backend/.env` (`ADMIN_USERNAME`, `ADMIN_PASSWORD`).
- JWT-based session. Token returned at login, stored in `localStorage` on frontend, sent as `Authorization: Bearer <token>` header.
- `JWT_SECRET` in env. 7-day expiry.

### Endpoints
- `POST /api/auth/login` → `{ username, password }` → `{ token, expires_in }`
- `GET /api/auth/me` (protected) → `{ username }` (verify token validity)

## Portfolio
Public read, admin write. Image files stored on disk at `/app/backend/uploads/portfolio/`, served via `/api/uploads/portfolio/<filename>`.

### Model
```
PortfolioItem { id, title, category, year, description, image_url, order, created_at }
```

### Endpoints
- `GET /api/portfolio` (public) → list, ordered by `order` then `created_at desc`
- `POST /api/portfolio` (admin, multipart) → fields + `image` file → created item
- `PUT /api/portfolio/{id}` (admin, JSON) → update fields (title, category, year, description, order)
- `DELETE /api/portfolio/{id}` (admin) → also deletes file
- `GET /api/portfolio/categories` (public) → distinct categories list

## Contact Messages
Public create, admin read/delete.

### Model
```
ContactMessage { id, name, email, project, message, created_at, read }
```

### Endpoints
- `POST /api/contact` (public) → save message
- `GET /api/messages` (admin) → list
- `PATCH /api/messages/{id}/read` (admin) → mark read
- `DELETE /api/messages/{id}` (admin)

## Site Content (editable text)
Single document keyed by `key`. Stores all editable strings (bio, role, tagline, services, roadmap items, stats, etc.) as JSON.

### Model
```
SiteContent { key, value (any JSON), updated_at }
```

### Endpoints
- `GET /api/content` (public) → all content as flat object `{ key: value }`
- `PUT /api/content/{key}` (admin) → `{ value }`

### Initial seed keys
- `profile` (object: name, role, tagline, shortBio, longBio, email, instagram, etc.)
- `services` (array)
- `roadmap` (array)
- `stats` (array)
- `tools` (array)

## File Uploads
- Max 10MB per image. Allowed: jpg, jpeg, png, webp.
- Filename: `<uuid>.<ext>` to avoid collisions.
- Served via FastAPI `StaticFiles` mount at `/api/uploads`.

## Frontend Integration
Replace static `mock.js` imports with `useContent()` hook that fetches `/api/content` once on app mount and caches. Portfolio fetched separately via `/api/portfolio`. Contact form posts to `/api/contact`.

### Routes
- `/` — public portfolio (existing)
- `/admin` — login form (if not authenticated) → dashboard
- `/admin/dashboard` — tabs: Gallery, Messages, Content

### Admin UX
- Drag-drop or click to upload images
- Inline edit for text fields with save button
- Confirm dialog for deletes
- Toast notifications for success/error

## Mock Data Migration
- `mock.js` data is seeded into MongoDB on first backend start (`seed_data.py` or in-app idempotent seed).
- After migration, `mock.js` is removed from imports — public site reads from backend.

## Env Vars (backend/.env additions)
```
ADMIN_USERNAME=Arru@8080
ADMIN_PASSWORD=Rayyanali@5778
JWT_SECRET=<random-256-bit>
```
