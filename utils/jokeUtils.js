import fs from "fs";
import path from "path";
import chalk from "chalk";
import boxen from "boxen";
import { getRandomFrameOptions } from "./frameOptions.js";

const localJokesPath = path.join(process.cwd(), "data", "jokes.json");
const localJokes = JSON.parse(fs.readFileSync(localJokesPath, "utf-8"));

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
