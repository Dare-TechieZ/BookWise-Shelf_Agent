import fs from "node:fs/promises";
import path from "node:path";

const booksFile = path.resolve("output/books.json");

export const scraperToolDefinition = {
  name: "search_books_catalogue",

  description:
    "Search the Books to Scrape catalogue by title, category, rating, price, " +
    "or value. Use this tool to retrieve multiple books for comparison. " +
    "For best-value requests, use sort_by='value'. " +
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
          "Minimum rating from 0 to 5. Example: 4"
      },

      max_price: {
        type: "number",
        description:
          "Maximum price in GBP. Example: 15"
      },

      limit: {
        type: "integer",
        description:
          "Maximum number of results to return. Use 5-10 for comparison tasks."
      },

      sort_by: {
        type: "string",
        enum: [
          "price_asc",
          "price_desc",
          "rating_desc",
          "value"
        ],
        description:
          "How to rank results. 'value' ranks books using rating divided by price."
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

  let books;

  try {
    books = JSON.parse(raw);
    console.log("BOOKS LOADED:", books.length);
    console.log("TOOL ARGS:", args);
  } catch {
    return {
      success: false,
      error: "books.json contains invalid JSON."
    };
  }

  console.log("BOOKS LOADED:", books.length);
  console.log("TOOL ARGS:", args);

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
      String(book.title || "")
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

  const totalMatches = results.length;

  // Calculate value score.
  results = results.map((book) => {

    const price = Number(book.price);
    const rating = Number(book.rating);

    const valueScore =
      price > 0
        ? rating / price
        : 0;

    return {
      ...book,
      value_score: Number(valueScore.toFixed(4))
    };
  });

  // Sorting
  switch (args.sort_by) {

    case "price_asc":
      results.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
      break;

    case "price_desc":
      results.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
      break;

    case "rating_desc":
      results.sort(
        (a, b) => Number(b.rating) - Number(a.rating)
      );
      break;

    case "value":
      results.sort(
        (a, b) => b.value_score - a.value_score
      );
      break;
  }

  const limit = Math.min(
    Math.max(
      Number(args.limit ?? 10),
      1
    ),
    30
  );

  results = results.slice(0, limit);

  return {
    success: true,
    total_matches: totalMatches,
    returned: results.length,
    sort_by: args.sort_by || null,
    records: results
  };
}
