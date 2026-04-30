# Setup Guide

## Formål

Denne guide beskriver, hvordan en tredjepart kan sætte miljøet op og reproducere den anbefalede lokale multi-LLM workflow-løsning.

Guiden er skrevet til den anbefalede løsning:

- **LangGraph** som workflow-motor
- **CrewAI** som sammenligningskandidat
- **to lokale model-endpoints**

## Hvad guiden skal gøre muligt

En person, der følger guiden, skal kunne:

1. installere nødvendige afhængigheder
2. konfigurere to lokale model-endpoints
3. konfigurere workflowet til at bruge dem
4. køre en demo-workflow
5. se de producerede artefakter og resultater

## Forudsætninger

Følgende skal være installeret på maskinen:

- Python 3.10+ eller nyere
- `pip`
- Git
- Ollama eller en anden lokal open source modelserver, der kan eksponere HTTP-endpoints

## Anbefalet lokal opsætning

Det enkleste er at bruge to lokale model-endpoints.

Eksempel:

- endpoint A på `http://localhost:11434`
- endpoint B på `http://localhost:11435`

Disse endpoints må gerne pege på:

- samme host med forskellige porte
- eller to forskellige lokale hosts/serverprocesser

Det vigtige er, at de er separate og kan vælges via konfiguration.

## Trin 1: Klon projektet

```powershell
git clone <repo-url>
cd CrewAI
```

Hvis projektet allerede findes lokalt, gå blot ind i repo-mappen.

## Trin 2: Opret og aktiver virtuelt miljø

### Windows PowerShell

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

## Trin 3: Installer Python-afhængigheder

Installer Python-afhængigheder fra `requirements.txt`:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

Afhængighederne inkluderer:

- `python-dotenv`
- `langgraph`
- `langchain`
- `langchain-ollama`

## Trin 4: Start to lokale model-endpoints

Der skal være mindst to lokale endpoints tilgængelige.

### Eksempel med Ollama

Først skal de relevante modeller være tilgængelige lokalt.

Eksempel:

```powershell
ollama pull qwen3-coder:480b-cloud
```

Hvis man bruger en anden lokal model, erstattes modelnavnet med den relevante model.

### Start endpoint A

Eksempel:

```powershell
$env:OLLAMA_HOST="127.0.0.1:11434"
ollama serve
```

### Start endpoint B

I en ny terminal:

```powershell
$env:OLLAMA_HOST="127.0.0.1:11435"
ollama serve
```

Hvis Ollama eller den valgte modelserver ikke understøtter denne præcise køreform i miljøet, kan man i stedet bruge to separate lokale modelservere eller hosts. Opgavens krav er, at workflowet kan forbindes til to forskellige lokale endpoints, ikke at det skal være præcis samme værktøjskommando.

## Trin 5: Konfigurer miljøvariabler

Opret eller opdater `.env` i repo-roden.

### Minimumskonfiguration for det anbefalede LangGraph workflow

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

Den anbefalede model er at route roller til endpoints og modelnavne via konfiguration fremfor manuel kodeændring.

`MODEL_NAME` fungerer som fallback. Hvis fx `CODER_MODEL` ikke er sat, bruger coder-rollen `MODEL_NAME`.

## Trin 6: Verificer at endpoints svarer

Det er en god ide at teste, at de to endpoints faktisk kører, før workflowet startes.

Eksempel:

```powershell
Invoke-WebRequest http://localhost:11434
Invoke-WebRequest http://localhost:11435
```

Hvis endpoints kræver en bestemt health-route i stedet for root-path, skal den relevante health-endpoint bruges.

## Trin 7: Kør det anbefalede LangGraph workflow

LangGraph er den anbefalede løsning og den workflow-implementering, der skal reproduceres.

Standard-inputtet ligger i:

```text
inputs/
```

Kør workflowet:

```powershell
.\.venv\Scripts\python.exe .\langgraph_workflow.py
```

Workflowet skriver output til:

```text
results/runs/<RUN_ID>/
```

Hvis `RUN_ID` ikke er sat, opretter workflowet automatisk et timestamp-baseret run-id.

## Trin 8: Gennemgå outputs

Når workflowet har kørt, bør man kontrollere:

- at outputfiler er blevet genereret under `results/runs/<RUN_ID>/`
- at `artifact_progress.md` viser trin-for-trin fremdrift
- at valideringsoutputtet viser om tests/checks passerede
- at review-outputtet indeholder en endelig vurdering
- at endpoint-konfigurationen svarer til det ønskede setup

## CrewAI sammenligningskandidat

CrewAI indgår i afleveringen som evalueret kandidat, men er ikke den anbefalede workflow-implementering.

