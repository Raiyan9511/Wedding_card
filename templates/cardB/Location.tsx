import type { ClientConfig } from "@/lib/types";
import { has } from "@/lib/config";
import { script } from "./fonts";
import { EventGlyph, TornEdge } from "./decor";
import s from "./cardB.module.css";

/** Venue as a postcard: map on the picture side, address on the writing side, rose stamp. */
export default function Location({ config }: { config: ClientConfig }) {
  const { venue } = config;
  if (!has(venue.name) && !has(venue.address)) return null;
  const map = has(venue.mapEmbedUrl);

  return (
    <section className={`relative px-5 py-24 ${s.paper}`}>
      <TornEdge color="var(--ivory)" seed={27} />
      <h2 className={`${s.tearX} ${script.className} text-center text-5xl text-(--maroon) sm:text-6xl`}>The Venue</h2>

      <div className="js-drop relative mx-auto mt-12 max-w-4xl rotate-1 bg-white p-4 shadow-[0_20px_40px_rgb(60_20_10/0.2)] sm:p-6">
        <div className="absolute -top-5 -right-3 z-10 flex size-16 rotate-6 items-center justify-center border-2 border-dotted border-(--rose) bg-white p-1 sm:size-20" aria-hidden>
          <div className={`flex h-full w-full items-center justify-center text-(--gold-soft) ${s.velvet}`}>
            <EventGlyph className="size-7" />
          </div>
        </div>
        <div className={`grid gap-6 ${map ? "md:grid-cols-2" : ""}`}>
          {map && (
            <div className="relative aspect-[4/3] overflow-hidden border border-(--gold)/40 bg-(--blush)">
              <iframe
                src={venue.mapEmbedUrl}
                title={`Map to ${venue.name}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
          )}
          <div className={`relative flex flex-col justify-center px-2 py-6 text-center ${map ? "md:border-l md:border-dashed md:border-(--gold)/60 md:pl-8 md:text-left" : ""}`}>
            <p className="text-xs tracking-[0.35em] text-(--rose) uppercase">Kindly join us at</p>
            {has(venue.name) && <h3 className="mt-3 text-2xl font-semibold text-(--maroon) sm:text-3xl">{venue.name}</h3>}
            {has(venue.address) && <p className="mt-3 text-lg text-(--muted) italic">{venue.address}</p>}
            {has(venue.mapsLink) && (
              <a
                href={venue.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-6 inline-flex self-center rounded-sm px-7 py-3 text-xs font-semibold tracking-[0.3em] text-(--gold-soft) uppercase shadow-md ${s.velvet} ${map ? "md:self-start" : ""}`}
              >
                Get Directions
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
