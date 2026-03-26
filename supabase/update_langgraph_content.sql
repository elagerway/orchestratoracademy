-- ============================================================================
-- UPDATE: Expand LangGraph Advanced course lesson content (800-1200 words each)
-- Targets all 14 lessons across 7 modules (cccc0001 through cccc0007)
-- ============================================================================

-- Module 1, Lesson 1: Why Graphs? From Chains to Graphs
UPDATE public.lessons
SET content = '# Why Graphs? From Chains to Graphs

The evolution from simple prompt chains to graph-based workflows is one of the most important architectural shifts in AI orchestration. If you have been building with LangChain or similar frameworks, you have likely hit the ceiling of what linear chains can do. This lesson explains why that ceiling exists, what graphs unlock, and how to start thinking in graphs instead of chains.

## The Chain Era and Its Limitations

When LangChain popularized prompt chaining, it was a genuine breakthrough. Instead of a single monolithic prompt, you could compose a pipeline:

```
Input -> Summarize -> Translate -> Format -> Output
```

This works beautifully for linear workflows. Each step receives the output of the previous step, transforms it, and passes it along. But chains have three fundamental constraints that become painful as your workflows grow in complexity.

**Constraint 1: No branching.** A chain always follows the same path. If you need to route a customer inquiry to billing versus technical support versus account management, a chain cannot do this natively. You end up writing ugly if/else wrappers around your chain calls, which defeats the purpose of the framework.

**Constraint 2: No looping.** What if your AI generates a draft that fails a quality check? In a chain, there is no way to go back. You cannot say "try again" and loop back to the generation step. You have to build an external retry loop, which means your chain is no longer the source of truth for the workflow logic.

**Constraint 3: No parallelism.** If you need to research a topic from three different sources simultaneously, a chain forces you to do them sequentially. One after another. Three times the latency for no good reason, because those three tasks are completely independent.

## Where Chains Break Down: A Real Example

Consider a document processing workflow for a legal firm:

1. Receive a contract document
2. Extract key clauses (payment terms, liability, termination)
3. If the contract value exceeds $100,000, flag for senior review
4. If there are non-standard liability clauses, route to legal specialist
5. If everything is standard, auto-approve with a summary
6. If flagged for review, wait for human approval
7. If the human requests changes, regenerate the summary with their feedback and re-submit
8. Generate the final report

This is not a chain. Step 3 and step 4 are parallel classification tasks. Steps 5, 6, and 7 are branches that depend on conditions. Step 7 creates a loop back to an earlier step. A chain simply cannot model this workflow faithfully.

## Enter Directed Graphs

A graph consists of **nodes** (processing steps) and **edges** (connections between them). Unlike chains, graphs natively support every pattern you need:

- **Branching**: A single node can have multiple outgoing edges, each leading to a different node based on conditions
- **Looping**: An edge can point backward to a previous node, creating iteration
- **Parallel execution**: A node can fan out to multiple nodes that run simultaneously
- **Convergence**: Multiple parallel paths can merge back into a single node
- **Early termination**: Any node can route directly to END when the workflow is complete

Here is the legal document workflow as a graph:

```
START -> extract_clauses
extract_clauses -> check_value, check_liability  (parallel)
check_value + check_liability -> route_decision
route_decision -> auto_approve (if standard)
route_decision -> human_review (if flagged)
human_review -> generate_summary
generate_summary -> human_review (if changes requested, LOOP)
generate_summary -> final_report (if approved)
auto_approve -> final_report
final_report -> END
```

Every path, every condition, every loop is explicitly modeled in the graph structure. There is no hidden control flow tucked away in wrapper functions.

## Directed Acyclic Graphs vs. Cyclic Graphs

In computer science, a **Directed Acyclic Graph (DAG)** is a graph with no cycles — once you pass a node, you never return to it. Many workflow engines (like Apache Airflow) only support DAGs.

LangGraph supports **cyclic graphs** — graphs with loops. This is critical for AI workflows because iteration is fundamental to quality. You generate, evaluate, and regenerate until the output is good enough. Without cycles, you cannot model this pattern.

However, cycles require care. An unrestricted loop can run forever. Always include a termination condition:

```python
def should_continue(state):
    if state["quality_score"] >= 8:
        return "finalize"        # Exit the loop
    if state["iterations"] >= 5:
        return "finalize"        # Safety valve
    return "regenerate"          # Loop back
```

The safety valve (maximum iterations) prevents infinite loops even if the quality threshold is never reached.

## State Machines: The Conceptual Foundation

At a deeper level, a LangGraph workflow is a **finite state machine**. Your workflow is always in exactly one state. Each node transitions the workflow to a new state based on the current state and any new input.

This has practical implications:

1. **Predictability**: You can enumerate every possible state your workflow can be in, which makes testing systematic
2. **Debuggability**: When something goes wrong, you can inspect the exact state at the point of failure
3. **Persistence**: Because state is explicit, you can save it and resume later — even days later

If you have worked with state machines in other contexts (game development, UI frameworks, protocol design), you already have the mental model you need. LangGraph just applies that model to AI workflows.

## Why LangGraph Specifically?

Several graph-based AI workflow frameworks exist. LangGraph stands out for these reasons:

- **First-class state management**: State is not an afterthought; it is the core abstraction
- **Checkpointing built in**: Save and resume workflows with a single line of configuration
- **Human-in-the-loop support**: Pause workflows for human input with interrupts and breakpoints
- **Streaming**: Stream node outputs as they happen, not just the final result
- **Production deployment**: LangGraph Cloud and self-hosting options for real workloads
- **LangChain ecosystem**: Full access to LangChain''s integrations, models, and tools

## The Mental Shift

Moving from chains to graphs requires you to think differently. Instead of asking "what is the next step?", ask yourself:

- What are all the possible states my workflow can be in?
- What transitions exist between those states?
- What conditions determine which transition is taken?
- Where do I need human input?
- Where can steps run in parallel?

This design-first approach produces more robust, more maintainable, and more powerful AI systems.

## Key Takeaways

- Chains are linear and break down for branching, looping, and parallel workflows
- Graphs model real-world business processes faithfully because they support all control flow patterns
- LangGraph supports cyclic graphs, which are essential for iterative AI workflows
- Always include termination conditions (safety valves) in loops
- Think of your workflow as a state machine: explicit states, explicit transitions, explicit conditions
- Design the graph on paper before writing code — it saves hours of debugging later'
WHERE module_id = 'cccc0001-0000-0000-0000-000000000001' AND slug = 'why-graphs-from-chains-to-graphs';

-- Module 1, Lesson 2: Graph Theory for AI Orchestrators
UPDATE public.lessons
SET content = '# Graph Theory for AI Orchestrators

You do not need a computer science degree to use LangGraph effectively. But understanding the fundamental concepts of graph theory will make you a significantly better workflow designer. This lesson covers the practical graph theory you actually need — no proofs, no theorems, just the concepts that translate directly into better AI systems.

## Nodes: The Building Blocks

A **node** is a single processing step in your workflow. In LangGraph, every node is a Python function with a specific contract:

```python
def my_node(state: MyState) -> dict:
    # 1. Read what you need from the current state
    input_data = state["some_field"]

    # 2. Do your work (LLM call, tool use, computation)
    result = llm.invoke(f"Process this: {input_data}")

    # 3. Return ONLY the fields you want to update
    return {"output_field": result.content}
```

Three rules govern nodes:

1. **Nodes receive the full state** but should only read the fields they need
2. **Nodes return a partial state update** — only the fields that changed
3. **Nodes should be pure functions** when possible — given the same state, they produce the same output

Think of nodes as team members. Each one has a specific job. The research node researches. The writing node writes. The evaluation node evaluates. Keep responsibilities clear and separate.

### Common Node Types

| Node Type | What It Does | Example |
|-----------|-------------|---------|
| LLM Node | Calls a language model | Classify, summarize, generate |
| Tool Node | Invokes an external tool | Search, database lookup, API call |
| Logic Node | Makes a decision without LLM | Check thresholds, validate data |
| Transform Node | Reshapes data | Parse JSON, merge results, format output |

## Edges: The Connections

An **edge** is a directed connection from one node to another. "Directed" means it has a direction — it goes FROM node A TO node B. This direction is critical because it defines the execution order.

LangGraph supports three types of edges:

### Normal Edges

A normal edge is unconditional. After node A finishes, always go to node B:

```python
graph.add_edge("research", "analyze")
```

This is the simplest edge type. Use it when the flow is deterministic — there is exactly one next step.

### Conditional Edges

A conditional edge uses a routing function to decide which node comes next:

```python
def decide_next(state: State) -> str:
    if state["score"] >= 8:
        return "publish"
    return "revise"

graph.add_conditional_edges("evaluate", decide_next)
```

The routing function examines the state and returns the name of the target node. This is how you implement branching logic.

### Entry and Terminal Edges

Every graph needs a starting point and at least one ending point:

```python
graph.set_entry_point("classify")      # Where execution begins
graph.add_edge("respond", END)         # Where execution ends
```

The special `END` node signals that the workflow is complete. When execution reaches END, the final state is returned to the caller.

## State: The Shared Memory

**State** is the data that flows through your graph. Every node reads from the same state and writes updates back to it. In LangGraph, state is defined as a TypedDict:

```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class WorkflowState(TypedDict):
    messages: Annotated[list, add_messages]
    task: str
    research: str
    draft: str
    score: int
    iteration: int
```

State is the single source of truth for your workflow. A few design principles make state management easier:

**Keep state flat.** Deeply nested structures are hard to update and debug. Instead of `state["customer"]["profile"]["name"]`, use `state["customer_name"]`.

**Include everything downstream nodes need.** If a node three steps away needs the customer ID, put it in the state from the beginning. Retrofitting state fields later is error-prone.

**Track metadata.** Fields like `iteration`, `error_count`, and `current_step` help with debugging and loop control.

## Graph Patterns Every Orchestrator Should Know

### Pattern 1: Linear Pipeline

```
A -> B -> C -> END
```

The simplest graph. Equivalent to a chain. Use when steps are strictly sequential with no branching or looping. Even though this is "just a chain," modeling it as a graph gives you state management and checkpointing for free.

### Pattern 2: Branch and Merge

```
START -> classify
classify -> handler_a (condition X)
classify -> handler_b (condition Y)
classify -> handler_c (condition Z)
handler_a -> merge
handler_b -> merge
handler_c -> merge
merge -> END
```

A decision point routes to different processing paths, then all paths converge at a merge node. This is the most common pattern in real-world workflows — customer support routing, document classification, request triage.

### Pattern 3: Iterative Refinement Loop

```
START -> generate -> evaluate
evaluate -> generate (if score < threshold, LOOP)
evaluate -> finalize (if score >= threshold)
finalize -> END
```

The workflow generates output, evaluates quality, and loops back if the quality is insufficient. Always include a maximum iteration count as a safety valve to prevent infinite loops.

### Pattern 4: Fan-Out and Fan-In

```
START -> prepare
prepare -> worker_1, worker_2, worker_3 (parallel)
worker_1, worker_2, worker_3 -> aggregate
aggregate -> END
```

One node fans out to multiple parallel workers, then a single node aggregates their results. This is ideal for research tasks, multi-source data gathering, and any scenario where independent work can happen simultaneously.

### Pattern 5: Human-in-the-Loop

```
START -> generate -> review (INTERRUPT)
review -> generate (if rejected, LOOP)
review -> publish (if approved)
publish -> END
```

The workflow pauses at the review node, waits for human input, and resumes based on the human''s decision. This pattern combines automation with oversight.

## Designing Your Graph: A Step-by-Step Process

Before writing any code, design the graph on paper. This five-step process saves hours of debugging:

1. **List all actions** that need to happen (these become nodes)
2. **Draw arrows** between them showing the natural flow (these become edges)
3. **Identify decision points** where the path depends on data (these become conditional edges)
4. **Identify loops** where quality checks might send you back (these become cyclic edges)
5. **Define state** by listing every piece of data that any node needs to read or write

Sketch it out. A whiteboard, a napkin, a diagramming tool — anything works. The visual representation makes problems obvious that are invisible in code.

## Common Pitfalls

- **Orphan nodes**: A node that has no incoming edge (unreachable) or no outgoing edge (dead end). LangGraph catches these at compile time, but catching them in design is faster.
- **Missing termination**: Every path through the graph must eventually reach END. If any path loops forever without an exit condition, your workflow will run indefinitely.
- **State field collisions**: Two parallel nodes writing to the same state field will overwrite each other. Use reducers (covered in Module 3) to handle concurrent writes safely.
- **Over-complicated graphs**: If your graph has more than 15 nodes, consider breaking it into sub-graphs. Complexity is the enemy of reliability.

## Key Takeaways

- Nodes are processing steps, edges are connections, state is shared memory
- Three edge types: normal (always), conditional (based on state), and terminal (to END)
- Master five patterns: linear, branch-merge, iterative loop, fan-out/fan-in, and human-in-the-loop
- Always design the graph visually before coding
- Keep state flat, include metadata, and plan for debugging from the start'
WHERE module_id = 'cccc0001-0000-0000-0000-000000000001' AND slug = 'graph-theory-for-orchestrators';

-- Module 2, Lesson 1: Nodes, Edges, and State
UPDATE public.lessons
SET content = '# Nodes, Edges, and State

Now that you understand the theory behind graphs, it is time to translate those concepts into real LangGraph code. This lesson walks through the core API — `StateGraph`, `add_node`, `add_edge`, `compile`, and `invoke` — with working Python examples you can run locally.

## Setting Up Your Environment

Before writing any graph code, install the required packages:

```python
pip install langgraph langchain-anthropic langchain-core
```

You will also need an API key for your LLM provider. For this course, we use Anthropic''s Claude:

```python
import os
os.environ["ANTHROPIC_API_KEY"] = "your-key-here"
```

## Defining State with TypedDict

State is the foundation of every LangGraph workflow. You define it as a Python `TypedDict`, which gives you type hints and editor autocomplete:

```python
from typing import TypedDict, Annotated
from langgraph.graph.message import add_messages

class ConversationState(TypedDict):
    messages: Annotated[list, add_messages]
    current_step: str
    research_data: str
    final_output: str
    error_count: int
```

Each field in the state represents a piece of data your workflow tracks. Let us break down what makes this definition important:

- **`messages`** uses the `Annotated` type with `add_messages` as a reducer. This tells LangGraph to append new messages to the existing list instead of replacing it. Without this reducer, every node that returns messages would wipe out the conversation history.
- **`current_step`** tracks where the workflow is in its execution — useful for debugging and routing.
- **`research_data`** holds intermediate results that downstream nodes can read.
- **`final_output`** stores the final product of the workflow.
- **`error_count`** tracks how many errors have occurred, enabling retry logic.

### The Reducer Pattern

