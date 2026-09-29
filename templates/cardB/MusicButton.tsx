import s from "./cardB.module.css";

/** A tiny gold-labelled record that spins while music plays. */
export default function MusicButton({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? "Pause music" : "Play music"}
      aria-pressed={playing}
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex size-14 items-center justify-center rounded-full border-2 border-(--gold) bg-(--maroon-deep) shadow-[0_8px_20px_rgb(20_0_5/0.5)]"
    >
      {playing ? (
        <span
          className={`relative block size-10 rounded-full ${s.spin}`}
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0 18%, rgb(255 255 255/.18) 24%, transparent 30% 68%, rgb(255 255 255/.18) 74%, transparent 80%), repeating-radial-gradient(circle, #1a0a0c 0 2px, #2c1015 2px 4px)",
          }}
          aria-hidden
        >
          <span className="absolute inset-[34%] rounded-full bg-(--gold)" />
        </span>
      ) : (
        <svg viewBox="0 0 24 24" className="ml-1 size-6 text-(--gold)" fill="currentColor" aria-hidden>
          <path d="M7 4.5v15l12-7.5z" />
        </svg>
      )}
    </button>
  );
}
