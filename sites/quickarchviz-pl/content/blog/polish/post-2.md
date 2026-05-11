---
title: "AI dla architektów: jak zbudować asystenta AI do analizy MPZP i prawa budowlanego w 2026"
description: "Praktyczny przewodnik dla architektów: jak wykorzystać RAG, NotebookLM i Custom Agenta do analizy MPZP, Warunków Technicznych oraz prawa budowlanego."
date: 2026-05-11T09:00:00Z
image: "/sites/quickarchviz-pl/AI-Prompt-Dla-Architektow.png"
categories: ["AI w architekturze", "Prawo budowlane"]
tags: ["AI dla architektów", "MPZP", "Prawo budowlane", "NotebookLM", "RAG", "Custom Agent"]
draft: false
---

Wiele osób nadal traktuje AI jak inteligentną wyszukiwarkę, której można po prostu zadać pytanie o MPZP, Warunki Techniczne albo prawo budowlane i otrzymać poprawną odpowiedź. Problem w tym, że modele AI nie rozumieją przepisów tak jak architekt. Jeśli nie pracują na właściwych dokumentach i dobrze przygotowanym kontekście, potrafią generować odpowiedzi brzmiące bardzo pewnie — nawet wtedy, gdy są błędne.

AI może być jednak ogromnym wsparciem w analizie dokumentacji, interpretacji przepisów i organizacji wiedzy projektowej. W tym artykule pokażę, jak zbudować praktyczny workflow AI do analizy MPZP i prawa budowlanego z wykorzystaniem RAG, Google NotebookLM oraz własnego Custom Agenta AI.

## AI to silnik prawdopodobieństwa, a nie baza danych

Najważniejsza zasada brzmi prosto: AI nie „zna” prawa. AI przewiduje najbardziej prawdopodobne następne słowo na podstawie danych treningowych oraz kontekstu, który otrzymało w zapytaniu.

To oznacza, że model może brzmieć bardzo pewnie, nawet gdy nie ma wystarczającej podstawy prawnej do odpowiedzi.

### Ryzyko: halucynacje regulacyjne

Jeśli nie podasz źródła, AI wypełni luki „średnią” wiedzą z internetu. Często będzie to wiedza oparta na treściach anglojęzycznych, standardach amerykańskich albo nieaktualnych opracowaniach.

W praktyce może to prowadzić do tzw. halucynacji regulacyjnych, czyli sytuacji, w której model:

* podaje nieistniejący wymóg,
* miesza przepisy z różnych jurysdykcji,
* ignoruje lokalny MPZP,
* powołuje się na ogólne zasady zamiast na konkretny artykuł lub paragraf,
* albo tworzy odpowiedź, która brzmi profesjonalnie, ale nie nadaje się do użycia w dokumentacji.

Dla architekta to nie jest drobny błąd. Taka odpowiedź może oznaczać odrzucenie projektu, błędne założenia projektowe albo konieczność kosztownych korekt.

## Rozwiązanie: RAG i source injection

Kluczem do większej niezawodności jest RAG, czyli Retrieval-Augmented Generation.

Zamiast pytać AI o to, co „wie”, przekazujemy mu konkretną bazę dokumentów, na której ma operować. Można myśleć o tym jak o source injection: wstrzyknięciu źródeł do procesu analizy.

W profesjonalnym workflow AI nie powinno zgadywać. Powinno:

* czytać wskazane dokumenty,
* wyszukiwać odpowiednie fragmenty,
* cytować źródła,
* oddzielać dane znalezione od danych nieznalezionych,
* oraz jasno pokazywać ryzyka interpretacyjne.

## Dwie ścieżki profesjonalnego workflow AI

W pracy architektonicznej najlepiej sprawdzają się dwa podejścia: Custom Agent oraz Google NotebookLM. Nie konkurują ze sobą. Rozwiązują różne problemy.

### Ścieżka 1: Custom Agent jako stały strażnik standardów

Custom Agent sprawdza się najlepiej wtedy, gdy chcesz mieć stały dostęp do norm biurowych i ogólnokrajowych przepisów.

To dobre rozwiązanie dla:

