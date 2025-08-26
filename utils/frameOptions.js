const borderStyles = ["single", "double", "round", "bold", "classic"];
const borderColors = ["cyan", "yellow", "green", "magenta", "blue", "red"];

export function getRandomFrameOptions() {
  return {
    padding: 1,
    margin: 1,
    borderStyle: borderStyles[Math.floor(Math.random() * borderStyles.length)],
    borderColor: borderColors[Math.floor(Math.random() * borderColors.length)],
  };
}
