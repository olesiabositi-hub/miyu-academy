import type { Locale } from "@/lib/course";
import type { RuneName } from "@/components/Rune";

/**
 * The 24 runes of the Elder Futhark as a small oracle. Meanings follow the traditional rune poems in spirit
 * (cattle, aurochs, giant, god, road, torch, gift, joy, hail, need, ice, year, yew, lot-cup, elk/protection, sun,
 * Tyr, birch, horse, man, water, Ing, day, heritage); the jokes and omens are the course's own invention.
 * `omen` is a gender-neutral noun phrase used inside the final prophecy.
 */
export type RuneInfo = {
  id: RuneName;
  name: Record<Locale, string>;
  meaning: Record<Locale, string>;
  joke: Record<Locale, string>;
  omen: Record<Locale, string>;
};

const r = (id: RuneName, name: [string, string], meaning: [string, string], joke: [string, string], omen: [string, string]): RuneInfo => ({
  id, name: { ru: name[0], en: name[1] }, meaning: { ru: meaning[0], en: meaning[1] }, joke: { ru: joke[0], en: joke[1] }, omen: { ru: omen[0], en: omen[1] },
});

export const RUNES: readonly RuneInfo[] = [
  r("fehu", ["Феху", "Fehu"], ["Скот, богатство, то, что можно нажить и потерять.", "Cattle, wealth: what can be earned and lost."], ["Стадо само не пасётся. Проверено.", "The herd does not graze itself. Tested."], ["щедрый подарок, который придётся стеречь", "a generous gift that will need guarding"]),
  r("uruz", ["Уруз", "Uruz"], ["Тур, дикая сила, здоровье и упрямство.", "The aurochs: raw strength, health and stubbornness."], ["Сила есть, а куда бежать, решим по дороге.", "Strength: check. Direction: to be decided."], ["упрямая сила, которая не спрашивает разрешения", "stubborn strength that never asks permission"]),
  r("thurisaz", ["Турисаз", "Thurisaz"], ["Шип, великан, защита и угроза одновременно.", "A thorn, a giant: protection and threat in one."], ["Не нажимай на то, что колется.", "Do not press the thing that stings."], ["колючее препятствие с хорошими манерами", "a thorny obstacle with surprisingly good manners"]),
  r("ansuz", ["Ансуз", "Ansuz"], ["Слово, знание, дар Одина.", "The word, knowledge, a gift of Odin."], ["Скажешь вслух, и оно сбудется. Выбирай слова.", "Say it aloud and it may happen. Choose your words."], ["слово, сказанное в нужный момент", "a word spoken at exactly the right moment"]),
  r("raidho", ["Райдо", "Raidho"], ["Дорога, путь, поездка.", "The road, the journey."], ["Навигатор тут не работает. Идти придётся самому.", "No satnav up here. You will have to walk."], ["долгая дорога с неожиданным привалом", "a long road with an unexpected rest stop"]),
  r("kenaz", ["Кеназ", "Kenaz"], ["Факел, огонь знания, творчество.", "The torch: the fire of knowledge and craft."], ["Светит и греет. Иногда одновременно с пожаром.", "Lights and warms. Sometimes also burns the house down."], ["огонёк идеи, который лучше не оставлять без присмотра", "a spark of an idea best not left unattended"]),
  r("gebo", ["Гебо", "Gebo"], ["Дар, обмен, равные отношения.", "A gift, an exchange, even terms."], ["Подарки у норн бывают с условиями. Читай мелкий шрифт.", "Gifts from the Norns have terms. Read the small print."], ["дар, за который всё-таки придётся расплатиться", "a gift that will, in the end, send you a bill"]),
  r("wunjo", ["Вуньо", "Wunjo"], ["Радость, согласие, добрая весть.", "Joy, harmony, good news."], ["Редкий случай: всё хорошо. Не спугни.", "A rare day when all is well. Do not jinx it."], ["радость, которую хочется спрятать от богов", "a joy you would rather hide from the gods"]),
  r("hagalaz", ["Хагалаз", "Hagalaz"], ["Град, внезапная буря, очищающий хаос.", "Hail: a sudden storm, a cleansing chaos."], ["Прогноз погоды составлял Локи.", "The weather forecast was written by Loki."], ["внезапный град, после которого всё станет яснее", "a sudden hailstorm after which things will make more sense"]),
  r("naudhiz", ["Наутиз", "Naudhiz"], ["Нужда, ограничение, урок терпения.", "Need, constraint, a lesson in patience."], ["Нужда научит. Но зачем так подробно?", "Need teaches. But must it be so thorough?"], ["нужда, которая научит большему, чем хотелось бы", "a need that will teach more than you wanted to know"]),
  r("isa", ["Иса", "Isa"], ["Лёд, пауза, остановка.", "Ice, a pause, a standstill."], ["Мир начался со льда. Подожди, и всё растает.", "The world began with ice. Wait, and it will thaw."], ["ледяная пауза, в которой пора подумать", "an icy pause in which it is time to think"]),
  r("jera", ["Йера", "Jera"], ["Год, урожай, награда за терпение.", "A year, a harvest, the reward of patience."], ["Урожай придёт, но не в день посева.", "The harvest will come, just not on sowing day."], ["урожай, на который давно пора было надеяться", "a harvest you were right to hope for"]),
  r("eihwaz", ["Эйваз", "Eihwaz"], ["Тис, стойкость, связь миров.", "The yew: endurance, a link between worlds."], ["Дерево стоит, и ты постоишь. У Иггдрасиля так же.", "The tree stands, so can you. Yggdrasil does it too."], ["стойкость, которая переживёт всех критиков", "endurance that will outlast all critics"]),
  r("perthro", ["Перт", "Perthro"], ["Жребий, тайна, судьба, которая ещё не вскрыта.", "The lot-cup: mystery, fate not yet revealed."], ["Содержимое непонятно даже вёльве.", "Even the seeress is not sure what is inside."], ["тайна, которая раскроется в самый неудобный момент", "a mystery about to reveal itself at the least convenient moment"]),
  r("algiz", ["Альгиз", "Algiz"], ["Защита, охрана, поднятые руки.", "Protection, a guard, raised arms."], ["За тобой присматривают. Не всегда те, кого ждёшь.", "Someone is watching over you. Not always who you expect."], ["неожиданная защита от человека, которого ты не ценил(а)", "unexpected protection from someone you underestimated"]),
  r("sowilo", ["Совило", "Sowilo"], ["Солнце, победа, ясность.", "The sun, victory, clarity."], ["Сколль уже на хвосте, но пока светит.", "Sköll is already on its tail, but it still shines."], ["короткая, но яркая победа, пока волки не догнали", "a short, bright victory before the wolves catch up"]),
  r("tiwaz", ["Тиваз", "Tiwaz"], ["Тюр, справедливость, жертва ради слова.", "Tyr: justice, a sacrifice made for one's word."], ["Рука за честность, это дорого. Но слово — дороже.", "A hand for honesty is steep. A promise is steeper."], ["справедливость, за которую придётся заплатить рукой, но не твоей", "justice that costs a hand, though not yours"]),
  r("berkano", ["Беркана", "Berkano"], ["Берёза, рост, начало нового.", "The birch: growth, a new beginning."], ["Растёт медленно, зато без интриг.", "Grows slowly, but with no intrigue."], ["новое начало, которое растёт тихо, но верно", "a new beginning growing quietly but surely"]),
  r("ehwaz", ["Эваз", "Ehwaz"], ["Конь, доверие, движение вдвоём.", "The horse: trust, moving as a pair."], ["Хорошо, если у коня восемь ног, как у Слейпнира.", "Better if the horse has eight legs, like Sleipnir."], ["надёжный попутчик с неожиданным количеством ног", "a reliable companion with an unexpected number of legs"]),
  r("mannaz", ["Манназ", "Mannaz"], ["Человек, община, помощь друг другу.", "Humanity, community, mutual help."], ["Аск и Эмбла начинали с двух кусков дерева. У тебя получится.", "Ask and Embla started with two logs. You will manage."], ["чьё-то плечо, которое ты заметишь слишком поздно", "someone's shoulder you will notice a little too late"]),
  r("laguz", ["Лагуз", "Laguz"], ["Вода, течение, интуиция.", "Water, flow, intuition."], ["Течение быстрое, а вёсла остались в Асгарде.", "The current is strong; the oars stayed in Asgard."], ["течение, которому лучше довериться, чем спорить", "a current best trusted rather than argued with"]),
  r("ingwaz", ["Ингуз", "Ingwaz"], ["Плодородие, завершённый этап, семя.", "Fertility, a completed stage, a seed."], ["Закончил один этап и сразу собираешь семена для следующего.", "One stage done, and you are already collecting seeds for the next."], ["завершённое дело, которое тут же запросит продолжения", "a finished task that will immediately demand a sequel"]),
  r("dagaz", ["Дагаз", "Dagaz"], ["День, рассвет, перелом к лучшему.", "Day, dawn, a turn for the better."], ["Даже у конца света есть утро. Вроде бы.", "Even the end of the world has a morning. Apparently."], ["рассвет после очень длинной ночи", "a dawn after a very long night"]),
  r("othala", ["Отала", "Othala"], ["Наследие, дом, то, что остаётся с тобой.", "Heritage, home, what stays with you."], ["Дом, где тебя ждут, даже если ты опоздал на пир.", "A home where you are expected, even if you missed the feast."], ["дом, в котором для тебя всегда оставлено место", "a home with a seat always kept for you"]),
];

export const RUNE_IDS: readonly RuneName[] = RUNES.map((x) => x.id);
export const runeById = (id: string): RuneInfo | undefined => RUNES.find((x) => x.id === id);
