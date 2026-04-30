# Flow Explanation For Presentation

## Det Store Billede

Der er to flows:

1. **Input-prep flowet** tager en almindelig opgavebeskrivelse fra `input_requests/...` og laver de fire strukturerede inputfiler, som hovedflowet skal bruge.
2. **LangGraph hovedflowet** tager de strukturerede inputfiler og kører hele softwareudviklings-workflowet: architecture, tickets, kode, validation, fixes, QA, docs, deployment og review.

Kort forklaring:

```text
Vi har adskilt “hvad skal bygges?” fra “hvordan bygger workflowet det?”.
Input-prep flowet oversætter en fri tekst-request til et struktureret workflow input.
LangGraph flowet bruger derefter de inputfiler til at køre et reproducerbart multi-agent software workflow.
```

## Brugerflow

Når vi starter fra en ny ide, ser processen sådan ud:

```text
input_requests/<project>/request.md
        ↓
flow.cmd questions
        ↓
input_requests/<project>/questions.md
        ↓
input_requests/<project>/answers.md
        ↓
flow.cmd start
        ↓
generated_inputs/<project>/
        ↓
langgraph_workflow.py
        ↓
results/runs/<RUN_ID>/
```

De vigtigste kommandoer:

```powershell
flow.cmd questions -RequestDir input_requests\bowser_game_improved
```

Laver afklarende spørgsmål.

```powershell
flow.cmd start -RequestDir input_requests\bowser_game_improved -RunId improved_browser_games_v1
```

Laver inputfiler og starter derefter hovedflowet.

```powershell
flow.cmd main -InputDir generated_inputs\browser-games-collection -RunId improved_browser_games_v1
```

Springer input-prep over og starter kun hovedflowet fra et allerede godkendt inputset.

## Input-Prep Flowet

Filen er:

```text
prepare_workflow_inputs.py
```

De vigtigste funktioner:

```text
_generate_questions()
```

Bruger planner-modellen til at stille op til 5 afklarende spørgsmål.

```text
_generate_inputs()
```

Bruger planner-modellen til at lave:

```text
task.md
demo_scope.md
generation_contract.md
workflow_config.json
```

```text
_validate_generated_inputs()
```

Deterministisk Python-validering. Den tjekker fx at `workflow_config.json` har de rigtige felter, at file paths er sikre, og at validation command giver mening.

```text
_review_inputs()
```

LLM-review af de genererede inputfiler.

```text
_run_generation_workflow()
```

Starter hovedflowet ved at sætte:

```text
WORKFLOW_INPUT_DIR=<generated input folder>
RUN_ID=<run id>
```

Og derefter kalde:

```text
langgraph_workflow.py
```

Vigtig pointe:

```text
Input-prep accepterer ikke bare blindt LLM-output.
Det bliver både deterministisk valideret og reviewet af en reviewer-model.
```

## Hovedflowet

Filen er:

```text
langgraph_workflow.py
```

Flowet er bygget med LangGraph:

```text
builder = StateGraph(State)
```

Noderne er:

```text
architect
tech_lead
worker_a
worker_b
write_project
validate
fixer
qa
docs
deploy
reviewer
review_fix
write_artifacts
```

Den faktiske rækkefølge:

```text
START
  ↓
architect
  ↓
tech_lead
  ↓
worker_a
  ↓
worker_b
  ↓
write_project
  ↓
validate
  ↓
if validation fails: fixer → write_project → validate
if validation passes: qa
  ↓
docs
  ↓
deploy
  ↓
reviewer
  ↓
if reviewer says needs_changes: review_fix → write_project → validate
if reviewer says good_enough: write_artifacts
  ↓
END
```

## State

Hovedflowet bruger en `TypedDict` kaldet `State`.

Det betyder, at alle noder arbejder på samme fælles state-object. Det indeholder fx:

```text
task
demo_scope
generation_contract
workflow_config
architecture
tickets
project_files
validation_status
validation_output
qa_report
docs
deployment_checklist
review
verdict
fix_iterations
review_fix_iterations
```

Kort forklaring:

```text
State fungerer som workflowets fælles hukommelse.
Hver node læser noget fra state og skriver nye resultater tilbage.
Det gør handoff mellem roller eksplicit i stedet for implicit chat-context.
```

## Model Routing

