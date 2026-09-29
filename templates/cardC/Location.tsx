import type { ClientConfig } from "@/lib/types";
import { has } from "@/lib/config";
import { script } from "./fonts";
import { FloralSpray, WashEdge } from "./decor";
import s from "./cardC.module.css";

/** Venue: map in an organic watercolour-blob frame, address on a botanical label. */
export default function Location({ config }: { config: ClientConfig }) {
  const { venue } = config;
  if (!has(venue.name) && !has(venue.address)) return null;
  const map = has(venue.mapEmbedUrl);

  return (
    <section className={`relative px-5 py-24 ${s.cream}`}>
      <WashEdge />
      <h2 className={`js-float ${script.className} text-center text-5xl text-(--rose) sm:text-7xl`}>Find Us Here</h2>

      <div className={`mx-auto mt-12 grid max-w-4xl items-center gap-10 ${map ? "md:grid-cols-2" : "max-w-lg"}`}>
        {map && (
          <div className="js-float relative mx-auto w-full max-w-md">
            <div className="relative aspect-square overflow-hidden rounded-[46%_54%_52%_48%/52%_46%_54%_48%] border-[6px] border-white bg-(--sage-soft) shadow-[0_18px_40px_rgb(90_110_80/0.18)]">
              <iframe
                src={venue.mapEmbedUrl}
                title={`Map to ${venue.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
            <FloralSpray className="pointer-events-none absolute -top-8 -left-10 w-36" />
          </div>
        )}

        <div className={`js-float relative rounded-[2rem] bg-white/70 px-7 py-10 text-center ring-1 ring-(--sage)/30 ${map ? "md:text-left" : ""}`}>
          <p className="text-xs tracking-[0.35em] text-(--sage-deep) uppercase">Join us at</p>
          {has(venue.name) && <h3 className="mt-3 text-2xl font-medium text-(--ink) sm:text-3xl">{venue.name}</h3>}
          {has(venue.address) && <p className="mt-3 text-lg text-(--muted) italic">{venue.address}</p>}
          {has(venue.mapsLink) && (
            <a
              href={venue.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex rounded-full bg-(--sage-deep) px-8 py-3 text-xs tracking-[0.3em] text-white uppercase shadow-md transition-colors hover:bg-(--sage)"
            >
              Get Directions
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
