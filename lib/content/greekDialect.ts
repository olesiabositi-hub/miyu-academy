import type { Locale } from "@/lib/course";
import type { LessonBlock } from "@/lib/content/types";
import { GREEK_ART } from "@/lib/content/greekArt";

/**
 * Greek Mythology lessons were written before the Academy base and use their own Markdown habits.
 * The text is locked, so instead of editing it we read it into the base format here (nothing is reworded):
 *
 *   # 3. Title             → chapter head "Глава 3. Title" (+ the module picture for that section, if any)
 *   ## Title (chunk start) → chapter head without a number
 *   ### Label:  + text     → note "**Label:** text"
 *   # A short line         → stays: the base shows it as an accent line
 */

type Prose = Extract<LessonBlock, { type: "prose" }>;

/** Modules 1–4 have their own pictures; their visual stops are design briefs and are not shown. */
export const hasGreekArt = (moduleId: string) => moduleId in GREEK_ART;

/** First chunk: drop "# Модуль N", the title and the duration line (the module hero shows them); keep the rest. */
export function stripGreekIntro(chunk: string): string {
  const lines = chunk.split(/\r?\n/);
  const at = lines.findIndex((l) => /^\*\*(?:Время|Time):\*\*/.test(l));
  if (at < 0) return chunk;
  return lines.slice(at + 1).join("\n").trim();
}

/** "### Label:" followed by a paragraph → one note paragraph. A bold paragraph loses its own bold. */
function notes(md: string): string {
  return md.replace(/^###\s+([^\n]{2,60}?):\s*\n+\s*(?!#|\[|!)([^\n]+)/gm, (_m, label: string, text: string) => {
    const body = text.trim().replace(/^\*\*(.+)\*\*$/, "$1");
    return `**${label.trim()}:** ${body}`;
  });
}

export function greekProseBlocks(chunk: string, id: string, moduleId: string, locale: Locale): Prose[] {
  const lines = chunk.split(/\r?\n/);
  const first = lines.findIndex((l) => l.trim() !== "");
  const head = first >= 0 ? lines[first] : "";
  const numbered = head.match(/^#\s+(\d+)\.[ \t]+(.+?)\s*$/);
  const titled = !numbered && head.match(/^##\s+(?!\[)(.+?)\s*$/);
  if (!numbered && !titled) return [{ type: "prose", id, markdown: notes(chunk) }];

  const out: Prose[] = [];
  const body = notes(lines.slice(first + 1).join("\n").trim());
  if (numbered) {
    const n = Number(numbered[1]);
    out.push({ type: "prose", id, markdown: `## ${locale === "ru" ? "Глава" : "Chapter"} ${n}. ${numbered[2]}` });
    const art = GREEK_ART[moduleId]?.sections[n];
    if (art) out.push({ type: "prose", id: `${id}-art`, markdown: `![${art.alt[locale]}](${art.src})` });
  } else if (titled) {
    out.push({ type: "prose", id, markdown: `## ${titled[1]}` });
  }
  if (body) out.push({ type: "prose", id: `${id}-text`, markdown: body });
  return out;
}
