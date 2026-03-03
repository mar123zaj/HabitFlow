# HabitFlow — Pomysły do realizacji

## 1. Statystyki z wymaganiami nawyku

Nawyki mogą mieć przypisane wymaganie ilościowe z jednostką (np. bieganie → dystans w km, czytanie → liczba stron). Użytkownik przy logowaniu wpisuje wartość (np. "przebiegłem 3.2 km"), a aplikacja prezentuje:

- **Wykres dzienny** — jak wartość zmieniała się z dnia na dzień
- **Wykres kumulacyjny** — narastająca suma w czasie (np. łącznie przebiegane km w miesiącu)
- **Statystyki zbiorcze** — średnia, najlepszy dzień, seria dni powyżej celu
- **Porównanie z celem** — wizualne oznaczenie dni, w których cel został osiągnięty vs nie

### Zmiany w modelu danych

- Tabela `habits`: nowe kolumny `unit` (TEXT, np. "km", "strony", "min") i `target_value` (NUMERIC)
- Tabela `habit_logs`: nowa kolumna `value` (NUMERIC) obok istniejącego `count`

---

## 2. Cotygodniowe podsumowania na e-mail

Automatyczny e-mail wysyłany raz w tygodniu (np. w poniedziałek rano) z przeglądem minionych 7 dni:

- Które nawyki zostały zrealizowane, a które pominięte
- Procent realizacji vs poprzedni tydzień (trend)
- Najdłuższe aktywne serie (streaks)
- Motywacyjna wiadomość / cytat

### Implementacja

- Supabase Edge Function uruchamiana przez cron (pg_cron lub zewnętrzny scheduler)
- Szablon HTML e-maila (responsywny, ciemny motyw spójny z aplikacją)
- Ustawienia użytkownika: włącz/wyłącz, wybór dnia wysyłki

---

## 3. AI Buddy — asystent wspierający realizację nawyków

Osobisty asystent AI, który pomaga użytkownikowi utrzymać nawyki i się rozwijać:

- **Analiza wzorców** — rozpoznaje, kiedy użytkownik zaczyna odpuszczać i proaktywnie reaguje
- **Spersonalizowane porady** — na podstawie historii logów sugeruje, jak poprawić wyniki
- **Celebracja sukcesów** — gratuluje rekordów, serii, osiągnięcia celów
- **Cotygodniowy coaching** — krótki chat-summary z rekomendacjami na następny tydzień
- **Motywacja push** — powiadomienia przypominające o nawykach z kontekstem ("Zostały Ci 2 nawyki na dziś, dasz radę!")

### Implementacja

- Supabase Edge Function + OpenAI API (lub inny LLM)
- Dedykowany widok czatu w aplikacji
- Opcjonalne powiadomienia push (Web Push API)

---

## 4. Kategorie nawyków

Możliwość grupowania nawyków w kategorie (np. Zdrowie, Produktywność, Rozwój, Relacje), żeby łatwiej organizować listę i filtrować widoki:

- **Tworzenie kategorii** — nazwa + kolor/ikona
- **Przypisywanie nawyków** — każdy nawyk może należeć do jednej kategorii (opcjonalnie)
- **Filtrowanie na liście głównej** — szybkie przełączanie między kategoriami (tabs / chips)
- **Statystyki per kategoria** — procent realizacji dla całej grupy nawyków

### Zmiany w modelu danych

- Nowa tabela `categories`: id, user_id, name, color, icon, sort_order
- Tabela `habits`: nowa kolumna `category_id` (FK → categories, nullable)

---

## 5. Streak Goal — cele seryjne

Użytkownik ustawia cel serii (np. "30 dni bez przerwy") dla danego nawyku i śledzi postęp:

- **Definiowanie celu** — wybór docelowej długości serii (7, 14, 30, 60, 90, 365 dni lub własna wartość)
- **Pasek postępu** — wizualizacja ile % serii już za nami
- **Milestone'y** — oznaczenia kamieni milowych w trakcie serii (np. 25%, 50%, 75%)
- **Powiadomienie o osiągnięciu** — celebracja po ukończeniu celu (animacja, badge)
- **Historia serii** — lista ukończonych streak goals z datami

### Zmiany w modelu danych

- Tabela `habits`: nowa kolumna `streak_goal` (INTEGER, nullable) — docelowa długość serii
- Opcjonalnie nowa tabela `streak_achievements`: id, habit_id, user_id, goal, started_at, completed_at

---

## 6. Wielojęzyczność (i18n)

Obsługa wielu języków w aplikacji, żeby była dostępna dla szerszego grona użytkowników:

- **Języki na start** — polski, angielski
- **Plik tłumaczeń** — JSON per język (np. `locales/pl.json`, `locales/en.json`) z kluczami dla wszystkich tekstów UI
- **Automatyczne wykrywanie** — domyślny język na podstawie `navigator.language`
- **Ręczny wybór** — przełącznik języka w ustawieniach
- **Zapamiętywanie preferencji** — zapis wybranego języka w `localStorage`

### Implementacja

- Moduł `js/i18n.js` — ładuje plik tłumaczeń, eksportuje funkcję `t('key')` zwracającą przetłumaczony tekst
- Atrybuty `data-i18n` na elementach HTML do automatycznego tłumaczenia przy zmianie języka
- Tłumaczenie dynamicznych tekstów (toasty, komunikaty błędów) przez wywołanie `t()` w kodzie JS

---

## 7. Zawieszanie nawyku (Pause)

Możliwość tymczasowego zawieszenia nawyku na określony czas (np. urlop, choroba, przerwa), bez utraty serii i bez wpływu na statystyki:

- **Ustawianie pauzy** — wybór daty rozpoczęcia i zakończenia zawieszenia (lub "do odwołania")
- **Wizualne oznaczenie** — zawieszony nawyk wyszarzony na liście z etykietą "Wstrzymany do DD.MM"
- **Wykluczenie z serii** — dni w trakcie pauzy nie przerywają streaka i nie liczą się do statystyk
- **Wykluczenie z podsumowań** — zawieszony nawyk pomijany w cotygodniowych raportach
- **Automatyczne wznowienie** — nawyk wraca do aktywnych po upływie daty końcowej
- **Historia pauz** — podgląd przeszłych okresów zawieszenia na widoku szczegółów nawyku

### Zmiany w modelu danych

- Tabela `habits`: nowe kolumny `paused_from` (DATE, nullable) i `paused_until` (DATE, nullable)
- Opcjonalnie tabela `habit_pauses`: id, habit_id, user_id, from_date, until_date, reason — do przechowywania historii pauz


8. Dodać loading spinners

9. wylaczyc mozliwosc klikania na dni z elranu glownego
10. dodac wiecej emoji
11. dodac wiecej kolorow
12. szukajka emoji
13. drag and drop ustawianie kolejnosci
14. podglad podsumowania dnia, tak zeby nie musiec scrollowac po wszystkich nawykach, tylko jednym najwchaniem na np date moc podejrzec szybko ktore nawyki spelnione a ktore nie
15. uniemozliwic przyblizanie ekranu poprzez podwojne klimiecie na ekran(podobnie jak zwykle jest w apkach)
16. w nawykach ktore nalezy wykonac raz nie rzuca sie tak bardzo w oczy ze jeszcze nie zostalo zrobione/odklikane - symbol ptaszka w kolku - wyglada niemal tak samo jak wykonane
