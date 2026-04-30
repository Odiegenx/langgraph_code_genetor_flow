# Toolchain Comparison: CrewAI vs LangGraph

## Formål

Denne rapport sammenligner to open source kandidater til opgaven:

- CrewAI
- LangGraph

Målet er at vurdere hvilken løsning der bedst egner sig til en **lokal multi-LLM coding workflow**, hvor flere roller kan samarbejde om at producere software-artefakter med lokale model-backends.

## Kort konklusion

Begge værktøjer kan bruges til at bygge en lokal agent/workflow-løsning, men de har forskellige styrker.

- **CrewAI** er hurtig at komme i gang med og er god til en enkel rollebaseret agent-opsætning.
- **LangGraph** giver bedre kontrol over flow, state, iterationer, fejlveje og routing, og er derfor den stærkeste kandidat til den endelige opgaveløsning.

### Foreløbig anbefaling

Den anbefalede løsning er **LangGraph**.

Begrundelsen er, at opgaven lægger vægt på:

- kontrol og forudsigelighed
- tydelige artifact handoffs
- reproducerbarhed
- mulighed for at styre komplekse workflows
- multi-step evaluering og failure handling

Det er præcis dér LangGraph er stærkest.

## Kandidat 1: CrewAI

### Hvad det er godt til

CrewAI er bygget til agent-baserede workflows med tydelige roller som fx:

- planner
- coder
- tester
- reviewer

Det passer godt til en enkel demonstration, hvor man hurtigt vil vise samarbejde mellem roller.

### Styrker

- enkel mental model
- hurtig opsætning
- let at forklare i en præsentation
- roller og tasks er letlæselige
- god til lineære workflows

### Svagheder

- mindre eksplicit kontrol over state og transitions
- parallelisering og avanceret routing kræver mere specialtilpasning
- mindre robust til iterative loops og fejlgrene
- sværere at dokumentere præcis hvordan context handoff styres

### Vurdering mod opgaven

CrewAI er god som kandidat i evalueringen, men mindre velegnet som endelig anbefalet løsning til denne opgave, fordi opgaven kræver en mere kontrolleret og dokumenterbar workflow-struktur end den nuværende CrewAI-prototype viser.

## Kandidat 2: LangGraph

### Hvad det er godt til

LangGraph er bygget til stateful workflows, hvor man eksplicit definerer:

- noder
- state
- transitions
- loops
- stopbetingelser

Det gør det velegnet til en coding workflow, hvor artefakter bevæger sig mellem roller og hvor systemet skal kunne iterere eller rute arbejdet videre baseret på resultater.

### Styrker

- stærk kontrol over workflowets struktur
- eksplicit state management
- tydelige transitions mellem roller
- god til iteration, review-loops og failure handling
- nemmere at argumentere for i forhold til predictability og context management
- lettere at udvide til større workflows

### Svagheder

- mere kompleks at sætte op
- kræver mere designarbejde
- mindre “plug-and-play” end en simpel agent-crew opsætning

### Vurdering mod opgaven

LangGraph passer bedre til opgaven, fordi det understøtter en mere stringent workflow-arkitektur. Det gør det lettere at dokumentere:

- hvordan artifacts overdrages
- hvordan fejl opdages og håndteres
- hvordan iterationer styres
- hvordan workflowet kan vokse med projektets størrelse

## Sammenligning på opgavekrav

### 1. Setup complexity

**CrewAI**

- hurtigere at komme i gang med
- færre koncepter at forstå
- roller og tasks kan sættes op direkte

**LangGraph**

- højere initial kompleksitet
- kræver bevidst modellering af state og flow
- lidt længere tid til første rigtige workflow

**Vurdering**

CrewAI vinder på hurtig opstart. LangGraph vinder på struktur, når workflowet bliver mere seriøst.

### 2. Time to first working run

**CrewAI**

- meget hurtig til første demo
- egnet til en simpel proof of concept

**LangGraph**

- lidt langsommere at få i gang
- kræver mere kode før første komplette run

**Vurdering**

CrewAI er bedst til hurtig demo. LangGraph er bedst til en robust løsning.

### 3. Moving parts

**CrewAI**

- agents
- tasks
- crew process
- model config

**LangGraph**

- state definition
- nodes
- edges
- conditional routing
- model config

**Vurdering**

LangGraph har flere bevægelige dele, men de er også mere eksplicitte. Det gør systemet lettere at analysere og forklare.

### 4. Capability coverage

**CrewAI**

Understøtter roller naturligt, men mange af opgavens krav vil kræve ekstra glue-kode:

