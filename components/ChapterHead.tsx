/**
 * Chapter head shared by every course: small label ("Глава 3"), title, and the big faint number.
 * Reads the Markdown heading as written ("## Глава 3. Title"); headings without a number keep only the title.
 * Styles: .mxHead in app/[locale]/base.css.
 */
const RX = /^((?:Глава|Chapter)\s+(\d+)|Вступление|Introduction|Завершение|Conclusion)\.\s*(.*)$/;

export function splitChapterTitle(heading: string): { label: string; num: string; title: string } {
  const text = heading.replace(/^#{1,6}\s+/, "").trim();
  const m = text.match(RX);
  if (!m) return { label: "", num: "", title: text };
  return { label: m[1], num: m[2] ? m[2].padStart(2, "0") : "", title: m[3] || m[1] };
}

export function ChapterHead({ heading, as: Tag = "h2" }: { heading: string; as?: "h2" | "h3" }) {
  const { label, num, title } = splitChapterTitle(heading);
  return <header className="mxHead">
    {label && label !== title && <div className="mxLabel">{label}</div>}
    <Tag className="mxTitle">{title}</Tag>
    {num && <span className="mxNum" aria-hidden="true">{num}</span>}
  </header>;
}
