# Gap-analyse for Mandatory Assignment

## Konklusion

Den nuværende løsning er **ikke afleveringsklar** i forhold til kravene i `assignment specs.txt`.

Repoet indeholder to tekniske demoer:

- `crewai_pipeline.py`
- `langgraph_pipeline.py`

Begge demonstrerer en lille agent/pipeline, der genererer et Snake-spil i én HTML-fil. Det er nyttigt som prototype, men det opfylder kun en lille del af opgaven. Opgaven kræver en **evaluering af en lokal multi-LLM coding workflow-løsning**, ikke kun en demo der genererer frontend-kode.

## Hvad der findes allerede

- To kandidatværktøjer er repræsenteret i kode:
  - CrewAI
  - LangGraph
- Der er konfigurerbare endpoints i `.env`
- Der genereres outputfiler i `results/`
- Der findes en simpel plan -> kode -> review-struktur

Det betyder, at fundamentet til en sammenligning er startet, men der mangler næsten alle artefakter, dokumentation og evalueringsdele som opgaven kræver.

## Kravvurdering

### 1. Objective: evaluér mindst to kandidater og anbefal én

**Status:** Delvist opfyldt

Der findes to kandidater i form af kode, men der findes ikke:

- en reel sammenlignende evaluering
- en anbefaling med begrundelse
- en samlet argumentation mod kravene

**Mangler for at lukke kravet:**

- skriv en sammenligningsrapport mellem CrewAI og LangGraph
- vurder setup-kompleksitet, capability coverage, multi-endpoint support og failure modes
- vælg én anbefalet løsning og begrund valget

### 2. Hard requirement: mindst 2 separate lokale model-endpoints

**Status:** Delvist opfyldt teknisk, ikke opfyldt som workflow-krav

`.env` viser:

- `CREWAI_ENDPOINT=http://localhost:11434`
- `LANGGRAPH_ENDPOINT=http://localhost:11435`

Det viser to endpoints, men de bruges i to separate scripts. Opgaven kræver en løsning, hvor workflowet kan bruge mindst to lokale endpoints og skifte/rute via konfiguration.

**Mangler for at lukke kravet:**

- definér én samlet workflow-arkitektur hvor roller kan bindes til forskellige endpoints
- dokumentér hvordan routing/switching sker via config
- vis at forskellige roller kan bruge forskellige modeller/endpoints

### 3. Open source tooling

**Status:** Sandsynligvis opfyldt

CrewAI, LangGraph, LangChain/Ollama-baserede komponenter er open source-værktøjer.

**Mangler for at lukke kravet ordentligt:**

- skriv det eksplicit i sammenligningen
- nævn hvilke open source-komponenter der indgår

### 4. Architecture responsibility

**Status:** Ikke opfyldt

Der findes ingen arkitekturartefakter såsom:

- komponentdiagram / component decomposition
- interface contracts
- deployment topology
- ADRs

**Mangler for at lukke kravet:**

- lav et arkitekturdokument
- lav mindst én interface-kontrakt, fx et simpelt API-kontraktformat eller workflow artifact contract
- lav mindst 1-2 ADRs
- beskriv deployment-topologi og constraints

### 5. Tech lead responsibility

**Status:** Ikke opfyldt

Der findes en simpel plan, men ikke rigtige tasks/tickets med:

- scope boundaries
- acceptance criteria / definition of done
- dependency ordering

**Mangler for at lukke kravet:**

- lav en ticket backlog
- giv hver ticket scope, acceptance criteria og dependencies

### 6. Implementation responsibility

**Status:** Ikke opfyldt

Opgaven kræver flere coding workers (`N >= 2`) eller en troværdig paralleliserbar struktur, samt multi-file ændringer i et repository.

Nuværende løsning:

- CrewAI kører sekventielt
- LangGraph har én coder-node
- output er i praksis én HTML-fil

**Mangler for at lukke kravet:**

- design workflow med mindst to implementeringsworkers eller tilsvarende partitionering
- lad workflowet producere ændringer i flere filer
- brug et rigtigt mini-repo eller demo-projekt med flere filer

### 7. Testing & quality responsibility

**Status:** Ikke opfyldt

Der udføres kun LLM-baseret review. Der oprettes og køres ikke rigtige tests.

Opgaven kræver:

- tests oprettet
- tests kørt
- quality report med resultater
- static checks hvis relevant
- kendte risici/begrænsninger

**Mangler for at lukke kravet:**

- vælg et demo-projekt hvor tests kan køres
- opret unit/integration tests
- kør tests og gem output
- tilføj lint/type checks hvis relevant
- skriv en quality report

### 8. Documentation responsibility

**Status:** Ikke opfyldt

Der mangler:

- `README.md`
- setup/run guide
- API usage eller tilsvarende artifact usage
- operational/runbook notes
- design documents

**Mangler for at lukke kravet:**

- skriv README
- skriv setup guide
- skriv runbook/driftsnoter
- skriv design doc

### 9. Deployment validation responsibility

**Status:** Ikke opfyldt

Der findes ikke:

- deployment checklist
- deployment script
- container config
- miljø-/konfigurationsdokumentation ud over få env-linjer

**Mangler for at lukke kravet:**

- lav mindst én deployment-valideringsmekanisme
- skriv miljøvariabler og driftsforudsætninger
- overvej Dockerfile eller simpel deployment checklist

