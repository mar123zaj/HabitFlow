# HabitFlow — Pomysły do realizacji

Pozycje uporządkowane od najłatwiejszych (quick wins / fixy) po najbardziej złożone ficzery.

---

## Priorytet 1 — Quick wins / fixy UX

---

### ✅ ~~1. Blokada podwójnego tapnięcia (zoom)~~

Podwójne tapnięcie na ekran powoduje zoom-in, co w natywnych aplikacjach nie występuje. Należy to zablokować, żeby aplikacja zachowywała się jak apka, nie jak strona webowa.

#### Zakres zmian

- **Viewport meta** — dodanie `maximum-scale=1.0, user-scalable=no` do tagu `<meta name="viewport">` na wszystkich stronach (`index.html`, `habit-form.html`, `habit-detail.html`, `login.html`)
- **CSS touch-action** — dodanie `touch-action: manipulation` na `html` (blokuje zoom na double-tap, ale nie blokuje pinch-zoom ani normalnego scrollu)

#### Pliki do zmiany

- `index.html`, `habit-form.html`, `habit-detail.html`, `login.html` — viewport meta
- `css/reset.css` — `touch-action: manipulation` na `html`

---

### 2. Ukrycie scrollbara strony (app feel)

Widoczny systemowy scrollbar na stronie głównej i innych widokach psuje wrażenie natywnej aplikacji. Należy go ukryć zachowując pełną funkcjonalność scrollowania.

#### Zakres zmian

- **Ukrycie scrollbara body** — CSS `scrollbar-width: none` (Firefox) + `::-webkit-scrollbar { display: none }` (Chrome/Safari) na `body` lub `html`
- **Overscroll behavior** — dodanie `overscroll-behavior: none` na `body`, żeby zablokować "bounce" efekt na iOS/Android i pull-to-refresh przeglądarki
- **Konsystencja** — upewnić się, że scrollbar jest ukryty na wszystkich stronach (dot grid już go ukrywa — ten sam wzorzec dla body)

#### Pliki do zmiany

- `css/reset.css` — globalne reguły scrollbar + overscroll-behavior

---

### 3. Wyraźniejszy stan niewykonanego nawyku jednorazowego

Dla nawyków z `daily_target = 1` action button w stanie niewykonanym (`action-btn--empty`) wyświetla ikonę checka (ptaszek) w kółku, co wygląda niemal identycznie jak stan wykonany. Użytkownik nie widzi na pierwszy rzut oka, które nawyki jeszcze nie zostały odkliknięte.

#### Aktualne zachowanie

- **Niewykonany** (`action-btn--empty`): SVG_CHECK (ptaszek) + szare tło (`var(--bg-button)`) + szary kolor ikony (`var(--text-secondary)`)
- **Wykonany** (`action-btn--complete`): SVG_CHECK (ptaszek) + kolorowe tło (kolor nawyku) + biały kolor ikony

#### Docelowe zachowanie

- **Niewykonany** (`action-btn--empty`, `daily_target = 1`): puste kółko (outlined, bez żadnej ikony wewnątrz) — wyraźnie sygnalizuje "do zrobienia"
- **Wykonany** (`action-btn--complete`): SVG_CHECK (ptaszek) + kolorowe tło — wyraźnie sygnalizuje "zrobione"
- Nawyki z `daily_target > 1` bez zmian (ikona plus pozostaje)

#### Zakres zmian

- **Logika ikony** — w `renderActionButton()` w `js/ui.js`: gdy `daily_target === 1` i `todayCount === 0`, nie wstawiać SVG_CHECK — zostawić pusty button
- **CSS empty state** — dodać obramowanie/outline na `action-btn--empty` zamiast tła, żeby puste kółko było widoczne (np. `border: 2px solid var(--text-secondary)` + `background: transparent`)
- **Bounce animation** — zachować animację bounce przy przejściu empty → complete

#### Pliki do zmiany

- `js/ui.js` — logika w `renderActionButton()` (linie 100-124)
- `css/app.css` — style `.action-btn--empty` (linie 138-141)

---

### ✅ ~~4. Wyłączenie klikania historycznych dni na ekranie głównym~~

