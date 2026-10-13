import type { CourseModuleDef } from "@/lib/courses";

/**
 * Norse Mythology: nine modules. Titles and descriptions are the approved course-page copy.
 * Only modules that have lesson files in content/norse-mythology/master/ are open; the rest are
 * marked `soon: true` (shown as "Coming soon", not clickable). To open a module: add its
 * module-NN.ru.md / module-NN.en.md, set its duration and remove `soon`.
 */
const NOT_YET = [0, 0] as const;

export const NORSE_MODULES: readonly CourseModuleDef[] = [
  {
    id: "module-01", order: 1,
    title: { ru: "В начале был хаос. И это ещё не самая плохая новость.", en: "In the Beginning, There Was Chaos. That Wasn't Even the Worst Part." },
    teaser: { ru: "Лёд, огонь, первый великан, гигантская корова и весьма необычные строительные материалы. Узнаем, как возник мир и почему всё началось с убийства.", en: "Ice, fire, the first giant, an enormous cow, and some deeply unconventional building materials. Discover how the world came into existence and why it all started with a murder." },
    duration: [15, 20],
    hero: {
      src: "/visuals/norse/m01/01-ginnungagap-1448.webp", src836: "/visuals/norse/m01/01-ginnungagap-724.webp", width: 1448, height: 1086, pos: "50% 45%",
      alt: { ru: "Гиннунгагап: бездна, где встречаются лёд и огонь.", en: "Ginnungagap: the abyss where ice meets fire." },
    },
  },
  {
    id: "module-02", order: 2,
    title: { ru: "Добро пожаловать в Асгард. Руководство здесь сомнительное.", en: "Welcome to Asgard. The Leadership Is Questionable." },
    teaser: { ru: "Знакомимся с асами и ванами, их властью, конфликтами и семейными связями. Выясняем, кто здесь главный и почему это не всегда помогает.", en: "Meet the Æsir and the Vanir, explore their power struggles, conflicts, and complicated family ties. Find out who's in charge — and why that doesn't always help." },
    duration: NOT_YET,
    soon: true,
  },
  {
    id: "module-03", order: 3,
    title: { ru: "Один. За знания придётся заплатить.", en: "Odin. Knowledge Comes at a Price." },
    teaser: { ru: "Один, вороны, пророчества, источник мудрости и девять ночей на мировом дереве. Отдельно разберёмся с рунами и их историей.", en: "Odin, his ravens, prophecies, the Well of Wisdom, and nine nights hanging from the World Tree. We'll also explore runes and the history behind them." },
    duration: NOT_YET,
    soon: true,
  },
  {
    id: "module-04", order: 4,
    title: { ru: "Тор. Когда молот — решение всех проблем.", en: "Thor. When a Hammer Is the Answer to Everything." },
    teaser: { ru: "Бог грома, его знаменитый Мьёльнир, великаны, невероятные подвиги и истории, в которых физическая сила оказывается не самым полезным качеством.", en: "The god of thunder, his famous Mjölnir, giants, extraordinary adventures, and stories in which brute strength turns out to be surprisingly unhelpful." },
    duration: NOT_YET,
    soon: true,
  },
  {
    id: "module-05", order: 5,
    title: { ru: "Локи. Некоторые проблемы лучше не решать. Особенно его методом.", en: "Loki. Some Problems Are Better Left Unsolved. Especially His Way." },
    teaser: { ru: "Превращения, хитрость, обман и блестящие планы, которые регулярно заканчиваются катастрофой. Локи умеет удивлять. К сожалению, не только врагов.", en: "Shapeshifting, trickery, deception, and brilliant plans that regularly end in disaster. Loki never fails to surprise. Unfortunately, it's not just his enemies who suffer." },
    duration: NOT_YET,
    soon: true,
  },
  {
    id: "module-06", order: 6,
    title: { ru: "Богини, ведьмы и судьба, которой всё равно на ваши планы.", en: "Goddesses, Witches, and a Fate That Couldn't Care Less About Your Plans." },
    teaser: { ru: "Фрейя, Фригг, норны, валькирии и магия сейд. Поговорим о власти, выборе, любви, смерти и судьбе, с которой даже боги не всегда могут договориться.", en: "Freyja, Frigg, the Norns, Valkyries, and seiðr magic. We'll explore power, choice, love, death, and a destiny that even the gods struggle to negotiate with." },
    duration: NOT_YET,
    soon: true,
  },
  {
    id: "module-07", order: 7,
    title: { ru: "Чудовища. Семейные проблемы космического масштаба.", en: "Monsters. Family Problems on a Cosmic Scale." },
    teaser: { ru: "Фенрир, Ёрмунганд, Хель и другие существа, которым предстоит сыграть важную роль в судьбе мира.", en: "Fenrir, Jörmungandr, Hel, and other creatures destined to play a rather significant role in the fate of the world." },
    duration: NOT_YET,
    soon: true,
  },
  {
    id: "module-08", order: 8,
    title: { ru: "Смерть — это ещё не конец. Но условия зависят от обстоятельств.", en: "Death Isn't the End. Terms and Conditions Apply." },
    teaser: { ru: "Вальгалла, Фолькванг, владения Хель и представления о загробной жизни. Выясним, почему далеко не каждый погибший воин отправлялся пировать с Одином.", en: "Valhalla, Fólkvangr, the realm of Hel, and Norse beliefs about the afterlife. Find out why not every fallen warrior earned a seat at Odin's table." },
    duration: NOT_YET,
    soon: true,
  },
  {
    id: "module-09", order: 9,
    title: { ru: "Рагнарёк. Конец света согласован. Отменить нельзя.", en: "Ragnarök. The End of the World Is Scheduled. No Cancellations." },
    teaser: { ru: "Пророчества сбываются. Волки догоняют свою добычу. Старые враги встречаются в последней битве, а привычный мир прекращает существование. Но история на этом не заканчивается.", en: "The prophecies come true. The wolves finally catch their prey. Ancient enemies meet in one last battle, and the world as everyone knows it comes to an end. But the story doesn't end there." },
    duration: NOT_YET,
    soon: true,
  },
];
