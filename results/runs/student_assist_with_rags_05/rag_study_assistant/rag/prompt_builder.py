import os
from typing import List, Dict

def load_prompt_template(template_path: str = "prompts/rag_4t_prompt.md") -> str:
    """Load the 4T prompt template from file."""
    if not os.path.exists(template_path):
        raise FileNotFoundError(f"Prompt template not found at {template_path}")
    
    with open(template_path, 'r', encoding='utf-8') as f:
        return f.read()

def format_context(chunks: List[Dict]) -> str:
    """Format retrieved chunks into context string with citations."""
    if not chunks:
        return "No relevant context found."
    
    formatted = []
    for i, chunk in enumerate(chunks, 1):
        source = chunk.get('source_file', 'unknown')
        text = chunk.get('text', '').strip()
        formatted.append(f"[{i}] Source: {source}\nContent: {text}")
    
    return "\n\n".join(formatted)

def build_rag_prompt(
    question: str,
    retrieved_chunks: List[Dict],
    template: str = None
) -> str:
    """Build a 4T prompt using Traits, Task, Tone, Target structure.
    
    Args:
        question: User's query
        retrieved_chunks: Context chunks from retrieval step
        template: Optional custom template (defaults to loading from file)
    
    Returns:
        Formatted prompt string ready for LLM
    """
    if template is None:
        template = load_prompt_template()
    
    context = format_context(retrieved_chunks)
    
    # Fill in the 4T sections
    prompt = template.format(
        traits="You are a helpful study assistant with access to course materials.",
        task=f"Answer the following question based on the provided context: {question}",
        tone="Be concise, factual, and cite your sources clearly.",
        target="Provide an educational response suitable for students.",
        context=context,
        question=question
    )
    
    return prompt
