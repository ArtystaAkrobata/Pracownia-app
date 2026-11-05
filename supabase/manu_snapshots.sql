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

-- Można bezpiecznie ponownie uruchomić skrypt po poprawkach polityk.
drop policy if exists "owner selects own snapshot" on public.manu_snapshots;
drop policy if exists "owner inserts own snapshot" on public.manu_snapshots;
drop policy if exists "owner updates own snapshot" on public.manu_snapshots;

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

-- PO WDROŻENIU sprawdź w SQL Editor (odczyt, bez zmian danych):
-- SELECT schemaname, tablename, rowsecurity
-- FROM pg_tables WHERE schemaname='public' AND tablename='manu_snapshots';
-- SELECT policyname, roles, cmd, qual, with_check
-- FROM pg_policies WHERE schemaname='public' AND tablename='manu_snapshots';
-- UWAGA: SQL Editor zwykle działa jako administrator i omija RLS.
-- Izolację kont potwierdza dopiero próba odczytu/zapisu przez dwa
-- osobne konta authenticated przy użyciu publishable key, a nie service_role.
