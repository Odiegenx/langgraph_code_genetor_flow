# Conversation Summary Prompt: Local RAG Study Assistant

Summarize this conversation for future context in a local study assistant.

## Preserve
- The user's learning goals.
- Important facts already discussed.
- Unresolved questions.
- Decisions or preferences that matter for future answers.

## Rules
- Do not add new facts.
- Do not invent sources.
- Keep it concise.
- Keep the updated summary under {summary_max_chars} characters.
- This summary is memory only, not evidence.

## Existing Summary
{existing_summary}

## Messages To Merge Into The Summary
{messages_to_merge}

## Updated Summary
