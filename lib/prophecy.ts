import type { Locale } from "@/lib/course";
import { runeById, type RuneInfo } from "@/lib/runes";
import type { RuneName } from "@/components/Rune";

/**
 * The final prophecy. It is assembled from the learner's own runes in the order they were drawn:
 * first rune = the past, middle rune = the present, last rune = the future.
 * The same set of runes always gives the same text (variants are picked by a hash of the rune ids).
 */
const INTRO: Record<Locale, string[]> = {
  ru: [
    "Норны пересчитали твои руны и вздохнули.",
    "Один подмигнул единственным глазом. Это хороший знак. Или тик.",
    "Руны легли, и даже ворон перестал каркать.",
    "Урд, Верданди и Скульд посовещались и выдали вердикт.",
    "Под корнями Иггдрасиля кто-то зашуршал, и вот что он велел передать.",
    "Мимир выдал справку из колодца. Читай внимательно.",
  ],
  en: [
    "The Norns counted your runes and sighed.",
    "Odin winked with his only eye. A good sign. Or a twitch.",
    "The runes have fallen, and even the raven went quiet.",
    "Urd, Verdandi and Skuld held a meeting and reached a verdict.",
    "Something rustled under the roots of Yggdrasil, and this is what it asked us to pass on.",
    "Mimir sent a note up from the well. Read carefully.",
  ],
};

const OUTRO: Record<Locale, string[]> = {
  ru: [
    "Рагнарёк при этом никто не отменял, но у тебя будет что рассказать за столом.",
    "Совет напоследок: не спорь с вороном и не доверяй Локи конспекты.",
    "Предсказание действительно до первого появления Фенрира. Дальше без гарантий.",
    "Если что-то не сбудется, обращайтесь к норнам. Приём по средам, но среды у них нет.",
    "А теперь иди и сделай вид, что так и планировал.",
    "Конец света всё равно придёт. Зато ты знаешь, в каком порядке расставлены руны.",
    "Тор бы одобрил. Хотя Тор одобряет всё, что можно ударить молотом.",
    "Передай привет Иггдрасилю. Он давно ничего не слышал, кроме белки.",
  ],
  en: [
    "Ragnarök is not cancelled, but you will have a good story for the table.",
    "A final tip: do not argue with ravens and do not lend Loki your notes.",
    "Valid until the first sighting of Fenrir. No guarantees after that.",
    "If something does not come true, take it up with the Norns. Office hours: Wednesdays, which they do not have.",
    "Now go and act as if this was the plan all along.",
    "The end of the world is still coming. But you know how your runes are arranged.",
    "Thor would approve. Thor approves of anything that can be hit with a hammer.",
    "Say hello to Yggdrasil. It has not heard anything but a squirrel in ages.",
  ],
};

const FRAME: Record<Locale, { past: string; present: string; future: string }> = {
  ru: { past: "За твоей спиной", present: "Под ногами", future: "Впереди" },
  en: { past: "Behind you", present: "Beneath your feet", future: "Ahead" },
};

function hash(ids: string[]): number {
  let h = 2166136261;
  for (const ch of ids.join("|")) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export type Prophecy = {
  intro: string;
  lines: { label: string; rune: RuneInfo; text: string }[];
  outro: string;
};

/** `drawn` must be ordered by draw time. Needs at least one rune. */
export function buildProphecy(drawn: RuneName[], locale: Locale): Prophecy | null {
  const infos = drawn.map(runeById).filter((x): x is RuneInfo => !!x);
  if (!infos.length) return null;
  const h = hash(drawn);
  const past = infos[0];
  const present = infos[Math.floor((infos.length - 1) / 2)];
  const future = infos[infos.length - 1];
  const f = FRAME[locale];
  const mk = (label: string, rune: RuneInfo) => ({ label, rune, text: `${rune.omen[locale]}` });
  return {
    intro: INTRO[locale][h % INTRO[locale].length],
    lines: [mk(f.past, past), mk(f.present, present), mk(f.future, future)],
    outro: OUTRO[locale][(h >>> 3) % OUTRO[locale].length],
  };
}
