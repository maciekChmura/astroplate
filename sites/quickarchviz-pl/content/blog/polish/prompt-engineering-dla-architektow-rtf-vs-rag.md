---
title: "Prompt engineering dla architektów: framework RTF vs RAG w praktyce"
description: "Zobacz, jak architekci mogą łączyć framework RTF, RAG i Google NotebookLM, aby tworzyć lepsze prompty, ograniczać halucynacje AI i analizować dokumentację projektową."
date: 2026-05-11T10:00:00Z
image: "/sites/quickarchviz/images/NotebookLM-for-Architects.webp"
categories: ["AI w architekturze", "Prompt engineering"]
tags: ["Prompt engineering", "RTF", "RAG", "NotebookLM", "AI dla architektów"]
draft: false
---

W 2026 roku podstawą profesjonalnej pracy z AI nie jest już samo „zadawanie pytań”. Kluczową umiejętnością staje się prompt engineering, czyli sposób budowania precyzyjnych instrukcji dla modeli AI.

> Prompt engineering to sposób projektowania i optymalizacji instrukcji dla modeli AI w celu uzyskania bardziej trafnych, precyzyjnych i użytecznych odpowiedzi.
>
> Źródło: [OpenAI Help Center](https://help.openai.com/en/articles/10032626-prompt-engineering-best-practices-for-chatgpt)

To właśnie jakość promptu najczęściej decyduje o tym, czy AI:

- wygeneruje ogólną i mało użyteczną odpowiedź,
- czy stanie się realnym wsparciem w procesie projektowym.

Dla architektów ma to szczególne znaczenie. Praca projektowa wymaga kontekstu, lokalnych przepisów, źródeł, standardów biura oraz odpowiedzialności zawodowej. Dlatego dobry prompt nie jest dodatkiem. Jest częścią profesjonalnego workflow.

## RTF vs RAG: jaka jest różnica?

RTF i RAG rozwiązują dwa różne problemy podczas pracy z AI.

RTF (Role -> Task -> Format) to framework prompt engineeringu, który pomaga lepiej „rozmawiać” z modelem AI. Określasz w nim:

- kim AI ma być,
- jakie zadanie ma wykonać,
- oraz w jakim formacie ma odpowiedzieć.

Dzięki temu AI otrzymuje jasny kontekst i generuje bardziej trafne oraz uporządkowane odpowiedzi.

RAG (Retrieval-Augmented Generation) działa inaczej. Zamiast polegać wyłącznie na wiedzy modelu, AI najpierw przeszukuje Twoje dokumenty, np. MPZP, Warunki Techniczne, PFU czy dokumentację projektową, a dopiero później generuje odpowiedź.

Najprościej mówiąc:

- RTF pomaga AI lepiej zrozumieć pytanie,
- a RAG dostarcza AI właściwe źródła wiedzy.

To właśnie połączenie dobrego promptu i pracy na własnej dokumentacji sprawia, że AI zaczyna działać jak realny asystent architekta, a nie przypadkowy chatbot z internetu.

| Cecha              | RTF (Prompt Engineering)          | RAG (Retrieval)                         |
| ------------------ | --------------------------------- | --------------------------------------- |
| Główny cel         | Styl, ton i struktura wypowiedzi. | Precyzja merytoryczna i aktualne dane.  |
| Gdzie leży zmiana? | W samym pytaniu (input).          | W bazie danych, do której AI ma dostęp. |
| Analogia           | Jak asystent ma do Ciebie mówić.  | Jakie książki asystent ma na biurku.    |

## RTF = Role -> Task -> Format

Jednym z najskuteczniejszych frameworków pracy z AI dla architektów jest RTF: Role, Task, Format.

To prosty model, który znacząco ogranicza halucynacje AI, poprawia trafność odpowiedzi oraz pozwala uzyskać bardziej profesjonalne rezultaty.

### Słaby prompt

> „Jakie są wymagania dla schodów?”

Taki prompt nie zawiera:

- kontekstu,
- rodzaju budynku,
- kraju,
- aktualnych przepisów,
- ani oczekiwanego formatu odpowiedzi.

W efekcie AI zaczyna zgadywać.

### Profesjonalny prompt oparty o framework RTF

> **[ROLE]**  
> Działaj jako ekspert ds. polskiego prawa budowlanego i rzeczoznawca ppoż.
>
> **[TASK]**  
> Na podstawie Warunków Technicznych (stan na 2026 rok) podaj wymagania dla schodów ewakuacyjnych w budynku biurowym ZL III powyżej 12 m.
>
> **[FORMAT]**  
> Przygotuj odpowiedź w formie tabeli zawierającej:
>
> - szerokość schodów,
> - wysokość stopnia,
> - wymagane materiały,
> - odporność ogniową,
> - wymagania ewakuacyjne.

Więcej przykładów znajdziesz w sekcji promptów: [quickarchviz.com/pl/prompts](https://quickarchviz.com/pl/prompts/).

## Dlaczego framework RTF działa?

### ROLE: zawężenie kontekstu

Rola działa jak filtr dla modelu AI. Pomaga ograniczyć halucynacje i kieruje model w stronę konkretnej specjalizacji, np. prawa budowlanego, urbanistyki czy przepisów przeciwpożarowych.

### TASK: precyzyjne zdefiniowanie problemu

Im bardziej precyzyjne zadanie, tym większa szansa na poprawną odpowiedź. Dobrze opisany task eliminuje niejednoznaczność i zmniejsza ryzyko błędnych interpretacji.

### FORMAT: uporządkowanie odpowiedzi

Określenie formatu odpowiedzi:

- oszczędza czas,
- poprawia czytelność,
- oraz wymusza bardziej uporządkowane i praktyczne rezultaty.

To właśnie tutaj pojawia się różnica między AI używanym jak ciekawostka technologiczna, a AI działającym jako profesjonalne narzędzie wspierające architekta w codziennej pracy projektowej.

Dobrze przygotowany prompt potrafi zmienić AI z generatora przypadkowych odpowiedzi w system, który realnie wspiera analizę dokumentacji, interpretację przepisów oraz organizację wiedzy projektowej całego biura.

## RAG i NotebookLM: AI pracujące na Twoich dokumentach

Sam prompt nie zawsze wystarczy. Jeśli pytasz AI o MPZP, Warunki Techniczne, PFU albo dokumentację projektową, model powinien pracować na konkretnych źródłach.

Tu pojawia się RAG, czyli Retrieval-Augmented Generation.

W standardowym modelu AI model odpowiada na podstawie swojej pamięci treningowej.

W NotebookLM model:

- najpierw analizuje Twoje dokumenty,
- wyszukuje informacje w dostarczonych materiałach,
- a dopiero później generuje odpowiedź.

Dzięki temu AI przestaje działać jak „generator odpowiedzi z internetu”, a zaczyna przypominać asystenta pracującego bezpośrednio na dokumentacji projektowej biura.

## Jakie dokumenty można wrzucić do NotebookLM?

Architekci mogą budować własne bazy wiedzy AI oparte np. na:

- MPZP,
- Warunkach Technicznych,
- PFU,
- normach budowlanych,
- ekspertyzach,
- dokumentacji projektowej,
- specyfikacjach technicznych,
- wytycznych inwestora,
- standardach biura projektowego,
- oraz wcześniejszych projektach.

Im lepiej przygotowana baza wiedzy, tym bardziej użyteczne staje się AI.

## Dlaczego NotebookLM zmniejsza ryzyko halucynacji?

NotebookLM nie opiera odpowiedzi wyłącznie na ogólnych danych treningowych czy przypadkowych informacjach z internetu.

Model pracuje przede wszystkim na Twoich dokumentach, Twoich standardach oraz Twoim kontekście projektowym. To znacząco ogranicza halucynacje i poprawia trafność odpowiedzi.

W praktyce oznacza to, że architekt może szybciej przejść od pytania do sprawdzalnego fragmentu dokumentacji. To nadal wymaga weryfikacji, ale skraca czas researchu i zmniejsza ryzyko pracy na niepewnych informacjach.

## Co AI realnie zmienia w biurach architektonicznych?

AI już dziś pozwala:

- skrócić analizę dokumentacji z kilku godzin do kilku minut,
- szybciej analizować MPZP,
- tworzyć checklisty projektowe,
- automatycznie porównywać przepisy,
- budować bazy wiedzy biura,
- wspierać juniorów,
- oraz ograniczać liczbę błędów projektowych.

Największa zmiana nie polega jednak na samej szybkości. Chodzi o to, że wiedza projektowa przestaje być rozproszona między PDF-ami, mailami, notatkami i pamięcią zespołu. Zaczyna być dostępna w bardziej uporządkowanym workflow.

## Jak łączyć RTF i RAG w praktyce?

RTF i RAG nie są alternatywami. Najlepiej działają razem.

| Podejście | Do czego służy                                    | Przykład w pracy architekta                                                                 |
| --------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| RTF       | Porządkuje instrukcję dla modelu                  | „Działaj jako ekspert prawa budowlanego, przeanalizuj wymagania i podaj odpowiedź w tabeli” |
| RAG       | Dostarcza modelowi źródła                         | MPZP, Warunki Techniczne, PFU, dokumentacja projektu                                        |
| RTF + RAG | Łączy precyzyjne polecenie z pracą na dokumentach | Analiza konkretnej działki na podstawie przesłanych dokumentów                              |

Jeśli używasz tylko promptu, AI nadal może zgadywać. Jeśli używasz tylko dokumentów bez dobrego polecenia, odpowiedź może być chaotyczna. Profesjonalny workflow łączy jedno i drugie.

## Podsumowanie: jak architekci powinni korzystać z AI w 2026 roku

Profesjonalne wykorzystanie AI w architekturze nie polega już na zadawaniu przypadkowych pytań chatbotowi. Kluczem staje się połączenie prompt engineeringu, frameworków takich jak RTF oraz systemów RAG i Google NotebookLM pracujących bezpośrednio na dokumentacji projektowej.

To właśnie kontekst decyduje dziś o jakości odpowiedzi generowanych przez AI. Dobrze przygotowany prompt oraz własna baza wiedzy pozwalają ograniczyć halucynacje AI, poprawić trafność analiz i zmienić model z prostego generatora odpowiedzi w realnego asystenta projektowego.

Nowoczesne biura architektoniczne coraz częściej wykorzystują AI do:

- analizy MPZP i Warunków Technicznych,
- interpretacji przepisów budowlanych,
- organizacji wiedzy projektowej,
- tworzenia checklist projektowych,
- oraz automatyzacji researchu i analizy dokumentacji.

AI nie zastępuje architekta. Pomaga natomiast szybciej analizować informacje, ograniczać błędy i lepiej zarządzać wiedzą całego biura projektowego.

I właśnie tutaj znajduje się prawdziwy potencjał AI w architekturze: nie w generowaniu przypadkowych odpowiedzi, ale w budowaniu inteligentnych workflow wspierających codzienną pracę projektową.
