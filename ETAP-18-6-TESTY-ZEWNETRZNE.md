# MANU — etap 18.6: pierwsze niezależne testy beta

**Status: gotowość do zaproszenia testerów. Testy u innych osób nie zostały jeszcze przeprowadzone.**
**Wersja aplikacji do sprawdzenia: MANU 3.29.2**
**Adres:** https://artystaakrobata.github.io/Pracownia-app/

## Cel i zakres

Sprawdzić, czy dwie osoby nieznające wcześniej MANU samodzielnie poradzą sobie z instalacją i podstawową obsługą PWA: jedna na Androidzie (Chrome), druga — jeśli dostępna — na iPhonie (Safari). Jeżeli iPhone nie jest dostępny, nie oznaczać kompatybilności iOS jako potwierdzonej. Bez nowych funkcji, bez migracji danych i bez zmieniania aplikacji w trakcie pierwszej tury testów.

## Bezpieczeństwo testów

- **Wyłącznie fikcyjne dane w trybie DEMO, bez rejestracji, logowania i synchronizacji.** Bez danych klientów, dzieci i prawdziwych płatności.
- Nie używać „Usuń wszystkie dane”, „Przywróć z pliku” ani „Przywróć poprzedni zapis”. Nie odinstalowywać MANU podczas testu.
- DEMO jest izolowane i tymczasowe; nie testuje trwałości danych po restarcie. Nie używać DEMO do testu zapisu.
- Wyeksportowany PDF lub plik może pozostać na urządzeniu testera; używać wyłącznie dokumentów fikcyjnych.
- Nie przesyłać danych kont, prywatnych dokumentów ani zrzutów z danymi osobowymi. W opiniach wystarczą system, model, kroki, wynik i ewentualny zanonimizowany zrzut.
- Test nie potwierdza izolacji kont Supabase, zgodności RODO ani bezpieczeństwa korzystania z realnych danych wielu klientów.

## Scenariusz A — Android (ok. 10 minut)

1. Otwórz link do MANU w Chrome na swoim telefonie.
2. W menu Chrome wybierz „Zainstaluj aplikację” lub „Dodaj do ekranu głównego”, jeśli dostępne. Otwórz MANU z ikony.
3. W Ustawieniach sprawdź wersję `3.29.2`, sekcję „Dane i prywatność w wersji beta” i „Sprawdź gotowość offline” — oczekiwane 8/8.
4. W `Ustawienia → Testowanie aplikacji` wybierz `Uruchom bezpieczny tryb demo` i sprawdź pasek „TRYB DEMO”.
5. Otwórz fikcyjne zlecenie, zmień jego status lub koszt i sprawdź powrót. Wejdź w warsztat i obejrzyj uczestników / wpłaty.
6. Otwórz `Projekty → Więcej narzędzi → Wyceny`, przejrzyj fikcyjną wycenę, wywołaj „Drukuj / zapisz PDF”. Nie wpisuj danych prawdziwych.
7. Zamknij podgląd przyciskiem X, sprawdź systemowy Wstecz i przejścia między kartkami.
8. Zakończ DEMO. Sprawdź, czy pasek zniknął i czy zmiany demonstracyjne nie pozostały.
9. W sekcji „Plan pierwszego testu” użyj „Przygotuj opinię”; uzupełnij wyniki i prześlij osobie zapraszającej.

## Scenariusz B — iPhone / iPad (ok. 10 minut)

1. Otwórz link w **Safari**, użyj `Udostępnij → Dodaj do ekranu początkowego` i uruchom MANU z ikony.
2. Sprawdź wersję `3.29.2`; w Ustawieniach odczytaj „Sprawdź gotowość offline” (oczekiwane 8/8). Zapisz rzeczywisty wynik, nawet jeśli pojawia się problem.
3. Uruchom DEMO, otwórz fikcyjne zlecenie i warsztat, przetestuj przyciski powrotu i zamknięcie X (iPhone nie ma systemowego przycisku Wstecz Androida).
4. Otwórz wycenę i spróbuj systemowego udostępnienia / drukowania / zapisu PDF do Plików, jeżeli dana opcja jest dostępna.
5. Zakończ DEMO i zgłoś problem z przewijaniem, klawiaturą, obszarami ekranu, otwieraniem PWA, przyciskami i PDF.
6. Użyj „Przygotuj opinię” i prześlij wyniki bez danych osobowych.

## Dodatkowy test offline (tylko nowy telefon, po pobraniu 8/8)

- Przed DEMO lub po jego zakończeniu całkowicie zamknij MANU.
- Włącz tryb samolotowy i wyłącz Wi-Fi; uruchom MANU z ikony i przejdź przez Start → Projekty → Finanse → Zadania.
- Zapisz wynik i przywróć internet. Ten test potwierdza jedynie uruchomienie i nawigację offline, **nie trwałość edycji po restarcie**.
- Jeżeli test nie działa, zapisz dokładny objaw i nie czyść danych aplikacji.

## Formularz wyniku (jedna kopia na urządzenie)

```text
TEST MANU 3.29.2 — ETAP 18.6
Tester (anonimowo): A Android / B iPhone
Model i wersja systemu:
Chrome / Safari / aplikacja z ikony:
Instalacja i uruchomienie z ikony: OK / PROBLEM
Wersja 3.29.2 widoczna: TAK / NIE
Pliki offline 8/8: OK / PROBLEM / NIE TESTOWANO
DEMO i przykładowe zlecenie: OK / PROBLEM
Warsztat i rozliczenia: OK / PROBLEM
Wycena, podgląd i PDF: OK / PROBLEM / NIE TESTOWANO
Nawigacja i zamknięcie X: OK / PROBLEM
Wyjście z DEMO: OK / PROBLEM
Restart offline (opcjonalnie): OK / PROBLEM / NIE TESTOWANO
Co było niezrozumiałe:
Dokładne kroki odtworzenia problemu:
Jedna zmiana, którą warto zrobić najpierw:
```

## Rejestr etapu

| Tester | System | Zaproszenie | Raport | Uwagi |
| --- | --- | --- | --- | --- |
| A | Android | Do wysłania | Oczekuje | Brak potwierdzonego testu |
| B | iOS / iPadOS | Do wysłania | Oczekuje | Brak potwierdzonego testu |

Nie wpisywać imion, kontaktów ani treści z danymi klientów do publicznego repozytorium. Zgłoszenia i zrzuty z informacjami prywatnymi należy przechowywać poza publicznym GitHubem.

## Ocena po pierwszych dwóch opiniach

- **Krytyczny:** utrata lub nadpisanie prawdziwych danych, niezamierzony dostęp do danych, nieodwracalne działanie, całkowity brak możliwości uruchomienia. Wstrzymać szersze testy i zająć się tym najpierw.
- **Wysoki:** zablokowanie testu DEMO, zepsuta nawigacja, brak podglądu lub zapisu PDF na danym systemie. Naprawić przed rozszerzeniem beta.
- **Średni/niski:** niejasne etykiety, drobne problemy układu i kosmetyka. Zgrupować po otrzymaniu opinii, nie zmieniać aplikacji na podstawie jednego przypuszczenia.

**Etap 18.6 pozostaje otwarty**, dopóki nie otrzymamy przynajmniej jednej niezależnej opinii. Samo przygotowanie zaproszeń nie jest wykonaniem testu. Obsługę iOS można oznaczyć jako sprawdzoną dopiero po realnym teście na iPhonie/iPadzie. Dopiero później podjąć decyzję o rozszerzeniu testów.