Reducers are one of the most important concepts in LangGraph state management. By default, when a node returns `{"field": new_value}`, the new value **replaces** the old value. Reducers change this behavior:

```python
from operator import add

class State(TypedDict):
    messages: Annotated[list, add_messages]  # Append messages
    scores: Annotated[list, add]             # Concatenate lists
    counter: int                              # Replace (default)
```

The `add_messages` reducer is specially designed for chat messages — it handles deduplication by message ID, which prevents the same message from appearing twice when you resume from a checkpoint.

## Defining Nodes as Functions

A node is a Python function that receives the current state and returns a dictionary of state updates:

```python
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-sonnet-4-20250514")

def research_node(state: ConversationState) -> dict:
    """Gather information on the topic from the conversation."""
    topic = state["messages"][-1].content
    result = llm.invoke(
        f"Research the following topic thoroughly. "
        f"Provide key facts, recent developments, and expert opinions. "
        f"Topic: {topic}"
    )
    return {
        "research_data": result.content,
        "current_step": "research_complete"
    }

def analyze_node(state: ConversationState) -> dict:
    """Analyze the research and identify key insights."""
    research = state["research_data"]
    result = llm.invoke(
        f"Analyze this research and extract the 3-5 most important insights. "
        f"For each insight, explain why it matters. "
        f"Research: {research}"
    )
    return {
        "research_data": result.content,
        "current_step": "analysis_complete"
    }

def write_node(state: ConversationState) -> dict:
    """Produce the final output based on analyzed research."""
    analysis = state["research_data"]
    result = llm.invoke(
        f"Write a clear, well-structured summary based on this analysis. "
        f"Use headings, bullet points, and a conclusion. "
        f"Analysis: {analysis}"
    )
    return {
        "final_output": result.content,
        "current_step": "writing_complete"
    }
```

**Critical rule**: nodes return only the fields they want to update. LangGraph merges these partial updates into the full state automatically. If your node does not need to change `error_count`, do not include it in the return dictionary.

## Building the Graph with StateGraph

The `StateGraph` class is the entry point for constructing your workflow:

```python
from langgraph.graph import StateGraph, END

# 1. Create the graph with your state schema
graph = StateGraph(ConversationState)

# 2. Add nodes — each gets a name and a function
graph.add_node("research", research_node)
graph.add_node("analyze", analyze_node)
graph.add_node("write", write_node)

# 3. Set the entry point — where execution starts
graph.set_entry_point("research")

# 4. Add edges — define the flow between nodes
graph.add_edge("research", "analyze")
graph.add_edge("analyze", "write")
graph.add_edge("write", END)

# 5. Compile — validates the graph and produces a runnable
app = graph.compile()
```

Let us examine each step:

**`StateGraph(ConversationState)`** — Creates a new graph builder. The state schema is passed here so LangGraph knows the shape of your data.

**`add_node("research", research_node)`** — Registers a node with a string name and a callable. The name is what you use when defining edges. The callable is what gets executed.

**`set_entry_point("research")`** — Declares which node runs first. Every graph must have exactly one entry point.

**`add_edge("research", "analyze")`** — Creates an unconditional edge. After `research` finishes, always go to `analyze`.

**`add_edge("write", END)`** — Routes to the special `END` node, which terminates the workflow and returns the final state.

**`compile()`** — This is where LangGraph validates your graph. It checks for unreachable nodes, missing edges, and invalid configurations. If something is wrong, you get a clear error message at compile time rather than a cryptic failure at runtime. The compile step returns a runnable application object.

## Invoking the Graph

Once compiled, you run the graph with `invoke`:

```python
# Provide the initial state
result = app.invoke({
    "messages": [("user", "Research the current state of AI orchestration frameworks")],
    "current_step": "start",
    "research_data": "",
    "final_output": "",
    "error_count": 0
})

# Access the final state
print(result["final_output"])
print(f"Workflow finished at step: {result[''current_step'']}")
```

The `invoke` method starts at the entry point and follows edges until it reaches `END`. It returns the complete final state.

### Streaming Execution

For a better user experience, you can stream results as each node completes:

```python
for event in app.stream({
    "messages": [("user", "Research AI orchestration")],
    "current_step": "start",
    "research_data": "",
    "final_output": "",
    "error_count": 0
}):
    for node_name, node_output in event.items():
        print(f"--- {node_name} completed ---")
        print(f"Updated fields: {list(node_output.keys())}")
```

Streaming is valuable for long-running workflows because the user sees progress in real time rather than waiting for the entire graph to finish.

## Adding Conditional Edges

To make your graph dynamic, add conditional edges using a routing function:

```python
def route_after_analysis(state: ConversationState) -> str:
    """Decide whether analysis is sufficient or needs more research."""
    if "insufficient" in state["current_step"]:
        return "research"  # Loop back for more data
    return "write"         # Proceed to writing

graph.add_conditional_edges("analyze", route_after_analysis)
```

The routing function receives the current state and returns the name of the next node. LangGraph calls this function after the source node completes.

## Common Pitfalls

1. **Forgetting to set the entry point**: Your graph will fail to compile without `set_entry_point()`.
2. **Returning full state from nodes**: Only return fields you changed. Returning the full state can cause stale values to overwrite fresh updates from other nodes.
3. **Missing the END edge**: At least one path through your graph must reach `END`, or the workflow will never terminate.
4. **String name mismatches**: The node name in `add_node` must exactly match the name used in `add_edge`. A typo here causes a compile-time error.
5. **Not compiling before invoking**: Always call `compile()` before `invoke()`. The compile step catches structural errors in your graph.

## Key Takeaways

- State is a `TypedDict` — use `Annotated` with reducers for fields that should accumulate rather than replace
- Nodes are functions that receive state and return partial updates
- `StateGraph` is the builder: `add_node`, `add_edge`, `set_entry_point`, `compile`
- `compile()` validates the graph — fix errors here, not at runtime
- `invoke()` runs the graph end-to-end; `stream()` gives you real-time progress
- Always return only changed fields from nodes, never the full state'
WHERE module_id = 'cccc0002-0000-0000-0000-000000000002' AND slug = 'nodes-edges-and-state';

-- Module 2, Lesson 2: Building Your First Graph
UPDATE public.lessons
SET content = '# Building Your First Graph

Let us build a complete, working LangGraph application from scratch. We will create a research assistant that gathers information on a topic, evaluates the quality of its research, iterates if needed, and produces a final report. This is not a toy example — it demonstrates branching, looping, state management, and the compile-invoke lifecycle you will use in every LangGraph project.

## The Workflow Design

Before writing code, sketch the workflow:

```
START -> research -> evaluate
evaluate -> research (if quality < 7, LOOP)
evaluate -> write (if quality >= 7)
evaluate -> write (if iterations >= 3, safety valve)
write -> END
```

This graph has three nodes and one conditional edge that creates a loop. The loop has two exit conditions: quality threshold met, or maximum iterations reached.

## Step 1: Define the State

The state must contain everything the workflow needs to track:

```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-sonnet-4-20250514")

class ResearchState(TypedDict):
    topic: str
    research: str
    quality_score: int
    iterations: int
    max_iterations: int
    report: str
```

Notice that `max_iterations` is part of the state. This lets you configure the safety valve per invocation rather than hardcoding it.

## Step 2: Implement the Nodes

Each node has a single responsibility:

```python
def research_node(state: ResearchState) -> dict:
    """Gather information on the topic, building on previous research."""
    iteration = state.get("iterations", 0) + 1
    existing = state.get("research", "")

    if existing:
        prompt = (
            f"You are researching: {state[''topic'']}. "
            f"Here is what you found so far:\n{existing}\n\n"
            f"This is iteration {iteration}. Dig deeper. Find new angles, "
            f"recent developments, contrasting viewpoints, and specific "
            f"data points that are missing from the existing research."
        )
    else:
        prompt = (
            f"Research the topic: {state[''topic'']}. "
            f"Provide a comprehensive overview covering key facts, "
            f"recent developments, expert opinions, and relevant data. "
            f"Be thorough — this research will be evaluated for quality."
        )

    result = llm.invoke(prompt)
    return {
        "research": result.content,
        "iterations": iteration
    }


def evaluate_node(state: ResearchState) -> dict:
    """Evaluate research quality on a 1-10 scale."""
    prompt = (
        f"You are a research quality evaluator. Rate this research "
        f"on a scale of 1-10 for completeness, accuracy, and depth.\n\n"
        f"Topic: {state[''topic'']}\n"
        f"Research:\n{state[''research'']}\n\n"
        f"Consider:\n"
        f"- Are there specific facts and data points?\n"
        f"- Are multiple perspectives represented?\n"
        f"- Is the information current and relevant?\n"
        f"- Are there gaps that need filling?\n\n"
        f"Reply with ONLY a single integer from 1 to 10."
    )
    result = llm.invoke(prompt)
    try:
        score = int(result.content.strip())
        score = max(1, min(10, score))  # Clamp to valid range
    except ValueError:
        score = 5  # Default if parsing fails
    return {"quality_score": score}


def write_node(state: ResearchState) -> dict:
    """Produce the final report from the accumulated research."""
    prompt = (
        f"Write a comprehensive, well-structured report on: {state[''topic'']}\n\n"
        f"Based on this research:\n{state[''research'']}\n\n"
        f"Structure the report with:\n"
        f"1. Executive summary (2-3 sentences)\n"
        f"2. Key findings (bullet points)\n"
        f"3. Detailed analysis (organized by theme)\n"
        f"4. Conclusion and implications\n\n"
        f"Quality score of research: {state[''quality_score'']}/10 "
        f"(achieved in {state[''iterations'']} iteration(s))"
    )
    result = llm.invoke(prompt)
    return {"report": result.content}
```

Notice how each node focuses on one thing. The research node does not evaluate. The evaluate node does not write. This separation makes each node independently testable and reusable.

## Step 3: Define the Routing Logic

The routing function decides whether to loop back or proceed:

```python
def should_continue(state: ResearchState) -> str:
    """Route based on quality score and iteration count."""
    max_iter = state.get("max_iterations", 3)

    if state["quality_score"] >= 7:
        return "write"              # Quality threshold met
    if state.get("iterations", 0) >= max_iter:
        return "write"              # Safety valve triggered
    return "research"               # Loop back for more research
```

Two exit conditions prevent infinite loops. The quality threshold is the desired exit. The iteration limit is the safety valve. In production, you always want both.

## Step 4: Assemble and Compile the Graph

```python
# Create the graph
graph = StateGraph(ResearchState)

# Register nodes
graph.add_node("research", research_node)
graph.add_node("evaluate", evaluate_node)
graph.add_node("write", write_node)

# Set the entry point
graph.set_entry_point("research")

# Define edges
graph.add_edge("research", "evaluate")           # research always goes to evaluate
graph.add_conditional_edges("evaluate", should_continue)  # evaluate routes dynamically
graph.add_edge("write", END)                      # write always ends the workflow

# Compile the graph
app = graph.compile()
```

When you call `compile()`, LangGraph validates the entire graph:
- Every node is reachable from the entry point
- Every conditional edge returns valid node names
- At least one path reaches END
- The state schema is consistent

If any check fails, you get a descriptive error. Fix these at compile time, not at runtime.

## Step 5: Run the Workflow

```python
# Invoke with initial state
result = app.invoke({
    "topic": "The impact of AI orchestration frameworks on enterprise software development in 2026",
    "research": "",
    "quality_score": 0,
    "iterations": 0,
    "max_iterations": 3,
    "report": ""
})

# Print results
print("=" * 60)
print(f"Topic: {result[''topic'']}")
print(f"Iterations: {result[''iterations'']}")
print(f"Final Quality Score: {result[''quality_score'']}/10")
print("=" * 60)
print(result["report"])
```

### Streaming for Real-Time Feedback

For longer workflows, streaming shows progress as each node completes:

```python
for event in app.stream({
    "topic": "AI orchestration frameworks",
    "research": "",
    "quality_score": 0,
    "iterations": 0,
    "max_iterations": 3,
    "report": ""
}):
    for node_name, output in event.items():
        print(f"\n[{node_name}] completed")
        if "quality_score" in output:
            print(f"  Quality: {output[''quality_score'']}/10")
        if "iterations" in output:
            print(f"  Iteration: {output[''iterations'']}")
```

## Understanding the Execution Flow

Here is what happens when you call `invoke`:

1. LangGraph initializes the state with your input
2. It runs the entry point node (`research`)
3. It follows the edge from `research` to `evaluate`
4. It runs `evaluate`, which scores the research
5. It calls `should_continue` with the current state
6. If the score is below 7 and iterations are below max, it routes back to `research` (step 2)
7. If the score is 7 or above, or iterations hit the max, it routes to `write`
8. It runs `write` and follows the edge to `END`
9. It returns the complete final state

Each node sees the accumulated state from all previous nodes. The evaluate node sees the research. The write node sees both the research and the score.

## Common Pitfalls with First Graphs

1. **Not initializing all state fields**: If your state has a field `report: str` but you invoke with `{}`, nodes that try to read `state["report"]` will get a `KeyError`. Always provide initial values for all fields, or use `state.get("field", default)` in your nodes.

2. **Routing function returning invalid names**: If `should_continue` returns `"writing"` but your node is named `"write"`, you get a runtime error. Use constants or an enum to avoid typos.

3. **Forgetting the safety valve**: Without `max_iterations`, your graph can loop forever if the LLM never gives a high quality score. Always limit loops.

4. **Overloading the state**: Putting the full research text in state works for small examples but can blow up context windows in production. Consider summarizing intermediate results.

## Key Takeaways

- Design the graph visually before coding: nodes, edges, conditions, loops
- Implement nodes as single-responsibility functions that return partial state updates
- Routing functions must return exact node names — use constants to avoid typos
- Always include a safety valve (max iterations) in any loop
- `compile()` validates structure; `invoke()` runs the workflow; `stream()` shows real-time progress
- Initialize all state fields when invoking to prevent KeyError at runtime'
WHERE module_id = 'cccc0002-0000-0000-0000-000000000002' AND slug = 'building-your-first-graph';

-- Module 3, Lesson 1: State Schemas and Reducers
UPDATE public.lessons
SET content = '# State Schemas and Reducers

State management is what separates toy demos from production-grade LangGraph applications. The state schema defines what data your workflow tracks. Reducers define how that data gets updated when multiple nodes write to the same field. Get these right, and your workflows will be predictable and debuggable. Get them wrong, and you will spend hours chasing phantom bugs.

## TypedDict State Schemas

Every LangGraph workflow starts with a state schema defined as a `TypedDict`:

```python
from typing import TypedDict, Annotated, Optional
from langgraph.graph.message import add_messages

class CustomerSupportState(TypedDict):
    messages: Annotated[list, add_messages]
    customer_id: str
    issue_category: str
    sentiment: str
    priority: str
    resolution: str
    escalated: bool
    handler_notes: str
    error_count: int
    started_at: str
```

