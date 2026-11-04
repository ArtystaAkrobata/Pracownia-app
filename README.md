# MANU — Organizer twórcy

**Wersja 3.24.0 (MVP, testowa)** · Polska aplikacja instalowana jako PWA, przygotowana dla artystów, organizatorów warsztatów i małych pracowni rzemieślniczych.

## MANU 3.24.0 — Etap 15.5: przegląd końcowy dokumentów i płatności
- Przeprowadzono przegląd całego etapu 15: inteligentne podpowiedzi wycen (15.1), profesjonalne dokumenty PDF (15.2), podsumowanie należności i zaliczek (15.3), powielanie dokumentów i autouzupełnianie danych pracowni (15.4), nawigacja podglądów oraz integralność zapisów (15.5).
- **Naprawiono przedwczesny komunikat „Zapisano” przy wycenach.** Formularz wyceny czeka teraz na potwierdzenie trwałego zapisu w pamięci urządzenia. Dopiero po sukcesie otwiera zapisany dokument i pokazuje potwierdzenie.
- Przy błędzie pamięci nowa lub zmieniana wycena **nie jest fałszywie uznawana za zapisaną**: przywracany jest poprzedni rejestr wycen i licznik dokumentów, a formularz pozostaje otwarty wraz z wpisanymi polami. Pojawia się ostrzeżenie, żeby zweryfikować pamięć i wykonać kopię. Nie jest pobierany nowy numer wyceny. Powtórne kliknięcie **Zapisz** podczas trwającej operacji nie tworzy duplikatu.
- Dodano testy end-to-end w środowisku symulacyjnym: zapis nowej oferty z danymi klienta, awaria zapisu nowej oferty, awaria edycji dokumentu, nowa numeracja powielanej wyceny i nienaruszalność pierwotnego dokumentu, oddzielenie PDF od finansów projektu i zaliczek. Uruchomiono też istniejące testy nawigacji wstecz, kompatybilności starych wycen, historii wpłat, filtrowania oraz integralności backupów.
- Zmiana nie wymaga migracji danych (`version:18`), nie zmienia formatu PDF ani bazy `pracownia_db_v1`. Interfejs nie dostaje nowych paneli; pozostaje czytelny na telefonie.
- **Ograniczenie:** MANU jest nadal wersją testową. Testy automatyczne weryfikują logikę i składnię, ale nie zastępują przeglądu wydruku PDF i zachowania przeglądarki na fizycznym Androidzie. Użytkownik powinien nadal regularnie eksportować kopię JSON. Dane istniejących klientów i ofert pozostają zapisane lokalnie lub w skonfigurowanej chmurze.
- PWA `manu-app-v3.24.0`, gałąź kopii bezpieczeństwa kodu: `backup-manu-v3-23-2-before-stage-15-final-audit`.

### Kontrola zamknięcia etapu 15 na telefonie
1. Otwórz **Wyceny**. Utwórz krótką ofertę z danymi klienta i zapisz — podgląd powinien otworzyć się dopiero po zakończeniu zapisu.
2. Otwórz zapisany dokument, **Edytuj**, **Wróć do podglądu**, **Powiel dokument**, a następnie **Wstecz** i **Zamknij**. Zapisane dokumenty i historia powinny pozostać czytelne.
3. Sprawdź wydruk **PDF** w stylu klasycznym i minimalistycznym.
4. W **Finansach → Należności i zaliczki** sprawdź kwotę pozostałą do zapłaty i filtry, porównaj z konkretną kartą projektu / uczestnika.
5. W **Ustawieniach** pobierz kopię JSON i sprawdź, czy zawiera wyceny oraz rozliczenia.

## MANU 3.23.2 — Nawigacja wstecz w podglądzie dokumentu
- Po wybraniu **Edytuj** albo **Powiel dokument** z podglądu MANU zapamiętuje, z którego dokumentu otwarto formularz oraz pozycję przewinięcia.
- **Wróć do podglądu**, krzyżyk w nagłówku formularza, kliknięcie tła i systemowy **Wstecz** na Androidzie wracają do podglądu **tego samego dokumentu**. Formularz kopii nie tworzy nowego rekordu, dopóki nie zostanie zapisany.
- Przycisk **Zamknij** w samym podglądzie zamyka podgląd i odsłania **rejestr wycen**, zachowując jego pozycję.
- Dodano delikatną animację odwrotnego obrotu kartki przy powrocie z formularza. Ustawienie systemowe „ogranicz ruch” nadal wyłącza animacje.
- Gdy formularz otwarto bezpośrednio z listy, anulowanie nadal zamyka formularz. Zapis nowej lub edytowanej wyceny nadal pokazuje właściwy podgląd po zapisie.
- Nie zmieniono danych, cen, rabatów, wpłat, numeracji ani schematu bazy. Wersja PWA `manu-app-v3.23.2`. Kopia kodu przed naprawą: `backup-manu-v3-23-1-before-quote-back-flow`.

### Test na telefonie
1. Otwórz **Projekty → Więcej narzędzi → Wyceny**, następnie **Podgląd / PDF** dowolnego dokumentu.
2. Naciśnij **Edytuj** i **Wróć do podglądu**: powinien wrócić podgląd tego samego dokumentu, a nie kolejna kartka.
3. Naciśnij **Powiel dokument**, potem Androidowy **Wstecz**: powinien wrócić oryginalny podgląd bez zapisywania kopii.
4. Na podglądzie wybierz **Zamknij**: powinien pozostać rejestr wycen, nie strona innego projektu.
5. Sprawdź, czy zapis edytowanej lub powielonej wyceny nadal działa.

## MANU 3.23.1 — Drobna poprawka podglądu wycen
- Na ekranach do 440 px, gdy podgląd ma 4 akcje: **Drukuj / zapisz PDF** jest w pierwszym rzędzie, **Edytuj** i **Powiel dokument** obok siebie w kolejnym, a **Zamknij** jest wyśrodkowany w ostatnim rzędzie i ma szerokość jednego górnego przycisku.
- Tylko poprawka wyglądu. Bez ingerencji w dokumenty, wyceny, zapisane dane, historię projektów i logikę akcji.
- Nowa wersja PWA `manu-app-v3.23.1`. Backup kodu: `backup-manu-v3-23-0-before-center-close-button`.

## MANU 3.23.0 — Etap 15.4: automatyzacja powtarzalnych czynności
- W podglądzie zapisanej wyceny lub oferty cenowej dodano przycisk **Powiel dokument**. Otwiera on **nowy, niezapisany formularz**, bazujący na zapisanym dokumencie: przejmuje tytuł, wystawcę i klienta, pozycje z ilościami i cenami, rabat, opis, styl oraz warunki. Nie aktualizuje ani nie nadpisuje oryginału.
- Kopia otrzymuje proponowany **nowy numer** z istniejącego licznika (ostateczny numer jest przydzielany przy zapisie), **dzisiejszą datę wystawienia** i **pustą datę ważności**. Przed zapisem trzeba sprawdzić bieżące ceny, klienta, terminy i warunki. Jeśli przypisany do oryginału projekt został usunięty, powiązanie nie jest kopiowane.
- Numeracja, historia projektów, fakt wpłaty i rozliczenia pozostają bez zmian; kopia trafi na listę dopiero po zatwierdzeniu **Zapisz wycenę**. Zrezygnowanie z formularza nie tworzy żadnego rekordu.
- W zwijanym **Asystencie wyceny** znajduje się też nowy przycisk **Wstaw dane wystawiającego z ostatniego dokumentu**, pobierający ostatnio zapisaną nazwę pracowni i kontakt. Nie zmienia odbiorcy, pozycji, cen ani rabatu. Przy istniejącej innej nazwie lub kontakcie wymaga potwierdzenia.
- Przycisk jest niedostępny, gdy w bazie nie ma żadnego dokumentu z danymi wystawiającego. Nie zapisujemy dodatkowego profilu ani ustawień, tylko odczytujemy już istniejące wyceny.
- Poprawiono mobilny układ przycisków w podglądzie; dodatkowe działania nadal są **w podglądzie**, aby nie zagęszczać rejestru dokumentów.
- Bez zmian schematu JSON `version:18`, nazwy bazy `pracownia_db_v1`, historii wpłat, cen projektów i formatów wydruku. Cache PWA `manu-app-v3.23.0`. Backup kodu: `backup-manu-v3-22-0-before-repeat-workflows`.