`.env` styrer hvilken model og endpoint hver rolle bruger:

```env
PLANNER_ENDPOINT=http://localhost:11434
CODER_ENDPOINT=http://localhost:11435
REVIEWER_ENDPOINT=http://localhost:11434
QA_ENDPOINT=http://localhost:11434

PLANNER_MODEL=deepseek-v3.2:cloud
CODER_MODEL=qwen3-coder:480b-cloud
REVIEWER_MODEL=deepseek-v3.2:cloud
QA_MODEL=deepseek-v3.2:cloud
```

I koden bliver modellerne oprettet med `ChatOllama`, fx:

```python
architect_llm = ChatOllama(model=ARCHITECT_MODEL, base_url=ARCHITECT_ENDPOINT)
coder_llm = ChatOllama(model=CODER_MODEL, base_url=CODER_ENDPOINT)
reviewer_llm = ChatOllama(model=REVIEWER_MODEL, base_url=REVIEWER_ENDPOINT)
```

Pointen:

```text
Rollerne er ikke bundet til én model.
Vi kan bruge stærkere reasoning-modeller til planning/review og coder-modeller til implementering.
Det kan ændres i .env uden at ændre Python-koden.
```

## Hvorfor LangGraph Er Vigtigt Her

Kort forklaring:

```text
Hvis det bare var et script, ville flowet være en lang sekvens af LLM-kald.
Med LangGraph bliver det en eksplicit graph med nodes, state og conditional edges.
Det gør det muligt at se præcist hvor workflowet er, hvorfor det går videre, og hvornår det går tilbage til fixer.
```

De to vigtigste conditional edges:

```text
route_after_validation()
```

Hvis validation fejler, sendes workflowet til `fixer`.

```text
route_after_review()
```

Hvis reviewer siger `needs_changes`, sendes workflowet til `review_fix`.

## Fix Loops

Der er to bounded loops:

```text
validation fail → fixer → write_project → validate
```

Og:

```text
reviewer needs_changes → review_fix → write_project → validate → QA → docs → deploy → reviewer
```

De er bounded, så workflowet ikke kan køre uendeligt.

Kort forklaring:

```text
Validation tjekker om projektet teknisk kan køre.
Reviewer tjekker om projektet faktisk opfylder opgaven.
Derfor har vi både en validation-fixer og en reviewer-fixer.
```

## Artifacts

Alt output skrives til:

```text
results/runs/<RUN_ID>/
```

Det betyder:

- runs overskriver ikke hinanden
- man kan sammenligne outputs
- man kan dokumentere præcis hvad der skete
- hvis flowet fejler midtvejs, ligger de foreløbige artifacts stadig i run-mappen

Vigtige filer i et run:

```text
artifact_progress.md
workflow_review.md
site_validation_output.txt
README.md
docs/quality_report.md
docs/deployment_checklist.md
generated project files
```

## Kort Demo-Forklaring

Når demoen vises:

```text
Her starter vi med en request-mappe.
Requesten bliver omsat til workflow-inputs.
Derefter kører LangGraph-flowet gennem rollerne.
Vi kan se hvert trin i terminalen.
Samtidig bliver artifacts skrevet til results/runs.
Til sidst kan vi åbne validation output, reviewer output og det genererede projekt.
```

## Hvis Læreren Spørger: Hvad Er Det Tekniske Bidrag?

Svar:

```text
Det tekniske bidrag er ikke kun at generere kode med en LLM.
Det er et reproducerbart workflow-system med:
- eksterne inputfiler
- model routing per rolle
- explicit graph state
- artifact handoff
- validation loop
- reviewer loop
- per-run output folders
- deterministic checks før LLM-output accepteres
```

## Hvis Læreren Spørger: Hvorfor Ikke Bare CrewAI?

Svar:

```text
CrewAI var hurtigere at prototype med, men LangGraph gav bedre kontrol.
I denne opgave skulle vi ikke kun vise agents, men også kunne forklare routing, state, validation, recovery og reproducerbarhed.
Det passede bedre til LangGraph.
```

## Vigtig One-Liner

```text
Vi har bygget et lokalt multi-LLM softwareudviklings-workflow, hvor LangGraph styrer processen, .env styrer modellerne, inputfiler styrer opgaven, og results/runs dokumenterer hvert run.
```
