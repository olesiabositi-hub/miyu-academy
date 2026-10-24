import type { Locale } from "@/lib/course";

/**
 * Visual story «Золотая нить. Зæриндагхуыд» (the second story, after «Цыллæ хыз»).
 *
 * The approved text lives in content/ossetian-gold-embroidery/story.<locale>.md and is rendered verbatim.
 * Blocks are placed by marker lines inside that text (see docs/STORIES.md):
 *   [[scene:<picture>]] [[pic:<picture>]] [[fact: big | note]]
 *   activities: [[barter]] [[stitch]] [[assemble]] [[motifs]] [[hat]] [[words]] [[dress]]
 *
 * Everything below is the copy around the text: page chrome, picture alt texts, sources, and the words inside
 * the activities. Lines in quotes marked «text» repeat the story word for word; the rest are short interface
 * lines (buttons, hints). Every fact here is taken from the story; nothing new is claimed.
 */

export const STORY_SLUG = "ossetian-gold-embroidery";
export const STORY_DIR = "ossetian-gold-embroidery";
export const MEDIA = "/visuals/ossetian-gold-embroidery";
/** The first story, linked from the epilogue, the hat and the dress activities. */
export const FIRST_STORY_SLUG = "ossetian-headscarf";

type L = Record<Locale, string>;

/** Pictures: `-<w>.webp` (large) and `-800.webp`. Wide scenes are 3:2, side pictures 4:5. */
export const PICS: Record<string, { w: number; h: number; alt: L }> = {
  "excavation-gold": { w: 1448, h: 965, alt: { ru: "Фрагмент золотой вышивки в земле под кистью археолога", en: "A fragment of gold embroidery in the earth under an archaeologist's brush" } },
  "thread-barter": { w: 1448, h: 965, alt: { ru: "Женщина с курицей, в протянутой руке — два клубка золотой канители; горное селение", en: "A woman holding a hen; an outstretched hand offers two skeins of gold purl; a mountain village" } },
  "bride-at-hoop": { w: 1448, h: 965, alt: { ru: "Девушка у окна вышивает золотом бархатную шапочку", en: "A young woman by the window embroidering a velvet hat with gold" } },
  "hoop-closeup": { w: 1448, h: 965, alt: { ru: "Крупно: золотой узор на пяльцах и игла с тонким шёлком", en: "Close-up: a gold pattern on a hoop and a needle with fine silk" } },
  "motif-table": { w: 1448, h: 965, alt: { ru: "Вышитые золотом кусочки на столе: дерево, розетка, рога, завитки; рядом кабаний клык", en: "Gold-embroidered pieces on a table: a tree, a rosette, horns, scrolls; a boar's tusk beside them" } },
  "hat-on-head": { w: 1448, h: 965, alt: { ru: "Старшая женщина надевает на невесту бархатную шапочку с золотой вышивкой", en: "An older woman places a velvet hat embroidered with gold on a bride's head" } },
  "vladikavkaz-shop": { w: 1448, h: 965, alt: { ru: "Витрина лавки на вечерней улице Владикавказа XIX века", en: "A shop window on an evening street in 19th-century Vladikavkaz" } },
  "empty-hoop": { w: 1448, h: 965, alt: { ru: "Пустые пяльцы и недошитый золотой узор на бархате у сундука", en: "An empty hoop and an unfinished gold pattern on velvet by a chest" } },
  "tree-of-life": { w: 1122, h: 1402, alt: { ru: "Подвесной рукав из бордового бархата с золотым Деревом Жизни", en: "A hanging sleeve of crimson velvet with a gold Tree of Life" } },
  "festive-dress": { w: 1122, h: 1402, alt: { ru: "Праздничный наряд из бордового бархата с золотой вышивкой у окна", en: "A festive costume of crimson velvet with gold embroidery by a window" } },
  "cherkeska-galloon": { w: 1122, h: 1402, alt: { ru: "Край чёрной черкески с золотым галуном и плетёными пуговицами", en: "The edge of a black cherkeska with gold galloon and braided buttons" } },
  "digor-silk": { w: 1122, h: 1402, alt: { ru: "Ажурный шёлковый платок и бархат с золотой вышивкой на одном столе", en: "An openwork silk headscarf and gold-embroidered velvet on one table" } },
  "museum-hat": { w: 1122, h: 1402, alt: { ru: "Бархатная шапочка с золотой вышивкой в музейной витрине", en: "A velvet hat with gold embroidery in a museum case" } },
};

