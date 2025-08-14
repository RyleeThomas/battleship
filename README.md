# Battleship Arena (Monorepo)

A portfolio-grade, asynchronous Battleship game with PvP, notifications, and an AI opponent, optimized for **low cost** using **Next.js + Supabase (free tier)** and a shared TypeScript game engine package.

## Apps & Packages
- `apps/web` — Next.js app (App Router) with SSR/ISR, Web Push, and Supabase client.
- `apps/functions` — Supabase Edge Functions (Deno) for secure server logic.
- `packages/engine` — Pure TypeScript, deterministic game rules and AI heuristic.
- `infra/supabase` — SQL schema, RLS policies, and seed data.

## Quick Start
```sh
pnpm i
cp .env.example .env
pnpm dev:web
```
Then open http://localhost:3000

## Deploy (cheap)
- Host web on **Vercel** (free tier).
- Use **Supabase** (free) for Postgres/Auth/Realtime/Edge Functions.
- Web push via **OneSignal** (free tier) or VAPID Self-Hosted.
