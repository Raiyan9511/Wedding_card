import s from "./cardA.module.css";

export default function MusicButton({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? "Pause music" : "Play music"}
      aria-pressed={playing}
      className={`fixed right-4 sm:right-[calc(50vw-240px+1rem)] bottom-[calc(1rem+env(safe-area-inset-bottom))] z-40 flex size-13 items-center justify-center rounded-full p-[2px] shadow-lg ${s.foil}`}
    >
      <span className="flex h-full w-full items-center justify-center rounded-full bg-(--ivory) text-(--gold-deep)">
        {playing ? (
          <span className={`flex h-4 items-end gap-[3px] ${s.bars}`} aria-hidden>
            <i />
            <i />
            <i />
          </span>
        ) : (
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M9 18V6l10-2v12" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="17" cy="16" r="2" />
          </svg>
        )}
      </span>
    </button>
  );
}
