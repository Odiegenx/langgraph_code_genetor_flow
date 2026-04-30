# Delivery Status

## Formål

Dette dokument opsummerer, hvilke dele af afleveringen der er dækket i repoet, og hvor den konkrete evidens ligger.

## Overordnet løsning

Den endelige løsning bruger LangGraph som workflow-motor og lokale Ollama-kompatible model-endpoints. CrewAI er bevaret som sammenligningskandidat, så opgaven dokumenterer både et alternativ og den valgte løsning.

LangGraph-løsningen er valgt, fordi den giver tydelig state, eksplicit routing mellem roller, konfigurerbare endpoints, løbende artefaktskrivning og bounded fix-loops.

## Afleveringsstruktur

De vigtigste afleveringsfiler ligger her:

- `delivery_docs/01_toolchain_comparison.md`
- `delivery_docs/02_workflow_architecture.md`
- `delivery_docs/04_setup_guide.md`
- `delivery_docs/05_requirement_mapping.md`
- `delivery_docs/06_demo_scope.md`
- `delivery_docs/07_readiness_check.md`
- `delivery_docs/08_crewai_evidence_note.md`
- `docs/`
- `results/runs/`

## Workflow-implementering

Hovedflowet ligger i:

```text
langgraph_workflow.py
```

Input-prep flowet ligger i:

```text
prepare_workflow_inputs.py
```

Wrapperen til nem kørsel ligger i:

```text
flow.cmd
flow.ps1
```

## Dækkede krav

Repoet dækker følgende centrale krav fra opgaven:

- evaluering af mindst to open source workflow-tilgange
- anbefaling af én tilgang
- lokal multi-LLM workflow med mindst to endpoints
- rollebaseret workflow med architect, tech lead, coders, QA, docs, deployment validator og reviewer
- multi-file software generation
- test/validation output
- quality report
- dokumentation og runbook
- deployment checklist
- state handoff og artifact-baseret workflow
- reproducerbar setup-guide
- evidens fra konkrete runs

## Primær demo-evidens

Et stærkt reference-run ligger i:

```text
results/runs/website-prep-demo-11/
```

Det run demonstrerer:

- request-baseret input-generering
- afklarende spørgsmål og svar
- automatisk genererede workflow-inputs
- generation af et browser-games projekt
- validation
- QA report
- docs/runbook
- deployment checklist
- reviewer-fix loop
- endeligt reviewer-resultat

Et Java/Maven reference-run ligger i:

```text
results/runs/20260411_191854/
```

Det run demonstrerer Maven-test, package-output og manuel runtime-test af et generated task tracker CLI-projekt.

## CrewAI-evidens

CrewAI-prototypen ligger i:

```text
legacy/snake_prototype/crewai_pipeline.py
```

Den tilhørende evidens er beskrevet i:

```text
delivery_docs/08_crewai_evidence_note.md
```

CrewAI bruges som evalueret kandidat, mens LangGraph er den anbefalede og videreudviklede løsning.

## Reproducerbarhed

En ny bruger kan følge:

```text
delivery_docs/04_setup_guide.md
```

Guiden beskriver:

- installation
- lokal modelopsætning
- `.env` konfiguration
- request-mapper
- generering af afklarende spørgsmål
- start af workflow
- validation og troubleshooting

## Konklusion

Afleveringspakken er struktureret omkring LangGraph som anbefalet løsning, CrewAI som sammenligningskandidat og konkrete run-artefakter som teknisk evidens. De resterende præsentationsslides kan bygges direkte på disse dokumenter og de dokumenterede run-resultater.