### Test etapu 15.4 na telefonie
1. Wejdź w **Projekty → Więcej narzędzi → Wyceny**, wybierz zapisaną wycenę i otwórz **Podgląd / PDF**.
2. Naciśnij **Powiel dokument**. Sprawdź, że numer jest nowy, data wystawienia dzisiejsza, data „Ważna do” pusta, a pozycje, klient i warunki są skopiowane.
3. Zmień cenę lub tytuł i **Zapisz wycenę**. Sprawdź, że nowy dokument powstał obok starego oraz że stary nie został zmieniony.
4. Otwórz kolejny nowy formularz, rozwiń **Asystent wyceny** i naciśnij **Wstaw dane wystawiającego z ostatniego dokumentu**. Sprawdź kontakt pracowni; klient i pozycje powinny pozostać bez zmian.
5. Otwórz kolejną kopię i wybierz **Anuluj**. Rejestr nie powinien zawierać niezapisanej kopii.

## MANU 3.22.0 — Etap 15.3: kontrola należności i zaliczek
- Na kartce **Finanse** dodano zwijany panel **Należności i zaliczki**. Zawiera podsumowanie: **Otrzymano łącznie**, **Zaliczki w historii**, **Do otrzymania** oraz **Po terminie**.
- Lista pokazuje tylko realizacje z nieopłaconą kwotą, z wyraźnym stanem terminów: **po terminie**, **dzisiaj**, **w ciągu 7 dni**, **później** lub **bez terminu**. Daty pochodzą z istniejącego pola **Termin płatności** projektu.
- Dostępne filtry: wszystkie, po terminie, najbliższe 7 dni (wraz z dzisiaj), bez terminu. Widać 12 pozycji na raz z opcją „Pokaż kolejne”. Filtry i rozwinięcie działają bez przewijania strony na początek.
- Przy należności można otworzyć właściwy rozdział projektu. **Zlecenia i warsztaty rozliczane ręcznie** mają również bezpośredni przycisk **Dodaj wpłatę**; **warsztaty rozliczane według uczestników** prowadzą do sekcji **Uczestnicy i wpłaty** i nie pozwalają zaksięgować wpłaty zbiorczej niewłaściwą metodą.
- Obliczenia używają istniejących funkcji `projectIncome` i `projectPaid`. Zaliczki sumują jedynie wpisy oznaczone `kind='zaliczka'` z historii, **bez** kwalifikowania starszych kwot bez rodzaju jako zaliczek. Przy warsztacie uczestnikowym nie sumuje się ręcznych kwot warsztatu z rozliczeniami uczestników; uczestnicy rezerwowi są wykluczeni.
- Projekty anulowane są wykluczone. W pełni opłacone nie pojawiają się na liście należności, ale kwoty otrzymane nadal uwzględnia podsumowanie. Brak zmian danych, terminów, wpłat, numeracji dokumentów, schematu JSON i bazy.
- Wersja PWA `manu-app-v3.22.0`; gałąź bezpieczeństwa `backup-manu-v3-21-1-before-payment-control`.

### Test etapu 15.3 na telefonie
1. Przejdź do **Finanse** i otwórz panel **Należności i zaliczki** (pod ogólnym podsumowaniem finansów).
2. Sprawdź kwoty łączne i filtr **Po terminie**, następnie **Dzisiaj i najbliższe 7 dni** oraz **Bez terminu**. Zmiana filtra nie powinna przenosić strony do góry.
3. Przy zleceniu naciśnij **Otwórz rozliczenie**, a następnie **Dodaj wpłatę**; sprawdź historię i pozostałą kwotę.
4. Jeśli masz warsztat rozliczany uczestnikami, naciśnij **Uczestnicy i wpłaty** — powinien otworzyć się szczegółowy widok ich rozliczeń.
5. Zweryfikuj, czy starsze wpłaty bez kategorii nie są błędnie nazwane zaliczkami, oraz że nie pojawiają się anulowane projekty.

## MANU 3.21.1 — Dopasowanie tytułu do rodzaju dokumentu
- Przy zmianie **Wycena → Oferta cenowa** MANU aktualizuje wyłącznie domyślny tytuł, np. „Wycena — Lustro” → „Oferta — Lustro”. Nie nadpisuje samodzielnie wpisanego tytułu.
- Przy powrocie do wyceny analogicznie przywracany jest domyślny opis. Aktualizacja PWA wczytuje nowe zachowanie.

## MANU 3.21.0 — Etap 15.2: profesjonalne dokumenty dla klientów
- Dotychczasowa sekcja **Wyceny** obsługuje teraz dwa warianty dokumentu: **Wycena** oraz **Oferta cenowa**. Numeracja `MANU-RRRR-NNN`, lista dokumentów, powiązanie z projektem i podgląd PDF pozostają wspólne. Nowy dokument domyślnie jest wyceną.
- W formularzu znajduje się zwijana sekcja **Wygląd i treść dokumentu**. Można wybrać wariant nagłówka oraz styl **Klasyczny MANU** (miedziany) albo **Minimalistyczny** (jasny). Rozwinięcie sekcji jest opcjonalne: nie wprowadzamy kolejnych niepotrzebnych pól do podstawowego formularza.
- Nowe pola: **Wprowadzenie / opis propozycji**, **Termin realizacji** i **Warunki płatności**. Są opcjonalne, zapisują się z dokumentem, pojawiają się w podglądzie i w wydruku PDF, a ich treść jest kodowana przed wstawieniem do HTML. Stare wyceny mają puste pola i nadal wyświetlają napis „WARTOŚĆ WYCENY”.
- Dla **Oferty cenowej** nagłówek i podsumowanie używają właściwych nazw: „OFERTA CENOWA”, „WARTOŚĆ OFERTY”. Wygląd minimalistyczny jest świadomym wyborem bez ciężkich kolorów. Dokument nie jest fakturą, potwierdzeniem zapłaty ani automatyczną umową.
- Zostaje systemowy **Drukuj / zapisz PDF** Androida, bez automatycznego wysyłania dokumentów. Nie zmieniono bazy `pracownia_db_v1`, schematu `version:18`, cen, kosztów, stanu wpłat, historii ani istniejących wycen.
- Zaktualizowano cache PWA do `manu-app-v3.21.0`. Gałąź z kopią kodu przed etapem: `backup-manu-v3-20-0-before-professional-docs`.

### Test etapu 15.2 na telefonie
1. Przejdź do **Projekty → Więcej narzędzi → Wyceny → Nowa wycena**.
2. Otwórz **Wygląd i treść dokumentu**, wybierz **Oferta cenowa** oraz styl **Minimalistyczny**. Wpisz wprowadzenie, termin i warunki płatności.
3. Dodaj pozycję i cenę, zapisz. Sprawdź nagłówek, sekcje i wartość w podglądzie.
4. Wybierz **Drukuj / zapisz PDF**, następnie w Androidzie **Zapisz jako PDF**; sprawdź czytelność A4, także dla kilku pozycji.
5. Otwórz wcześniej zapisaną wycenę i upewnij się, że ma dotychczasowy nagłówek, cenę oraz niezmienione rozliczenia projektu.

