# MANU — Organizer twórcy

**Wersja 3.29.2 (beta testowa)** · Polska aplikacja instalowana jako PWA, przygotowana dla artystów, organizatorów warsztatów i małych pracowni rzemieślniczych.

## MANU — etap 18.6: pierwsze testy na innych urządzeniach

Przygotowano [plan zaproszeń, scenariusze Android/iOS oraz formularz wyników](ETAP-18-6-TESTY-ZEWNETRZNE.md) dla dwóch niezależnych osób. **Status: oczekuje na wysłanie zaproszeń i rzeczywiste wyniki testów.** Sama dokumentacja nie oznacza, że MANU zostało przetestowane na iOS lub cudzym telefonie. Funkcje aplikacji nadal w wersji **3.29.2** — bez migracji danych.

## MANU 3.29.2 — Etap 18.5: zasady prywatności i bezpieczne testy beta

**Cel:** przygotować pierwszych zewnętrznych testerów do korzystania z MANU bez gromadzenia prawdziwych danych. Nie powtarzać już zaliczonych testów zapisu i nawigacji na urządzeniu właściciela.

- **Nowa rozwijana sekcja:** `Ustawienia → Testowanie aplikacji → Dane i prywatność w wersji beta`. Dostępna także w ekranie DEMO; domyślnie zwinięta, aby nie zaśmiecać interfejsu.
- **Treść:** lokalne przechowywanie danych, opcjonalna chmura Supabase, tymczasowy charakter DEMO, ograniczenia kopii JSON i PDF, bezpieczne zgłaszanie opinii i anonimizacja zrzutów. Jasne zastrzeżenie, że jest to informacja dla testerów, **nie kompletna polityka prywatności**.
- **Zaproszenie:** zawiera wskazanie nowej sekcji, nadal prosi o test bez konta i bez prawdziwych danych. Formularz opinii dodaje ostrzeżenie o udostępnianiu tylko wybranych informacji.
- **Bez zmian danych i logiki aplikacji:** żadnej migracji, odczytu rekordów testera, nowych uprawnień, żądań sieciowych ani nowych działań destrukcyjnych. Kontrola techniczna 3.29.1 pozostaje bez zmian.
- **Aktualizacja PWA:** wydanie 3.29.2, osiem podstawowych plików offline. Obsługa iOS nadal czeka na rzeczywisty test fizycznego urządzenia Apple.
- **Do zrobienia przed publicznym użyciem z danymi rzeczywistymi:** weryfikacja bezpieczeństwa kont i RLS Supabase na dwóch kontach, kompletna dokumentacja prywatności, decyzja o operatorze usługi i kontaktach oraz testy drugiego urządzenia.

**Potwierdzenie dotychczasowych prac:** na Samsungu właściciela zgłoszono działające uruchomienie i nawigację offline (etap 18.3). Testy trwałości danych były już wykonywane we wcześniejszych etapach i nie są powtarzane tylko z powodu zmiany tekstów w UI. Nie jest to dowód gotowości na innych urządzeniach.

**Punkt wyjścia:** `41b3b991` (MANU 3.29.1). Brak migracji danych.

## MANU 3.29.1 — Etap 18.2: diagnostyka zgodności i niezawodności PWA

**Cel:** bezpieczna weryfikacja obsługiwanych funkcji na Androidzie, iOS i iPadOS bez zapisów i bez ryzyka ingerencji w projekty.

- **Nowa opcja:** `Ustawienia → Testowanie aplikacji → Kontrola zgodności urządzenia → Sprawdź urządzenie`. Jest domyślnie zwinięta, by nie zaśmiecać ekranu.
- **Kontrola odczytowa:** sposób uruchomienia (przeglądarka/PWA), obecność 8 plików offline, dostępność IndexedDB, informacja o ochronie pamięci, funkcja drukowania i wskazanie przeglądarki o połączeniu. Nie czyta rekordów, nie tworzy cache ani nie żąda nowych uprawnień.
- **Uczciwe wyniki:** obecność API drukowania nie potwierdza zapisu PDF; 8/8 plików w cache nie potwierdza ponownego uruchomienia bez internetu. Test sprzętowy na iOS nadal potrzebny.
- **Aktualizacja:** numer 3.29.1 i spójne zasoby PWA. Brak migracji danych `version:18` i brak zmian w logice synchronizacji lub finansów.
- **Testy regresyjne:** przypadki iOS bez API, iPhone z PWA i pełnym cache, oczekująca aktualizacja, brak cache bez zapisu oraz widoczność w Ustawieniach.

**Weryfikacja na telefonie:** uruchom aplikację w wersji 3.29.1, rozwiń `Kontrola zgodności urządzenia` i naciśnij `Sprawdź urządzenie`. Pamięć i pliki offline pozostają bez zmian. Dla rzeczywistej weryfikacji trybu samolotowego użyj osobnego `Sprawdź gotowość offline` i wykonaj restart offline w bezpiecznym teście.

**Punkt wyjścia kodu:** `3fce53df` (3.29.0). Zgodność iOS niepotwierdzona na fizycznym urządzeniu.

## MANU 3.29.0 — Etap 18.1: przygotowanie testu iOS / iPadOS

**Cel:** umożliwić testy MANU na iPhonie i iPadzie bez zmiany formatu danych, synchronizacji ani działania projektów. To przygotowanie do testów, **nie potwierdzenie działania na prawdziwym iPhonie**.

- **Instalacja:** w ustawieniach PWA telefon Apple otrzymuje wskazówkę Safari → Udostępnij → Dodaj do ekranu początkowego. Android zachowuje instrukcję Chrome. Identyfikacja systemu służy tylko do pokazania właściwej instrukcji.
- **Bezpieczeństwo pamięci:** informacja o możliwym odrębnym przechowywaniu danych przez Safari i aplikację uruchomioną z ikony. Testujemy w DEMO na danych fikcyjnych, nie przenosimy realnych danych przez samą instalację.
- **Wspólny scenariusz testera:** instalacja, gotowość offline 8/8, wyceny, PDF, zamykanie i powrót mają wskazówki dla Androida i iOS; nie wymagamy systemowego przycisku Wstecz na iPhone.
- **Zaproszenie i opinia:** oba teksty obsługują Android/iOS/iPadOS, zawierają pytanie o wersję systemu, uruchomienie z ikony, podgląd/zapis PDF i nawigację.
- **Aktualizacja PWA:** wydanie 3.29.0 aktualizuje odnośniki do zasobów i osiem podstawowych plików offline. Baza version:18, projekty, kopie i moduł Supabase bez zmian.
- **Do testu na fizycznym urządzeniu Apple:** dodanie do ekranu, tryb standalone, wcięcie i bezpieczne obszary ekranu, klawiatura, PDF, restart, pamięć, aktualizacja i cofanie. Brak potwierdzenia testu sprzętowego.

**Backup kodu:** wersja bazowa commit `bd3f6acc` (MANU 3.28.5). Brak migracji danych.
## MANU 3.28.5 — Etap 17.5: przygotowanie dla pierwszych zewnętrznych testerów

**Cel:** bezpieczny, samodzielny test pierwszego uruchomienia i obsługi na urządzeniu testera. Bez nowych funkcji produkcyjnych i bez migracji danych.