- artifact persistence
- advanced routing
- failure recovery
- struktureret quality reporting
- skaleringsstrategi

**LangGraph**

Understøtter bedre den type workflow-orchestration opgaven efterspørger, især når der skal være:

- flere trin
- loops
- klare transitions
- tydelig state mellem roller

**Vurdering**

LangGraph har bedre fit til opgavens samlede capability coverage.

### 5. Multi-endpoint support

**CrewAI**

Kan i princippet kobles til forskellige endpoints pr. agent, men det skal bygges tydeligere og dokumenteres. Den nuværende prototype bruger kun ét endpoint for hele CrewAI-runnet.

**LangGraph**

Kan også kobles til flere endpoints, og her er det mere naturligt at binde specifikke noder eller roller til specifikke modelklienter.

Eksempel:

- planner/reviewer på endpoint A
- coder/tester på endpoint B

**Vurdering**

Begge kan sandsynligvis løse kravet, men LangGraph gør designet tydeligere og lettere at dokumentere som arkitektur.

### 6. Failure modes

**CrewAI**

Typiske risici:

- uklare artifact handoffs
- lineære flows der er svære at reparere midt i processen
- mindre eksplicit state ved fejl

**LangGraph**

Typiske risici:

- mere kompleks kode
- flere steder at konfigurere forkert
- kræver disciplin i state-design

Men til gengæld er failures lettere at observere og rute omkring.

**Vurdering**

LangGraph giver bedre kontrol over det der bryder først, og bedre mulighed for recovery-logik.

### 7. Predictability and control

**CrewAI**

Muligt, men kræver ekstra design for at blive afleveringsstærkt.

**LangGraph**

Stærkt match, fordi flow og state er eksplicit defineret.

**Vurdering**

LangGraph er klart bedst her.

### 8. Reproducibility

**CrewAI**

Kan bruges reproducerbart, men strukturen bliver hurtigere implicit.

**LangGraph**

Lettere at dokumentere run-sekvens, state-overgange og artifacts som reviewable outputs.

**Vurdering**

LangGraph er bedst.

### 9. Context management

**CrewAI**

Muligt, men kræver mere forklaring og ekstern disciplin.

**LangGraph**

Meget stærkt, fordi stateobjektet kan bruges som eksplicit kontrakt for hvad der sendes videre mellem trin.

**Vurdering**

LangGraph er bedst.

### 10. Skalerbarhed når projektet vokser

**CrewAI**

Kan blive mere uoverskueligt, hvis mange roller, artefakter og iterationsstier skal håndteres.

**LangGraph**

Bedre egnet til større workflows med flere noder og mere kompleks styring.

**Vurdering**

LangGraph er bedst.

## Samlet sammenligning

| Kriterium | CrewAI | LangGraph |
|---|---|---|
| Hurtig første demo | Stærk | Acceptabel |
| Enkelhed | Stærk | Middel |
| Workflow-kontrol | Middel | Stærk |
| State management | Svagere | Stærk |
| Iteration og routing | Middel | Stærk |
| Multi-endpoint arkitektur | Mulig | Stærk |
| Reproducérbarhed | Middel | Stærk |
| Context management | Middel | Stærk |
| Egnet til aflevering | Middel | Stærk |

## Anbefaling

Den anbefalede løsning til resten af opgaven er **LangGraph**.

### Hvorfor LangGraph er det bedste valg

1. Opgaven handler ikke kun om at få en agent-demo til at køre, men om at kunne argumentere for en kontrolleret, reproducerbar og skalerbar workflow-arkitektur.
2. LangGraph gør state, transitions og failure handling tydelige, hvilket gør det lettere at opfylde de ikke-funktionelle krav.
3. LangGraph er lettere at udvide til en løsning med:
   - flere artefakter
   - flere workers
   - tydelige review-loops
   - multi-endpoint routing
4. Det bliver lettere at forklare i både rapport og slides, hvorfor workflowet er robust.

## Hvordan CrewAI stadig bruges i afleveringen

CrewAI bør stadig indgå som den sammenlignede kandidat.

Det giver en troværdig evaluering:

- CrewAI som hurtig og enkel agent-opsætning
- LangGraph som den mere kontrollerede og afleveringsstærke løsning

Det gør anbefalingen mere overbevisende, fordi den bliver et reelt valg mellem to plausible open source værktøjer.

## Afleveringsstatus

Sammenligningen bruges som beslutningsgrundlag for den endelige anbefaling. Den tilhørende LangGraph-arkitektur, setup-guide og requirement mapping ligger i samme `delivery_docs/` mappe og viser, hvordan anbefalingen er omsat til en reproducerbar workflow-løsning.
