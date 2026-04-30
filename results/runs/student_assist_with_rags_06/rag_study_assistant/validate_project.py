import os
import sys
import importlib.util
from pathlib import Path

OUTPUT_FILE = "site_validation_output.txt"

def write_result(message):
    with open(OUTPUT_FILE, "a") as f:
        f.write(message + "\n")
    print(message)

def check_file_exists(filepath):
    if os.path.exists(filepath):
        write_result(f"✅ EXISTS: {filepath}")
        return True
    else:
        write_result(f"❌ MISSING: {filepath}")
        return False

def validate_python_import(module_path):
    try:
        spec = importlib.util.spec_from_file_location("module", module_path)
        module = importlib.util.module_from_spec(spec)
        sys.modules["module"] = module
        spec.loader.exec_module(module)
        write_result(f"✅ IMPORTS: {module_path}")
        return True
    except Exception as e:
        write_result(f"❌ IMPORT FAIL: {module_path} - {str(e)}")
        return False

def validate_4t_prompt(prompt_path):
    try:
        with open(prompt_path, 'r') as f:
            content = f.read()
        required_sections = ["Traits:", "Task:", "Tone:", "Target:"]
        missing = [section for section in required_sections if section not in content]
        if not missing:
            write_result(f"✅ 4T PROMPT VALID: {prompt_path}")
            return True
        else:
            write_result(f"❌ 4T PROMPT INVALID: Missing sections {missing} in {prompt_path}")
            return False
    except Exception as e:
        write_result(f"❌ 4T PROMPT READ ERROR: {prompt_path} - {str(e)}")
        return False

def main():
    open(OUTPUT_FILE, 'w').close()  # Clear previous output
    write_result("=== PROJECT VALIDATION REPORT ===")

    # Required files (relative paths now)
    required_files = [
        "app.py",
        "rag/ingest.py",
        "rag/retrieve.py",
        "rag/prompt_builder.py",
        "rag/ollama_client.py",
        "prompts/rag_4t_prompt.md",
        "documents/sample_course_notes.md",
        "requirements.txt"
    ]

    all_valid = True

    # Check file existence
    for filepath in required_files:
        if not check_file_exists(filepath):
            all_valid = False

    # Validate 4T prompt structure
    prompt_file = "prompts/rag_4t_prompt.md"
    if not validate_4t_prompt(prompt_file):
        all_valid = False

    # Validate Python imports
    py_modules = [
        "app.py",
        "rag/ingest.py",
        "rag/retrieve.py",
        "rag/prompt_builder.py",
        "rag/ollama_client.py"
    ]
    for mod in py_modules:
        if not validate_python_import(mod):
            all_valid = False

    # Final result
    if all_valid:
        write_result("\n🎉 ALL VALIDATIONS PASSED")
    else:
        write_result("\n⚠️ SOME VALIDATIONS FAILED")

if __name__ == "__main__":
    main()
