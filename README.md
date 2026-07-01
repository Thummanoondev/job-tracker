# JobTrackr — Job Application Tracker

A full-stack web app for tracking job applications through their lifecycle on a
Kanban board — from **Wishlist** to **Offer**. Built to keep a job hunt
organized in one place.

> **Live demo:** _add your Vercel URL here_
> **Demo login:** `demo@jobtrackr.dev` / `demo1234`

![Tech](https://img.shields.io/badge/Next.js-16-black)
![Tech](https://img.shields.io/badge/TypeScript-5-blue)
![Tech](https://img.shields.io/badge/Prisma-6-2D3748)
![Tech](https://img.shields.io/badge/Tailwind-4-38BDF8)

---

## ✨ Features

- **Email/password auth** — bcrypt-hashed passwords, signed JWT sessions in
  httpOnly cookies. No third-party auth service required.
- **Kanban board** — drag-and-drop applications across five stages with
  optimistic UI updates.
- **Full CRUD** — create, edit, and delete applications with company, role,
  location, salary, job URL, and notes.
- **Dashboard stats** — totals per stage plus a computed response rate.
- **Per-user data isolation** — every query is scoped to the signed-in user.
- **Server-side validation** — a single [Zod](https://zod.dev) schema validates
  input on both create and update.
- **Route protection** — an edge proxy guards authenticated routes.

## 🧰 Tech Stack

| Layer      | Choice                                             |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Server Actions, Turbopack) |
| Language   | TypeScript                                         |
| Styling    | Tailwind CSS v4                                     |
| Database   | Prisma ORM + SQLite (swap to PostgreSQL for prod)  |
| Auth       | `jose` (JWT) + `bcryptjs`                           |
| Validation | Zod                                                |

## 🏗️ Architecture Notes

- **Server Actions over API routes.** Mutations live in `src/app/actions/*` and
  are called directly from client components — no hand-written fetch layer.
- **Optimistic UI.** The board updates state immediately on drag/drop and
  reconciles with the server via `revalidatePath`, rolling back on failure.
- **Security-conscious auth.** Login compares against a dummy hash when the user
  doesn't exist to avoid leaking which emails are registered. Ownership is
  enforced with `updateMany`/`deleteMany` scoped by `userId`.
- **Edge proxy** verifies only the JWT signature (cheap); the authoritative user
  lookup happens in server components via a React-`cache`d `getCurrentUser()`.

```
src/
├── app/
│   ├── (auth)/            # login & register (route group)
│   ├── (dashboard)/       # protected dashboard + board
│   ├── actions/           # server actions (auth, applications)
│   └── page.tsx           # marketing landing
├── components/            # Board, ApplicationCard, ApplicationModal, forms
├── lib/                   # prisma client, auth, validations, constants
└── proxy.ts               # route protection (Next.js 16 proxy convention)
```

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Set up your environment
cp .env.example .env
#    then generate a real AUTH_SECRET:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. Create the database and apply migrations
npx prisma migrate dev

# 4. (Optional) Seed demo data
npm run db:seed

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📜 Scripts

| Script               | Description                       |
| -------------------- | --------------------------------- |
| `npm run dev`        | Start the dev server              |
| `npm run build`      | Production build                  |
| `npm run db:migrate` | Create/apply a Prisma migration   |
| `npm run db:seed`    | Seed the demo user + applications |
| `npm run db:studio`  | Open Prisma Studio                |

## ☁️ Deploying to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Swap the datasource `provider` in `prisma/schema.prisma` to `postgresql` and
   add a `DATABASE_URL` (e.g. Vercel Postgres / Neon) plus `AUTH_SECRET` in the
   project's environment variables.
4. Deploy — `prisma generate` runs automatically via the `postinstall` hook.

---

Built by **THUMANOON** · feel free to reach out.
