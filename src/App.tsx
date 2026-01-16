import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Footer from "./components/footer";
import CoverSection from "./components/sections/cover-section";
import HomeSection from "./components/sections/home-section";
import { Songs } from "./components/songs";
import { TRACKS } from "./constants/tracks";
import { usePlaylistAudio } from "./hooks/use-playlist-audio";

export default function App() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const songsSectionRef = useRef<HTMLDivElement>(null);
  const audioState = usePlaylistAudio(TRACKS);

  const { scrollYProgress } = useScroll({
    target: songsSectionRef,
    container: scrollContainerRef,
    offset: ["start 0.6", "center start"],
  });

  const julMotoX = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={scrollContainerRef}
      className="h-screen overflow-y-scroll overflow-x-hidden"
    >
      <HomeSection />
      <div
        ref={songsSectionRef}
        className="relative bg-black flex items-center justify-center z-20 pt-20"
      >
        <Songs
          scrollContainerRef={scrollContainerRef}
          tracks={TRACKS}
          currentTrackIndex={audioState.index}
          isPlaying={audioState.isPlaying}
          onTrackSelect={(index: number) => {
            if (audioState.index === index && audioState.isPlaying) {
              audioState.pause();
            } else {
              audioState.setIndex(index);
              void audioState.play();
            }
          }}
        />
        <motion.div
          className="absolute right-0 bottom-0 -z-10 w-full max-w-6xl translate-y-1/5"
          style={{ x: julMotoX }}
        >
          <img
            src="/julmoto.png"
            alt=""
            aria-hidden="true"
            width={1200}
            height={800}
            loading="lazy"
            className="grayscale object-cover"
          />
        </motion.div>
      </div>
      <CoverSection />
      <Footer />
      <audio ref={audioState.audioRef} preload="metadata" />
    </div>
  );
}