Podczas scrollowania strony głównej w pionie użytkownik przypadkowo klika w historyczne doty (kropki) na dot gridzie, co toggleuje logi. Na małym ekranie mobilnym, gdzie dot grid jest gęsty, jest to częsty problem. Edycja historycznych dni powinna odbywać się wyłącznie z widoku kalendarza na `habit-detail.html`.

#### Aktualne zachowanie

- Każdy dot (`.dot:not(.dot--blank)`) na stronie głównej jest klikalny — toggleuje log niezależnie od daty
- Event delegation w `js/app.js` łapie kliknięcia na wszystkie doty bez filtrowania

#### Docelowe zachowanie

- Doty na stronie głównej pełnią wyłącznie funkcję wizualizacji (read-only) — brak interakcji
- Jedyny sposób logowania z poziomu strony głównej to action button (check/plus)
- Edycja historycznych wpisów wyłącznie z widoku kalendarza na `habit-detail.html` (tam bez zmian)

#### Zakres zmian

- **Event delegation** — w `js/app.js` usunąć blok obsługujący kliknięcia na `.dot` (linie 284-293), zostawić tylko obsługę `.action-btn`
- **Rendering dotów** — w `renderDotGrid()` w `js/ui.js` zmienić element z `<button>` na `<div>` (brak semantyki interaktywnej) — ale tylko gdy grid jest renderowany na stronie głównej. Na `habit-detail.html` doty powinny pozostać klikalne (overview section)
- **CSS** — usunąć `cursor: pointer` i `transform: scale(1.4)` na `:active` dla dotów na stronie głównej (albo dodać parametr do `renderDotGrid()` określający tryb: interactive vs read-only)
- **Parametr trybu** — dodać opcjonalny argument `interactive` (domyślnie `false`) do `renderDotGrid()`. Na `habit-detail.html` wywoływany z `interactive: true`

#### Pliki do zmiany

- `js/ui.js` — `renderDotGrid()` (dodać parametr interactive, zmienić element na div gdy read-only)
- `js/app.js` — usunąć event listener na `.dot` (linie 284-293)
- `css/app.css` — opcjonalnie klasa `.dot--readonly` bez cursor/hover/active states
- `habit-detail.html` — przekazać `interactive: true` do `renderDotGrid()`

---

### 5. Loading states (skeleton + spinner)

Na stronie głównej i na `habit-detail.html` brak jakiegokolwiek feedbacku wizualnego podczas ładowania danych z Supabase. Użytkownik widzi pustą stronę, co na wolniejszych połączeniach wygląda jak błąd.

#### Aktualne zachowanie

- Strona główna: `loadData()` w `js/app.js` ładuje habits + logs + requirements. Do momentu rozwiązania Promise container `#habit-list` jest pusty
- Detail page: analogicznie — habit, logi, kalendarz pojawiają się nagle
- Buttony (save, login) mają już loading state (`.btn--loading` + `.spinner`)

#### Docelowe zachowanie

- **Skeleton loading na stronie głównej** — placeholder kart nawyków (szare prostokąty imitujące layout habit-card: top row + dot grid) wyświetlane natychmiast, zastępowane prawdziwymi kartami po załadowaniu
- **Skeleton na detail page** — placeholder headera, dot gridu i kalendarza
- **Spinner dla akcji** — obecne zachowanie buttonów bez zmian (już działa)
- **Płynne przejście** — skeleton znika i pojawia się treść bez skoku layoutu (skeleton ma takie same wymiary jak docelowe elementy)

#### Zakres zmian

- **Skeleton component** — nowe klasy CSS: `.skeleton` (animowany gradient/pulse), `.skeleton-card` (imitacja habit-card), `.skeleton-dot-grid` (imitacja dot gridu), `.skeleton-text` (linia tekstu)
- **Strona główna** — w `index.html` dodać statyczny skeleton HTML w `#habit-list`, który jest usuwany przez `renderHabitList()` po załadowaniu danych
- **Detail page** — analogiczny skeleton w `habit-detail.html`
- **Animacja** — pulse animation (`@keyframes skeleton-pulse`) na tle elementów skeleton

#### Pliki do zmiany

