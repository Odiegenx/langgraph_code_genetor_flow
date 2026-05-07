import os
from pathlib import Path

ANSWER_MODES = {
    "rag": "RAG only",
    "model": "Model only",
    "hybrid": "Hybrid"
}

class PromptBuilder:
    def __init__(self, template_path="prompts/rag_4t_prompt.md"):
        self.template_path = Path(template_path)
        if not self.template_path.exists():
            raise FileNotFoundError(f"Prompt template not found at {self.template_path}")
        with open(self.template_path, "r", encoding="utf-8") as f:
            self.template = f.read()

    def _format_conversation(self, conversation):
        if not conversation:
            return "No previous conversation."

        lines = []
        for message in conversation[-6:]:
            role = message.get("role", "user")
            content = str(message.get("content", "")).strip()
            if content:
                lines.append(f"{role.title()}: {content}")
        return "\n".join(lines) if lines else "No previous conversation."

    def _format_context(self, context_chunks):
        if not context_chunks:
            return "No relevant document context was retrieved."
        return "\n\n".join(
            f"[Source: {chunk['source']}]\n{chunk['content']}"
            for chunk in context_chunks
        )

    def build_direct_prompt(self, question, conversation=None):
        """Build a prompt that relies solely on the model's own knowledge."""
        return (
            "You are a knowledgeable study assistant. Answer the following question using "
            "your own knowledge. Be clear, educational, and concise.\n\n"
            "Conversation history:\n"
            f"{self._format_conversation(conversation)}\n\n"
            "Important: Do not cite local documents in this mode because no document "
            "context is being provided.\n\n"
            f"Question: {question}\n\nAnswer:"
        )

    def build_prompt(self, context_chunks, question, conversation=None):
        """
        Inserts context and question into the 4T prompt template.
        
        Args:
            context_chunks (list): List of dicts with 'content' and 'source'
            question (str): User's query
            
        Returns:
            str: Filled prompt ready for LLM
        """
        context_text = self._format_context(context_chunks)
        prompt = self.template.replace("{context}", context_text)
        prompt = prompt.replace("{question}", question)
        return (
            f"{prompt}\n\n"
            "Conversation history:\n"
            f"{self._format_conversation(conversation)}\n\n"
            "Guardrail: Answer only from the retrieved document context. If the context "
            "does not contain enough information, say that the documents do not cover it."
        )

    def build_hybrid_prompt(self, context_chunks, question, conversation=None):
        """Build a prompt that uses documents first and separates model knowledge."""
        return (
            "You are a careful study assistant using hybrid RAG.\n\n"
            "Traits:\n"
            "- Source-grounded when using local documents.\n"
            "- Honest about what is and is not in the documents.\n"
            "- Clear and educational.\n\n"
            "Task:\n"
            "Answer the student's question. Use the retrieved document context as the "
            "primary source. You may supplement with general model knowledge only when "
            "it helps explain the answer.\n\n"
            "Guardrails:\n"
            "- Clearly separate document-based information from general model knowledge.\n"
            "- Do not invent citations.\n"
            "- Only cite sources from the retrieved document context.\n"
            "- If the documents do not cover part of the question, say so before adding "
            "general model knowledge.\n\n"
            "Required response format:\n"
            "Based on your documents:\n"
            "...\n\n"
            "Additional model knowledge:\n"
            "...\n\n"
            "Sources:\n"
            "- list only retrieved document sources used\n\n"
            "Conversation history:\n"
            f"{self._format_conversation(conversation)}\n\n"
            "Retrieved document context:\n"
            f"{self._format_context(context_chunks)}\n\n"
            f"Question: {question}\n\n"
            "Answer:"
        )
