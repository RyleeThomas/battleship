-- Core tables (simplified)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  handle text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending', -- pending|active|finished|forfeit
  player_a uuid references users(id),
  player_b uuid references users(id),
  current_turn uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists moves (
  id bigserial primary key,
  match_id uuid references matches(id) on delete cascade,
  turn_num int not null,
  actor uuid references users(id),
  x int not null,
  y int not null,
  result text not null, -- hit|miss|sink
  created_at timestamptz not null default now()
);

-- RLS (starter: open for dev; tighten later)
alter table users enable row level security;
alter table matches enable row level security;
alter table moves enable row level security;

create policy "dev all users read" on users for select using (true);
create policy "dev all matches read" on matches for select using (true);
create policy "dev all moves read" on moves for select using (true);