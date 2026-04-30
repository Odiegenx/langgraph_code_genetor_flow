# Deployment Topology and Constraints

## Formål

Dette dokument beskriver den anbefalede deployment-topologi for den lokale multi-LLM workflow-løsning.

Formålet er at gøre følgende tydeligt:

- hvilke komponenter der kører hvor
- hvordan workflowet forbinder til to lokale model-endpoints
- hvilke runtime-forudsætninger der gælder
- hvilke begrænsninger og sikkerhedshensyn der er relevante

## Scope

Denne topologi beskriver en:

- **lokal udviklings- og evalueringsopsætning**

Det er vigtigt, fordi opgaven ikke kræver produktion i cloud. Den kræver en troværdig lokal løsning, der kan evaluere og demonstrere en multi-LLM coding workflow.

## Overordnet topologi

Løsningen består af fem hoveddele:

1. brugerens lokale maskine
2. workflow-runneren
3. model-endpoint A
4. model-endpoint B
5. demo-projektets filer og outputartefakter

## Topologi i tekstform

```text
[User / Terminal]
        |
        v
[Python Workflow Runner: LangGraph]
        |------------------------------|
        |                              |
        v                              v
[Local LLM Endpoint A]         [Local LLM Endpoint B]
        |                              |
        |------------------------------|
                       |
                       v
            [Repo Files / Artifacts / Results]
```

## Komponenter

### 1. User / Terminal

Brugeren starter workflowet fra en lokal terminal.

Ansvar:

- aktivere virtuelt miljø
- konfigurere miljøvariabler
- starte workflowet
- gennemgå genererede artefakter

### 2. Workflow Runner

Workflow-runneren er den Python-proces der orkestrerer workflowet.

Anbefalet teknologi:

- LangGraph

Ansvar:

- holde state
- rute arbejde mellem roller
- kalde model-endpoints
- skrive artefakter til repoet
- samle output og logs

### 3. Local LLM Endpoint A

Dette endpoint bruges til roller der primært arbejder med planlægning og struktur.

Typiske roller:

- Architect
- Tech Lead
- Reviewer
- Docs

### 4. Local LLM Endpoint B

Dette endpoint bruges til roller der primært arbejder med implementering og validering.

Typiske roller:

- Worker A
- Worker B
- QA / Test
- Deployment Validator

### 5. Repo Files / Artifacts / Results

Repoet fungerer som både arbejdsområde og artifact-store.

Det omfatter fx:

- `docs/`
- `delivery_docs/`
- `results/`
- `demo_project/`

## Hvorfor to endpoints bruges

To endpoints er ikke kun et teknisk krav. Det gør også arkitekturen mere troværdig som multi-LLM workflow.

Fordele:

- roller kan bindes til forskellige endpoints via config
- planlægningsroller og implementeringsroller kan isoleres
- workflowet kan demonstrere routing fremfor manuel kodeændring

## Anbefalet endpoint-routing

### Endpoint A

Anbefalet ansvar:

- architect
- tech lead
- reviewer
- docs

### Endpoint B

Anbefalet ansvar:

- worker A
- worker B
- QA
- deployment validator

### Konfigurationsprincip

Roller må ikke være hårdkodet til endpoints i selve flow-logikken, hvis det kan undgås.

Routing bør ske via miljøvariabler eller central konfiguration.

## Eksempel på konfiguration

```env
PLANNER_ENDPOINT=http://localhost:11434
CODER_ENDPOINT=http://localhost:11435
REVIEWER_ENDPOINT=http://localhost:11434
QA_ENDPOINT=http://localhost:11435
DOCS_ENDPOINT=http://localhost:11434
DEPLOY_ENDPOINT=http://localhost:11435
```

Dette gør det muligt at ændre routing uden manuel rewiring af workflowets overordnede design.

## Filsystemstopologi

Løsningen antager et lokalt workspace med en struktur nogenlunde som denne:

```text
repo-root/
  delivery_docs/
  docs/
  results/
  demo_project/
  crewai_pipeline.py
  langgraph_pipeline.py
  .env
```

### Ansvarsfordeling i filsystemet