- **Zaproszenie i przewodnik:** w `Ustawienia → Testowanie aplikacji → Plan pierwszego testu · 10 minut` uzupełniono kroki instalacji PWA na Android Chrome, kontroli wersji i 8/8 plików offline, wejścia w demo, pracy ze zleceniem i warsztatem, wyceny PDF, nawigacji oraz wyjścia z demo.
- **Raport testowy:** przycisk `Przygotuj opinię` zawiera teraz model i wersję Androida, informację przeglądarka/PWA, wersję aplikacji, wynik instalacji i 8/8, edycji projektu, warsztatu, PDF, przycisków Wstecz i zakończenia demo oraz kroki odtworzenia problemu. Formularz nie pobiera danych użytkownika i nie wysyła opinii bez jego działania.
- **Przyjazne zaproszenie:** `Udostępnij zaproszenie` kieruje do własnego urządzenia, linku GitHub Pages, bezpiecznego demo oraz sposobu przekazania informacji zwrotnej; bez żądania loginu.
- **Odseparowane usuwanie:** przycisk `Usuń wszystkie dane` usunięty z sąsiedztwa `Uruchom bezpieczny tryb demo`; jest wyłącznie w zwijanej `Ustawienia → Zabezpieczenia i kopie danych → Strefa usuwania danych` wraz z informacją o kopii JSON i skutkach synchronizacji. Poprzednie potwierdzenia akcji są zachowane. Nie używać go do kończenia demo.
- **Uwaga o zakresie:** demo pracuje w pamięci tymczasowej; celowo nie testuje trwałości danych po restarcie, odzyskiwania danych ani bezpieczeństwa synchronizacji kont. Tych obszarów nie wolno oznaczać jako zweryfikowane tylko dlatego, że demo działa. Testy rzeczywiste z użyciem wielu kont nadal są osobną pracą.

**Scenariusz pierwszego zaproszenia:** wysłać link jednej lub dwóm zaufanym osobom z własnymi urządzeniami Android; poprosić wyłącznie o sprawdzenie fikcyjnych danych w demo, zapisanie opinii i zgłoszenie błędów; nie przekazywać kont ani danych klientów.

**Do weryfikacji po publikacji:** fizyczne uruchomienie na nowym urządzeniu, poprawność przycisku zaproszenia i opinii, brak opcji destrukcyjnej obok demo, potwierdzenie powrotu z demo. Rzeczywiste testy PWA w 3.28.2 i podglądu A4 w 3.28.4 były wykonywane na urządzeniach użytkownika, ale nie zastępują tej kontroli po aktualizacji.

**Backup kodu:** `backup-manu-v3-28-4-before-beta-invite-17-5`. PWA: `manu-app-v3.28.5`. Dane bez migracji.

## MANU 3.28.4 — Etap 17.4: korekta szerokości ilości na wydruku PDF A4

**Powód:** test na Samsung Android w systemowym podglądzie A4 potwierdził, że ilość `0,33333333` była łamana pomiędzy wierszami w wąskiej kolumnie, mimo że suma wyceny 3 × 0,33 zł = 0,99 zł była poprawna. Zrzut użytkownika z dnia 05.11.2026.

- **Podgląd MANU:** zwiększono kolumnę „Ilość” do 105 px, zmniejszono szerokość opisu oraz zabroniono łamania liczby na kolejne linie.
- **Wydruk A4:** przywrócono kontrolowany układ kolumn (6% / 29% / 20% / 8% / 18% / 19%) i brak dzielenia cyfr w kolumnie „Ilość”; długie opisy mogą zawijać się w kolumnie opisu. Pozostałe kwoty i dane dokumentów nie są modyfikowane.
- **Dane:** nie ma migracji. Zmiana wyłącznie CSS, numeru wersji i pamięci PWA. Zapisane wyceny i projekty pozostają bez zmian.
- **Backup kodu:** `backup-manu-v3-28-3-before-pdf-quantity-nowrap-17-4`.
- **Weryfikacja na urządzeniu:** otwórz testową wycenę, sprawdź uruchomioną wersję 3.28.4 i ponownie otwórz „Drukuj / zapisz PDF”; każda ilość powinna pozostać w jednym wierszu. Kontrola fizycznego podglądu jest potrzebna, bo nie jest to test automatyczny.

## MANU 3.28.3 — Etap 17.4: ostatnie szlify i weryfikacja ofert PDF

**Zakres:** dopracowanie dokumentów i komunikatów bez nowych funkcji ani zmian schematu danych. Wydanie podlega testom na rzeczywistych telefonach.

- **Spójne kwoty w wycenach:** każda pozycja dokumentu jest liczona i pokazywana po zaokrągleniu do 1 grosza. Suma dokumentu stanowi sumę tych właśnie widocznych pozycji, zamiast osobnego zaokrąglenia wszystkich niezaokrąglonych ułamków. Usuwa to różnice o grosz w ofertach z wieloma pozycjami ułamkowymi.
- **Dokładniejsze ilości:** PDF pokazuje do 12 miejsc po przecinku, zamiast maksymalnie 3, dzięki czemu przy ilościach takich jak 0,333333 metra/godziny opis zgadza się z obliczeniami. Ceny jednostkowe i wartości pieniężne pozostają w PLN, do dwóch miejsc.
- **Czytelność na małym ekranie i przy wydruku A4:** uzupełniono zawijanie długich nazw, numerów dokumentów, danych klienta i kolumn ilości; podgląd mobilny ma lepiej kontrolowane przewijanie poziome. Układ drukowania nadal ukrywa pozostałą część aplikacji i powtarza nagłówek tabeli.
- **Bezpieczne usuwanie dokumentu:** kliknięcie „Usuń wycenę” czeka na potwierdzenie zapisu. W razie błędu wycena wraca na listę i użytkownik otrzymuje ostrzeżenie. Szybkie kolejne kliknięcia nie usuwają dodatkowych wycen podczas trwającej operacji.
- **Spójne komunikaty:** lista wycen wyjaśnia zapis lokalny i opcjonalną chmurę; Ustawienia nie sugerują już, że samo posiadanie konta oznacza brak konfiguracji.
- **Uwaga przy istniejących dokumentach:** dla zapisanych wycen z bardzo dokładnymi ilościami ułamkowymi wynik może teraz zmienić się o pojedyncze grosze, ponieważ liczy się sumę zaokrąglonych wierszy. Projekty, wpłaty i koszty realizacji nie są przeliczane. Przed wysłaniem istniejącej wyceny klientowi ponownie sprawdź wartości.

**Testy w kodzie (symulacja):** 11/11 kontroli struktury wycen/ofert (dwa style, rabaty, ułamki, 80 pozycji, warunki, zabezpieczenie HTML) oraz 4/4 testów usuwania wycen (sukces, błąd zapisu, podwójne kliknięcie, anulowanie). Nie zastępują kontroli wydruku na fizycznym Androidzie i w drukarce/PDF.

**Weryfikacja przez użytkownika (jeszcze do zrobienia):** na telefonie i tablecie otwórz istniejącą lub wyłącznie fikcyjną wycenę, sprawdź podgląd obu stylów, wybierz „Drukuj / zapisz PDF” i zapisz plik jako PDF. Upewnij się, że nazwy, kwoty i końcowe podsumowanie są czytelne, a na wydruku nie ma menu MANU. Sprawdź też dłuższą ofertę, jeśli to możliwe.

**Backup kodu:** `backup-manu-v3-28-2-before-final-polish-17-4`. PWA: `manu-app-v3.28.3`. Schemat danych bez zmian.

## MANU 3.28.2 — Etap 17.3: instalacja, praca offline i bezpieczne aktualizacje

**Cel:** ustabilizować PWA przed testami innych twórców. Zmiany nie wprowadzają nowych funkcji biznesowych, nie zmieniają schematu bazy `version:18` i nie kasują danych użytkowników.

