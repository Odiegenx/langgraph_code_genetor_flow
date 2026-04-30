# ADR-001: Toolchain Choice

## Status

Accepted

## Titel

Valg af LangGraph som anbefalet workflow-motor og CrewAI som sammenligningskandidat

## Kontext

Opgaven kræver en evaluering af mindst to open source candidate approaches til en lokal multi-LLM coding workflow.

Workflowet skal kunne understoette:

- arkitekturarbejde
- planlaegning
- implementering
- test og kvalitet
- dokumentation
- deployment validation

Derudover stiller opgaven krav om:

- mindst to lokale model-endpoints
- konfigurerbar routing
- reproducerbarhed
- predictability og control
- forklaring af context management

I dette repo er de to kandidater:

- CrewAI
- LangGraph

## Problem

Der skal vælges en anbefalet løsning, som bedst kan bære resten af afleveringen.

Valget skal ikke kun baseres på, hvad der er hurtigst at få i gang, men på hvad der bedst matcher opgavens samlede krav.

## Beslutning

Vi vælger:

- **LangGraph** som den anbefalede workflow-motor til den endelige løsning

Vi beholder:

- **CrewAI** som sammenligningskandidat i evalueringen

## Begrundelse

### Hvorfor LangGraph vælges

LangGraph vælges, fordi det giver bedre kontrol over:

- state
- transitions
- iterationer
- review-loops
- failure handling
- artifact handoff

Det gør LangGraph mere egnet til en opgave, hvor workflowet ikke kun skal generere kode, men også skal være:

- forklarligt
- reproducerbart
- skalerbart
- konfigurerbart

### Hvorfor CrewAI ikke vælges som primær løsning

CrewAI er godt til hurtig opsætning af rollebaserede agentflows, men er mindre stærkt i den formelle workflow-kontrol som denne opgave kræver.

CrewAI er saerligt attraktivt til:

- hurtig proof of concept
- simpel rollebaseret demo
- letlæselig agent/task struktur

Men i denne opgave vægter følgende højere:

- eksplicit state management
- tydelig routing
- dokumenterbar context handoff
- bedre understoettelse af iterative og kontrollerede flows

Derfor vælges CrewAI ikke som den anbefalede endelige løsning.

## Overvejede alternativer

### Alternativ 1: CrewAI som primær løsning

#### Fordele

- enkel opsætning
- hurtig første demo
- let at forstaa og praesentere

#### Ulemper

- mindre eksplicit state model
- mindre tydelig transition-kontrol
- mere custom glue kræves for at gøre løsningen afleveringsstærk

### Alternativ 2: LangGraph som primær løsning

#### Fordele

- staerk kontrol over workflowets struktur
- bedre egnet til rollebaseret artifact pipeline
- lettere at forklare predictability og context management
- bedre match til krav om failure handling og iteration

#### Ulemper

- højere kompleksitet
- længere tid til første robuste run

## Konsekvenser

### Positive konsekvenser

1. workflowets state og handoffs bliver tydeligere
2. det bliver lettere at forklare hvorfor løsningen er reproducerbar
3. det bliver lettere at beskrive hvordan to endpoints bruges via konfiguration
4. det bliver lettere at udvide workflowet med flere noder og artefakter

### Negative konsekvenser

1. implementeringen bliver mere kompleks
2. der skal bruges mere tid på at designe state og flow
3. setup og kode bliver mindre "plug and play"

## Hvordan beslutningen påvirker resten af repoet

Denne beslutning betyder, at:

- LangGraph bliver grundlaget for den endelige workflow-arkitektur
- CrewAI bruges i den sammenlignende vurdering, men ikke som anbefalet slutløsning
- de næste artefakter og demo-projektet designes omkring LangGraph

## Sammenhaeng med de to lokale endpoints

LangGraph gør det lettere at binde specifikke roller til specifikke endpoints.

Eksempel:

- Architect, Reviewer og Docs på endpoint A
- Workers, QA og Deployment Validator på endpoint B

Dette gør multi-endpoint kravet lettere at demonstrere og dokumentere.

## Sammenhaeng med context management

LangGraph passer bedre til en artifact-baseret workflow-model, hvor:

- state er eksplicit
- hver node skriver konkrete outputartefakter
- næste node læser summaries og relevante filer

Det reducerer risikoen for silent context loss.

## Sammenhaeng med predictability and control

LangGraph gør det lettere at definere:

- fast rækkefølge af trin
- betingede transitions
- stop- og reviewpunkter
- iterationer med klare regler

Det gør løsningen mere troværdig i forhold til opgavens ikke-funktionelle krav.

## Sammenhaeng med demo-scope

Beslutningen understøtter den valgte demo:

- Java Maven task tracker CLI

Denne type lille, flerfils-applikation passer godt til et LangGraph-baseret workflow, hvor roller arbejder på adskilte artefakter og filer.

## Evidensgrundlag

Beslutningen er baseret på:

- `delivery_docs/01_toolchain_comparison.md`
- `delivery_docs/02_workflow_architecture.md`
- `delivery_docs/05_requirement_mapping.md`
- `delivery_docs/06_demo_scope.md`

## Revisionspolitik

Denne beslutning kan revideres hvis:

- LangGraph viser sig ikke at kunne håndtere den nødvendige lokale multi-endpoint konfiguration
- implementeringskompleksiteten bliver uforholdsmæssigt høj
- en anden løsning viser sig klart bedre mod opgavekravene

Indtil videre er beslutningen:

- gældende

## Definition of done

Dette ADR-krav anses for dækket når:

- dette dokument findes
- sammenligningsrapporten understøtter beslutningen
- den videre løsning faktisk designes omkring LangGraph

## Afleveringsstatus

ADR-beslutningen er dækket af dette dokument, toolchain-sammenligningen og den implementerede LangGraph workflow-løsning.


