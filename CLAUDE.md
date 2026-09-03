# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hercules is a fullstack gym-tracking app. **Backend**: Fastify v5 + Bun + Prisma + PostgreSQL. **Frontend**: React 19 + Bun + Tailwind CSS v4.

## Commands

### Backend (`cd Backend`)
```bash
bun run dev          # start with bun run src/index.ts (port 3001)
bunx prisma generate # regenerate Prisma client after schema changes
bunx prisma migrate dev --name <name>  # create and apply a migration
bunx prisma studio   # visual DB browser
```

### Frontend (`cd Frontend`)
```bash
bun run dev          # hot-reload dev server: bun --hot src/index.ts (port 3000)
bun run build        # production build to dist/ via build.ts
```

### Full stack (Docker)
```bash
docker-compose up    # backend :3001, frontend :3000, postgres :5433
```

No test suite exists yet.

## Architecture

### Backend layering
Every request flows: **Route** → **Controller** → **Service** → **Repository** → **Prisma**

- `src/routes/routes.ts` — registers all route plugins on the Fastify instance
- `src/Controllers/` — thin handlers that call services and send replies
- `src/Services/` — business logic; Admin/ and User/ subdirectories mirror the role split
- `src/repository/` — all Prisma queries; no business logic here
- `src/Lib/prisma.ts` — singleton PrismaClient
- `src/config/` — `auth.config.ts` (JWT + cookie), `security.config.ts` (CORS, helmet, rate-limit), `errorHandler.config.ts`

### Auth flow
- Registration: `POST /auth/signin` → `AdminAuthService.createUser`
- Login: `POST /auth/login` → issues `accessToken` (1 h) and `refreshToken` (30 d) as **httpOnly cookies** and also in the JSON body
- Token refresh: `POST /auth/refresh` reads `refreshToken` cookie
- Google OAuth: `GET /login/google` → redirect → `GET /login/google/callback`
- All protected routes use `preHandler: authenticate` which calls `verifyUser(request, reply)` in `src/middleware/auth.middleware.ts`
- Admin-only routes pass `verifyAdmin: true` to `verifyUser`

### Database models (Prisma schema at `Backend/prisma/schema.prisma`)
| Model | Key fields |
|---|---|
| `User` | id (cuid), email, password, google_id?, role (User/Admin), height_cm, weight_kg |
| `ExerciseCatalog` | id, name (unique), equipment[], muscleGroups[] — admin-managed catalog |
| `Set` | exercise snapshot (name, equipment, muscleGroups), sets/reps/weight, computed `volume` and `total_exercise_volume`, optional `workout_id` FK |
| `Workout` | title, date, total_workout_volume, has-many Sets |
| `BodyWeightLog` | user_id, body_weight, date |

A `Set` is created independently (POST `/sets`) and later attached to a `Workout` (POST `/workout`) via a Prisma transaction that calls `tx.set.updateMany`.

Volume calculation lives in `Exercise.repository.ts`: `volume = reps × weight`, `total_exercise_volume = volume × sets`.

### Frontend
Entry point: `src/index.html` → `src/frontend.tsx` (React root) → `src/App.tsx`

- Tailwind v4 is loaded via `bun-plugin-tailwind` registered in `bunfig.toml` for dev and in `build.ts` for production
- Currently the UI is a scaffold with a generic `APITester` component — the actual gym UI is yet to be built

### CORS / ports
| Service | Port |
|---|---|
| Frontend | 3000 |
| Backend | 3001 |
| Postgres (host-mapped) | 5433 (internal 5432) |

CORS whitelist: `localhost:3000`, `localhost:3001`, `localhost:3002`.

## Environment variables

Backend reads from `Backend/.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/gym-postgres
JWT_SECRET_KEY=
PORT=3001
NODE_ENV=development
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```
