import type { ClientConfig } from "@/lib/types";
import { has } from "@/lib/config";

export type RsvpReply = {
  name: string;
  attending: boolean;
  guests: number;
  message?: string;
};

export function rsvpWhatsAppUrl(config: ClientConfig, r: RsvpReply): string {
  const lines = [
    `RSVP: ${config.groomName} & ${config.brideName}'s wedding`,
    `Name: ${r.name}`,
    r.attending
      ? `Attending: Yes (${r.guests} ${r.guests === 1 ? "guest" : "guests"})`
      : "Attending: No, sending our best wishes",
    has(r.message) && `Message: ${r.message}`,
  ].filter(Boolean);
  const number = config.rsvp.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/**
 * Opens WhatsApp with the pre-filled reply. Must run inside the submit handler
 * (a user gesture) or the popup gets blocked. Also logs to the Google Sheet
 * webhook when one is configured (fire-and-forget; WhatsApp is the source of truth).
 */
export function sendRsvp(config: ClientConfig, r: RsvpReply) {
  const hook = config.rsvp.googleSheetWebhook;
  if (has(hook)) {
    fetch(hook, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify({ ...r, submittedAt: new Date().toISOString() }),
    }).catch(() => {});
  }
  window.open(rsvpWhatsAppUrl(config, r), "_blank", "noopener");
}
