import "dotenv/config";
import express from "express";
import cors from "cors";
import { runAgent } from "../src/agent/agent.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "ResearchFlow AI" });
});

app.post("/api/research", async (req, res) => {
  const query = String(req.body?.query || "").trim();

  if (!query) {
    return res.status(400).json({
      success: false,
      error: "Please enter a research question."
    });
  }

  try {
    const result = await runAgent(query);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message || "Research failed."
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 ResearchFlow API running at http://localhost:${PORT}`);
});
