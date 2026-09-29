import Image from "next/image";
import type { ClientConfig } from "@/lib/types";
import { greeting, has } from "@/lib/config";
import { script } from "./fonts";
import { Flourish, RoseCluster, TornEdge } from "./decor";
import s from "./cardB.module.css";

export default function Greeting({ config }: { config: ClientConfig }) {
  const photo = has(config.couplePhoto);
  return (
    <section className={`relative px-6 py-24 sm:py-32 ${s.paper}`}>
      <TornEdge color="var(--ivory)" seed={4} />
      <Flourish className="absolute top-6 left-4 w-16 text-(--gold) sm:w-24" />
      <Flourish className="absolute top-6 right-4 w-16 -scale-x-100 text-(--gold) sm:w-24" />

      <div className={`mx-auto grid max-w-5xl items-center gap-14 ${photo ? "md:grid-cols-2" : ""}`}>
        {photo && (
          <div className="js-drop relative mx-auto w-[min(70vw,340px)] -rotate-3">
            <div className="bg-white p-3 pb-14 shadow-[0_20px_40px_rgb(60_20_10/0.25)]">
              <div className="relative aspect-[4/5] overflow-hidden bg-(--blush)">
                <Image src={config.couplePhoto!} alt={`${config.groomName} and ${config.brideName}`} fill sizes="340px" className="object-cover" />
              </div>
              <p className={`${script.className} absolute inset-x-0 bottom-3 text-center text-2xl text-(--maroon)`}>
                {config.groomName} &amp; {config.brideName}
              </p>
            </div>
            <span className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 rotate-3 bg-(--blush)/85 shadow-sm" />
            <RoseCluster className="absolute -top-12 -right-14 w-36 rotate-90 sm:w-44" />
          </div>
        )}

        <div className={`text-center ${photo ? "md:text-left" : ""}`}>
          <p className={`${s.tearX} text-sm font-semibold tracking-[0.3em] text-(--rose) uppercase`}>{greeting(config)}</p>
          <h2 className={`${s.tearX} ${script.className} mt-4 text-5xl text-(--maroon) sm:text-6xl`}>With love &amp; blessings</h2>
          <div className={`${s.tear} mx-auto mt-6 h-px w-24 bg-(--gold) ${photo ? "md:mx-0" : ""}`} />
          <p className={`${s.tear} mt-6 text-lg leading-relaxed italic sm:text-xl`}>{config.invitationMessage}</p>
        </div>
      </div>
    </section>
  );
}
