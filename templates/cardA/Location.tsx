import type { ClientConfig } from "@/lib/types";
import { has } from "@/lib/config";
import { script } from "./fonts";
import { Bloom, Corner, Divider } from "./decor";
import s from "./cardA.module.css";

export default function Location({ config }: { config: ClientConfig }) {
  const { venue } = config;
  if (!has(venue.name) && !has(venue.address)) return null;

  return (
    <section className="relative px-5 py-20 text-center">
      <Bloom art="cornerTop" className="-top-4 -right-16 w-48" dur={4.4} phase={4} imgClass="-scale-x-100" />
      <Bloom art="bouquet" className="bottom-6 -left-20 w-40" dur={5} phase={1} />

      <div className="relative">
      <h2 className={`js-reveal ${script.className} text-5xl text-(--gold-deep)`}>The Venue</h2>
      <Divider className="js-reveal mx-auto mt-5 w-44 text-(--gold)" />

      <div className={`js-reveal relative mx-auto mt-12 max-w-xl rounded-t-[10rem] bg-(--ivory) px-6 pt-16 pb-8 shadow-[0_14px_40px_rgb(120_85_40/0.14)] ${s.frame}`}>
        <Corner className="absolute bottom-3 left-3 w-16 -scale-y-100 text-(--gold)/60" />
        <Corner className="absolute right-3 bottom-3 w-16 -scale-100 text-(--gold)/60" />

        {has(venue.name) && <h3 className="text-2xl font-semibold tracking-[0.08em] uppercase">{venue.name}</h3>}
        {has(venue.address) && <p className="mx-auto mt-3 max-w-sm text-lg text-(--muted)">{venue.address}</p>}

        {has(venue.mapEmbedUrl) && (
          <div className={`js-reveal relative mt-8 aspect-[4/3] overflow-hidden rounded-xl p-[2px] ${s.foil}`}>
            <iframe
              src={venue.mapEmbedUrl}
              title={`Map to ${venue.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full rounded-[10px] border-0 bg-(--cream)"
            />
          </div>
        )}

        {has(venue.mapsLink) && (
          <a
            href={venue.mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`js-reveal relative mt-8 inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold tracking-[0.2em] text-[#3d2a10] uppercase shadow-md ${s.foil}`}
          >
            Get Directions
          </a>
        )}
      </div>
      </div>
    </section>
  );
}
