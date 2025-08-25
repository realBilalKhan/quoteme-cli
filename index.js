#!/usr/bin/env node

import os from "os";
import fs from "fs";
import path from "path";
import chalk from "chalk";
import figlet from "figlet";
import { createCanvas, loadImage } from "canvas";
import terminalImage from "terminal-image";
import { config } from "dotenv";
import boxen from "boxen";
import { buddies } from "./buddies.js";

config();

const username = os.userInfo().username || "there";
const buddy = buddies[Math.floor(Math.random() * buddies.length)];

console.log(
  chalk.cyan(figlet.textSync("QuoteMe", { horizontalLayout: "full" }))
);

const buddyLines = buddy.trimEnd().split("\n");

const greeting = chalk.yellow(` Hello ${username}!`);
buddyLines[buddyLines.length - 1] += greeting;

console.log(chalk.green(buddyLines.join("\n")) + "\n");

const localQuotesPath = path.join(process.cwd(), "quotes.json");
const localQuotes = JSON.parse(fs.readFileSync(localQuotesPath, "utf-8"));

const borderStyles = ["single", "double", "round", "bold", "classic"];
const borderColors = ["cyan", "yellow", "green", "magenta", "blue", "red"];

function getRandomFrameOptions() {
  return {
    padding: 1,
    margin: 1,
    borderStyle: borderStyles[Math.floor(Math.random() * borderStyles.length)],
    borderColor: borderColors[Math.floor(Math.random() * borderColors.length)],
  };
}

const configPath = path.join(process.cwd(), "quoteme.config.json");
let userConfig = {};
if (fs.existsSync(configPath)) {
  try {
    userConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch (error) {
    console.log(
      chalk.yellow("⚠️  Could not parse config file, using defaults")
    );
  }
}

function getDownloadsDir() {
  const homeDir = os.homedir();
  const platform = os.platform();

  switch (platform) {
    case "win32":
      return path.join(homeDir, "Downloads");
    case "darwin":
      return path.join(homeDir, "Downloads");
    case "linux":
      return path.join(homeDir, "Downloads");
    default:
      return path.join(homeDir, "Downloads");
  }
}

function getDefaultSaveDir() {
  const downloadsDir = getDownloadsDir();
  const quotemeDir = path.join(downloadsDir, "quoteme images");

  if (!fs.existsSync(quotemeDir)) {
    fs.mkdirSync(quotemeDir, { recursive: true });
  }

  return quotemeDir;
}

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
  } else if (args[i] === "--save" || args[i] === "-s") {
    generateImage = true;
    if (args[i + 1] && !args[i + 1].startsWith("-")) {
      outputPath = args[i + 1];
      i++;
    }
  }
}