### Zmiany
- **Spójna instalacja offline:** service worker pobiera 8 wymaganych plików z wyłączeniem pośredniego cache HTTP; przed instalacją sprawdza, czy wersja HTML odpowiada skryptowi aplikacji. Jeśli serwer zwraca starą stronę lub brak któregoś wymaganego pliku, instalacja nowej wersji zostaje odrzucona, częściowo pobrany cache jest usuwany, a stara aplikacja pozostaje.
- **Świadome przełączanie aktualizacji:** nowy service worker nie wywołuje automatycznego `skipWaiting()` podczas aktualizacji. Czeka, aż użytkownik zapisze pracę i wybierze `Ustawienia → Instalacja i aktualizacje → Wczytaj aktualną wersję`. Dopiero wówczas aktywuje się, informuje aplikację o zmianie kontrolera i pozwala bezpiecznie odświeżyć ekran. Pierwsza instalacja może przejąć kontrolę automatycznie.
- **Ochrona w trakcie zapisu:** aktualizacja nie zaczyna się przy otwartym formularzu, niezakończonym zapisie lokalnym, problemie pamięci, przywracaniu kopii ani aktywnej synchronizacji. Gdy kod aktywacji nie dostanie potwierdzenia, aplikacja nie przeładowuje się w ciemno.
- **Cache-first dla aktualnego wydania:** po instalacji nawigacja i wymagane zasoby są czytane z tego samego zestawu plików. Nie mieszamy starszego HTML z nowszymi skryptami. Użytkownik może pracować offline bez dostępu do serwera, ale konto i galeria Supabase wymagają internetu.
- **Izolacja katalogu:** service worker przechwytuje wyłącznie żądania w obrębie `/Pracownia-app/`, a nie pozostałe projekty na tym samym GitHub Pages ani serwery zewnętrzne.
- **Kontrola gotowości:** `Sprawdź gotowość offline` rozpoznaje aktualizację oczekującą i nie potwierdza jej jako aktywnej. Instrukcja aktualizacji dotyczy wyłącznie PWA — nie nadpisuje ani nie importuje bazy.
- **Aktualny loader:** rejestracja `service-worker.js` omija cache przeglądarki (`updateViaCache:'none'`). Wszystkie wersje HTML, JS, CSS i cache offline to `3.28.2`.

### Testy wykonane w symulacji
- **9/9** scenariuszy instalacji service workera i cache: pierwsza instalacja, nowe wydanie oczekujące, ręczna aktywacja, brak pliku krytycznego, stary HTML, nawigacja offline, skrypt offline, izolacja innych repozytoriów i zewnętrznych serwerów oraz czyszczenie starszego cache.
- **11/11** scenariuszy kontrolek aktualizacji: wykrywanie czekającej wersji, brak samoczynnego przeładowania, blokady przy formularzu, zapisie, błędzie pamięci i zajętej chmurze, działanie offline, anulowanie przez użytkownika i `updatefound`.
- Wyniki te pochodzą z symulacji JavaScript; **nie potwierdzają jeszcze** działania na prawdziwym drugim telefonie ani niezawodności konkretnej przeglądarki. Przed zaproszeniem testerów potrzebny jest niezależny test fizyczny.

### Test na telefonie z zainstalowanym MANU
1. **Nie odinstalowuj i nie czyść danych.** W Ustawieniach pobierz kopię JSON, sprawdź plik i zachowaj go poza urządzeniem.
2. Mając internet, otwórz **Ustawienia → Instalacja i aktualizacje → Sprawdź aktualizacje → Wczytaj aktualną wersję**. Sprawdź informację `MANU 3.28.2`. Podczas przejścia z wcześniejszego mechanizmu SW może być potrzebne całkowite zamknięcie wszystkich okien MANU i ponowne otwarcie. Nie trzeba instalować aplikacji od nowa.
3. Wejdź w **Ustawienia → Dostępność i praca offline → Sprawdź gotowość offline**. Powinno wyświetlić się `8/8` plików. Jeśli pokazuje oczekującą aktualizację, najpierw aktywuj ją.
4. Włącz **tryb samolotowy**, zamknij i ponownie uruchom MANU z ikony, następnie przejdź między Start, Projekty, Zadania i Ustawienia. Brak internetu nie może usuwać lokalnych wpisów. Do prób zmian używaj wyłącznie fikcyjnych danych w trybie DEMO.
5. Wyłącz tryb samolotowy. Nie wykonuj importu kopii ani nie czyść danych na tym telefonie.

### Test na DRUGIM urządzeniu (do potwierdzenia)
1. Na innym telefonie/profilu otwórz https://artystaakrobata.github.io/Pracownia-app/ w Chrome i zainstaluj przez menu przeglądarki. Używaj wyłącznie fikcyjnych danych.
2. Utwórz fikcyjny projekt, zadanie i koszt; zamknij całkowicie aplikację i otwórz ją ponownie. Sprawdź, czy dane przetrwały restart.
3. Sprawdź pracę bez internetu oraz ponowne uruchomienie offline.
4. Wyeksportuj kopię JSON, sprawdź ją, a następnie — **wyłącznie na testowym urządzeniu** — wykonaj odtworzenie i porównaj dane.
5. Sprawdź, czy aplikacja nie zamyka się przy systemowym Wstecz. Zgłoszone problemy opisz w istniejącym formularzu opinii.

**Ograniczenie:** nie przeprowadzono automatycznie testów na cudzym telefonie, na iOS ani rzeczywistej izolacji kont Supabase; pozostają oddzielnymi punktami gotowości.

**Backup kodu:** `backup-manu-v3-28-1-before-pwa-reliability-17-3`.

## MANU 3.28.1 — Etap 17.2: bezpieczeństwo danych i kontroli kopii

**Cel:** usunięcie ryzyk przed testami zewnętrznymi bez rozszerzania funkcji. Wdrożone poprawki nie usuwają projektów, nie zmieniają schematu bazy `version:18` i nie wykonują automatycznego importu na telefonach użytkowników.

### Poprawki
- **Walidacja przywracanych danych:** zarówno pliki JSON, jak i pobierane migawki chmury przechodzą weryfikację wersji i struktury. Dodano limity list zagnieżdżonych (etapy 40, sesje 2500, historia 200, materiały 150, wpłaty 3000, uczestnicy 5000, koszty 5000); nieprawidłowy plik zostaje odrzucony przed zastąpieniem lokalnej bazy. Nie obcinamy po cichu zbyt dużych list podczas przywracania.
- **Kontrolowane przywracanie:** operacja odmawia zastępowania bazy, gdy trwa synchronizacja z chmurą. W trakcie przywracania blokowane są równoległe nieautoryzowane zapisy i zastępowanie danych przez chmurę. Przy błędzie zapisu nie jest zmieniany stan obecnej bazy.
- **Ochrona przed niezamierzonym nadpisaniem chmury:** po udanym przywróceniu kopii JSON poprzednie powiązanie rewizji chmury jest unieważniane, a automatyczny upload wyłączany. Osoba korzystająca z aplikacji musi ręcznie wybrać i potwierdzić kierunek `Wyślij` albo `Pobierz`, po zachowaniu obu kopii.
- **Ostrzeżenie przy wylogowaniu:** lokalna baza nie jest przypisana do konta. Po wylogowaniu z Supabase pozostaje widoczna na danym urządzeniu. MANU pokazuje teraz jednoznaczny komunikat i ostrzega przed udostępnianiem telefonu osobom trzecim.
- **Skrypt RLS Supabase:** konfiguracja `supabase/manu_snapshots.sql` umożliwia ponowne wykonanie polityk (drop if exists / create policy) i zawiera zapytania kontrolne. Uruchomienie skryptów na rzeczywistym serwerze i testy kont **nie zostały przeprowadzone automatycznie**.

### Testy kontrolne
- Walidacja kopii: **17/17** testów akceptacji poprawnych/starszych plików i odrzucania uszkodzonych danych oraz przekroczonych limitów.
- Przywracanie i synchronizacja: **3/3** symulacje (sukces, błąd zapisu, aktywna chmura) z kontrolą zachowania poprzedniej bazy i unieważnienia auto-sync.
- Izolacja demonstracyjna: **3/3** symulacje (uruchomienie, edycja i zakończenie demo oraz pominięcie fizycznego zapisu danych DEMO).
- Kontrole statyczne kodu i SQL po publikacji: odrębnie, wyniki potwierdź przed przekazaniem testerom.

