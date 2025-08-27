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
const localFactsPath = path.join(__dirname, "..", "data", "jokes.json");

let localFacts = [];

try {
  localFacts = JSON.parse(fs.readFileSync(localFactsPath, "utf-8"));
} catch (err) {
  console.log(
    chalk.yellow("ℹ️  Local jokes file not found, will only use API")
  );
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
      const filteredQuotes = localQuotes.filter((q) =>
        q.author.toLowerCase().includes(authorFilter)
      );
      if (filteredQuotes.length === 0) {
        if (!silentMode) {
          console.log(
            chalk.red(
              `No quotes found for author "${authorFilter}". Showing random quote instead.\n`
            )
          );
        }
        data = [localQuotes[Math.floor(Math.random() * localQuotes.length)]];
      } else {
        data = [
          filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)],
        ];
      }

      quote = data[0].text;
      author = data[0].author;
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
