import { askGroq, extractResponseText } from "../llm/groq.js";

export async function evaluateResearch(state) {
  const prompt = `
Evaluate this research answer strictly.

QUERY:
${state.query}

ANSWER:
${state.finalAnswer}

OBSERVATIONS:
${JSON.stringify(state.observations, null, 2)}

Return ONLY JSON:
{
  "sufficient": true,
  "confidence": 0.0,
  "reason": "short explanation",
  "missingEvidence": []
}
`;

  try {
    const response = await askGroq({
      messages: [
        { role: "system", content: "You are a strict research critic. Return only valid JSON." },
        { role: "user", content: prompt }
      ]
    });

    const cleaned = extractResponseText(response)
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    return {
      sufficient: parsed.sufficient === true,
      confidence: Number(parsed.confidence || 0),
      reason: parsed.reason || "",
      missingEvidence: Array.isArray(parsed.missingEvidence) ? parsed.missingEvidence : []
    };
  } catch (error) {
    return {
      sufficient: false,
      confidence: 0,
      reason: `Evaluation failed: ${error.message}`,
      missingEvidence: ["Critic could not validate the answer."]
    };
  }
}
