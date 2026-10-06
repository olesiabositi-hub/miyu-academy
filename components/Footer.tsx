import Link from "next/link";
import type { Locale } from "@/lib/course";
export function Footer({locale}:{locale:Locale}){
  return <footer className="footer">
    <Link href={`/${locale}/privacy`}>{locale==="ru"?"Конфиденциальность":"Privacy"}</Link>
    <Link href={`/${locale}/terms`}>{locale==="ru"?"Условия":"Terms"}</Link>
    <Link href={`/${locale}/accessibility`}>Accessibility</Link>
    <Link href={`/${locale}/credits`}>{locale==="ru"?"Источники":"Credits"}</Link>
    <Link href={`/${locale}/privacy-settings`}>{locale==="ru"?"Настройки приватности":"Privacy settings"}</Link>
  </footer>
}
