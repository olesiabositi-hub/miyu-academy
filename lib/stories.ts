import type { Locale } from "@/lib/course";

/**
 * Visual stories: standalone illustrated pages (no modules, no tests, no progress).
 * They are listed on the academy home next to the courses and in the sitemap.
 */
export type StoryDefinition = {
  id: string;
  slug: string;
  title: Record<Locale, string>;
  /** Original name shown with the title (kept in the original script in both languages). */
  original?: string;
  blurb: Record<Locale, string>;
  facts: Record<Locale, [string, string][]>;
  card: { src: string; src960: string; width: number; height: number };
};

export const STORIES: readonly StoryDefinition[] = [
  {
    id: "ossetian-headscarf",
    slug: "ossetian-headscarf",
    title: { ru: "Осетинский шёлковый платок", en: "The Ossetian Silk Headscarf" },
    original: "Цыллæ хыз",
    blurb: {
      ru: "История, сплетённая из шёлка: как из тонкой нити появляется ажурный платок, кто его плёл и почему ремесло продолжает жить.",
      en: "A story woven from silk: how fine thread becomes an open-net headscarf, who made it, and why the craft lives on.",
    },
    facts: {
      ru: [["8", "глав"], ["RU / EN", "два языка"], ["✓", "без тестов"]],
      en: [["8", "chapters"], ["RU / EN", "two languages"], ["✓", "no tests"]],
    },
    card: { src: "/visuals/ossetian-headscarf/golden-hour-1600.webp", src960: "/visuals/ossetian-headscarf/golden-hour-800.webp", width: 1600, height: 900 },
  },
];

export function storyPath(locale: Locale, story: StoryDefinition): string {
  return `/${locale}/stories/${story.slug}`;
}