- `css/app.css` — nowe style `.skeleton`, `.skeleton-card`, `.skeleton-dot-grid`
- `index.html` — skeleton HTML jako default content w `#habit-list`
- `habit-detail.html` — skeleton HTML w sekcjach header, overview, calendar

---

## Priorytet 2 — Średnia złożoność

---

### 6. Rozszerzenie palety kolorów

Obecna paleta 12 kolorów jest zbyt ograniczona, szczególnie dla użytkowników z wieloma nawykami. Rozszerzenie do ~20-24 kolorów daje lepsze możliwości personalizacji.

#### Aktualne zachowanie

- 12 kolorów: blue, green, purple, red, orange, yellow, pink, teal, gray, white, lime, indigo
- Grid 6-kolumnowy (`.color-grid` z `grid-template-columns: repeat(6, 1fr)`)

#### Docelowe zachowanie

- ~20-24 kolorów — dodanie brakujących odcieni: cyan, amber, rose, emerald, violet, slate, coral, mint, lavender, gold, sky, burgundy (dokładna lista do ustalenia na etapie planowania)
- Grid 6-kolumnowy bez zmian (4 rzędy zamiast 2)
- Nowe kolory muszą dobrze wyglądać na ciemnym tle (`var(--bg-primary)`) jako tło dotów, action buttonów i ikon nawyków
- Aktualizacja `css/variables.css` o nowe custom properties dla dodanych kolorów

#### Zakres zmian

- **Tablica COLORS** — rozszerzenie tablicy w `habit-form.html` o nowe kolory z nazwami i wartościami hex
- **Design tokens** — dodanie nowych `--color-*` zmiennych w `css/variables.css`
- **Grid layout** — bez zmian (auto-wrap na 6 kolumn)
- **Kompatybilność** — istniejące nawyki z dotychczasowymi kolorami bez zmian

#### Pliki do zmiany

- `habit-form.html` — rozszerzenie tablicy `COLORS`
- `css/variables.css` — nowe custom properties

---

### 7. Pełny emoji picker z kategoriami i wyszukiwaniem

Obecny picker to płaska siatka 56 emoji bez organizacji. Przy dużej liczbie emoji (200+) staje się nieczytelny. Potrzebny pełny picker jak w komunikatorach — z kategoriami i wyszukiwaniem.

#### Aktualne zachowanie

- Statyczna tablica `EMOJIS` (56 sztuk) w `habit-form.html`
- Renderowanie jako `.emoji-grid` z auto-fill
- Kliknięcie zaznacza emoji (`.emoji-option--selected`)

#### Docelowe zachowanie

- **Kategorie** — zakładki/tabs na górze pickera: Buźki, Ludzie, Zwierzęta, Jedzenie, Aktywności, Podróże, Przedmioty, Symbole
- **Wyszukiwanie** — pole tekstowe na górze pickera. Wpisanie tekstu filtruje emoji po angielskiej nazwie (np. "run" → 🏃, "book" → 📚, "heart" → ❤️)
- **Rozszerzona baza** — 200-300 emoji pokrywających popularne kategorie
- **Scroll w kategoriach** — po kliknięciu w tab picker scrolluje do danej sekcji
- **Zachowanie wyboru** — kliknięcie w emoji zaznacza je (jak dotychczas)
- **Responsywność** — picker mieści się w polu formularza, scroll wewnętrzny gdy emoji nie mieszczą się

#### Zakres zmian

- **Dane emoji** — nowy plik `js/emoji-data.js` eksportujący tablicę emoji z polami: `{ emoji, name, category }`. Dane generowane statycznie (brak zewnętrznych API)
- **Komponent pickera** — refaktor sekcji emoji w `habit-form.html`: dodanie pola wyszukiwania, tabs kategorii, scroll container
- **Filtrowanie** — wyszukiwanie po `name` (case-insensitive, substring match)
- **CSS** — nowe style: `.emoji-picker`, `.emoji-picker__search`, `.emoji-picker__tabs`, `.emoji-picker__tab`, `.emoji-picker__section`, `.emoji-picker__section-title`

#### Pliki do zmiany

- `js/emoji-data.js` — nowy plik z bazą emoji
- `habit-form.html` — refaktor inline scriptu i HTML sekcji emoji
- `css/app.css` — nowe style emoji pickera
- `sw.js` — dodanie `js/emoji-data.js` do `STATIC_ASSETS` + bump `CACHE_NAME`

