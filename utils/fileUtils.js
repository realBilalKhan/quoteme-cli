import os from "os";
import fs from "fs";
import path from "path";
import chalk from "chalk";

function getDownloadsDir() {
  const homeDir = os.homedir();
  const platform = os.platform();

  switch (platform) {
    case "win32":
    case "darwin":
    case "linux":
    default:
      return path.join(homeDir, "Downloads");
  }
}

export function getDefaultSaveDir() {
  const downloadsDir = getDownloadsDir();
  const quotemeDir = path.join(downloadsDir, "quoteme images");

  if (!fs.existsSync(quotemeDir)) {
    fs.mkdirSync(quotemeDir, { recursive: true });
  }

  return quotemeDir;
}

export function loadUserConfig(configPath) {
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
  return userConfig;
}

export function updateConfigSaveDirectory(configPath, userConfig, newPath) {
  try {
    const configDir = path.dirname(newPath);

    userConfig.saveDirectory = configDir;

    fs.writeFileSync(configPath, JSON.stringify(userConfig, null, 2));

    console.log(
      chalk.blue(`📁 Config updated: future images will save to ${configDir}`)
    );
  } catch (error) {
    console.log(chalk.yellow("⚠️  Could not update config file"));
  }
}

export function generateSavePath(outputPath, userConfig, defaultFilename) {
  let savePath;

  if (outputPath) {
    if (path.extname(outputPath) === "") {
      savePath = path.join(outputPath, defaultFilename);
    } else {
      savePath = outputPath;
    }

    const saveDir = path.dirname(savePath);
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }
  } else {
    const saveDir = userConfig.saveDirectory || getDefaultSaveDir();

    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }

    savePath = path.join(saveDir, defaultFilename);
  }

  return savePath;
}

export function generateTimestampFilename(prefix = "quote") {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `${prefix}-${timestamp}.png`;
}