This schema is the contract between every node in your graph. Every node reads from this structure and writes updates back to it. The schema serves three purposes:

1. **Documentation**: Anyone reading the code immediately understands what data the workflow manages.
2. **Type safety**: Your editor provides autocomplete and catches type errors before runtime.
3. **Reducer configuration**: The `Annotated` type lets you attach reducers to specific fields.

## How Default State Updates Work

By default, when a node returns a state update, the new value **replaces** the old value:

```python
def classify_node(state: CustomerSupportState) -> dict:
    return {"issue_category": "billing"}

# Before: state["issue_category"] = ""
# After:  state["issue_category"] = "billing"
```

This is simple and predictable. For most scalar fields (strings, integers, booleans), replacement is exactly what you want. But for accumulating data — like chat messages or research findings — replacement is destructive. That is where reducers come in.

## The add_messages Reducer

The most important reducer in LangGraph is `add_messages`:

```python
from langgraph.graph.message import add_messages

class State(TypedDict):
    messages: Annotated[list, add_messages]
```

When a node returns new messages, `add_messages` appends them to the existing list instead of replacing it:

```python
def greet_node(state: State) -> dict:
    return {
        "messages": [AIMessage(content="Hello! How can I help?")]
    }

# Before: messages = [HumanMessage("Hi")]
# After:  messages = [HumanMessage("Hi"), AIMessage("Hello! How can I help?")]
```

Without `add_messages`, the return value would wipe out the entire conversation history. This is the single most common bug in new LangGraph projects.

The `add_messages` reducer also handles **deduplication by message ID**. If a message with the same ID already exists in the list, the reducer updates it in place rather than appending a duplicate. This is critical for checkpoint resume scenarios where a node might run twice.

## Custom Reducers

You can write reducers for any field. A reducer is a function that takes the existing value and the new value, and returns the merged result:

```python
def merge_findings(existing: list, new: list) -> list:
    """Append new findings to the existing list."""
    return existing + new

def increment_counter(existing: int, new: int) -> int:
    """Add to the counter instead of replacing it."""
    return existing + new

def merge_research_dict(existing: dict, new: dict) -> dict:
    """Deep merge research data from multiple sources."""
    merged = {**existing}
    for key, value in new.items():
        if key in merged and isinstance(merged[key], list):
            merged[key] = merged[key] + value
        else:
            merged[key] = value
    return merged

class ResearchState(TypedDict):
    findings: Annotated[list, merge_findings]
    api_calls: Annotated[int, increment_counter]
    research_data: Annotated[dict, merge_research_dict]
    topic: str  # No reducer — uses default replacement
```

Custom reducers are essential when multiple nodes write to the same field, especially in parallel execution. Without them, the last node to finish wins and all other updates are lost.

### Reducer Design Rules

1. **Reducers must be deterministic**: Given the same inputs, always return the same output.
2. **Reducers must handle empty initial values**: The first node to write will have `existing` as the initial value (empty list, 0, empty dict).
3. **Reducers should not have side effects**: No API calls, no logging, no file writes inside a reducer.

## The Operator Module for Simple Reducers

For common patterns, Python''s `operator` module provides ready-made reducers:

```python
from operator import add

class State(TypedDict):
    scores: Annotated[list, add]        # Concatenate lists
    total_tokens: Annotated[int, add]   # Sum integers
```

The `add` operator works for lists (concatenation), integers (addition), and strings (concatenation). For anything more complex, write a custom reducer.

## State Design Principles

### Principle 1: Keep State Flat

Deeply nested state creates problems. Updates are verbose, debugging is difficult, and reducers cannot easily target nested fields.

```python
# Avoid this
class BadState(TypedDict):
    customer: dict  # {"profile": {"name": "...", "email": "..."}}

# Prefer this
class GoodState(TypedDict):
    customer_name: str
    customer_email: str
    customer_id: str
```

Flat state means every field is directly accessible. No key chains, no nested lookups, no ambiguity about which node updated which nested field.

### Principle 2: Include Workflow Metadata

Track operational data alongside business data:

```python
class State(TypedDict):
    # Business data
    messages: Annotated[list, add_messages]
    resolution: str

    # Workflow metadata
    current_step: str
    iteration_count: int
    error_count: int
    started_at: str
    last_node: str
```

When a workflow fails in production, these metadata fields tell you exactly what happened and where.

### Principle 3: Type Every Field Precisely

Vague types hide bugs:

```python
# Vague — what does dict contain? What items are in the list?
class VagueState(TypedDict):
    data: dict
    items: list
    flag: str

# Precise — no ambiguity
class PreciseState(TypedDict):
    customer_data: dict  # Will be typed further if needed
    findings: list[str]
    is_approved: bool
    score: int
```

Use `bool` for true/false values, not `str` with "true"/"false". Use `int` for numbers, not `str` with "7". Type precision catches bugs at development time.

### Principle 4: Plan for State Growth

As your workflow evolves, you will add fields. Design for this:

```python
class State(TypedDict, total=False):
    # Required fields
    messages: Annotated[list, add_messages]
    topic: str

    # Optional fields (added later)
    sentiment: str
    priority: str
    metadata: dict
```

Using `total=False` makes all fields optional, which means existing state objects remain valid when you add new fields. Alternatively, use `state.get("field", default)` in your nodes for fields that might not exist.

## Common Pitfalls

1. **Forgetting the reducer on message fields**: Without `add_messages`, every node that returns messages wipes the conversation history. This is the number one LangGraph bug.
2. **Using mutable default values**: If your initial state contains `{"findings": []}`, be aware that Python dictionaries share mutable objects. Create new lists/dicts for each invocation.
3. **Overloading state with large data**: Putting entire documents in state bloats checkpoints and can exceed context windows. Store large data externally and keep references in state.
4. **Inconsistent field naming**: Decide on a convention (snake_case, descriptive names) and stick to it. Inconsistency leads to typos and KeyErrors.

## Key Takeaways

- State schemas are `TypedDict` classes that define your workflow''s data contract
- Default behavior replaces field values; reducers change this to append, merge, or accumulate
- `add_messages` is the essential reducer for any conversational workflow — never forget it
- Custom reducers are functions: `(existing, new) -> merged`
- Keep state flat, typed precisely, and include operational metadata
- Plan for growth by using optional fields or `state.get()` with defaults'
WHERE module_id = 'cccc0003-0000-0000-0000-000000000003' AND slug = 'state-schemas-and-reducers';

-- Module 3, Lesson 2: Checkpointing and Recovery
UPDATE public.lessons
SET content = '# Checkpointing and Recovery

Long-running workflows need persistence. If your workflow processes documents for 20 minutes and crashes at minute 18, you cannot afford to start over. Checkpointing saves the state after each node, enabling resume from the point of failure, multi-turn conversations, and time-travel debugging. This lesson covers MemorySaver for development, PostgresSaver for production, thread-based execution, and recovery patterns.

## Why Checkpointing Matters

Without checkpointing, your workflow state exists only in memory. When the process ends — whether by completion, crash, or restart — the state is gone. This creates three problems:

1. **Lost progress**: A 10-step workflow that fails at step 8 must restart from step 1.
2. **No multi-turn support**: A chatbot cannot remember what you said five minutes ago if the server restarted.
3. **No human-in-the-loop**: You cannot pause for human approval if the state disappears the moment the process yields.

Checkpointing solves all three by writing the state to persistent storage after each node completes.

## MemorySaver: Development Checkpointing

For local development and testing, `MemorySaver` stores checkpoints in Python process memory:

```python
from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()

# Pass the checkpointer when compiling
app = graph.compile(checkpointer=checkpointer)
```

That is it. One line to create the checkpointer, one parameter to enable it. After every node execution, LangGraph automatically saves the current state to memory.

**MemorySaver limitations:**
- State is lost when the process exits
- No sharing between multiple server instances
- Memory consumption grows with the number of active threads

Use MemorySaver for development and automated testing. Never use it in production.

## PostgresSaver: Production Checkpointing

For production, store checkpoints in PostgreSQL:

```python
from langgraph.checkpoint.postgres import PostgresSaver

# Synchronous connection
checkpointer = PostgresSaver.from_conn_string(
    "postgresql://user:password@localhost:5432/mydb"
)

# Create the required tables (run once)
checkpointer.setup()

app = graph.compile(checkpointer=checkpointer)
```

For async applications (FastAPI, for example), use the async variant:

```python
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver

checkpointer = AsyncPostgresSaver.from_conn_string(
    "postgresql://user:password@localhost:5432/mydb"
)
await checkpointer.setup()

app = graph.compile(checkpointer=checkpointer)
```

PostgresSaver gives you:
- **Durability**: State survives process restarts, server crashes, and deployments
- **Scalability**: Multiple server instances share the same checkpoint store
- **Queryability**: You can inspect checkpoints directly via SQL for debugging

### Database Schema

PostgresSaver creates tables to store checkpoint data. The key columns are:
- `thread_id`: Identifies the workflow execution
- `checkpoint_id`: Unique identifier for each checkpoint
- `parent_checkpoint_id`: Links to the previous checkpoint (for history)
- `checkpoint`: The serialized state data
- `metadata`: Additional information about the checkpoint (node name, timestamp)

## Thread-Based Execution

With checkpointing enabled, every workflow execution needs a **thread ID**. The thread ID groups related checkpoints together, enabling multi-turn interactions:

```python
# First interaction
config = {"configurable": {"thread_id": "customer-alice-123"}}

result = app.invoke(
    {"messages": [("user", "I need help with my billing")]},
    config=config
)
# State is saved under thread "customer-alice-123"

# Second interaction (minutes, hours, or days later)
result = app.invoke(
    {"messages": [("user", "Actually, can you also check my usage?")]},
    config=config  # Same thread_id
)
# LangGraph loads the saved state and continues the conversation
```

The second invocation has full access to everything from the first — the complete message history, all intermediate state, every decision that was made. From the workflow''s perspective, it is one continuous interaction.

### Thread ID Best Practices

- Use meaningful, unique identifiers: `f"user-{user_id}-session-{session_id}"`
- Never reuse thread IDs across unrelated workflows
- Include enough context to debug: a thread ID like `"abc123"` tells you nothing, while `"support-user42-2026-03-25"` tells you everything

## Recovering from Failures

When a node fails with checkpointing enabled, the state up to the last successful node is preserved. You can fix the issue and resume:

```python
config = {"configurable": {"thread_id": "my-thread"}}

try:
    result = app.invoke(initial_state, config=config)
except Exception as e:
    print(f"Workflow failed: {e}")

    # Inspect the state at the point of failure
    saved_state = app.get_state(config)
    print(f"Last successful node: {saved_state.metadata.get(''source'')}")
    print(f"Next node to run: {saved_state.next}")
    print(f"Current state: {saved_state.values}")

# After fixing the issue, resume from the last checkpoint
result = app.invoke(None, config=config)
```

Passing `None` as input tells LangGraph: "do not start over — resume from the last saved checkpoint." This is powerful for production systems where transient failures (API timeouts, rate limits) are common.

## Inspecting Checkpoints: Time-Travel Debugging

Checkpointing enables a debugging technique called **time-travel debugging** — you can inspect the state at any point in the workflow''s history:

```python
config = {"configurable": {"thread_id": "my-thread"}}

# Get the current (latest) state
current = app.get_state(config)
print(f"Current values: {current.values}")
print(f"Next node: {current.next}")

# Get the full history of states
for state in app.get_state_history(config):
    print(f"Node: {state.metadata.get(''source'', ''unknown'')}")
    print(f"  Values: {state.values}")
    print(f"  Checkpoint: {state.config[''configurable''][''checkpoint_id'']}")
    print()
```

This history shows you the state after each node, in reverse chronological order. When a workflow produces unexpected output, you can trace exactly where things went wrong.

### Replaying from a Specific Checkpoint

You can even rewind to a specific checkpoint and replay from there:

```python
# Find the checkpoint you want to replay from
for state in app.get_state_history(config):
    if state.metadata.get("source") == "research":
        replay_config = state.config
        break

# Resume from that specific checkpoint
result = app.invoke(None, config=replay_config)
```

This is invaluable for debugging. You can rewind to the node before the failure, fix your code, and replay — without re-running the entire workflow from the beginning.

## Checkpoint Storage Comparison

| Backend | Persistence | Multi-Instance | Performance | Use Case |
|---------|-------------|---------------|-------------|----------|
| MemorySaver | Process lifetime | No | Fastest | Development, testing |
| SqliteSaver | Disk file | No | Fast | Local apps, prototypes |
| PostgresSaver | Database | Yes | Good | Production deployments |

Start with MemorySaver during development. Switch to PostgresSaver when you deploy. The API is identical — only the constructor changes.

## Common Pitfalls

1. **Forgetting the thread_id**: Without a thread_id in the config, checkpointing silently does not work (or uses a default thread, mixing state across unrelated executions).
2. **Not calling setup()**: PostgresSaver requires `setup()` to create its tables. Forgetting this causes table-not-found errors.
3. **Checkpoint bloat**: Every node creates a checkpoint. For workflows with many iterations, checkpoint storage grows quickly. Implement a retention policy to clean up old checkpoints.
4. **Serialization issues**: State values must be serializable. Custom Python objects, open file handles, and database connections cannot be checkpointed. Keep state as primitive types and simple data structures.
5. **Assuming instant consistency**: In distributed deployments, there may be a brief delay between writing a checkpoint and it being readable from another instance. Design for eventual consistency.

## Key Takeaways

- Checkpointing saves state after every node — enabling resume, multi-turn conversations, and time-travel debugging
- MemorySaver for development, PostgresSaver for production — same API, different durability
- Thread IDs group related checkpoints; use meaningful, unique identifiers
- Resume from failure by calling `invoke(None, config=config)` — no lost progress
- `get_state()` and `get_state_history()` enable powerful debugging without re-running workflows
- Keep state values serializable — primitives and simple data structures only'
WHERE module_id = 'cccc0003-0000-0000-0000-000000000003' AND slug = 'checkpointing-and-recovery';

-- Module 4, Lesson 1: Conditional Edges and Routing
UPDATE public.lessons
SET content = '# Conditional Edges and Routing

Conditional edges transform a static pipeline into an intelligent workflow. Instead of always following the same path, your graph examines the current state and decides where to go next. This is the mechanism behind classification-based routing, quality gates, error handling, and dynamic workflow adaptation. Master conditional edges and you can model any business process.

## The add_conditional_edges API

The core API for conditional routing is `add_conditional_edges`:

```python
graph.add_conditional_edges(
    source_node,       # The node AFTER which routing happens
    routing_function,  # A function that returns the next node name
    path_map           # Optional: maps return values to node names
)
```

