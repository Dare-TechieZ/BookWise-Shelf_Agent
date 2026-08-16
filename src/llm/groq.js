import "dotenv/config";
import Groq from "groq-sdk";

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is missing. Copy .env.example to .env and add your key.");
}

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const GROQ_MODEL =
  process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

export async function askGroq({ messages, tools = [], temperature = Number(process.env.AGENT_TEMPERATURE || 0.2) }) {
  return client.chat.completions.create({
    model: GROQ_MODEL,
    messages,
    tools: tools.length ? tools : undefined,
    tool_choice: tools.length ? "auto" : "none",
    temperature
  });
}

export function extractResponseText(response) {
  return response?.choices?.[0]?.message?.content || "";
}
