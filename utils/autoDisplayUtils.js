import os from "os";
import fs from "fs";
import path from "path";
import chalk from "chalk";

export function getShellConfigPath() {
  const homeDir = os.homedir();
  const shell = process.env.SHELL || "";

  if (shell.includes("zsh")) {
    return path.join(homeDir, ".zshrc");
  } else if (shell.includes("bash")) {
    return path.join(homeDir, ".bashrc");
  } else if (shell.includes("fish")) {
    return path.join(homeDir, ".config", "fish", "config.fish");
  } else {
    return path.join(homeDir, ".bashrc");
  }
}

export function getQuoteCommand() {
  const scriptPath = process.argv[1];
  return `node "${scriptPath}"`;
}

export function isAutoQuotesEnabled(configFile) {
  if (!fs.existsSync(configFile)) {
    return false;
  }

  const configContent = fs.readFileSync(configFile, "utf-8");
  return configContent.includes("# QuoteMe Auto-display");
}

export function enableAutoQuotes(configPath, userConfig) {
  const configFile = getShellConfigPath();
  const quoteCommand = getQuoteCommand();
  const autoQuoteEntry = `\n# QuoteMe Auto-display\nif [ "$QUOTEME_AUTO" != "disabled" ]; then\n  ${quoteCommand} --silent\nfi\n`;

  try {
    let configContent = "";
    if (fs.existsSync(configFile)) {
      configContent = fs.readFileSync(configFile, "utf-8");
    }

    if (isAutoQuotesEnabled(configFile)) {
      console.log(chalk.yellow("✅ Auto-quotes are already enabled!"));
      return;
    }

    configContent += autoQuoteEntry;
    fs.writeFileSync(configFile, configContent);

    userConfig.autoDisplay = true;
    fs.writeFileSync(configPath, JSON.stringify(userConfig, null, 2));

    console.log(chalk.green("✅ Auto-quotes enabled!"));
    console.log(chalk.blue(`📝 Added configuration to: ${configFile}`));
    console.log(
      chalk.yellow(
        "🔄 Please restart your terminal or run 'source " +
          path.basename(configFile) +
          "' to activate."
      )
    );
    console.log(
      chalk.gray("💡 To temporarily disable, set: export QUOTEME_AUTO=disabled")
    );
  } catch (error) {
    console.log(chalk.red(`❌ Error enabling auto-quotes: ${error.message}`));
    throw error;
  }
}

export function disableAutoQuotes(configPath, userConfig) {
  const configFile = getShellConfigPath();

  try {
    if (!fs.existsSync(configFile)) {
      console.log(chalk.yellow("⚠️  Shell configuration file not found."));
      return;
    }

    let configContent = fs.readFileSync(configFile, "utf-8");

    const autoQuoteRegex =
      /\n# QuoteMe Auto-display\nif \[ "\$QUOTEME_AUTO" != "disabled" \]; then\n.*\nfi\n/g;
    const newContent = configContent.replace(autoQuoteRegex, "");

    if (configContent === newContent) {
      console.log(chalk.yellow("⚠️  Auto-quotes were not enabled."));
      return;
    }

    fs.writeFileSync(configFile, newContent);

    userConfig.autoDisplay = false;
    fs.writeFileSync(configPath, JSON.stringify(userConfig, null, 2));

    console.log(chalk.green("✅ Auto-quotes disabled!"));
    console.log(chalk.blue(`📝 Removed configuration from: ${configFile}`));
    console.log(
      chalk.yellow(
        "🔄 Please restart your terminal for changes to take effect."
      )
    );
  } catch (error) {
    console.log(chalk.red(`❌ Error disabling auto-quotes: ${error.message}`));
    throw error;
  }
}

export function showAutoDisplayStatus(userConfig) {
  const configFile = getShellConfigPath();
  const isEnabled = isAutoQuotesEnabled(configFile);
  const configStatus = userConfig.autoDisplay || false;

  console.log(chalk.cyan.bold("Auto-Display Status:"));
  console.log(
    `Shell Config: ${
      isEnabled ? chalk.green("Enabled") : chalk.red("Disabled")
    }`
  );
  console.log(
    `User Config: ${
      configStatus ? chalk.green("Enabled") : chalk.red("Disabled")
    }`
  );
  console.log(`Config File: ${configFile}`);
  console.log();

  if (isEnabled !== configStatus) {
    console.log(
      chalk.yellow(
        "⚠️  Configuration mismatch detected. Try running --enable or --disable to fix."
      )
    );
    console.log();
  }
}
