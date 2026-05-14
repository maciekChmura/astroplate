---
title: "Jak używać AI w architekturze w 2026? Dlaczego AI „zmyśla” i jak architekci powinni naprawdę korzystać z AI"
description: "Praktyczny przewodnik po profesjonalnym wykorzystaniu AI w architekturze: prompt engineering, framework RTF, NotebookLM, RAG i bazy wiedzy projektowej."
date: 2022-04-04T05:00:00Z
image: "/sites/quickarchviz-pl/AI-for-Architects.webp"
categories: ["AI w architekturze", "Prompt engineering"]
tags: ["AI w architekturze", "AI dla architektów", "Prompt engineering", "NotebookLM", "AI assistant"]
draft: false
---

Jeśli nadal używasz AI wyłącznie do generowania efektownych elewacji lub wizualizacji w narzędziach takich jak QuickArchViz, wykorzystujesz może 5% potencjału tej technologii.

Prawdziwa rewolucja w biurach projektowych nie dzieje się dziś w renderach. Dzieje się tam, gdzie większość architektów jeszcze nie patrzy:

* w analizie dokumentacji,
* interpretacji przepisów,
* pracy z MPZP,
* analizie Warunków Technicznych,
* organizacji wiedzy projektowej,
* automatyzacji researchu,
* oraz wspomaganiu decyzji projektowych.

AI w architekturze w 2026 roku przestaje być „generatorem obrazków”. Staje się systemem operacyjnym wiedzy projektowej.

Kluczem do profesjonalnego wykorzystania AI jest prompt engineering, budowanie własnej bazy wiedzy oraz wykorzystanie narzędzi AI do analizy dokumentów, takich jak Google NotebookLM.

## Dlaczego AI „zmyśla”? Mechanika halucynacji AI

Największy błąd architektów korzystających z AI polega na traktowaniu modeli językowych jak wyszukiwarki Google. To duży błąd, ponieważ sztuczna inteligencja nie jest bazą danych.

Modele językowe (LLM, czyli Large Language Models) nie „znają” przepisów ani nie rozumieją architektury w taki sposób jak człowiek. Działają jak silniki statystyczne przewidujące najbardziej prawdopodobny kolejny wyraz, czyli token, na podstawie ogromnej ilości danych treningowych.

### Problem nr 1: AI nie rozumie przepisów

AI nie „wie”, że schody ewakuacyjne w budynku ZL III muszą mieć określoną szerokość zgodnie z polskimi Warunkami Technicznymi.

AI wie jedynie, że w milionach tekstów dotyczących schodów ewakuacyjnych po słowie „szerokość” bardzo często pojawia się liczba „120 cm”.

Model nie odróżnia więc poprawnej interpretacji przepisu od statystycznie częstej odpowiedzi. I właśnie dlatego AI może brzmieć bardzo pewnie nawet wtedy, gdy się myli.

### Problem nr 2: Brak lokalnego kontekstu

Jeśli nie określisz:

* kraju,
* rodzaju budynku,
* obowiązujących norm,
* aktualnego roku przepisów,
* oraz kontekstu projektu,

AI zaczyna korzystać z najbardziej statystycznie popularnych danych dostępnych w internecie.

A ponieważ internet jest zdominowany przez treści anglojęzyczne, model może:

* używać norm amerykańskich,
* podawać wartości w stopach i calach,
* przywoływać przepisy NFPA zamiast polskich WT,
* albo mieszać standardy europejskie i amerykańskie.

I zrobi to z pełnym przekonaniem. To właśnie nazywamy halucynacją AI.

### Problem nr 3: Brak przypisanej roli

Modele AI działają znacznie lepiej, gdy otrzymują precyzyjny kontekst działania.

Przykładowo:

> „Działaj jako ekspert polskiego prawa budowlanego specjalizujący się w analizie Warunków Technicznych.”

Taka instrukcja działa jak filtr zawężający sposób interpretacji danych przez model. Dzięki temu AI generuje bardziej trafne odpowiedzi, ogranicza halucynacje oraz lepiej dopasowuje informacje do realiów projektu.

