export interface CoverSettings {
  bgColor: string;
  borderColor: string;
  borderWidth: number;
  centerImage: string;
  overlayOpacity: number;
}

export const DEFAULT_COVER_SETTINGS: CoverSettings = {
  bgColor: "#1a1a2e",
  borderColor: "#ffffff",
  borderWidth: 8,
  centerImage: "/jul.png",
  overlayOpacity: 0.3,
};

export const AVAILABLE_IMAGES = [
  { name: "Jul", src: "/jul.png" },
  { name: "Background", src: "/background.png" },
  { name: "New BG", src: "/newbg.png" },
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
