import type { Locale } from "@/lib/course";
import { t } from "@/lib/i18n";
import { SUPPORT_URL } from "@/lib/links";

/**
 * Quiet "support the project" card shown at the end of each course and story.
 * Just a link to Ko-fi: the site itself takes no payments and stores nothing.
 */
export function SupportNote({ locale, tone = "light" }: { locale: Locale; tone?: "light" | "dark" }) {
  return <aside className={"supportNote" + (tone === "dark" ? " supportNoteDark" : "")} aria-labelledby="support-note-title">
    <div className="supportNoteText">
      <div className="lxEyebrow">{t(locale, "support.eyebrow")}</div>
      <h2 className="supportNoteTitle" id="support-note-title">{t(locale, "support.title")}</h2>
      <p>{t(locale, "support.body")}</p>
    </div>
    <a className="supportNoteBtn" href={SUPPORT_URL} target="_blank" rel="noopener">{t(locale, "support.cta")} <span aria-hidden="true">↗</span></a>
  </aside>;
}