export const HERO = { name: "hat-on-head", pos: "62% 30%" };

export const UI = {
  ru: {
    eyebrowOrig: "Зæриндагхуыд",
    title: "Золотая нить",
    sub: "История, вышитая золотом",
    lede: "Шёлк в нашей прошлой истории рассказывал о воздухе. Золото рассказывает о весе — и о том, что остаётся, когда всё остальное истлело.",
    sequel: "Продолжение истории «Цыллæ хыз»",
    scroll: "Листайте",
    back: "Вернуться в Академию",
    sourcesTitle: "Источники",
    sourcesLead: "Все факты в этой истории — из двух статей научных сотрудников СОИГСИ им. В. И. Абаева.",
    firstEyebrow: "Первая история",
    firstTitle: "Осетинский шёлковый платок",
    firstText: "Цыллæ хыз: как из шёлковой нити появляется ажурный платок и почему ремесло продолжает жить.",
    firstCta: "Читать",
    metaTitle: "Золотая нить. Зæриндагхуыд — MIYU Academy",
    metaDesc: "Визуальная история о золотном шитье Осетии: как золотая нить приходила в горные сёла, кто вышивал ею наряд невесты и почему ремесло прервалось на сто лет — и возвращается.",
  },
  en: {
    eyebrowOrig: "Зæриндагхуыд",
    title: "The Golden Thread",
    sub: "A Story Embroidered in Gold",
    lede: "In our last story, silk spoke of air. Gold speaks of weight — and of what remains when everything else has decayed.",
    sequel: "A sequel to the story “Tsyllæ khyz”",
    scroll: "Scroll",
    back: "Back to the Academy",
    sourcesTitle: "Sources",
    sourcesLead: "Every fact in this story comes from two articles by researchers of the V. I. Abaev North Ossetian Institute for Humanitarian and Social Studies.",
    firstEyebrow: "The first story",
    firstTitle: "The Ossetian Silk Headscarf",
    firstText: "Tsyllæ khyz: how fine silk thread becomes an open-net headscarf, and why the craft lives on.",
    firstCta: "Read",
    metaTitle: "The Golden Thread. Zærindaghuyd — MIYU Academy",
    metaDesc: "A visual story about Ossetian gold embroidery: how gold thread reached mountain villages, who embroidered a bride's attire with it, and why the craft broke off for a hundred years — and is coming back.",
  },
} as const;

/** Required by the SOIGSI site: materials are used with a link to the source. Articles are in Russian. */
export const SOURCES: { author: L; title: string; where: L; url: string }[] = [
  {
    author: { ru: "Э. Дзагоева, научный сотрудник СОИГСИ им. В. И. Абаева", en: "E. Dzagoeva, researcher, V. I. Abaev SOIGSI" },
    title: "Золотное шитьё. Вышивальщицы Осетии в конце XVIII – начале XX веков",
    where: { ru: "газета «Северная Осетия», спецпроект «Женщина в зеркале осетинских традиций», 2025", en: "Severnaya Osetiya newspaper, special project “Woman in the Mirror of Ossetian Traditions”, 2025 (in Russian)" },
    url: "https://sevosetia.ru/tpost/yx6c7jzz81-zolotnoe-shite-vishivalschitsi-osetii-v",
  },
  {
    author: { ru: "Ф. Абаева, кандидат филологических наук, старший научный сотрудник СОИГСИ им. В. И. Абаева", en: "F. Abaeva, PhD in philology, senior researcher, V. I. Abaev SOIGSI" },
    title: "Осетинское женское рукоделие: вышивка",
    where: { ru: "СОИГСИ, тот же проект, 31.01.2025", en: "SOIGSI, the same project, 31 January 2025 (in Russian)" },
    url: "https://www.soigsi.com/index.php/proekty/zhenshchina-v-zerkale-osetinskikh-traditsij/2262-osetinskoe-zhenskoe-rukodelie-vyshivka",
  },
];

/* ---------------------------------------------------------------- activities */

export const ACT = { ru: "Попробуйте", en: "Try it" } as const;

