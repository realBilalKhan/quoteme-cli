# QuoteMe

QuoteMe is a fun terminal tool that greets you with a buddy, shows random quotes (filterable by author), facts, and jokes, and can generate wallpapers or custom-sized quote images. It also supports auto-display on session start for daily inspiration.

![QuoteMe Screenshot 1](https://hc-cdn.hel1.your-objectstorage.com/s/v3/a814502e2142a83d473da8211308cb10797459bd_screenshot_2025-08-26_at_20.53.36.png)

## Installation

Make sure you have the following before installation:

- **[Node.js](https://nodejs.org/)**: version **14.0.0 or higher** (recommended: latest LTS)

You can install **QuoteMe CLI** globally via npm:

```bash
npm install -g quoteme-cli@latest
```

## Usage

| Command                 | Description                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `quoteme`               | Show a random quote                                                                |
| `quoteme -a <author>`   | Show a quote by a specific author                                                  |
| `quoteme -i`            | Generate and save a quote image to the default path (`~/Downloads/quoteme images`) |
| `quoteme -i <path>`     | Generate and save a quote image to the specified path                              |
| `quoteme -f`            | Show a random fact                                                                 |
| `quoteme -j`            | Show a random joke                                                                 |
| `quoteme -r`            | Set image resolution                                                               |
| `quoteme --enable`      | Enable quotes on terminal startup                                                  |
| `quoteme --disable`     | Disable quotes on terminal startup                                                 |
| `quoteme --auto-status` | Show auto-display status                                                           |
| `quoteme -h, --help`    | Show this help message                                                             |

<br>

![QuoteMe Screenshot 2](https://hc-cdn.hel1.your-objectstorage.com/s/v3/ae39dae610766c198326dd5bd20aaf98db765028_quote-2025-08-26t15-12-45.png)
