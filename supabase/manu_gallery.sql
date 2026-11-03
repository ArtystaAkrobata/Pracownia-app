-- MANU 3.5.0 — prywatna galeria zdjęć realizacji.
-- Wykonaj w SQL Editor tego samego projektu Supabase co konto MANU.
-- Bez publicznych URL-i i bez kluczy administracyjnych.
-- Supabase Storage: tylko pliki JPEG maksymalnie 5 MB (MANU zmniejsza zdjęcia).
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('manu-gallery','manu-gallery',false,5242880,array['image/jpeg']::text[])
on conflict (id) do update
set public=false, file_size_limit=excluded.file_size_limit,
    allowed_mime_types=excluded.allowed_mime_types;

-- Wewnętrzny folder: UUID użytkownika / ID projektu / UUID zdjęcia.jpg
-- Każdy zalogowany widzi, wgrywa i usuwa tylko pliki z własnego folderu.
drop policy if exists "manu gallery own read" on storage.objects;
create policy "manu gallery own read" on storage.objects
for select to authenticated
using (
  bucket_id='manu-gallery'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "manu gallery own upload" on storage.objects;
create policy "manu gallery own upload" on storage.objects
for insert to authenticated
with check (
  bucket_id='manu-gallery'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and storage.extension(name)='jpg'
);

drop policy if exists "manu gallery own delete" on storage.objects;
create policy "manu gallery own delete" on storage.objects
for delete to authenticated
using (
  bucket_id='manu-gallery'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

-- Nie nadajemy UPDATE, nie tworzymy publicznego dostępu do obrazów.