- `delivery_docs/` indeholder analyse- og afleveringsforberedende dokumenter
- `docs/` indeholder de egentlige projektartefakter
- `results/` indeholder køreresultater og logs
- `demo_project/` indeholder det kodeprojekt workflowet arbejder på

## Runtime-flow

Det forventede runtime-flow er:

1. brugeren starter workflowet lokalt
2. workflow-runneren læser konfiguration fra `.env`
3. workflow-runneren opretter klienter til endpoint A og B
4. hver rolle kalder det endpoint der er tildelt dens ansvar
5. artefakter skrives til repoet
6. review-trin vurderer om workflowet er færdigt eller skal iterere

## Deployment constraints

Der er flere bevidste begrænsninger i denne løsning.

### 1. Lokal-only antagelse

Løsningen er designet til lokal brug eller privat netværk.

Det er en bevidst constraint, fordi:

- opgaven kræver ikke offentlig deployment
- sikkerhedsbaseline bliver lettere at opfylde
- opsætningen bliver mere reproducerbar

### 2. Ingen offentlig eksponering af model-endpoints

Model-endpoints må ikke kræve offentlig, uautentificeret eksponering.

Det betyder:

- endpoints bør køre på `localhost` eller privat netværk
- de bør ikke være åbne på internettet uden beskyttelse

### 3. Simpelt demo-projekt

Demo-projektet er bevidst lille.

Det betyder:

- ingen database
- ingen cloud services
- ingen distribueret deployment

Denne begrænsning er acceptabel, fordi fokus er på workflow-evaluering.

### 4. Lokal fil-persistence

Task tracker-demoen bruger lokal persistence.

Det reducerer:

- setup-kompleksitet
- eksterne afhængigheder
- fejlflader

## Deployment validation muligheder

Selv om løsningen er lokal, skal deployability stadig valideres.

Det kan gøres på mindst én af disse måder:

- deployment checklist
- deployment script
- container config
- environment/config documentation

### Anbefalet minimum

Den mest realistiske løsning for denne aflevering er:

- `docs/deployment_checklist.md`
- miljøvariabler dokumenteret i README

### Mulig udvidelse

Hvis der er tid, kan man tilføje:

- `Dockerfile`

Det er dog ikke nødvendigt for at gøre afleveringen troværdig.

## Driftsforudsætninger

For at løsningen kan køre, gælder mindst disse forudsætninger:

- Python er installeret
- nødvendige Python-pakker er installeret
- to lokale model-endpoints er tilgængelige
- modellen/modellerne findes lokalt
- repoet er tilgængeligt på lokal disk

## Skaleringshensyn

Når projektet vokser, må workflowet ikke sende hele repoet til alle roller ukritisk.

### Anbefalet strategi

- architect læser docs og overordnet struktur
- workers får kun relevante filer og tickets
- QA læser ændrede filer og testoutput
- reviewer læser summaries og nøgleartefakter

Dette er vigtigt både for:

- context management
- performance
- forudsigelighed

## Failure points i topologien

De vigtigste driftsmæssige fejlsteder er:

1. endpoint A svarer ikke
2. endpoint B svarer ikke
3. forkert modelnavn eller forkert port
4. workflow-runner kan ikke skrive artefakter
5. demo-projektet er i inkonsistent tilstand

## Hvordan fejl opdages

- forbindelsesfejl til endpoint
- tomme eller manglende outputs
- mislykkede tests
- manglende artefakter i forventede mapper

## Hvordan fejl håndteres

- verificér `.env`
- verificér at endpoint-processerne kører
- verificér at outputmapper findes og er skrivbare
- kør workflowet igen efter rettelse
- lad reviewer eller QA markere run som ikke-godkendt

## Hvorfor denne topologi matcher opgaven

Denne topologi matcher kravene, fordi den:

- bruger mindst to lokale model-endpoints
- gør routing konfigurerbar
- bruger open source tooling
- understøtter artifact-baseret workflow
- holder sikkerhedsmodellen lokal
- er enkel nok til at være reproducerbar

## Afleveringsstatus

Deployment topology-delen er dækket af dette dokument, setup-guiden, `.env`-konfigurationen og de genererede deployment checklists i `results/runs/<RUN_ID>/docs/deployment_checklist.md`.
