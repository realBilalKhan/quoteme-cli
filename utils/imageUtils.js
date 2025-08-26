import { createCanvas, loadImage } from "canvas";
import terminalImage from "terminal-image";
import chalk from "chalk";
import fs from "fs";
import { getCurrentResolution } from "./resolutionUtils.js";
import {
  updateConfigSaveDirectory,
  generateSavePath,
  generateTimestampFilename,
} from "./fileUtils.js";

function wrapText(ctx, text, maxWidth) {
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

async function generateQuoteImage(
  quote,
  author,
  resolution = null,
  userConfig
) {
  const currentResolution = resolution || getCurrentResolution(userConfig);
  const width = currentResolution.width;
  const height = currentResolution.height;

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
  const baseFontSize = Math.min(48, width / 25);
  ctx.font = `bold ${baseFontSize}px Arial, sans-serif`;
  const quoteLines = wrapText(
    ctx,
    `"${quote}"`,
    maxQuoteWidth,
    baseFontSize + 12
  );

  const totalQuoteHeight = quoteLines.length * (baseFontSize + 12);
  const authorHeight = baseFontSize * 0.8;
  const spacing = baseFontSize + 12;
  const totalHeight = totalQuoteHeight + spacing + authorHeight;
  let startY = (height - totalHeight) / 2 + (baseFontSize + 12);

  quoteLines.forEach((line, index) => {
    ctx.fillText(line, width / 2, startY + index * (baseFontSize + 12));
  });

  ctx.font = `italic ${Math.floor(baseFontSize * 0.75)}px Arial, sans-serif`;
  ctx.fillStyle = "#f0f0f0";
  ctx.fillText(`— ${author}`, width / 2, startY + totalQuoteHeight + spacing);

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  return canvas;
}

async function handleImageGeneration(
  quote,
  author,
  outputPath,
  userConfig,
  configPath,
  silentMode = false
) {
  if (!silentMode) {
    console.log(
      chalk.blue("🎨 Generating quote image with scenic background...\n")
    );
  }

  try {
    const canvas = await generateQuoteImage(quote, author, null, userConfig);
    const buffer = canvas.toBuffer("image/png");

    console.log(await terminalImage.buffer(buffer, { width: "50%" }));
    console.log();

    const defaultFilename = generateTimestampFilename("quote");
    const savePath = generateSavePath(outputPath, userConfig, defaultFilename);

    if (outputPath) {
      updateConfigSaveDirectory(configPath, userConfig, savePath);
    }

    fs.writeFileSync(savePath, buffer);
    console.log(chalk.green(`📸 Image saved as: ${savePath}\n`));

    return true;
  } catch (imageError) {
    if (!silentMode) {
      console.log(
        chalk.yellow("⚠️  Could not generate image, but here's your quote!\n")
      );
    }
    return false;
  }
}

export {
  generateQuoteImage,
  handleImageGeneration,
  getRandomBackgroundImage,
  wrapText,
};
