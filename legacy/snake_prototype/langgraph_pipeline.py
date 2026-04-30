import os
import re
from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, Literal

load_dotenv()

MODEL    = os.getenv("MODEL_NAME", "qwen3:8b")
ENDPOINT = os.getenv("LANGGRAPH_ENDPOINT", "http://localhost:11435")
TASK     = "Build a Snake game in a single HTML file."

llm = ChatOllama(model=MODEL, base_url=ENDPOINT, temperature=0)

# ── State ─────────────────────────────────────────────────────
class State(TypedDict):
    task: str
    plan: str
    code: str
    test_report: str
    review: str
    verdict: str
    iterations: int
    max_iterations: int

# ── Nodes ─────────────────────────────────────────────────────
def planner_node(state: State) -> dict:
    print("\n[1/4] Planner is thinking...")
    prompt = (
        f"You are a software planner.\n"
        f"Task: {state['task']}\n"
        f"Write a numbered implementation plan with 5-8 steps."
    )
    response = llm.invoke(prompt).content
    print("      Planner done.")
    return {"plan": response}

def coder_node(state: State) -> dict:
    iteration = state["iterations"] + 1
    print(f"\n[2/4] Coder is writing code... (iteration {iteration}/{state['max_iterations']})")
    prompt = (
        f"You are a frontend developer.\n"
        f"Task: {state['task']}\n"
        f"Plan:\n{state['plan']}\n\n"
        f"Previous code (if any):\n{state['code'] or '(none)'}\n\n"
        f"Write a complete Snake game in a single HTML file. "
        f"Use a <canvas> element and vanilla JavaScript. No external dependencies. "
        f"Return only the full HTML file in a code block."
    )
    response = llm.invoke(prompt).content
    print("      Coder done.")
    return {"code": response, "iterations": iteration}

def tester_node(state: State) -> dict:
    print("\n[3/4] Tester is reviewing the code...")
    prompt = (
        f"You are a QA engineer reviewing HTML/JS code without running it.\n"
        f"Task: {state['task']}\n\n"
        f"Code:\n{state['code']}\n\n"
        f"Check each of the following and report pass or fail:\n"
        f"- Valid HTML structure (doctype, head, body)\n"
        f"- <canvas> element present\n"
        f"- Game loop (setInterval or requestAnimationFrame)\n"
        f"- Keyboard input handling (arrow keys or WASD)\n"
        f"- Collision detection (walls and self)\n"
        f"- Score display and update\n"
        f"- Game-over state\n"
        f"- No obvious JavaScript errors\n\n"
        f"End with either VERDICT: pass or VERDICT: fail."
    )
    response = llm.invoke(prompt).content
    print("      Tester done.")
    return {"test_report": response}

def reviewer_node(state: State) -> dict:
    print("\n[4/4] Reviewer is giving final verdict...")
    prompt = (
        f"You are a tech lead.\n"
        f"Plan:\n{state['plan']}\n\n"
        f"Code:\n{state['code']}\n\n"
        f"Test report:\n{state['test_report']}\n\n"
        f"Give a final verdict. End with VERDICT: good_enough or VERDICT: needs_changes."
    )
    response = llm.invoke(prompt).content
    verdict = "needs_changes"
    for line in response.splitlines():
        if "VERDICT:" in line.upper():
            verdict = "good_enough" if "good" in line.lower() else "needs_changes"
    print(f"      Reviewer done. Verdict: {verdict}")
    return {"review": response, "verdict": verdict}

def route_after_review(state: State) -> Literal["coder", "__end__"]:
    if state["verdict"] == "good_enough" or state["iterations"] >= state["max_iterations"]:
        print("\n      Stopping — code is good enough or max iterations reached.")
        return END
    print(f"\n      Sending back to coder for another iteration...")
    return "coder"

# ── Graph ─────────────────────────────────────────────────────
builder = StateGraph(State)
builder.add_node("planner",  planner_node)
builder.add_node("coder",    coder_node)
builder.add_node("tester",   tester_node)
builder.add_node("reviewer", reviewer_node)

builder.add_edge(START,      "planner")
builder.add_edge("planner",  "coder")
builder.add_edge("coder",    "tester")
builder.add_edge("tester",   "reviewer")
builder.add_conditional_edges("reviewer", route_after_review)

graph = builder.compile()

# ── Run ───────────────────────────────────────────────────────
if __name__ == "__main__":
    print("\n==============================")
    print("  LangGraph Pipeline Starting")
    print("==============================")
    print(f"  Model    : {MODEL}")
    print(f"  Endpoint : {ENDPOINT}")
    print(f"  Task     : {TASK}")
    print("==============================\n")

    result = graph.invoke({
        "task": TASK,
        "plan": "", "code": "", "test_report": "", "review": "", "verdict": "",
        "iterations": 0, "max_iterations": 3,
    })

    os.makedirs("results", exist_ok=True)

    # Extract and save the HTML file
    raw_code = result["code"]
    if "```html" in raw_code:
        html = raw_code.split("```html")[1].split("```")[0].strip()
    elif "```" in raw_code:
        html = raw_code.split("```")[1].split("```")[0].strip()
    else:
        html = raw_code.strip()

    with open("results/langgraph_snake.html", "w", encoding="utf-8") as f:
        f.write(html)
    with open("results/langgraph_output.txt", "w", encoding="utf-8") as f:
        f.write(f"PLAN:\n{result['plan']}\n\n")
        f.write(f"CODE:\n{result['code']}\n\n")
        f.write(f"TEST REPORT:\n{result['test_report']}\n\n")
        f.write(f"REVIEW:\n{result['review']}\n\n")
        f.write(f"FINAL VERDICT: {result['verdict']}\n")
        f.write(f"ITERATIONS: {result['iterations']}\n")

    print("\n=== DONE ===")
    print(f"  Open in browser : results/langgraph_snake.html")
    print(f"  Full output     : results/langgraph_output.txt")
    print(f"  Verdict         : {result['verdict']}")
    print(f"  Iterations used : {result['iterations']}\n")