After the source node completes, LangGraph calls the routing function with the current state. The function returns a string, and LangGraph follows the edge to the node with that name.

## Basic Conditional Routing

The simplest routing function examines a state field and returns a node name:

```python
from langgraph.graph import END

def route_by_category(state: SupportState) -> str:
    """Route customer inquiry to the appropriate handler."""
    category = state["issue_category"]
    if category == "billing":
        return "billing_handler"
    elif category == "technical":
        return "tech_support"
    elif category == "account":
        return "account_handler"
    else:
        return "general_handler"

graph.add_conditional_edges("classify", route_by_category)
```

After the `classify` node determines the issue category, the routing function directs the workflow to the right handler. Each handler is a separate node with specialized logic.

## Using Path Maps for Explicit Routing

Path maps make the routing transparent by explicitly mapping return values to node names:

```python
graph.add_conditional_edges(
    "classify",
    route_by_category,
    {
        "billing": "billing_handler",
        "technical": "tech_support",
        "account": "account_handler",
        "general": "general_handler",
        "unknown": "escalate"
    }
)
```

Path maps serve as documentation. Anyone reading the code can see every possible route without reading the routing function body. They also catch bugs — if the routing function returns a value not in the map, LangGraph raises an error immediately.

## LLM-Based Routing

For dynamic classification where rules are insufficient, use an LLM as the router:

```python
def llm_router(state: SupportState) -> str:
    """Use an LLM to classify and route the inquiry."""
    last_message = state["messages"][-1].content
    response = llm.invoke(
        f"Classify this customer message into exactly one category.\n"
        f"Categories: billing, technical, account, general\n\n"
        f"Message: {last_message}\n\n"
        f"Reply with ONLY the category name, nothing else."
    )
    category = response.content.strip().lower()

    valid_categories = {"billing", "technical", "account", "general"}
    if category not in valid_categories:
        return "general"  # Fallback for unexpected LLM output
    return category
```

**Critical: always include a fallback.** LLMs sometimes return unexpected output — extra whitespace, explanations instead of just the category, or categories not in your list. Without a fallback, your workflow crashes.

## Multi-Condition Routing

Sometimes routing depends on multiple state fields:

```python
def priority_router(state: SupportState) -> str:
    """Route based on category, sentiment, and customer tier."""
    category = state["issue_category"]
    sentiment = state["sentiment"]
    is_premium = state.get("customer_tier") == "premium"

    # Premium customers with negative sentiment always get escalated
    if is_premium and sentiment == "negative":
        return "priority_escalation"

    # Technical issues with negative sentiment get senior support
    if category == "technical" and sentiment == "negative":
        return "senior_tech_support"

    # Standard routing by category
    routing = {
        "billing": "billing_handler",
        "technical": "tech_support",
        "account": "account_handler",
    }
    return routing.get(category, "general_handler")
```

This kind of nuanced routing is impossible with chains and difficult with most workflow engines. In LangGraph, it is a Python function — you have the full power of the language.

## Routing to END for Early Termination

Not every workflow needs to run to completion. Use conditional routing to END when appropriate:

```python
def check_if_resolved(state: SupportState) -> str:
    """End the workflow early if the issue is already resolved."""
    if state.get("resolved"):
        return END
    if state.get("error_count", 0) > 3:
        return "error_handler"
    return "continue_processing"

graph.add_conditional_edges(
    "attempt_resolution",
    check_if_resolved,
    {
        END: END,
        "error_handler": "error_handler",
        "continue_processing": "next_step"
    }
)
```

Early termination improves performance (no unnecessary nodes run) and reduces cost (fewer LLM calls).

## Chaining Multiple Conditional Edges

A graph can have conditional edges after multiple nodes. This creates a decision tree:

```python
# First decision: what type of inquiry?
graph.add_conditional_edges("classify", route_by_category)

# Second decision (after billing handler): resolved or escalate?
graph.add_conditional_edges("billing_handler", check_if_resolved)

# Third decision (after tech support): resolved or needs more info?
graph.add_conditional_edges("tech_support", check_tech_resolution)
```

Each conditional edge is independent. The routing function only needs to know about the current state and the options available at that specific decision point.

## Testing Routing Functions

Routing bugs are among the hardest to debug in production because they cause the workflow to silently take the wrong path. Test routing functions thoroughly:

```python
def test_route_by_category():
    """Test all routing paths including edge cases."""
    # Standard categories
    assert route_by_category({"issue_category": "billing"}) == "billing_handler"
    assert route_by_category({"issue_category": "technical"}) == "tech_support"
    assert route_by_category({"issue_category": "account"}) == "account_handler"

    # Fallback for unknown categories
    assert route_by_category({"issue_category": "unknown"}) == "general_handler"
    assert route_by_category({"issue_category": ""}) == "general_handler"

    # Edge cases
    assert route_by_category({"issue_category": "BILLING"}) == "general_handler"
    # Oops! Case sensitivity bug. Fix the router to normalize input.

def test_priority_router():
    """Test multi-condition routing."""
    state = {
        "issue_category": "technical",
        "sentiment": "negative",
        "customer_tier": "premium"
    }
    assert priority_router(state) == "priority_escalation"

    state["customer_tier"] = "free"
    assert priority_router(state) == "senior_tech_support"
```

Write tests for every routing function. Cover the happy path, edge cases, fallbacks, and combinations of conditions. The cost of a routing bug in production (sending billing issues to tech support) far exceeds the cost of writing tests.

## Common Pitfalls

1. **No fallback in routing functions**: If the function returns a value that does not match any node name, the workflow crashes. Always include a default/fallback return.
2. **Case sensitivity**: LLM-based routers may return "Billing" instead of "billing". Normalize with `.strip().lower()`.
3. **Missing path map entries**: If you use a path map but the routing function returns a value not in the map, you get an error. Ensure complete coverage.
4. **Over-complex routing**: If your routing function has more than 10-15 branches, consider splitting it into a two-stage routing (coarse category first, then fine-grained routing within each handler).
5. **Testing only the happy path**: Routes that work in testing often fail in production because of unexpected LLM outputs. Test with adversarial inputs.

## Key Takeaways

- `add_conditional_edges` takes a source node and a routing function that returns the next node name
- Path maps make routing explicit and self-documenting — use them when you have a fixed set of destinations
- LLM-based routing is powerful but requires fallbacks for unexpected output
- Route to `END` for early termination when the workflow is done before all nodes run
- Test routing functions exhaustively — routing bugs are silent and costly
- Normalize string inputs (strip, lowercase) to prevent case sensitivity issues'
WHERE module_id = 'cccc0004-0000-0000-0000-000000000004' AND slug = 'conditional-edges-and-routing';

-- Module 4, Lesson 2: Parallel Execution Patterns
UPDATE public.lessons
SET content = '# Parallel Execution Patterns

Not every step in a workflow depends on the previous step. When tasks are independent, running them in parallel dramatically reduces latency. A three-source research task that takes 10 seconds sequentially can complete in 3-4 seconds with parallelism. LangGraph supports parallel execution natively through fan-out and fan-in patterns.

## The Fan-Out Pattern

Fan-out means one node triggers multiple nodes that run simultaneously. In LangGraph, you create fan-out by adding multiple edges from a single source node:

```python
from langgraph.graph import StateGraph, END

graph = StateGraph(ResearchState)

# Add nodes
graph.add_node("prepare", prepare_node)
graph.add_node("research_academic", research_academic_node)
graph.add_node("research_industry", research_industry_node)
graph.add_node("research_news", research_news_node)
graph.add_node("synthesize", synthesize_node)

# Fan out: prepare triggers three parallel research nodes
graph.add_edge("prepare", "research_academic")
graph.add_edge("prepare", "research_industry")
graph.add_edge("prepare", "research_news")

graph.set_entry_point("prepare")
```

When `prepare` completes, LangGraph starts all three research nodes simultaneously. Each node runs independently and writes its results to the state.

## The Fan-In Pattern

Fan-in means multiple parallel nodes converge into a single node. The downstream node waits until all upstream nodes complete:

```python
# Fan in: all research nodes converge at synthesize
graph.add_edge("research_academic", "synthesize")
graph.add_edge("research_industry", "synthesize")
graph.add_edge("research_news", "synthesize")

graph.add_edge("synthesize", END)
```

LangGraph automatically waits for all three research nodes to finish before running `synthesize`. You do not need to write any synchronization code — it is handled by the graph engine.

## State Management with Parallel Nodes

Here is the critical challenge: when three nodes run in parallel and all write to the state, what happens? Without reducers, the last node to finish wins and overwrites the others.

The solution is reducers:

```python
from typing import TypedDict, Annotated

def merge_findings(existing: list, new: list) -> list:
    """Combine findings from multiple parallel nodes."""
    return existing + new

class ResearchState(TypedDict):
    topic: str
    findings: Annotated[list, merge_findings]
    report: str
```

Each parallel node appends its findings to the list, and the reducer ensures nothing is lost:

```python
def research_academic_node(state: ResearchState) -> dict:
    result = llm.invoke(
        f"Find academic research and scholarly perspectives on: "
        f"{state[''topic'']}. Include specific papers, authors, and "
        f"institutional findings."
    )
    return {
        "findings": [{
            "source": "academic",
            "content": result.content,
            "timestamp": datetime.now().isoformat()
        }]
    }

def research_industry_node(state: ResearchState) -> dict:
    result = llm.invoke(
        f"Find industry reports, case studies, and practitioner "
        f"perspectives on: {state[''topic'']}. Focus on real-world "
        f"applications and business impact."
    )
    return {
        "findings": [{
            "source": "industry",
            "content": result.content,
            "timestamp": datetime.now().isoformat()
        }]
    }

def research_news_node(state: ResearchState) -> dict:
    result = llm.invoke(
        f"Find recent news, announcements, and trending discussions "
        f"about: {state[''topic'']}. Focus on developments from the "
        f"last 6 months."
    )
    return {
        "findings": [{
            "source": "news",
            "content": result.content,
            "timestamp": datetime.now().isoformat()
        }]
    }
```

After all three nodes complete, `state["findings"]` contains a list with three entries — one from each source. The synthesize node then has everything it needs:

```python
def synthesize_node(state: ResearchState) -> dict:
    all_findings = state["findings"]
    sources = [f["source"] for f in all_findings]

    prompt = (
        f"Synthesize research on ''{state[''topic'']}'' from these sources: "
        f"{sources}.\n\n"
    )
    for finding in all_findings:
        prompt += f"## {finding[''source''].title()} Research\n"
        prompt += f"{finding[''content'']}\n\n"

    prompt += (
        f"Create a unified analysis that:\n"
        f"1. Identifies common themes across sources\n"
        f"2. Highlights contradictions or gaps\n"
        f"3. Provides actionable conclusions"
    )

    result = llm.invoke(prompt)
    return {"report": result.content}
```

## Complete Parallel Workflow Example

Here is the full working implementation:

```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langchain_anthropic import ChatAnthropic
from datetime import datetime

llm = ChatAnthropic(model="claude-sonnet-4-20250514")

def merge_findings(existing: list, new: list) -> list:
    return existing + new

class ResearchState(TypedDict):
    topic: str
    findings: Annotated[list, merge_findings]
    report: str

def prepare_node(state: ResearchState) -> dict:
    """Validate the topic and prepare for research."""
    return {"findings": []}  # Initialize empty findings list

# ... (research nodes as defined above) ...
# ... (synthesize node as defined above) ...

# Build the graph
graph = StateGraph(ResearchState)
graph.add_node("prepare", prepare_node)
graph.add_node("research_academic", research_academic_node)
graph.add_node("research_industry", research_industry_node)
graph.add_node("research_news", research_news_node)
graph.add_node("synthesize", synthesize_node)

graph.set_entry_point("prepare")

# Fan-out
graph.add_edge("prepare", "research_academic")
graph.add_edge("prepare", "research_industry")
graph.add_edge("prepare", "research_news")

# Fan-in
graph.add_edge("research_academic", "synthesize")
graph.add_edge("research_industry", "synthesize")
graph.add_edge("research_news", "synthesize")

graph.add_edge("synthesize", END)

app = graph.compile()

# Run it
result = app.invoke({
    "topic": "AI orchestration frameworks in enterprise",
    "findings": [],
    "report": ""
})

print(result["report"])
print(f"\nSources used: {len(result[''findings''])}")
```

## Conditional Fan-Out

Sometimes you only want to fan out to specific nodes based on conditions:

```python
def decide_research_sources(state: ResearchState) -> list[str]:
    """Determine which research sources to activate."""
    sources = ["research_academic"]  # Always research academic
    if state.get("include_industry", True):
        sources.append("research_industry")
    if state.get("include_news", True):
        sources.append("research_news")
    return sources

graph.add_conditional_edges(
    "prepare",
    decide_research_sources
)
```

When a routing function returns a **list** of node names instead of a single string, LangGraph runs all of them in parallel. This gives you dynamic fan-out based on state.

## Performance Considerations

Parallel execution improves latency but not cost. Three parallel LLM calls complete in the time of one, but you still pay for all three. Keep this in mind when designing workflows:

| Scenario | Sequential Time | Parallel Time | Cost |
|----------|----------------|---------------|------|
| 3 research nodes, 5s each | 15s | 5s | Same |
| 5 analysis nodes, 3s each | 15s | 3s | Same |
| 10 nodes, 2s each | 20s | 2s | Same |

The latency benefit grows linearly with the number of parallel tasks. For workflows where user experience matters (interactive applications, real-time support), this is significant.

## When to Use Parallel Execution

**Use parallel execution when:**
- Tasks are genuinely independent — no data dependencies between them
- Each parallel task takes meaningful time (seconds, not milliseconds)
- Latency matters more than cost
- You need multiple perspectives or data sources

**Avoid parallel execution when:**
- Tasks depend on each other''s output — they must run sequentially
- You are rate-limited by an external API — parallel calls may hit rate limits
- The merge logic is unreliable — complex state merging is error-prone
- You are debugging — sequential execution is easier to trace

## Common Pitfalls

1. **No reducer on shared fields**: Two parallel nodes writing to the same field without a reducer means the last one wins. Always use reducers for fields that parallel nodes update.
2. **Race conditions in external systems**: If two parallel nodes both call an external API that has rate limits, one may fail. Add retry logic to parallel nodes.
3. **Uneven execution times**: If one parallel node takes 30 seconds and the others take 2 seconds, the synthesize node waits for the slowest. Set timeouts on slow nodes.
4. **Forgetting to initialize accumulator fields**: If `findings` starts as undefined instead of `[]`, the reducer fails on the first append. Initialize in the prepare node.

## Key Takeaways