---

### 8. Podsumowanie tygodnia (Weekly Review)

Co poniedziałek rano użytkownik widzi w aplikacji podsumowanie minionego tygodnia (pon–niedz). To motywacyjny przegląd — co poszło dobrze, co wymaga poprawy — dostępny bezpośrednio w apce bez konieczności sprawdzania maila.

#### Docelowe zachowanie

- **Dostępność** — podsumowanie widoczne od poniedziałku rano (np. od 06:00 czasu lokalnego) do końca dnia. Alternatywnie: zawsze dostępne z poziomu linku/buttonu, ale poniedziałkowy wyświetla się automatycznie jako "karta" na górze strony głównej
- **Zakres danych** — miniony tydzień (poniedziałek–niedziela), obliczany client-side na podstawie istniejących `habit_logs`
- **Treść podsumowania:**
  - **Ogólny wynik tygodnia** — procent realizacji (zrealizowane / obowiązujące dni × nawyki), np. "82% — świetny tydzień!"
  - **Trend** — porównanie z poprzednim tygodniem (↑ lepiej / → bez zmian / ↓ gorzej) z wartością procentową różnicy
  - **Top nawyki** — nawyki z najwyższym % realizacji w tym tygodniu
  - **Do poprawy** — nawyki z najniższym % realizacji (pominięte lub częściowo wykonane)
  - **Aktywne serie (streaks)** — najdłuższe bieżące serie z liczbą dni
  - **Rekordy tygodnia** — nowe rekordy pobite w tym tygodniu (najdłuższa seria, najlepszy dzień itp.)
- **Zamknięcie** — użytkownik może zamknąć/schować kartę podsumowania (zapamiętane w `localStorage`, żeby nie pokazywać ponownie tego samego tygodnia)
- **Archiwum** — opcjonalnie: dostęp do podsumowań z poprzednich tygodni z poziomu dedykowanej strony lub sekcji

#### Zakres zmian

- **Nowa strona lub komponent** — `weekly-summary.html` (osobna strona) lub komponent inline na stronie głównej (karta na górze `#habit-list`)
- **Logika agregacji** — nowy moduł `js/weekly-summary.js` obliczający statystyki tygodnia na podstawie `habit_logs` i `habits` (dane już pobierane w `loadData()`)
- **Warunek wyświetlania** — sprawdzenie `new Date().getDay() === 1` (poniedziałek) + godziny + klucz `localStorage` (np. `weekly-review-dismissed-2026-W10`)
- **UI** — karta z ciemnym gradientowym tłem, ikony trendów (↑↓→), kolorowe procenty, lista nawyków z mini progress barami
- **Link z headera** — opcjonalny przycisk/ikona w headerze strony głównej dający dostęp do podsumowania w dowolnym dniu

#### Pliki do zmiany

- `js/weekly-summary.js` — nowy moduł: agregacja danych + rendering
- `js/app.js` — import modułu, warunek wyświetlania na poniedziałek, integracja z `loadData()`
- `css/app.css` — nowe style: `.weekly-summary`, `.weekly-summary__stat`, `.weekly-summary__trend`
- `index.html` — opcjonalnie placeholder div lub przycisk w headerze
- `sw.js` — dodanie `js/weekly-summary.js` do `STATIC_ASSETS` + bump `CACHE_NAME`

---

### 9. Drag & drop — ustawianie kolejności nawyków

Użytkownik nie może zmienić kolejności nawyków na liście głównej. Kolumna `sort_order` istnieje w bazie, ale brak mechanizmu jej edycji. Potrzebny drag & drop (touch-friendly) do przeciągania kart.

#### Aktualne zachowanie

- Nawyki sortowane po `sort_order` w `fetchHabits()` (domyślnie kolejność dodawania)
- Brak UI do zmiany kolejności
- `sort_order` to INTEGER w tabeli `habits`

#### Docelowe zachowanie

