import os
from pathlib import Path

class PromptBuilder:
    def __init__(self, template_path="prompts/rag_4t_prompt.md"):
        self.template_path = Path(template_path)
        if not self.template_path.exists():
            raise FileNotFoundError(f"Prompt template not found at {self.template_path}")
        with open(self.template_path, "r", encoding="utf-8") as f:
            self.template = f.read()

    def build_direct_prompt(self, question):
        """Build a prompt that relies solely on the model's own knowledge."""
        return (
            "You are a knowledgeable study assistant. Answer the following question using "
            "your own knowledge. Be clear, educational, and concise.\n\n"
            f"Question: {question}\n\nAnswer:"
        )

    def build_prompt(self, context_chunks, question):
        """
        Inserts context and question into the 4T prompt template.
        
        Args:
            context_chunks (list): List of dicts with 'content' and 'source'
            question (str): User's query
            
        Returns:
            str: Filled prompt ready for LLM
        """
        context_text = "\n\n".join(
            f"[Source: {chunk['source']}]\n{chunk['content']}"
            for chunk in context_chunks
        )
        prompt = self.template.replace("{context}", context_text)
        prompt = prompt.replace("{question}", question)
        return prompt
