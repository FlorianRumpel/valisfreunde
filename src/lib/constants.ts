export const questions = {
  pq0: {
    text: "Wie würdest du dich in einem Satz beschreiben?",
    description: "Über mich:",
  },
  pq1: { text: "Was ist dein Lieblingsessen?", description: "Lieblingsessen:" },
  pq2: {
    text: "Hast du ein verborgenes Talent?",
    description: "Verborgenes Talent:",
  },
  pq3: {
    text: "Was machst du am liebsten in deiner Freizeit?",
    description: "Freizeitaktivität:",
  },
  vq0: { text: "Wie würdest du Vali beschreiben?", description: "Über Vali:" },
  vq1: {
    text: "Was schätzt du am meisten an Vali?",
    description: "Was ich an Vali schätze:",
  },
  vq2: {
    text: "Hast du eine lustige Erinnerung mit Vali?",
    description: "Lustige Erinnerung mit Vali:",
  },
  vq3: {
    text: "Gibt es etwas, das du Vali schon immer mal sagen wolltest?",
    description: "Was ich Vali schon immer mal sagen wollte:",
  },
  vq4: {
    text: "Was wünschst du Vali für die Zukunft?",
    description: "Wünsche für Valis Zukunft:",
  },
};

export const strikeThroughLabels = [
  "Schokolade",
  "Regen",
  "Montage",
  "Katzen",
  "Hunde",
  "Schule",
  "Kaffee",
  "Horrorfilme",
  "Shopping",
  "Frühaufstehen",
  "Partys",
  "Sport",
  "Sushi",
  "Winterkälte",
  "Achterbahnen",
  "Stille",
  "Abenteuer",
  "Kuscheln",
  "Chillen",
  "Chaos",
];

export function questionKeys() {
  return Object.keys(questions);
}

export const defaultSliderValue = 7;

export const sliderKeys = ["chaos_level", "mood", "creativity"] as const;
export type RatingKey = (typeof sliderKeys)[number];
export type SliderItem = { enabled?: boolean; value?: number };

export const emojis: Record<RatingKey, String[]> = {
  chaos_level: [],
  creativity: [],
  mood: ["Sehr gut 😁", "Gut 🤪", "Könnte besser sein😐", "Naja 😒"],
};

export type Questions = typeof questions;
