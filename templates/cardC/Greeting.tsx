import Image from "next/image";
import type { ClientConfig } from "@/lib/types";
import { greeting, has } from "@/lib/config";
import { script } from "./fonts";
import { FloralSpray, WashEdge, WashStroke } from "./decor";
import s from "./cardC.module.css";

export default function Greeting({ config }: { config: ClientConfig }) {
  const photo = has(config.couplePhoto);
  return (
    <section className={`relative px-6 py-24 sm:py-32 ${s.sageWash}`}>
      <WashEdge />
      <div className={`mx-auto grid max-w-5xl items-center gap-14 ${photo ? "md:grid-cols-[1.1fr_1fr]" : "max-w-2xl"}`}>
        <div className={`text-center ${photo ? "md:text-left" : ""}`}>
          <p className="js-float text-sm tracking-[0.3em] text-(--sage-deep) uppercase">{greeting(config)}</p>
          <h2 className={`js-float ${script.className} mt-3 text-5xl text-(--rose) sm:text-7xl`}>With joyful hearts</h2>
          <WashStroke className={`${s.wash} mx-auto mt-3 w-56 ${photo ? "md:mx-0" : ""}`} />
          <p className="js-float mt-6 text-lg leading-relaxed sm:text-xl">{config.invitationMessage}</p>
        </div>

        {photo && (
          <div className="js-float relative mx-auto w-[min(64vw,300px)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[50%] border-[6px] border-white shadow-[0_18px_40px_rgb(90_110_80/0.2)]">
              <Image src={config.couplePhoto!} alt={`${config.groomName} and ${config.brideName}`} fill sizes="300px" className="object-cover" />
            </div>
            <FloralSpray className="pointer-events-none absolute -bottom-10 -left-14 w-40 -rotate-90" />
          </div>
        )}
      </div>
    </section>
  );
}
