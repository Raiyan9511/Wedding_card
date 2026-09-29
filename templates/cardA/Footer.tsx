import type { ClientConfig } from "@/lib/types";
import { formatDate, monogram } from "@/lib/config";
import { script } from "./fonts";
import { Bloom, Divider, Dove } from "./decor";
import s from "./cardA.module.css";

export default function Footer({ config }: { config: ClientConfig }) {
  return (
    <footer className="relative px-6 pt-20 pb-36 text-center">
      <Bloom art="cornerBottom" className="-bottom-8 -left-16 w-48" dur={4.2} phase={2} imgClass="-scale-x-100" />
      <Bloom art="cornerBottom" className="-right-16 -bottom-8 w-48" dur={4.7} phase={5} />
      <Bloom art="spray" className="top-4 -right-24 w-44" dur={3.4} imgClass="-scale-x-100" />

      <div className="relative">
      <div className="js-reveal flex items-end justify-center gap-4">
        <Dove className="w-12 -scale-x-100 text-(--gold)" />
        <div className={`flex size-24 shrink-0 items-center justify-center rounded-full p-[2px] ${s.foil}`}>
          <span className={`flex h-full w-full items-center justify-center rounded-full bg-(--ivory) ${script.className} text-2xl text-(--gold-deep)`}>
            {monogram(config)}
          </span>
        </div>
        <Dove className="w-12 text-(--gold)" />
      </div>
      <p className="js-reveal mx-auto mt-8 max-w-sm text-xl italic">We look forward to celebrating with you</p>
      <p className={`js-reveal ${script.className} mt-4 text-5xl ${s.foilText}`}>
        {config.groomName} &amp; {config.brideName}
      </p>
      <Divider className="js-reveal mx-auto mt-6 w-40 text-(--gold)" />
      <p className="js-reveal mt-4 text-sm tracking-[0.3em] text-(--muted) uppercase">{formatDate(config.weddingDate)}</p>
      </div>
    </footer>
  );
}