## MANU 3.20.0 — Etap 15.1: inteligentne przygotowanie wycen
- Zapisane wyceny oraz formularz zyskały **zwijany Asystent wyceny**, domyślnie zamknięty, aby nie przeciążyć interfejsu na telefonie.
- Po wyborze projektu można świadomie użyć **Wstaw dane wybranego projektu**: pobranie tytułu, powiązanego klienta (lub samej nazwy), wartości sprzedaży i ilości. Wymaga potwierdzenia, bo zastępuje pozycje i rabat w bieżącym formularzu. **Nie zmienia** projektu, kwoty, kosztów, stanu wpłat ani dat.
- Zapisane karty klientów można wybrać w asystencie i nacisnąć **Uzupełnij dane klienta**. Kopiowana jest nazwa firmy / kontaktu, e-mail, telefon i adres. Dane pozostają edytowalne; wybranie klienta samo w sobie nic nie zmienia.
- Dodano do wyceny pola **Kontakt klienta** i **Adres klienta**; oba są opcjonalne, zapisywane w JSON/chmurze razem z wyceną oraz pokazywane w podglądzie i PDF. Dawne wyceny odczytują puste pola — bez migracji bazy, numeracji ani zmiany schematu `version:18`. Upewnij się, że masz podstawę do przetwarzania danych klienta.
- Asystent oferuje zwijane **Materiały i koszty — podpowiedzi pozycji** na podstawie list przygotowań warsztatu i faktycznie wpisanych wydatków. Można wkleić opis i ilość do nowej pozycji, lecz cena wynosi domyślnie **0 zł**. To celowe: **koszt własny nie jest ceną dla klienta**, a pozycję trzeba wycenić i sprawdzić ręcznie. Projektowa wycena główna pozostaje nietknięta, więc przy rozbijaniu oferty sprawdź, czy sumy się nie dublują.
- Zmiana projektu w formularzu aktualizuje tylko podpowiedzi, bez utraty wpisanego tekstu ani przewinięcia. Nie dodano serwera, płatności ani automatycznej wysyłki PDF.
- Wersja PWA `manu-app-v3.20.0`. Kopia bezpieczeństwa kodu: `backup-manu-v3-19-5-before-quote-assistant`.

### Test na telefonie
1. Otwórz **Projekty → Więcej narzędzi → Wyceny → Nowa wycena**; wybierz istniejący projekt.
2. Rozwiń **Asystent wyceny**, użyj **Wstaw dane wybranego projektu**, potwierdź. Sprawdź ilość, cenę, klienta.
3. Wybierz istniejący kontakt i użyj **Uzupełnij dane klienta**. Sprawdź e-mail i adres.
4. Rozwiń **Materiały i koszty** i użyj **Wstaw opis** dla próbnego kosztu. Sprawdź, że cena nowej pozycji wynosi 0 zł, następnie wpisz właściwą cenę oferty.
5. Zapisz wycenę, sprawdź PDF, oryginalną cenę projektu, koszty i wpłaty. Wykonaj kopię JSON i sprawdź liczbę wycen.

## MANU 3.19.5 — Wyśrodkowany trzeci skrót
- Na telefonie, jeśli wybrane są dokładnie 3 szybkie działania, trzeci przycisk wyświetla się pośrodku drugiego rzędu, zachowując szerokość górnych.
- Przy jednym i dwóch skrótach układ bez zmian; brak zmian w danych oraz logice personalizacji.
- Wersja PWA i cache podniesiona, by pobrać poprawkę.

## MANU 3.19.4 — Etap 14.4: kolejność szybkich działań
- W **Ustawienia → Personalizacja MANU** pod listą maksymalnie trzech szybkich działań widoczna jest teraz ich kolejność na ekranie Start. Przyciskami **↑** i **↓** zmienisz miejsce zaznaczonych skrótów bez przeciągania i bez przeskoków strony.
- Strzałki na początku i końcu listy są nieaktywne. Zaznaczanie i odznaczanie skrótów automatycznie aktualizuje widoczną kolejność; całkowite wyłączenie skrótów ukrywa pasek na ekranie Start.
- Zmiany zapisują się **lokalnie na urządzeniu**. Nie zmieniono bazy projektów, danych finansowych, wyglądu okładki ani dolnej nawigacji. Po powrocie do Start zobaczysz nowy porządek skrótów.
- Testy regresyjne obejmują walidację listy, zapis ustawień, przesuwanie i ukrywanie paska.

### Sprawdź na telefonie
1. Otwórz **Ustawienia → Personalizacja MANU** i zaznacz 2–3 szybkie działania.
2. W sekcji ich kolejności przesuń wybraną pozycję **↑** lub **↓**. Strona nie powinna przewijać się na górę.
3. Wróć na **Start** i sprawdź kolejność przycisków.
4. Wyłącz wszystkie szybkie działania i sprawdź, że pasek na Start znika. Włącz je ponownie i ustaw własną kolejność.

## MANU 3.1.1 — Końcowe poprawki etapu 6
- **Unikalna numeracja po usunięciu:** ostatni numer dla roku zapisywany jest w `quoteCounters` we wspólnej kopii JSON v12. Skasowanie wyceny nie pozwala ponownie użyć starego numeru.
- **Powrót bez przeskakiwania:** anulowanie wyceny rozpoczętej z karty projektu przywraca projekt w miejscu przewinięcia sprzed otwarcia formularza. Dodawanie i usuwanie pozycji nie przeładowuje notesu.
- **Wydruk bez pozostałości:** dokument do drukowania jest tworzony dopiero na polecenie użytkownika, a po zamknięciu podglądu lub zakończeniu drukowania ukryta kopia jest czyszczona.
- **Jasna nomenklatura:** dokument prezentuje „WARTOŚĆ WYCENY”, nie wezwanie „do zapłaty”. Nie jest to faktura ani rozliczenie VAT.
- Cache PWA `manu-app-v3.1.1`; schemat JSON nadal `version:12`, a nazwa lokalnej bazy i identyfikator instalacji pozostają niezmienione.