function wrapText(ctx, text, maxWidth, lineHeight) {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

async function getRandomBackgroundImage(width, height) {
  const topics = [
    "landscape",
    "cityscape",
    "nature",
    "mountain",
    "ocean",
    "sunset",
    "architecture",
    "forest",
    "city",
    "sky",
  ];
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];

  const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

  if (UNSPLASH_ACCESS_KEY) {
    try {
      const response = await fetch(
        `https://api.unsplash.com/photos/random?query=${randomTopic}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch from Unsplash API");
      }

      const data = await response.json();
      const imageResponse = await fetch(data.urls.regular);
      const buffer = Buffer.from(await imageResponse.arrayBuffer());
      return await loadImage(buffer);
    } catch (error) {
      console.log(
        chalk.yellow(
          "⚠️  Could not fetch from Unsplash API, trying fallback..."
        )
      );
    }
  }

  try {
    const randomId = Math.floor(Math.random() * 1000) + 1;
    const response = await fetch(
      `https://picsum.photos/${width}/${height}?random=${randomId}&blur=1`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from Picsum");
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    return await loadImage(buffer);
  } catch (error) {
    console.log(
      chalk.yellow("⚠️  Could not fetch background image, using gradient")
    );
  }

  return null;
}

async function generateQuoteImage(quote, author) {
  const width = 1200;
  const height = 800;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const backgroundImage = await getRandomBackgroundImage(width, height);

  if (backgroundImage) {
    ctx.drawImage(backgroundImage, 0, 0, width, height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, width, height);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, width, height);

    const gradients = [
      ["#ff9a9e", "#fecfef", "#fecfef"],
      ["#a8edea", "#fed6e3", "#d299c2"],
      ["#ffecd2", "#fcb69f", "#ff8c94"],
      ["#667eea", "#764ba2", "#f093fb"],
      ["#ffefd5", "#ffdf8a", "#32a852"],
      ["#89f7fe", "#66a6ff", "#3b82f6"],
    ];

    const randomGradient =
      gradients[Math.floor(Math.random() * gradients.length)];
    gradient.addColorStop(0, randomGradient[0]);
    gradient.addColorStop(0.5, randomGradient[1]);
    gradient.addColorStop(1, randomGradient[2]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    for (let i = 0; i < width; i += 60) {
      for (let j = 0; j < height; j += 60) {
        ctx.beginPath();
        ctx.arc(i, j, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const vignette = ctx.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    Math.max(width, height) / 2
  );
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(1, "rgba(0, 0, 0, 0.3)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);

  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";

  ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  const maxQuoteWidth = width - 200;
  ctx.font = "bold 48px Arial, sans-serif";
  const quoteLines = wrapText(ctx, `"${quote}"`, maxQuoteWidth, 60);

  const totalQuoteHeight = quoteLines.length * 60;
  const authorHeight = 40;
  const spacing = 60;
  const totalHeight = totalQuoteHeight + spacing + authorHeight;
  let startY = (height - totalHeight) / 2 + 60;

  quoteLines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * 60);
  });

  ctx.font = "italic 36px Arial, sans-serif";
  ctx.fillStyle = "#f0f0f0";
  ctx.fillText(`— ${author}`, width / 2, startY + totalQuoteHeight + spacing);

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 100, startY - 40);
  ctx.lineTo(width / 2 + 100, startY - 40);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(width / 2 - 100, startY + totalQuoteHeight + spacing + 50);
  ctx.lineTo(width / 2 + 100, startY + totalQuoteHeight + spacing + 50);
  ctx.stroke();

  return canvas;
}

async function getQuote() {
  try {
    let data;
    let quote, author;

    if (authorFilter) {
      const filteredQuotes = localQuotes.filter((q) =>
        q.author.toLowerCase().includes(authorFilter)
      );
      if (filteredQuotes.length === 0) {
        console.log(
          chalk.red(
            `No quotes found for author "${authorFilter}". Showing random quote instead.\n`
          )
        );
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
      `${chalk.green.bold(`"${data[0].q}"`)}\n\n${chalk.magenta(
        `— ${data[0].a}`
      )}`,
      getRandomFrameOptions()
    );

    console.log(quoteBox);

    if (generateImage) {
      console.log(
        chalk.blue("🎨 Generating quote image with scenic background...\n")
      );

      try {
        const canvas = await generateQuoteImage(quote, author);
        const buffer = canvas.toBuffer("image/png");

        console.log(await terminalImage.buffer(buffer, { width: "50%" }));
        console.log();

        const timestamp = new Date()
          .toISOString()
          .replace(/[:.]/g, "-")
          .slice(0, 19);
        const defaultFilename = `quote-${timestamp}.png`;

        let savePath;
        if (outputPath) {
          savePath = outputPath;
        } else {
          const saveDir = userConfig.saveDirectory || getDefaultSaveDir();

          if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir, { recursive: true });
          }

          savePath = path.join(saveDir, defaultFilename);
        }

        fs.writeFileSync(savePath, buffer);
        console.log(chalk.green(`📸 Image saved as: ${savePath}\n`));
      } catch (imageError) {
        console.log(
          chalk.yellow("⚠️  Could not generate image, but here's your quote!\n")
        );
      }
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
      try {
        const canvas = await generateQuoteImage(
          randomQuote.text,
          randomQuote.author
        );
        const buffer = canvas.toBuffer("image/png");

        console.log(await terminalImage.buffer(buffer, { width: "50%" }));
        console.log();

        const timestamp = new Date()
          .toISOString()
          .replace(/[:.]/g, "-")
          .slice(0, 19);
        const defaultFilename = `quote-${timestamp}.png`;

        let savePath;
        if (outputPath) {
          savePath = outputPath;
        } else {
          const saveDir = userConfig.saveDirectory || getDefaultSaveDir();

          if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir, { recursive: true });
          }

          savePath = path.join(saveDir, defaultFilename);
        }

        fs.writeFileSync(savePath, buffer);
        console.log(chalk.green(`📸 Image saved as: ${savePath}\n`));
      } catch (imageError) {
        console.log(
          chalk.yellow("⚠️  Could not generate image, but here's your quote!\n")
        );
      }
    }
  } finally {
    console.log(chalk.blueBright("✨ Stay inspired! ✨\n"));
  }
}

getQuote();