Den gamle CrewAI prototype er flyttet til:

```text
legacy/snake_prototype/
```

Den bruges som historisk sammenligningsgrundlag, mens den nuværende reproducerbare demo køres med:

```text
langgraph_workflow.py
```

## Hvilke artefakter en tredjepart skal kunne finde efter en fuld demo-run

Efter en fuld demo-run bør en tredjepart kunne finde følgende i `results/runs/<RUN_ID>/`:

- `docs/architecture.md`
- `docs/tickets.md`
- `docs/quality_report.md`
- `docs/runbook.md`
- `docs/deployment_checklist.md`
- `README.md`
- validation output, fx `maven_test_output.txt` eller `site_validation_output.txt`
- review output, fx `workflow_review.md`
- det genererede projekt, fx `demo_project/` eller `website_project/`

## Reproducerbarhed

For at sikre sammenlignelige runs bør følgende være stabile:

- samme endpoint-konfiguration
- samme modelnavne
- samme workflow-rækkefølge
- samme demo-projekt
- samme output-paths

Resultaterne bliver ikke nødvendigvis identiske fra run til run, men strukturen bør være sammenlignelig.

## Kontrol og sikkerhed

### Kontrol

Workflowet bør beskrives og køres med:

- fast rækkefølge af trin
- reviewable outputfiler
- faste kommandoer

### Sikkerhed

Model-endpoints bør kun være tilgængelige lokalt eller på et privat netværk. Løsningen må ikke kræve, at en uautentificeret modelserver eksponeres offentligt.

## Fejlfinding

### Problem: Workflowet kan ikke kontakte endpoint

Kontroller:

- at modelserveren kører
- at porten er korrekt
- at `.env` peger på korrekt URL

### Problem: Workflowet starter men giver tomme outputs

Kontroller:

- at modellen faktisk er tilgængelig på endpointet
- at modelnavnet i `.env` findes lokalt
- at Python-afhængigheder er installeret

### Problem: Kun et endpoint bruges i praksis

Kontroller:

- at roller faktisk er bundet til forskellige endpoints i konfigurationen
- at den endelige workflow-implementering ikke genbruger samme klient overalt

## Java/Maven demo-projekt

Den endelige demo er nu målrettet et Java Maven task tracker CLI-projekt, som workflowet skriver i en unik run-mappe under `results/runs/<RUN_ID>/demo_project/`.

En tredjepart bør derfor også have installeret:

- JDK 17 eller nyere
- Maven

Når run-mappen er genereret, kan demo-projektet valideres med:

```powershell
cd results\runs\<RUN_ID>\demo_project
mvn test
mvn package
```

Disse kommandoer bruges som grundlag for testresultater og deployment validation.

## Run Java/Maven generator workflow

Den nye LangGraph-workflow, der er målrettet Java/Maven-demoen, køres sådan:

### Start eller opret lokale model-endpoints

Workflowet forventer to lokale model-endpoints:

- `http://localhost:11434`
- `http://localhost:11435`

Hvis de ikke allerede kører, skal de startes før pre-run checklisten.

Eksempel med Ollama:

1. Start endpoint A i en terminal:

```powershell
$env:OLLAMA_HOST="127.0.0.1:11434"
ollama serve
```

2. Start endpoint B i en anden terminal:

```powershell
$env:OLLAMA_HOST="127.0.0.1:11435"
ollama serve
```

3. Lad begge terminaler blive åbne, mens workflowet kører.

Hvis modellen ikke findes endnu, skal den hentes først:

```powershell
ollama pull qwen3-coder:480b-cloud
```

Hvis du bruger en anden lokal model, skal `MODEL_NAME` i `.env` matche det modelnavn. Hvis enkelte roller skal bruge andre modeller, kan rollevariablerne bruges, fx `CODER_MODEL`, `QA_MODEL` eller `REVIEWER_MODEL`.

Hvis din Ollama-installation ikke kan køre to `ollama serve` processer på denne måde, kan endpoint B i stedet være en anden lokal modelserver eller en anden lokal host. Det vigtige for opgaven er, at workflowet kan konfigureres til to separate lokale endpoints.

### Pre-run checklist

Før workflowet køres, skal disse ting være på plads:

1. Du står i repo-roden:

```powershell
cd "C:\Users\pf\Desktop\Skole\LLM for Developers\LLM\mandetory1\Mandatory-1 real"
```

2. Det virtuelle Python-miljø findes:

```powershell
Test-Path .\.venv\Scripts\python.exe
```

Kommandoen skal returnere `True`.

3. Python dependencies er installeret:

