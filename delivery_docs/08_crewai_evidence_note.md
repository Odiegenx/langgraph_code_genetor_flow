# CrewAI Evidence Note

## Purpose

This note documents how CrewAI was used in the assignment as the second evaluated workflow candidate.

## Location

The old CrewAI prototype is stored here:

```text
legacy/snake_prototype/crewai_pipeline.py
```

Related prototype outputs are stored here:

```text
legacy/snake_prototype/Snake/first iteration/crewai_snake.html
legacy/snake_prototype/Snake/first iteration/crewai_output.txt
```

The comparable early LangGraph prototype from the same phase is stored here:

```text
legacy/snake_prototype/langgraph_pipeline.py
legacy/snake_prototype/Snake/first iteration/langgraph_snake.html
legacy/snake_prototype/Snake/first iteration/langgraph_output.txt
```

## What The CrewAI Prototype Demonstrated

The prototype used a sequential CrewAI crew with these roles:

- Software Planner
- Frontend Developer
- QA Engineer
- Tech Lead

It generated a small single-file Snake game and a text output containing plan, code, test report, and review.

## Why CrewAI Was Not Chosen For The Final Workflow

CrewAI was useful as a quick role-based agent prototype, but the final assignment needed stronger control over:

- explicit state handoff
- per-role endpoint/model routing
- generated artifact persistence
- bounded validation-fix loops
- bounded reviewer-fix loops
- per-run output folders
- request-folder input flow with clarifying questions and answers

LangGraph was therefore selected for the full implementation because its explicit graph/state model made those requirements easier to implement and document.

## How This Supports The Assignment

The assignment asks for at least two candidate approaches to be evaluated and one to be recommended.

CrewAI is the evaluated comparison candidate. LangGraph is the recommended and fully implemented candidate.

The detailed comparison is documented in:

```text
delivery_docs/01_toolchain_comparison.md
docs/adr-001-toolchain-choice.md
```