### Bezpieczny test na telefonie
1. **Ustawienia → Zabezpieczenia i kopie danych → Sprawdź**: kontrola lokalna powinna zakończyć się bez błędów. Nie zmienia ona danych.
2. Wybierz **Pobierz kopię JSON** i zachowaj ją poza telefonem. Następnie **Sprawdź plik kopii** i wskaż pobrany plik — to tylko podgląd i weryfikacja, bez przywracania.
3. **Ustawienia → Testowanie aplikacji → Tryb DEMO**: dodaj fikcyjne zadanie lub koszt, zakończ DEMO i upewnij się, że własne projekty wróciły bez zmian.
4. **Nie testuj jeszcze przywracania na swoim jedynym telefonie z realnymi danymi.** Pełny test odzyskiwania należy wykonać na osobnym urządzeniu testowym po przygotowaniu sprawdzonej kopii JSON.
5. Izolację kont Supabase sprawdź osobno na dwóch **fikcyjnych kontach** i różnych urządzeniach/profilach. Próba dostępu konta B do wierszy i zdjęć konta A powinna zostać odrzucona. SQL Editor wykonujący zapytania jako administrator nie sprawdza RLS.
6. Dopóki nie potwierdzimy odseparowania kont lokalnych, testy innych osób prowadź tylko na **fikcyjnych danych w trybie DEMO**.

**Backup kodu:** `backup-manu-v3-28-0-before-security-stage-17-2`. PWA: `manu-app-v3.28.1`.

## MANU 3.28.0 — Etap 17.1: audyt istniejących funkcji i stabilności

**Zakres:** przegląd kodu formularzy, historii przeglądarki Android, szablonów, zapisu lokalnego, obliczeń finansowych, kopii danych, demonstracji, wersjonowania PWA i powiązań między ekranami. Nie dodawano funkcji biznesowych ani nie migrowano bazy danych.

**Usunięte problemy:**
- **Podgląd zdjęcia + Escape:** zamknięcie przez Escape korzysta z tego samego cofnięcia historii co X. Sam wpis podglądu nie może teraz zużyć kolejnego kroku do karty projektu / galerii; nawet jeśli podgląd zamknięto wcześniej, ten wpis jest neutralizowany.
- **Przejścia między kartami szczegółów:** z karty projektu do karty klienta, między dwiema realizacjami lub do podglądu dokumentu można wrócić o jeden poziom, bez skoku do listy. Zwykłe odświeżenie tej samej karty projektu nie tworzy dodatkowego wpisu. Przy powrocie z edycji wyceny do podglądu zachowywany jest projekt nadrzędny.
- **Szablony:** tworzenie i edycja czekają na potwierdzenie trwałego zapisu. Przy nieudanym zapisie zmiany są cofane w RAM, a formularz zostaje otwarty. W przypadku nieudanego usunięcia szablon wraca na listę. Ponowne szybkie kliknięcie Zapisz podczas operacji nie tworzy duplikatu.
- **Komunikaty zapisu:** sukces zmian przeprowadzanych przez `afterDataChange()` pokazuje się dopiero po potwierdzeniu przez lokalną pamięć; przy błędzie działa już istniejąca blokada zapisu i ostrzeżenie.

**Wyniki sprawdzeń w symulowanym środowisku JavaScript:**
- 30/30 testów nawigacji widoków, formularzy, sekcji, X, gestu Androida i podglądu zdjęć.
- 3/3 dodatkowe testy ścieżek: projekt → wycena → edycja → wycena → projekt oraz lista wycen → dokument → edycja → powrót.
- 6/6 testów zapisu szablonów, w tym błędy utrwalania, usuwania, edytowania i wielokrotny submit.
- 12/12 testów finansów zleceń i warsztatów, dojazdu szacunkowego/faktycznego, należności, raportu miesięcznego i numeracji wycen.
- Wszystkie 109 znalezionych identyfikatorów `data-action` mają odpowiadającą obsługę w sprawdzonych skryptach. To kontrola statyczna, nie pełne testy wszystkich akcji w przeglądarce.

**Czego ten etap jeszcze nie potwierdza:** zachowania na różnych fizycznych telefonach, rzeczywistych transakcji z Supabase, instalacji offline po aktualizacji, skutecznego odzyskania bazy z pliku JSON ani ostatecznego wydruku PDF. To osobne kroki finalizacji 17.2–17.5. Testy symulacyjne nie zastępują tych prób.

**Test kontrolny na telefonie:**
1. Start → Projekty → karta z klientem → **Karta klienta** → systemowy Wstecz → ta sama karta projektu.
2. Projekt → Dodatkowe działania → **Przygotuj wycenę**, lub otwórz już zapisaną wycenę. Sprawdź edycję i cofanie do podglądu, a następnie do projektu lub listy.
3. Szablony → **Nowy szablon** → Zapisz; przycisk powinien odblokować się po zapisie. Sprawdź także Anuluj / X.
4. Galeria → podgląd zdjęcia → X lub Escape → systemowy Wstecz. Nie powinno być pustego kroku.
5. Zadania / Kalendarz → nowy wpis → X lub systemowy Wstecz → poprzednia kartka → Start.
6. Ustawienia → Instalacja i aktualizacje → Wczytaj aktualną wersję. Potwierdź wersję 3.28.0; nie czyść pamięci urządzenia.

**Wersjonowanie:** `APP_VERSION 3.28.0`, cache PWA `manu-app-v3.28.0`; bez zmian schematu `version:18`. Przed aktualizacją utworzono `backup-manu-v3-27-5-before-stage-17-1-audit`.

## MANU 3.27.5 — Uniwersalne podpowiedzi dla twórców różnych branż

- Zmieniono teksty przykładowe w formularzach: nowy projekt i warsztat, nowy wydatek, nowy etap, czas pracy i opis sesji, zadania, przypomnienia, wyceny/oferty, materiały warsztatu, galeria zdjęć, szablony. Są teraz zrozumiałe niezależnie od branży twórcy.
- Kluczowa podpowiedź **Nazwa projektu** jest zależna od wybranego typu: „Np. Projekt na zamówienie, realizacja” lub „Np. Warsztaty tematyczne”. Dotyczy zarówno otwarcia formularza, jak i przełączania Zlecenie ↔ Warsztat.
- Usunięto specjalistyczne przykłady związane z lustrami, grawerem, kaligrafią, muralami i stolarką z podpowiedzi i fikcyjnej bazy demonstracyjnej. Przykładowe projekty demo: „Projekt dla klienta (demo)” i „Warsztaty tematyczne (demo)”.
- Własne dane, istniejące nazwy projektów, kwoty, zapisane szablony i starsze kopie JSON pozostają bez zmian. Wbudowane nazwy **nowych, domyślnych etapów zlecenia** ujednolicono: Ustalenia i plan, Przygotowanie, Realizacja, Kontrola i poprawki, Przekazanie i rozliczenie.
- Bez zmian schematu danych `version:18`, zachowania formularzy i nawigacji. Zaktualizowano `app.js`, `templates.js`, `gallery.js` oraz wersje pobierania wszystkich tych plików i cache offline `manu-app-v3.27.5`. Kod zabezpieczono gałęzią `backup-manu-v3-27-4-before-neutral-examples`.

### Krótki test na telefonie
1. **Projekty → Dodaj projekt**: pole „Nazwa” ma podpowiedź „Np. Projekt na zamówienie, realizacja”; po zmianie rodzaju na Warsztat ma się pojawić „Np. Warsztaty tematyczne”, a po powrocie — podpowiedź zlecenia.
2. Z karty projektu sprawdź **Zadania projektu → Dodaj zadanie**, **Etapy i czas pracy → Dodaj etap** i **Finanse i koszty → Dodaj wydatek**: brak tekstów o grawerowaniu czy lustrach.
3. Na warsztacie sprawdź **Lista materiałów i przygotowań → Dodaj materiał**; podpowiedź uwzględnia materiały, sprzęt lub link do zajęć.
4. Otwórz **Wyceny → Nowa wycena**, **Galeria → Dodaj zdjęcie**, **Szablony → edytuj szablon** i oceń neutralność przykładów.
5. Wejdź w **Ustawienia → Testowanie aplikacji → Uruchom bezpieczny tryb demo**: przykładowe projekty i dokumenty nie odnoszą się do jednej branży.

