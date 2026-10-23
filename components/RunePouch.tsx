import type { Locale } from "@/lib/course";
import { Rune } from "@/components/Rune";
import { RUNES, runeById } from "@/lib/runes";
import { buildProphecy } from "@/lib/prophecy";
import { ragnarokLine } from "@/lib/ragnarok";
import type { RuneName } from "@/components/Rune";

export type { RuneDraw } from "@/lib/progress";
import type { RuneDraw } from "@/lib/progress";

/** Dashboard block of the Norse course: the learner's runes, the Ragnarök countdown and the final prophecy. */
export function RunePouch({ locale, draws, completed, total }: { locale: Locale; draws: RuneDraw[]; completed: number; total: number }) {
  const ordered = [...draws].sort((a, b) => a.drawn_at.localeCompare(b.drawn_at));
  const have = new Set(ordered.map((d) => d.rune));
  const ru = locale === "ru";
  const prophecy = completed >= total ? buildProphecy(ordered.map((d) => d.rune), locale) : null;
  return <section className="runePouch">
    <div className="lxEyebrow dashSection">{ru ? "Твои руны" : "Your runes"}</div>
    <p className="runeCount"><span aria-hidden="true">ᛉ</span> {ragnarokLine(Math.max(0, total - completed), locale)}</p>
    <ul className="runeGrid">
      {RUNES.map((r) => {
        const own = have.has(r.id);
        return <li key={r.id} className={"runeTile" + (own ? " is-own" : "")}>
          <span className="runeTileGlyph"><Rune name={r.id} size={30} /></span>
          {own ? <details><summary>{r.name[locale]}</summary><p>{r.meaning[locale]}</p><p className="runeTileJoke">{r.joke[locale]}</p></details> : <span className="runeTileLocked">?</span>}
        </li>;
      })}
    </ul>
    <p className="runeHint">{ru ? `Собрано ${have.size} из ${RUNES.length}. Руны выпадают случайно, повторов не бывает.` : `${have.size} of ${RUNES.length} collected. Runes are drawn at random, no repeats.`}</p>
    {prophecy ? <article className="prophecy">
      <div className="lxEyebrow lxEyebrowGold">{ru ? "Твоё предсказание" : "Your prophecy"}</div>
      <p className="prophecyIntro">{prophecy.intro}</p>
      {prophecy.lines.map((l) => <p className="prophecyLine" key={l.label}><span className="prophecyRune"><Rune name={l.rune.id} size={20} /></span><span><b>{l.label}</b> ({l.rune.name[locale]}): {l.text}.</span></p>)}
      <p className="prophecyOutro">{prophecy.outro}</p>
    </article> : <p className="runeHint">{ru ? "Предсказание откроется, когда ты пройдёшь все девять модулей." : "The prophecy opens once you have finished all nine modules."}</p>}
  </section>;
}
