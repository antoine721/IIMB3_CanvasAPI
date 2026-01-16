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

        return (
          <div
            key={track.title}
            className="bg-[#b900ff] flex justify-between items-center px-[10%] transition-[clip-path] duration-[400ms] [&>p:first-of-type]:text-[#010101] [&>p:first-of-type]:uppercase [&>p:first-of-type]:font-bold [&>p:first-of-type]:text-[8vw] [&>p:first-of-type]:leading-[7.5vw] [&>p:first-of-type]:m-0 [&>p:first-of-type]:relative [&>p:first-of-type]:z-[1]"
            style={{
              clipPath:
                selectedSong == i || isCurrentlyPlaying
                  ? "inset(0 0 0)"
                  : "inset(50% 0 50%",
            }}
          >
            {/* Play/Pause Indicator */}
            <span
              className="flex items-center justify-center mr-[2vw]"
              aria-hidden="true"
            >
              {isCurrentlyPlaying ? (
                <LuPause className="w-[3vw] h-[3vw] text-[#010101]" />
              ) : (
                <LuPlay className="w-[3vw] h-[3vw] text-[#010101]" />
              )}
            </span>
            <p className="font-jaro">{track.title}</p>;
          </div>
        );
      })}
    </div>
  );
}
