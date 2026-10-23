import type { Locale } from "@/lib/course";
import type { ModuleHeroArt } from "@/lib/visuals";

/**
 * Pictures of Greek Mythology modules 1–4 (they used to live inside hand-made lesson components).
 * `hero`: top of the lesson. `sections`: the picture set beside the text of that numbered section ("# N. …").
 * Modules 5–8 take their hero from lib/visuals.ts and their pictures from the visual stops.
 */
export type SectionArt = { src: string; width: number; height: number; alt: Record<Locale, string> };

export const GREEK_ART: Record<string, { hero: ModuleHeroArt; sections: Record<number, SectionArt> }> = {
  "module-01": {
    hero: { src: "/visuals/module-01/01-HERO-gaia-birth-of-order-1672.webp", src836: "/visuals/module-01/01-HERO-gaia-birth-of-order-836.webp", width: 1672, height: 941, pos: "50% 45%", alt: { ru: "Гея — живая Земля в первом свете первозданного мира.", en: "Gaia emerging as living Earth in the first light of the primordial world." } },
    sections: {
      2: { src: "/visuals/module-01/08-PORTRAIT-gaia-editorial.avif", width: 1122, height: 1402, alt: { ru: "Гея — Земля как живое божественное существо.", en: "Gaia — Earth as a living divine being." } },
      3: { src: "/visuals/module-01/02-MIDDLE-gaia-primordial-world-1672.webp", width: 1672, height: 941, alt: { ru: "Гея и первозданный мир до установления олимпийского порядка.", en: "Gaia and the primordial world before the Olympian order." } },
      4: { src: "/visuals/module-01/06-LANDSCAPE-wide-titans-cinematic-1916.avif", width: 1916, height: 821, alt: { ru: "Широкий кинематографичный пейзаж с Титанами над морским побережьем.", en: "A wide cinematic landscape with the Titans above the sea coast." } },
      5: { src: "/visuals/module-01/03-DETAIL-chaos-titans-1254.webp", width: 1254, height: 1254, alt: { ru: "Первозданный мир на переходе от Хаоса к древнему поколению богов.", en: "The primordial world in the transition from Chaos toward the older generation of gods." } },
      6: { src: "/visuals/module-01/05-DETAIL-titans-1254.webp", width: 1254, height: 1254, alt: { ru: "Титаны — старшее поколение божеств.", en: "The Titans — the older generation of deities." } },
      12: { src: "/visuals/module-01/07-PORTRAIT-hades-editorial.avif", width: 1122, height: 1402, alt: { ru: "Аид как спокойный и достойный правитель подземного мира.", en: "Hades as a calm and dignified ruler of the underworld." } },
    },
  },
  "module-02": {
    hero: { src: "/visuals/module-02/01-HERO-olympus-pantheon.webp", src836: "/visuals/module-02/01-HERO-olympus-pantheon.webp", width: 1672, height: 941, pos: "50% 45%", alt: { ru: "Олимпийский пантеон над Средиземноморьем.", en: "The Olympian pantheon above the Mediterranean." } },
    sections: {
      1: { src: "/visuals/module-02/02-OLYMPUS-mountain-divine-home.webp", width: 1672, height: 941, alt: { ru: "Гора Олимп как мифологический дом богов.", en: "Mount Olympus as the mythological home of the gods." } },
      2: { src: "/visuals/module-02/03-ZEUS-HERA-rulers.webp", width: 1672, height: 941, alt: { ru: "Зевс и Гера — правители олимпийского мира.", en: "Zeus and Hera — rulers of the Olympian world." } },
      7: { src: "/visuals/module-02/04-ATHENA-ARES-contrast.webp", width: 1672, height: 941, alt: { ru: "Афина и Арес как две разные стороны войны.", en: "Athena and Ares as two different faces of war." } },
      10: { src: "/visuals/module-02/05-APHRODITE-cyprus.webp", width: 1672, height: 941, alt: { ru: "Афродита и морской пейзаж Кипра.", en: "Aphrodite and the seascape of Cyprus." } },
      13: { src: "/visuals/module-02/06-APOLLO-ARTEMIS-twins.webp", width: 1672, height: 941, alt: { ru: "Аполлон и Артемида — близнецы.", en: "Apollo and Artemis — the twins." } },
      17: { src: "/visuals/module-02/07-HERMES-messenger.webp", width: 1122, height: 1402, alt: { ru: "Гермес — вестник богов и бог движения.", en: "Hermes — messenger of the gods and god of movement." } },
      20: { src: "/visuals/module-02/08-NIKE-victory.webp", width: 1122, height: 1402, alt: { ru: "Ника — олицетворение победы.", en: "Nike — the personification of victory." } },
    },
  },
  "module-03": {
    hero: { src: "/visuals/module-03/01-HERO-mythic-bestiary.webp", src836: "/visuals/module-03/01-HERO-mythic-bestiary.webp", width: 1672, height: 941, pos: "50% 45%", alt: { ru: "Мифологический бестиарий.", en: "A mythological bestiary." } },
    sections: {
      1: { src: "/visuals/module-03/02-BESTIARY-six-creatures-grid.webp", width: 1448, height: 1086, alt: { ru: "Шесть мифологических существ.", en: "Six mythological creatures." } },
      2: { src: "/visuals/module-03/03-CERBERUS-underworld-guardian.webp", width: 1672, height: 941, alt: { ru: "Цербер у входа в подземный мир.", en: "Cerberus at the entrance to the Underworld." } },
      8: { src: "/visuals/module-03/04-MINOTAUR-labyrinth.webp", width: 1672, height: 941, alt: { ru: "Минотавр в Лабиринте.", en: "The Minotaur in the Labyrinth." } },
      10: { src: "/visuals/module-03/05-SIRENS-modern-vs-ancient.webp", width: 1672, height: 941, alt: { ru: "Современный русалкоподобный образ и античная сирена-женщина-птица.", en: "A modern mermaid-like Siren and an ancient bird-woman Siren." } },
      14: { src: "/visuals/module-03/06-HYDRA-many-headed-problem.webp", width: 1672, height: 941, alt: { ru: "Лернейская гидра.", en: "The Lernaean Hydra." } },
      18: { src: "/visuals/module-03/07-POLYPHEMUS-cyclops.webp", width: 1122, height: 1402, alt: { ru: "Полифем — одноглазый циклоп-пастух.", en: "Polyphemus — the one-eyed Cyclops shepherd." } },
      20: { src: "/visuals/module-03/08-BESTIARY-closing-grid.webp", width: 1448, height: 1086, alt: { ru: "Шесть существ бестиария.", en: "The six creatures in the bestiary." } },
    },
  },
  "module-04": {
    hero: { src: "/visuals/module-04/01-HERO-heroes-world.webp", src836: "/visuals/module-04/01-HERO-heroes-world.webp", width: 1536, height: 1024, pos: "50% 45%", alt: { ru: "Мир героев древнегреческой мифологии.", en: "The world of heroes in Greek mythology." } },
    sections: {
      1: { src: "/visuals/module-04/02-HEROES-six-grid.webp", width: 1536, height: 1024, alt: { ru: "Шесть героев.", en: "Six heroes." } },
      2: { src: "/visuals/module-04/03-PERSEUS-medusa-reflection.webp", width: 1672, height: 941, alt: { ru: "Персей смотрит на отражение Медузы в щите.", en: "Perseus looks at Medusa through her reflection in the shield." } },
      5: { src: "/visuals/module-04/04-THESEUS-ariadne-thread.webp", width: 1536, height: 1024, alt: { ru: "Ариадна передаёт Тесею нить у Лабиринта.", en: "Ariadne gives Theseus the thread by the Labyrinth." } },
      8: { src: "/visuals/module-04/05-HERACLES-hydra-cerberus.webp", width: 1942, height: 809, alt: { ru: "Геракл между Гидрой и Цербером.", en: "Heracles between the Hydra and Cerberus." } },
      12: { src: "/visuals/module-04/06-JASON-medea-golden-fleece.webp", width: 1536, height: 1024, alt: { ru: "Ясон, Медея и Золотое руно.", en: "Jason, Medea and the Golden Fleece." } },
      14: { src: "/visuals/module-04/08-BATUMI-medea-square-local.webp", width: 2048, height: 1036, alt: { ru: "Статуя Медеи на площади Европы в Батуми.", en: "The Medea statue in Europe Square, Batumi." } },
      18: { src: "/visuals/module-04/07-ACHILLES-ODYSSEUS-split.webp", width: 1672, height: 941, alt: { ru: "Ахиллес и Одиссей.", en: "Achilles and Odysseus." } },
    },
  },
};
