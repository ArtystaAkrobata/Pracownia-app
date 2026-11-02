# MANU — Organizer twórcy

**Wersja 2.7.1 (MVP, testowa)** · Polska aplikacja instalowana jako PWA, przygotowana dla artystów, organizatorów warsztatów i małych pracowni rzemieślniczych.

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