/** [[barter]] — chapter 01. */
export const BARTER = {
  ru: {
    eyebrow: "Глава 01 · попробуйте", title: "Курица за клубок",
    lead: "Отряд остановился на отдых. Выберите, с чем выйти к стоянке.",
    basket: "Корзина", counter: "У путешественников",
    items: {
      hen: "Курица", goose: "Гусь", butter: "Масло", cheese: "Сыр", bread: "Хлеб", coins: "Деньги",
    },
    put: "Положить в корзину", taken: "в корзине",
    notes: {
      common: "С этим осетинки выходили к стоянке: «с курами, гусями, маслом, сыром, хлебом».",
      coins: "«Деньги их интересовали меньше, чем канитель».",
      hen: "«За два клубка, которые в лавке стоили не больше пяти копеек, давали хорошую курицу».",
    },
    skeins: "Два клубка канители",
    done: "Два клубка — не больше пяти копеек в лавке. Для вышивальщицы — золото для целого узора.",
    again: "Начать сначала",
  },
  en: {
    eyebrow: "Chapter 01 · try it", title: "A hen for a skein",
    lead: "The travellers' party has stopped to rest. Choose what to bring out to them.",
    basket: "Basket", counter: "The travellers",
    items: {
      hen: "Hen", goose: "Goose", butter: "Butter", cheese: "Cheese", bread: "Bread", coins: "Money",
    },
    put: "Put in the basket", taken: "in the basket",
    notes: {
      common: "This is what Ossetian women came out with: “hens, geese, butter, cheese and bread”.",
      coins: "“They were less interested in money than in purl.”",
      hen: "“For two skeins that cost no more than five kopecks in a shop, they gave a good hen.”",
    },
    skeins: "Two skeins of purl",
    done: "Two skeins: no more than five kopecks in a shop. For an embroiderer, gold for a whole pattern.",
    again: "Start again",
  },
};

/** [[stitch]] — chapter 03. */
export const STITCH = {
  ru: {
    eyebrow: "Глава 03 · попробуйте", title: "Вприкреп по счёту",
    lead: "Золото лежит рядами поверх настила. Выберите, через сколько ниток настила класть стежок и куда сдвигать ряд.",
    count: "Счёт", every: (n: number) => `через ${n}`,
    shift: "Сдвиг ряда", shifts: { check: "клетка", slant: "косая полоса", herring: "ёлочка" },
    length: "Стежок", lengths: { long: "даргъ зул", short: "цыбыр зул" }, lengthNote: { long: "«длинный шов»", short: "«короткий»" },
    pictureOf: "На золоте проступает:",
    caption: "У осетинских вышивальщиц для этого приёма было своё слово — зултæ, «кривой». Вероятно, оно возникло из-за косых линий, которые прикреп рисует на золоте.",
    svgLabel: (p: string) => `Золотые ряды с прикрепом: ${p}`,
  },
  en: {
    eyebrow: "Chapter 03 · try it", title: "Counted couching",
    lead: "The gold lies in rows over the padding. Choose how many padding threads to count between stitches, and how to shift each row.",
    count: "Count", every: (n: number) => `every ${n}`,
    shift: "Row shift", shifts: { check: "check", slant: "slanting stripe", herring: "herringbone" },
    length: "Stitch", lengths: { long: "dargh zul", short: "tsybyr zul" }, lengthNote: { long: "“long stitch”", short: "“short”" },
    pictureOf: "A pattern shows through on the gold:",
    caption: "Ossetian embroiderers had their own word for this technique — zultæ, “crooked”. It probably came from the slanting lines the couching draws on the gold.",
    svgLabel: (p: string) => `Rows of gold with couching: ${p}`,
  },
};