- **Tryb edycji kolejności** — przycisk "Reorder" (ikona ≡ / grip) w headerze strony głównej, który aktywuje tryb drag & drop
- **Drag handle** — po aktywacji trybu, po lewej stronie każdej karty pojawia się ikona uchwytu (grip lines ≡)
- **Przeciąganie** — long-press + drag na mobile (touch events) do przeniesienia karty w inne miejsce listy
- **Wizualny feedback** — przeciągana karta lekko podniesiona (shadow + scale), placeholder w miejscu docelowym
- **Zapis** — po zakończeniu przeciągania, nowa kolejność zapisywana do Supabase (batch update `sort_order` dla zmienionych nawyków)
- **Wyjście z trybu** — ponowne kliknięcie "Reorder" lub tap poza kartami
- **Brak zewnętrznych bibliotek** — implementacja na natywnych touch events / pointer events

#### Zakres zmian

- **Tryb reorder** — nowy stan w `js/app.js` (flaga `isReorderMode`), toggle przycisku w headerze
- **Drag logic** — moduł `js/drag.js` obsługujący `pointerdown`, `pointermove`, `pointerup` na kartach
- **Zapis kolejności** — nowa funkcja w `js/habits.js` (np. `updateSortOrder(updates)`) robiąca batch update w Supabase
- **CSS** — nowe style: `.habit-card--dragging`, `.habit-card--placeholder`, `.drag-handle`, `.reorder-mode`
- **Header** — dodanie przycisku reorder do headera `index.html`

#### Pliki do zmiany

- `js/drag.js` — nowy moduł drag & drop
- `js/app.js` — integracja trybu reorder + toggle
- `js/habits.js` — funkcja `updateSortOrder()`
- `index.html` — przycisk reorder w headerze
- `css/app.css` — style drag & drop
- `sw.js` — dodanie `js/drag.js` do `STATIC_ASSETS` + bump `CACHE_NAME`

---

## Priorytet 3 — Duże ficzery

---

### 10. Kategorie nawyków

Możliwość grupowania nawyków w kategorie (np. Zdrowie, Produktywność, Rozwój, Relacje), żeby łatwiej organizować listę i filtrować widoki:

- **Tworzenie kategorii** — nazwa + kolor/ikona
- **Przypisywanie nawyków** — każdy nawyk może należeć do jednej kategorii (opcjonalnie)
- **Filtrowanie na liście głównej** — szybkie przełączanie między kategoriami (tabs / chips)
- **Statystyki per kategoria** — procent realizacji dla całej grupy nawyków

#### Zmiany w modelu danych

- Nowa tabela `categories`: id, user_id, name, color, icon, sort_order
- Tabela `habits`: nowa kolumna `category_id` (FK → categories, nullable)

---

### 11. Streak Goal — cele seryjne

Użytkownik ustawia cel serii (np. "30 dni bez przerwy") dla danego nawyku i śledzi postęp:

- **Definiowanie celu** — wybór docelowej długości serii (7, 14, 30, 60, 90, 365 dni lub własna wartość)
- **Pasek postępu** — wizualizacja ile % serii już za nami
- **Milestone'y** — oznaczenia kamieni milowych w trakcie serii (np. 25%, 50%, 75%)
- **Powiadomienie o osiągnięciu** — celebracja po ukończeniu celu (animacja, badge)
- **Historia serii** — lista ukończonych streak goals z datami

#### Zmiany w modelu danych

- Tabela `habits`: nowa kolumna `streak_goal` (INTEGER, nullable) — docelowa długość serii
- Opcjonalnie nowa tabela `streak_achievements`: id, habit_id, user_id, goal, started_at, completed_at

---

### 12. Zawieszanie nawyku (Pause)

Możliwość tymczasowego zawieszenia nawyku na określony czas (np. urlop, choroba, przerwa), bez utraty serii i bez wpływu na statystyki:

- **Ustawianie pauzy** — wybór daty rozpoczęcia i zakończenia zawieszenia (lub "do odwołania")
- **Wizualne oznaczenie** — zawieszony nawyk wyszarzony na liście z etykietą "Wstrzymany do DD.MM"
- **Wykluczenie z serii** — dni w trakcie pauzy nie przerywają streaka i nie liczą się do statystyk
- **Wykluczenie z podsumowań** — zawieszony nawyk pomijany w cotygodniowych raportach
- **Automatyczne wznowienie** — nawyk wraca do aktywnych po upływie daty końcowej
- **Historia pauz** — podgląd przeszłych okresów zawieszenia na widoku szczegółów nawyku