## Brak struktury, czyli problem „chaotycznego biurka”

Modele AI mają ograniczone tzw. context window, czyli ilość informacji, które mogą analizować jednocześnie.

Jeśli prompt jest chaotyczny:

* AI może skupić się na nieistotnym fragmencie,
* pominąć ważne parametry techniczne,
* lub źle zrozumieć priorytety.

Dlatego profesjonalne prompty używają separatorów:

[ROLE]  
[TASK]  
[FORMAT]

Można też używać XML-like structure.

To działa jak uporządkowanie dokumentacji projektowej na biurku architekta.

## Prompt engineering, RAG i NotebookLM: nowy workflow AI dla architektów

Profesjonalna praca z AI nie polega już na „zadawaniu pytań”, ale na dostarczaniu modelowi odpowiedniego kontekstu i źródeł. Dlatego nowoczesny workflow AI dla architektów opiera się na dwóch elementach:

* prompt engineeringu, np. frameworku RTF (Role -> Task -> Format), który pomaga precyzyjnie określić rolę AI, zadanie i oczekiwany format odpowiedzi,
* systemach RAG i narzędziach takich jak Google NotebookLM, gdzie AI analizuje najpierw Twoje dokumenty — MPZP, Warunki Techniczne, PFU czy dokumentację projektową — a dopiero później generuje odpowiedź.

To właśnie połączenie dobrego promptu i pracy na własnej bazie wiedzy sprawia, że AI przestaje być chaotycznym chatbotem, a zaczyna działać jak realny asystent projektowy wspierający analizę dokumentacji, interpretację przepisów i organizację wiedzy biura architektonicznego.

## Jak zacząć używać AI profesjonalnie?

### Krok 1: Załóż konto w Google NotebookLM

Zacznij od utworzenia konta w Google NotebookLM.

### Krok 2: Wrzuć dokumenty projektowe

Dodaj materiały, na których AI ma pracować:

* MPZP,
* Warunki Techniczne,
* PFU,
* lub dokumentację projektu.

### Krok 3: Użyj frameworku RTF

Formułuj prompty przez Role, Task i Format, żeby model wiedział, kim ma być, co ma zrobić i jak ma odpowiedzieć.

### Krok 4: Buduj własną bazę wiedzy projektowej

Zacznij porządkować dokumenty tak, żeby AI mogło pracować na wiedzy Twojego biura, a nie tylko na ogólnych danych z internetu.

Po kilku dniach:

* nie będziesz chciał wracać do ręcznego przeszukiwania PDF-ów,
* kopiowania przepisów,
* ani chaotycznego researchu.

## Podsumowanie: AI Nie „Myśli” Jak Architekt i Właśnie Dlatego Musisz Nauczyć Się z Nim Pracować
Modele AI nie analizują projektów tak jak człowiek. Nie rozumieją prawa budowlanego, nie znają lokalnych realiów i nie odróżniają poprawnej interpretacji przepisu od statystycznie popularnej odpowiedzi. Dlatego AI potrafi brzmieć bardzo pewnie nawet wtedy, gdy się myli. To właśnie nazywamy halucynacją AI.

Ale problemem nie jest samo AI. Problemem najczęściej jest brak kontekstu, struktury, odpowiedniego promptu, oraz pracy na właściwych dokumentach.

Kiedy zaczniesz używać:
* frameworków prompt engineeringu takich jak RTF,
* własnej bazy wiedzy,
* Google NotebookLM,
* oraz dobrze przygotowanej dokumentacji projektowej,

AI przestaje być chaotycznym chatbotem i zaczyna działać jak wyspecjalizowany asystent projektowy, ktory analizuje dokumenty, pomaga interpretować przepisy, organizuje wiedzę, przyspiesza research, oraz wspiera codzienną pracę biura architektonicznego.

I właśnie tutaj zaczyna się prawdziwy potencjał AI w architekturze w 2026 roku.
