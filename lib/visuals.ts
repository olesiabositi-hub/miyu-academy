import type { Locale } from "@/lib/course";

/**
 * Approved hero art per module for modules that use the shared ModuleHero (5–8).
 * Modules 1–4 keep their own editorial heroes inside their lesson components.
 * `pos` is the CSS object-position focal point, so heads are never cropped out.
 * Files live in /public/visuals/module-0X/ as 836 px and 1672 px WebP.
 */
export type ModuleHeroArt = {
  src: string;
  src836: string;
  width: number;
  height: number;
  pos: string;
  alt: Record<Locale, string>;
};

function art(dir: string, name: string, width: number, height: number, pos: string, alt: Record<Locale, string>): ModuleHeroArt {
  return {
    src: `/visuals/${dir}/${name}-1672.webp`,
    src836: `/visuals/${dir}/${name}-836.webp`,
    width,
    height,
    pos,
    alt,
  };
}

export const MODULE_HERO_ART: Record<string, ModuleHeroArt> = {
  "module-05": art("module-05", "01-HERO-six-myths", 1672, 1254, "50% 40%", {
    ru: "Шесть мифов в одной сцене: Прометей с огнём, Пандора с сосудом, Сизиф с камнем, Мидас с золотыми руками, Нарцисс у воды и Атлант с небесным сводом.",
    en: "Six myths in one scene: Prometheus with fire, Pandora with her jar, Sisyphus with his boulder, Midas with golden hands, Narcissus by the water and Atlas with the celestial sphere.",
  }),
  "module-06": art("module-06", "01-HERO-troy-war", 1672, 942, "50% 45%", {
    ru: "Два воина лицом к лицу перед стенами Трои; вдали виден Троянский конь.",
    en: "Two warriors face to face before the walls of Troy, with the Trojan Horse in the distance.",
  }),
  "module-07": art("module-07", "01-HERO-odysseus-way-home", 1672, 942, "30% 40%", {
    ru: "Одиссей на носу корабля смотрит на море и далёкий остров; на горизонте собирается буря.",
    en: "Odysseus at the prow of his ship, looking out over the sea toward a distant island as a storm gathers on the horizon.",
  }),
  "module-08": art("module-08", "01-HERO-mythology-around-us", 1672, 942, "65% 50%", {
    ru: "Современная женщина с ноутбуком на мраморной террасе рядом со статуей Афины; в небе проступают созвездия.",
    en: "A modern woman with a laptop on a marble terrace beside a statue of Athena, constellations appearing in the sky.",
  }),
};

export function moduleHeroArt(moduleId: string): ModuleHeroArt | null {
  return MODULE_HERO_ART[moduleId] ?? null;
}

/**
 * Story illustrations attached to Visual Stops of modules 5–8, keyed by the asset id from
 * content/greek-mythology/visual-assets.json (gm-m05-vs02 …). A Visual Stop without an entry
 * here renders as a diagram only. Portrait art is laid out beside the diagram.
 */
export type StopArt = {
  src: string;
  srcSmall: string;
  width: number;
  height: number;
  pos: string;
  alt: Record<Locale, string>;
};

function stop(dir: string, stem: string, large: number, small: number, width: number, height: number, pos: string, alt: Record<Locale, string>): StopArt {
  return {
    src: `/visuals/${dir}/${stem}-${large}.webp`,
    srcSmall: `/visuals/${dir}/${stem}-${small}.webp`,
    width,
    height,
    pos,
    alt,
  };
}

