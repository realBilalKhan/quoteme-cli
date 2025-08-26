export const resolutionPresets = [
  { name: "HD (1280x720)", value: { width: 1280, height: 720 }, short: "HD" },
  {
    name: "Full HD (1920x1080)",
    value: { width: 1920, height: 1080 },
    short: "Full HD",
  },
  { name: "2K (2560x1440)", value: { width: 2560, height: 1440 }, short: "2K" },
  { name: "4K (3840x2160)", value: { width: 3840, height: 2160 }, short: "4K" },
  {
    name: "Instagram Square (1080x1080)",
    value: { width: 1080, height: 1080 },
    short: "IG Square",
  },
  {
    name: "Instagram Story (1080x1920)",
    value: { width: 1080, height: 1920 },
    short: "IG Story",
  },
  {
    name: "Twitter Post (1200x675)",
    value: { width: 1200, height: 675 },
    short: "Twitter",
  },
  {
    name: "Facebook Cover (851x315)",
    value: { width: 851, height: 315 },
    short: "FB Cover",
  },
  {
    name: "YouTube Thumbnail (1280x720)",
    value: { width: 1280, height: 720 },
    short: "YT Thumb",
  },
  {
    name: "Desktop Wallpaper (1920x1080)",
    value: { width: 1920, height: 1080 },
    short: "Wallpaper",
  },
  { name: "Custom Resolution", value: "custom", short: "Custom" },
  {
    name: "Use Default (1200x800)",
    value: { width: 1200, height: 800 },
    short: "Default",
  },
];
