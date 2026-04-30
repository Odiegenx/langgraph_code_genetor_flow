import os
import sys
import importlib.util

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = "site_validation_output.txt"

REQUIRED_DIRS = [
    "rag", "prompts", "documents", "index", 
    "static", "templates", "docs"
]

REQUIRED_FILES = [
    "app.py",
    "rag/ingest.py",
    "rag/retrieve.py",
    "rag/prompt_builder.py",
    "rag/ollama_client.py",
    "prompts/rag_4t_prompt.md",
    "documents/sample_course_notes.md",
    "requirements.txt"
]

REQUIRED_PROMPT_SECTIONS = [
    "Traits:",
    "Task:",
    "Tone:",
    "Target:"
]

def check_directories():
    missing_dirs = []
    for d in REQUIRED_DIRS:
        if not os.path.isdir(os.path.join(PROJECT_ROOT, d)):
            missing_dirs.append(d)
    return missing_dirs

def check_files():
    missing_files = []
    for f in REQUIRED_FILES:
        if not os.path.isfile(os.path.join(PROJECT_ROOT, f)):
            missing_files.append(f)
    return missing_files

def check_prompt_sections():
    prompt_path = os.path.join(PROJECT_ROOT, "prompts", "rag_4t_prompt.md")
    if not os.path.exists(prompt_path):
        return False
    with open(prompt_path, 'r') as pf:
        content = pf.read()
        for section in REQUIRED_PROMPT_SECTIONS:
            if section not in content:
                return False
    return True

def check_imports():
    modules = [
        "flask",
        "pypdf",
        "requests"
    ]
    missing_modules = []
    for mod in modules:
        if importlib.util.find_spec(mod) is None:
            missing_modules.append(mod)
    return missing_modules

def write_output(results):
    with open(OUTPUT_FILE, 'w') as f:
        f.write("Project Validation Report\n")
        f.write("========================\n\n")

        f.write("Directory Check:\n")
        if results["dirs"]:
            f.write(f"  Missing directories: {', '.join(results['dirs'])}\n")
        else:
            f.write("  All required directories present.\n")

        f.write("\nFile Check:\n")
        if results["files"]:
            f.write(f"  Missing files: {', '.join(results['files'])}\n")
        else:
            f.write("  All required files present.\n")

        f.write("\nPrompt Section Check:\n")
        if results["prompt_valid"]:
            f.write("  4T prompt contains all required sections.\n")
        else:
            f.write("  4T prompt is missing required sections or file.\n")

        f.write("\nModule Import Check:\n")
        if results["imports"]:
            f.write(f"  Missing modules: {', '.join(results['imports'])}\n")
        else:
            f.write("  All required modules can be imported.\n")

if __name__ == "__main__":
    results = {
        "dirs": check_directories(),
        "files": check_files(),
        "prompt_valid": check_prompt_sections(),
        "imports": check_imports()
    }

    write_output(results)

    print(f"Validation complete. Results written to {OUTPUT_FILE}")
