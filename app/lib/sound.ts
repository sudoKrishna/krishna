const cache = new Map<string, HTMLAudioElement>();

export function playSound(src: string, volume = 0.6) {
  if (typeof window === "undefined") return;
  try {
    let audio = cache.get(src);
    if (!audio) {
      audio = new Audio(src);
      audio.preload = "auto";
      cache.set(src, audio);
    }
    // restart from the top so rapid triggers still play
    audio.pause();
    audio.currentTime = 0;
    audio.volume = volume;
    void audio.play().catch(() => {
      /* autoplay policy — ignored until first user gesture */
    });
  } catch {
    /* audio unavailable */
  }
}

export const SOUNDS = {
  hover: "/audio/button-on.mp3",
  pop: "/audio/bubble-pop.mp3",
  click: "/audio/click.mp3",
  click1: "/audio/click1.mp3",
  switch: "/audio/chutter-click.mp3",
  success: "/audio/success.mp3",
  error: "/audio/error.mp3",
  warning: "/audio/warning.mp3",
  info: "/audio/info.mp3",
} as const;