* Prawa budowlanego,
* Warunków Technicznych,
* standardów pracowni,
* powtarzalnych checklist projektowych,
* wewnętrznych procedur jakości,
* oraz cyklicznej weryfikacji dokumentacji.

Taki agent może działać jak stały strażnik standardów. Nie analizuje jednego projektu od zera, tylko pomaga zespołowi trzymać się tych samych reguł przy kolejnych tematach.

### Od czego zacząć?

Najpierw przygotuj aktualne pliki źródłowe: tekst jednolity Prawa budowlanego, Warunki Techniczne, wybrane normy, procedury biura oraz checklisty projektowe.

Następnie wgraj je do sekcji wiedzy w narzędziu, którego używasz, np. Custom GPT albo Gemini Gem.

Najważniejsze jest to, żeby agent miał jasne zasady pracy. Nie może odpowiadać „z głowy”.

## Master prompt: tryb compliance

Poniższy prompt możesz potraktować jako bazę dla asystenta AI do analizy zgodności. Dostosuj go do własnej pracowni, rodzaju projektów i aktualnych dokumentów.

> **[ROLA]**  
> Jesteś ekspertem ds. zgodności budowlanej. Twoim zadaniem jest chłodna analiza techniczna.
>
> **[KONTEKST]**  
> Analizuj wyłącznie na podstawie wgranych plików: MPZP, Warunków Technicznych, Prawa budowlanego oraz dokumentów projektowych. Nie używaj wiedzy ogólnej, jeśli nie znajduje potwierdzenia w przesłanych materiałach.
>
> **[ZASADY]**  
> Brak danych oznacza odpowiedź: „Nie znaleziono podstawy prawnej w przesłanych dokumentach”.  
> Każdy wniosek musi być poparty numerem artykułu, paragrafu, ustępu albo punktem dokumentu.  
> Priorytetyzuj hierarchię aktów prawnych: ustawa, rozporządzenie, MPZP, dokumenty projektowe.  
> Jeśli wymogu nie ma w przesłanych plikach, odpowiedz: „Brak danych w lokalnej bazie”. Nigdy nie zgaduj.
>
> **[FORMAT ODPOWIEDZI]**  
> Podstawa prawna: cytat i numer przepisu.  
> Analiza techniczna: zastosowanie do projektu.  
> Ryzyka: miejsca, w których projekt może zostać zakwestionowany.  
> Checklist: elementy, które architekt musi sprawdzić przed dalszą pracą.

Ten prompt nie zastępuje odpowiedzialności projektanta. Jego zadaniem jest ograniczyć chaos, uporządkować analizę i wymusić pracę na źródłach.

## Ścieżka 2: Google NotebookLM jako projektowy sejf

Google NotebookLM sprawdza się najlepiej przy głębokiej analizie konkretnego projektu.

To dobre narzędzie, gdy pracujesz na zestawie dokumentów dla jednej działki, inwestycji albo etapu projektowego.

Możesz wrzucić do niego:

* MPZP dla danej działki,
* decyzję WZ,
* Warunki Techniczne,
* Prawo budowlane,
* mapę do celów projektowych,
* wypis z rejestru zabytków,
* wytyczne konserwatorskie,
* PFU,
* warunki przyłączeniowe,
* albo dokumentację projektową.

### Jak wdrożyć NotebookLM w projekcie?

Najprostszy workflow wygląda tak:

1. Stwórz notatnik projektowy i nazwij go numerem zlecenia albo nazwą inwestycji.
2. Wgraj wyłącznie dokumenty, które dotyczą danego projektu.
3. Zadawaj pytania w kontekście konkretnej działki, typu budynku i etapu projektu.
4. Weryfikuj odpowiedzi przez źródła wskazane przez NotebookLM.
5. Przenoś sprawdzone wnioski do checklisty projektowej.

Największa przewaga NotebookLM polega na tym, że odpowiedź jest powiązana ze źródłem. Po zadaniu pytania, np. „Jaka jest dopuszczalna wysokość budynku dla tej działki?”, narzędzie może wskazać fragment dokumentu, na którym opiera odpowiedź.

W 2026 roku profesjonalna zasada brzmi: nie ufamy, tylko weryfikujemy.

## Custom Agent czy NotebookLM: które narzędzie wybrać?

