import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Track } from "../constants/tracks";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export type PlaylistAudioState = ReturnType<typeof usePlaylistAudio>;

export function usePlaylistAudio(tracks: Track[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const shouldAutoPlayRef = useRef(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const track = useMemo(() => tracks[index], [tracks, index]);

  const loadTrack = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    setError(null);
    audio.src = track.src;
    audio.load();
  }, [track]);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setIsPlaying(true);
      shouldAutoPlayRef.current = true;
    } catch (e) {
      setIsPlaying(false);
      setError("Lecture impossible (interaction requise ou fichier introuvable).");
    }
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
    shouldAutoPlayRef.current = false;
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else void play();
  }, [isPlaying, pause, play]);

  const next = useCallback(() => {
    setIndex((i) => (tracks.length ? (i + 1) % tracks.length : 0));
  }, [tracks.length]);

  const prev = useCallback(() => {
    setIndex((i) => (tracks.length ? (i - 1 + tracks.length) % tracks.length : 0));
  }, [tracks.length]);

  const seek = useCallback((t: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextTime = clamp(t, 0, Number.isFinite(audio.duration) ? audio.duration : 0);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, []);

  // Quand la piste change: charger et éventuellement relancer la lecture.
  useEffect(() => {
    loadTrack();
    setCurrentTime(0);
    setDuration(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, loadTrack]);

  // Bind events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onEnded = () => {
      setCurrentTime(0);
      const wasPlaying = shouldAutoPlayRef.current;
      setIsPlaying(false);
      // Si on était en lecture, on passe à la suivante et on relance.
      if (wasPlaying) {
        next();
        shouldAutoPlayRef.current = true;
      } else {
        shouldAutoPlayRef.current = false;
      }
    };
    const onError = () => {
      setIsPlaying(false);
      setError("Fichier audio introuvable ou non lisible.");
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [next]);

  // Auto-play après changement de piste (ex: next/prev/ended) si demandé.
  useEffect(() => {
    if (!shouldAutoPlayRef.current) return;
    void play();
  }, [index, play]);

  const progress = duration > 0 ? currentTime / duration : 0;

  return {
    audioRef,
    index,
    track,
    isPlaying,
    duration,
    currentTime,
    progress,
    error,
    setIndex,
    play,
    pause,
    toggle,
    next,
    prev,
    seek,
  };
}