- Fan-out: add multiple edges from one node to trigger parallel execution
- Fan-in: add edges from multiple nodes to one node — it waits for all to complete
- Reducers are essential for parallel state updates — without them, data is lost
- Parallel execution improves latency but not cost
- Use conditional fan-out (return a list from routing function) for dynamic parallelism
- Initialize accumulator fields before fan-out to prevent reducer errors'
WHERE module_id = 'cccc0004-0000-0000-0000-000000000004' AND slug = 'parallel-execution-patterns';

-- Module 5, Lesson 1: Interrupts and Breakpoints
UPDATE public.lessons
SET content = '# Interrupts and Breakpoints

Not every decision should be automated. Sending a $50,000 invoice, deleting a customer account, or publishing content to millions of users — these are high-stakes actions that demand human judgment. LangGraph provides first-class support for pausing workflows at critical points, collecting human input, and resuming execution. This lesson covers the `interrupt` function, `interrupt_before` and `interrupt_after` breakpoints, the `Command` resume pattern, and how to design effective human-in-the-loop workflows.

## The Core Concept

An interrupt pauses the workflow, saves the complete state to the checkpoint store, and returns control to the calling application. The application then presents information to a human, collects their decision, and resumes the workflow with that decision injected into the state.

The flow looks like this:

```
Graph runs -> Reaches interrupt -> State saved -> Returns to app
                                                        |
Human reviews -> Makes decision -> App calls resume -> Graph continues
```

Crucially, the graph does not "wait" in memory. It is fully stopped. The state is in the checkpoint store. The resume can happen seconds, minutes, or days later — even from a different server instance.

## Using the interrupt() Function

The `interrupt()` function is the most flexible way to pause a workflow for human input:

```python
from langgraph.types import interrupt

def review_email_node(state: EmailState) -> dict:
    """Pause for human review of the draft email."""
    draft = state["draft_email"]
    recipient = state["recipient"]

    # This call pauses the workflow and sends data to the human
    decision = interrupt({
        "question": "Please review this email before sending",
        "draft": draft,
        "recipient": recipient,
        "options": ["approve", "reject", "edit"]
    })

    # Execution resumes here after the human responds
    return {
        "human_decision": decision,
        "reviewed": True
    }
```

When the graph reaches `interrupt()`:
1. The argument (the dict with question, draft, etc.) is returned to the calling application
2. The graph state is saved to the checkpoint store
3. Execution stops completely

The calling application is responsible for:
1. Displaying the interrupt data to the human
2. Collecting the human''s response
3. Calling resume with that response

## Resuming After an Interrupt

To resume a paused workflow, use the `Command` class:

```python
from langgraph.types import Command

config = {"configurable": {"thread_id": "email-campaign-42"}}

# Resume with the human''s decision
result = app.invoke(
    Command(resume="approve"),
    config=config
)
```

The `Command(resume=value)` sends the value back to the `interrupt()` call. In the review node above, `decision` will be `"approve"`. The node continues executing from the line after `interrupt()`.

You can send any serializable value through resume — strings, dicts, lists:

```python
# Human wants to edit the draft
result = app.invoke(
    Command(resume={
        "action": "edit",
        "new_draft": "Updated email content here...",
        "notes": "Changed the tone to be more professional"
    }),
    config=config
)
```

## Breakpoints: interrupt_before and interrupt_after

Breakpoints are a simpler mechanism when you want to pause before or after a specific node without modifying the node''s code:

```python
from langgraph.checkpoint.memory import MemorySaver

checkpointer = MemorySaver()

app = graph.compile(
    checkpointer=checkpointer,
    interrupt_before=["send_email", "process_payment"],
    interrupt_after=["generate_report"]
)
```

**`interrupt_before`** pauses execution just before the named node runs. The state at this point reflects everything up to (but not including) the paused node. This is ideal for approval gates: the human can inspect the proposed action and decide whether to allow it.

**`interrupt_after`** pauses execution just after the named node completes. The state includes the node''s output. This is useful for review gates: the human can inspect the output and decide whether to accept it or request changes.

### Breakpoint Workflow Example

```python
config = {"configurable": {"thread_id": "payment-processing-99"}}

# Run until the breakpoint
result = app.invoke(
    {"messages": [("user", "Process refund for order #1234")]},
    config=config
)

# At this point, execution is paused before "process_payment"
# Inspect what''s about to happen
state = app.get_state(config)
print(f"Next node: {state.next}")           # ["process_payment"]
print(f"Refund amount: {state.values.get(''refund_amount'')}")
print(f"Customer: {state.values.get(''customer_id'')}")

# Human approves — resume execution
result = app.invoke(None, config=config)
# "process_payment" node now runs, followed by remaining nodes
```

## Combining interrupt() with Breakpoints

You can use both mechanisms in the same graph. Breakpoints are for simple pause/resume. `interrupt()` is for collecting specific input from the human.

```python
def tool_confirmation_node(state: AgentState) -> dict:
    """Ask the human to confirm a tool call before execution."""
    proposed_tool = state["next_tool_call"]

    confirmation = interrupt({
        "question": f"The AI wants to call: {proposed_tool[''name'']}",
        "parameters": proposed_tool["args"],
        "estimated_cost": proposed_tool.get("cost_estimate"),
        "options": ["confirm", "deny", "modify"]
    })

    if confirmation == "deny":
        return {"tool_blocked": True, "tool_result": "Action denied by user"}

    if isinstance(confirmation, dict) and confirmation.get("action") == "modify":
        return {"next_tool_call": confirmation["modified_call"]}

    # Confirmed — proceed with original tool call
    return {"tool_confirmed": True}

# Compile with breakpoints for other nodes
app = graph.compile(
    checkpointer=checkpointer,
    interrupt_before=["finalize_output"]  # Also pause before final output
)
```

## Designing Effective Interrupt Points

Not every node should be an interrupt. Too many interrupts defeat the purpose of automation. Too few risks costly mistakes. Here is how to decide:

### Good Candidates for Interrupts

| Action | Why It Needs Human Review |
|--------|--------------------------|
| Sending emails/SMS to customers | Reputation risk from bad content |
| Financial transactions | Legal and financial liability |
| Database modifications | Data loss is often irreversible |
| Publishing content | Brand and legal exposure |
| Calling external APIs with side effects | Cannot undo external state changes |
| AI decisions with low confidence | Model uncertainty should trigger human review |

### Poor Candidates for Interrupts

| Action | Why It Should Not Be Interrupted |
|--------|----------------------------------|
| Data retrieval (read-only) | No risk, just information gathering |
| Internal classification | Intermediate step, not a final action |
| Text formatting/transformation | Low stakes, easily correctable |
| Logging and metrics | Operational, not business-critical |

### UX Principles for Interrupt Design

When a workflow pauses for human input, the experience must be frictionless:

1. **Present clear, concise information**: Show exactly what the AI is proposing to do
2. **Provide specific options**: "Approve / Reject / Edit" is better than an open text field
3. **Include full context**: Show what has happened so far, not just the current decision
4. **Make the default action obvious**: If approval is expected 90% of the time, make "Approve" the primary action
5. **Include an abort option**: Let the human cancel the entire workflow, not just the current step
6. **Set expectations**: Tell the human what happens after their decision

## Error Handling with Interrupts

What if the human never responds? What if the resume value is invalid?

```python
def robust_review_node(state: ReviewState) -> dict:
    """Review node with timeout tracking and validation."""
    decision = interrupt({
        "question": "Review this draft",
        "draft": state["draft"],
        "deadline": "2026-03-26T17:00:00Z",
        "fallback": "auto_approve"  # What to do if no response
    })

    # Validate the response
    valid_actions = {"approve", "reject", "edit"}
    if isinstance(decision, str) and decision in valid_actions:
        return {"human_decision": decision}
    elif isinstance(decision, dict) and decision.get("action") in valid_actions:
        return {
            "human_decision": decision["action"],
            "feedback": decision.get("feedback", "")
        }
    else:
        # Invalid response — treat as rejection for safety
        return {
            "human_decision": "reject",
            "feedback": f"Invalid response received: {decision}"
        }
```

Always validate resume values. The human interface might send unexpected data, especially if it is built by a different team.

## Common Pitfalls

1. **No checkpointer**: Interrupts require checkpointing. Without a checkpointer, the state is lost when the workflow pauses and resume is impossible.
2. **Too many interrupts**: If every other node pauses for approval, humans will develop "approval fatigue" and rubber-stamp everything — defeating the purpose.
3. **Insufficient context in interrupt data**: If the human has to look up information elsewhere to make a decision, the interrupt UX is broken.
4. **Not handling the abort case**: Humans sometimes want to cancel the entire workflow. Provide a clear path for this.
5. **Assuming synchronous resume**: The resume might come hours later. Make sure your workflow handles the time gap gracefully (state is stale, external data may have changed).

## Key Takeaways

- `interrupt()` pauses the workflow and returns data to the calling application for human review
- `Command(resume=value)` sends the human''s decision back to the workflow
- `interrupt_before` and `interrupt_after` are compile-time breakpoints for simple pause/resume
- Checkpointing is required — without it, interrupts cannot work
- Reserve interrupts for high-stakes, irreversible actions — not every decision needs human oversight
- Always validate resume values and handle edge cases (invalid input, missing response, abort)'
WHERE module_id = 'cccc0005-0000-0000-0000-000000000005' AND slug = 'interrupts-and-breakpoints';

-- Module 5, Lesson 2: Approval Workflows
UPDATE public.lessons
SET content = '# Approval Workflows

Approval workflows are one of the most common patterns in enterprise AI systems. A process generates output, a human reviews and approves (or rejects) it, and the workflow continues or loops back for revision. This pattern combines the speed of AI with the judgment of humans. In this lesson, we build a complete approval workflow with revision loops, multi-level approval chains, tool confirmation patterns, and audit trails.

## The Basic Approval Pattern

Every approval workflow follows this structure:

```
Generate -> Review (INTERRUPT) -> Approved? -> Publish
                                      |
                                 Rejected -> Revise -> Review (INTERRUPT)
```

The AI does the heavy lifting (generation, revision). The human makes the critical decision (approve or reject). The loop continues until the output meets the human''s standards.

## Complete Implementation

```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.types import interrupt, Command
from langgraph.checkpoint.memory import MemorySaver
from langchain_anthropic import ChatAnthropic
from datetime import datetime

llm = ChatAnthropic(model="claude-sonnet-4-20250514")

class ApprovalState(TypedDict):
    messages: Annotated[list, add_messages]
    task_description: str
    draft: str
    feedback: str
    approved: bool
    revision_count: int
    max_revisions: int
    approval_history: list  # Audit trail
    final_output: str

def generate_node(state: ApprovalState) -> dict:
    """Generate or revise the draft based on feedback."""
    feedback = state.get("feedback", "")
    revision = state.get("revision_count", 0)

    if revision == 0:
        prompt = (
            f"Write a professional marketing email for: "
            f"{state[''task_description'']}\n\n"
            f"Requirements:\n"
            f"- Professional but engaging tone\n"
            f"- Clear call to action\n"
            f"- Under 200 words"
        )
    else:
        prompt = (
            f"Revise this draft based on the reviewer''s feedback.\n\n"
            f"Original task: {state[''task_description'']}\n"
            f"Current draft:\n{state[''draft'']}\n\n"
            f"Reviewer feedback:\n{feedback}\n\n"
            f"This is revision {revision}. Address all feedback points."
        )

    result = llm.invoke(prompt)
    return {"draft": result.content}


def review_node(state: ApprovalState) -> dict:
    """Pause for human review of the draft."""
    revision = state.get("revision_count", 0)

    decision = interrupt({
        "type": "approval_request",
        "draft": state["draft"],
        "revision_number": revision,
        "task": state["task_description"],
        "prompt": (
            "Review this draft. You can:\n"
            "- Approve: {\"action\": \"approve\"}\n"
            "- Reject with feedback: {\"action\": \"reject\", "
            "\"feedback\": \"your feedback here\"}\n"
            "- Edit directly: {\"action\": \"edit\", "
            "\"new_draft\": \"edited content\"}"
        )
    })

    # Build audit record
    audit_record = {
        "reviewer": decision.get("reviewer", "unknown"),
        "action": decision["action"],
        "timestamp": datetime.now().isoformat(),
        "revision_number": revision,
        "feedback": decision.get("feedback", "")
    }

    if decision["action"] == "approve":
        return {
            "approved": True,
            "approval_history": state.get("approval_history", [])
                + [audit_record]
        }
    elif decision["action"] == "edit":
        return {
            "draft": decision["new_draft"],
            "approved": True,
            "approval_history": state.get("approval_history", [])
                + [audit_record]
        }
    else:  # reject
        return {
            "approved": False,
            "feedback": decision.get("feedback", "Please improve the draft"),
            "revision_count": revision + 1,
            "approval_history": state.get("approval_history", [])
                + [audit_record]
        }


def publish_node(state: ApprovalState) -> dict:
    """Publish the approved draft."""
    return {
        "final_output": state["draft"],
        "messages": [("system",
            f"Draft approved and published after "
            f"{state.get(''revision_count'', 0)} revision(s)")]
    }


def route_after_review(state: ApprovalState) -> str:
    """Route based on approval decision and revision limits."""
    if state.get("approved"):
        return "publish"
    max_rev = state.get("max_revisions", 5)
    if state.get("revision_count", 0) >= max_rev:
        return "publish"  # Force publish after max revisions
    return "generate"     # Loop back for revision
```

## Assembling the Graph

```python
graph = StateGraph(ApprovalState)

graph.add_node("generate", generate_node)
graph.add_node("review", review_node)
graph.add_node("publish", publish_node)

graph.set_entry_point("generate")
graph.add_edge("generate", "review")
graph.add_conditional_edges("review", route_after_review)
graph.add_edge("publish", END)

checkpointer = MemorySaver()
app = graph.compile(checkpointer=checkpointer)
```

## Running the Approval Workflow

```python
config = {"configurable": {"thread_id": "email-campaign-march-2026"}}

# Step 1: Generate initial draft (runs until interrupt)
result = app.invoke({
    "task_description": "Spring product launch announcement",
    "draft": "",
    "feedback": "",
    "approved": False,
    "revision_count": 0,
    "max_revisions": 3,
    "approval_history": [],
    "final_output": ""
}, config=config)

# The workflow is now paused at the review node
# In a real app, you would display the draft to the reviewer

# Step 2: Human rejects with feedback
result = app.invoke(
    Command(resume={
        "action": "reject",
        "feedback": "Tone is too casual. Make it more professional.",
        "reviewer": "marketing-lead"
    }),
    config=config
)

# The workflow revises and pauses again at review

# Step 3: Human approves
result = app.invoke(
    Command(resume={
        "action": "approve",
        "reviewer": "marketing-lead"
    }),
    config=config
)

# Workflow completes — draft is published
print(result["final_output"])
print(f"Approval history: {result[''approval_history'']}")
```

## Tool Confirmation Pattern

A powerful variant of the approval workflow is **tool confirmation** — where the AI proposes a tool call and the human approves it before execution:

