import type { Locale } from "@/lib/course";

/** One-line teaser per module, used on the course page and as the "next module" fallback. */
export const MODULE_TEASERS: Record<string, Record<Locale, string>> = {
  "module-01": {
    ru: "От Хаоса и Геи до титанов и поколения Зевса.",
    en: "From Chaos and Gaia to the Titans and the generation of Zeus.",
  },
  "module-02": {
    ru: "Кто есть кто среди богов — и как быстро их различать.",
    en: "Who is who among the gods — and how to recognise them quickly.",
  },
  "module-03": {
    ru: "Монстры, чудовища и существа, которых лучше узнать заранее.",
    en: "Monsters, creatures and beings worth recognising before you meet them.",
  },
  "module-04": {
    ru: "Герои, выборы, слабости и истории, которые пережили века.",
    en: "Heroes, choices, weaknesses and stories that survived for centuries.",
  },
  "module-05": {
    ru: "Почему мифологические сюжеты до сих пор живут в нашей речи.",
    en: "Why mythological stories still live inside everyday language.",
  },
  "module-06": {
    ru: "Троя: война, яблоко, Ахилл и самый известный конь в истории.",
    en: "Troy: war, an apple, Achilles and the most famous horse in history.",
  },
  "module-07": {
    ru: "Одиссей, сирены, Цирцея, циклоп — и очень долгий путь домой.",
    en: "Odysseus, Sirens, Circe, a Cyclops — and one very long journey home.",
  },
  "module-08": {
    ru: "Nike, Apollo, Mentor, Trojan и другие мифы вокруг нас.",
    en: "Nike, Apollo, Mentor, Trojan and other myths hidden in plain sight.",
  },
};
