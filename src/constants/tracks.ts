export type Track = {
  title: string;
  src: string;
};

const SONG_FILES = [
  "Alors la zone - Jul.mp3",
  "Asalto - Jul.mp3",
  "Bande organisée - Kofs.mp3",
  "Bwo - Jul.mp3",
  "Comme d'hab - Jul.mp3",
  "Confinement - Jul.mp3",
  "Dans ma paranoïa - Jul.mp3",
  "Ibiza - Jul.mp3",
  "Inspi d'ailleurs - Jul.mp3",
  "La Bandite (Extended Mix By Fuvi Clan) - Jul.mp3",
  "La Seleçao - Alonzo.mp3",
] as const;

const songSrc = (fileName: string) => `/song/${encodeURIComponent(fileName)}`;
const songTitle = (fileName: string) => fileName.replace(/\.mp3$/i, "");

export const TRACKS: Track[] = SONG_FILES.map((f) => ({
  title: songTitle(f),
  src: songSrc(f),
}));

