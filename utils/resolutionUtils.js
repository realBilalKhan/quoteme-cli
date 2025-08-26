import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs";
import { resolutionPresets } from "../data/resolutionPresets.js";

export const defaultResolution = { width: 1200, height: 800 };

export function getCurrentResolution(userConfig) {
  if (userConfig.resolution) {
    return userConfig.resolution;
  }
  return defaultResolution;
}

async function promptCustomResolution() {
  console.log(chalk.blue("\n🎯 Custom Resolution Setup:"));

  const answers = await inquirer.prompt([
    {
      type: "number",
      name: "width",
      message: "Enter width (pixels):",
      default: 1920,
      validate: (input) => {
        if (!input || input <= 0) {
          return "Width must be a positive number";
        }
        if (input > 7680) {
          return "Width cannot exceed 7680 pixels";
        }
        return true;
      },
    },
    {
      type: "number",
      name: "height",
      message: "Enter height (pixels):",
      default: 1080,
      validate: (input) => {
        if (!input || input <= 0) {
          return "Height must be a positive number";
        }
        if (input > 4320) {
          return "Height cannot exceed 4320 pixels";
        }
        return true;
      },
    },
    {
      type: "confirm",
      name: "confirm",
      message: (answers) =>
        `Confirm resolution: ${answers.width}x${answers.height}?`,
      default: true,
    },
  ]);

  if (!answers.confirm) {
    console.log(
      chalk.yellow("❌ Resolution setup cancelled. Using default resolution.")
    );
    return defaultResolution;
  }

  return { width: answers.width, height: answers.height };
}

export async function handleResolutionSelection(configPath, userConfig) {
  console.log(chalk.cyan("📐 Resolution Configuration"));
  console.log(chalk.dim("Choose a resolution for your quote images:\n"));

  const { selectedResolution } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedResolution",
      message: "Select a resolution:",
      choices: resolutionPresets,
      pageSize: 12,
      loop: false,
    },
  ]);

  let finalResolution;

  if (selectedResolution === "custom") {
    finalResolution = await promptCustomResolution();
  } else {
    finalResolution = selectedResolution;
  }

  userConfig.resolution = finalResolution;

  try {
    fs.writeFileSync(configPath, JSON.stringify(userConfig, null, 2));

    console.log(
      chalk.green(
        `\n✅ Resolution saved: ${chalk.bold(
          `${finalResolution.width}x${finalResolution.height}`
        )}`
      )
    );
    console.log(
      chalk.blue(
        "📁 Configuration updated. Future images will use this resolution."
      )
    );

    showResolutionTips(finalResolution);
  } catch (error) {
    console.log(chalk.yellow("⚠️  Could not save resolution to config file"));
  }

  return finalResolution;
}

function showResolutionTips(resolution) {
  const { width, height } = resolution;
  const aspectRatio = (width / height).toFixed(2);

  console.log(chalk.dim(`\n💡 Resolution Info:`));
  console.log(chalk.dim(`   Aspect Ratio: ${aspectRatio}:1`));

  if (width === height) {
    console.log(chalk.dim("   Perfect for: Instagram posts, profile pictures"));
  } else if (aspectRatio > 1.7 && aspectRatio < 1.8) {
    console.log(
      chalk.dim("   Perfect for: Widescreen displays, presentations")
    );
  } else if (width === 1080 && height === 1920) {
    console.log(
      chalk.dim("   Perfect for: Instagram/TikTok stories, mobile wallpapers")
    );
  } else if (width > 3000) {
    console.log(chalk.dim("   Perfect for: High-res prints, detailed artwork"));
  } else if (aspectRatio > 2.5) {
    console.log(chalk.dim("   Perfect for: Social media covers, banners"));
  } else {
    console.log(chalk.dim("   Perfect for: General use, social media posts"));
  }
}

export function displayCurrentResolution(userConfig) {
  const currentRes = getCurrentResolution(userConfig);
  console.log(
    chalk.dim(`📐 Current resolution: ${currentRes.width}x${currentRes.height}`)
  );
}
