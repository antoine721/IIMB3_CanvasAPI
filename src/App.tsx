import { useRef } from "react";
import Footer from "./components/footer";
import CoverSection from "./components/sections/cover-section";
import HomeSection from "./components/sections/home-section";
import { Songs } from "./components/songs";
import { TRACKS } from "./constants/tracks";
import { usePlaylistAudio } from "./hooks/use-playlist-audio";

export default function App() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const audioState = usePlaylistAudio(TRACKS);

  return (
    <div
      ref={scrollContainerRef}
      className="h-screen overflow-y-scroll overflow-x-hidden"
    >
      <HomeSection />
      <div className="relative bg-black flex items-center justify-center z-20 pt-20">
        <Songs
          scrollContainerRef={scrollContainerRef}
          tracks={TRACKS}
          onTrackSelect={(index: number) => {
            audioState.setIndex(index);
            void audioState.play();
          }}
        />
        <div className="absolute right-0 bottom-0 -z-10 w-full max-w-6xl translate-y-1/5">
          <img
            src="/julmoto.png"
            alt=""
            aria-hidden="true"
            width={1200}
            height={800}
            loading="lazy"
            className="grayscale object-cover"
          />
        </div>
      </div>
      <CoverSection />
      <Footer />
      <audio ref={audioState.audioRef} preload="metadata" />
    </div>
  );
}
