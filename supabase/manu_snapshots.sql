-- MANU · Etap 7 · Supabase SQL Editor
-- Wykonaj w osobnym projekcie Supabase. Jeden zaszyfrowany w transmisji
-- dokument JSON na użytkownika; dostęp do wiersza wyłącznie dla właściciela.
-- Uwaga: baza danych przechowuje JSON w postaci jawnej dla administratora bazy.
create table if not exists public.manu_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null,
  revision bigint not null default 1 check (revision > 0),
  updated_at timestamptz not null default now()
);

alter table public.manu_snapshots enable row level security;

revoke all on table public.manu_snapshots from anon, authenticated;
grant select, insert, update on table public.manu_snapshots to authenticated;

create policy "owner selects own snapshot"
on public.manu_snapshots for select
to authenticated using ((select auth.uid()) = user_id);

create policy "owner inserts own snapshot"
on public.manu_snapshots for insert
to authenticated with check ((select auth.uid()) = user_id);

create policy "owner updates own snapshot"
on public.manu_snapshots for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- Kontrola: z niezalogowanej roli nie ma dostępu; nie przyznajemy DELETE
-- na snapshotach z poziomu aplikacji.
