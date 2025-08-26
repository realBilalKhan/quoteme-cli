# QuoteMe

QuoteMe is a fun terminal tool that greets you with a buddy, shows random quotes (filterable by author), facts, and jokes, and can generate wallpapers or custom-sized quote images. It also supports auto-display on session start for daily inspiration.

## Installation

Make sure you have the following before installation:

- **[Node.js](https://nodejs.org/)**: version **14.0.0 or higher** (recommended: latest LTS)

You can install **QuoteMe CLI** globally via npm:

```bash
npm install -g quoteme
```

## Usage

| Command                 | Description                        |
| ----------------------- | ---------------------------------- |
| `quoteme`               | Show a random quote                |
| `quoteme -a <author>`   | Show a quote by a specific author  |
| `quoteme -i [path]`     | Generate and save a quote image    |
| `quoteme -f`            | Show a random fact                 |
| `quoteme -j`            | Show a random joke                 |
| `quoteme -r`            | Set image resolution               |
| `quoteme --enable`      | Enable quotes on terminal startup  |
| `quoteme --disable`     | Disable quotes on terminal startup |
| `quoteme --auto-status` | Show auto-display status           |
| `quoteme -h, --help`    | Show this help message             |
