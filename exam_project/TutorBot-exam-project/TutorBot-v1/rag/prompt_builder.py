from pathlib import Path

ANSWER_MODES = {
    "rag": "RAG only",
    "model": "Model only",
    "hybrid": "Hybrid"
}

def load_prompt_template(path):
    template_path = Path(path)
    if not template_path.exists():
        raise FileNotFoundError(f"Prompt template not found at {template_path}")
    with open(template_path, "r", encoding="utf-8") as f:
        return f.read()

def fill_prompt_template(template, **values):
    prompt = template
    for key, value in values.items():
        prompt = prompt.replace(f"{{{key}}}", str(value))
    return prompt

class PromptBuilder:
    def __init__(
        self,
        rag_template_path="prompts/rag_4t_prompt.md",
        rag_addendum_path="prompts/rag_answer_addendum.md",
        direct_template_path="prompts/direct_answer_prompt.md",
        hybrid_template_path="prompts/hybrid_answer_prompt.md"
    ):
        self.rag_template = load_prompt_template(rag_template_path)
        self.rag_addendum_template = load_prompt_template(rag_addendum_path)
        self.direct_template = load_prompt_template(direct_template_path)
        self.hybrid_template = load_prompt_template(hybrid_template_path)

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

    def _format_summary(self, conversation_summary):
        summary = str(conversation_summary or "").strip()
        return summary if summary else "No conversation summary."

    def _format_context(self, context_chunks):
        if not context_chunks:
            return "No relevant document context was retrieved."
        return "\n\n".join(
            f"[Source: {chunk['source']}]\n{chunk['content']}"
            for chunk in context_chunks
        )

    def _format_personality(self, personality_instruction):
        instruction = str(personality_instruction or "").strip()
        return instruction if instruction else "Use the default study assistant behavior."

    def build_direct_prompt(self, question, conversation=None, conversation_summary="", personality_instruction=""):
        """Build a prompt that relies solely on the model's own knowledge."""
        return fill_prompt_template(
            self.direct_template,
            personality_instruction=self._format_personality(personality_instruction),
            conversation_summary=self._format_summary(conversation_summary),
            conversation_history=self._format_conversation(conversation),
            question=question
        )

    def build_prompt(self, context_chunks, question, conversation=None, conversation_summary="", personality_instruction=""):
        """
        Inserts context and question into the 4T prompt template.
        
        Args:
            context_chunks (list): List of dicts with 'content' and 'source'
            question (str): User's query
            
        Returns:
            str: Filled prompt ready for LLM
        """
        context_text = self._format_context(context_chunks)
        prompt = fill_prompt_template(
            self.rag_template,
            context=context_text,
            question=question
        )
        addendum = fill_prompt_template(
            self.rag_addendum_template,
            personality_instruction=self._format_personality(personality_instruction),
            conversation_summary=self._format_summary(conversation_summary),
            conversation_history=self._format_conversation(conversation)
        )
        return (
            f"{prompt}\n\n"
            f"{addendum}"
        )

    def build_hybrid_prompt(self, context_chunks, question, conversation=None, conversation_summary="", personality_instruction=""):
        """Build a prompt that uses documents first and separates model knowledge."""
        return fill_prompt_template(
            self.hybrid_template,
            personality_instruction=self._format_personality(personality_instruction),
            conversation_summary=self._format_summary(conversation_summary),
            conversation_history=self._format_conversation(conversation),
            context=self._format_context(context_chunks),
            question=question
        )