## MANU 3.1.0 — Etap 6: profesjonalne wyceny i dokumenty PDF
- **Rejestr wycen:** nowy widok **Wyceny** dostępny z menu bocznego, a na Androidzie przyciskiem **Wyceny** na stronie Projektów. Każda wycena może być samodzielna lub połączona z konkretnym zleceniem/warsztatem. Ze szczegółów projektu dostępny jest przycisk **Przygotuj wycenę**.
- **Formularz wyceny:** automatyczny unikalny numer w danym roku (np. `MANU-2026-001`), data wystawienia i ważności, tytuł, wystawiający, dane kontaktowe, odbiorca oraz warunki. Wycena zawiera do 80 pozycji z opisem, ilością, jednostką i ceną jednostkową. Dodawanie/usuwanie pozycji aktualizuje sumę lokalnie **bez przewijania notesu na górę**. Rabat jest kwotowy, nie procentowy; nie może przekroczyć sumy pozycji.
- **Wycena z projektu:** nazwa, klient oraz wstępna cena są przenoszone do nowego formularza, ale po zapisaniu wyceny **nie są zmieniane** dane źródłowego zlecenia, cena, wpłaty, podatki, koszty, stoper ani terminy. Pozwala to przygotowywać wersje ofert bez wpływu na historię rozliczeń.
- **Przechowywanie wycen:** lista podglądów z kwotami, edycja, kasowanie po potwierdzeniu. Wyceny znajdują się w tym samym lokalnym magazynie. Kopia JSON `version:12` zawiera `quotes[]`; kontrola kopii pokazuje także liczbę wycen, a starsze kopie do wersji 11 automatycznie odczytują pustą listę wycen.
- **Elegancki dokument A4:** logo MANU, numer wyceny, daty, dane klienta, tabela cen, rabat, kwota do zapłaty oraz uwagi. Przycisk **Drukuj / zapisz PDF** otwiera systemowe okno drukowania na Androidzie i w przeglądarce, w którym użytkownik wybiera **Zapisz jako PDF**. Aplikacja nie generuje samodzielnie pobieralnego pliku PDF jednym kliknięciem i nie wysyła go do klienta.
- **Wydruk bez interfejsu:** wydzielona sekcja `#quote-print-root` i style `@media print`; inne elementy MANU, menu, przyciski i modalne tła są ukrywane w wydruku. Na wielu stronach A4 powtarza się nagłówek tabeli. Wersja jest zaprojektowana mobilnie, ale jakość i podział stron trzeba jeszcze zweryfikować w systemowym podglądzie Androida.
- **Bez automatycznego VAT:** wartości są cenami wyceny, aplikacja nie oblicza podatku VAT, nie określa statusu podatkowego wystawcy i nie wystawia faktur. Przed udostępnieniem oferty sprawdź prawidłowość cen i potrzebne dane identyfikacyjne.
- **Zgodność:** nie zmieniono nazwy IndexedDB `pracownia_db_v1`, klucza `snapshot` ani identyfikatora PWA. Nadal działają wszystkie etapy, przypomnienia, warsztaty, stoper, historia wpłat i odwracanie przewijania. Backup kodu: `backup-manu-v3-0-1-before-quotes`.

### Test etapu 6 na telefonie
1. Otwórz **Ustawienia** i pobierz kopię JSON, zachowując plik poza telefonem.
2. Wejdź w **Projekty → Wyceny** albo w szczegóły próbnego zlecenia i wybierz **Przygotuj wycenę**.
3. Dodaj dwie lub więcej pozycji, ustaw ilości i ceny oraz rabat. Sprawdź poprawność sumy i to, czy kartka nie przewija się na górę.
4. Zapisz wycenę. W podglądzie sprawdź dane odbiorcy, tabelę, kwoty i warunki.
5. Wybierz **Drukuj / zapisz PDF → Zapisz jako PDF**. Otwórz powstały plik i sprawdź układ A4 (zwłaszcza przy kilku pozycjach i długim tekście).
6. Edytuj utworzoną wycenę i upewnij się, że pierwotna wartość zlecenia, koszty i otrzymane wpłaty nie zostały zmienione.
7. W Ustawieniach pobierz nową kopię JSON i wybierz **Sprawdź plik kopii**: liczba wycen musi zgadzać się z listą.

## MANU 3.0.1 — Poprawa brzegu kartki Kalendarza
- **Kalendarz ma teraz prawą krawędź notesu**, tak samo jak Finanse. Klasę `open-notebook--right` nadaje wspólna funkcja `openNotebook`; istniejące reguły CSS przenoszą skórzany grzbiet i detale na prawą stronę także na telefonie.
- **Bez zmian**: Projekty i Zadania pozostają lewymi kartkami. Kalendarz i Finanse są prawymi kartkami. Animacja przewracania, przypomnienia, scroll, stoper, warsztaty, finanse i dane użytkownika pozostają bez zmian.
- Wersja cache PWA to `manu-app-v3.0.1` dla pobrania poprawionej wersji na Androidzie; struktura JSON `version:11`, baza `pracownia_db_v1` i identyfikator instalacji są niezmienione.
- Kopia kodu sprzed zmiany: `backup-manu-v3-0-before-calendar-edge-fix`.

## MANU 3.0 — Etap 5: kalendarz i przypomnienia
- **Kalendarz miesięczny:** nowa zakładka „Kalendarz” w menu bocznym i dolnej nawigacji Androida, z dniami tygodnia od poniedziałku. Przełączanie miesięcy, wybór dnia i podgląd szczegółów odbywają się bez przeładowywania całego notesu i bez przeskoków do góry. Zachowano środkowy przycisk „Dodaj” w nawigacji mobilnej.
- **Terminy projektów i warsztatów:** terminy pochodzą z dotychczasowego pola `date`. Warsztaty pokazują godzinę startu, jeśli została wpisana. Zakończone projekty są w kalendarzu, ale nie trafiają do listy aktywnych zaległości.
- **Zadania:** terminy w kalendarzu pochodzą z `tasks.due`. Na karcie kalendarza można je oznaczać jako wykonane, cofać oznaczenie i otworzyć edycję terminu. Ukończone zadania nadal są widoczne w historii dnia.
- **Terminy płatności:** do formularza projektu/warsztatu dodano pole `paymentDue` („Termin płatności / rozliczenia”). Jeżeli nadal pozostała należność, w kalendarzu pojawi się termin i kwota do otrzymania; po uregulowaniu całości wpis automatycznie znika. Na karcie szczegółów widać termin pozostałej płatności. Termin nie nalicza automatycznie nowych wpłat ani nie zmienia finansów.
- **Własne przypomnienia:** tytuł, data, opcjonalna godzina i przypisanie do projektu. Przypomnienia można dodawać, edytować, oznaczać jako wykonane, cofać oznaczenie i usuwać.
- **Najbliższe terminy:** karta na pulpicie i w kalendarzu pokazuje zaległe wpisy, dzisiejsze oraz nadchodzące w ciągu 7 dni. Operacje w kalendarzu odświeżają wyłącznie jego zawartość, zachowując przewinięcie i eliminując niepotrzebne animacje.
- **Granica działania przypomnień:** powiadomienia są **wewnętrzne**, widoczne podczas korzystania z MANU. MANU nie wysyła automatycznych powiadomień przy całkowicie zamkniętej aplikacji. Nie ma jeszcze serwera, web push, budzenia aplikacji w tle, SMS ani gwarantowanego systemowego powiadomienia przy zamkniętym MANU. Godzina przypomnienia służy do prezentacji i sortowania wydarzeń, nie uruchamia alarmu.
- **Przechowywanie i kompatybilność:** schema JSON `version:11`; klucze: `projects[].paymentDue`, `tasks[].due` (bez zmian) oraz `reminders[]`. Zostają niezmienione IndexedDB `pracownia_db_v1`, klucz `snapshot`, identyfikator PWA, układ okładki i motyw MANU. Kopie JSON wersji 10 i starszych są automatycznie uzupełniane o nowe pola, bez kasowania projektów i wpłat.
- **Backup kodu:** `backup-manu-v2-9-1-before-calendar`.

### Scenariusz testowy na Samsungu
1. Najpierw pobierz kopię JSON z Ustawień. Zamknij i otwórz MANU ponownie po aktualizacji.
2. Otwórz **Kalendarz** w dolnej nawigacji. Przewijaj stronę i zmieniaj miesiące: notes nie powinien skakać do góry.
3. Wybierz dzień, dodaj przypomnienie z godziną i zapisz. Sprawdź, czy pozostajesz w tym samym miejscu.
4. Odhacz przypomnienie, potem cofnij zaznaczenie i zmień jego datę.
5. Dodaj zadanie z terminem i sprawdź, czy pokazuje się w kalendarzu; zmień termin bez opuszczania kalendarza.
6. W formularzu próbnego projektu ustaw termin płatności i pozostaw niezapłaconą część ceny — zobaczysz ją w kalendarzu.
7. Otwórz MANU bez internetu (po wcześniejszym pobraniu zasobów), sprawdź terminy i eksport JSON. Nie czyść pamięci aplikacji.

