# Agent Workflow Dashboard

This folder is a separate concept project for a local workflow dashboard.

The goal is to explore how a developer could manage an agent-assisted software process without depending on Jira/GitHub automation in the first MVP.

This is not the main exam product. The main exam product is currently:

```text
exam project/rag_study_assistant/
```

## Idea

Build a small local dashboard that can manage development tasks and connect them to an agent workflow.

The dashboard should eventually support:

- writing or importing a project request
- generating planning documents
- creating tickets
- moving tickets through a board
- connecting tickets to branches or implementation notes
- running validation commands
- storing review results

## Recommended MVP

Do not start with Jira, GitHub webhooks, or autonomous background agents.

Start with local files:

```text
project_management/
  backlog/
  in_progress/
  to_test/
  to_review/
  done/
```

Each ticket can be a Markdown or JSON file. Moving a ticket between columns can be implemented as moving the file between folders.

## Why local files first

Local files are:

- easy to inspect
- easy to version
- easy to debug
- simple to explain
- safe for an exam MVP

The same structure can later be mapped to Jira issues, GitHub issues, branches, and pull requests.

## Possible future architecture

```text
Browser UI
  -> local backend
  -> project_management files
  -> agent actions
  -> validation commands
  -> review reports
```

The backend should own all file and command access. The frontend should not try to control a terminal directly.

## First implementation target

The first useful version should only do this:

1. Show board columns.
2. Show tickets from local files.
3. Create a new ticket.
4. Move a ticket between columns.
5. Show ticket details.

Agent execution can come later.