export const VISUAL_STOP_ART: Record<string, StopArt> = {
  // Module 5
  "gm-m05-vs02": stop("module-05", "vs02-prometheus", 1280, 640, 1280, 720, "50% 40%", {
    ru: "Прометей приносит людям огонь.",
    en: "Prometheus brings fire to humanity.",
  }),
  "gm-m05-vs03": stop("module-05", "vs03-pandora", 1280, 640, 1280, 720, "40% 45%", {
    ru: "Пандора открывает большой сосуд, и из него выходят беды.",
    en: "Pandora opens the large jar and troubles escape.",
  }),
  "gm-m05-vs04": stop("module-05", "vs04-sisyphus", 1280, 640, 1280, 720, "50% 50%", {
    ru: "Сизиф толкает камень вверх по склону.",
    en: "Sisyphus pushes the boulder uphill.",
  }),
  "gm-m05-vs05": stop("module-05", "vs05-midas", 1280, 640, 1280, 720, "50% 40%", {
    ru: "Царь Мидас и его золотое прикосновение.",
    en: "King Midas and the golden touch.",
  }),
  "gm-m05-vs06": stop("module-05", "vs06-narcissus", 1280, 640, 1280, 720, "50% 50%", {
    ru: "Нарцисс смотрит на своё отражение в воде.",
    en: "Narcissus gazes at his own reflection in the water.",
  }),
  "gm-m05-vs07": stop("module-05", "vs07-atlas", 1280, 640, 1280, 720, "50% 40%", {
    ru: "Атлас держит небесный свод.",
    en: "Atlas holding up the celestial sphere.",
  }),
  // Module 6
  "gm-m06-vs02": stop("module-06", "vs02-judgement", 1280, 640, 1280, 960, "50% 40%", {
    ru: "Суд Париса: три богини и золотое яблоко.",
    en: "The Judgement of Paris: three goddesses and the golden apple.",
  }),
  "gm-m06-vs03": stop("module-06", "vs03-helen-paris", 1280, 640, 1280, 960, "50% 40%", {
    ru: "Елена и Парис отправляются в Трою.",
    en: "Helen and Paris on their way to Troy.",
  }),
  "gm-m06-vs04": stop("module-06", "vs04-trojan-horse-gates", 1280, 640, 1280, 720, "35% 45%", {
    ru: "Троянский конь у ворот Трои.",
    en: "The Trojan Horse at the gates of Troy.",
  }),
  "gm-m06-vs05": stop("module-06", "vs05-achilles-patroclus", 1280, 640, 1280, 960, "50% 35%", {
    ru: "Ахиллес и Патрокл: эпизод с доспехами.",
    en: "Achilles and Patroclus: the armour episode.",
  }),
  "gm-m06-vs06": stop("module-06", "vs06-achilles-hector-priam", 1280, 640, 1280, 720, "50% 45%", {
    ru: "После боя: Приам приходит к Ахиллесу за телом сына.",
    en: "The aftermath: Priam comes to Achilles for his son's body.",
  }),
  "gm-m06-vs07": stop("module-06", "vs07-cassandra", 960, 480, 960, 1200, "50% 15%", {
    ru: "Кассандра предупреждает Трою, но её не слушают.",
    en: "Cassandra warns Troy, but no one listens.",
  }),
  "gm-m06-vs09": stop("module-06", "vs09-trojan-cyber", 1280, 640, 1280, 960, "50% 50%", {
    ru: "Троянский конь и современная скрытая цифровая угроза.",
    en: "The Trojan Horse beside a modern hidden digital threat.",
  }),
  // Module 7
  "gm-m07-vs02": stop("module-07", "vs02-polyphemus", 960, 480, 960, 1200, "50% 25%", {
    ru: "Побег из пещеры Полифема под брюхом овец.",
    en: "Escaping Polyphemus's cave beneath the sheep.",
  }),
  "gm-m07-vs04": stop("module-07", "vs04-circe", 1280, 640, 1280, 960, "50% 40%", {
    ru: "Цирцея, её волшебная чаша и превращённые спутники.",
    en: "Circe, her magic cup and the transformed companions.",
  }),
  "gm-m07-vs05": stop("module-07", "vs05-sirens", 1280, 640, 1280, 720, "50% 45%", {
    ru: "Одиссей, привязанный к мачте, проплывает мимо сирен.",
    en: "Odysseus bound to the mast as the ship sails past the Sirens.",
  }),
  "gm-m07-vs06": stop("module-07", "vs06-scylla-charybdis", 1280, 640, 1280, 720, "50% 50%", {
    ru: "Корабль между Сциллой и Харибдой.",
    en: "The ship between Scylla and Charybdis.",
  }),
  "gm-m07-vs08": stop("module-07", "vs08-calypso", 1280, 640, 1280, 960, "50% 40%", {
    ru: "Калипсо на своём прекрасном острове.",
    en: "Calypso on her beautiful island.",
  }),
  "gm-m07-vs09": stop("module-07", "vs09-penelope", 1280, 640, 1280, 960, "50% 40%", {
    ru: "Пенелопа ткёт днём и распускает ночью.",
    en: "Penelope weaving by day and unweaving by night.",
  }),
  "gm-m07-vs11": stop("module-07", "vs11-homecoming", 1280, 640, 1280, 720, "50% 40%", {
    ru: "Одиссей и Пенелопа снова вместе.",
    en: "Odysseus and Penelope reunited.",
  }),
  // Module 8
  "gm-m08-vs02": stop("module-08", "vs02-nike", 1280, 640, 1280, 960, "50% 25%", {
    ru: "Ника, богиня победы, и бренд, который носит её имя.",
    en: "Nike, goddess of victory, and the brand that carries her name.",
  }),
  "gm-m08-vs03": stop("module-08", "vs03-modern-city", 1280, 640, 1280, 960, "50% 50%", {
    ru: "Обычная прогулка по современному городу, полная мифов.",
    en: "An ordinary walk through a modern city full of myths.",
  }),
  "gm-m08-vs05": stop("module-08", "vs05-tech-stack", 1280, 640, 1280, 960, "50% 45%", {
    ru: "Мифологические имена в технологическом стеке.",
    en: "Mythological names in the tech stack.",
  }),
  "gm-m08-vs07": stop("module-08", "vs07-cyprus", 1280, 640, 1280, 960, "50% 50%", {
    ru: "Мифологические места на Кипре.",
    en: "Mythological places in Cyprus.",
  }),
  "gm-m08-vs08": stop("module-08", "vs08-medea-batumi", 1280, 640, 1280, 960, "50% 30%", {
    ru: "Статуя Медеи с Золотым руном на площади Европы в Батуми.",
    en: "The statue of Medea with the Golden Fleece on Europe Square in Batumi.",
  }),
  "gm-m08-vs09": stop("module-08", "vs09-constellations", 1280, 640, 1280, 960, "50% 40%", {
    ru: "Один миф, раскинувшийся по ночному небу созвездиями.",
    en: "One myth spread across the night sky as constellations.",
  }),
};

export function stopArt(assetId: string): StopArt | null {
  return VISUAL_STOP_ART[assetId] ?? null;
}
