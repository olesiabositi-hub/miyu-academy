import fs from "node:fs";
import path from "node:path";
import type { Locale } from "@/lib/course";
import { STORY_DIR } from "@/lib/content/ossetianHeadscarf";

/** Server-only: reads content/ossetian-headscarf/story.<locale>.md (see lib/content/ossetianHeadscarf.ts). */
export type Seg = { kind: "text"; md: string } | { kind: "block"; id: string; arg?: string };
export type Chapter = { key: string; label: string; title: string; cover: Seg | null; segs: Seg[] };

const MARK = /^\[\[([a-z]+)(?::([a-z0-9-]+))?\]\]$/;

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
      const m = b.match(MARK);
      if (m) { flush(); segs.push({ kind: "block", id: m[1], arg: m[2] }); }
      else buf.push(b);
    }
    flush();
    const cover = segs[0]?.kind === "block" ? segs.shift()! : null;
    const key = i === 0 ? "prologue" : i === parts.length - 1 ? "epilogue" : `ch${String(i).padStart(2, "0")}`;
    return { key, label, title, cover, segs };
  });
}

