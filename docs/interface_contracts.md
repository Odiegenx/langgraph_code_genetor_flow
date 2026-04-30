# Interface Contracts

## Formål

Dette dokument beskriver de vigtigste interface-kontrakter i demo-projektet.

Formålet er at gøre følgende tydeligt:

- hvilke data der udveksles mellem komponenter
- hvilke funktioner de enkelte lag forventes at tilbyde
- hvilke input og output der er tilladt
- hvilke fejlscenarier der skal håndteres

Demo-projektet er en lille Java Maven task tracker CLI.

## Omfang

Kontrakterne beskriver grænseflader mellem:

- CLI layer
- service layer
- storage layer
- domain model

Dette er ikke en offentlig netværks-API. Det er interne softwarekontrakter i projektet.

## Oversigt over kontrakter

De vigtigste kontrakter er:

1. task model contract
2. service contract
3. storage contract
4. CLI command contract

## 1. Task Model Contract

Task-modellen er den centrale datastruktur i systemet.

### Minimumsfelter

En task skal mindst have:

- `id: str`
- `title: str`
- `completed: bool`

### Semantik

- `id` skal være unik inden for task-samlingen
- `title` må ikke være tom
- `completed` angiver om tasken er afsluttet

### Eksempel

```json
{
  "id": "task-001",
  "title": "Write tests",
  "completed": false
}
```

### Kontraktkrav

- alle lag skal behandle en task som et objekt med de tre minimumsfelter
- storage-laget skal kunne serialisere og deserialisere modellen
- service-laget må validere at `title` ikke er tom

## 2. Service Contract

Service-laget ejer domaenelogikken.

Det forventes at service-laget eksponerer funktioner svarende til disse operationer:

- create task
- list tasks
- complete task

## 2.1 Create Task

### Formål

Oprette en ny task og gemme den.

### Input

- `title: str`

### Output

- en oprettet task

### Forventet adfaerd

- opretter en unik `id`
- sætter `completed` til `false`
- persisterer tasken via storage-laget
- returnerer den oprettede task

### Fejltilfaelde

- tom titel skal afvises

### Eksempel

```python
create_task(title="Write README") -> {
    "id": "task-001",
    "title": "Write README",
    "completed": False
}
```

## 2.2 List Tasks

### Formål

Returnere alle eksisterende tasks.

### Input

- ingen input

### Output

- liste af tasks

### Forventet adfaerd

- læser task-samlingen via storage-laget
- returnerer en liste, også hvis den er tom

### Eksempel

```python
list_tasks() -> [
    {"id": "task-001", "title": "Write README", "completed": False}
]
```

## 2.3 Complete Task

### Formål

Markere en eksisterende task som faerdig.

### Input

- `task_id: str`

### Output

- den opdaterede task

### Forventet adfaerd

- finder tasken på basis af `task_id`
- sætter `completed = true`
- persisterer aendringen
- returnerer den opdaterede task

### Fejltilfaelde

- ukendt `task_id` skal give en kontrolleret fejl

### Eksempel

```python
complete_task("task-001") -> {
    "id": "task-001",
    "title": "Write README",
    "completed": True
}
```

## 3. Storage Contract

Storage-laget ejer persistence.

Det forventes at storage-laget eksponerer funktioner svarende til:

- load tasks
- save tasks

## 3.1 Load Tasks

### Formål

Laese task-data fra persistent storage.

### Input

- ingen input eller evt. en storage-path ved initialisering

### Output

- liste af tasks

### Forventet adfaerd

- hvis storage-filen ikke findes, returneres en tom liste
- hvis storage-filen findes og er gyldig, returneres tasks

### Fejltilfaelde

- korrupt dataformat bør håndteres tydeligt

## 3.2 Save Tasks

### Formål

Gemmesamlingen af tasks til persistent storage.

### Input

- liste af tasks

### Output

- ingen eller et simpelt success-resultat

### Forventet adfaerd

- data skrives i et stabilt serialiserbart format
- efterfølgende `load_tasks()` skal kunne læse samme data tilbage

## 4. CLI Command Contract

CLI-laget er systemets brugergrænseflade.

Det skal understoette kommandoer svarende til:

- `add`
- `list`
- `complete`

### 4.1 Add Command

#### Formål

Lade brugeren oprette en task fra kommandolinjen.

#### Input

Eksempel:

```powershell
mvn exec:java -Dexec.args="add Write tests"
```

#### Output

- bekræftelse på at tasken er oprettet
- gerne med task-id

### 4.2 List Command

#### Formål

Lade brugeren se alle tasks.

#### Input

Eksempel:

```powershell
mvn exec:java -Dexec.args="list"
```

#### Output

- en laesbar liste over tasks

### 4.3 Complete Command

#### Formål

Lade brugeren markere en task som faerdig.

#### Input

Eksempel:

```powershell
mvn exec:java -Dexec.args="complete task-001"
```

#### Output

- bekræftelse på at tasken er afsluttet

## Input validation contract

Systemet bør håndtere mindst disse fejl:

- tom tasktitel
- ukendt task-id
- ugyldig kommando

### Minimumskrav

- fejl må ikke give ukontrolleret crash uden forklaring
- fejl skal returnere en laesbar besked til brugeren

## Persistence format contract

Storage-formatet kan være JSON.

### Anbefalet struktur

```json
[
  {
    "id": "task-001",
    "title": "Write tests",
    "completed": false
  }
]
```

### Hvorfor JSON vælges

- simpelt
- laesbart
- let at teste
- let at dokumentere

## Test contract

Disse kontrakter skal verificeres i tests.

### Service tests bør verificere

- at `create_task` opretter korrekt objekt
- at tom titel afvises
- at `complete_task` opdaterer korrekt task
- at ukendt `task_id` håndteres korrekt

### Storage tests bør verificere

- at tom storage giver tom liste
- at lagring og indlaesning er konsistent
- at dataformat kan round-trippes korrekt

## Kontrakter mellem workflow-roller

Ud over softwarekomponenterne er der også kontrakter mellem workflow-rollerne.

### Architect til Tech Lead

Architect leverer:

- `docs/architecture.md`
- dette dokument

Tech Lead må antage at:

- komponentgrænserne er fastlagt
- ansvar mellem lag er beskrevet

### Tech Lead til Workers

Tech Lead leverer:

- `docs/tickets.md`

Workers må antage at:

- hver ticket har tydeligt scope
- filansvar er beskrevet
- dependency ordering er synlig

### Workers til QA

Workers leverer:

- ændrede filer
- kort summary af aendringer

QA må antage at:

- aendringerne svarer til tickets
- tests kan knyttes til konkrete filaendringer

## Risici

De vigtigste kontraktrisici er:

1. at `Main.java` overtager for meget logik
2. at service og storage får uklare grænser
3. at fejltilfaelde ikke håndteres ensartet
4. at dataformat ændres uden at tests opdateres

## Hvordan risikoerne reduceres

1. hold service-APIet lille og tydeligt
2. hold storage-ansvaret snævert
3. skriv tests mod kontrakterne
4. dokumenter datamodellen i et sted

## Definition of done

Interface contracts anses for dækket når:

- dette dokument findes
- implementeringen følger de beskrevne kontrakter
- tests verificerer de vigtigste kontrakter

## Afleveringsstatus

Interfacekontrakterne er dækket af dette dokument, de genererede projektfiler og de tilhørende validation/test outputs i reference-runs.


