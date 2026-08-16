# Autonomous Research Agent — Track 4

A Node.js Agentic AI capstone powered by Groq.

The system demonstrates an agentic research workflow in which a
Large Language Model interprets a user request, selects appropriate
tools, gathers information, evaluates the collected evidence, and
generates a final response.

## Current Scope

The current implementation is a **tool-based research agent focused on
structured catalogue research and numerical reasoning**.

At present, the agent has access to:

- Books to Scrape catalogue
- Calculator tool
- Groq LLM
- Function/tool calling
- Autonomous tool-selection loop
- Critic/evaluation loop
- Research trace
- JSON outputs

The agent does **not** currently provide unrestricted web search or
general academic literature search.

---

## What Can It Research?

### 1. Book Discovery

The agent can search the Books to Scrape catalogue and retrieve
information about available books.

Example queries:

- "Find 5 books under £15."
- "Find 3 highly rated books."
- "Find 5 books with a rating of 5."
- "Find 10 books from the catalogue."

---

### 2. Book Comparison

The agent can compare books using information available in the
catalogue.

Supported comparison attributes include:

- Price
- Rating
- Availability
- Category
- Title

Example queries:

- "Compare 5 books based on price and rating."
- "Which of these books is the cheapest?"
- "Find the highest-rated books and compare their prices."
- "Find the best-value books based on rating and price."

---

### 3. Numerical Analysis

The calculator tool allows the agent to perform arithmetic operations
on retrieved or user-provided values.

Example queries:

- "Calculate the average price of these books."
- "What is the price difference between the cheapest and most expensive?"
- "Calculate the percentage difference between £10 and £15."

---

### 4. Combined Research Tasks

The agent can combine multiple tools when a task requires them.

For example:

> "Find 5 highly rated books under £20 and calculate their average price."

The agent can:

1. Understand the research objective.
2. Select the Books to Scrape tool.
3. Retrieve relevant book information.
4. Select the calculator when numerical analysis is required.
5. Evaluate whether the gathered information is sufficient.
6. Generate the final response.
7. Record the process in the research trace.

---

## What It Cannot Currently Do

The current implementation does **not** have unrestricted internet
search capabilities.

Therefore, it cannot currently perform tasks such as:

- Search Google or Bing
- Search Google Scholar
- Search arXiv
- Search Semantic Scholar
- Search PubMed
- Search recent research papers
- Search arbitrary websites
- Search current news
- Search live social media
- Perform unrestricted academic literature reviews
- Retrieve papers about arbitrary research topics
- Search Hindi-English code-switched speech literature

For example, a request such as:

> "Find recent research papers on Hindi-English code-switched
> speech recognition."

cannot currently be fulfilled because no academic/web-search tool
has been provided to the agent.

---

## Why It Is Called an Agent

The system demonstrates an **agentic workflow** rather than a
simple question-answering interface.

Instead of executing one fixed function for every request, the LLM
can determine which available tool is appropriate for the task.

The workflow is:

User Query
    ↓
Query Understanding
    ↓
Tool Selection
    ↓
Tool Execution
    ↓
Observation
    ↓
Evidence Evaluation
    ↓
Additional Tool Call if Required
    ↓
Final Answer

The research trace records these intermediate steps.

However, the agent's capabilities are bounded by the tools that are
currently available to it.

---

## Architecture

The system consists of:

### LLM Layer

Groq provides the language model responsible for:

- Understanding the user's request
- Selecting tools
- Interpreting tool results
- Deciding whether additional information is required
- Producing the final response

### Tool Layer

Currently available tools:

#### Books to Scrape

Used for:

- Book discovery
- Price comparison
- Rating comparison
- Availability information
- Category information

#### Calculator

Used for:

- Arithmetic
- Averages
- Differences
- Basic numerical analysis

### Evaluation Layer

A critic/evaluation step checks whether the gathered evidence is
sufficient for the requested task.

### Trace Layer

The system records the agent's observations and tool usage so that
the research process can be inspected.

---

## Features

- Groq LLM
- Function/tool calling
- Agentic tool-selection loop
- Books to Scrape catalogue integration
- Calculator integration
- Critic/evaluation loop
- Research trace
- JSON outputs
- Express REST API
- React + Vite frontend

---

## Setup

```bash
npm install