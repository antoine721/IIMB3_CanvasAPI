import { LuPause, LuPlay } from "react-icons/lu";
import { Track } from "../../constants/tracks";

interface DescriptionsProps {
  tracks: Track[];
  selectedSong: number | null;
  currentTrackIndex: number;
  isPlaying: boolean;
}

export default function Descriptions({
  tracks,
  selectedSong,
  currentTrackIndex,
  isPlaying,
}: DescriptionsProps) {
  return (
    <div className="absolute top-[3px] h-full w-full z-[2] pointer-events-none">
      {tracks.map((track, i) => {
        const isCurrentlyPlaying = isPlaying && currentTrackIndex === i;
        const isActive = selectedSong === i || isCurrentlyPlaying;

        return (
          <div
            key={track.title}
            className="bg-[#b900ff] flex justify-between items-center px-[10%] transition-[clip-path] duration-[400ms]"
            style={{
              clipPath: isActive ? "inset(0 0 0)" : "inset(50% 0 50%)",
            }}
          >
            <span
              className="flex items-center justify-center mr-4 sm:mr-[2vw]"
              aria-hidden="true"
            >
              {isCurrentlyPlaying ? (
                <LuPause className="size-6 sm:size-[clamp(1.5rem,3vw,3rem)] text-[#010101]" />
              ) : (
                <LuPlay className="size-6 sm:size-[clamp(1.5rem,3vw,3rem)] text-[#010101]" />
              )}
            </span>
            <p className="font-jaro text-[#010101] uppercase font-bold m-0 relative z-[1] text-[clamp(2rem,8vw,6rem)] leading-[0.95]">
              {track.title}
            </p>
          </div>
        );
      })}
    </div>
  );
}