```powershell
.\.venv\Scripts\python.exe -c "import langgraph, langchain_ollama, dotenv; print('ok')"
```

Kommandoen skal skrive `ok`.

4. Begge lokale model-endpoints svarer:

```powershell
Invoke-WebRequest http://localhost:11434
Invoke-WebRequest http://localhost:11435
```

Hvis en af dem fejler, skal modelserveren startes før workflowet køres.

5. Java og Maven er installeret:

```powershell
java -version
mvn -version
```

Begge kommandoer skal virke. Maven bruges efter workflowet har genereret `demo_project/`.

6. `.env` skal indeholde rolle-endpoints:

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

### Important write behavior

Workflowet skriver filer til repoet. Det er forventet.

Workflowet skriver nu til en unik run-mappe under:

```text
results/runs/<RUN_ID>/
```

Eksempel:

```text
results/runs/20260411_191500/
```

Det betyder, at flere kørsler ikke overskriver hinanden.

Workflowet læser opgavebeskrivelsen fra:

```text
inputs/task.md
inputs/demo_scope.md
inputs/generation_contract.md
inputs/workflow_config.json
```

Hvis opgaven skal ændres, skal disse inputfiler opdateres i stedet for at ændre Python-koden.

`workflow_config.json` styrer de mest konkrete workflow-parametre:

- `project_name`
- `project_dir`
- `validation_command`
- Worker A role, required files og constraints
- Worker B role, required files og constraints
- hvilke docs der skal genereres
- hvilke deployment docs der skal genereres

Eksempel fra Java/Maven-demoen:

```json
{
  "project_name": "Java Maven Task Tracker CLI",
  "project_dir": "demo_project",
  "validation_command": ["mvn", "test"]
}
```

## Automatisk generering af inputfiler fra en fri opgavebeskrivelse

Hvis man ikke selv vil skrive alle inputfilerne manuelt, kan man bruge input-prep scriptet:

```text
prepare_workflow_inputs.py
```

Den korteste anbefalede startkommando er PowerShell-wrapperen:

```powershell
.\flow.cmd start -RunId demo-run-01
```

`start` er et subcommand i flow-wrapperen. Brug `.\flow.cmd start` eller `.\flow start` fra projektmappen i stedet for kun `start`, fordi `start` allerede er en PowerShell-alias for `Start-Process`.

Før et run kan endpoints og Python-syntaks tjekkes med:

```powershell
.\flow.cmd check
```

Processen er:

1. Skriv en fri opgavebeskrivelse i:

```text
input_requests/new_project_request.md
```

2. Kør input-prep scriptet:

```powershell
.\.venv\Scripts\python.exe .\prepare_workflow_inputs.py
```

Eller via wrapperen:

```powershell
.\flow.cmd start
```

3. Scriptet genererer et nyt inputset under:

```text
generated_inputs/<slug>/
```

4. Scriptet reviewer de genererede inputfiler og skriver:

```text
generated_inputs/<slug>/input_review.md
```

Hvis inputfilerne bliver afvist, sender scriptet fejlene og reviewet tilbage til planner-modellen og prøver igen. Standardgrænsen er 3 forsøg.

Input-prep valideringen afviser også configs hvor dokumentationsfelter som `final_docs` og `deployment_docs` peger på projektfiler som `index.html`, CSS eller JavaScript. De felter skal pege på dokumentationsfiler, fx `README.md`, `docs/runbook.md` og `docs/deployment_checklist.md`.

Grænsen kan styres sådan:

```powershell
.\.venv\Scripts\python.exe .\prepare_workflow_inputs.py --max-input-fix-iterations 3
```

Eller via wrapperen:

```powershell
.\flow.cmd start -MaxInputFixIterations 3
```

Reviewer-fix grænsen er også optional og er som standard 2:

```powershell
.\flow.cmd start -MaxReviewFixIterations 2
```

5. Hvis reviewet ender med:

```text
VERDICT: good_enough
```

starter scriptet automatisk det normale LangGraph workflow med:

```text
WORKFLOW_INPUT_DIR=generated_inputs/<slug>
```

Hvis reviewet stadig ender med efter de tilladte forsøg:

```text
VERDICT: needs_changes
```

stopper scriptet, så inputfilerne kan gennemgås og rettes før hovedworkflowet køres.

Hvis man kun vil generere og reviewe inputfiler uden at starte hovedworkflowet, bruges:

```powershell
.\.venv\Scripts\python.exe .\prepare_workflow_inputs.py --no-run
```

Wrapper-variant:

```powershell
.\flow.cmd start -NoRun
```

Hvis man vil bruge en specifik opgavefil:

```powershell
.\.venv\Scripts\python.exe .\prepare_workflow_inputs.py --request .\input_requests\my_request.md
```

Wrapper-variant:

```powershell
.\flow.cmd start -Request .\input_requests\my_request.md
```

Den anbefalede struktur for nye opgaver er en mappe pr. request:

```text
input_requests/browser_games/
  request.md
  questions.md
  answers.md
```

`request.md` er den frie opgavebeskrivelse. `questions.md` og `answers.md` er valgfri afklaringsfiler.

For at generere afklarende spørgsmål:

```powershell
.\flow.cmd questions -RequestDir input_requests\browser_games
```

Hvis `questions.md` allerede findes, men `answers.md` mangler, stopper kommandoen og beder dig udfylde `answers.md`.

Hvis `questions.md` og `answers.md` allerede findes, gør kommandoen opmærksom på, at spørgsmålene allerede er besvaret.

For at køre et run med en request-mappe:

```powershell
.\flow.cmd start -RequestDir input_requests\browser_games -RunId browser-games-demo-01
```

Hvis `answers.md` findes, bliver svarene automatisk brugt som ekstra kontekst til input-genereringen. Hvis de ikke findes, kører flowet videre uden dem.

Input-prep scriptet bruger `PLANNER_ENDPOINT`/`PLANNER_MODEL` til at lave inputfilerne og `REVIEWER_ENDPOINT`/`REVIEWER_MODEL` til at kontrollere dem.

Hvis man senere vil teste et andet projekt, fx et website, oprettes et nyt inputset i en anden mappe og workflowet køres sådan:

```powershell
$env:WORKFLOW_INPUT_DIR="test_projects\website_task"
$env:RUN_ID="website-demo-02"
.\.venv\Scripts\python.exe .\langgraph_workflow.py
```

Wrapper-variant hvis inputsettet allerede findes:

```powershell
.\flow.cmd main -InputDir test_projects\website_task -RunId website-demo-02
```

Det aktuelle website-eksempel ligger allerede her:

```text
test_projects/website_task/
```

Det bruger Node til validation:

```powershell
node --version
```

Website-run'et kan efterfølgende testes manuelt ved at åbne:

```text
results/runs/website-demo-02/website_project/index.html
```

Den manuelle browser-test er dokumenteret i:

```text
results/runs/website-demo-02/manual_runtime_check.md
```

Hver run-mappe kan indeholde:

- `demo_project/`
- `README.md`
- `docs/architecture.md`
- `docs/tickets.md`
- `docs/quality_report.md`
- `docs/deployment_checklist.md`
- `docs/runbook.md`
- `maven_test_output.txt`
- `workflow_review.md`
- `artifact_progress.md`

Hvis du vil styre run-navnet manuelt, kan du sætte `RUN_ID`:

```powershell
$env:RUN_ID="demo-run-01"
.\.venv\Scripts\python.exe .\langgraph_workflow.py
```

### Run command

```powershell
.\.venv\Scripts\python.exe .\langgraph_workflow.py
```

Workflowet skal generere `demo_project/`, relevante `docs/` artefakter, `README.md` og review-output i en unik mappe under `results/runs/`.

Workflowet skriver artefakter løbende efter hvert step. Det betyder, at man kan følge progressionen i:

```text
results/runs/<RUN_ID>/artifact_progress.md
```

Hvis workflowet fejler midtvejs, vil de artefakter der allerede var genereret typisk stadig ligge i run-mappen.

Workflowet har to bounded fix-loops:

- validation fail -> fixer -> validation igen, max 3 forsøg
- reviewer `needs_changes` -> reviewer-fixer -> validation/QA/docs/deploy/reviewer igen, max 2 forsøg

Det betyder, at et projekt kan blive rettet selvom validation passerer, men reviewer stadig finder konkrete problemer.

LLM-kald har også retry ved midlertidige endpoint-fejl, fx Ollama `503 Service Temporarily Unavailable`.

Default:

```text
LLM_RETRY_ATTEMPTS=3
LLM_RETRY_DELAY_SECONDS=10
```

Hvis endpointet er tungt belastet, kan disse sættes i terminalen før run:

```powershell
$env:LLM_RETRY_ATTEMPTS="5"
$env:LLM_RETRY_DELAY_SECONDS="20"
```

Disse grænser kan styres med:

```powershell
.\flow.cmd start -MaxInputFixIterations 3 -MaxReviewFixIterations 2
```

### After-run validation

Efter workflowet har genereret Java-projektet, køres:

```powershell
cd results\runs\<RUN_ID>\demo_project
mvn test
mvn package
```

Resultaterne fra disse kommandoer bruges i quality report og deployment validation.



