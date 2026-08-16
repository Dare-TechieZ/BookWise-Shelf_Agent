import fs from "node:fs/promises";
import path from "node:path";

const booksFile = path.resolve("output/books.json");

export const scraperToolDefinition = {
  name: "search_books_catalogue",

  description:
    "Search the collected Books to Scrape catalogue by title, category, rating, or price. " +
    "IMPORTANT: numeric parameters must be JSON numbers, not strings.",

  parameters: {
    type: "object",

    properties: {
      query: {
        type: "string",
        description:
          "Words to match in the book title. Use an empty string if no title search is needed."
      },

      category: {
        type: "string",
        description:
          "Category to match. Use an empty string if no category filter is needed."
      },

      min_rating: {
        type: "number",
        description:
          "Minimum rating from 0 to 5. MUST be a JSON number, for example 4, NOT the string \"4\"."
      },

      max_price: {
        type: "number",
        description:
          "Maximum price in GBP. MUST be a JSON number, for example 100, NOT the string \"100\"."
      },

      limit: {
        type: "integer",
        description:
          "Maximum number of results. MUST be a JSON integer, for example 3, NOT the string \"3\"."
      }
    },

    required: []
  }
};


export async function searchBooks(args = {}) {

  let raw;

  try {
    raw = await fs.readFile(booksFile, "utf8");
  } catch {
    return {
      success: false,
      error:
        "output/books.json not found. Run npm run scrape first."
    };
  }

  const books = JSON.parse(raw);

  const query =
    String(args.query || "")
      .toLowerCase()
      .trim();

  const category =
    String(args.category || "")
      .toLowerCase()
      .trim();

  const minRating =
    args.min_rating === undefined ||
    args.min_rating === null
      ? null
      : Number(args.min_rating);

  const maxPrice =
    args.max_price === undefined ||
    args.max_price === null
      ? null
      : Number(args.max_price);

  let results = books.filter((book) => {

    const titleMatch =
      !query ||
      String(book.title)
        .toLowerCase()
        .includes(query);

    const categoryMatch =
      !category ||
      String(book.category || "")
        .toLowerCase()
        .includes(category);

    const ratingMatch =
      minRating === null ||
      Number(book.rating) >= minRating;

    const priceMatch =
      maxPrice === null ||
      Number(book.price) <= maxPrice;

    return (
      titleMatch &&
      categoryMatch &&
      ratingMatch &&
      priceMatch
    );
  });

  const limit = Math.min(
    Math.max(
      Number(args.limit || 10),
      1
    ),
    30
  );

  results = results.slice(0, limit);

  return {
    success: true,
    count: results.length,
    records: results
  };
}