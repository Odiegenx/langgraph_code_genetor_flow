# Full context for later: Agent Workflow Dashboard

This document captures the full idea, motivation, architecture, and intended scope for a future Agent Workflow Dashboard.

The purpose is to preserve the context so the project can be resumed later without having to reconstruct the discussion.

## Current exam project context

The main exam project is currently:

```text
exam project/rag_study_assistant/
```

The main product is a Local RAG Study Assistant:

- local web app
- local/Ollama model access
- RAG over local study documents
- 4T prompt engineering
- visible sources/citations
- setup and validation documentation

The Agent Workflow Dashboard is not the main exam product right now. It is a future idea for managing agent-assisted software development.

## Core idea

The idea is to build a local workflow system where a user can describe a software project, and agents can help turn that idea into:

- project documentation
- requirements
- architecture notes
- acceptance criteria
- tickets
- implementation tasks
- validation output
- review notes
- final delivery documentation

The long-term version could integrate with tools like:

- Jira / Atlassian
- GitHub Issues
- Git branches
- pull requests
- automated tests
- autonomous coding agents

However, the recommended MVP should not start with Jira/GitHub integration. It should start locally with simple files and a small dashboard.

## Why not start with Jira/GitHub immediately

A full Jira/GitHub/autonomous-agent setup is interesting, but too large and integration-heavy for the current stage.

Main risks:

- API authentication can take a lot of time.
- Webhooks and background listeners add complexity.
- Branch and merge handling can become the main problem instead of the software product.
- Multiple autonomous agents require robust coordination.
- It can distract from the RAG Study Assistant exam requirements.

The better approach is to first build a local version that proves the workflow concept.

## Recommended first architecture

Use a simple local folder structure as the source of truth:

```text
agent_workflow_dashboard/
  project_management/
    backlog/
    in_progress/
    to_test/
    to_review/
    done/
```

Each ticket is a JSON file. Moving a ticket from one column to another is just moving the JSON file between folders.

This gives a local Kanban-style workflow without needing external services.

## Planned dashboard

The dashboard should eventually show:

- board columns
- ticket cards
- ticket details
- priority
- acceptance criteria
- affected files
- validation command
- branch name
- review notes
- status changes

The first UI should be intentionally small:

1. Show all board columns.
2. Read tickets from local JSON files.
3. Show ticket details.
4. Create a new ticket.
5. Move a ticket between columns.

No agent execution is needed in the first version.

## Possible future agent roles

Later, the dashboard could support explicit agent roles.

### Planner

Input:

- project request
- user clarifying answers

Output:

- MVP definition
- architecture
- acceptance criteria
- tickets
- test strategy

### Implementer

Input:

- one ticket
- affected files
- current project code

Output:

- code changes
- implementation note
- updated ticket status

### Tester

Input:

- ticket
- implementation branch or working tree
- validation command

Output:

- test files
- validation output
- pass/fail assessment

### Reviewer

Input:

- ticket
- acceptance criteria
- code changes
- validation output

Output:

- review note
- verdict
- required fixes
- done/rework decision

### Docs agent

Input:

- final product
- architecture
- validation output
- accepted tickets

Output:

- README
- setup guide
- runbook
- user guide
- limitations

## Preferred architecture for agent execution

Use:

```text
Frontend
  -> Backend API
  -> Explicit local tools
  -> Model/API/Ollama
```

Avoid:

```text
Frontend
  -> opening a terminal
  -> trying to control a CLI agent
```

Terminal automation is fragile because:

- output is hard to parse reliably
- it is hard to know when the CLI is waiting for input
- approval prompts are difficult to handle
- state management becomes unclear
- command safety is harder to control

The backend should expose safe operations directly.

Examples:

- list tickets
- create ticket
- move ticket
- read ticket
- update ticket
- run validation command
- write review note
- read selected project files

## Relationship to the current LangGraph workflow

The existing LangGraph workflow generates projects from input requests.

The future dashboard would solve a different problem:

- not generation from scratch
- but managing changes after a project exists

This matters because the generated RAG Study Assistant now works, but future changes should not require rerunning the whole generation flow.

Example:

```text
Ticket: Add re-ingest button
  -> implement only templates/index.html and static/app.js
  -> run validate_project.py
  -> review against acceptance criteria
  -> move ticket to done
```

## Current starter tickets

Three starter tickets already exist:

```text
project_management/backlog/RAG-001-reingest-button.json
project_management/backlog/RAG-002-document-status.json
project_management/backlog/RAG-003-loading-state.json
```

These are intended for improving the RAG Study Assistant.

## Suggested next step when resuming this idea

When returning to this idea later, start with this narrow MVP:

Build a local dashboard that reads JSON tickets from:

```text
project_management/backlog/
project_management/in_progress/
project_management/to_test/
project_management/to_review/
project_management/done/
```

The first version should not run agents. It should only show and move tickets.

Suggested tech stack:

- Python Flask backend
- simple HTML/CSS/JavaScript frontend
- JSON files as storage

Suggested folder structure:

```text
agent_workflow_dashboard/
  app.py
  templates/
    index.html
  static/
    app.js
    styles.css
  project_management/
    backlog/
    in_progress/
    to_test/
    to_review/
    done/
```

## Why this idea is still useful

Even if it is not built now, it is a strong future direction because it makes agent-assisted development visible and auditable.

It can show:

- why a change exists
- which acceptance criteria it targets
- which files were affected
- which validation command was run
- who/what reviewed it
- why it was considered done

This is more explainable than a black-box "AI generated code" process.

## Current decision

Do not build this fully now.

Current priority:

```text
Improve the Local RAG Study Assistant directly.
```

The dashboard idea is parked in this folder for later.
