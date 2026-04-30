import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process, LLM

load_dotenv()

llm = LLM(
    model=f"ollama/{os.getenv('MODEL_NAME', 'qwen3:8b')}",
    base_url=os.getenv("CREWAI_ENDPOINT", "http://localhost:11434"),
)

# ── Agents ────────────────────────────────────────────────────
planner = Agent(
    role="Software Planner",
    goal="Break down the task into a clear, ordered implementation plan.",
    backstory="You are a senior developer who writes tight, practical plans.",
    llm=llm,
    verbose=True,
)

coder = Agent(
    role="Frontend Developer",
    goal="Implement the plan as a complete, playable Snake game in a single HTML file using HTML, CSS, and JavaScript.",
    backstory="You write self-contained HTML pages. Everything goes in one file — no external dependencies.",
    llm=llm,
    verbose=True,
)

tester = Agent(
    role="QA Engineer",
    goal="Review the HTML/JS code for correctness without running it. Check for missing game logic, JS errors, and broken structure.",
    backstory=(
        "You review front-end code statically. You check for: "
        "a working game loop, canvas setup, keyboard input handling, "
        "collision detection, score display, and game-over state."
    ),
    llm=llm,
    verbose=True,
)

reviewer = Agent(
    role="Tech Lead",
    goal="Give a final verdict: is this ready to open in a browser, and what would you improve?",
    backstory="You have seen many projects fail from small oversights. You are direct.",
    llm=llm,
    verbose=True,
)

# ── Tasks ─────────────────────────────────────────────────────
TASK = "Build a Snake game in a single HTML file."

plan_task = Task(
    description=f"Create an implementation plan for: {TASK}",
    expected_output="A numbered plan with 5-8 concrete steps.",
    agent=planner,
)

code_task = Task(
    description=(
        "Implement the plan from the previous step as a complete Snake game. "
        "Return the full HTML file content in a single code block."
    ),
    expected_output="A complete snake.html file in a single HTML code block.",
    agent=coder,
    context=[plan_task],
)

test_task = Task(
    description=(
        "Review the HTML/JS code from the previous step without running it. "
        "Check for the following and report on each:\n"
        "- Is there a valid HTML structure (doctype, head, body)?\n"
        "- Is a <canvas> element used for rendering?\n"
        "- Is there a game loop (setInterval or requestAnimationFrame)?\n"
        "- Is keyboard input handled (arrow keys or WASD)?\n"
        "- Is collision detection present (walls and self)?\n"
        "- Is the score displayed and updated?\n"
        "- Is there a game-over state?\n"
        "- Are there any obvious JavaScript errors (undefined variables, syntax issues)?"
    ),
    expected_output="A checklist with pass/fail for each point, plus a summary of the most critical issues.",
    agent=tester,
    context=[code_task],
)

review_task = Task(
    description=(
        "Read the plan, code, and test findings. "
        "Give a final verdict: ready to open in a browser, or needs changes? "
        "List the top 3 things you would improve."
    ),
    expected_output="A short verdict paragraph followed by 3 improvement points.",
    agent=reviewer,
    context=[plan_task, code_task, test_task],
)

# ── Run ───────────────────────────────────────────────────────
crew = Crew(
    agents=[planner, coder, tester, reviewer],
    tasks=[plan_task, code_task, test_task, review_task],
    process=Process.sequential,
    verbose=True,
)

if __name__ == "__main__":
    crew.kickoff()
    os.makedirs("results", exist_ok=True)

    # Get output from each task directly
    code_raw    = code_task.output.raw if code_task.output else ""
    test_raw    = test_task.output.raw if test_task.output else ""
    review_raw  = review_task.output.raw if review_task.output else ""
    plan_raw    = plan_task.output.raw if plan_task.output else ""

    # Extract HTML from coder output
    if "```html" in code_raw:
        html = code_raw.split("```html")[1].split("```")[0].strip()
    elif "```" in code_raw:
        html = code_raw.split("```")[1].split("```")[0].strip()
    else:
        html = code_raw

    with open("results/crewai_snake.html", "w", encoding="utf-8") as f:
        f.write(html)

    with open("results/crewai_output.txt", "w", encoding="utf-8") as f:
        f.write(f"PLAN:\n{plan_raw}\n\n")
        f.write(f"CODE:\n{code_raw}\n\n")
        f.write(f"TEST REPORT:\n{test_raw}\n\n")
        f.write(f"REVIEW:\n{review_raw}\n")

    print("\n=== DONE ===")
    print("  Open in browser : results/crewai_snake.html")
    print("  Full output     : results/crewai_output.txt\n")