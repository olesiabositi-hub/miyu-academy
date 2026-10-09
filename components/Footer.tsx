import Link from "next/link";
import type { Locale } from "@/lib/course";
import { courseBasePath, courseDashboardPath } from "@/lib/courses";
import { t } from "@/lib/i18n";

export function Footer({locale}:{locale:Locale}){
  const year=new Date().getFullYear();
  return <footer className="footer">
    <div className="footerGrid">
      <div className="footerBrand">
        <Link className="footerWordmark" href={`/${locale}`}>MIYU<span>ACADEMY</span></Link>
        <p>{t(locale,"footer.tagline")}</p>
      </div>
      <nav className="footerCol" aria-label={t(locale,"footer.groupAcademy")}>
        <h2>{t(locale,"footer.groupAcademy")}</h2>
        <Link href={courseBasePath(locale)}>{t(locale,"nav.course")}</Link>
        <Link href={courseDashboardPath(locale)}>{t(locale,"nav.progress")}</Link>
      </nav>
      <nav className="footerCol" aria-label={t(locale,"footer.groupLegal")}>
        <h2>{t(locale,"footer.groupLegal")}</h2>
        <Link href={`/${locale}/privacy`}>{t(locale,"footer.privacy")}</Link>
        <Link href={`/${locale}/terms`}>{t(locale,"footer.terms")}</Link>
        <Link href={`/${locale}/privacy-settings`}>{t(locale,"footer.privacySettings")}</Link>
      </nav>
      <nav className="footerCol" aria-label={t(locale,"footer.groupMore")}>
        <h2>{t(locale,"footer.groupMore")}</h2>
        <Link href={`/${locale}/accessibility`}>{t(locale,"footer.accessibility")}</Link>
        <Link href={`/${locale}/credits`}>{t(locale,"footer.credits")}</Link>
      </nav>
    </div>
    <p className="footerLegalLine">© {year} MIYU Academy. {t(locale,"footer.rights")}</p>
  </footer>
}
