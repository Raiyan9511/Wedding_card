import s from "./cardC.module.css";

/** A watercolour flower that slowly turns while the music plays. */
export default function MusicButton({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? "Pause music" : "Play music"}
      aria-pressed={playing}
      className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex size-14 items-center justify-center rounded-full bg-white shadow-[0_8px_22px_rgb(90_110_80/0.28)] ring-1 ring-(--sage)/40"
    >
      <svg viewBox="-20 -20 40 40" className={`absolute inset-1.5 ${playing ? s.spin : "opacity-50"}`} aria-hidden>
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="0" cy="-10" rx="6.5" ry="10" fill="#f2cac5" stroke="#c77f84" strokeOpacity=".4" strokeWidth=".6" transform={`rotate(${a})`} />
        ))}
        <circle r="4" fill="#f0c98e" />
      </svg>
      {!playing && (
        <svg viewBox="0 0 24 24" className="relative ml-0.5 size-5 text-(--sage-deep)" fill="currentColor" aria-hidden>
          <path d="M7 4.5v15l12-7.5z" />
        </svg>
      )}
    </button>
  );
}