/** [[assemble]] — chapter 03. */
export const ASSEMBLE = {
  ru: {
    eyebrow: "Глава 03 · попробуйте", title: "Узор из кусочков",
    lead: "Узор шили не прямо на шапочке, а частями на маленьких пяльцах. Пройдите путь одного кусочка, а потом соберите узор.",
    steps: [
      { k: "Вышить", t: "Золото кладут поверх настила и пришивают тончайшим шёлком." },
      { k: "Вырезать", t: "«Готовый вышитый кусочек вырезали из пялец»." },
      { k: "Натереть клыком", t: "«С лицевой стороны его лощили и натирали кабаньим клыком»." },
      { k: "Проклеить", t: "«С изнанки проклеивали холстом, чтобы он стал прочным и твёрдым»." },
    ],
    next: "Дальше", back: "Назад",
    place: "Теперь разложите кусочки на шапочке: выберите кусочек, потом его место.",
    pieces: { tree: "Ветвь", rosette: "Розетка", leftScroll: "Рога слева", rightScroll: "Рога справа", crown: "Макушка" },
    slot: (n: string) => `Место: ${n}`,
    pick: "Выберите кусочек", wrong: "Сравните контур — этот кусочек для другого места.",
    done: "Форма задана только внешним контуром, внутри нет отдельных линий. «По этой особенности исследователи и узнают аппликационный характер осетинского золотного шитья».",
    again: "Начать сначала",
  },
  en: {
    eyebrow: "Chapter 03 · try it", title: "A pattern made of pieces",
    lead: "The pattern was not stitched straight onto the hat; it was made in parts on small hoops. Follow one piece, then assemble the pattern.",
    steps: [
      { k: "Embroider", t: "The gold is laid over the padding and stitched down with the finest silk." },
      { k: "Cut out", t: "“A finished embroidered piece was cut out of the hoop.”" },
      { k: "Rub with a tusk", t: "“Its front was burnished and rubbed with a boar’s tusk.”" },
      { k: "Back with linen", t: "“Its back was glued to linen to make it firm and strong.”" },
    ],
    next: "Next", back: "Back",
    place: "Now lay the pieces on the hat: choose a piece, then its place.",
    pieces: { tree: "Branch", rosette: "Rosette", leftScroll: "Horns, left", rightScroll: "Horns, right", crown: "Crown" },
    slot: (n: string) => `Place: ${n}`,
    pick: "Choose a piece", wrong: "Compare the outline — this piece belongs somewhere else.",
    done: "The shape is given only by the outer contour, with no separate lines inside. “By this feature researchers recognise the appliqué nature of Ossetian gold embroidery.”",
    again: "Start again",
  },
};

/** [[motifs]] — chapter 04. `where` lists the parts of the attire the text names. */
export const MOTIFS = {
  ru: {
    eyebrow: "Глава 04 · попробуйте", title: "Четыре семьи узоров",
    lead: "Нажмите на мотив — на наряде подсветится, где он жил, если исследователи это описали.",
    items: {
      tree: { name: "Дерево Жизни", text: "«Деревом украшали подвесные рукава и само платье». Образ мирового дерева — общекавказский и очень древний." },
      rosette: { name: "Вихревая розетка", text: "Вместе с Деревом Жизни — «самые частые композиции на женской одежде»." },
      horns: { name: "Бараньи рога", text: "Чаще всего его связывают с фарном — благодатью. «Звери и рога в горах, растения на равнине»." },
      scrolls: { name: "Двойные завитки", text: "Из общего стержня завитки расходятся в противоположные стороны. «Их часто вышивали на верхушках шапочек и по кайме»." },
    },
    parts: { sleeves: "подвесные рукава", dress: "платье", crown: "макушка шапочки", border: "кайма" },
    where: "Где на наряде:", nowhere: "Место на наряде в статьях не названо.",
    caution: "Исследователи говорят о том, что мотив чаще всего означал, а не о том, что думала каждая вышивальщица.",
    svgLabel: "Силуэт праздничного наряда",
  },
  en: {
    eyebrow: "Chapter 04 · try it", title: "Four families of patterns",
    lead: "Choose a motif: the attire lights up where it lived, if researchers have described it.",
    items: {
      tree: { name: "Tree of Life", text: "“The Tree decorated the hanging sleeves and the dress itself.” The image of the world tree is common to the Caucasus and very old." },
      rosette: { name: "Whirl Rosette", text: "Together with the Tree of Life, “the most frequent compositions on women’s clothing”." },
      horns: { name: "Ram’s horns", text: "Most often it is linked to farn — grace. “Animals and horns in the mountains, plants on the plain.”" },
      scrolls: { name: "Double scrolls", text: "From a common stem, the spirals turn in opposite directions. “They were often embroidered on the crowns of hats and along borders.”" },
    },
    parts: { sleeves: "hanging sleeves", dress: "dress", crown: "crown of the hat", border: "border" },
    where: "Where on the attire:", nowhere: "The articles do not name a place on the attire.",
    caution: "Researchers speak of what a motif most often meant, not of what each embroiderer thought.",
    svgLabel: "Outline of the festive attire",
  },
};

