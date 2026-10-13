import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/course";

/**
 * Reads an approved course-page text (content/<course>/landing/landing.<locale>.md) and splits it into
 * sections. The wording is never touched here; layout code only decides where each block goes.
 */
export type LandingSection = { heading: string; blocks: string[]; subs: { heading: string; blocks: string[] }[] };
export type LandingDoc = { title: string; hero: string[]; sections: LandingSection[] };

const blocksOf = (text: string) => text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

export function loadLanding(contentDir: string, locale: Locale): LandingDoc {
  const file = path.join(process.cwd(), "content", contentDir, "landing", `landing.${locale}.md`);
  const raw = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const chunks = raw.split(/\n-{3,}\n/).map((c) => c.trim()).filter(Boolean);
  const [first, ...rest] = chunks;
  const title = (first.match(/^#\s+(.+)$/m)?.[1] ?? "").trim();
  const hero = blocksOf(first.replace(/^#\s+.+$/m, ""));
  const sections = rest.map((chunk) => {
    const [head, ...body] = chunk.split(/\n(?=###\s)/);
    const heading = (head.match(/^##\s+(.+)$/m)?.[1] ?? "").trim();
    const blocks = blocksOf(head.replace(/^##\s+.+$/m, ""));
    const subs = body.map((b) => {
      const h = (b.match(/^###\s+(.+)$/m)?.[1] ?? "").trim();
      return { heading: h, blocks: blocksOf(b.replace(/^###\s+.+$/m, "")) };
    });
    return { heading, blocks, subs };
  });
  return { title, hero, sections };
}

export const isBoldLine = (b: string) => /^\*\*[^*].*\*\*$/.test(b) && !b.startsWith("**[");
export const isItalicLine = (b: string) => /^\*[^*].*[^*]\*$/.test(b);
export const plain = (b: string) => b.replace(/^\*\*(.+)\*\*$/, "$1").replace(/^\*(.+)\*$/, "$1");

/** "**Title**" + paragraph(s) pairs. `bodyBlocks` limits how many blocks the last item keeps. */
export function groupBold(blocks: string[], lastBodyBlocks = 1) {
  const intro: string[] = [];
  const items: { title: string; body: string[] }[] = [];
  const outro: string[] = [];
  for (const b of blocks) {
    if (isBoldLine(b)) items.push({ title: plain(b), body: [] });
    else if (!items.length) intro.push(b);
    else items[items.length - 1].body.push(b);
  }
  const last = items[items.length - 1];
  if (last) {
    const extra = last.body.splice(lastBodyBlocks);
    outro.push(...extra);
  }
  return { intro, items, outro };
}
