import type { ClientConfig } from "@/lib/types";
import { formatDate } from "@/lib/config";
import { script } from "./fonts";
import { Ripples, Swan, WashEdge } from "./decor";
import s from "./cardC.module.css";

export default function Footer({ config }: { config: ClientConfig }) {
  return (
    <footer className={`relative px-6 pt-16 pb-32 text-center ${s.sageWash}`}>
      <WashEdge />
      <div className="js-float relative mx-auto flex w-40" aria-hidden>
        <Swan className="w-1/2" />
        <Swan className="w-1/2 -scale-x-100" />
        <Ripples className="absolute inset-x-0 -bottom-2 w-full" />
      </div>
      <p className="js-float mt-8 text-lg text-(--muted) italic">With love and gratitude</p>
      <p className={`js-float ${script.className} mt-2 text-5xl text-(--rose) sm:text-7xl`}>
        {config.groomName} &amp; {config.brideName}
      </p>
      <p className="mt-4 text-xs tracking-[0.4em] text-(--sage-deep) uppercase">{formatDate(config.weddingDate)}</p>
    </footer>
  );
}
