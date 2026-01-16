export type PatternType =
  | "none"
  | "waves"
  | "lines"
  | "squares"
  | "dots"
  | "diagonal"
  | "grid"
  | "circles"
  | "triangles"
  | "hexagons";

export interface PatternSettings {
  type: PatternType;
  color: string;
  opacity: number;
  scale: number;
}

export interface CoverSettings {
  bgColor: string;
  borderColor: string;
  borderWidth: number;
  centerImage: string;
  pattern: PatternSettings;
}

export const DEFAULT_PATTERN_SETTINGS: PatternSettings = {
  type: "none",
  color: "#ffffff",
  opacity: 0.15,
  scale: 1,
};

export const DEFAULT_COVER_SETTINGS: CoverSettings = {
  bgColor: "#000000",
  borderColor: "#ffffff",
  borderWidth: 2,
  centerImage: "/jul.png",
  pattern: DEFAULT_PATTERN_SETTINGS,
};

export const PATTERN_OPTIONS: { type: PatternType; name: string }[] = [
  { type: "none", name: "None" },
  { type: "waves", name: "Waves" },
  { type: "lines", name: "Lines" },
  { type: "squares", name: "Squares" },
  { type: "dots", name: "Dots" },
  { type: "diagonal", name: "Diagonal" },
  { type: "grid", name: "Grid" },
  { type: "circles", name: "Circles" },
  { type: "triangles", name: "Triangles" },
  { type: "hexagons", name: "Hexagons" },
];

export const AVAILABLE_IMAGES = [
  { name: "Jul", src: "/jul.png" },
  { name: "Background", src: "/background.png" },
] as const;

export const COVER_PRESETS = [
  {
    name: "Neon",
    bgColor: "#1a1a2e",
    borderColor: "#e94560",
  },
  {
    name: "Gold",
    bgColor: "#0f0f0f",
    borderColor: "#ffd700",
  },
  {
    name: "Cyber",
    bgColor: "#1e3a5f",
    borderColor: "#00d4ff",
  },
  {
    name: "Purple",
    bgColor: "#2d1b4e",
    borderColor: "#9b59b6",
  },
] as const;

export const CANVAS_SIZE = 800;
