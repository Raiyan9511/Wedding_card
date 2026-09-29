/**
 * CLIENT CONFIG
 * This is the only file you edit to launch a new client site, along with assets in /public/client/.
 *
 * - `template` picks the card ("A"–"E"); only that card is compiled into the site.
 *   The card is chosen at build time, so restart `npm run dev` after changing it.
 * - Optional fields (marked `?` in lib/types.ts) can be deleted or left "" / [] —
 *   the matching section is hidden cleanly, never shown as an empty box.
 * - Asset paths start with /client/... (files live in /public/client/...).
 */
import type { ClientConfig } from "@/lib/types";

export const clientConfig: ClientConfig = {
  template: "A",

  brideName: "Juhi",
  groomName: "Jony",
  // monogram: "S&N", // optional — defaults to first letters of groomName & brideName
  weddingDate: "2026-12-12",
  tagline: "Two souls, one journey",

  religion: "muslim",
  invitationMessage:
    "With the blessings of Allah and our families, we request the honour of your presence at the wedding of our children.",

  // Card A icon keys: "dhol" (Mehndi / Sangeet), "nikah", "bride" (Baraat / bride entry),
  // "dinner" (Walima / dinner), "reception". Unknown or missing → a small gold ornament.
  // time: "date · time" shows as a big time + small date line (plain text also works).
  events: [
    { name: "Mehndi", time: "10 December 2026 · 6:00 PM", icon: "dhol" },
    { name: "Baraat", time: "12 December 2026 · 5:00 PM", icon: "bride" },
    { name: "Nikah", time: "12 December 2026 · 7:00 PM", icon: "nikah" },
    { name: "Walima", time: "13 December 2026 · 8:00 PM", icon: "dinner" },
    { name: "Reception", time: "14 December 2026 · 7:30 PM", icon: "reception" },
  ],

  venue: {
    name: "Royal Palace Banquet",
    address: "MG Road, Lucknow, Uttar Pradesh 226001",
    city: "Lucknow",
    mapEmbedUrl: "https://www.google.com/maps?q=MG+Road+Lucknow&output=embed",
    mapsLink: "https://maps.google.com/?q=MG+Road+Lucknow",
  },

  rsvp: {
    deadline: "2026-11-30",
    whatsappNumber: "919876543210",
  },

  music: {
    src: "/client/music/song.mp3", // hidden automatically until the file exists
    autoplayAfterOpen: true,
  },

  // Hero video: "built-in" = the card's own video, or a path like "/client/video/hero.mp4".
  // Without it the hero falls back to coverImage, then to a plain cream background.
  coverVideo: "built-in",
  coverImage: "/client/photos/cover.jpg",
  couplePhoto: "/client/photos/couple.jpg",
  gallery: ["/client/gallery/1.jpg", "/client/gallery/2.jpg", "/client/gallery/3.jpg"],
};
