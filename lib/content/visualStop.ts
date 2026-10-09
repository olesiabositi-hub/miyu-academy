/**
 * Turns the Markdown of a Visual Stop (modules 5–8) into a small list of presentation nodes.
 *
 * The source text is written as a storyboard: headings, paragraphs, lone arrows between steps,
 * quotes for captions. Authoring instructions that were written for the designer
 * ("Caption:", "Diagram:", "On the screen:" …) are recognised and dropped so they never reach
 * a learner. All learner-facing words come straight from the master Markdown, unchanged.
 */
export type StopNode =
  | { kind: "title"; text: string }
  | { kind: "subtitle"; text: string }
  | { kind: "statement"; text: string }
  | { kind: "label"; text: string }
  | { kind: "card"; md: string; list: boolean }
  | { kind: "arrow"; glyph: string }
  | { kind: "rule" }
  | { kind: "quote"; md: string; caption: boolean };

// Single-line paragraphs ending with ":" that only instruct the designer.
const INSTRUCTION_LABELS = [
  // RU
  "схема","крупно","очень крупно","под ним","пять карточек","простая анимационная схема для сайта",
  "на экране","на экране без объяснений","без объяснений","рядом пять простых иконок","и рядом",
  "и вопрос","и маленький вопрос","вопрос","только",
  // EN
  "diagram","large","very large","below","simple animation idea for the site","on the screen",
  "on the screen, with no explanation","on screen","without explanations","next to them, five simple icons",
  "and next to it","and the question","and one small question","question","only",
];
const CAPTION_LABELS = ["подпись","caption"];

// Whole paragraphs that only describe a photo layout for the designer.
const INSTRUCTION_SENTENCES = [
  /^крупная фотография/i,
  /^без длинной подписи/i,
  /^a large photo/i,
  /^no long caption/i,
];

const ARROW = /^(?:[↓↑→←↗↘↙↖↻↺⬇⬆]️?|↩️?|\+|\?)+$/u;

function plain(text: string): string {
  return text.replace(/\*/g, "").trim();
}

export function parseVisualStop(markdown: string): StopNode[] {
  const body = markdown
    .split(/\r?\n/)
    .filter((line, i) => !(i === 0 && /^##\s+\[/.test(line.trim())))
    .join("\n");
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  const nodes: StopNode[] = [];
  let hasTitle = false;
  let captionNext = false;

  for (const raw of paragraphs) {
    const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;
    const first = lines[0];

    const heading = first.match(/^(#{1,6})\s+(.+)$/);
    if (heading && lines.length === 1) {
      const level = heading[1].length;
      const text = plain(heading[2]);
      if (level === 1) {
        nodes.push({ kind: "statement", text });
      } else if (!hasTitle && nodes.length === 0) {
        nodes.push({ kind: "title", text });
        hasTitle = true;
      } else {
        nodes.push({ kind: "subtitle", text });
      }
      continue;
    }

    if (first.startsWith(">")) {
      const md = lines.map((l) => l.replace(/^>\s?/, "")).join("  \n");
      nodes.push({ kind: "quote", md, caption: captionNext });
      captionNext = false;
      continue;
    }

    if (lines.length === 1) {
      const line = first;
      const lower = line.replace(/\*/g, "").trim().toLowerCase();
      if (ARROW.test(line)) {
        nodes.push({ kind: "arrow", glyph: line });
        continue;
      }
      if (/^[━─—\-]{5,}$/u.test(line)) {
        nodes.push({ kind: "rule" });
        continue;
      }
      if (INSTRUCTION_SENTENCES.some((re) => re.test(line))) continue;
      if (lower.endsWith(":") && lower.length <= 60) {
        const key = lower.slice(0, -1).trim();
        if (CAPTION_LABELS.includes(key)) { captionNext = true; continue; }
        if (INSTRUCTION_LABELS.includes(key)) continue;
        nodes.push({ kind: "label", text: plain(line).replace(/:$/, "") });
        continue;
      }
    }

    const list = lines.every((l) => /^(?:✅|❌|🟢|🟡|🔴)/u.test(l));
    nodes.push({ kind: "card", md: lines.join("  \n"), list });
  }
  return nodes;
}