## MANU 3.27.4 — Systemowy Wstecz z „Nowy klient” i innych formularzy

- Naprawiono błąd Androida zgłoszony na ścieżce **Start → Projekty → Klienci → Nowy klient → systemowy Wstecz → systemowy Wstecz**. Dotychczas samodzielny formularz nie miał własnego wpisu historii i pierwsze cofnięcie zużywało wpis kartki Klienci. W zainstalowanej PWA następny Wstecz mógł nieoczekiwanie zamknąć aplikację.
- **Każdy samodzielny modal** (bez nadrzędnego otwartego modalu) tworzy odtąd osobny wpis historii — również Nowy klient, Nowy projekt, Nowe zadanie, Nowe przypomnienie i Nowa wycena. Dotyczy także przycisku X: oba sposoby zamknięcia konsumują właściwy wpis, a nie cofają kartki pod spodem.
- Powrót do Startu zachowuje logiczną hierarchię: **Nowy klient → Klienci → Projekty → Start**, jeśli do Klientów weszliśmy z Projektów. Przy bezpośrednim przejściu Start → Klienci jest to **Nowy klient → Klienci → Start**.
- Po zapisaniu nowego/edytowanego klienta i dokumentu podgląd jest otwierany **po** zużyciu wpisu poprzedniego formularza, bez wyścigu z asynchronicznym `popstate`.
- Naprawiono dodatkowy błąd, w którym otwarcie karty klienta bez `projectId` mogło błędnie uruchamiać przywracanie pozycji przewinięcia i odczytać `top` z `null`.
- Testy regresji: **16/16** zaliczonych w symulowanej historii przeglądarki, w tym X, Android Wstecz, wielokrotne otwieranie klientów, zapis nowego klienta, podgląd zapisanej wyceny i podformularze wewnątrz projektu.
- Bez zmian schematu bazy `version:18`, projektów, klientów ani rozliczeń. PWA: `manu-app-v3.27.4`. Backup gałęzi kodu: `backup-manu-v3-27-3-before-root-modal-android-back`.

### Test na Androidzie
1. **Start → Projekty → Klienci → Nowy klient**. Systemowy Wstecz powinien wrócić do Klientów, kolejny do Projektów, kolejny do Startu — bez wyjścia z aplikacji.
2. Powtórz, zamykając formularz przez **X**, a potem cofając systemowo do Projektów i Startu.
3. Spróbuj też **Zadania → Nowe zadanie → Wstecz**, **Kalendarz → Nowe przypomnienie → Wstecz** oraz **Wyceny → Nowa wycena → Wstecz**.
4. Jeśli zapiszesz testowego klienta, jego karta powinna się otworzyć, a X / systemowy Wstecz wrócić do Klientów. Nie twórz w próbach prawdziwych danych.

## MANU 3.27.3 — Audyt cofania ze wszystkich sekcji

- Zweryfikowano siedem rozwijanych sekcji karty projektu: Etapy i czas pracy, Zadania projektu, Uczestnicy i wpłaty (warsztaty), Materiały i przygotowania, Finanse i koszty, Galeria i notatki oraz Dodatkowe działania. Po rozwinięciu sekcji systemowy Wstecz powinien wracać do tej samej karty projektu (zwijając sekcje), nie do listy; kolejny Wstecz wraca do listy.
- Zweryfikowano cofanie z formularzy: etap, czas pracy, opis, zadanie, materiał, koszt, wpłata, uczestnik, szablon, edycja projektu. X i fizyczny Wstecz wracają do rodzica z zachowanym przewinięciem i otwartymi sekcjami.
- **Naprawa galerii**: otwarcie podglądu zdjęcia tworzy osobny krok historii Androida. Fizyczny Wstecz lub X zamykają najpierw samo zdjęcie, pozostawiając otwartą kartę projektu i sekcję Galeria. Prawidłowe działanie obejmuje również podgląd z osobnej kartki Galeria.
- **Naprawa szablonów**: przycisk Anuluj w formularzu szablonu otwartym z projektu używa tego samego cofnięcia co X, zamiast bezwarunkowo zamknąć cały projekt. Po zapisie szablonu zachowuje się nawigacja do nadrzędnej karty.
- Testy regresji w symulowanej historii przeglądarki: **38/38** przypadków zaliczonych, w tym sekwencje X i systemowego Wstecz, wiele kolejnych otwarć formularzy, wielopoziomowe przejście projekt → klient → edycja oraz podgląd zdjęcia. Testy nie zastępują sprawdzenia fizycznego telefonu.
- Dane w IndexedDB i Supabase nie były zmieniane; nie podniesiono wersji schematu `version:18`. PWA: `manu-app-v3.27.3`; wymuszono nowy adres pobierania `gallery.js?v=3.27.3`, także do cache offline.
- Backup kodu przed audytem: `backup-manu-v3-27-2-before-full-navigation-audit`.

### Krótki test na Androidzie
1. **Projekty → Stół dębowy → Etapy i czas pracy**. Rozwiń sekcję; systemowy Wstecz powinien zwinąć ją bez wychodzenia z karty. Kolejne Wstecz wraca do rejestru.
2. Wejdź ponownie, rozwiń **Materiały i przygotowania**, wybierz **Dodaj pozycję** i naciśnij fizyczny Wstecz. Wróć dokładnie do rozwiniętej sekcji i przewinięcia. Powtórz z X.
3. Sprawdź **Zadania projektu → Dodaj zadanie**, **Finanse i koszty → Dodaj koszt**, a w warsztacie **Uczestnicy i wpłaty → Dodaj osobę**.
4. Jeżeli masz zdjęcia w galerii, otwórz podgląd i zamknij go fizycznym Wstecz, a potem powtórz przyciskiem X — karta projektu ma pozostać.
5. Sprawdź **Dodatkowe działania → Zapisz jako szablon → Anuluj**. Powrót powinien odsłonić wybraną kartę projektu, nie listę.

## MANU 3.27.2 — Android Wstecz w sekcjach i formularzach projektu

- Naprawiono zgłoszenie: **Projekty → wybrana realizacja → Etapy i czas pracy / Zadania projektu / Materiały i przygotowania / Finanse i koszty → systemowy Wstecz**. Pierwsze cofnięcie zwija otwarte sekcje, **nie zamyka karty projektu**. Drugie cofnięcie wraca do listy projektów.
- Otwarcie pierwszej rozwijanej sekcji tworzy wpis `manuProjectSection` w historii przeglądarki. Ręczne zamknięcie ostatniej sekcji usuwa ten poziom, dzięki czemu nie zostają martwe kroki cofania.
- Podformularze otwierane z karty projektu (etapy, czas pracy, zadania, materiały, koszty, wpłaty, uczestnicy) tworzą odrębny wpis `manuNestedModal`. Fizyczny Wstecz wraca najpierw do **rodzica** w tym samym miejscu przewinięcia, zachowując otwarte sekcje.
- X i kliknięcie tła używają tego samego cofnięcia historii: X na podformularzu wraca do projektu, X na karcie projektu przechodzi do listy bez niepotrzebnych wpisów. Zachowano dotychczasowe zachowanie podglądu i edycji wycen.
- Gdy formularz ma przycisk **Wróć** albo zapisuje zmianę w projekcie, karta jest odświeżana po zużyciu wpisu formularza. Przy zamykaniu projektu, duplikowaniu czy zapisie całości stare kroki są usuwane z historii.
- Testy symulacyjne logiki historii przeszły **5/5** scenariuszy obejmujących sekcje, formularze, X, przewijanie i powrót do listy. Test na rzeczywistym Androidzie nadal wymaga potwierdzenia.
- Bez zmian bazy `version:18`, nazw projektów, kwot, wpłat i chmury. Cache PWA `manu-app-v3.27.2`. Backup kodu: `backup-manu-v3-27-1-before-android-section-back`.