## MANU 2.9.1 — Naprawa przeskakiwania do góry w warsztatach
- Przed otwarciem formularza z karty projektu (w tym **Dodaj materiał**), MANU zapamiętuje przewinięcie kartki i pozycję strony. Po **Zapisz** lub **Wróć** odtwarza otwartą kartkę w tym samym miejscu.
- Przy odhaczaniu i usuwaniu materiałów, obecności i etapów zachowano wcześniejszy mechanizm przewijania bez ponownej animacji notesu.
- Poprawiono odtwarzanie fokusu właściwego przycisku przy wielu podobnych kontrolkach materiałów. Każdy element odróżniany jest po pełnym zestawie atrybutów identyfikujących, a fokus wraca bez przewijania.
- Poprawka obejmuje także inne formularze otwierane z karty realizacji, jeśli prowadzą z powrotem do tej samej karty.
- **Bez zmiany danych:** schema JSON nadal `version:10`, baza `pracownia_db_v1`, klucz `snapshot`; nie zmieniano uczestników, list rezerwowych, czasu pracy ani finansów.
- Kopia kodu sprzed aktualizacji: `backup-manu-v2-9-before-material-scroll-fix`.

### Jak sprawdzić na telefonie
1. Otwórz próbny warsztat, przewiń do „Przygotowanie warsztatu”.
2. Wybierz „Dodaj materiał”, wpisz materiał i zapisz. Karta powinna wrócić w to samo miejsce.
3. Odhacz drugi lub trzeci materiał, a następnie cofnij zaznaczenie — kartka nie powinna skakać do góry.
4. Kliknij „Dodaj materiał” i „Wróć” bez zapisywania. Pozycja powinna zostać zachowana również wtedy.
5. Spróbuj usunąć próbny materiał. Pozostałe dane warsztatu powinny pozostać bez zmian.

## MANU 2.9 — Etap 4: profesjonalna organizacja warsztatów
- **Rejestracja uczestników:** każdy warsztat posiada listę **potwierdzonych** miejsc i **listę rezerwową**. Limit z formularza warsztatu obejmuje wyłącznie potwierdzonych. `0` oznacza brak limitu. Po zapełnieniu miejsc nowi uczestnicy trafiają automatycznie na listę rezerwową; nie mogą wpłacić pieniędzy przed potwierdzeniem.
- **Kolejka rezerwowa:** po zwolnieniu miejsca w karcie warsztatu pojawia się przycisk „Potwierdź miejsce” dla pierwszej osoby z kolejki. Promowanie następuje na żądanie (bez automatycznej zmiany rozliczeń) i zachowuje kolejność zapisów. Potwierdzonego uczestnika można przenieść na koniec rezerwowej wyłącznie, jeśli nie ma wpłat ani oznaczonej obecności.
- **Bezpieczny limit:** edycja warsztatu nie pozwala zmniejszyć limitu poniżej już potwierdzonych miejsc. Nieograniczona liczba rezerwowych nie zawyża przychodu: prognozowana wartość, otrzymane wpłaty i zaległości w trybie rozliczania z uczestników pochodzą tylko z miejsc potwierdzonych.
- **Obecności:** przy każdym potwierdzonym uczestniku przyciski „Obecny”, „Nieobecny”, „Nieustalone”. Wpisy mogą być zmieniane i są zapisywane w projekcie; sama obecność nie powoduje automatycznych zwrotów ani zmiany ceny.
- **Materiały i przygotowania:** lista rzeczy do przygotowania z nazwą, liczbą sztuk, odhaczaniem gotowych pozycji i możliwością usunięcia. Materiały na checkliście nie tworzą automatycznie wydatków (wydatki wpisuje się nadal w finansach).
- **Podsumowanie warsztatu:** podgląd potwierdzonych uczestników, obecności, rezerwowych, planowanego przychodu, wpłat, kosztów, uproszczonego wyniku i zarobku za godzinę. Osobny przycisk „Oznacz warsztat jako zakończony” zmienia status, zachowując możliwość poprawy rozliczeń i obecności.
- **Zachowanie danych:** stare warsztaty przechodzą na `bookingStatus: confirmed` i `attendance: unknown`, nie tracąc nazw, wpłat, kosztów, etapów, stoperów i historii. Istniejąca struktura `pracownia_db_v1`, `snapshot` oraz identyfikator PWA pozostają bez zmian. Schemat kopii to `version:10`; import przyjmuje poprzednie wersje.
- **Dostępność i ograniczenia:** są to zapisy **obsługiwane ręcznie przez organizatora w lokalnej aplikacji**, nie publiczny formularz internetowy ani automatyczne wiadomości do uczestników. MANU nadal nie udostępnia serwerowej synchronizacji, kont, automatycznych powiadomień, refundacji ani integracji z płatnościami. Rezerwowi nie mogą wpłacać w aplikacji. Nie wpisuj danych osobowych prawdziwych uczestników bez właściwego zabezpieczenia i podstawy prawnej.
- **Kopia kodu sprzed etapu:** `backup-manu-v2-8-before-workshops`.

### Test na telefonie
1. W Ustawieniach zrób kopię JSON przed testowaniem na istniejących danych.
2. Utwórz **próbny** warsztat z limitem dwóch miejsc. Dodaj dwie potwierdzone osoby, następnie trzecią na rezerwową.
3. Odhacz obecność potwierdzonych, dodaj preparaty/materiały na checklistę i zaznacz jeden przygotowany.
4. Usuń nieopłaconego, potwierdzonego uczestnika; powinno zwolnić się miejsce. Potwierdź pierwszą osobę z rezerwowej.
5. Zapisz dla nowo potwierdzonej osoby wpłatę; sprawdź sumy, podsumowanie warsztatu i saldo finansów.
6. Użyj „Oznacz warsztat jako zakończony”, po czym sprawdź dostępność historii i możliwości edycji.
7. Wyeksportuj JSON i sprawdź poprawność kopii. Nie usuwaj ani nie instaluj ponownie aplikacji bez sprawdzonej kopii.

## MANU 2.8 — Etap 3: zaawansowane finanse
- **Historia wpłat:** do zleceń oraz warsztatów rozliczanych ręcznie można dopisywać wpłaty i zaliczki z datą, kwotą i opisem. Dotychczasowe ręczne pole `paid` nie jest kasowane ani powielane; nowe wpłaty są do niego dodawane. Nadpłaty ponad niewyrównaną cenę są blokowane. Wpisy można usuwać po potwierdzeniu.
- **Warsztaty i uczestnicy:** przy każdym uczestniku jest nowy przycisk „Wpłata”. Zapisane wcześniej `paidAmount` staje się kwotą bazową bez daty, a kolejne zaliczki i dopłaty trafiają do historii uczestnika. Łączne sumy finansowe warsztatu nadal wynikają z uczestników tylko w trybie `participants`; w trybie ręcznym używana jest suma ręczna z historią wpłat na poziomie warsztatu.
- **Koszty faktyczne:** nowy koszt ma kategorię (materiały, usługi, dojazd faktyczny, inne), datę i kwotę. Wcześniejsze koszty pozostają bez przypisanej daty, ponieważ nie znamy historycznego dnia ich poniesienia.
- **Budżet kontra wydatki:** karta projektu pokazuje planowane materiały + szacowany dojazd, koszty wpisane jako faktycznie poniesione oraz całkowity koszt używany w uproszczonej kalkulacji wyniku.
- **Bez podwójnego dojazdu:** jeśli wpisano przynajmniej jeden faktyczny wydatek typu „Dojazd”, szacunkowa wartość z kalkulatora nie jest drugi raz doliczana do wyniku. Suma wydatków dojazdu pochodzi wówczas z wpisów rzeczywistych. Stare wydatki bez kategorii nie są rozpoznawane automatycznie jako dojazd — przejrzyj je przed dodaniem nowego wydatku.
- **Raport miesięczny:** w Finanse → Raport miesięczny można wybrać miesiąc i zobaczyć otrzymane wpłaty, rzeczywiście wpisane wydatki, dodatnie lub ujemne saldo gotówkowe oraz listę transakcji. Ten raport obejmuje **wyłącznie rekordy z datą**; dawne bazowe kwoty, koszty bez daty, niezapłacone należności i planowany dojazd nie są przydzielane do miesiąca. Raport przychodów według daty ukończenia projektu nie jest jeszcze wprowadzony.
- **Zestawienie ogólne:** nieanulowane projekty nadal pokazują wartość realizacji, uproszczony wynik po kosztach i rentowność za godzinę. **Wartość projektów to nie otrzymane pieniądze**, a saldo miesięczne to nie dochód podatkowy.
- **Powielanie projektów:** nie kopiuje nowych wpłat, a kopiowanym wydatkom usuwa daty, żeby nie trafiły ponownie do miesięcznego raportu. Przed potraktowaniem powielonych wydatków jako rzeczywistych trzeba je skorygować.
- **Schemat kopii:** `version:9` przy niezmienionej bazie `pracownia_db_v1`, kluczu `snapshot` oraz identyfikatorze PWA. Kopie wersji 8 i starsze są rozpoznawane; ponowny eksport JSON zachowa nowe pola finansowe.
- **Kopia kodu przed zmianami:** `backup-manu-v2-7-1-before-finance`.

