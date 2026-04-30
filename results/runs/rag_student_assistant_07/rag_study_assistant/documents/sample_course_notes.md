# LLM for Developers - Course Notes

## Introduction to Large Language Models

Large Language Models (LLMs) are deep learning models trained on massive text datasets to understand and generate human-like text. They use transformer architectures and attention mechanisms to process language contextually.

### Key Concepts:
- **Transformer Architecture**: Uses self-attention to weigh importance of different words in a sentence.
- **Pre-training**: Models learn general language patterns by predicting masked words or next tokens.
- **Fine-tuning**: Adapting pre-trained models to specific tasks with smaller labeled datasets.

## Retrieval-Augmented Generation (RAG)

RAG enhances LLMs by connecting them with external knowledge sources. Instead of relying solely on internal parameters, RAG retrieves relevant documents before generating responses.

### How RAG Works:
1. **Retrieve**: Search an index for relevant documents based on the input query.
2. **Augment**: Add retrieved documents as context to the original prompt.
3. **Generate**: Use the augmented prompt to produce a more informed response.

This approach allows models to provide up-to-date and source-grounded answers while reducing hallucinations.

## Prompt Engineering Basics

Effective prompting guides LLM behavior without retraining. Structured templates help ensure consistent and reliable outputs.

### 4T Prompt Framework:
- **Traits**: Define desired qualities (e.g., precise, honest).
- **Task**: Specify what the model should do (e.g., answer using provided context).
- **Tone**: Set communication style (e.g., educational, concise).
- **Target**: Identify audience (e.g., computer science students).

Example:
> Traits: Be precise and source-grounded  
> Task: Answer using only the provided course material  
> Tone: Clear and educational  
> Target: A student studying LLM applications  

Using such structured prompts improves accuracy and relevance of generated content.

## Evaluation Metrics for LLMs

Measuring LLM performance involves both automated metrics and qualitative assessments.

### Common Metrics:
- **BLEU Score**: Measures overlap between generated and reference texts.
- **ROUGE Score**: Evaluates summarization quality against references.
- **Perplexity**: Assesses how well a model predicts sample text; lower is better.
- **Human Evaluation**: Judges relevance, coherence, and factual correctness.

Balancing quantitative scores with user feedback ensures practical usability of LLM systems.