### 10. Predictability & control

**Status:** Ikke dokumenteret

Opgaven kræver kontrolmekanisme som fx:

- ask-before-run / ask-before-edit
- plan + diffs før eksekvering

Nuværende repo beskriver ikke, hvordan workflowet kontrollerer filændringer eller kommandoeksekvering.

**Mangler for at lukke kravet:**

- vælg en kontrolmodel
- dokumentér den i anbefalingen og setup-guiden

### 11. Reproducibility

**Status:** Ikke opfyldt

Der mangler:

- git-baseret workflowbeskrivelse
- reviewable diffs eller commits
- reproducerbar kørevejledning

**Mangler for at lukke kravet:**

- beskriv git-flow
- vis hvilke outputs der forventes
- skriv trin-for-trin reproduktion

### 12. Context management

**Status:** Ikke opfyldt

Opgaven kræver forklaring af:

- hvordan silent context loss undgås
- hvordan artefakter overdrages
- hvordan workflowet skalerer når repo og docs vokser

Det er ikke dokumenteret i nuværende materiale.

**Mangler for at lukke kravet:**

- beskriv artifact handoff
- beskriv summaries/scoping
- beskriv strategi for større repos

### 13. Security baseline

**Status:** Ikke dokumenteret

Der er intet i repoet, der forklarer hvordan lokale endpoints holdes private eller ikke eksponeres offentligt.

**Mangler for at lukke kravet:**

- dokumentér at endpoints kun bruges lokalt
- beskriv netværksforudsætninger og sikkerhedsgrænser

### 14. Evaluation requirements

**Status:** Ikke opfyldt

Der mangler en egentlig evaluering af hver kandidat på:

- setup complexity
- time to first working run
- moving parts
- capability coverage
- multi-endpoint support
- failure modes
- recommendation

**Mangler for at lukke kravet:**

- skriv en systematisk sammenligningstabel
- skriv en kort begrundet anbefaling

### 15. Required deliverables

**Status:** Ikke opfyldt

Der mangler:

- præsentation på 6-12 slides
- kort men komplet setup guide
- dokumenteret demo-run der producerer:
  - architecture output
  - implementeret feature
  - tests kørt + resultater
  - docs opdateret
  - deployment validation

## Samlet status

### Allerede brugbart

- To kandidater er identificeret
- Lokal endpoint-konfiguration er påbegyndt
- Der er lavet tekniske prototyper

### Kritiske mangler

- Ingen egentlig evaluering
- Ingen anbefaling
- Ingen arkitekturartefakter
- Ingen rigtige tickets
- Ingen parallel implementering
- Ingen testeksekvering
- Ingen dokumentation
- Ingen deployment validation
- Ingen slides
- Ingen setup guide

## Anbefalet rækkefølge for at få opgaven løst

### Fase 1: Fastlæg løsning og demo-scope

1. Vælg hvilket toolchain der skal anbefales som den endelige løsning
2. Vælg et lille men realistisk demo-projekt med flere filer
3. Definér hvilke roller workflowet skal have
4. Definér hvordan to endpoints bruges i samme workflow

### Fase 2: Lav de manglende artefakter

1. Skriv sammenligning mellem CrewAI og LangGraph
2. Skriv anbefaling
3. Lav arkitekturdokument
4. Lav ticket backlog
5. Lav README og setup guide

### Fase 3: Gør demoen opgave-kompatibel

1. Udvid workflow så flere filer produceres
2. Indfør mindst to coding workers eller troværdig arbejdsdeling
3. Opret og kør tests
4. Lav quality report
5. Lav deployment validation

### Fase 4: Afleveringsmateriale

1. Skriv slides
2. Saml reproduktionsguide
3. Saml evidens fra kørsel

## Min anbefaling til næste konkrete skridt

Det rigtige næste skridt er **ikke** at forbedre Snake-koden først.

Det rigtige næste skridt er at beslutte:

- hvilket toolchain der skal anbefales
- hvilket demo-projekt workflowet skal køre på
- hvilke artefakter vi vil producere for at dække kravene

Hvis vi gør det rigtigt, kan resten bygges målrettet. Hvis vi fortsætter med Snake-demoen uden at ændre scope, risikerer vi at bruge tid på noget, der stadig ikke kan afleveres.

## Forslag til arbejdspakke vi kan tage én ad gangen

1. Lav en sammenligningsrapport mellem CrewAI og LangGraph
2. Vælg anbefalet løsning
3. Design den endelige workflow-arkitektur
4. Vælg demo-repo/projekt med flere filer
5. Skriv README + setup guide
6. Udvid workflow til rigtige artefakter
7. Tilføj tests og quality report
8. Tilføj deployment validation
9. Lav slides

## Beslutning jeg vil anbefale lige nu

Hvis målet er at komme hurtigt i mål med en troværdig aflevering, er den mest sandsynlige vej:

- brug `LangGraph` som anbefalet workflow-motor
- behold `CrewAI` som sammenligningskandidat
- skift demoen væk fra "snake i én fil" til et lille repo med flere filer
- fokuser på dokumenteret workflow og artefakter fremfor flashy kodegenerering

Det vil være mere i tråd med opgavens krav og lettere at argumentere for i præsentationen.
