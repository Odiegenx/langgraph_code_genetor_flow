# Recommended Workflow Architecture

## Formål

Dette dokument beskriver den anbefalede workflow-arkitektur for opgaven.

Den anbefalede løsning er:

- **LangGraph** som workflow-motor
- **to lokale model-endpoints**
- et lille demo-repository med flere filer
- en artifact-baseret proces med tydelige handoffs mellem roller

Målet er at opfylde opgavens krav om en lokal multi-LLM coding workflow, der kan producere:

- arkitektur
- plan/tickets
- implementering
- tests og quality report
- dokumentation
- deployment validation

## Overordnet idé

Workflowet skal ikke bare generere kode. Det skal fungere som en kontrolleret pipeline, hvor hver rolle producerer artefakter, som sendes videre til næste rolle.

Det anbefalede design er derfor en **stateful artifact pipeline**.

Hver node i workflowet modtager:

- nuværende projektkontekst
- tidligere artefakter
- en tydelig arbejdsopgave

Hver node producerer:

- et eller flere konkrete artefakter
- en kort opsummering til næste node
- en status eller verdict, der afgør næste trin

## Arkitektur i korte træk

### Workflow-roller

De anbefalede roller er:

1. **Architect**
   - producerer arkitekturartefakter
2. **Tech Lead**
   - bryder arbejdet ned i tickets
3. **Worker A**
   - implementerer delopgave A
4. **Worker B**
   - implementerer delopgave B
5. **QA / Test**
   - opretter og kører tests samt kvalitetscheck
6. **Docs**
   - opdaterer README, runbook og design docs
7. **Deployment Validator**
   - validerer deployability
8. **Reviewer**
   - giver samlet godkendelse eller sender workflowet tilbage

## Foreslået artifacts-model

Hvert trin skal producere konkrete filer. Det reducerer risikoen for silent context loss og gør workflowet lettere at evaluere.

### Arkitektur-artefakter

- `docs/architecture.md`
- `docs/adr-001-toolchain-choice.md`
- `docs/deployment_topology.md`
- `docs/interface_contracts.md`

### Planlægnings-artefakter

- `docs/tickets.md`

### Implementerings-artefakter

- ændringer i kildefiler i demo-projektet
- mindst to separate kodeområder, så arbejde kan partitioneres

### QA-artefakter

- `docs/quality_report.md`
- test-output gemt i `results/`

### Dokumentations-artefakter

- `README.md`
- `docs/runbook.md`

### Deployment-artefakter

Mindst én af disse:

- `docs/deployment_checklist.md`
- `Dockerfile`
- `docker-compose.yml`
- `scripts/validate_deploy.ps1`

## To lokale model-endpoints

Workflowet skal bruge mindst to separate lokale endpoints via konfiguration.

### Foreslået rollefordeling

**Endpoint A**

- Architect
- Tech Lead
- Reviewer
- Docs

**Endpoint B**

- Worker A
- Worker B
- QA / Test
- Deployment Validator

### Hvorfor denne opdeling giver mening

Endpoint A kan bruges til planlægning, struktur og dokumentation.

Endpoint B kan bruges til mere operationelle roller:

- implementering
- test-analyse
- deploy-validation

Det gør det muligt at demonstrere:

- at roller kan bindes til forskellige endpoints
- at routing sker via konfiguration
- at workflowet ikke kræver manuel rewiring

## Konfigurationsmodel

Workflowet bør have tydelig rolle-til-endpoint-konfiguration.

### Eksempel på env-konfiguration

```env
PLANNER_ENDPOINT=http://localhost:11434
CODER_ENDPOINT=http://localhost:11435
REVIEWER_ENDPOINT=http://localhost:11434
QA_ENDPOINT=http://localhost:11435
DOCS_ENDPOINT=http://localhost:11434
DEPLOY_ENDPOINT=http://localhost:11435
MODEL_NAME=qwen3-coder:480b-cloud
PLANNER_MODEL=glm-5.1:cloud
CODER_MODEL=qwen3-coder:480b-cloud
QA_MODEL=qwen3-coder:480b-cloud
DOCS_MODEL=qwen3-coder:480b-cloud
DEPLOY_MODEL=qwen3-coder:480b-cloud
REVIEWER_MODEL=qwen3-coder:480b-cloud
```

`MODEL_NAME` er fallback-model. Hvis en rolle ikke har sin egen modelvariabel, bruger workflowet `MODEL_NAME`. Det betyder, at roller kan bindes til både forskellige endpoints og forskellige modeller uden at ændre Python-koden.

### Alternativ model

En enklere model kan være:

```env
PRIMARY_ENDPOINT=http://localhost:11434
SECONDARY_ENDPOINT=http://localhost:11435
```

Og så i kode mappes roller til enten primary eller secondary.

### Anbefaling

Den første model er bedre til aflevering, fordi den er lettere at forklare og demonstrere.

## Workflow-forløb

## Trin 1: Architect

Architect producerer:

- systembeskrivelse
- komponentopdeling
- interface-kontrakter
- deployment-antagelser
- ADR for værktøjsvalg

### Output

- `docs/architecture.md`
- `docs/interface_contracts.md`
- `docs/deployment_topology.md`
- `docs/adr-001-toolchain-choice.md`

## Trin 2: Tech Lead

Tech Lead omsætter arkitekturen til konkrete tickets.

Hver ticket skal mindst indeholde:

