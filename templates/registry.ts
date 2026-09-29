// The ONLY place a template ID maps to a card. New card = new folder + one line here.
//
// Values are folder names, not imports: next.config.ts aliases "@selected-card" to the
// folder of clientConfig.template at build time, so unselected cards never enter the
// build (Rule 3). Importing the cards here — even lazily — would bundle all of them.
export const registry = {
  A: "cardA",
  B: "cardB",
  C: "cardC",
  D: "cardD",
  E: "cardE",
} as const;

export type TemplateId = keyof typeof registry;
