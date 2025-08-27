import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import boxen from "boxen";
import { getRandomFrameOptions } from "./frameOptions.js";

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

export async function getJoke() {
  try {
    const res = await fetch(
      "https://official-joke-api.appspot.com/random_joke"
    );
    if (!res.ok) throw new Error("API response not OK");
    const data = await res.json();

    const jokeBox = boxen(
      `${chalk.magenta.bold("😂 Random Joke:")}\n\n${chalk.whiteBright(
        data.setup
      )}\n\n${chalk.yellow(data.punchline)}`,
      getRandomFrameOptions()
    );

    console.log(jokeBox);
  } catch (err) {
    console.log(
      chalk.yellow(
        "⚠️  Could not fetch joke from API, using local fallback...\n"
      )
    );

    if (localJokes.length > 0) {
      const randomJoke =
        localJokes[Math.floor(Math.random() * localJokes.length)];

      let jokeContent;
      if (randomJoke.setup && randomJoke.punchline) {
        jokeContent = `${chalk.whiteBright(randomJoke.setup)}\n\n${chalk.yellow(
          randomJoke.punchline
        )}`;
      } else if (randomJoke.joke) {
        jokeContent = chalk.whiteBright(randomJoke.joke);
      } else {
        jokeContent = chalk.whiteBright(randomJoke.toString());
      }

      const jokeBox = boxen(
        `${chalk.magenta.bold("😂 Random Joke:")}\n\n${jokeContent}`,
        getRandomFrameOptions()
      );

      console.log(jokeBox);
    } else {
      console.log(
        chalk.red("⚠️  No local jokes available either, try again later.\n")
      );
    }
  } finally {
    console.log(chalk.blueBright("✨ Keep smiling! ✨\n"));
  }
}
