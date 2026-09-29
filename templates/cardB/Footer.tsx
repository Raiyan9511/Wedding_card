import type { ClientConfig } from "@/lib/types";
import { formatDate } from "@/lib/config";
import { script } from "./fonts";
import { RoseCluster, TornEdge } from "./decor";
import s from "./cardB.module.css";

export default function Footer({ config }: { config: ClientConfig }) {
  return (
    <footer className={`relative px-6 pt-16 pb-32 text-center ${s.velvet}`}>
      <TornEdge color="var(--maroon)" seed={37} />
      <div className="js-drop mx-auto flex w-64 justify-center" aria-hidden>
        <RoseCluster className="w-32 -scale-x-100" />
        <RoseCluster className="-ml-6 w-32" />
      </div>
      <p className={`${s.tear} mt-6 text-lg text-(--gold-soft) italic`}>With love and gratitude</p>
      <p className={`${s.tearX} ${script.className} mt-3 text-5xl sm:text-6xl ${s.goldText}`}>
        {config.groomName} &amp; {config.brideName}
      </p>
      <p className="mt-5 text-xs tracking-[0.4em] text-(--ivory)/80 uppercase">{formatDate(config.weddingDate)}</p>
    </footer>
  );
}
