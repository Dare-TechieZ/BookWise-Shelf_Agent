export const calculatorToolDefinition = {
  name: "calculate",
  description: "Calculate a basic arithmetic expression.",
  parameters: {
    type: "object",
    properties: {
      expression: { type: "string", description: "Example: (12.99 + 15.50) / 2" }
    },
    required: ["expression"]
  }
};

export async function calculate({ expression }) {
  if (typeof expression !== "string" || !/^[0-9+\-*/().\s]+$/.test(expression)) {
    return { success: false, error: "Only basic arithmetic expressions are allowed." };
  }

  try {
    const result = Function(`"use strict"; return (${expression})`)();
    if (!Number.isFinite(result)) throw new Error("Result is not finite.");
    return { success: true, expression, result: Number(result) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
