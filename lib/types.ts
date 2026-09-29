import type { TemplateId } from "@/templates/registry";

export type Religion = "muslim" | "hindu" | "christian" | "general";

export type WeddingEvent = {
  name: string;
  time: string;
  icon?: string;
};

export type ClientConfig = {
  template: TemplateId;

  brideName: string;
  groomName: string;
  monogram?: string; // e.g. "S&N" — optional, defaults to first letters of groomName & brideName
  weddingDate: string; // ISO date, e.g. "2026-12-12"
  tagline?: string;

  religion: Religion;
  openingGreeting?: string; // overrides the religion-based greeting
  invitationMessage: string;

  events: WeddingEvent[];

  venue: {
    name: string;
    address: string;
    city?: string; // short place name for the hero, e.g. "Lucknow"
    mapEmbedUrl?: string;
    mapsLink?: string;
  };

  rsvp: {
    deadline?: string;
    whatsappNumber: string;
    googleSheetWebhook?: string;
  };

  music: {
    src?: string;
    autoplayAfterOpen: boolean;
  };

  coverImage?: string;
  /** Looping muted hero video: a path (/client/video/x.mp4), or "built-in" for the card's own video. */
  coverVideo?: string;
  couplePhoto?: string;
  gallery?: string[];

  theme?: {
    primary?: string;
    accent?: string;
    background?: string;
  };
};

// Every card receives the whole config as its only prop.
export type CardProps = { config: ClientConfig };
