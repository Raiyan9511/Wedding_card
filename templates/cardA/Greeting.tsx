"use client";
import Image from "next/image";
import type { ClientConfig } from "@/lib/types";
import { greeting, has } from "@/lib/config";
import { script } from "./fonts";
import { Bloom, Divider } from "./decor";
import s from "./cardA.module.css";

export default function Greeting({ config }: { config: ClientConfig }) {
  return (
    <section className={`relative px-6 pt-40 pb-20 text-center`}>
      <Bloom art="cornerTop" className="top-2 -left-12 w-36" dur={4.2} />
      <Bloom art="cornerTop" className="top-2 -right-12 w-36" dur={4.7} phase={3} imgClass="-scale-x-100" />
      <Bloom art="spray" className="bottom-10 -left-24 w-52" dur={3.4} phase={2} />

      <div className="relative mx-auto max-w-xl">
        <p className={`js-reveal text-xl font-semibold tracking-[0.12em] ${s.foilText}`}>{greeting(config)}</p>
        <Divider className="js-reveal mx-auto mt-5 w-48 text-(--gold)" />

        {has(config.couplePhoto) && (
          <div className={`js-reveal mx-auto mt-12 w-[min(64%,260px)] rounded-t-full p-[3px] ${s.foil}`}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full border-4 border-(--ivory) bg-(--cream)">
              <Image src={config.couplePhoto} alt={`${config.groomName} and ${config.brideName}`} fill sizes="260px" className="object-cover" />
            </div>
          </div>
        )}

        <p className={`js-reveal ${script.className} mt-12 text-4xl text-(--gold-deep)`}>{has(config.tagline) ? config.tagline : "With joyful hearts"}</p>
        <p className="js-reveal mt-6 text-xl leading-relaxed">{config.invitationMessage}</p>
      </div>
    </section>
  );
}
