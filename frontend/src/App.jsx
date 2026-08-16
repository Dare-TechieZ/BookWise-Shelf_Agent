import { useState } from "react";
import "./styles.css";

const API_URL = "https://bookwise-shelf-agent.onrender.com";

function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  async function research() {
    if (!query.trim() || loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/research`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Research failed.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      research();
    }
  }

  const trace = result?.trace;
  const observations = trace?.observations || [];
  const evaluation = result?.evaluation;

  return (
    <div className="app">

      {/* Decorative paper marks */}
      <div className="paper-circle paper-circle-one"></div>
      <div className="paper-circle paper-circle-two"></div>
      <div className="paper-cross">+</div>

      <header className="hero">

        <div className="tape tape-top"></div>

        <div className="hero-meta">
          <span className="issue">ISSUE No. 04</span>
          <span className="track">TRACK 4 · AGENTIC AI</span>
        </div>

        <div className="hero-title-wrap">
          <div className="scribble scribble-one"></div>

          <h2>
            Your <span>Shelf</span> Agent
          </h2>

          <h1 >
            <span>BookWise</span>
          </h1>

          <div className="title-sticker">
            <span>AI</span>
          </div>
        </div>

        <div className="hero-bottom">
          <p className="intro">
            an autonomous, tool-augmented research agent that plans tasks, 
            selects tools, gathers evidence, 
            evaluates results, and produces grounded answers!
          </p>

          <div className="hand-note">
            <span>field notes</span>
            <strong>→ think. search. verify.</strong>
          </div>
        </div>

        <div className="red-stroke"></div>
      </header>

      <main>

        {/* Research input */}
        <section className="research-sheet">

          <div className="paper-label">
            RESEARCH REQUEST
          </div>

          <div className="sheet-corner"></div>

          <div className="tape tape-input"></div>

          <label htmlFor="research-query">
            What are we looking for?
          </label>

          <textarea
            id="research-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Try: "Find 3 books and compare their prices"'
            rows="4"
          />

          <div className="input-footer">

            <div className="examples">

              <button
                onClick={() =>
                  setQuery("Find 3 books and compare their prices")
                }
              >
                <span className="mini-arrow">↗</span>
                Compare books
              </button>

              <button
                onClick={() =>
                  setQuery("Find 5 highly rated books under £15")
                }
              >
                <span className="mini-arrow">↗</span>
                Find best value
              </button>

            </div>

            <button
              className="research-btn"
              onClick={research}
              disabled={loading}
            >
              <span>
                {loading ? "WORKING..." : "START RESEARCH"}
              </span>
              <strong>↗</strong>
            </button>

          </div>

        </section>

        {/* Loading */}
        {loading && (
          <section className="loading-sheet">

            <div className="loading-stamp">
              <span>IN</span>
              <span>PROGRESS</span>
            </div>

            <div className="loading-copy">
              <div className="eyebrow">
                RESEARCHFLOW / FIELD NOTE
              </div>

              <h2>
                The agent is
                <span> digging.</span>
              </h2>

              <p>
                Selecting tools, gathering evidence and checking whether
                the answer has enough support.
              </p>

              <div className="loading-line">
                <span></span>
              </div>
            </div>

          </section>
        )}

        {/* Error */}
        {error && (
          <section className="error-sheet">

            <div className="error-symbol">!</div>

            <div>
              <div className="eyebrow">SOMETHING WENT WRONG</div>

              <h2>Research stopped.</h2>

              <p>{error}</p>
            </div>

          </section>
        )}

        {/* Results */}
        {result && (
          <div className="results-area">

            <div className="results-heading">
              <div>
                <span className="eyebrow">RESEARCH NOTEBOOK</span>

                <h2>
                  Findings from
                  <span> the field.</span>
                </h2>
              </div>

              <div className="page-number">
                PAGE
                <strong>01</strong>
              </div>
            </div>

            <section className="result-grid">

              {/* Agent activity */}
              <div className="polaroid activity-card">

                <div className="polaroid-image activity-image">
                  <div className="activity-symbol">
                    <div className="symbol-circle"></div>
                    <div className="symbol-square"></div>
                    <div className="symbol-line"></div>
                  </div>
                </div>

                <div className="polaroid-caption">

                  <div className="card-heading">
                    <span>01</span>
                    <h3>Agent Activity</h3>
                  </div>

                  <div className="timeline">

                    <div className="step done">
                      <span className="step-mark">✓</span>
                      <span>Query understood</span>
                    </div>

                    {observations.map((item, index) => (
                      <div className="step done" key={index}>
                        <span className="step-mark">✓</span>
                        <span>
                          {item.tool
                            ? `Tool: ${item.tool}`
                            : item.type || "Observation"}
                        </span>
                      </div>
                    ))}

                    <div
                      className={`step ${
                        evaluation?.sufficient ? "done" : ""
                      }`}
                    >
                      <span className="step-mark">
                        {evaluation?.sufficient ? "✓" : "○"}
                      </span>

                      <span>Critic evaluation</span>
                    </div>

                  </div>

                </div>

                <div className="sticker sticker-red">PROCESS</div>

              </div>

              {/* Evaluation */}
              <div className="polaroid evaluation-card">

                <div className="yellow-tape"></div>

                <div className="evaluation-top">
                  <span className="eyebrow">NOTE No. 02</span>

                  <div className="circle-mark">
                    <span>✓</span>
                  </div>
                </div>

                <h3>Evidence<br />Check</h3>

                <div className="score-wrap">
                  <div className="score">
                    {Math.round(
                      (evaluation?.confidence || 0) * 100
                    )}
                    <span>%</span>
                  </div>

                  <div className="score-label">
                    confidence
                  </div>
                </div>

                <div className="highlight">
                  {evaluation?.sufficient
                    ? "Evidence sufficient"
                    : "Evidence may need more research"}
                </div>

                {evaluation?.reason && (
                  <p className="evaluation-reason">
                    {evaluation.reason}
                  </p>
                )}

                <div className="pencil-line"></div>

                <span className="handwritten">
                  looks solid →
                </span>

              </div>

            </section>

            {/* Final answer */}
            <section className="answer-sheet">

              <div className="tape tape-answer"></div>

              <div className="answer-number">
                03
              </div>

              <div className="answer-header">

                <div>
                  <span className="eyebrow">
                    FINAL RESEARCH ANSWER
                  </span>

                  <h2>
                    What we
                    <span> found.</span>
                  </h2>
                </div>

                <div className="answer-stamp">
                  VERIFIED
                </div>

              </div>

              <div className="answer-text">
                {result.answer}
              </div>

              <div className="answer-footer">
                <span>ResearchFlow / Autonomous Agent</span>
                <span>END OF NOTE</span>
              </div>

            </section>

            {/* Trace */}
            <details className="trace-sheet">

              <summary>
                <span className="trace-icon">+</span>
                <span>
                  Open complete research trace
                </span>
                <span className="trace-arrow">↘</span>
              </summary>

              <pre>
                {JSON.stringify(trace, null, 2)}
              </pre>

            </details>

          </div>
        )}

      </main>

      <footer>

        <div className="footer-mark">
          <span className="footer-circle"></span>
          <span className="footer-square"></span>
          <span className="footer-triangle"></span>
        </div>

        <div>
          <strong>BookWise</strong>
          <span>
            Autonomous Book Research Agent · Groq + Node.js + React
          </span>
        </div>

        <span className="footer-note">
          made for curious minds.
        </span>

      </footer>

    </div>
  );
}

export default App;