### Test na telefonie
1. Wejdź do **Projekty → Stół dębowy → Etapy i czas pracy**. Rozwiń sekcję i naciśnij systemowy **Wstecz** — powinna pozostać karta „Stół dębowy”, a sekcja powinna się zwinąć.
2. Naciśnij systemowy **Wstecz** ponownie — powinieneś wrócić do listy projektów. Jeszcze raz — do Startu.
3. Wejdź ponownie do projektu, rozwiń **Zadania projektu**, naciśnij **Dodaj zadanie**. Systemowy **Wstecz** powinien wrócić do otwartej sekcji tej samej karty, z zapamiętanym przewinięciem.
4. Sprawdź identyczny scenariusz przez **X**, następnie wykonaj test w sekcjach **Materiały i przygotowania** oraz **Finanse i koszty**.
5. Rozwiń sekcję, zamknij ją ręcznie i naciśnij Wstecz — projekt ma zamknąć się od razu, bez pustego kroku.

## MANU 3.27.1 — Naprawa powrotu X z podstron i formularzy
- Naprawiono zgłoszony problem: **Projekty → Stół dębowy → Materiały i przygotowania → Dodaj pozycję → X**. Zamiast zamknąć całą kartę i pokazać listę projektów, X odtwarza kartę „Stół dębowy” w **tym samym miejscu przewinięcia**, z zachowaną rozwiniętą sekcją.
- Wspólna obsługa X, kliknięcia w tło i Escape odtwarza poprzednie otwarte okno z zapamiętanego elementu DOM i pozycją przewinięcia. Działa też na formularzach etapów, czasu pracy, zadań, materiałów, kosztów, zaliczek, uczestników oraz otwieranych kartach klientów i funkcjach galerii, jeśli przejście odbyło się w oknach MANU.
- **Wielopoziomowy powrót**: np. karta projektu → karta klienta → edycja klienta → X → karta klienta → X → karta projektu.
- Powrót przyciskiem Wróć i powrót po zapisie nadal odtwarzają świeży widok projektu przez istniejący mechanizm `detailReturnScroll`; nie pozostawiają starej karty w pamięci powrotów.
- **Fizyczne Wstecz na Androidzie bez zmian**: zachowany jest mechanizm wpisów historii wprowadzony w 3.26.2. Nie wprowadzono dodatkowych wpisów historii i nie zmieniono zachowania gestu.
- Bez zmian danych `version:18`, kosztów, wpłat, kont, chmury, synchronizacji i trybu demo. Kopia kodu: `backup-manu-v3-27-0-before-modal-return-fix`. Cache PWA `manu-app-v3.27.1`.

### Kontrola na telefonie
1. **Projekty → Stół dębowy** (lub dowolny projekt) → rozwiń „Materiały i przygotowania”, przewiń niżej, wybierz **Dodaj pozycję**.
2. Naciśnij **X**. Powinna pojawić się ta sama karta projektu w tym samym miejscu, bez przewijania na górę.
3. Powtórz dla **Etapy i czas pracy → Dopisz czas**, **Zadania → Dodaj zadanie**, **Finanse i koszty → Dodaj koszt**, **Wpłaty → Dodaj wpłatę**, a w warsztacie także **Uczestnicy → Dodaj osobę**.
4. Sprawdź **X**, kliknięcie tła i fizyczne **Wstecz**. Ostatnie z nich ma zachować dotychczasowe działanie na telefonie.
5. Wybierz **Wróć** wewnątrz formularza i sprawdź, czy wracasz do właściwej sekcji. Dane istniejących projektów nie powinny się zmienić przy samym zamykaniu okien.

## MANU 3.27.0 — Etap 16.4: pierwsze testy zewnętrzne
- W **Ustawienia → Testowanie aplikacji** dodano zwijany **Plan pierwszego testu · 10 minut**, obejmujący zlecenie, warsztat, wycenę, cofanie i wyjście z demo. Ten sam plan jest dostępny wewnątrz demo.
- Przycisk **Udostępnij zaproszenie** otwiera systemowe udostępnianie telefonu (np. komunikator). Jeśli nie jest dostępne, kopiuje gotowy tekst z publicznym linkiem; przy niedostępnym schowku pokazuje tekst do ręcznego skopiowania.
- Przycisk **Przygotuj opinię** daje szablon zgłoszenia obejmujący wersję MANU, urządzenie, sześć obszarów testowych, opis problemu i sugestię. Nie podłącza serwera opinii ani nie wysyła żadnego zgłoszenia automatycznie.
- Tekst zaproszenia i wzór opinii są **statyczne**, nie odczytują ani nie wstawiają prawdziwych danych klientów, projektów czy uczestników. Tester korzysta z własnego telefonu i fikcyjnego trybu demo. Przed udostępnieniem zrzutów ekranu należy usunąć dane osobowe.
- Nie dodano pola do zapisu opinii, kont testerów ani nowych elementów na pulpicie. Lista jest schowana, by nie przeciążyć interfejsu.
- Bez zmian bazy `version:18`, zapisów, chmury, kwot, płatności, dokumentów i mechanizmu Android Wstecz. Cache PWA: `manu-app-v3.27.0`. Backup kodu: `backup-manu-v3-26-2-before-external-tests`.

### Test 16.4 na telefonie
1. Otwórz **Ustawienia → Testowanie aplikacji → Plan pierwszego testu**.
2. Dotknij **Udostępnij zaproszenie** — powinno otworzyć się menu udostępniania albo tekst powinien trafić do schowka.
3. Dotknij **Przygotuj opinię** — sprawdź, czy pojawia się tekst z wersją 3.27.0, polami do wypełnienia i bez Twoich danych.
4. Uruchom **bezpieczny tryb demo**. W demonstracyjnych Ustawieniach plan powinien nadal być dostępny.
5. Przeprowadź próbny scenariusz, zakończ demo i potwierdź, że Twoje rzeczywiste projekty i wyceny nie zostały zmienione.

## MANU 3.26.2 — Poprawka systemowego Wstecz z karty projektu
- Naprawiono konkretną różnicę odnotowaną na Androidzie: **X na karcie projektu → rejestr → Wstecz → Start** działało, ale **systemowy Wstecz na karcie → rejestr → Wstecz** zamykało zainstalowane MANU.
- Przy **pierwszym otwarciu karty projektu** tworzony jest osobny wpis `manuProjectModal` w historii przeglądarki. Pierwszy gest Androida zużywa wyłącznie ten wpis, zamyka kartę i pokazuje rejestr projektów. Dopiero drugi gest zużywa wpis kartki „Projekty” i wraca do „Start”.
- Po systemowym zamknięciu karty **nie dodajemy wpisu historii w obsłudze popstate**, ponieważ nie wszystkie wersje Androida respektują taki wpis przy następnym geście. Natomiast gdy karta jest zamknięta przez **X**, jej wpis zamieniamy w zwykły wpis MANU, zachowując działającą wcześniej ścieżkę „X → Wstecz”.
- Przeładowanie zawartości otwartej karty projektu nie tworzy kolejnych wpisów. Wersja nie zmienia danych, projektów, wycen, płatności, trybu demo ani chmury.
- Nowe testy odtwarzają obie ścieżki poprzez rzeczywistą funkcję okna `modal()` i symulator wpisów `history.pushState/replaceState/back`, w tym wielokrotne odświeżanie karty.
- PWA: `manu-app-v3.26.2`. Kopia bezpieczeństwa kodu: `backup-manu-v3-26-1-before-project-modal-back-fix`.

### Test poprawki na telefonie
1. **Start → Projekty → Test**.
2. **Systemowy Wstecz**: powinien zamknąć kartę „Test” i pokazać rejestr projektów.
3. **Systemowy Wstecz** ponownie: powinien pokazać ekran **Start**, nie pulpit Androida.
4. Powtórz, zamiast pierwszego gestu używając **X** na karcie „Test”: kolejny systemowy **Wstecz** również powinien pokazać **Start**.

