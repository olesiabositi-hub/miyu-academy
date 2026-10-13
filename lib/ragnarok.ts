import type { Locale } from "@/lib/course";

/** Joke countdown to the end of the world: one line per number of steps left (index = steps left, 0..9). */
const LINES: Record<Locale, string[]> = {
  ru: [
    "Рагнарёк наступил. Спасибо, что дочитали до конца света.",
    "Остался 1 шаг. Волк уже поправил галстук.",
    "Осталось 2 шага. Хеймдалль достаёт рог.",
    "Осталось 3 шага. Зима длится три года подряд, зато без пробок.",
    "Осталось 4 шага. Локи пока не вернулся, но уже собирает чемодан.",
    "Осталось 5 шагов. Тор проверяет, на месте ли молот. Молот на месте.",
    "Осталось 6 шагов. Один ищет, у кого бы ещё спросить совета.",
    "Осталось 7 шагов. Пока всё спокойно, что подозрительно.",
    "Осталось 8 шагов. Корабль из ногтей мертвецов, говорят, ещё в стапеле.",
    "До Рагнарёка 9 шагов. Время есть, но не очень много.",
  ],
  en: [
    "Ragnarök has arrived. Thank you for reading to the end of the world.",
    "1 step left. The wolf is straightening his tie.",
    "2 steps left. Heimdall is reaching for his horn.",
    "3 steps left. Winter lasts three years in a row, but at least no traffic.",
    "4 steps left. Loki is not back yet, but he is packing.",
    "5 steps left. Thor is checking the hammer. The hammer is there.",
    "6 steps left. Odin is looking for someone else to ask for advice.",
    "7 steps left. All quiet, which is suspicious.",
    "8 steps left. The ship made of dead men's nails is still on the slipway, they say.",
    "9 steps until Ragnarök. There is time, but not a lot.",
  ],
};

export function ragnarokLine(stepsLeft: number, locale: Locale): string {
  const n = Math.max(0, Math.min(9, Math.round(stepsLeft)));
  return LINES[locale][n];
}