/** [[hat]] — chapter 05. The last layer is the veil from the first story. */
export const HAT = {
  ru: {
    eyebrow: "Глава 05 · попробуйте", title: "Шапочка слой за слоем",
    lead: "Шапочку-гопп делали слоями. Соберите её от основы до последнего слоя убора.",
    layers: [
      { k: "Основа", t: "«Основу вырезали из картона или из тонкой кожи, сафьяна»." },
      { k: "Мягкий слой", t: "«Покрывали тканью с тонким слоем ваты или шерсти»." },
      { k: "Бархат", t: "«Затем обтягивали бархатом или плотным цветным шёлком»." },
      { k: "Золото", t: "«И только после этого к шапочке прикрепляли золотые и серебряные детали узора — те самые кусочки, вышитые отдельно на пяльцах»." },
      { k: "Обшивка", t: "«В конце шапочку окончательно обшивали»." },
      { k: "Платок", t: "«Шапочка была первым слоем праздничного образа, а платок — последним»." },
    ],
    next: "Следующий слой", back: "Назад", step: (i: number, n: number) => `Слой ${i} из ${n}`,
    veilLink: "Об этом платке — история «Цыллæ хыз»",
    svgLabel: (k: string) => `Шапочка: ${k}`,
  },
  en: {
    eyebrow: "Chapter 05 · try it", title: "The hat, layer by layer",
    lead: "The gopp was made in layers. Build it from the base to the last layer of the headdress.",
    layers: [
      { k: "Base", t: "“The base was cut from cardboard or thin leather, morocco.”" },
      { k: "Soft layer", t: "“It was covered with fabric over a thin layer of cotton wadding or wool.”" },
      { k: "Velvet", t: "“Then it was covered with velvet or dense coloured silk.”" },
      { k: "Gold", t: "“Only after that were the gold and silver parts of the pattern attached — the very pieces embroidered separately on the hoops.”" },
      { k: "Edging", t: "“Finally the hat was edged and finished.”" },
      { k: "Headscarf", t: "“The hat was the first layer of festive dress, and the headscarf the last.”" },
    ],
    next: "Next layer", back: "Back", step: (i: number, n: number) => `Layer ${i} of ${n}`,
    veilLink: "This headscarf has its own story: “Tsyllæ khyz”",
    svgLabel: (k: string) => `The hat: ${k}`,
  },
};

/** [[words]] — chapter 07. Front: the Ossetian word; back: its meaning and where it lived (from the text). */
export const WORDS: { os: string; lat: string; back: L }[] = [
  { os: "зæриндаг", lat: "zærindag", back: { ru: "Золотная нить, канитель. Для вышивальщицы — целый набор материалов.", en: "Gold thread, or purl. For an embroiderer, a whole set of materials." } },
  { os: "зæриндагхуыд", lat: "zærindaghuyd", back: { ru: "Золотное шитьё. У ремесла собственное, не заимствованное имя.", en: "Gold embroidery. The craft has its own name, not a borrowed one." } },
  { os: "хæрдгæхуыд", lat: "khærdgækhuyd", back: { ru: "Общее название для шитья золотом и серебром вприкреп.", en: "The general name for couching in gold and silver." } },
  { os: "зултæ", lat: "zultæ", back: { ru: "«Кривой» — так называли узорный прикреп по счёту.", en: "“Crooked” — the word for counted couching." } },
  { os: "пæратæ", lat: "pæratæ", back: { ru: "Пайетки разной формы: золотые, серебряные, зелёные, синие.", en: "Sequins of different shapes: gold, silver, green and blue." } },
  { os: "хæрдог", lat: "khærdog", back: { ru: "Разноцветный бисер.", en: "Beads of many colours." } },
  { os: "гопп", lat: "gopp", back: { ru: "Шапочка — непременная часть женского национального костюма.", en: "The hat — an essential part of the women’s national costume." } },
  { os: "хæрдгæбыд", lat: "khærdgæbyd", back: { ru: "Золотой шнур, сплетённый вручную на пяльцах: им выкладывали стебли и тонкие линии.", en: "A gold cord braided by hand on the hoop, for plant stems and fine lines." } },
  { os: "тъæпæнбыд · тымбылбыд", lat: "tæpænbyd · tymbylbyd", back: { ru: "Плоское и круглое плетение: пуговицы и петли для черкески, бешмета, мужской рубахи.", en: "Flat and round braiding: buttons and loops for a cherkeska, a beshmet, a man’s shirt." } },
];