```python
def propose_tool_node(state: AgentState) -> dict:
    """AI proposes a tool call for human approval."""
    response = llm.invoke(state["messages"])

    if response.tool_calls:
        tool_call = response.tool_calls[0]
        confirmation = interrupt({
            "type": "tool_confirmation",
            "tool_name": tool_call["name"],
            "tool_args": tool_call["args"],
            "reasoning": "Based on the conversation, I want to "
                        f"call {tool_call[''name'']} to help resolve "
                        "your request.",
            "options": ["confirm", "deny", "modify"]
        })

        if confirmation == "deny":
            return {"messages": [
                AIMessage(content="I understand. Let me try a "
                         "different approach.")
            ]}
        return {"pending_tool_call": tool_call}

    return {"messages": [response]}
```

This pattern is essential for AI agents that interact with external systems. The human verifies that the AI''s intended action is correct before any side effects occur.

## Multi-Level Approval Chains

Enterprise workflows often require approvals from multiple people in sequence:

```python
class MultiApprovalState(TypedDict):
    draft: str
    approval_chain: list[str]  # ["manager", "legal", "executive"]
    current_approver_index: int
    approvals: list[dict]
    all_approved: bool

def multi_review_node(state: MultiApprovalState) -> dict:
    """Route to the next approver in the chain."""
    chain = state["approval_chain"]
    index = state.get("current_approver_index", 0)
    current_approver = chain[index]

    decision = interrupt({
        "type": "multi_level_approval",
        "approver_role": current_approver,
        "draft": state["draft"],
        "previous_approvals": state.get("approvals", []),
        "remaining_approvers": chain[index + 1:]
    })

    new_approvals = state.get("approvals", []) + [{
        "approver": current_approver,
        "decision": decision["action"],
        "timestamp": datetime.now().isoformat()
    }]

    if decision["action"] != "approve":
        return {
            "approvals": new_approvals,
            "all_approved": False
        }

    # Check if this was the last approver
    if index + 1 >= len(chain):
        return {
            "approvals": new_approvals,
            "all_approved": True
        }

    return {
        "approvals": new_approvals,
        "current_approver_index": index + 1
    }

def route_multi_approval(state: MultiApprovalState) -> str:
    if state.get("all_approved"):
        return "publish"
    if not state["approvals"][-1]["decision"] == "approve":
        return "revise"  # Rejected — loop back
    return "multi_review"  # Next approver
```

Each approver sees the draft plus all previous approval decisions. Rejection at any level sends the workflow back for revision.

## Audit Trails for Compliance

For regulated industries, every approval decision must be recorded:

```python
class AuditRecord(TypedDict):
    reviewer: str
    role: str
    action: str  # approve, reject, edit
    timestamp: str
    feedback: str
    draft_version: int
    ip_address: str  # From the resume metadata

# Include in your state
class State(TypedDict):
    approval_history: list  # List of AuditRecord dicts
```

The approval history is immutable — records are only appended, never modified or deleted. Combined with checkpointing, you have a complete, verifiable record of every decision in the workflow.

## Timeout and Escalation Handling

Humans are not always available. Production approval workflows need timeout handling:

```python
def check_approval_timeout(state: ApprovalState) -> str:
    """Route based on whether the approval has timed out."""
    last_pause = state.get("paused_at")
    if last_pause:
        elapsed = datetime.now() - datetime.fromisoformat(last_pause)
        if elapsed.total_seconds() > 86400:  # 24 hours
            if state.get("escalation_count", 0) < 2:
                return "escalate_approver"
            return "auto_approve_low_risk"  # Last resort
    return "wait_for_review"
```

Design your escalation chain: primary approver (24h) then backup approver (12h) then auto-approve for low-risk items or auto-reject for high-risk items.

## Common Pitfalls

1. **No maximum revision limit**: Without `max_revisions`, a picky reviewer creates an infinite loop. Always cap the number of revision cycles.
2. **Lost feedback context**: When the workflow loops back to generate, pass the reviewer''s feedback explicitly. If the generate node does not see the feedback, it produces the same draft.
3. **Missing audit records**: In regulated environments, every approval decision must be logged. A missing record can mean a compliance violation.
4. **Approval fatigue**: If reviewers see too many approvals, they rubber-stamp everything. Reserve approvals for genuinely high-stakes decisions.
5. **No abort path**: The reviewer should be able to cancel the entire workflow, not just reject the current draft.

## Key Takeaways

- Approval workflows combine AI generation speed with human judgment quality
- The generate-review-revise loop is the core pattern — cap revisions with a safety limit
- Tool confirmation (interrupt before tool execution) prevents unintended side effects
- Multi-level approval chains route through multiple approvers in sequence
- Audit trails record every decision for compliance — append-only, never modify
- Handle timeouts with escalation chains to prevent workflows from stalling indefinitely'
WHERE module_id = 'cccc0005-0000-0000-0000-000000000005' AND slug = 'approval-workflows';

-- Module 6, Lesson 1: LangGraph Cloud & Self-Hosting
UPDATE public.lessons
SET content = '# LangGraph Cloud & Self-Hosting

You have built and tested your graph locally. Now it is time to deploy it for real users. LangGraph offers two deployment paths: the managed LangGraph Cloud (also called LangGraph Platform) and self-hosted deployment using Docker. This lesson covers both options in detail — setup, configuration, trade-offs, and the deployment workflow for each.

## LangGraph Cloud (LangGraph Platform)

LangGraph Cloud is a managed service by LangChain that handles infrastructure, scaling, and operations. You push your graph code, and LangGraph Cloud provides a production API endpoint.

### What You Get

- **Hosted API endpoints**: Your graph is exposed as a REST API that any client can call
- **Built-in checkpointing**: Persistent state storage with PostgreSQL — no setup required
- **Automatic scaling**: Handles traffic spikes without manual intervention
- **Streaming support**: Real-time streaming of node outputs to connected clients
- **LangGraph Studio**: A visual debugger and monitoring UI for inspecting graph runs
- **Authentication**: API key management and access control out of the box
- **Cron jobs**: Schedule graph executions on a recurring basis

### Project Structure for Cloud Deployment

LangGraph Cloud expects a specific project structure:

```
my_project/
  langgraph.json       # Configuration file
  src/
    agent.py           # Your graph definition
    tools.py           # Tool definitions
    state.py           # State schema
  requirements.txt     # Python dependencies
  .env                 # Environment variables (API keys)
```

The `langgraph.json` configuration file tells LangGraph Cloud how to find your graph:

```json
{
  "dependencies": ["."],
  "graphs": {
    "customer_support": "./src/agent.py:graph"
  },
  "env": ".env"
}
```

### Deployment Steps

```bash
# Install the LangGraph CLI
pip install langgraph-cli

# Test locally first (starts a local LangGraph server)
langgraph dev

# Deploy to LangGraph Cloud
langgraph deploy
```

The `langgraph dev` command runs your graph locally with the same API interface as the cloud. This lets you test the API integration before deploying.

After deployment, you receive an API endpoint:

```
https://your-project.langgraph.app/runs
```

### Calling the Deployed Graph

```python
from langgraph_sdk import get_client

client = get_client(
    url="https://your-project.langgraph.app",
    api_key="your-api-key"
)

# Create a thread (conversation/session)
thread = await client.threads.create()

# Start a run
run = await client.runs.create(
    thread["thread_id"],
    "customer_support",  # Graph name from langgraph.json
    input={
        "messages": [{"role": "user", "content": "Help with billing"}]
    }
)

# Stream results
async for event in client.runs.stream(
    thread["thread_id"],
    "customer_support",
    input={"messages": [{"role": "user", "content": "Help with billing"}]}
):
    print(event)
```

### LangGraph Studio

LangGraph Studio is a visual interface for debugging and monitoring deployed graphs:

- **Graph visualization**: See your nodes and edges as an interactive diagram
- **Run inspection**: Click any run to see the state at each node
- **Real-time monitoring**: Watch runs execute in real time
- **State editing**: Modify state mid-execution for debugging
- **Replay**: Re-run a graph from any checkpoint

Studio is invaluable during development and for production debugging. It connects to both local (`langgraph dev`) and cloud deployments.

## Self-Hosted Deployment with Docker

For organizations that need full control over infrastructure — data residency, compliance, cost optimization — LangGraph supports self-hosted deployment.

### Docker Setup

LangGraph provides an official Docker image. Create a `Dockerfile`:

```dockerfile
FROM langchain/langgraph-api:latest

# Copy your project
COPY . /app
WORKDIR /app

# Install dependencies
RUN pip install -r requirements.txt

# The langgraph.json file configures the server
```

Build and run:

```bash
# Build the image
docker build -t my-langgraph-app .

# Run with environment variables
docker run -p 8123:8000 \
  -e ANTHROPIC_API_KEY=your-key \
  -e DATABASE_URI=postgresql://user:pass@host:5432/db \
  my-langgraph-app
```

### Docker Compose for Full Stack

A production self-hosted deployment needs a database for checkpointing and optionally Redis for caching:

```yaml
version: "3.8"

services:
  langgraph:
    build: .
    ports:
      - "8123:8000"
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - DATABASE_URI=postgresql://postgres:postgres@db:5432/langgraph
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16
    environment:
      - POSTGRES_DB=langgraph
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

```bash
docker compose up -d
```

### Self-Hosting Checklist

When you self-host, you are responsible for:

| Responsibility | What to Do |
|---------------|------------|
| **Database** | Provision PostgreSQL, configure backups, monitor disk usage |
| **Scaling** | Use Kubernetes or auto-scaling groups for traffic spikes |
| **SSL/TLS** | Terminate SSL at the load balancer (nginx, ALB, etc.) |
| **Authentication** | Implement API key validation or OAuth |
| **Monitoring** | Set up health checks, metrics collection, alerting |
| **Updates** | Track LangGraph releases and update the Docker image |
| **Secrets** | Use a secrets manager (AWS Secrets Manager, Vault) — never put API keys in code |

## Choosing Between Cloud and Self-Hosted

| Factor | LangGraph Cloud | Self-Hosted |
|--------|----------------|-------------|
| **Time to deploy** | Minutes | Days to weeks |
| **Operational burden** | None — fully managed | Significant — your team manages everything |
| **Cost at low volume** | Pay per use — efficient for small scale | Fixed infrastructure cost regardless of usage |
| **Cost at high volume** | Can become expensive at scale | More cost-effective once infrastructure is amortized |
| **Data residency** | Data on LangChain infrastructure | Full control over data location |
| **Customization** | Limited to platform capabilities | Unlimited — you control every layer |
| **Compliance** | SOC 2 (check current certifications) | Depends on your setup |

### Decision Framework

**Choose LangGraph Cloud when:**
- You want to ship fast and iterate quickly
- Your team is small and cannot dedicate resources to infrastructure
- Data residency is not a hard requirement
- You value managed scaling over cost optimization

**Choose self-hosting when:**
- Your organization has strict data residency or compliance requirements
- You have an existing Kubernetes/Docker infrastructure team
- High volume makes per-request pricing prohibitive
- You need custom networking, VPN access, or private cloud deployment

## API Design Best Practices

Regardless of deployment method, design your graph''s API contract carefully:

```python
# Clean, well-documented state for API consumers
class APIInput(TypedDict):
    messages: list[dict]     # [{"role": "user", "content": "..."}]
    customer_id: str         # Required for context
    session_metadata: dict   # Optional metadata

class APIOutput(TypedDict):
    messages: list[dict]     # Response messages
    resolution: str          # What was resolved
    escalated: bool          # Whether human escalation is needed
```

Keep the API surface small. Internal state fields (iteration counts, intermediate data) should not be exposed to API consumers.

## Common Pitfalls

1. **Deploying without testing locally**: Always run `langgraph dev` and test the full API before deploying to cloud or Docker.
2. **Hardcoding API keys**: Use environment variables or a secrets manager. Never commit keys to source control.
3. **No health checks**: Without health checks, your load balancer cannot detect unhealthy instances. Add a `/health` endpoint.
4. **Ignoring checkpoint storage growth**: Production checkpoints accumulate. Implement a retention policy to delete old checkpoints.
5. **Single-instance deployment**: For production, run at least two instances behind a load balancer for redundancy.

## Key Takeaways

- LangGraph Cloud is the fastest path to production — minutes to deploy, zero infrastructure management
- Self-hosting with Docker gives you full control at the cost of operational complexity
- Both options expose the same REST API — your client code works with either
- LangGraph Studio provides visual debugging for both local and cloud deployments
- Design your API contract carefully — keep internal state hidden from consumers
- Always test locally before deploying, use environment variables for secrets, and implement health checks'
WHERE module_id = 'cccc0006-0000-0000-0000-000000000006' AND slug = 'langgraph-cloud-self-hosting';

-- Module 6, Lesson 2: Monitoring, Logging, and Debugging
UPDATE public.lessons
SET content = '# Monitoring, Logging, and Debugging

A deployed graph without monitoring is a liability. When a customer support workflow silently misclassifies inquiries, when a document processor takes 10x longer than normal, when your monthly LLM bill spikes — you need to know immediately. This lesson covers LangSmith integration, structured logging, key metrics, debugging techniques, and alerting strategies for production LangGraph deployments.

## LangSmith Integration

LangSmith is LangChain''s observability platform, and it integrates seamlessly with LangGraph. It captures every LLM call, tool invocation, and node execution — giving you a complete trace of every graph run.

### Enabling LangSmith

```python
import os

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "your-langsmith-api-key"
os.environ["LANGCHAIN_PROJECT"] = "customer-support-prod"
```

That is all. With these environment variables set, every graph invocation is automatically traced in LangSmith. No code changes required.

### What LangSmith Captures

For every graph run, LangSmith records:

- **Full execution trace**: Which nodes ran, in what order, with what inputs and outputs
- **LLM call details**: Model, prompt, response, token count, latency
- **Tool invocations**: Tool name, parameters, results, errors
- **State snapshots**: The state before and after each node
- **Metadata**: Thread ID, run ID, timestamps, custom tags

### Using Traces for Debugging

When a workflow produces wrong output:

1. Find the run in LangSmith (search by thread ID, time range, or custom tags)
2. Open the trace to see the execution timeline
3. Click each node to inspect its input state and output state
4. Click each LLM call to see the exact prompt and response
5. Identify where the wrong data entered the pipeline

This is dramatically faster than adding print statements and re-running the workflow. LangSmith captures everything automatically, so you never have to add retroactive logging to reproduce a bug.

### Custom Metadata and Tags

Add custom metadata to make runs searchable:

```python
config = {
    "configurable": {"thread_id": "user-123"},
    "metadata": {
        "customer_tier": "premium",
        "issue_category": "billing",
        "source": "web_chat"
    },
    "tags": ["production", "billing", "premium"]
}

