# QuoteMe

QuoteMe is a fun terminal tool that greets you with a buddy, shows random quotes (filterable by author), facts, and jokes, and can generate wallpapers or custom-sized quote images. It also supports auto-display on session start for daily inspiration.

![QuoteMe Screenshot 1](https://hc-cdn.hel1.your-objectstorage.com/s/v3/832896cb60641397296044e60bd7e86aac01ed9c_screenshot_2025-08-26_at_20.48.50.png)

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

![QuoteMe Screenshot 2](https://hc-cdn.hel1.your-objectstorage.com/s/v3/ae39dae610766c198326dd5bd20aaf98db765028_quote-2025-08-26t15-12-45.png)
