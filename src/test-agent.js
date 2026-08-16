import { runAgent } from "./agent/agent.js";

const query = process.argv.slice(2).join(" ") ||
  "Find 3 books and compare their prices and ratings.";

const result = await runAgent(query);
console.log(JSON.stringify(result, null, 2));
