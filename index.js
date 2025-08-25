#! /usr/bin/env node

import fs from "fs";
import path from "path";

const quotesPath = path.join(process.cwd(), "quotes.json");
const quotes = JSON.parse(fs.readFileSync(quotesPath, "utf-8"));

const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

console.log("\n✨ Your Quote: ✨\n");
console.log(`"${randomQuote.text}"`);
console.log(` - ${randomQuote.author}\n`);