## MANU 3.26.1 — Korekta cofania na Androidzie przy otwartym projekcie
- Przy ponownym uruchomieniu zainstalowanego MANU system mógł przywrócić stary znacznik `manuBackGuard`, mimo że nie było już poprawnego wpisu historii. Inicjalizacja za każdym razem tworzy teraz świeże `manuBackRoot` oraz `manuBackGuard`.
- Gdy zdarzenie `popstate` pochodzi z nieoczekiwanego wpisu historii, a MANU ma otwarty modal lub zapamiętaną wcześniejszą kartkę, aplikacja podejmuje próbę wewnętrznego cofnięcia i odtwarza strażnika zamiast pomijać zdarzenie.
- Usunięto wywołanie dodatkowego `history.back()` wewnątrz `popstate`, gdy MANU jest już na ekranie Start. Na Androidzie jeden gest nie może powodować dwóch kroków historii i przypadkowego zamknięcia PWA.
- Dodano symulowane testy powrotu: **Start → Projekty → szczegóły „Test” → Wstecz → lista projektów → Wstecz → Start**, odtworzenie starego wpisu oraz sprawdzenie, że pojedyncze Wstecz na Start nie wywołuje kolejnego cofnięcia.
- To tylko nawigacja; bez zmian schematu danych, projektów, wycen, kosztów, historii wpłat, trybu demo i synchronizacji. Wersja PWA `manu-app-v3.26.1`. Backup: `backup-manu-v3-26-0-before-android-back-fix`.

### Test z nagrania
1. Z ekranu **Start** otwórz **Projekty**.
2. Otwórz projekt, np. „Test”.
3. Naciśnij systemowy **Wstecz** — wróć do listy projektów.
4. Naciśnij **Wstecz** drugi raz — powinieneś znaleźć się na ekranie **Start**, a nie na pulpicie Androida.

## MANU 3.26.0 — Etap 16.3: izolowany tryb demonstracyjny dla testerów
- W **Ustawienia → Testowanie aplikacji** zamiast dotychczasowego przycisku „Wstaw dane demonstracyjne” znajduje się **Uruchom bezpieczny tryb demo**. Wcześniej MANU dodawało przykłady bezpośrednio do bieżących projektów — teraz tego nie robi.
- Po wejściu otwiera się **osobna, tymczasowa sesja w pamięci RAM** z wyłącznie fikcyjnymi danymi: zlecenie z kosztami i zaliczką, warsztat z uczestnikami, dwie karty klientów, zadanie i wycena.
- Na wszystkich kartach jest wyraźny pasek **TRYB DEMO** z akcją **Zakończ demo**. Można tworzyć, edytować i usuwać dane w ramach demo. Przycisk przywraca aktualny prawdziwy notes i poprzednią pozycję widoku.
- Zapis `save()` w demonstracji jest wyłącznie sukcesem dla pracy interfejsu i **nie wykonuje transakcji IndexedDB, nie aktualizuje localStorage ani nie powiadamia synchronizacji**. Wyjście z demo lub ponowne uruchomienie aplikacji porzuca dane fikcyjne.
- Wstrzymana jest automatyczna synchronizacja i moduł chmury; nie można rozpocząć demo w trakcie aktywnej operacji chmurowej. W demo blokowane są działania związane z wysyłką/pobieraniem chmury, galerią chmurową, eksportem i importem JSON, przywracaniem kopii, czyszczeniem prawdziwej bazy i zmianą ochrony pamięci.
- Prawdziwy szkic nowego projektu z telefonu jest chroniony przed odczytem i nadpisaniem z demo; pozostałe ustawienia oraz zapisy na urządzeniu nie są zmieniane. Demo ukrywa też rzeczywiste dane profilu w powitaniu i ma osobną stronę ustawień bez informacji o koncie.
- **Uwaga:** tryb demo nie jest osobnym kontem, systemem uprawnień ani mechanizmem zabezpieczającym przed dostępem osoby mającej odblokowany telefon. Do testów przez inne osoby najlepiej używać ich własnych telefonów, świeżej instalacji i fikcyjnych danych.
- Bez zmian schematu `version:18`, danych w chmurze, kosztów i dokumentów. Cache PWA `manu-app-v3.26.0`, `cloud.js?v=3.26.0`. Backup kodu: `backup-manu-v3-25-1-before-isolated-demo`.

### Test etapu 16.3 na telefonie
1. Otwórz **Ustawienia → Testowanie aplikacji → Uruchom bezpieczny tryb demo**.
2. Powinien pojawić się pasek **TRYB DEMO** i fikcyjne projekty, zadania, warsztat oraz wycena; Twoje rzeczywiste dane nie powinny być widoczne.
3. Zmień przykładowe zlecenie, dodaj fikcyjne zadanie albo powiel przykładową wycenę.
4. Naciśnij **Zakończ demo**. Potwierdź, że prawdziwe 9 projektów, 3 wyceny i 3 karty klientów nadal są na miejscu (według ostatniej kontroli na Twoim telefonie).
5. Pobierz zewnętrzną kopię JSON prawdziwych danych, jeśli jeszcze nie jest zachowana poza telefonem.

## MANU 3.25.1 — Etap 16.2: porównanie danych przed synchronizacją
- Moduł Supabase nadal korzysta z istniejącego konta i tego samego algorytmu wykrywania konfliktów wersji. Nie powstało drugie połączenie ani dodatkowa baza; **nie uruchomiono automatycznej wysyłki ani pobierania danych bez zgody**.
- Przed ręcznym poleceniem **Wyślij dane lokalne do chmury** lub **Pobierz dane z chmury** pojawia się dokładniejsze potwierdzenie z **porównaniem dwóch zbiorów**: liczba projektów, klientów, wycen, zadań i uczestników oraz data ostatniego zapisu. Komunikat uwzględnia rewizję zdalną i kierunek zastąpienia.
- Okno nie pokazuje nazw klientów, adresów e-mail, treści dokumentów, kwot ani uczestników — tylko liczniki i daty. Nic nie trafia na zewnętrzny serwer na potrzeby tego porównania; dane są odczytywane z aktualnej lokalnej bazy i wcześniej pobranej kopii własnego konta.
- Przed ręcznym **pobraniem** czekamy na zakończenie lokalnych zapisów, sprawdzamy wstrzymanie pamięci oraz stan aktywnych formularzy. Jeżeli pamięć jest zablokowana, operacja nie nastąpi.
- Komunikat podkreśla, że ręczne zastąpienie może usunąć zmiany znajdujące się tylko w jednej wersji; radzi wybrać „Anuluj” w razie wątpliwości i zachować **zewnętrzne kopie JSON obu wersji**.
- Samo sprawdzenie statusu chmury i konta nadal nie nadpisuje lokalnej bazy, a przesłanie z automatu jest zabezpieczone sprawdzeniem rewizji. Chmura działa tylko po skonfigurowaniu Supabase i zalogowaniu się.
- Testy sprawdzają porównanie z pięcioma licznikami, ręczne zastąpienie w obu kierunkach, pierwszą synchronizację oraz niewyświetlanie danych osobowych.
- Brak migracji `version:18`, zmian cen, płatności czy wydruków. Wersja PWA `manu-app-v3.25.1`, moduł `cloud.js?v=3.25.1`. Backup kodu: `backup-manu-v3-25-0-before-cloud-conflict-preflight`.

### Test etapu 16.2
1. Jeśli konto Supabase jest skonfigurowane i zalogowane, wejdź w **Ustawienia → Konto i synchronizacja → Sprawdź synchronizację**. To kontrola stanu.
2. Po **Wyślij dane lokalne do chmury** lub **Pobierz dane z chmury** zobaczysz porównanie liczb i dat. Wybierz **Anuluj**, jeśli nie przygotowałeś kopii JSON lub jeśli daty i liczby wymagają wyjaśnienia.
3. Jeśli nie używasz konta, nic nie musisz robić — ta zmiana nie wpływa na zapis lokalny. Wciąż korzystaj z **Kontroli bezpieczeństwa danych** oraz eksportu JSON.

