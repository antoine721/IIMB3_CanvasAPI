import { RefObject, useState } from "react";
import { Track } from "../../constants/tracks";
import Descriptions from "./description";
import Titles from "./title";

interface SongsProps {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onTrackSelect: (index: number) => void;
}

export function Songs({
  scrollContainerRef,
  tracks,
  currentTrackIndex,
  isPlaying,
  onTrackSelect,
}: SongsProps) {
  const [selectedSong, setSelectedSong] = useState<number | null>(null);
  return (
    <div className="relative z-[1] w-full">
      <Titles
        tracks={tracks}
        setSelectedSong={setSelectedSong}
        scrollContainerRef={scrollContainerRef}
        onTrackSelect={onTrackSelect}
      />
      <Descriptions
        tracks={tracks}
        selectedSong={selectedSong}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
      />
    </div>
  );
}
