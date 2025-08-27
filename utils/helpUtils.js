import chalk from "chalk";
import { getDefaultSaveDir } from "./fileUtils.js";

export function showHelp() {
  const defaultPath = getDefaultSaveDir();

  console.log(chalk.cyan.bold("📖 QuoteMe Usage:\n"));
  console.log(chalk.white("Basic Commands:"));
  console.log("  quoteme                    Show a random quote");
  console.log("  quoteme -a <author>        Show quote by specific author");
  console.log(
    `  quoteme -i                  Generate and save quote image to default path: ${defaultPath}`
  );
  console.log(
    "  quoteme -i <path>           Generate and save quote image to specified path"
  );
  console.log("  quoteme -f                 Show a random fact");
  console.log("  quoteme -j                 Show a random joke");
  console.log("  quoteme -r                 Set image resolution");
  console.log();
  console.log(chalk.white("Auto-display Features:"));
  console.log("  quoteme --enable           Enable quotes on terminal startup");
  console.log(
    "  quoteme --disable          Disable quotes on terminal startup"
  );
  console.log("  quoteme --auto-status      Show auto-display status");
  console.log();
  console.log(chalk.white("Options:"));
  console.log("  -h, --help                 Show this help message");
  console.log();
}
