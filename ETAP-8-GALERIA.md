# MANU 3.5.0 — Etap 8.2: Galeria realizacji

## Stan
- Kod galerii jest na GitHubie, ale przesyłanie zdjęć **wymaga jednorazowego uruchomienia** pliku `supabase/manu_gallery.sql` w SQL Editor projektu MANU.
- Bez tej konfiguracji istniejące projekty, klienci, konta i wyceny pozostają dostępne. Nie tworzymy publicznego magazynu.
- Tabela `manu_snapshots` pozostaje bez zmian. Zmiany galerii (podpisy, rodzaj zdjęcia i odniesienia do plików) są przechowywane w istniejącym JSON na urządzeniu i w chmurze.

## Włączenie zdjęć (administrator MANU)
1. Wejdź do Supabase -> projekt MANU -> SQL Editor -> New query.
2. Otwórz w repozytorium GitHub plik `supabase/manu_gallery.sql`, skopiuj całą jego treść do SQL Editor i kliknij Run.
3. Oczekiwany wynik: Success / No rows returned.
4. W Supabase -> Storage sprawdź obecność prywatnego bucketu `manu-gallery` (nie zmieniaj na Public).
5. Odśwież MANU v3.5.0. Wejdź w Projekty -> wybrana realizacja -> Galeria realizacji -> Dodaj zdjęcie.
6. Dodaj jedno testowe zdjęcie niezawierające cudzych danych osobowych. Sprawdź jego powiększenie, edycję podpisu i usunięcie.
7. W MANU -> Projekty -> Galeria sprawdź wspólny widok albumów.

## Ochrona i ograniczenia
- Domyślnie prywatne zdjęcia, polityki RLS ograniczają dostęp na podstawie ID zalogowanego użytkownika.
- Linki podpisane do przeglądania są ważne 30 minut; każdy posiadający taki link może zobaczyć zdjęcie aż do jego wygaśnięcia.
- Przed wysłaniem zdjęcie jest przeskalowane do 1600 px i przekodowane do JPEG (usunięcie EXIF w większości przeglądarek), maks. 5 MB.
- Maksymalnie 50 zdjęć na projekt.
- Kopia JSON **nie zawiera plików fotografii**; zachowuje tylko odniesienia, podpisy i kategorie. Nie usuwaj bucketu ani zdjęć w Supabase, jeżeli chcesz móc odtworzyć galerię z kopii.
- Jeśli usuniesz konto w Supabase lub skasujesz plik w Storage, link z kopii JSON nie pozwoli odzyskać zdjęcia.
- Nie przesyłaj zdjęć osób i danych klientów bez odpowiedniej podstawy prawnej. Nie udostępniaj podpisanych linków zdjęć osobom postronnym.
- Zdjęcia wymagają internetu i zalogowanego konta z aktywną synchronizacją.
- Wersja v3.5.0 nie zapisuje zdjęć offline ani nie oferuje pełnego eksportu galerii do ZIP. To osobny etap rozbudowy.

## Przyszłość
Eksport zdjęć do archiwum ZIP, sortowanie i wybór miniatury albumu oraz pełne testy na drugim urządzeniu.
