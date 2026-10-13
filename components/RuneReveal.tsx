"use client";
import type { Locale } from "@/lib/course";
import { Rune, type RuneName } from "@/components/Rune";
import { runeById } from "@/lib/runes";
import { ragnarokLine } from "@/lib/ragnarok";

/** The moment a rune is handed out: the rune, what it means, a joke, and the Ragnarök countdown. */
export function RuneReveal({ locale, rune, stepsLeft, onNext, nextLabel, bonus }: { locale: Locale; rune: RuneName; stepsLeft?: number; onNext: () => void; nextLabel: string; bonus?: boolean }) {
  const info = runeById(rune);
  if (!info) return null;
  return <div className="runeReveal">
    <div className="lxEyebrow lxEyebrowGold">{bonus ? (locale === "ru" ? "Бонусная руна" : "Bonus rune") : (locale === "ru" ? "Тебе выпала руна" : "You drew a rune")}</div>
    <div className="runeRevealStone" aria-hidden="true"><Rune name={rune} size={84} /></div>
    <h2 className="runeRevealName" id="rune-title">{info.name[locale]}</h2>
    <p className="runeRevealMeaning">{info.meaning[locale]}</p>
    <p className="runeRevealJoke">{info.joke[locale]}</p>
    {stepsLeft !== undefined && <p className="runeRevealCount"><span aria-hidden="true">ᛉ</span> {ragnarokLine(stepsLeft, locale)}</p>}
    <button type="button" className="lxBtn lxBtnGold" onClick={onNext}>{nextLabel} <span aria-hidden="true">→</span></button>
  </div>;
}