- scope
- definition of done
- dependencies

### Output

- `docs/tickets.md`

## Trin 3: Worker A og Worker B

To coding workers arbejder på adskilte områder.

### Eksempel på opdeling

**Worker A**

- implementerer feature-kode
- opdaterer kernefunktionalitet

**Worker B**

- implementerer tests
- opdaterer støttefiler eller sekundær funktionalitet

Alternativt:

**Worker A**

- backend/logik

**Worker B**

- dokumentation, config eller integration

Det vigtige er, at arbejdet er partitioneret og resulterer i multi-file changes.

### Output

- ændringer i flere filer
- worker summary til næste trin

## Trin 4: QA / Test

QA-noden skal ikke kun læse kode. Den skal også forholde sig til faktiske resultater.

Den ideelle løsning er:

- workflowet genererer tests
- tests køres via kommando
- output samles i quality report

### Quality report skal indeholde

- test results
- static checks
- kendte risici
- kendte begrænsninger

### Output

- `docs/quality_report.md`
- test-log i `results/`

## Trin 5: Docs

Docs-rollen opdaterer dokumentationen med det workflowet har produceret.

### Minimum

- `README.md`
- setup/run guide
- bruger- eller udviklerinstruktioner
- runbook notes

### Output

- `README.md`
- `docs/runbook.md`

## Trin 6: Deployment Validator

Denne rolle validerer at systemet kan deployes eller i det mindste er deploy-forberedt.

### Minimum for at opfylde opgaven

Mindst én af følgende:

- deployment checklist
- deployment script
- container config
- environment/config documentation

### Anbefalet minimum

- `docs/deployment_checklist.md`
- miljøvariabler dokumenteret i README

### Output

- `docs/deployment_checklist.md`

## Trin 7: Reviewer

Reviewer laver det samlede review af alle artefakter.

Reviewer afgør:

- godkendt
- needs_changes

Hvis der er væsentlige mangler, sendes workflowet tilbage til relevante noder.

## State management

LangGraph vælges netop fordi state kan defineres eksplicit.

### Foreslået state-objekt

Workflow-state bør mindst indeholde:

- project_goal
- architecture_artifacts
- tickets
- implementation_status
- changed_files
- test_results
- quality_report
- docs_status
- deployment_status
- review_verdict
- iteration_count

### Hvorfor det er vigtigt

Det giver:

- tydelig artifact handoff
- mindre risiko for tab af kontekst
- mere kontrolleret iteration
- bedre forklaring af workflowet i rapporten

## Hvordan silent context loss undgås

Dette er et vigtigt opgavekrav, så det bør forklares direkte.

### Anbefalet strategi

1. Hver node læser konkrete artefakter fra disk i stedet for kun fri tekst fra forrige agent
2. Hver node skriver en kort summary til state
3. De vigtigste beslutninger gemmes i dokumenter som ADRs og architecture docs
4. Store outputs komprimeres til strukturerede artefakter i stedet for løse chatsvar

### Resultat

Workflowet bliver mere robust når:

- repoet vokser
- antallet af filer vokser
- antallet af roller vokser

## Hvordan workflowet skalerer

Når projektet vokser, skal workflowet ikke sende hele repoet til alle roller.

### Anbefalet skaleringsstrategi

- arkitekturrollen arbejder på docs og overordnede contracts
- implementeringsroller får kun relevante filer og tickets
- QA læser changed files, tests og quality outputs
- reviewer læser summaries + nøgleartefakter

Dette reducerer tokenforbrug og gør flowet mere stabilt.

## Predictability and control

Workflowet skal have en kontrolmekanisme.

### Anbefalet model

- plan først
- artefakter derefter
- reviewable file outputs
- tests køres som særskilt trin

Hvis man vil styrke argumentationen yderligere, kan man beskrive at:

- filændringer gennemgås som diff
- testkommandoer er kendte og faste
- reviewer kan afvise og sende tilbage til tidligere trin

## Reproducérbarhed

Workflowet bør være reproducerbart nok til at give sammenlignelige outputs.

### Hvordan dette opnås

- faste roller
- fast rækkefølge
- faste artifacts
- faste output-paths
- fast endpoint-konfiguration
- fast demo-repo

Output bliver ikke identisk hver gang, men strukturen bliver sammenlignelig.

## Failure modes og recovery

### Hvad der typisk bryder først

1. arkitektur bliver for vag
2. tickets bliver for brede
3. workers overlapper i filer
4. tests mangler eller fejler
5. dokumentation halter bagefter

### Hvordan det opdages

- review-trin
- quality report
- changed file review
- deployment checklist

### Hvordan det håndteres

- send tilbage til relevant node
- begræns næste iteration til konkrete mangler
- opdater state med failure reason

## Hvorfor denne arkitektur passer til opgaven

Denne arkitektur er stærk i forhold til specifikationen, fordi den direkte adresserer:

- to lokale endpoints
- flere roller
- multiple software artifacts
- test og quality reporting
- dokumentation
- deployment validation
- context management
- predictability
- reproducerbarhed

## Afleveringsstatus

Arkitekturen er implementeret i det konfigurerbare LangGraph workflow. Workflowet læser opgavebeskrivelse og konfiguration fra inputfiler, skriver alle artefakter til en unik run-mappe og dokumenterer validation, QA, deployment review og endelig reviewer-vurdering som del af samme kørsel.
