"use client";
import { useState } from "react";
import type { Locale } from "@/lib/course";
import { RuneReveal } from "@/components/RuneReveal";
import { drawRune } from "@/lib/rune-client";
import type { RuneName } from "@/components/Rune";
import { track } from "@/lib/analytics";
import { ActivityFrame } from "@/components/ActivityFrame";

/**
 * "Who lives where on Yggdrasil": six clues, six answers, all taken from chapter 7 of module 1.
 * Pick a clue, then the answer. A wrong answer shakes and nudges back to the text; a full tree gives a bonus rune.
 */
type Item = { id: string; name: { ru: string; en: string }; clue: { ru: string; en: string }; x: number; y: number };

const ITEMS: Item[] = [
  { id: "eagle", name: { ru: "Орёл", en: "The eagle" }, clue: { ru: "Сидит на ветвях и смотрит свысока", en: "Sits on the branches and looks down on everyone" }, x: 150, y: 40 },
  { id: "ratatoskr", name: { ru: "Рататоск", en: "Ratatoskr" }, clue: { ru: "Бегает по стволу и носит враждебные слова", en: "Runs up and down the trunk carrying hostile words" }, x: 150, y: 190 },
  { id: "deer", name: { ru: "Олени", en: "The deer" }, clue: { ru: "Объедают листву", en: "Nibble the leaves" }, x: 66, y: 104 },
  { id: "nidhogg", name: { ru: "Нидхёгг", en: "Nidhogg" }, clue: { ru: "Грызёт корень у источника Хвергельмир", en: "Gnaws the root by the spring Hvergelmir" }, x: 54, y: 306 },
  { id: "mimir", name: { ru: "Источник Мимира", en: "Mimir's well" }, clue: { ru: "Здесь ждёт мудрость, но цена страшная", en: "Wisdom waits here, but the price is terrible" }, x: 150, y: 330 },
  { id: "norns", name: { ru: "Норны", en: "The Norns" }, clue: { ru: "Поливают дерево водой и глиной из источника Урд", en: "Water the tree and coat it with clay from the spring of Urd" }, x: 246, y: 306 },
];

const COPY = {
  ru: { eyebrow: "Мини-игра", title: "Кто где живёт на Иггдрасиле", lead: "Выбери подсказку, потом тех, к кому она подходит. Все ответы есть в главе выше.", wrong: "Не то. Перечитай главу и попробуй ещё.", done: "Дерево собрано. Все на своих местах, и никто не доволен.", mistakes: (n: number) => `Ошибок: ${n}`, again: "Сыграть ещё раз", next: "Дальше", pickClue: "Сначала выбери подсказку", answers: "Варианты", clues: "Подсказки" },
  en: { eyebrow: "Mini-game", title: "Who lives where on Yggdrasil", lead: "Pick a clue, then who it describes. Every answer is in the chapter above.", wrong: "Not that one. Reread the chapter and try again.", done: "The tree is complete. Everyone is in place, and nobody is happy.", mistakes: (n: number) => `Mistakes: ${n}`, again: "Play again", next: "Continue", pickClue: "Pick a clue first", answers: "Answers", clues: "Clues" },
} as const;

export function YggdrasilGame({ locale, courseId }: { locale: Locale; courseId: string }) {
  const c = COPY[locale];
  const [solved, setSolved] = useState<string[]>([]);
  const [clue, setClue] = useState<string | null>(null);
  const [shake, setShake] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [note, setNote] = useState("");
  const [rune, setRune] = useState<RuneName | null>(null);
  const [revealed, setRevealed] = useState(false);
  const won = solved.length === ITEMS.length;

  async function answer(id: string) {
    if (!clue || solved.includes(id) || won) { if (!clue) setNote(c.pickClue); return; }
    if (id === clue) {
      const next = [...solved, id];
      setSolved(next); setClue(null); setNote("");
      if (next.length === ITEMS.length) {
        track("game_complete", { game: "yggdrasil", mistakes });
        const drawn = await drawRune(courseId, "game-yggdrasil", 3);
        if (drawn) setRune(drawn);
      }
    } else {
      setMistakes((m) => m + 1); setNote(c.wrong); setShake(id);
      window.setTimeout(() => setShake(null), 450);
    }
  }
  function reset() { setSolved([]); setClue(null); setMistakes(0); setNote(""); setRune(null); setRevealed(false); }

  return <ActivityFrame tone="dark" kind="ygGame" eyebrow={c.eyebrow} title={c.title} lead={c.lead}>
    <div className="ygBoard">
      <svg className="ygTree" viewBox="0 0 300 360" role="img" aria-label={c.title}>
        <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".75">
          <path d="M150 210V120M150 120C120 100 90 90 66 104M150 120C180 100 210 90 234 104M150 150C120 140 100 136 88 130M150 150C180 140 200 136 212 130M150 80C150 66 150 52 150 40" />
          <path d="M150 210C140 250 90 270 54 306M150 210V330M150 210C160 250 210 270 246 306" />
          <circle cx="150" cy="96" r="62" strokeDasharray="2 7" />
        </g>
        {ITEMS.map((it, i) => {
          const ok = solved.includes(it.id);
          return <g key={it.id} className={"ygPin" + (ok ? " is-ok" : "") + (clue === it.id ? " is-on" : "")}>
            <circle cx={it.x} cy={it.y} r={ok ? 15 : 13} />
            <text x={it.x} y={it.y + 5} textAnchor="middle">{ok ? "✓" : i + 1}</text>
          </g>;
        })}
      </svg>
      <div className="ygSide">
        <div className="ygCol" role="group" aria-label={c.clues}>
          {ITEMS.map((it, i) => {
            const ok = solved.includes(it.id);
            return <button type="button" key={it.id} className={"ygClue" + (clue === it.id ? " is-on" : "") + (ok ? " is-ok" : "")} disabled={ok || won} onClick={() => { setClue(it.id); setNote(""); }}>
              <b>{i + 1}</b><span>{it.clue[locale]}{ok && <em> — {it.name[locale]}</em>}</span>
            </button>;
          })}
        </div>
        <div className="ygChips" role="group" aria-label={c.answers}>
          {ITEMS.map((it) => <button type="button" key={it.id} className={"ygChip" + (solved.includes(it.id) ? " is-ok" : "") + (shake === it.id ? " is-shake" : "")} disabled={solved.includes(it.id) || won} onClick={() => answer(it.id)}>{it.name[locale]}</button>)}
        </div>
        <p className="ygNote" role="status" aria-live="polite">{note || (won ? c.done : " ")}</p>
        <div className="ygFoot"><span>{c.mistakes(mistakes)}</span>{won && <button type="button" className="ygLink" onClick={reset}>{c.again}</button>}</div>
      </div>
    </div>
    {won && rune && !revealed && <RuneReveal locale={locale} rune={rune} bonus onNext={() => setRevealed(true)} nextLabel={c.next} />}
  </ActivityFrame>;
}
