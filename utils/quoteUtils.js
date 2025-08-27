import chalk from "chalk";
import boxen from "boxen";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getRandomFrameOptions } from "./frameOptions.js";
import { handleImageGeneration } from "./imageUtils.js";
import { displayCurrentResolution } from "./resolutionUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localQuotesPath = path.join(__dirname, "..", "data", "quotes.json");

let localQuotes = [];

try {
  localQuotes = JSON.parse(fs.readFileSync(localQuotesPath, "utf-8"));
} catch (err) {
  console.log(
    chalk.yellow("ℹ️  Local quotes file not found, will only use API")
  );
}

function normalizeString(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/['"]/g, "")
    .replace(/[^\w\s]/g, "");
}

export async function getQuote({
  authorFilter,
  generateImage,
  outputPath,
  userConfig,
  configPath,
  silentMode = false,
} = {}) {
  try {
    let data;
    let quote, author;

    if (authorFilter) {
      const normalizedFilter = normalizeString(authorFilter);

      if (!silentMode) {
        console.log(chalk.dim(`🔍 Searching for: "${authorFilter}"`));
      }

      const filteredQuotes = localQuotes.filter((q) => {
        const normalizedAuthor = normalizeString(q.author);
        const matches = normalizedAuthor.includes(normalizedFilter);

        if (!silentMode && process.env.DEBUG) {
          console.log(
            chalk.dim(
              `  Local: "${q.author}" (${normalizedAuthor}) -> ${matches}`
            )
          );
        }

        return matches;
      });

      if (filteredQuotes.length > 0) {
        if (!silentMode) {
          console.log(
            chalk.green(
              `✅ Found ${filteredQuotes.length} local quote(s) by "${authorFilter}"\n`
            )
          );
        }
        const selectedQuote =
          filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        quote = selectedQuote.text;
        author = selectedQuote.author;
      } else {
        try {
          const apiRes = await fetch(
            `https://zenquotes.io/api/quotes/${encodeURIComponent(
              authorFilter
            )}`
          );
          let apiQuotes = [];

          if (apiRes.ok) {
            const apiData = await apiRes.json();
            apiQuotes = apiData.filter((q) => {
              const normalizedApiAuthor = normalizeString(q.a);
              const matches = normalizedApiAuthor.includes(normalizedFilter);

              if (!silentMode && process.env.DEBUG) {
                console.log(
                  chalk.dim(
                    `  API: "${q.a}" (${normalizedApiAuthor}) -> ${matches}`
                  )
                );
              }

              return matches;
            });
          }

          if (apiQuotes.length > 0) {
            if (!silentMode) {
              console.log(
                chalk.green(
                  `✅ Found ${apiQuotes.length} API quote(s) by "${authorFilter}"\n`
                )
              );
            }
            const selectedQuote =
              apiQuotes[Math.floor(Math.random() * apiQuotes.length)];
            quote = selectedQuote.q;
            author = selectedQuote.a;
          } else {
            if (!silentMode) {
              console.log(
                chalk.red(
                  `No quotes found for author "${authorFilter}" in local or API sources. Showing random quote instead.\n`
                )
              );
            }

            try {
              const randomRes = await fetch("https://zenquotes.io/api/random");
              if (randomRes.ok) {
                const randomData = await randomRes.json();
                quote = randomData[0].q;
                author = randomData[0].a;
              } else {
                throw new Error("API failed");
              }
            } catch {
              const randomQuote =
                localQuotes[Math.floor(Math.random() * localQuotes.length)];
              quote = randomQuote.text;
              author = randomQuote.author;
            }
          }
        } catch (apiError) {
          if (!silentMode) {
            console.log(
              chalk.red(
                `No local quotes found for "${authorFilter}" and API search failed. Showing random quote instead.\n`
              )
            );
          }

          const randomQuote =
            localQuotes[Math.floor(Math.random() * localQuotes.length)];
          quote = randomQuote.text;
          author = randomQuote.author;
        }
      }
    } else {
      const res = await fetch("https://zenquotes.io/api/random");
      if (!res.ok) throw new Error("API response not OK");
      data = await res.json();

      quote = data[0].q;
      author = data[0].a;
    }

    const quoteBox = boxen(
      `${chalk.green.bold(`"${quote}"`)}\n\n${chalk.magenta(`— ${author}`)}`,
      getRandomFrameOptions()
    );

    console.log(quoteBox);

    if (generateImage) {
      displayCurrentResolution(userConfig);
      await handleImageGeneration(
        quote,
        author,
        outputPath,
        userConfig,
        configPath,
        silentMode
      );
    }
  } catch (err) {
    const randomQuote =
      localQuotes[Math.floor(Math.random() * localQuotes.length)];
    const quoteBox = boxen(
      `${chalk.green.bold(`"${randomQuote.text}"`)}\n\n${chalk.magenta(
        `— ${randomQuote.author}`
      )}`,
      getRandomFrameOptions()
    );

    console.log(quoteBox);

    if (generateImage) {
      displayCurrentResolution(userConfig);
      await handleImageGeneration(
        randomQuote.text,
        randomQuote.author,
        outputPath,
        userConfig,
        configPath,
        silentMode
      );
    }
  } finally {
    if (!silentMode) {
      console.log(chalk.blueBright("✨ Stay inspired! ✨\n"));
    }
  }
}