#### Zmiany w modelu danych

- Tabela `habits`: nowe kolumny `paused_from` (DATE, nullable) i `paused_until` (DATE, nullable)
- Opcjonalnie tabela `habit_pauses`: id, habit_id, user_id, from_date, until_date, reason — do przechowywania historii pauz

---

### 13. Statystyki z wymaganiami nawyku

Nawyki mogą mieć przypisane wymaganie ilościowe z jednostką (np. bieganie → dystans w km, czytanie → liczba stron). Użytkownik przy logowaniu wpisuje wartość (np. "przebiegłem 3.2 km"), a aplikacja prezentuje:

- **Wykres dzienny** — jak wartość zmieniała się z dnia na dzień
- **Wykres kumulacyjny** — narastająca suma w czasie (np. łącznie przebiegane km w miesiącu)
- **Statystyki zbiorcze** — średnia, najlepszy dzień, seria dni powyżej celu
- **Porównanie z celem** — wizualne oznaczenie dni, w których cel został osiągnięty vs nie

#### Zmiany w modelu danych

- Tabela `habits`: nowe kolumny `unit` (TEXT, np. "km", "strony", "min") i `target_value` (NUMERIC)
- Tabela `habit_logs`: nowa kolumna `value` (NUMERIC) obok istniejącego `count`

---

### 14. Wielojęzyczność (i18n)

Obsługa wielu języków w aplikacji, żeby była dostępna dla szerszego grona użytkowników:

- **Języki na start** — polski, angielski
- **Plik tłumaczeń** — JSON per język (np. `locales/pl.json`, `locales/en.json`) z kluczami dla wszystkich tekstów UI
- **Automatyczne wykrywanie** — domyślny język na podstawie `navigator.language`
- **Ręczny wybór** — przełącznik języka w ustawieniach
- **Zapamiętywanie preferencji** — zapis wybranego języka w `localStorage`

#### Implementacja

- Moduł `js/i18n.js` — ładuje plik tłumaczeń, eksportuje funkcję `t('key')` zwracającą przetłumaczony tekst
- Atrybuty `data-i18n` na elementach HTML do automatycznego tłumaczenia przy zmianie języka
- Tłumaczenie dynamicznych tekstów (toasty, komunikaty błędów) przez wywołanie `t()` w kodzie JS

---

## Priorytet 4 — Backendowe / infrastrukturalne

---

### 15. Cotygodniowe podsumowania na e-mail

Automatyczny e-mail wysyłany raz w tygodniu (np. w poniedziałek rano) z przeglądem minionych 7 dni:

- Które nawyki zostały zrealizowane, a które pominięte
- Procent realizacji vs poprzedni tydzień (trend)
- Najdłuższe aktywne serie (streaks)
- Motywacyjna wiadomość / cytat

#### Implementacja

- Supabase Edge Function uruchamiana przez cron (pg_cron lub zewnętrzny scheduler)
- Szablon HTML e-maila (responsywny, ciemny motyw spójny z aplikacją)
- Ustawienia użytkownika: włącz/wyłącz, wybór dnia wysyłki

---

### 16. AI Buddy — asystent wspierający realizację nawyków

Osobisty asystent AI, który pomaga użytkownikowi utrzymać nawyki i się rozwijać:

- **Analiza wzorców** — rozpoznaje, kiedy użytkownik zaczyna odpuszczać i proaktywnie reaguje
- **Spersonalizowane porady** — na podstawie historii logów sugeruje, jak poprawić wyniki
- **Celebracja sukcesów** — gratuluje rekordów, serii, osiągnięcia celów
- **Cotygodniowy coaching** — krótki chat-summary z rekomendacjami na następny tydzień
- **Motywacja push** — powiadomienia przypominające o nawykach z kontekstem ("Zostały Ci 2 nawyki na dziś, dasz radę!")

#### Implementacja

- Supabase Edge Function + OpenAI API (lub inny LLM)
- Dedykowany widok czatu w aplikacji
- Opcjonalne powiadomienia push (Web Push API)
