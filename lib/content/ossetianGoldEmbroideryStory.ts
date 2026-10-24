import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/course";
import { PICS, STORY_DIR } from "@/lib/content/ossetianGoldEmbroidery";

/**
 * Server-only: reads content/ossetian-gold-embroidery/story.<locale>.md (see lib/content/ossetianGoldEmbroidery.ts).
 * Each `## ` heading is a chapter ("Глава 01. Название" → label + title); the first is the prologue, the last the epilogue.
 * Marker lines become blocks. An unknown marker or picture stops the build, so a typo never reaches the site.
 */
export type Seg = { kind: "text"; md: string } | { kind: "block"; id: string; arg?: string } | { kind: "fact"; big: string; note: string };
export type Chapter = { key: string; label: string; title: string; cover: Seg | null; segs: Seg[] };

export const ACTIVITIES = ["barter", "stitch", "assemble", "motifs", "hat", "words", "dress"] as const;
export type ActivityId = (typeof ACTIVITIES)[number];

const MARK = /^\[\[([a-z]+)(?::([a-z0-9-]+))?\]\]$/;
/** `[[fact: 5 копеек | what the number means]]` — a figure set large. */
const FACT = /^\[\[fact:\s*([^|\]]+?)\s*\|\s*([\s\S]+?)\s*\]\]$/;

function check(file: string, id: string, arg?: string) {
  if (id === "scene" || id === "pic") {
    if (!arg || !PICS[arg]) throw new Error(`${file}: unknown picture [[${id}:${arg ?? ""}]] (add it to PICS)`);
    return;
  }
  if (!(ACTIVITIES as readonly string[]).includes(id) || arg) throw new Error(`${file}: unknown marker [[${id}${arg ? ":" + arg : ""}]]`);
}

export function loadStory(locale: Locale): Chapter[] {
  const file = path.join(process.cwd(), "content", STORY_DIR, `story.${locale}.md`);
  const raw = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const parts = raw.split(/\n(?=##\s)/).slice(1);
  return parts.map((part, i) => {
    const [headLine, ...rest] = part.split("\n");
    const heading = headLine.replace(/^##\s+/, "").trim();
    const dot = heading.indexOf(". ");
    const label = dot > 0 ? heading.slice(0, dot) : heading;
    const title = dot > 0 ? heading.slice(dot + 2) : "";
    const blocks = rest.join("\n").split(/\n\s*\n/).map((b) => b.trim()).filter((b) => b && !/^-{3,}$/.test(b));
    const segs: Seg[] = [];
    let buf: string[] = [];
    const flush = () => { if (buf.length) { segs.push({ kind: "text", md: buf.join("\n\n") }); buf = []; } };
    for (const b of blocks) {
      const f = b.match(FACT);
      if (f) { flush(); segs.push({ kind: "fact", big: f[1], note: f[2] }); continue; }
      const m = b.match(MARK);
      if (m) { check(file, m[1], m[2]); flush(); segs.push({ kind: "block", id: m[1], arg: m[2] }); }
      else if (b.startsWith("[[")) throw new Error(`${file}: malformed marker ${b.slice(0, 60)}`);
      else buf.push(b);
    }
    flush();
    const cover = segs[0]?.kind === "block" ? segs.shift()! : null;
    const key = i === 0 ? "prologue" : i === parts.length - 1 ? "epilogue" : `ch${String(i).padStart(2, "0")}`;
    return { key, label, title, cover, segs };
  });
}
