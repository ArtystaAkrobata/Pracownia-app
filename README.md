# PRACOWNIA — osobisty organizer dla twórców

**Wersja 1.2 (MVP, testowa)** · Polska aplikacja instalowana jako PWA, przygotowana dla artystów, organizatorów warsztatów i małych pracowni rzemieślniczych.

## Co działa
- Projekty i warsztaty: tworzenie, edycja, powielanie, usuwanie, statusy i terminy.
- **Formularze zależne od typu**: realizacja ma liczbę sztuk, planowany i rzeczywisty czas pracy oraz szacowane materiały; warsztat ma miejsce, godzinę startu, czas zajęć, liczbę miejsc, domyślną cenę i czas przygotowania.
- W szczegółach projektu widoczne są plan i porównanie z dotychczasową realizacją; planowane koszty są oddzielone od kosztów faktycznie wprowadzonych.
- Lista kosztów realizacji, przychód, wpłaty, należności i szacunkowy wynik po kosztach.
- Orientacyjna kwota za godzinę na podstawie czasu wpisanego przez użytkownika.
- Uczestnicy warsztatów: cena udziału, kwota otrzymanej zaliczki/wpłaty, automatyczne obliczanie dopłaty oraz edycja rozliczenia.
- Sumy należności i wpłat dla całego warsztatu. Nowe warsztaty z wartościami 0 liczą finanse z uczestników; stare pozostają w trybie ręcznym do świadomego przełączenia.
- Zadania z terminami oraz powiązanie z projektami.
- Mobilny pulpit, finanse, archiwum realizacji, filtr i wyszukiwarka.
- Zapis lokalny w IndexedDB (rezerwowo localStorage), eksport i import kopii JSON.
- PWA: manifest, ikony 192/512 oraz service worker umożliwiający podstawową pracę offline po pierwszym uruchomieniu przez HTTPS.

## Uruchomienie
Kod stanowi statyczną aplikację HTML/CSS/JS. Aby uruchomić ją w telefonie, opublikuj zawartość **katalogu głównego** na hostingu HTTPS (np. Vercel/Netlify); nie ma polecenia budowania. `index.html` musi znajdować się w folderze publikacji obok plików `app.js`, `styles.css`, `manifest.webmanifest`, `service-worker.js` oraz ikon.

Przy prywatnym repozytorium na GitHub Free, GitHub Pages nie publikuje tej strony. Możesz połączyć repozytorium z hostingiem obsługującym prywatne repozytoria, zachowując kod źródłowy na GitHubie jako prywatny.

Po publikacji otwórz adres w Chrome na Androidzie, menu **⋮ → Zainstaluj aplikację** (lub **Dodaj do ekranu głównego**, zależnie od urządzenia).

## Dane i bezpieczeństwo
**Wersja 1.0 nie ma kont, serwera, synchronizacji między telefonami ani automatycznych backupów.** Każde urządzenie ma swoją osobną pamięć aplikacji. Utrata telefonu lub wyczyszczenie danych przeglądarki może oznaczać utratę wpisów.

W ustawieniach pobieraj regularnie kopię danych JSON. Import zastępuje dotychczasowe dane. **Na tym etapie używaj wyłącznie informacji fikcyjnych/testowych; nie wpisuj prawdziwych danych osobowych klientów i uczestników.** Przed testami na danych rzeczywistych trzeba wdrożyć odpowiednie zabezpieczenia i zasady zgodne z RODO.

Obliczany wynik to **wartość projektów minus wpisane koszty bezpośrednie**, a nie zysk księgowy ani wynagrodzenie netto; nie uwzględnia podatków, ZUS, kosztów stałych i innych nieujętych wydatków. W warsztatach z automatycznym rozliczaniem suma wartości i otrzymanych wpłat wynika z listy uczestników i nie jest podwójnie doliczana. Starsze warsztaty zachowują dotychczasowe sumy ręczne; wcześniejsze oznaczenie „wpłata” bez podanej kwoty zostanie zachowane jako ostrzeżenie do uzupełnienia, a nie wymyślona płatność.

## Następne etapy
1. Testy na Androidzie i poprawki UX.
2. Konta użytkowników, bezpieczna synchronizacja, kopie zapasowe i oddzielenie danych użytkowników.
3. Raporty opłacalności, zdjęcia realizacji, wyceny PDF, dodatkowe szablony branżowe.
4. Funkcje AI oraz panel udostępniany klientom po osobnych testach bezpieczeństwa.

To jest prywatny prototyp, nie gotowy produkt komercyjny.
