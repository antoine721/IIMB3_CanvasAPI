export type Track = {
  title: string;
  src: string;
};

const SONG_FILES = [
  "Alors la zone.mp3",
  "Asalto.mp3",
  "Bwo.mp3",
  "Comme d'hab.mp3",
  "Confinement.mp3",
  "Ibiza.mp3",
] as const;

const songSrc = (fileName: string) => `/song/${encodeURIComponent(fileName)}`;
const songTitle = (fileName: string) => fileName.replace(/\.mp3$/i, "");

export const TRACKS: Track[] = SONG_FILES.map((f) => ({
  title: songTitle(f),
  src: songSrc(f),
}));
