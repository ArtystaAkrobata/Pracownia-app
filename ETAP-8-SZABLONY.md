# MANU 3.6.0 — Etap 8.3: Szablony projektów i warsztatów

## Co działa
- W Projekty → Szablony znajduje się osobna księga szablonów z grzbietem notesu po prawej.
- Dostępne są trzy gotowe wzory: Nowe zlecenie, Warsztaty kreatywne, Realizacja z dojazdem.
- Własny szablon można dodać od zera albo utworzyć na karcie istniejącego projektu przyciskiem „Zapisz jako szablon”.
- Własne szablony można wyszukiwać, edytować i usuwać.
- Szablon zapisuje ustawienia, domyślną nazwę i rodzaj projektu, planowany czas i materiały, koszty powtarzalne, etapy oraz opcjonalne ogólne notatki.
- Po kliknięciu „Utwórz projekt” MANU OTWIERA FORMULARZ. Niczego jeszcze nie zapisuje. Zmiany w formularzu zatwierdza przycisk „Utwórz projekt”.
- Utworzony z szablonu projekt ma NOWE identyfikatory kosztów i etapów, puste daty, status Planowane, brak klienta i powiązań z klientami, brak wpłat, uczestników, zadań, czasu faktycznej pracy i fotografii.
- Szablony są częścią lokalnego JSON MANU (wersja modelu 15) i uczestniczą w dotychczasowej synchronizacji snapshot z Supabase. Żadna nowa tabela SQL nie jest potrzebna.
- Starsze kopie v14 i wcześniejsze są obsługiwane.

## Ważne
- Jeśli zapisujesz szablon z istniejącego projektu, MANU nie przenosi danych klienta, adresów, terminów, notatek konkretnego projektu, wpłat, uczestników ani zdjęć. Kopiuje natomiast NAZWĘ projektu, nazwy etapów i pozycji kosztowych, więc sprawdź, czy w tych polach przypadkiem nie wpisano nazwisk, adresów lub innych prywatnych danych.
- Powtarzalne koszty wchodzą do nowego projektu jako wpisy kosztowe BEZ DATY. Przed zapisaniem i rozliczeniem należy sprawdzić, czy kwoty odpowiadają realnym kosztom.
- Wybranie szablonu nigdy nie nadpisuje istniejącego projektu. Usunięcie szablonu nie usuwa projektów.
- Maksymalnie 300 własnych szablonów, po 40 etapów i 40 pozycji kosztowych.
- Limit archiwum i działanie chmury pozostają jak w poprzednich wersjach. Gdy zachowujesz istotne dane, pobierz kopię JSON przed większymi zmianami.

## Test na telefonie
1. W MANU wybierz Projekty → Szablony i otwórz gotowy wzór „Nowe zlecenie”.
2. Sprawdź, czy formularz projektu ma proponowaną nazwę, rodzaj oraz puste pole klienta, wpłat i terminu.
3. Anuluj formularz — nie powinien powstać projekt.
4. Otwórz jeden z istniejących projektów i naciśnij „Zapisz jako szablon”.
5. Sprawdź nazwy etapów, ceny, pozycje kosztowe i zapisz nowy szablon.
6. Wróć do Projekty → Szablony i utwórz projekt na podstawie nowego szablonu.
7. Sprawdź projekt i w Ustawieniach pobierz nową kopię JSON, która powinna zawierać szablony.

## Dalszy rozwój
- Ewentualne szablony wycen PDF, narzędzia do udostępniania wzorów, kopiowanie list materiałów warsztatowych i planowanie powtarzalnych czynności.
