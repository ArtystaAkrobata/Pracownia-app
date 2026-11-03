# MANU — etap 7: konta i chmura

## Co już przygotowano
Aplikacja obsługuje opcjonalny panel „Konto i chmura” w Ustawieniach, logowanie przez e-mail/hasło, ręczne pierwsze przesłanie lub pobranie danych, automatyczne zapisywanie kolejnych zmian po powiązaniu urządzenia z kontem oraz bezpieczne zatrzymanie synchronizacji po wykryciu konfliktu wersji.

Bez konfiguracji Supabase **MANU nadal działa lokalnie**. Nie usuwać danych przeglądarki przed wyeksportowaniem JSON.

## Uruchomienie (do wykonania przez właściciela MANU)

1. Zaloguj się na https://supabase.com/ i utwórz projekt.
2. Otwórz **SQL Editor** i wykonaj zawartość pliku `supabase/manu_snapshots.sql`.
3. W **Authentication → Providers → Email** pozostaw logowanie e-mail włączone. Zalecane jest potwierdzenie adresu e-mail.
4. W **Authentication → URL Configuration** ustaw **Site URL** na `https://artystaakrobata.github.io/Pracownia-app/` i dodaj ten sam adres w **Redirect URLs**.
5. Skopiuj **Project URL** oraz **publishable key** (w starszych panelach: klucz anon/public) z ustawień projektu do pliku `cloud-config.js` na GitHubie. **Nie używaj service_role ani secret key.**
6. Odśwież MANU, otwórz **Ustawienia → Konto i chmura**, utwórz konto i potwierdź e-mail. Zaloguj się.
7. **Zanim cokolwiek zastąpisz, pobierz i sprawdź kopię JSON**. Na pierwszym urządzeniu wybierz „Wyślij dane lokalne do chmury”. Na kolejnych wybierz „Pobierz dane z chmury”.
8. Przetestuj na danych testowych. Sprawdź synchronizację po zmianie urządzenia oraz pracę bez internetu przed przeniesieniem rzeczywistych danych.

## Ochrona danych

- Konto Supabase zarządza uwierzytelnianiem. Projekt w GitHub Pages działa po HTTPS.
- Polityki RLS ograniczają każdy odczyt i zapis do właściciela wiersza.
- Kopie danych JSON w chmurze nie są szyfrowane end-to-end; administrator projektu Supabase ma dostęp do bazy. Przed udostępnianiem MANU innym użytkownikom trzeba przygotować politykę prywatności i zasady przetwarzania danych uczestników/klientów.
- Zmiana wersji z innego urządzenia nie nadpisuje lokalnych zmian automatycznie: aplikacja zatrzymuje synchronizację i prosi o wybór. Wybór „Wyślij” może zastąpić wersję w chmurze; pobierz kopie obu stron przed decyzją.
- Wylogowanie **nie usuwa lokalnych danych** z przeglądarki. Na współdzielonych urządzeniach nie traktuj go jako ochrony dostępu do wcześniej zapisanych lokalnych danych.
- Automatyczne wysyłanie działa dopiero po świadomym powiązaniu danych z kontem. Do tego momentu wszystko zostaje lokalne.

## Ograniczenia wersji 3.2.0
Nie ma jeszcze logowania przez Google, współdzielonych zespołów ani łączenia równoczesnych zmian w tych samych polach. Jedna wersja JSON jest zapisywana jako całość (z kontrolą numeru rewizji). Nie jest to system wersjonowania historii ani kopia zapasowa; warto nadal pobierać JSON.
