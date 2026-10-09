/**
 * Helpers for the end-of-module block (completion text + "what is next").
 * They only re-arrange the master Markdown for display; no wording is changed.
 */
export type OutroText = { heading: string; body: string };

const COMPLETE_HEADING = /^#\s+(?:Module completed|Модуль завершён)\s*$/i;

/** Completion blocks (module 8 has two) merged into one heading + body. */
export function parseCompletion(markdowns: string[]): OutroText {
  const parts = markdowns.map((md) =>
    md.split(/\r?\n/).filter((line, i) => !(i === 0 && COMPLETE_HEADING.test(line.trim()))).join("\n").trim(),
  ).filter(Boolean);
  const joined = parts.join("\n\n");
  const lines = joined.split(/\r?\n/);
  const idx = lines.findIndex((l) => l.trim());
  if (idx < 0) return { heading: "", body: "" };
  const first = lines[idx].trim();
  const usable = !/[:：]$/.test(first) && first.length <= 100 && !/^[>#*\-]/.test(first);
  if (!usable) return { heading: "", body: joined };
  return { heading: first, body: lines.filter((_, i) => i !== idx).join("\n").trim() };
}

/** "# Next / ## Module 4. Heroes / text…" → heading "Module 4. Heroes" + text. */
export function parseNext(markdown: string): OutroText {
  const lines = markdown.split(/\r?\n/);
  const first = lines.findIndex((l) => /^#\s+/.test(l));
  const second = lines.findIndex((l, i) => i > first && /^##\s+/.test(l));
  if (second < 0) {
    return { heading: "", body: lines.filter((_, i) => i !== first).join("\n").trim() };
  }
  return {
    heading: lines[second].replace(/^##\s+/, "").trim(),
    body: lines.filter((_, i) => i !== first && i !== second).join("\n").trim(),
  };
}

/** Single line breaks become visible line breaks, as in the original lesson layouts. */
export function displayify(markdown: string): string {
  return markdown.replace(/([^\n])\n(?=[^\n])/g, "$1  \n");
}

export type FlowPart = { type: "md"; text: string } | { type: "flow"; items: string[] };

const ARROW_LINE = /^(?:↓|→|⬇️?|➜)$/u;

/**
 * Finds chains like "gods / ↓ / monsters / ↓ / heroes" (no blank lines between) and returns them
 * as a flow so they can be drawn as chips instead of stacked arrow lines.
 */
export function splitFlow(markdown: string): FlowPart[] {
  const lines = markdown.split(/\r?\n/);
  const parts: FlowPart[] = [];
  let buffer: string[] = [];
  const flush = () => {
    const text = buffer.join("\n").trim();
    if (text) parts.push({ type: "md", text });
    buffer = [];
  };
  let i = 0;
  while (i < lines.length) {
    const item = lines[i].replace(/\*/g, "").trim();
    const isItem = item !== "" && !ARROW_LINE.test(item) && item.length <= 40 && !/^[>#]/.test(item);
    if (isItem && i + 1 < lines.length && ARROW_LINE.test(lines[i + 1].trim())) {
      const items = [item];
      let j = i + 1;
      while (j + 1 < lines.length && ARROW_LINE.test(lines[j].trim())) {
        const nextItem = lines[j + 1].replace(/\*/g, "").trim();
        if (nextItem === "" || ARROW_LINE.test(nextItem) || nextItem.length > 40 || /^[>#]/.test(nextItem)) break;
        items.push(nextItem);
        j += 2;
      }
      if (items.length >= 3) {
        flush();
        parts.push({ type: "flow", items });
        i = j;
        continue;
      }
    }
    buffer.push(lines[i]);
    i++;
  }
  flush();
  return parts;
}
