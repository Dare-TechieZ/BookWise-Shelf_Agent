# 📚 BookWise — Autonomous Research Agent

link: https://book-wise-shelf-agent.vercel.app/

An **agentic AI research assistant** built with **Node.js, Express, React, Vite, and Groq**.

BookWise demonstrates an autonomous tool-using workflow where a Large Language Model interprets a user's request, determines which available tool is appropriate, executes that tool, evaluates the collected evidence, and generates a final response.

> **Current capability:** BookWise currently performs structured research using the **Books to Scrape catalogue** and **calculator-based numerical reasoning**. It is **not** an unrestricted web or academic research engine.

---

## Overview

The goal of **BookWise** is to demonstrate core concepts of **Agentic AI** through a practical research workflow.

Instead of responding directly to every request, the system allows the LLM to:

1. Understand the user's research objective.
2. Determine whether a tool is required.
3. Select an appropriate tool.
4. Execute the selected tool.
5. Observe the returned information.
6. Evaluate whether the available evidence is sufficient.
7. Perform additional tool calls when necessary.
8. Generate a final research answer.
9. Record the process in a research trace.

### Snapshots
![Alt Text](https://raw.githubusercontent.com/Dare-TechieZ/BookWise-Shelf_Agent/main/pics/bookwise1.png)
![Alt Text](https://raw.githubusercontent.com/Dare-TechieZ/BookWise-Shelf_Agent/main/pics/bookwise2.png)
![Alt Text](https://raw.githubusercontent.com/Dare-TechieZ/BookWise-Shelf_Agent/main/pics/bookwise3.png)
![Alt Text](https://raw.githubusercontent.com/Dare-TechieZ/BookWise-Shelf_Agent/main/pics/bookwise4.png)
![Alt Text](https://raw.githubusercontent.com/Dare-TechieZ/BookWise-Shelf_Agent/main/pics/bookwise5.png)
![Alt Text](https://raw.githubusercontent.com/Dare-TechieZ/BookWise-Shelf_Agent/main/pics/bookwise6.png)
![Alt Text](https://raw.githubusercontent.com/Dare-TechieZ/BookWise-Shelf_Agent/main/pics/bookwise7.png)

### Agent Workflow

```text
                    USER QUERY
                        │
                        ▼
                Query Understanding
                        │
                        ▼
                  Tool Selection
                        │
              ┌─────────┴─────────┐
              │                   │
              ▼                   ▼
       Books Catalogue       Calculator
              │                   │
              └─────────┬─────────┘
                        ▼
                    Observation
                        │
                        ▼
                 Evidence Evaluation
                        │
                  ┌─────┴─────┐
                  │           │
             Sufficient    Insufficient
                  │           │
                  │           ▼
                  │      Additional
                  │      Tool Call
                  │           │
                  └─────┬─────┘
                        ▼
                  Final Answer
                        │
                        ▼
                 Research Trace
```

---

# Current Scope

BookWise is currently a **tool-based research agent for structured catalogue research and numerical reasoning**.

The agent currently has access to:

* 📚 Books to Scrape catalogue
* 🧮 Calculator
* 🤖 Groq LLM
* 🔧 Function/tool calling
* 🧠 Autonomous tool selection
* 🔄 Multi-step tool execution
* 🔍 Critic/evaluation loop
* 📝 Research trace
* 📦 JSON outputs
* 🌐 Express REST API
* ⚛️ React + Vite frontend

The system's research capabilities are determined by the tools available to the agent.

---

# What Can BookWise Research?

## 1. 📚 Book Discovery

BookWise can search the **Books to Scrape** catalogue and retrieve information about books available in the catalogue.

It can work with information such as:

* Book title
* Price
* Rating
* Availability
* Category
* Book URL

### Example Queries

```text
Find 5 books under £15.
```

```text
Find 3 highly rated books.
```

```text
Find 5 books with a rating of 5.
```

```text
Find 10 books from the catalogue.
```

---

## 2. 📊 Book Comparison

BookWise can compare books using information retrieved from the catalogue.

Supported comparison attributes include:

* Price
* Rating
* Availability
* Category
* Title

### Example Queries

```text
Compare 5 books based on price and rating.
```

```text
Which of these books is the cheapest?
```

```text
Find the highest-rated books and compare their prices.
```

```text
Find the best-value books based on rating and price.
```

---

## 3. 🧮 Numerical Analysis

The calculator tool allows BookWise to perform basic arithmetic using retrieved or user-provided values.

It can be used for:

* Averages
* Differences
* Percentages
* Basic arithmetic
* Numerical comparisons

### Example Queries

```text
Calculate the average price of these books.
```

```text
What is the price difference between the cheapest and most expensive book?
```

```text
Calculate the percentage difference between £10 and £15.
```

---

## 4. 🔗 Combined Research Tasks

BookWise can combine multiple tools when a request requires more than one operation.

For example:

```text
Find 5 highly rated books under £20 and calculate their average price.
```

The agent can perform the following process:

```text
1. Understand the research objective
        ↓
2. Select Books to Scrape
        ↓
3. Retrieve relevant books
        ↓
4. Observe prices and ratings
        ↓
5. Select Calculator
        ↓
6. Calculate the average price
        ↓
7. Evaluate the evidence
        ↓
8. Generate final answer
```

This demonstrates that the agent is not limited to executing one predetermined function.

---

# Why Is BookWise an Agent?

A conventional application might follow a fixed workflow:

```text
User Request
     ↓
Fixed Function
     ↓
Result
```

BookWise instead allows the LLM to determine which available tool should be used.

The agent follows a dynamic workflow:

```text
User Request
     ↓
LLM Reasoning
     ↓
Tool Selection
     ↓
Tool Execution
     ↓
Observation
     ↓
Evaluation
     ↓
More Tools if Necessary
     ↓
Final Response
```

The important distinction is that the LLM acts as the **orchestrator** between the user request and the available tools.

> An agent cannot search a source for which no search tool has been provided.

---

# Current Limitations

The current version does **not** provide unrestricted internet access.

It cannot currently:

* Search Google
* Search Bing
* Search Google Scholar
* Search arXiv
* Search Semantic Scholar
* Search PubMed
* Search arbitrary websites
* Search current news
* Search live social media
* Perform unrestricted academic literature reviews
* Retrieve arbitrary research papers
* Search research databases
* Browse the entire internet

For example, a request such as:

```text
Find recent research papers on Hindi-English
code-switched speech recognition.
```

cannot currently be fulfilled because BookWise does not have an academic literature search or general web-search tool.

The LLM may understand the request, but it cannot retrieve reliable external evidence without an appropriate tool.

---

# Architecture

BookWise is divided into several logical layers.

## 1. Frontend Layer

The frontend is built using:

* React
* Vite
* CSS

The interface allows users to:

* Enter a research query
* Submit research requests
* View loading status
* View errors
* View the final answer
* Inspect agent activity
* View evaluation results
* Inspect the research trace

---

## 2. API Layer

The backend uses:

* Node.js
* Express

The frontend communicates with the backend through the REST API.

### Main Research Endpoint

```text
POST /api/research
```

### Request

```json
{
  "query": "Find 5 highly rated books under £20"
}
```

The backend processes the request through the BookWise agent workflow and returns the research result.

---

## 3. LLM Layer

The system uses **Groq** as the LLM provider.

The LLM is responsible for:

* Understanding user requests
* Selecting available tools
* Generating tool calls
* Interpreting tool results
* Deciding whether additional information is required
* Producing the final response

The LLM does not directly provide unrestricted external information.

Instead, external information must come through the tools available to the agent.

---

# Tool Layer

## 📚 Books to Scrape

The Books to Scrape tool provides structured catalogue information.

The scraper collects information including:

```text
Title
Price
Rating
URL
Category
Availability
```

The scraper also includes:

* Request delays
* Retry handling
* Error tracking
* Maximum page limits
* Maximum book limits
* JSON output generation

The resulting data can be used by the agent for structured research tasks.

---

## 🧮 Calculator

The calculator provides numerical reasoning capabilities.

It can be used when a research request requires calculations such as:

```text
Average
Difference
Percentage
Addition
Subtraction
Multiplication
Division
```

The LLM can decide to use the calculator when numerical reasoning is required.

---

# Agent Loop

The agent follows a tool-selection loop.

A simplified version is:

```text
while research is not complete:

    understand user request

    if a tool is required:
        select appropriate tool

        execute tool

        collect observation

        evaluate evidence

    if evidence is sufficient:
        generate final answer

    else:
        continue research
```

This allows the system to perform multi-step tasks rather than relying on a single fixed function.

---

# Evaluation Layer

BookWise contains a critic/evaluation stage.

After gathering information, the system evaluates whether the available evidence is sufficient for the requested task.

The evaluation can contain information such as:

```text
Confidence
Sufficiency
Reason
```

For example:

```text
Evidence sufficient
Confidence: 92%
```

or:

```text
Evidence may need more research
Confidence: 61%
```

The evaluation is also included in the returned research result.

---

# Research Trace

One of the important features of BookWise is the **research trace**.

The trace records observations generated during the research process.

For example:

```text
Query understood
      ↓
Tool: books
      ↓
Observation
      ↓
Tool: calculator
      ↓
Observation
      ↓
Critic evaluation
      ↓
Final answer
```

The frontend exposes this information so that users can inspect how the agent reached its answer.

This makes the system more transparent than a conventional chatbot interface.

---

# Output Files

The scraper generates structured JSON output files.

Typical outputs include:

```text
output/
├── books.json
├── errors.json
└── run-report.json
```

### `books.json`

Contains successfully scraped book records.

### `errors.json`

Contains records that failed during scraping.

### `run-report.json`

Contains information about the scraping run, such as:

* Number of catalogue pages processed
* Requested number of books
* Number of valid records
* Number of failed records
* Completion timestamp

---

# Project Structure

A simplified project structure is:

```text
autonomous-research-agent-final/
│
├── backend/
│   ├── ...
│   ├── output/
│   │   ├── books.json
│   │   ├── errors.json
│   │   └── run-report.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── App.css
│   │
│   ├── package.json
│   └── ...
│
├── README.md
└── ...
```

The exact backend file structure may vary depending on the implementation.

---

# Technology Stack

| Layer               | Technology      |
| ------------------- | --------------- |
| Frontend            | React           |
| Build Tool          | Vite            |
| Backend             | Node.js         |
| API Framework       | Express         |
| LLM                 | Groq            |
| Agent Architecture  | Tool Calling    |
| Data Source         | Books to Scrape |
| Numerical Reasoning | Calculator Tool |
| Data Format         | JSON            |
| API Communication   | REST            |

---

# Installation

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git

You also need a **Groq API key**.

---

## 1. Clone the Repository

```bash
git clone https://github.com/Dare-TechieZ/BookWise-Shelf_Agent
```

Move into the project:

```bash
cd autonomous-research-agent-final
```

---

## 2. Install Backend Dependencies

Open a terminal in the backend directory:

```bash
cd backend
npm install
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
GROQ_API_KEY=your_groq_api_key
```


## 4. Run the Backend

From the backend directory:

```bash
npm start
```

or, if the project uses a development script:

```bash
npm run dev
```

The backend should start on:

```text
http://localhost:5000
```

The frontend communicates with:

```text
http://localhost:5000/api/research
```

---

## 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

## 6. Run the Frontend

Start the Vite development server:

```bash
npm run dev
```

Vite will provide a local URL, usually similar to:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# Example Research Tasks

### 📚 Book Discovery

```text
Find 5 books under £15.
```

### ⭐ Rating Search

```text
Find 5 books with a rating of 5.
```

### 💰 Price Comparison

```text
Compare the prices of 5 highly rated books.
```

### 📊 Value Analysis

```text
Find the best-value books based on rating and price.
```

### 🧮 Numerical Research

```text
Find 5 books under £20 and calculate their average price.
```

### 🔗 Multi-tool Research

```text
Find 5 highly rated books under £20 and calculate the
average price and price difference between the cheapest
and most expensive book.
```

---

# Example Agent Trace

A request such as:

```text
Find 5 highly rated books under £20 and calculate their average price.
```

may result in a workflow similar to:

```text
USER QUERY
    ↓
Query understood
    ↓
Books tool selected
    ↓
Catalogue searched
    ↓
Book observations collected
    ↓
Calculator selected
    ↓
Average price calculated
    ↓
Evidence evaluated
    ↓
Final answer generated
```

The exact tool sequence depends on the LLM's decisions and the available tool results.

---

# Frontend

The React frontend provides a simple research interface containing:

* Research query input
* Example queries
* Research button
* Loading state
* Error state
* Agent activity timeline
* Evaluation panel
* Confidence score
* Final research answer
* Complete research trace

The frontend communicates with the backend through the research API.

---

# API

## Research

### Endpoint

```text
POST /api/research
```

### Request

```json
{
  "query": "Find 5 highly rated books under £20"
}
```

### Response

The response contains the research result generated by the BookWise agent.

A successful response includes information such as:

```json
{
  "success": true,
  "answer": "...",
  "trace": {},
  "evaluation": {}
}
```

> The exact response structure depends on the current backend implementation.

---

# Design Philosophy

BookWise is intended to demonstrate **Agentic AI concepts**, rather than simply function as a book-search website.

The important components are:

```text
LLM
 +
Tools
 +
Autonomous Tool Selection
 +
Observations
 +
Evaluation
 +
Trace
 =
Agentic Research Workflow
```

The Books to Scrape catalogue is currently used as the external information source because it provides a controlled and reproducible environment for demonstrating tool-based research.

---

# Research-Agent Capability Model

The current system can be viewed as:

```text
                    BOOKWISE AGENT
                         │
             ┌───────────┴───────────┐
             │                       │
          LLM Layer              Tool Layer
             │                       │
             │             ┌─────────┴─────────┐
             │             │                   │
             │          Books Tool        Calculator
             │             │                   │
             └─────────────┴───────────────────┘
                           │
                      Evaluation
                           │
                         Trace
                           │
                      Final Answer
```

The architecture is intentionally extensible.

Additional tools can be connected to the agent in the future without fundamentally changing the overall workflow.


---

# Development Notes

BookWise is designed as a **Track 4 — Agentic AI** capstone.

The primary objective is to demonstrate:

* LLM-based planning
* Tool selection
* Function calling
* Multi-step execution
* Evidence collection
* Critic-based evaluation
* Transparent research traces
* API-based agent architecture
* Frontend visualization of agent activity

The current book catalogue is therefore a **demonstration environment for the agent architecture**, rather than the final definition of what a research agent must support.

---



# Author

**Ria Saraswat**

**Track 4 — Agentic AI**
**BookWise — Autonomous Book Research Agent**

Built using:

```text
React
Vite
Node.js
Express
Groq
Books to Scrape
```

---