result = app.invoke(input_state, config=config)
```

In LangSmith, you can filter runs by tag (`billing`), metadata value (`customer_tier=premium`), or any combination. This is essential for investigating patterns — for example, "are billing inquiries from premium customers getting resolved?"

## Structured Logging

LangSmith captures LLM-level traces, but you also need application-level logs for operational monitoring. Use structured JSON logs:

```python
import logging
import json
from datetime import datetime

logger = logging.getLogger("langgraph.app")
logger.setLevel(logging.INFO)

def research_node(state: State) -> dict:
    start_time = datetime.now()
    thread_id = state.get("_thread_id", "unknown")

    logger.info(json.dumps({
        "event": "node_start",
        "node": "research",
        "thread_id": thread_id,
        "iteration": state.get("iterations", 0),
        "input_length": len(str(state.get("messages", [])))
    }))

    try:
        result = llm.invoke(prompt)
        elapsed = (datetime.now() - start_time).total_seconds()

        logger.info(json.dumps({
            "event": "node_complete",
            "node": "research",
            "thread_id": thread_id,
            "duration_seconds": elapsed,
            "output_length": len(result.content),
            "success": True
        }))

        return {"research": result.content}

    except Exception as e:
        elapsed = (datetime.now() - start_time).total_seconds()
        logger.error(json.dumps({
            "event": "node_error",
            "node": "research",
            "thread_id": thread_id,
            "duration_seconds": elapsed,
            "error_type": type(e).__name__,
            "error_message": str(e),
            "success": False
        }))
        raise
```

### What to Log

| Log | Why |
|-----|-----|
| Node entry with timestamp | Track execution flow and identify stuck nodes |
| Node exit with duration | Identify slow nodes for optimization |
| LLM call token counts | Track cost per run |
| Routing decisions | Debug misrouting without reading LangSmith |
| Error details with context | Quick diagnosis without accessing the trace |
| State transitions | Understand which node produced which state change |

### What NOT to Log

| Do Not Log | Why |
|------------|-----|
| Full prompt text in production | Cost (log storage) and privacy |
| Customer PII | Regulatory compliance (GDPR, CCPA) |
| API keys or credentials | Security — even in internal logs |
| Full LLM responses | Use LangSmith for this; logs should be concise |

## Key Metrics to Track

### Performance Metrics

```python
# Track these in your metrics system (DataDog, Prometheus, CloudWatch)

# 1. End-to-end execution time
graph_duration_seconds = time.time() - start_time

# 2. Per-node latency
node_duration_seconds = node_end - node_start

# 3. Throughput
runs_per_minute = count_completed_runs(last_60_seconds)

# 4. Queue depth (if using async processing)
pending_runs = count_pending_runs()
```

### Quality Metrics

| Metric | What It Tells You | Healthy Range |
|--------|-------------------|---------------|
| Completion rate | % of runs that reach END | > 95% |
| Error rate | % of runs that fail with an exception | < 5% |
| Retry rate | % of nodes that needed retry | < 10% |
| Human intervention rate | % of runs that hit an interrupt | Depends on design |
| Loop iteration average | Average iterations before loop exit | < max_iterations / 2 |

### Cost Metrics

```python
# Track token usage per model per run
class CostTracker:
    def __init__(self):
        self.token_log = []

    def log_llm_call(self, model: str, input_tokens: int,
                     output_tokens: int):
        cost = self.calculate_cost(model, input_tokens, output_tokens)
        self.token_log.append({
            "model": model,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "cost_usd": cost,
            "timestamp": datetime.now().isoformat()
        })

    def total_cost(self) -> float:
        return sum(entry["cost_usd"] for entry in self.token_log)
```

Track cost per run, cost per customer, and daily/weekly totals. Set budget alerts before you get surprised by a bill.

## Debugging Production Issues

### Step 1: Inspect the Checkpoint

When a run fails or produces wrong output, start with the checkpoint:

```python
config = {"configurable": {"thread_id": "failing-thread-id"}}

state = app.get_state(config)
print(f"Current state: {json.dumps(state.values, indent=2)}")
print(f"Next node: {state.next}")
print(f"Metadata: {state.metadata}")
```

This tells you exactly where the workflow stopped and what the state looked like.

### Step 2: Walk the State History

```python
for checkpoint in app.get_state_history(config):
    source = checkpoint.metadata.get("source", "unknown")
    print(f"After node [{source}]:")
    print(f"  State keys: {list(checkpoint.values.keys())}")
    if "issue_category" in checkpoint.values:
        print(f"  Category: {checkpoint.values[''issue_category'']}")
    print()
```

This shows you the state after every node, so you can pinpoint exactly which node introduced the wrong data.

### Step 3: Check the LangSmith Trace

Open LangSmith, find the run by thread ID, and inspect the LLM calls. Common findings:

- **Misclassification**: The LLM returned "billing" when the issue was technical. Fix: improve the classification prompt or add few-shot examples.
- **Context window overflow**: The state grew too large and the LLM truncated important context. Fix: summarize intermediate results.
- **Tool failure**: An external API returned an error. Fix: add retry logic and error handling.

### Common Production Issues and Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| Infinite loop | Run never completes, high token usage | Add or reduce max_iterations |
| Context overflow | Garbled or truncated output | Summarize state between iterations |
| Routing bug | Wrong handler processes the request | Log routing inputs/outputs, add tests |
| Checkpoint bloat | Slow resume, high database usage | Implement retention policy |
| Rate limiting | Intermittent API errors | Add exponential backoff retry logic |
| Stale state on resume | Workflow uses outdated data | Refresh external data after resume |

## Alerting Strategy

Set up alerts for conditions that require immediate attention:

```python
# Example alert rules (implement in your monitoring system)

alerts = {
    "high_error_rate": {
        "condition": "error_rate > 5% over 15 minutes",
        "severity": "critical",
        "action": "page on-call engineer"
    },
    "latency_spike": {
        "condition": "p95_latency > 2x baseline over 10 minutes",
        "severity": "warning",
        "action": "notify Slack channel"
    },
    "cost_anomaly": {
        "condition": "hourly_cost > 3x average",
        "severity": "warning",
        "action": "notify team lead"
    },
    "queue_buildup": {
        "condition": "pending_runs > 200",
        "severity": "critical",
        "action": "auto-scale and page on-call"
    },
    "checkpoint_storage": {
        "condition": "db_size > 80% capacity",
        "severity": "warning",
        "action": "run cleanup job, notify infra team"
    }
}
```

The goal is to catch problems before users notice them. An alert that fires 5 minutes after a spike starts is infinitely more useful than discovering the problem the next morning.

## Common Pitfalls

1. **No monitoring at all**: "It works on my machine" is not a monitoring strategy. Add LangSmith and structured logging from day one.
2. **Logging too much**: Logging full LLM responses in production creates massive log volume and potential privacy issues. Be selective.
3. **No cost tracking**: LLM costs can spike unexpectedly. A workflow stuck in a loop can burn through hundreds of dollars in minutes.
4. **Alert fatigue**: Too many non-actionable alerts cause engineers to ignore all alerts. Every alert should require a specific action.
5. **No baseline metrics**: You cannot detect anomalies without knowing what "normal" looks like. Collect baseline metrics before going live.

## Key Takeaways

- LangSmith integration requires only three environment variables — enable it from day one
- Use structured JSON logs for application-level monitoring, LangSmith for LLM-level tracing
- Track three metric categories: performance (latency, throughput), quality (errors, completion rate), and cost (tokens, dollars)
- Debug with checkpoints first, state history second, LangSmith traces third
- Set up actionable alerts for error rate, latency, cost, and resource usage
- Collect baseline metrics during development so you can detect anomalies in production'
WHERE module_id = 'cccc0006-0000-0000-0000-000000000006' AND slug = 'monitoring-logging-debugging';

-- Module 7, Lesson 1: Project Requirements & Architecture
UPDATE public.lessons
SET content = '# Project Requirements & Architecture

Your capstone project brings together everything you have learned in this course. You will design and build an intelligent document processing pipeline — a system that ingests documents, classifies them, extracts key information, routes them for appropriate handling, and produces structured output with human oversight for high-stakes decisions. This is a real-world use case that enterprises pay significant money to automate.

## The Business Problem

A professional services firm processes hundreds of incoming documents daily: contracts, invoices, compliance reports, correspondence, and legal filings. Currently, a team of six people manually reads, classifies, and routes each document. The process is slow (24-48 hour turnaround), error-prone (8% misclassification rate), and expensive ($180K/year in labor).

Your LangGraph workflow will:

1. Accept a document and extract its text content
2. Classify the document type and urgency level
3. Extract structured data based on the document type
4. Route high-value or ambiguous documents for human review
5. Generate a structured summary for the firm''s document management system
6. Maintain a complete audit trail of all processing decisions

## Architecture Overview

### The Graph Structure

```
START -> ingest
ingest -> classify
classify -> route_document

route_document -> extract_contract (if contract)
route_document -> extract_invoice (if invoice)
route_document -> extract_compliance (if compliance)
route_document -> extract_general (if other)

extract_* -> quality_check
quality_check -> human_review (if low confidence or high value)
quality_check -> generate_summary (if confident)

human_review (INTERRUPT) -> generate_summary (if approved)
human_review (INTERRUPT) -> extract_* (if revision needed, LOOP)

generate_summary -> END
```

This graph combines every pattern from the course: branching (document routing), parallel processing (could fan out to multiple extractors), looping (revision after human feedback), and human-in-the-loop (review of high-stakes documents).

### State Schema

```python
from typing import TypedDict, Annotated, Optional
from langgraph.graph.message import add_messages
from datetime import datetime

class DocumentState(TypedDict):
    # Input
    document_text: str
    document_source: str
    received_at: str

    # Classification
    document_type: str       # contract, invoice, compliance, general
    confidence: float        # 0.0 to 1.0
    urgency: str             # low, medium, high, critical

    # Extraction
    extracted_data: dict     # Structured data from the document
    extraction_notes: str    # Notes about extraction quality

    # Processing
    messages: Annotated[list, add_messages]
    current_step: str
    error_count: int
    iteration_count: int
    max_iterations: int

    # Human review
    needs_review: bool
    review_reason: str
    reviewer_feedback: str

    # Output
    summary: str
    audit_trail: list        # List of processing decisions
    processed_at: str
```

Notice the separation of concerns: input fields, classification fields, extraction fields, processing metadata, human review fields, and output fields. This makes the state self-documenting.

### Node Specifications

**1. Ingest Node**

Responsible for receiving the document and preparing it for processing. Validates that the input is not empty, normalizes whitespace, and initializes workflow metadata.

```python
def ingest_node(state: DocumentState) -> dict:
    text = state["document_text"].strip()
    if not text:
        raise ValueError("Document text is empty")

    # Truncate very long documents to fit context window
    max_chars = 50000
    if len(text) > max_chars:
        text = text[:max_chars] + "\n\n[Document truncated]"

    return {
        "document_text": text,
        "current_step": "ingested",
        "iteration_count": 0,
        "error_count": 0,
        "audit_trail": [{
            "step": "ingest",
            "timestamp": datetime.now().isoformat(),
            "detail": f"Document received, {len(text)} characters"
        }]
    }
```

**2. Classify Node**

Uses the LLM to determine document type, urgency, and classification confidence:

```python
def classify_node(state: DocumentState) -> dict:
    json_template = (
        ''{"type": "contract|invoice|compliance|general", ''
        ''"urgency": "low|medium|high|critical", ''
        ''"confidence": 0.0-1.0}''
    )
    prompt = (
        f"Classify this document. Respond in JSON format:\n"
        f"{json_template}\n\n"
        f"Document (first 2000 chars):\n"
        f"{state[''document_text''][:2000]}"
    )
    result = llm.invoke(prompt)
    classification = parse_json_response(result.content)

    return {
        "document_type": classification["type"],
        "urgency": classification["urgency"],
        "confidence": classification["confidence"],
        "current_step": "classified",
        "audit_trail": state["audit_trail"] + [{
            "step": "classify",
            "timestamp": datetime.now().isoformat(),
            "detail": (
                f"Type: {classification[''type'']}, "
                f"Urgency: {classification[''urgency'']}, "
                f"Confidence: {classification[''confidence'']}"
            )
        }]
    }
```

**3. Routing Function**

```python
def route_document(state: DocumentState) -> str:
    doc_type = state["document_type"]
    routing = {
        "contract": "extract_contract",
        "invoice": "extract_invoice",
        "compliance": "extract_compliance",
        "general": "extract_general"
    }
    return routing.get(doc_type, "extract_general")
```

**4. Extraction Nodes (one per document type)**

Each extractor knows what structured data to pull from its document type:

```python
def extract_contract_node(state: DocumentState) -> dict:
    prompt = (
        f"Extract structured data from this contract:\n\n"
        f"{state[''document_text'']}\n\n"
        f"Extract in JSON format:\n"
        f"- parties (list of party names)\n"
        f"- effective_date\n"
        f"- expiration_date\n"
        f"- total_value (if mentioned)\n"
        f"- key_terms (list of important clauses)\n"
        f"- termination_conditions\n"
        f"- liability_clauses"
    )
    result = llm.invoke(prompt)
    extracted = parse_json_response(result.content)
    return {
        "extracted_data": extracted,
        "current_step": "extracted",
        "audit_trail": state["audit_trail"] + [{
            "step": "extract_contract",
            "timestamp": datetime.now().isoformat(),
            "detail": f"Extracted {len(extracted)} fields"
        }]
    }
```

**5. Quality Check Node**

Determines whether human review is needed:

```python
def quality_check_node(state: DocumentState) -> dict:
    needs_review = False
    reasons = []

    if state["confidence"] < 0.8:
        needs_review = True
        reasons.append(f"Low classification confidence: {state[''confidence'']}")

    if state["urgency"] in ("high", "critical"):
        needs_review = True
        reasons.append(f"High urgency: {state[''urgency'']}")

    value = state.get("extracted_data", {}).get("total_value")
    if value and parse_currency(value) > 100000:
        needs_review = True
        reasons.append(f"High value document: {value}")

    return {
        "needs_review": needs_review,
        "review_reason": "; ".join(reasons) if reasons else "N/A",
        "current_step": "quality_checked"
    }
```

**6. Human Review Node**

```python
from langgraph.types import interrupt

def human_review_node(state: DocumentState) -> dict:
    decision = interrupt({
        "type": "document_review",
        "document_type": state["document_type"],
        "urgency": state["urgency"],
        "confidence": state["confidence"],
        "review_reason": state["review_reason"],
        "extracted_data": state["extracted_data"],
        "document_preview": state["document_text"][:1000]
    })
    # Process human decision...
    return {
        "reviewer_feedback": decision.get("feedback", ""),
        "audit_trail": state["audit_trail"] + [{
            "step": "human_review",
            "timestamp": datetime.now().isoformat(),
            "detail": f"Reviewed by {decision.get(''reviewer'', ''unknown'')}: {decision[''action'']}"
        }]
    }
