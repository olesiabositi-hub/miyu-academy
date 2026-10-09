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
