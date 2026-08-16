import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";

const BASE =
  process.env.BOOKS_BASE_URL ||
  "https://books.toscrape.com/";

const MAX_PAGES =
  Number(process.env.BOOKS_MAX_PAGES || 3);

const MAX_BOOKS =
  Number(process.env.BOOKS_MAX_BOOKS || 60);

const DELAY_MS =
  Number(process.env.SCRAPER_DELAY_MS || 500);

const MAX_RETRIES =
  Number(process.env.SCRAPER_MAX_RETRIES || 3);

const outputDir =
  path.resolve("output");


function sleep(ms) {
  return new Promise(resolve =>
    setTimeout(resolve, ms)
  );
}


function decode(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&pound;/g, "£")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}


function strip(html) {
  return html
    .replace(
      /<script[\s\S]*?<\/script>/gi,
      ""
    )
    .replace(
      /<style[\s\S]*?<\/style>/gi,
      ""
    )
    .replace(
      /<[^>]+>/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim();
}


/*
 * Fetch with retry + delay.
 */
async function fetchText(url) {

  let lastError;

  for (
    let attempt = 1;
    attempt <= MAX_RETRIES;
    attempt++
  ) {

    try {

      console.log(
        `  Fetching: ${url}`
      );

      const response =
        await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (ResearchFlow-AI)"
          }
        });

      if (!response.ok) {

        throw new Error(
          `${response.status} ${response.statusText}`
        );
      }

      const text =
        await response.text();

      return text;

    } catch (error) {

      lastError = error;

      console.log(
        `  ⚠ Attempt ${attempt}/${MAX_RETRIES} failed: ${error.message}`
      );

      if (
        attempt < MAX_RETRIES
      ) {

        const retryDelay =
          DELAY_MS * attempt;

        console.log(
          `  Retrying in ${retryDelay}ms...`
        );

        await sleep(
          retryDelay
        );
      }
    }
  }

  throw lastError;
}


function parseCatalogue(html, pageUrl) {

  const results = [];

  const re =
    /<article class="product_pod">([\s\S]*?)<\/article>/gi;

  let match;

  const ratingMap = {
    One: 1,
    Two: 2,
    Three: 3,
    Four: 4,
    Five: 5
  };


  while (
    (match = re.exec(html))
  ) {

    const block =
      match[1];


    const href =
      block.match(
        /<h3>[\s\S]*?<a[^>]+href="([^"]+)"/i
      )?.[1];


    const title =
      block.match(
        /<h3>[\s\S]*?<a[^>]+title="([^"]+)"/i
      )?.[1];


    const price =
      block.match(
        /<p class="price_color">([\s\S]*?)<\/p>/i
      )?.[1];


    const rating =
      block.match(
        /<p class="star-rating\s+([^"]+)"/i
      )?.[1];


    if (
      !href ||
      !title ||
      !price
    ) {
      continue;
    }


    results.push({

      title:
        decode(title),

      price:
        Number(
          decode(
            strip(price)
          )
            .replace("£", "")
            .trim()
        ),

      rating:
        ratingMap[rating] || 0,

      url: new URL(href, pageUrl).href
    });
  }


  return results;
}


function parseDetail(
  html,
  book
) {

  const category =
    decode(
      strip(
        html.match(
          /<ul class="breadcrumb">([\s\S]*?)<\/ul>/i
        )?.[1] || ""
      )
    );


  const availability =
    decode(
      strip(
        html.match(
          /<p class="instock availability">([\s\S]*?)<\/p>/i
        )?.[1] || ""
      )
    );


  return {
    ...book,
    category,
    availability
  };
}


async function main() {

  await fs.mkdir(
    outputDir,
    {
      recursive: true
    }
  );


  const books = [];
  const errors = [];


  for (
    let page = 1;
    page <= MAX_PAGES &&
    books.length < MAX_BOOKS;
    page++
  ) {

    const url =
      page === 1
        ? BASE
        : `${BASE}catalogue/page-${page}.html`;


    console.log(
      `\n================================`
    );

    console.log(
      `Fetching catalogue page ${page}`
    );

    console.log(
      `================================`
    );


    try {

      const html =
        await fetchText(url);


      const catalogueBooks =
        parseCatalogue(html,url);


      console.log(
        `Found ${catalogueBooks.length} books`
      );


      for (
        const basic
        of catalogueBooks
      ) {

        if (
          books.length >= MAX_BOOKS
        ) {
          break;
        }


        try {

          await sleep(
            DELAY_MS
          );


          const detailHtml =
            await fetchText(
              basic.url
            );


          const record =
            parseDetail(
              detailHtml,
              basic
            );


          books.push(record);


          console.log(
            `✓ Valid [${books.length}/${MAX_BOOKS}] ${basic.title}`
          );


        } catch (error) {

          console.log(
            `✗ Failed: ${basic.title}`
          );

          console.log(
            `  ${error.message}`
          );


          errors.push({

            url:
              basic.url,

            title:
              basic.title,

            error:
              error.message
          });
        }
      }


    } catch (error) {

      console.log(
        `✗ Catalogue page failed: ${error.message}`
      );


      errors.push({

        url,

        error:
          error.message
      });
    }
  }


  await fs.writeFile(

    path.join(
      outputDir,
      "books.json"
    ),

    JSON.stringify(
      books,
      null,
      2
    )
  );


  await fs.writeFile(

    path.join(
      outputDir,
      "errors.json"
    ),

    JSON.stringify(
      errors,
      null,
      2
    )
  );


  await fs.writeFile(

    path.join(
      outputDir,
      "run-report.json"
    ),

    JSON.stringify(

      {
        catalogue_pages:
          MAX_PAGES,

        requested_books:
          MAX_BOOKS,

        valid_records:
          books.length,

        failed_records:
          errors.length,

        completed_at:
          new Date().toISOString()
      },

      null,
      2
    )
  );


  console.log(
    "\n================================"
  );

  console.log(
    "SCRAPE COMPLETE"
  );

  console.log(
    "================================"
  );

  console.log(
    `Valid records: ${books.length}`
  );

  console.log(
    `Failed records: ${errors.length}`
  );

  console.log(
    `Total processed: ${
      books.length + errors.length
    }`
  );
}


main().catch(
  error => {

    console.error(
      error
    );

    process.exit(1);
  }
);