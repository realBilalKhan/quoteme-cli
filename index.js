#!/usr/bin/env node

import os from "os";
import path from "path";
import chalk from "chalk";
import { config } from "dotenv";
import { buddies } from "./data/buddies.js";
import { loadUserConfig } from "./utils/fileUtils.js";
import { getFact } from "./utils/factUtils.js";
import { getJoke } from "./utils/jokeUtils.js";
import { handleResolutionSelection } from "./utils/resolutionUtils.js";
import {
  enableAutoQuotes,
  disableAutoQuotes,
  showAutoDisplayStatus,
} from "./utils/autoDisplayUtils.js";
import { showHelp } from "./utils/helpUtils.js";
import { getQuote } from "./utils/quoteUtils.js";

config();

const username = os.userInfo().username || "there";
const buddy = buddies[Math.floor(Math.random() * buddies.length)];

const buddyLines = buddy.trimEnd().split("\n");

const greeting = chalk.yellow(` Hello, ${username}!`);
buddyLines[buddyLines.length - 1] += greeting;

console.log(chalk.green(buddyLines.join("\n")) + "\n");

const configPath = path.join(process.cwd(), "quoteme.config.json");
let userConfig = loadUserConfig(configPath);

let factMode = false;
let jokeMode = false;
let resolutionMode = false;
let enableAutoMode = false;
let disableAutoMode = false;
let showAutoStatus = false;
const args = process.argv.slice(2);
let authorFilter = null;
let generateImage = false;
let outputPath = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--author" || args[i] === "-a") {
    const authorParts = [];
    let j = i + 1;

    while (
      j < args.length &&
      !args[j].startsWith("--") &&
      !args[j].startsWith("-")
    ) {
      authorParts.push(args[j]);
      j++;
    }

    if (authorParts.length > 0) {
      authorFilter = authorParts.join(" ").toLowerCase();
    }
  } else if (args[i] === "--image" || args[i] === "-i") {
    generateImage = true;
    if (args[i + 1] && !args[i + 1].startsWith("-")) {
      outputPath = args[i + 1];
      i++;
    }
  } else if (args[i] === "--fact" || args[i] === "-f") {
    factMode = true;
  } else if (args[i] === "--joke" || args[i] === "-j") {
    jokeMode = true;
  } else if (args[i] === "--resolution" || args[i] === "-r") {
    resolutionMode = true;
  } else if (args[i] === "--auto-enable" || args[i] === "--enable") {
    enableAutoMode = true;
  } else if (args[i] === "--auto-disable" || args[i] === "--disable") {
    disableAutoMode = true;
  } else if (args[i] === "--auto-status") {
    showAutoStatus = true;
  } else if (args[i] === "--help" || args[i] === "-h") {
    showHelp();
    process.exit(0);
  }
}

const silentMode = args.includes("--silent");

if (enableAutoMode) {
  enableAutoQuotes(configPath, userConfig);
} else if (disableAutoMode) {
  disableAutoQuotes(configPath, userConfig);
} else if (showAutoStatus) {
  showAutoDisplayStatus(userConfig);
} else if (factMode) {
  getFact();
} else if (jokeMode) {
  getJoke();
} else if (resolutionMode) {
  const selectedResolution = await handleResolutionSelection(
    configPath,
    userConfig
  );
  console.log(
    chalk.green(
      `🎯 Resolution set to: ${selectedResolution.width}x${selectedResolution.height}`
    )
  );
} else {
  getQuote({
    authorFilter,
    generateImage,
    outputPath,
    userConfig,
    configPath,
    silentMode,
  });
}
