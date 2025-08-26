import fs from "fs";
import path from "path";
import chalk from "chalk";
import boxen from "boxen";
import { getRandomFrameOptions } from "./frameOptions.js";

const localFactsPath = path.join(process.cwd(), "data", "facts.json");
const localFacts = JSON.parse(fs.readFileSync(localFactsPath, "utf-8"));

export async function getFact() {
  try {
    const res = await fetch(
      "https://uselessfacts.jsph.pl/random.json?language=en"
    );
    if (!res.ok) throw new Error("API response not OK");
    const data = await res.json();

    const factBox = boxen(
      `${chalk.cyan.bold("🤯 Fun Fact:")}\n\n${chalk.whiteBright(data.text)}`,
      getRandomFrameOptions()
    );

    console.log(factBox);
  } catch (err) {
    console.log(
      chalk.yellow(
        "⚠️  Could not fetch fact from API, using local fallback...\n"
      )
    );

    if (localFacts.length > 0) {
      const randomFact =
        localFacts[Math.floor(Math.random() * localFacts.length)];

      let factContent;
      if (typeof randomFact === "object" && randomFact.text) {
        factContent = chalk.whiteBright(randomFact.text);
      } else {
        factContent = chalk.whiteBright(randomFact.toString());
      }

      const factBox = boxen(
        `${chalk.cyan.bold("🤯 Fun Fact:")}\n\n${factContent}`,
        getRandomFrameOptions()
      );

      console.log(factBox);
    } else {
      console.log(
        chalk.red("⚠️  No local facts available either, try again later.\n")
      );
    }
  } finally {
    console.log(chalk.blueBright("✨ Keep learning something new! ✨\n"));
  }
}