### Scenariusz sprawdzenia na Samsungu
1. Otwórz Ustawienia → Pobierz kopię JSON i zachowaj ją poza telefonem.
2. Na próbnym zleceniu użyj „Dodaj wpłatę” i wpisz zaliczkę, a następnie dopłatę. Upewnij się, że kwoty sumują się z wcześniejszymi, bez duplikacji.
3. W warsztacie otwórz uczestnika i zapisz nową wpłatę. Sprawdź „Wpłacono” i „Do dopłaty”.
4. Dodaj testowy wydatek z datą. Dla projektu z planowanym dojazdem sprawdź kategorię „Dojazd faktyczny” i zweryfikuj, czy szacowany koszt przestał być doliczany.
5. W Finanse wybierz miesiąc, do którego wpisałeś transakcje. Zobacz daty, otrzymane kwoty, wydatki i różnicę.
6. Wyeksportuj ponownie JSON i wybierz „Sprawdź plik kopii”. Nie kasuj ani nie odinstalowuj aplikacji w celu testowania nowej wersji.

## MANU 2.7.1 — Poprawka płynności przewijania
- Odhaczenie etapu w otwartym projekcie lub warsztacie nie przesuwa już karty na samą górę. Przy ponownym wygenerowaniu szczegółów zapamiętywana jest i przywracana pozycja przewinięcia karty.
- Zachowywana jest także pozycja strony w tle; dotyczy to również zmian wykonywanych na listach zadań.
- Aktualizacja otwartej karty nie uruchamia ponownie animacji przewracania strony. Fokus klawiatury pozostaje na tym samym kontrolnym przycisku, jeśli nadal jest dostępny.
- Zmiana wyłącznie interfejsowa: brak migracji bazy, brak resetowania sesji stopera, historii i danych. Zachowano dotychczasową strukturę kopii JSON `version:8`.
- Kopia kodu sprzed poprawki: `backup-manu-v2-7-before-scrollfix`.

## MANU 2.7 — Etap 2: przebieg realizacji i ewidencja czasu
- **Postęp etapów:** każdy nowy projekt i warsztat ma pięć sugerowanych etapów. Starsze projekty otrzymują etapy bez usuwania dotychczasowych kosztów, godzin ani uczestników. Można je odhaczać, cofać, usuwać i dopisywać własne (do 40). Procent ukończenia wynika wyłącznie z odhaczonych etapów i jest widoczny w projekcie oraz na jego karcie na liście.
- **Stoper Start / Pauza / Wznów / Stop i zapisz:** w szczegółach realizacji, z naliczaniem w sekundach. Start i pauza są zapisywane w pamięci lokalnej. Zegar bazuje na lokalnym czasie urządzenia, więc po zamknięciu i ponownym otwarciu MANU nadal widzi rozpoczętą sesję i oblicza upływ czasu. Działa bez internetu. Liczenie zakłada poprawną datę i godzinę telefonu; limit jednej sesji to 24 godziny, by ograniczyć skutki zapomnianego stopera.
- **Tylko jeden aktywny stoper:** jeśli stoper pracuje nad jednym projektem, nie można uruchomić jednocześnie drugiego. Zatrzymanie dopisuje czas do dotychczasowej liczby godzin projektu oraz tworzy wpis w historii.
- **Ręczne dopisanie czasu:** data, liczba minut, krótki opis. Pozwala dodać pracę wykonaną bez stopera. Można także dopisać lub poprawić opis zakończonej sesji i usunąć błędny wpis, odejmując jego czas z projektu.
- **Plan vs rzeczywistość:** zestawienie planowanych godzin, wszystkich dotąd zarejestrowanych godzin i brakującego/przekroczonego czasu. Plan można wpisywać dla zleceń i warsztatów, a łączny czas jest wyświetlany z dokładnością do setnych godziny. Stare ręcznie zapisane godziny pozostają w sumie, bez dodawania ich drugi raz.
- **Historia pracy:** lista sesji, ręcznych wpisów czasu i zmian etapów. Źródłowe wpisy czasu i wydarzenia są przechowywane w danych i w eksporcie JSON. Pozycje historyczne starsze niż limity techniczne mogą zostać usunięte z dziennika, dlatego warto regularnie wykonywać kopie.
- **Powielanie:** kopia realizacji zachowuje etapy jako niewykonane, zeruje przepracowany czas, historię i stoper; nie kopiuje już przeprowadzonych sesji.
- **Schemat:** `version:8` przy zachowaniu tej samej bazy danych `pracownia_db_v1` i klucza `snapshot`. Import obsługuje wcześniejsze kopie do wersji 7 oraz nowe kopie wersji 8.
- **Poprzednia wersja kodu:** `backup-manu-v2-6-before-workflow`.

### Jak przetestować na telefonie
1. Wykonaj kopię JSON z Ustawień przed próbami na własnych wpisach.
2. Otwórz testowe zlecenie i odhacz pierwszy etap — zobacz 20% postępu. Dodaj własny etap i sprawdź zmianę procentów.
3. Uruchom **Start**, po kilku minutach kliknij **Pauza**. Zamknij MANU i otwórz ponownie; sesja powinna być zachowana. Wybierz **Wznów**, a potem **Stop i zapisz**.
4. Sprawdź, czy godziny, historia oraz orientacyjna stawka za godzinę zmieniły się zgodnie z zakończoną sesją.
5. Użyj **Dopisz czas ręcznie** z opisem; edytuj opis wpisu, a następnie sprawdź, czy możesz skasować próbny wpis i cofnąć naliczone minuty.
6. Wykonaj nowy eksport JSON i sprawdź kopię w Ustawieniach. Nie odinstalowuj MANU i nie czyść pamięci przeglądarki.

