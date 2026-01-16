import { Track } from "../../constants/tracks";

interface DescriptionsProps {
  tracks: Track[];
  selectedSong: number | null;
}

export default function Descriptions({
  tracks,
  selectedSong,
}: DescriptionsProps) {
  return (
    <div className="absolute top-[3px] h-full w-full z-[2] pointer-events-none">
      {tracks.map((track, i) => {
        return (
          <div
            key={track.title}
            className="bg-[#b900ff] flex justify-between items-center px-[10%] transition-[clip-path] duration-[400ms] [&>p:first-of-type]:text-[#010101] [&>p:first-of-type]:uppercase [&>p:first-of-type]:font-bold [&>p:first-of-type]:text-[8vw] [&>p:first-of-type]:leading-[7.5vw] [&>p:first-of-type]:m-0 [&>p:first-of-type]:relative [&>p:first-of-type]:z-[1] [&>p:nth-of-type(2)]:w-[40%] [&>p:nth-of-type(2)]:text-[1vw] [&>p:nth-of-type(2)]:font-bold"
            style={{
              clipPath: selectedSong == i ? "inset(0 0 0)" : "inset(50% 0 50%",
            }}
          >
            <p>{track.title}</p>
          </div>
        );
      })}
    </div>
  );
}