| Cecha | Custom Agent | NotebookLM |
|---|---|---|
| Główne zastosowanie | Ogólne standardy pracowni | Analiza konkretnej działki i projektu |
| Najlepszy kontekst | Prawo budowlane, WT, procedury biura | MPZP, WZ, PFU, wytyczne konserwatorskie, dokumentacja projektu |
| Częstotliwość zmian | Raz na kwartał lub przy aktualizacji przepisów | Dynamicznie, bo nowy projekt oznacza nowe dane |
| Precyzja źródeł | Odniesienia tekstowe do wgranej bazy wiedzy | Interaktywne wskazania fragmentów dokumentu |
| Prywatność danych | Wysoka w wersjach firmowych lub enterprise | Bardzo dobra przy izolacji notatników projektowych |
| Typ pracy | Stałe wsparcie standardów biura | Projektowy research i analiza źródeł |

Najlepszy model pracy to połączenie obu ścieżek. Custom Agent pilnuje standardów biura, a NotebookLM analizuje dokumenty konkretnego projektu.

## AI GEO-context: lokalizacja ma znaczenie

Prompt bez lokalizacji to jeden z najczęstszych błędów w pracy z AI.

Słaby prompt:

> Jakie są wymogi dla schodów?

Lepszy prompt:

> Na podstawie polskich Warunków Technicznych oraz przesłanych dokumentów, jakie są wymagania dla schodów w budynku wielorodzinnym w Polsce?

Jeszcze lepszy prompt uwzględnia:

* kraj,
* typ budynku,
* kategorię zagrożenia ludzi,
* rok lub wersję przepisów,
* dokument źródłowy,
* oraz oczekiwany format odpowiedzi.

W architekturze lokalizacja nie jest detalem. To warunek poprawnej interpretacji.

## Plan działania dla pracowni architektonicznej

Jeśli chcesz zacząć budować asystenta AI do analizy MPZP i prawa budowlanego, zacznij od prostego systemu.

### Krok 1: Zbuduj bibliotekę PDF

Zbierz aktualne dokumenty w jednym miejscu:

* Prawo budowlane,
* Warunki Techniczne,
* najczęściej używane MPZP,
* procedury biura,
* checklisty projektowe,
* standardy opisów technicznych.

### Krok 2: Wybierz system pracy

Używaj NotebookLM dla nowych tematów, działek i inwestycji.

Używaj Custom Agenta dla stałych standardów biura, powtarzalnych procedur i kontroli jakości.

### Krok 3: Stosuj ustrukturyzowane prompty

Zapomnij o pytaniach typu „zaprojektuj mi” albo „sprawdź przepisy”.

Zamiast tego pisz:

> Analizuj wyłącznie na podstawie przesłanych dokumentów. Jeśli nie znajdziesz podstawy prawnej, napisz „brak danych w lokalnej bazie”. Podaj źródło, cytat i ryzyko projektowe.

### Krok 4: Weryfikuj każdą odpowiedź

AI może przyspieszyć analizę, ale nie przejmuje odpowiedzialności zawodowej. Każdy wniosek prawny, techniczny i projektowy powinien być możliwy do sprawdzenia w dokumencie źródłowym.

## Podsumowanie: AI jako asystent do analizy przepisów

W 2026 roku AI nie zastępuje architekta. Pomaga natomiast szybciej analizować dokumenty, tworzyć checklisty, porównywać przepisy i porządkować wiedzę projektową.

Największa zmiana polega na tym, że profesjonalne biura nie „czatują” już z AI w ciemno. Budują systemy, które pracują na źródłach i pomagają audytować projekt.

Jeśli chcesz używać AI bezpiecznie w architekturze, trzymaj się trzech zasad:

* nie pytaj modelu o ogólną opinię, tylko każ mu analizować konkretne dokumenty,
* nie akceptuj odpowiedzi bez źródła,
* nie używaj AI jako wyroczni, tylko jako asystenta analitycznego.

Prawdziwa wartość AI w architekturze nie polega na tym, że model odpowie szybko. Polega na tym, że może pomóc zespołowi szybciej dotrzeć do właściwego fragmentu dokumentacji, lepiej uporządkować ryzyka i podejmować decyzje na podstawie sprawdzalnych źródeł.
