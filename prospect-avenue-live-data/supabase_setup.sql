-- ═══════════════════════════════════════════════════════════════
--  ProspectAvenue — Supabase Database Setup
--  Run this entire script in: Supabase Dashboard > SQL Editor > New query
-- ═══════════════════════════════════════════════════════════════

-- ─────────────────────────────────────
--  1. ESTIMATES TABLE
--     Stores full voyage P&L snapshots.
--     full_data (jsonb) holds the complete
--     in-memory estimate object including
--     the live data snapshot.
-- ─────────────────────────────────────
create table if not exists public.estimates (
  id            uuid          default gen_random_uuid() primary key,
  user_id       uuid          references auth.users(id) on delete cascade not null,
  created_at    timestamptz   default now() not null,
  route         text,
  vessel_name   text,
  vessel_type   text,
  cargo_type    text,
  cargo_qty     numeric,
  freight_rate  numeric,
  result        numeric,
  tce           numeric,
  days          numeric,
  charter_mode  text,
  speed         numeric,
  bunker_total  numeric,
  net_freight   numeric,
  total_cost    numeric,
  full_data     jsonb         -- complete estimate object + live data snapshot
);

-- ─────────────────────────────────────
--  2. VESSELS TABLE (fleet profiles)
--     Saved vessel specifications.
-- ─────────────────────────────────────
create table if not exists public.vessels (
  id            uuid          default gen_random_uuid() primary key,
  user_id       uuid          references auth.users(id) on delete cascade not null,
  created_at    timestamptz   default now() not null,
  updated_at    timestamptz   default now() not null,
  name          text          not null,
  vessel_type   text          not null default 'supramax',
  speed         numeric       default 13.0,
  cons_laden    numeric       default 28,
  cons_ballast  numeric       default 25,
  cons_port     numeric       default 3,
  notes         text          default ''
);

-- ─────────────────────────────────────
--  3. ROW LEVEL SECURITY
--     Each user can only see and modify
--     their own data. Critical.
-- ─────────────────────────────────────
alter table public.estimates enable row level security;
alter table public.vessels   enable row level security;

-- Drop policies first in case you're re-running this script
drop policy if exists "estimates_own" on public.estimates;
drop policy if exists "vessels_own"   on public.vessels;

create policy "estimates_own" on public.estimates
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "vessels_own" on public.vessels
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────
--  4. INDEXES
--     Fast user-scoped queries.
-- ─────────────────────────────────────
create index if not exists estimates_user_created_idx
  on public.estimates (user_id, created_at desc);

create index if not exists vessels_user_created_idx
  on public.vessels (user_id, created_at asc);

-- ─────────────────────────────────────
--  DONE. Tables, RLS, and indexes are set.
--
--  NEXT STEPS:
--  1. Go to Supabase Dashboard → Authentication → Settings
--  2. Set "Site URL" to your Vercel URL (e.g. https://prospect-avenue.vercel.app)
--  3. For MVP testing: disable "Enable email confirmations" so you can
--     sign up and log in immediately without checking email.
--     (Re-enable before any commercial launch.)
--  4. Copy your Project URL and anon key from:
--     Supabase Dashboard → Settings → API
--  5. Paste both into the SUPABASE CONFIG section at the top of index.html
-- ─────────────────────────────────────
