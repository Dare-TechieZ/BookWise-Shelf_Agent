import "dotenv/config";
import { askGroq, extractResponseText } from "../llm/groq.js";
import { SYSTEM_PROMPT } from "./prompts.js";
import { createAgentState, recordAction, recordObservation } from "./state.js";
import { evaluateResearch } from "./evaluator.js";
import { toolDefinitions, toolHandlers } from "../tools/toolRegistry.js";

async function executeTool(toolCall, state) {
  const name = toolCall.name;
  const handler = toolHandlers[name];

  if (!handler) return { success: false, error: `Unknown tool: ${name}` };

  let args = {};
  try {
    args = JSON.parse(toolCall.arguments || "{}");
  } catch {
    return { success: false, error: "Invalid tool arguments." };
  }

  recordAction(state, { type: "tool_call", tool: name, arguments: args });

  try {
    const result = await handler(args);
    recordObservation(state, { tool: name, result });
    return result;
  } catch (error) {
    const result = { success: false, error: error.message };
    recordObservation(state, { tool: name, result });
    return result;
  }
}

export async function runAgent(query) {
  const state = createAgentState(query);

  const input = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: query }
  ];

  while (state.iteration < state.maxIterations) {
    state.iteration++;
    console.log(`\n🧠 Agent iteration ${state.iteration}`);

    const response = await askGroq({ messages: input, tools: toolDefinitions });
    const message = response?.choices?.[0]?.message;

    if (!message) throw new Error("Groq returned an invalid response.");

    const toolCalls = message.tool_calls || [];

    if (toolCalls.length > 0) {
      input.push(message);

      for (const toolCall of toolCalls) {
        const toolName = toolCall.function?.name;
        console.log(`🔧 Tool: ${toolName}`);

        const result = await executeTool({
          name: toolName,
          arguments: toolCall.function?.arguments || "{}",
          call_id: toolCall.id
        }, state);

        input.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result)
        });
      }
      continue;
    }

    state.finalAnswer = extractResponseText(response);
    const evaluation = await evaluateResearch(state);

    console.log("\n🔍 Evaluation:");
    console.log(evaluation);

    if (evaluation.sufficient === true) {
      state.status = "completed";
      state.completedAt = new Date().toISOString();
      return { answer: state.finalAnswer, evaluation, trace: state };
    }

    recordObservation(state, { type: "critic_feedback", evaluation });

    input.push({
      role: "user",
      content: `Your previous answer was not sufficiently supported.

Critic feedback:
${JSON.stringify(evaluation, null, 2)}

Continue researching. Use another tool if necessary.
Do not finalize until the evidence is sufficient.`
    });
  }

  state.status = "max_iterations_reached";
  state.completedAt = new Date().toISOString();

  return {
    answer: state.finalAnswer || "The agent could not complete the research.",
    evaluation: { sufficient: false, confidence: 0, reason: "Maximum iterations reached." },
    trace: state
  };
}

if (process.argv[1]?.endsWith("agent.js")) {
  const query = process.argv.slice(2).join(" ") ||
    "Find three interesting books and compare their prices and ratings.";

  console.log("\n🚀 ResearchFlow AI");
  console.log(`Question: ${query}\n`);

  try {
    const result = await runAgent(query);
    console.log("\n==============================");
    console.log("FINAL ANSWER");
    console.log("==============================\n");
    console.log(result.answer);
    console.log("\nEvaluation:");
    console.log(result.evaluation);
  } catch (error) {
    console.error("\n❌ Agent Error:");
    console.error(error);
    process.exit(1);
  }
}
