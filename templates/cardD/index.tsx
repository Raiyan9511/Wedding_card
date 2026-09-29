import type { CardProps } from "@/lib/types";
import { has, greeting } from "@/lib/config";

// Phase 2 wiring check only: plain dump of config values. Real design comes in Phase 3.
export default function CardD({ config }: CardProps) {
  const { venue, rsvp, music, theme } = config;
  return (
    <main className="p-6 font-mono text-sm leading-relaxed">
      <h1 className="text-xl font-bold">Card D - Coming Soon</h1>

      <p>{greeting(config)}</p>
      <p>
        {config.groomName} &amp; {config.brideName} ({config.monogram})
      </p>
      <p>Date: {config.weddingDate}</p>
      {has(config.tagline) && <p>Tagline: {config.tagline}</p>}
      <p>{config.invitationMessage}</p>

      {has(config.events) && (
        <>
          <h2 className="mt-4 font-bold">Events</h2>
          <ul>
            {config.events.map((e) => (
              <li key={e.name}>
                - {e.name}: {e.time}
                {has(e.icon) && ` [icon: ${e.icon}]`}
              </li>
            ))}
          </ul>
        </>
      )}

      <h2 className="mt-4 font-bold">Venue</h2>
      <p>
        {venue.name}, {venue.address}
      </p>
      {has(venue.mapsLink) && <p>Maps link: {venue.mapsLink}</p>}
      {has(venue.mapEmbedUrl) && <p>Map embed: {venue.mapEmbedUrl}</p>}

      <h2 className="mt-4 font-bold">RSVP</h2>
      <p>WhatsApp: {rsvp.whatsappNumber}</p>
      {has(rsvp.deadline) && <p>Deadline: {rsvp.deadline}</p>}
      {has(rsvp.googleSheetWebhook) && <p>Sheet webhook: set</p>}

      {has(music.src) && (
        <p className="mt-4">
          Music: {music.src} (autoplay after open: {String(music.autoplayAfterOpen)})
        </p>
      )}
      {has(config.coverImage) && <p>Cover: {config.coverImage}</p>}
      {has(config.couplePhoto) && <p>Couple photo: {config.couplePhoto}</p>}
      {has(config.gallery) && <p>Gallery: {config.gallery.length} images</p>}
      {has(theme) && <p>Theme override: {JSON.stringify(theme)}</p>}
    </main>
  );
}
