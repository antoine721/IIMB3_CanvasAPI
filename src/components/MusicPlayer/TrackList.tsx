import type { Track } from "../../constants/tracks";

type Props = {
  tracks: Track[];
  currentIndex: number;
  onSelect: (index: number) => void;
};

export default function TrackList({ tracks, currentIndex, onSelect }: Props) {
  return (
    <div className="w-full h-full rounded-2xl border border-white/15 bg-black/30 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10">
        <div className="text-xs uppercase tracking-wider text-white/60">
          Playlist
        </div>
        <div className="text-sm font-semibold text-white">
          {tracks.length} titres
        </div>
      </div>

      <div className="max-h-[520px] overflow-y-auto">
        {tracks.map((t, i) => {
          const active = i === currentIndex;
          return (
            <button
              key={`${t.src}-${i}`}
              type="button"
              onClick={() => onSelect(i)}
              className={`w-full text-left px-4 py-3 border-b border-white/5 transition-colors ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
              aria-current={active ? "true" : undefined}
            >
              <div className="text-[11px] uppercase tracking-wider text-white/40">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="truncate font-semibold">{t.title}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

