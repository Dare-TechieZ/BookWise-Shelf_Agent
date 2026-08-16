import "dotenv/config";
import { askGroq, extractResponseText } from "./llm/groq.js";

const response = await askGroq({
  messages: [{ role: "user", content: "Reply exactly: Groq connection successful." }]
});
console.log(extractResponseText(response));