export const WORDS_UI = {
  ru: { eyebrow: "Глава 07 · попробуйте", title: "Словарь ремесла", lead: "Слово осталось. Переверните карточки — за каждым словом часть ремесла.", turn: "Перевернуть", turnBack: "Обратно" },
  en: { eyebrow: "Chapter 07 · try it", title: "The craft’s vocabulary", lead: "The word remained. Turn the cards: behind each word is a piece of the craft.", turn: "Turn over", turnBack: "Turn back" },
};

/** [[dress]] — the epilogue. Items are put on in any order; head items wait for the hat with a gentle hint. */
export const DRESS = {
  ru: {
    eyebrow: "Финал · попробуйте", title: "Соберите наряд невесты",
    lead: "Выберите вещи из сундука в любом порядке. У каждой — строка из этой истории.",
    chest: "Сундук", velvet: "Цвет бархата", sleeve: "Узор на рукавах",
    colors: { crimson: "бордовый", green: "тёмно-зелёный", black: "чёрный" },
    patterns: { tree: "Дерево Жизни", rosette: "розетка", horns: "рога", scrolls: "завитки" },
    items: {
      dress: { name: "Бархатное платье", line: "«Шили его из бархата — хъæдабæ, шёлка — дари, шерсти — фæсмын»." },
      sleeves: { name: "Подвесные рукава", line: "«Узоры из золотых и серебряных нитей и галун шли по краям, по платью и подвесным рукавам»." },
      belt: { name: "Пояс", line: "«Нужно успеть расшить шапочку, подвесные рукава, края кафтанчика, пояс, подарки»." },
      shoes: { name: "Чувяки", line: "«Золото было даже на обуви: галуном и вышивкой украшали чувяки, ноговицы, мягкие сапоги»." },
      hat: { name: "Шапочка-гопп", line: "«На ней держится весь головной убор, и именно её особенно богато расшивали золотом»." },
      veils: { name: "Покрывала", line: "«В исторических описаниях свадебного наряда под покрывалами — украшенная шапочка»." },
      scarf: { name: "Ажурный платок", line: "«Шапочка была первым слоем праздничного образа, а платок — последним»." },
    },
    on: "надето", take: "Надеть", off: "Снять",
    hatFirst: "Сначала шапочка — на ней держится весь убор.",
    done: "Наряд собран. Золото на шапочке — из этой истории, шёлк платка — из первой.",
    firstLink: "Читать «Цыллæ хыз»",
    again: "Собрать заново",
    svgLabel: (n: number) => `Невеста, вид со спины. Надето вещей: ${n} из 7`,
  },
  en: {
    eyebrow: "Finale · try it", title: "Dress the bride",
    lead: "Choose things from the chest in any order. Each one comes with a line from this story.",
    chest: "The chest", velvet: "Velvet colour", sleeve: "Pattern on the sleeves",
    colors: { crimson: "crimson", green: "dark green", black: "black" },
    patterns: { tree: "Tree of Life", rosette: "rosette", horns: "horns", scrolls: "scrolls" },
    items: {
      dress: { name: "Velvet dress", line: "“It was made of velvet — qædabæ, silk — dari, and wool — fæsmyn.”" },
      sleeves: { name: "Hanging sleeves", line: "“Patterns of gold and silver thread and galloon ran along the edges, over the dress and the hanging sleeves.”" },
      belt: { name: "Belt", line: "“The hat, the hanging sleeves, the edges of the little caftan, the belt, the gifts all have to be embroidered in time.”" },
      shoes: { name: "Soft shoes", line: "“There was gold even on footwear: soft shoes, gaiters and soft boots were trimmed with galloon and embroidery.”" },
      hat: { name: "The gopp hat", line: "“The whole headdress rests on it, and it was embroidered with gold especially richly.”" },
      veils: { name: "Veils", line: "“In historical descriptions of wedding attire, under the veils there is a decorated hat.”" },
      scarf: { name: "Openwork headscarf", line: "“The hat was the first layer of festive dress, and the headscarf the last.”" },
    },
    on: "worn", take: "Put on", off: "Take off",
    hatFirst: "The hat first — the whole headdress rests on it.",
    done: "The attire is complete. The gold on the hat is from this story; the silk of the headscarf is from the first one.",
    firstLink: "Read “Tsyllæ khyz”",
    again: "Start again",
    svgLabel: (n: number) => `The bride, seen from behind. Items worn: ${n} of 7`,
  },
};