```

## Tools Required

| Tool | Purpose | Implementation |
|------|---------|---------------|
| Document parser | Extract text from PDF, DOCX, etc. | PyPDF2, python-docx, or external API |
| JSON parser | Parse LLM structured output | Custom with fallback handling |
| Currency parser | Normalize monetary values | Custom regex + parsing |
| Date parser | Normalize date formats | dateutil.parser |

## Evaluation Criteria

Test your capstone against these criteria:

1. **Classification accuracy**: Test with 20 sample documents across all types — target 90%+ accuracy
2. **Extraction completeness**: Verify all expected fields are extracted for each document type
3. **Routing correctness**: Every document type routes to the correct extractor
4. **Human review triggers**: Verify that high-value and low-confidence documents hit the review interrupt
5. **Loop termination**: Confirm the revision loop has a max_iterations safety valve
6. **State persistence**: Multi-turn review conversations maintain full state
7. **Error handling**: Malformed documents, empty inputs, and LLM failures are handled gracefully
8. **Audit trail completeness**: Every processing step is recorded

## Common Pitfalls

- **Skipping the design phase**: Drawing the graph before coding prevents architectural mistakes that are expensive to fix later
- **Over-engineering extraction**: Start with one document type end-to-end, then replicate the pattern
- **Not testing classification**: Classification errors cascade through the entire workflow — test it extensively
- **Missing audit records**: Every node should append to the audit trail — a missing record is a compliance gap

## Key Takeaways

- Design the full graph on paper first — nodes, edges, conditions, loops, and interrupts
- The state schema is the contract between all nodes — design it carefully with clear field groupings
- Build incrementally: ingest, then classify, then one extractor, then quality check, then human review
- Test classification with diverse inputs before building anything downstream
- The audit trail is not optional — it is a core feature for enterprise document processing'
WHERE module_id = 'cccc0007-0000-0000-0000-000000000007' AND slug = 'lg-capstone-requirements';

-- Module 7, Lesson 2: Implementation Guide & Best Practices
UPDATE public.lessons
SET content = '# Implementation Guide & Best Practices

This lesson provides a step-by-step implementation plan for the capstone project. Follow this order to build incrementally, test continuously, and avoid the pitfalls that derail complex LangGraph projects. We will also cover production best practices, error handling patterns, testing strategies, and performance optimization.

## Implementation Order

Building a complex graph all at once is a recipe for debugging nightmares. Instead, build and test incrementally:

### Phase 1: State and Skeleton (30 minutes)

Define the state schema and create stub nodes that return hardcoded values:

```python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages

class DocumentState(TypedDict):
    document_text: str
    document_type: str
    confidence: float
    urgency: str
    extracted_data: dict
    needs_review: bool
    review_reason: str
    reviewer_feedback: str
    summary: str
    audit_trail: list
    current_step: str
    iteration_count: int
    max_iterations: int
    error_count: int

# Stub nodes — hardcoded returns for testing graph structure
def ingest_stub(state: DocumentState) -> dict:
    return {"current_step": "ingested"}

def classify_stub(state: DocumentState) -> dict:
    return {
        "document_type": "contract",
        "confidence": 0.95,
        "urgency": "medium"
    }

def extract_contract_stub(state: DocumentState) -> dict:
    return {"extracted_data": {"parties": ["Acme Corp", "Widget Inc"]}}

def quality_check_stub(state: DocumentState) -> dict:
    return {"needs_review": False}

def generate_summary_stub(state: DocumentState) -> dict:
    return {"summary": "Stub summary"}

# Build and test the graph structure
graph = StateGraph(DocumentState)
graph.add_node("ingest", ingest_stub)
graph.add_node("classify", classify_stub)
graph.add_node("extract_contract", extract_contract_stub)
graph.add_node("quality_check", quality_check_stub)
graph.add_node("generate_summary", generate_summary_stub)

graph.set_entry_point("ingest")
graph.add_edge("ingest", "classify")
graph.add_edge("classify", "extract_contract")  # Simplified — no routing yet
graph.add_edge("extract_contract", "quality_check")
graph.add_edge("quality_check", "generate_summary")
graph.add_edge("generate_summary", END)

app = graph.compile()

# Verify the skeleton works
result = app.invoke({
    "document_text": "Sample contract text",
    "document_type": "", "confidence": 0.0, "urgency": "",
    "extracted_data": {}, "needs_review": False,
    "review_reason": "", "reviewer_feedback": "",
    "summary": "", "audit_trail": [],
    "current_step": "start",
    "iteration_count": 0, "max_iterations": 3, "error_count": 0
})
assert result["current_step"] == "ingested"  # Verify stub ran
print("Phase 1: Graph skeleton works")
```

This validates the graph structure — nodes, edges, and compilation — before you write any LLM logic.

### Phase 2: Classification (1 hour)

Replace the classification stub with a real LLM-powered node. This is the most critical node because every downstream decision depends on it:

```python
from langchain_anthropic import ChatAnthropic
import json

llm = ChatAnthropic(model="claude-sonnet-4-20250514")

def classify_node(state: DocumentState) -> dict:
    json_template = ''{"type": "...", "urgency": "...", "confidence": 0.XX}''
    prompt = (
        f"You are a document classifier for a professional services firm.\n\n"
        f"Classify this document into ONE of these types:\n"
        f"- contract: Legal agreements between parties\n"
        f"- invoice: Bills, payment requests, financial statements\n"
        f"- compliance: Regulatory filings, audit reports, certifications\n"
        f"- general: Correspondence, memos, other documents\n\n"
        f"Also assess:\n"
        f"- urgency: low, medium, high, critical\n"
        f"- confidence: 0.0 to 1.0 (how sure you are)\n\n"
        f"Respond ONLY with JSON:\n"
        f"{json_template}\n\n"
        f"Document:\n{state[''document_text''][:3000]}"
    )

    result = llm.invoke(prompt)

    try:
        classification = json.loads(result.content)
    except json.JSONDecodeError:
        # Fallback: try to extract from non-JSON response
        classification = {
            "type": "general",
            "urgency": "medium",
            "confidence": 0.5
        }

    # Validate
    valid_types = {"contract", "invoice", "compliance", "general"}
    doc_type = classification.get("type", "general")
    if doc_type not in valid_types:
        doc_type = "general"

    return {
        "document_type": doc_type,
        "urgency": classification.get("urgency", "medium"),
        "confidence": float(classification.get("confidence", 0.5)),
        "current_step": "classified",
        "audit_trail": state.get("audit_trail", []) + [{
            "step": "classify",
            "detail": f"Type: {doc_type}, Confidence: {classification.get(''confidence'', 0.5)}"
        }]
    }
```

**Test classification extensively before moving on:**

```python
test_documents = [
    ("This agreement is entered into between Party A and Party B...", "contract"),
    ("Invoice #12345. Amount due: $5,000. Payment terms: Net 30...", "invoice"),
    ("Annual compliance report for fiscal year 2025...", "compliance"),
    ("Dear team, please find attached the meeting notes...", "general"),
    # Add edge cases
    ("Purchase order for 500 units at $100 each...", "invoice"),
    ("Non-disclosure agreement between...", "contract"),
]

for doc_text, expected_type in test_documents:
    result = classify_node({
        "document_text": doc_text,
        "audit_trail": []
    })
    actual = result["document_type"]
    status = "PASS" if actual == expected_type else "FAIL"
    print(f"  {status}: Expected {expected_type}, got {actual}")
```

Target 90%+ accuracy before proceeding.

### Phase 3: Routing and Extraction (1-2 hours)

Add the routing function and build extraction nodes for each document type:

```python
def route_document(state: DocumentState) -> str:
    routing = {
        "contract": "extract_contract",
        "invoice": "extract_invoice",
        "compliance": "extract_compliance",
        "general": "extract_general"
    }
    return routing.get(state["document_type"], "extract_general")

# Replace the single edge with conditional routing
graph.add_conditional_edges("classify", route_document)

# All extractors converge at quality_check
graph.add_edge("extract_contract", "quality_check")
graph.add_edge("extract_invoice", "quality_check")
graph.add_edge("extract_compliance", "quality_check")
graph.add_edge("extract_general", "quality_check")
```

Build one extractor fully (contract), test it, then replicate the pattern for the others. Each extractor should know what fields to look for in its document type.

### Phase 4: Quality Gate and Human Review (1 hour)

Add the quality check node and human review interrupt:

```python
from langgraph.types import interrupt
from langgraph.checkpoint.memory import MemorySaver

def quality_check_node(state: DocumentState) -> dict:
    needs_review = False
    reasons = []

    if state["confidence"] < 0.8:
        needs_review = True
        reasons.append("Low classification confidence")
    if state["urgency"] in ("high", "critical"):
        needs_review = True
        reasons.append("High urgency document")

    return {
        "needs_review": needs_review,
        "review_reason": "; ".join(reasons) if reasons else "Automated processing"
    }

def route_after_quality(state: DocumentState) -> str:
    if state["needs_review"]:
        return "human_review"
    return "generate_summary"

def human_review_node(state: DocumentState) -> dict:
    decision = interrupt({
        "type": "document_review",
        "document_type": state["document_type"],
        "extracted_data": state["extracted_data"],
        "review_reason": state["review_reason"]
    })

    if decision["action"] == "approve":
        return {"current_step": "review_approved"}
    elif decision["action"] == "reclassify":
        return {
            "document_type": decision["new_type"],
            "iteration_count": state.get("iteration_count", 0) + 1
        }
    else:
        return {
            "reviewer_feedback": decision.get("feedback", ""),
            "iteration_count": state.get("iteration_count", 0) + 1
        }

def route_after_review(state: DocumentState) -> str:
    if state["current_step"] == "review_approved":
        return "generate_summary"
    if state.get("iteration_count", 0) >= state.get("max_iterations", 3):
        return "generate_summary"  # Safety valve
    return "classify"  # Re-process with updated information

# Add to graph
graph.add_conditional_edges("quality_check", route_after_quality)
graph.add_conditional_edges("human_review", route_after_review)

# Compile with checkpointer for interrupt support
checkpointer = MemorySaver()
app = graph.compile(checkpointer=checkpointer)
```

### Phase 5: Summary Generation and Polish (30 minutes)

```python
def generate_summary_node(state: DocumentState) -> dict:
    prompt = (
        f"Generate a structured summary for the document management system.\n\n"
        f"Document type: {state[''document_type'']}\n"
        f"Urgency: {state[''urgency'']}\n"
        f"Extracted data: {json.dumps(state[''extracted_data''], indent=2)}\n\n"
        f"Format:\n"
        f"- One-line description\n"
        f"- Key facts (bullet points)\n"
        f"- Action items (if any)\n"
        f"- Filing recommendation"
    )
    result = llm.invoke(prompt)
    return {
        "summary": result.content,
        "current_step": "complete",
        "audit_trail": state.get("audit_trail", []) + [{
            "step": "generate_summary",
            "detail": "Summary generated"
        }]
    }
```

## Error Handling Patterns

Production workflows must handle errors gracefully:

```python
def safe_node(func):
    """Decorator that adds error handling to any node."""
    def wrapper(state):
        try:
            return func(state)
        except json.JSONDecodeError as e:
            return {
                "error_count": state.get("error_count", 0) + 1,
                "current_step": f"error_json_parse",
                "audit_trail": state.get("audit_trail", []) + [{
                    "step": func.__name__,
                    "detail": f"JSON parse error: {str(e)}"
                }]
            }
        except Exception as e:
            return {
                "error_count": state.get("error_count", 0) + 1,
                "current_step": f"error_{type(e).__name__}",
                "audit_trail": state.get("audit_trail", []) + [{
                    "step": func.__name__,
                    "detail": f"Error: {str(e)}"
                }]
            }
    return wrapper

# Apply to all nodes
graph.add_node("classify", safe_node(classify_node))
graph.add_node("extract_contract", safe_node(extract_contract_node))
```

## Testing Strategy

```python
def test_end_to_end():
    """Test the full workflow with a sample contract."""
    config = {"configurable": {"thread_id": "test-e2e-001"}}
    result = app.invoke({
        "document_text": SAMPLE_CONTRACT,
        # ... initial state ...
    }, config=config)

    assert result["document_type"] == "contract"
    assert result["summary"] != ""
    assert len(result["audit_trail"]) >= 3  # ingest, classify, extract, summary

def test_human_review_trigger():
    """Test that low-confidence documents trigger review."""
    # Use a deliberately ambiguous document
    config = {"configurable": {"thread_id": "test-review-001"}}
    result = app.invoke({
        "document_text": "This could be a contract or an invoice...",
        # ... initial state ...
    }, config=config)

    state = app.get_state(config)
    assert "human_review" in (state.next or [])

def test_safety_valve():
    """Test that the revision loop terminates."""
    # Simulate max iterations being reached
    # Verify the workflow does not loop forever
```

## Production Best Practices Summary

1. **Build incrementally**: Stubs first, then one node at a time, testing at each step
2. **Test classification first**: It is the foundation — everything downstream depends on it
3. **Use checkpointing from the start**: Even in development, it enables debugging
4. **Log aggressively**: Every node, every decision, every error — to the audit trail and to logs
5. **Set safety valves on all loops**: max_iterations prevents runaway costs
6. **Validate LLM output**: JSON parsing, value clamping, fallback defaults — LLMs are not deterministic
7. **Handle errors in every node**: Use the decorator pattern for consistent error handling
8. **Measure resolution quality**: After deployment, track whether summaries are accurate and useful

## Common Pitfalls

1. **Building everything at once**: You will not be able to debug a 10-node graph if you built it all in one go. Build incrementally.
2. **Skipping classification testing**: A 10% misclassification rate means 10% of all documents are processed by the wrong extractor. Test with 20+ diverse samples.
3. **Not handling JSON parse failures**: LLMs sometimes return markdown-wrapped JSON, extra text, or malformed JSON. Always have a fallback.
4. **Missing the safety valve**: Without max_iterations, a human who keeps rejecting can loop the workflow forever. Cap it.
5. **No audit trail**: In enterprise environments, every processing decision must be traceable. The audit trail is not a nice-to-have.

## Key Takeaways

- Build in five phases: skeleton, classification, routing/extraction, human review, summary/polish
- Test each phase before starting the next — especially classification
- Use the decorator pattern for consistent error handling across all nodes
- The audit trail is a first-class feature, not an afterthought
- Safety valves (max iterations) prevent runaway loops and costs
- Validate all LLM output — JSON parsing, value ranges, fallback defaults
- You now have the complete skill set to build production LangGraph workflows'
WHERE module_id = 'cccc0007-0000-0000-0000-000000000007' AND slug = 'lg-capstone-implementation';
