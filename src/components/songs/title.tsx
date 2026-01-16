import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import { Dispatch, RefObject, SetStateAction, useRef } from "react";
import { Track } from "../../constants/tracks";

interface TitlesProps {
  tracks: Track[];
  setSelectedSong: Dispatch<SetStateAction<number | null>>;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  onTrackSelect: (index: number) => void;
}
export default function Titles({
  tracks,
  setSelectedSong,
  scrollContainerRef,
  onTrackSelect,
}: TitlesProps) {
  return (
    <div className="w-full border-t border-[rgba(183,171,152,0.25)]">
      {tracks.map((track, i) => {
        return (
          <Title
            key={track.title}
            track={track}
            index={i}
            setSelectedSong={setSelectedSong}
            scrollContainerRef={scrollContainerRef}
            onTrackSelect={onTrackSelect}
          />
        );
      })}
    </div>
  );
}

interface TitleProps {
  track: Track;
  index: number;
  setSelectedSong: Dispatch<SetStateAction<number | null>>;
  scrollContainerRef: RefObject<HTMLDivElement | null>;
  onTrackSelect: (index: number) => void;
}

function Title({
  track,
  index,
  setSelectedSong,
  scrollContainerRef,
  onTrackSelect,
}: TitleProps) {
  const container = useRef<HTMLDivElement>(null);
  const speed = 0.5 + (index % 3) * 0.15;

  const { scrollYProgress } = useScroll({
    target: container,
    container: scrollContainerRef,
    offset: ["start end", `${25 / speed}vw end`],
  });

  const clipProgress = useTransform(scrollYProgress, [0, 1], [100, 0]);
  const clip = useMotionTemplate`inset(0 ${clipProgress}% 0 0)`;

  return (
    <div ref={container} className="border-b border-[rgba(168,155,226,0.25)] relative z-[2]">
      <button
        type="button"
        onClick={() => onTrackSelect(index)}
        onFocus={() => setSelectedSong(index)}
        onBlur={() => setSelectedSong(null)}
        onMouseOver={() => setSelectedSong(index)}
        onMouseLeave={() => setSelectedSong(null)}
        className="relative inline-block pl-[10%] text-left cursor-pointer bg-transparent border-none w-full [&>p:first-of-type]:inline-block [&>p:first-of-type]:text-[#f9e0ff] [&>p:first-of-type]:uppercase [&>p:first-of-type]:font-bold [&>p:first-of-type]:text-[8vw] [&>p:first-of-type]:leading-[7.5vw] [&>p:first-of-type]:m-0 [&>p:first-of-type]:relative [&>p:first-of-type]:z-[2] [&>p:nth-of-type(2)]:block [&>p:nth-of-type(2)]:absolute [&>p:nth-of-type(2)]:text-[#3f2549] [&>p:nth-of-type(2)]:top-0 [&>p:nth-of-type(2)]:z-[1] [&>p:nth-of-type(2)]:uppercase [&>p:nth-of-type(2)]:font-bold [&>p:nth-of-type(2)]:text-[8vw] [&>p:nth-of-type(2)]:leading-[7.5vw] [&>p:nth-of-type(2)]:m-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label={`Play ${track.title}`}
      >
        <motion.p style={{ clipPath: clip }}>{track.title}</motion.p>
        <p aria-hidden="true">{track.title}</p>
      </button>
    </div>
  );
}
