# Design notes

## Problem

The current LangGraph workflow can generate a project from a request, but once the generated project exists, smaller changes still need to be managed manually.

A local workflow dashboard could make this process more visible:

- what needs to be built
- what is being implemented
- what needs testing
- what needs review
- what is done

## Proposed local workflow

```text
Project request
  -> planning documents
  -> tickets
  -> implementation
  -> validation
  -> review
  -> done
```

## Board columns

```text
backlog
in_progress
to_test
to_review
done
```

## Ticket format

Recommended first version: JSON.

Example:

```json
{
  "id": "RAG-001",
  "title": "Add re-ingest button",
  "priority": "high",
  "status": "backlog",
  "description": "Add a UI button that calls the existing /api/ingest endpoint.",
  "acceptance_criteria": [
    "The user can click a button in the browser to re-ingest documents.",
    "The UI shows success or failure status.",
    "No existing RAG behavior is broken."
  ],
  "affected_files": [
    "templates/index.html",
    "static/app.js"
  ],
  "validation_command": "python validate_project.py",
  "branch_name": "feature/RAG-001-reingest-button"
}
```

## Agent roles

The dashboard can later support these roles:

- Planner: creates docs and tickets from a project request.
- Implementer: changes code for one ticket.
- Tester: writes or runs tests/validation.
- Reviewer: checks if the change matches the ticket and acceptance criteria.
- Docs agent: updates README/runbook/user guide.

## Important design decision

The frontend should not control a terminal directly.

Preferred architecture:

```text
Frontend
  -> Backend API
  -> Explicit tools
```

Avoid:

```text
Frontend
  -> terminal automation
  -> parse CLI output
```

The backend should expose safe operations such as:

- list tickets
- create ticket
- move ticket
- read project file
- run validation command
- write review note

## Exam relevance

This dashboard is not required for the RAG exam MVP.

It can be described as a future improvement or supporting development tool:

> A lightweight local workflow layer could make agent-assisted development more transparent by turning generated requirements into tickets, validation results, and review artifacts.
