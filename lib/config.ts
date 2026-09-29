import type { ClientConfig } from "./types";

/**
 * Section-visibility convention: wrap every section in `has(value) && ...`.
 * Treats undefined, null, "" (incl. whitespace) and [] as "left empty" -> section hidden.
 */
export function has<T>(value: T | null | undefined): value is NonNullable<T> {
  if (value == null) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

const GREETINGS: Record<ClientConfig["religion"], string> = {
  muslim: "Bismillahir Rahmanir Raheem",
  hindu: "Shree Ganeshaya Namah",
  christian: "Two hearts, one love, blessed by God",
  general: "Together with their families",
};

/** Opening greeting: the client's override if given, else the religion default. */
export function greeting(config: ClientConfig): string {
  return has(config.openingGreeting) ? config.openingGreeting : GREETINGS[config.religion];
}

/** config.monogram if set, else first letters of groomName & brideName: Salim & Neha → "S&N". */
export function monogram(config: ClientConfig): string {
  if (has(config.monogram)) return config.monogram;
  const first = (name: string) => (Array.from(name.trim())[0] ?? "").toUpperCase();
  return `${first(config.groomName)}&${first(config.brideName)}`;
}

/** Parses "2026-12-12" as LOCAL midnight (plain `new Date()` would use UTC and can shift the day). */
export function toDate(iso: string): Date {
  return new Date(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T00:00:00` : iso);
}

/** "Saturday 12 December 2026". Non-date text (e.g. a free-form deadline) is returned as-is. */
export function formatDate(iso: string): string {
  const d = toDate(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export type IconKey = "ring" | "henna" | "dinner" | "music" | "moon" | "default";
const ICON_ALIASES: Record<string, IconKey> = {
  ring: "ring", nikah: "ring", engagement: "ring",
  henna: "henna", mehndi: "henna", haldi: "henna",
  dinner: "dinner", walima: "dinner", reception: "dinner", food: "dinner",
  music: "music", sangeet: "music", dholki: "music",
  moon: "moon", chand: "moon",
};

/** Normalises an event's `icon`: emoji → shown as-is; known name → icon key; else "default". Each card draws its own glyphs. */
export function eventIcon(icon?: string): { emoji: string } | { key: IconKey } {
  const raw = icon?.trim() ?? "";
  if (/[^\x00-\x7F]/.test(raw)) return { emoji: raw };
  return { key: ICON_ALIASES[raw.toLowerCase()] ?? "default" };
}

/** Day / Month / Year pieces of weddingDate, or null if it isn't a valid date. */
export function dateParts(iso: string) {
  const d = toDate(iso);
  if (isNaN(d.getTime())) return null;
  return {
    day: String(d.getDate()),
    month: d.toLocaleDateString("en-GB", { month: "long" }),
    year: String(d.getFullYear()),
  };
}
