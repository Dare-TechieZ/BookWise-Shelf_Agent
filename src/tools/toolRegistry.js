import { scraperToolDefinition, searchBooks } from "./scraperTool.js";
import { calculatorToolDefinition, calculate } from "./calculatorTool.js";

export const toolDefinitions = [
  { type: "function", function: scraperToolDefinition },
  { type: "function", function: calculatorToolDefinition }
];

export const toolHandlers = {
  search_books_catalogue: searchBooks,
  calculate
};