## MANU 2.6 — Etap 1: bezpieczeństwo zapisów i kopii
- **Bez zmiany struktury danych:** baza \`pracownia_db_v1\`, klucz \`snapshot\`, wersja schematu 7 i identyfikator instalacji PWA pozostają bez zmian.
- **Szeregowanie zapisów:** każda zmiana tworzy osobny obraz danych, a zapisy wykonują się kolejno, co ogranicza ryzyko, że starsza operacja nadpisze nowszą. Widoczny status zapisu w Ustawieniach.
- **Lokalny punkt przywracania:** przed kolejnym zapisem MANU zapamiętuje poprzedni stan w tej samej bazie IndexedDB, atomowo z nowym zapisem. Przy awarii IndexedDB używa localStorage jako awaryjnego magazynu. Punkt przechowuje tylko jeden poprzedni stan i **nie jest kopią zapasową poza telefonem**.
- **Błędy odczytu i zapisu:** jeśli baza wygląda na uszkodzoną, zapis jest blokowany, aby nie nadpisać istniejących danych pustym stanem. Przy błędzie zapisu aplikacja informuje użytkownika, żeby zachował aktualne dane przez eksport JSON. Nie zamykaj aplikacji, jeśli masz niezapisane wpisy.
- **Bezpieczny import:** przed importem dane są parsowane i walidowane, w tym wersja pliku i podstawowa struktura zleceń, uczestników i zadań. Ekran porównuje liczbę wpisów w obecnej bazie i we wskazanym pliku; dopiero osobne potwierdzenie pozwala zastąpić dane. Najpierw wykonywany jest trwały zapis, dopiero po powodzeniu podmieniany jest stan w pamięci. Nadal zalecany jest ręczny eksport danych sprzed przywracania.
- **Sprawdź kopię:** opcja pozwala sprawdzić plik JSON bez zmiany żadnych wpisów. Weryfikuje poprawność formatu i liczby rekordów, ale nie gwarantuje, że wszystkie dane są kompletne.
- **Ochrona pamięci:** przycisk prosi przeglądarkę o trwalsze przechowywanie danych, jeśli jest obsługiwane; nie gwarantuje ochrony przed usunięciem aplikacji czy utratą telefonu.
- **Offline:** ustawienia pokazują stan połączenia; zapis pozostaje lokalny także przy dostępnym internecie. PWA ma cache zasobów umożliwiający podstawowe działanie offline po wcześniejszym uruchomieniu.
- **Bezpieczeństwo danych rzeczywistych:** aplikacja nadal nie ma kont, szyfrowania na poziomie aplikacji, serwera, synchronizacji ani automatycznych kopii w chmurze. Nie używaj jej jeszcze do przechowywania wrażliwych danych klientów i uczestników.
- **Kopia poprzedniego kodu:** \`backup-manu-v2-5-before-safety\`.

### Scenariusz ręcznego testu na telefonie
1. Utwórz próbne zlecenie i warsztat oraz 2 zadania. Zobacz w Ustawieniach status zapisu.
2. Wybierz **Pobierz kopię JSON**, następnie **Sprawdź plik kopii** i wskaż pobrany plik. Porównaj liczbę wpisów.
3. Dodaj kolejne próbne zadanie, wybierz **Przywróć poprzedni zapis** i oceń podgląd. Przywracanie zastąpi ostatni zapis — świadomie potwierdź je tylko na danych testowych.
4. Otwórz MANU raz z internetem, następnie spróbuj uruchomić i edytować dane w trybie samolotowym. Po ponownym uruchomieniu wpisy powinny nadal być obecne.
5. Trzymaj eksport JSON także poza telefonem. Nie czyść danych przeglądarki ani nie odinstalowuj aplikacji, dopóki nie sprawdzisz kopii.

## MANU 2.5 — finalista logo nr 48 i większy notes podczas startu
- **Monogram:** wybrana gotycka, symetryczna litera M z wariantu 48 zastąpiła stary znak w nagłówku, na pulpicie i w animacji otwarcia. Dostępne są źródłowe pliki `manu48-mark.svg` oraz `manu48-icon.svg`; starsze aliasy również zawierają nowy znak.
- **Ikona Androida/PWA:** nowe pliki `manu48-192-v5.png`, `manu48-512-v5.png` i osobny wariant `manu48-maskable-512-v5.png`. Manifest odwołuje się do nowych ścieżek, a nazwa instalacyjna to **MANU**. Zachowano niezmienione `id`, `scope` i `start_url`, żeby nie tworzyć drugiej aplikacji.
- **Duży notes podczas otwierania:** na ekranach pionowych zwiększono skalę okładki z dawnego limitu 242×314 px do szerokości do 87% ekranu i wysokości do 72% ekranu, proporcjonalnie, z bezpiecznym dopasowaniem do mniejszych telefonów i trybu poziomego. Powiększono również monogram i elementy tytułowe.
- **Bezpieczna aktualizacja:** cache service workera ma wersję `manu-app-v2.5.0`, starsze cache aplikacji są czyszczone, a wcześniejsza baza danych IndexedDB pozostaje bez zmian. Zainstalowana ikona i nazwa mogą być aktualizowane przez Android/Chrome później lub wymagać zgody; nie usuwaj aplikacji ani pamięci bez wcześniejszego eksportu JSON.
- **Kopia kodu sprzed zmian:** gałąź `backup-manu-v2-4-pre-logo48`.

## MANU 2.4 — kolejna kartka: szczegóły realizacji
- Po otwarciu projektu lub warsztatu szczegóły pojawiają się na **jasnej kartce** (zamiast ciemnego okna), ze skórzanym grzbietem i brzegami kartek **po prawej stronie**.
- Krótka animacja nawiązuje do przewrócenia strony. Osoby z systemowym ograniczeniem ruchu nie otrzymają animacji.
- Edycja, dodawanie uczestników, kosztów i zadań pozostają osobnymi papierowymi formularzami z grzbietem po lewej.
- Kwoty, zaliczki, plan pracy, koszty dojazdu, przyciski edycji, powielania i usuwania nie zmieniły logiki.
- Poprzedni stan MANU jest zachowany w gałęzi `backup-manu-v2-3-before-detail-pages`.

## MANU 2.3 — wrażenie przekładania stron
- **Projekty:** skórzany grzbiet i przeszycia po lewej stronie papierowej kartki.
- **Finanse:** skórzany grzbiet, przeszycia i warstwy papieru przeniesione na prawą stronę; zawartość i kierunek czytania pozostają bez zmian.
- **Zadania:** ponownie lewy grzbiet — kolejna kartka notesu.
- **Nawigacja:** subtelna, kierunkowa animacja przejścia przy zmianie głównych zakładek (około 270–340 ms), niewywoływana podczas zmian filtrów. Uszanowano systemowe ustawienie ograniczenia animacji.
- **Dane i funkcje:** bez zmian w schemacie projektów i finansów, bez resetowania lokalnej bazy.
- **Poprzedni wygląd:** zachowany w gałęzi `backup-manu-v2-2-pre-page-turn`.

## MANU 2.2 — otwarte strony i odświeżony branding Androida
- **Projekty, Finanse i Zadania** wyświetlają się teraz na osobnych jasnych stronach z widocznym skórzanym grzbietem, obszyciem i brzegiem kartek. Wewnętrzne listy, kafelki i formularze używają ciemnego tekstu na papierze; nawigacja pozostaje czarna.
- **Pulpit** pozostaje zamkniętą skórzaną okładką z miedzianą klamrą, która otwiera nowe zlecenie.
- **Ikona MANU na Androidzie:** nowe wersjonowane zasoby `manu-app-192-v3.png`, `manu-app-512-v3.png`, `manu-maskable-512-v3.png`. Manifest używa jako nazwy zarówno krótkiej, jak i pełnej **MANU**, a identyfikator i adres startowy pozostały niezmienione.
- **Ważne dla zainstalowanej aplikacji:** Chrome/Android może odświeżać etykietę i ikonę osobno od treści aplikacji, a przy istotnej zmianie prosić o akceptację. Nie odinstalowuj bez wcześniejszego eksportu i sprawdzenia kopii danych JSON. Nie usuwaj pamięci przeglądarki.
- **Powrót do poprzedniego wyglądu:** gałąź `backup-manu-v2-1-1-before-paper-pages` zawiera MANU 2.1.1 sprzed tych zmian.

## MANU 2.1 — czarny skórzany notes i jasne kartki
- **Pulpit jak zamknięta okładka:** ciemna faktura skóry, dekoracyjne miedziane obszycie, klasyczny monogram M i pasek z miedzianym guzikiem. Kliknięcie guzika otwiera nowy projekt / warsztat.
- **Formularze jak otwarty notes:** wpisywanie projektów, warsztatów, uczestników, kosztów i zadań odbywa się na jasnych papierowych kartkach, z wizualnym skórzanym grzbietem i brzegami papieru z lewej strony. Krótka animacja odsłonięcia strony działa z poszanowaniem ustawień ograniczenia ruchu.
- **Czarny i miedź:** zastąpiono dominujące brązy w interfejsie czernią i grafitem. Metaliczne akcenty są miedziane. Wymieniono także ikony PNG i dopasowano systemowy kolor PWA.
- **Dane bez zmian:** używana jest dotychczasowa lokalna baza danych i wcześniejsze formaty pól, aby rebranding nie wyczyścił projektów. Kopia stanu przed wdrożeniem: `backup-manu-v2-0-pre-notebook-ui`.

## Identyfikacja MANU
- **Nazwa robocza:** MANU. Jej dostępność jako marki, domeny i znaku towarowego nie została jeszcze zweryfikowana.
- **Wygląd:** ciemna skóra espresso, miedź, klasyczny monogram **M**, eleganckie liternictwo i funkcjonalny interfejs.
- **PWA:** nowe ikony monogramu w PNG (192 i 512 px) oraz wektorowe SVG, nowa nazwa i kolory aplikacji w manifeście.
- **Ekran startowy:** krótka, lekka animacja otwierania notesu z logo i hasłem „Organizer twórcy”. Animację można pominąć oraz wyłączyć w Ustawieniach; respektuje systemowe ustawienia ograniczenia ruchu.
- **Zgodność danych:** techniczna baza `pracownia_db_v1` i klucz `snapshot` pozostały niezmienione; starsze projekty, koszty, uczestnicy i kopie JSON nadal działają. Do przywrócenia poprzedniego kodu służy gałąź `backup-pracownia-v1-5-pre-manu`.

## Co działa
- Projekty i warsztaty: tworzenie, edycja, powielanie, usuwanie, statusy i terminy.
- **Formularze zależne od typu**: realizacja ma miejsce wykonania (własna pracownia lub zewnętrzny adres, np. mural), liczbę sztuk, planowany i rzeczywisty czas pracy oraz szacowane materiały; warsztat ma osobne miejsce, godzinę startu, czas zajęć, liczbę miejsc, domyślną cenę i czas przygotowania.
- W szczegółach projektu widoczne są plan i porównanie z dotychczasową realizacją; planowane koszty materiałów są oddzielone od kosztów faktycznie wprowadzonych.
- **Miejsce i dojazd w zwijanym kafelku:** użytkownik otwiera sekcję tylko wtedy, gdy jej potrzebuje. Wybiera **Bez dojazdu**, **Własne auto** lub **Transport płatny**. Dla auta koszt jest liczony z łącznego dystansu, spalania i ceny paliwa, z opcjonalną metodą zł/km. Dla transportu płatnego wpisuje łączną cenę przejazdu (np. taksówki lub pociągu) i ewentualne dodatkowe opłaty. „Bez dojazdu” nalicza 0 zł. Wcześniejsze zlecenia z kosztami dojazdu domyślnie zachowują tryb auta oraz dotychczasowe wyliczenia. Wszystkie kwoty są szacunkowe i użytkownik wpisuje je samodzielnie. Przycisk nawigacji do wpisanego adresu pozostaje dostępny w szczegółach realizacji. **Dojazdu nie dopisuj ponownie ręcznie**, bo jest ujęty w kosztach projektu.
- Lista kosztów realizacji, przychód, wpłaty, należności i szacunkowy wynik po kosztach.
- Orientacyjna kwota za godzinę na podstawie czasu wpisanego przez użytkownika.
- Uczestnicy warsztatów: cena udziału, kwota otrzymanej zaliczki/wpłaty, automatyczne obliczanie dopłaty oraz edycja rozliczenia.
- Sumy należności i wpłat dla całego warsztatu. Nowe warsztaty z wartościami 0 liczą finanse z uczestników; stare pozostają w trybie ręcznym do świadomego przełączenia.
- Zadania z terminami oraz powiązanie z projektami.
- Mobilny pulpit, finanse, archiwum realizacji, filtr i wyszukiwarka.
- Zapis lokalny w IndexedDB (rezerwowo localStorage), eksport i import kopii JSON.
- PWA: manifest, ikony 192/512 oraz service worker umożliwiający podstawową pracę offline po pierwszym uruchomieniu przez HTTPS.

## Uruchomienie
Kod stanowi statyczną aplikację HTML/CSS/JS. Aby uruchomić ją w telefonie, opublikuj zawartość **katalogu głównego** na hostingu HTTPS (np. Vercel/Netlify); nie ma polecenia budowania. `index.html` musi znajdować się w folderze publikacji obok plików `app.js`, `styles.css`, `manifest.webmanifest`, `service-worker.js`, `manu-mark.svg`, `manu-icon.svg` oraz ikon PNG.

Przy prywatnym repozytorium na GitHub Free, GitHub Pages nie publikuje tej strony. Możesz połączyć repozytorium z hostingiem obsługującym prywatne repozytoria, zachowując kod źródłowy na GitHubie jako prywatny.

Po publikacji otwórz adres w Chrome na Androidzie, menu **⋮ → Zainstaluj aplikację** (lub **Dodaj do ekranu głównego**, zależnie od urządzenia).

## Dane i bezpieczeństwo
**Obecna wersja nie ma kont, serwera, synchronizacji między telefonami ani automatycznych backupów.** Każde urządzenie ma swoją osobną pamięć aplikacji. Utrata telefonu lub wyczyszczenie danych przeglądarki może oznaczać utratę wpisów.

W ustawieniach pobieraj regularnie kopię danych JSON. Import zastępuje dotychczasowe dane. **Na tym etapie używaj wyłącznie informacji fikcyjnych/testowych; nie wpisuj prawdziwych danych osobowych klientów i uczestników.** Przed testami na danych rzeczywistych trzeba wdrożyć odpowiednie zabezpieczenia i zasady zgodne z RODO.

Obliczany wynik to **wartość projektów minus wpisane koszty bezpośrednie**, a nie zysk księgowy ani wynagrodzenie netto; nie uwzględnia podatków, ZUS, kosztów stałych i innych nieujętych wydatków. W warsztatach z automatycznym rozliczaniem suma wartości i otrzymanych wpłat wynika z listy uczestników i nie jest podwójnie doliczana. Starsze warsztaty zachowują dotychczasowe sumy ręczne; wcześniejsze oznaczenie „wpłata” bez podanej kwoty zostanie zachowane jako ostrzeżenie do uzupełnienia, a nie wymyślona płatność.

## Następne etapy
1. Testy etapu 1 na prawdziwym Androidzie oraz ewentualne poprawki UX.
2. Konta użytkowników, bezpieczna synchronizacja, kopie zapasowe i oddzielenie danych użytkowników.
3. Raporty opłacalności, zdjęcia realizacji, wyceny PDF, dodatkowe szablony branżowe.
4. Funkcje AI oraz panel udostępniany klientom po osobnych testach bezpieczeństwa.

To jest prywatny prototyp, nie gotowy produkt komercyjny.
