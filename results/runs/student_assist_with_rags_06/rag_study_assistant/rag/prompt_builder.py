from pathlib import Path


class PromptBuilder:
    def __init__(self, template_path="prompts/rag_4t_prompt.md"):
        self.template_path = Path(template_path)
        self.template = self._load_template()

    def _load_template(self):
        """Load the 4T prompt template from file."""
        try:
            with open(self.template_path, "r", encoding="utf-8") as f:
                return f.read()
        except FileNotFoundError:
            raise FileNotFoundError(f"Prompt template not found at {self.template_path}")

    def build_prompt(self, question: str, context_chunks: list) -> str:
        """
        Build a formatted prompt using the 4T template.

        Args:
            question (str): User's question
            context_chunks (list): Retrieved context chunks with metadata

        Returns:
            str: Formatted prompt string
        """
        # Format context
        context_text = "\n\n".join(
            [f"[{chunk['id']}] {chunk['content']}" for chunk in context_chunks]
        ) if context_chunks else "No relevant context found."

        # Inject into template (using correct placeholders)
        prompt = self.template.replace("{question}", question)
        prompt = prompt.replace("{context}", context_text)
        return prompt.strip()
