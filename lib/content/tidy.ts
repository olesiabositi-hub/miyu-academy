/**
 * Reading layout for lessons written one sentence per line (all courses except Greek).
 * Runs of short plain paragraphs are set as one paragraph: same words, same order, no sentence moved.
 * Headings, pictures, quotes, lists, dialogue lines and lines that are entirely bold/italic stay on their own.
 */
const MIN = 340;   // a paragraph keeps growing until it is at least this long…
const MAX = 780;   // …but never beyond this

const isStandalone = (p: string) =>
  /^(#{1,6}\s|!\[|>|[-*+]\s|\d+[.)]\s|—|–)/.test(p) || /^\*\*[^*]+\*\*$/.test(p) || /^\*[^*]+\*$/.test(p) || /^_[^_]+_$/.test(p);

export function tidyProse(markdown: string): string {
  const paras = markdown.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const out: string[] = [];
  let run = "";
  const flush = () => { if (run) out.push(run); run = ""; };
  for (const p of paras) {
    if (isStandalone(p)) { flush(); out.push(p); continue; }
    if (run && (run.length >= MIN || run.length + 1 + p.length > MAX)) flush();
    run = run ? `${run} ${p}` : p;
    // "…трое сыновей:" introduces the next (standalone) line, so close the paragraph here.
    if (/[:：]$/.test(p)) flush();
  }
  flush();
  return out.join("\n\n");
}
