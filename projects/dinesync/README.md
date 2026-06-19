# DineSync 🍽️

Complete restaurant reservation system with table management, menu browsing, and admin dashboard.

## Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vue 3, TypeScript, Pinia, Tailwind CSS v4, Vite |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | SQLite (better-sqlite3) |
| **Auth** | JWT (jsonwebtoken + bcryptjs) |

## Setup

```bash
# Backend
cd backend
npm install
npm run seed    # Populate sample data
npm run dev     # Starts on :3001

# Frontend (in another terminal)
cd frontend
npm install
npm run dev     # Starts on :5173, proxies /api to backend
```

## Build

```bash
cd backend && npm run build
cd frontend && npm run build
```

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/menu` | No | List menu items |
| GET | `/api/menu/:id` | No | Get menu item |
| POST | `/api/menu` | Yes | Create menu item |
| PUT | `/api/menu/:id` | Yes | Update menu item |
| DELETE | `/api/menu/:id` | Yes | Delete menu item |
| GET | `/api/reservations` | Yes | List reservations |
| POST | `/api/reservations` | No | Create reservation |
| PUT | `/api/reservations/:id` | Yes | Update reservation |
| PATCH | `/api/reservations/:id/status` | Yes | Update status |
| DELETE | `/api/reservations/:id` | Yes | Delete reservation |
| GET | `/api/admin/stats` | Yes | Dashboard stats |

## Deploy

- **Frontend**: Build with `npm run build`, deploy `dist/` to any static host (Vercel, Netlify, Pages)
- **Backend**: Deploy to Railway, Render, or Fly.io with `npm start`