## MANU 3.25.0 — Etap 16.1: kontrola bezpieczeństwa danych
- Rozpoczęto etap 16 — bezpieczeństwo i przygotowanie do testów przez innych twórców. W **Ustawienia i dane → Zabezpieczenia i kopie danych** dodano kompaktową **Kontrolę bezpieczeństwa danych** z przyciskiem **Sprawdź**.
- Kontrola wykonuje tylko operacje **odczytu**: sprawdza bieżący zapis lokalny, czytelność poprzedniego zapisu awaryjnego i uprawnienie przeglądarki do trwałego przechowywania (`navigator.storage.persisted()`, jeśli dostępne).
- Bieżący zapis jest walidowany z użyciem istniejącego `validateBackup`, a liczby projektów, klientów, wycen i innych zapisów oraz data ostatniego zapisu porównywane z aktualnie widocznym stanem. Błędy odczytu i nieczytelne dane zgłaszane są jako problem, brak pierwszej kopii awaryjnej — jako informacja ostrzegawcza.
- Ochrona pamięci jest wykazywana jako **Przyznana**, **Nieprzyznana** albo **Nieznana**. Stan „Nieznana” nie jest interpretowany jako gwarancja bezpieczeństwa. Do próby przyznania ochrony służy istniejący przycisk „Zwiększ trwałość lokalnej pamięci”.
- Panel jest **w istniejącej sekcji Ustawień** i aktualizuje jedynie wynik, bez przewijania strony czy przebudowy całej kartki. Nie wysyła danych do chmury, nie zmienia danych ani synchronizacji. Wynik nie jest zapisywany do danych użytkownika.
- Raport przypomina, że **sprawny zapis na telefonie nie zastępuje zewnętrznego pliku JSON** ani osobnego potwierdzenia synchronizacji. Status rzeczywistej synchronizacji pozostaje w istniejącej sekcji Konto i synchronizacja; MANU nie deklaruje chmury bez weryfikacji.
- Brak zmian schematu danych `version:18`, bazy `pracownia_db_v1`, finansów, dokumentów i nawigacji. Wersja PWA: `manu-app-v3.25.0`. Backup kodu: `backup-manu-v3-24-0-before-security-audit`.

### Test etapu 16.1 na telefonie
1. Otwórz **Ustawienia → Zabezpieczenia i kopie danych**.
2. W ramce **Kontrola bezpieczeństwa danych** naciśnij **Sprawdź**.
3. Sprawdź trzy wyniki: **Bieżący zapis**, **Poprzedni zapis** i **Ochrona pamięci**. „Brak poprzedniego zapisu” jest możliwy przy świeżej instalacji.
4. Jeżeli ochrona jest nieprzyznana, możesz użyć niżej istniejącego przycisku **Zwiększ trwałość lokalnej pamięci**, a następnie powtórzyć kontrolę.
5. Pobierz **kopię JSON** i zachowaj ją poza telefonem. Jeśli używasz konta, osobno sprawdź status w **Konto i synchronizacja**.

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
MANU jest statyczną aplikacją HTML/CSS/JS bez kroku budowania. Kod znajduje się w repozytorium `ArtystaAkrobata/Pracownia-app` i jest opublikowany przez GitHub Pages pod adresem https://artystaakrobata.github.io/Pracownia-app/ .

Pliki `index.html`, `app.js`, `styles.css`, `gallery.js`, `templates.js`, `cloud.js`, `cloud-config.js`, `manifest.webmanifest`, `service-worker.js` i ikony `manu48-*` są w głównym katalogu repozytorium.

Na Androidzie otwórz stronę w Chrome i wybierz **⋮ → Zainstaluj aplikację** lub **Dodaj do ekranu głównego**. Kolejne wersje wczytuj z **Ustawienia → Instalacja i aktualizacje**. Przed odinstalowaniem lub czyszczeniem danych zrób kopię JSON i sprawdź jej zawartość.

## Dane i bezpieczeństwo
MANU zapisuje dane lokalnie (IndexedDB lub rezerwowo localStorage). Ma też opcjonalną rejestrację/logowanie oraz synchronizację jednego zestawu danych przez skonfigurowane konto Supabase. Automatyczna synchronizacja włącza się dopiero w warunkach określonych przez moduł chmury; sam fakt zainstalowania aplikacji **nie gwarantuje** zapisu w chmurze. Podczas konfliktów wersji użytkownik może potrzebować ręcznego wyboru. Zdjęcia wymagają osobnego prywatnego zasobnika Supabase Storage.

W repozytorium znajdują się polityki RLS dla danych i galerii (`supabase/manu_snapshots.sql`, `supabase/manu_gallery.sql`), ale obecność skryptów **nie dowodzi** ich prawidłowego uruchomienia w konkretnej instancji Supabase. Przed testami z prawdziwymi danymi potrzebna jest kontrola dostępu między dwoma osobnymi kontami, uprawnień i kwestii RODO. Przed publicznym wdrożeniem należy też przygotować jasne informacje o prywatności.

Utrata telefonu, wyczyszczenie pamięci lub nieudana synchronizacja nadal grożą utratą zmian. Regularnie pobieraj kopię JSON, sprawdzaj ją i przechowuj poza telefonem. Kopia JSON zawiera opisy zdjęć, **nie ich pliki**. Import lokalny i pobieranie danych z chmury mogą zastąpić bieżący zestaw informacji. Do pierwszych testów zewnętrznych używaj wyłącznie fikcyjnych danych w izolowanym trybie DEMO.

Obliczany wynik to **wartość projektów minus wpisane koszty bezpośrednie**, a nie zysk księgowy ani wynagrodzenie netto; nie uwzględnia podatków, ZUS, kosztów stałych i innych nieujętych wydatków. W warsztatach z automatycznym rozliczaniem suma wartości i otrzymanych wpłat wynika z listy uczestników i nie jest podwójnie doliczana. Starsze warsztaty zachowują dotychczasowe sumy ręczne; wcześniejsze oznaczenie „wpłata” bez podanej kwoty zostanie zachowane jako ostrzeżenie do uzupełnienia, a nie wymyślona płatność.

## Następne etapy — finalizacja wersji testowej
1. **17.2 — Bezpieczeństwo danych:** audyt i poprawki kodu wykonane (3.28.1); nadal wymagane próby importu/odtworzenia na osobnym telefonie oraz izolacja dwóch kont Supabase na działającej instancji.
2. **17.3 — Instalacja i niezawodność:** poprawki PWA wdrożone w 3.28.2; wymagane potwierdzenie instalacji, restartu i pracy offline na drugim rzeczywistym telefonie.
3. **17.4 — Ostatnie szlify:** poprawki dokumentów PDF i komunikatów wdrożone w 3.28.3; do potwierdzenia wygląd wydruków na telefonie i tablecie, potem końcowa kontrola wersji beta.
4. **17.5 — Testy zewnętrzne:** narzędzia i zaproszenie gotowe; rzeczywiste testy przez niezależnych testerów nadal pozostają do przeprowadzenia.
5. **18.1 — iOS / iPadOS:** instrukcja i raport od wersji 3.29.0; potrzebny test na urządzeniu Apple.
6. **18.2 — Kontrola zgodności:** diagnostyka przeglądarki i PWA w 3.29.1; wynik na Androidzie potwierdzony przez właściciela.
7. **18.3 — Restart offline:** właściciel potwierdził na Samsungu uruchomienie i nawigację bez internetu. Próbę na drugim urządzeniu wykonamy z testerami.
8. **18.4 — Trwałość lokalnego zapisu:** nie powtarzamy wcześniejszych testów na Samsungu, bo mechanizm zapisu nie był zmieniany. Test wielourządzeniowy nadal osobno.
9. **18.5 — Bezpieczna beta:** informacja dla testera o danych i prywatności w wersji 3.29.2; do sprawdzenia czytelność sekcji i opinie pierwszych testerów.

MANU jest funkcjonalnym prototypem w trakcie finalizacji, a nie produktem o potwierdzonej gotowości do przechowywania rzeczywistych danych wielu użytkowników.
