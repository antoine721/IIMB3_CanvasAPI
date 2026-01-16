import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";

type Props = {
  isPlaying: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToggle: () => void;
};

export default function MusicPlayerControls({
  isPlaying,
  onPrev,
  onNext,
  onToggle,
}: Props) {
  return (
    <div className="w-full flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-black/30 backdrop-blur px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
      <button
        type="button"
        onClick={onPrev}
        className="h-11 w-11 grid place-items-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 active:bg-white/15 text-white"
        aria-label="Piste précédente"
      >
        <FaStepBackward />
      </button>

      <button
        type="button"
        onClick={onToggle}
        className="h-12 w-12 grid place-items-center rounded-full bg-white text-black hover:bg-white/90 active:bg-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
        aria-label={isPlaying ? "Pause" : "Lecture"}
      >
        {isPlaying ? <FaPause /> : <FaPlay className="translate-x-[1px]" />}
      </button>

      <button
        type="button"
        onClick={onNext}
        className="h-11 w-11 grid place-items-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 active:bg-white/15 text-white"
        aria-label="Piste suivante"
      >
        <FaStepForward />
      </button>
    </div>
  );
}

