# MANU — Organizer twórcy

**Wersja 2.5.0 (MVP, testowa)** · Polska aplikacja instalowana jako PWA, przygotowana dla artystów, organizatorów warsztatów i małych pracowni rzemieślniczych.

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
1. Testy na Androidzie i poprawki UX.
2. Konta użytkowników, bezpieczna synchronizacja, kopie zapasowe i oddzielenie danych użytkowników.
3. Raporty opłacalności, zdjęcia realizacji, wyceny PDF, dodatkowe szablony branżowe.
4. Funkcje AI oraz panel udostępniany klientom po osobnych testach bezpieczeństwa.

To jest prywatny prototyp, nie gotowy produkt komercyjny.
