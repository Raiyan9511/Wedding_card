"use client";
import { useEffect, useRef, useState } from "react";

/**
 * One looping background track. Browsers block autoplay, so call `play()` from a
 * user gesture (the envelope tap). `available` turns false if the file fails to load.
 */
export function useAudio(src?: string) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = "auto";
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => setFailed(true);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);
    ref.current = audio;
    return () => {
      audio.pause();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      ref.current = null;
    };
  }, [src]);

  const play = () => {
    ref.current?.play().catch(() => {});
  };
  const toggle = () => {
    const audio = ref.current;
    if (!audio) return;
    if (audio.paused) play();
    else audio.pause();
  };

  return { available: !!src && !failed, playing, play, toggle };
}
