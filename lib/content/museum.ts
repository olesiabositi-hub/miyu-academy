import type { Locale } from "@/lib/course";

/**
 * Copy and picture choices for the academy home ("The Living Museum", October 2026).
 * Course blurbs, the author block and story texts come from their own registries; everything
 * written only for the home page lives here, in both languages.
 *
 * Exhibit fragments are quoted word for word from the approved lessons. Route texts compare
 * what the lessons themselves say; keep them in step if a lesson changes.
 */
type L = Record<Locale, string>;
type Img = { src: string; src960?: string; w: number; h: number; pos?: string };

const V = "/visuals";

export const HOME: Record<Locale, {
  kicker: string; h1a: string; h1b: string; lead: string; choose: string; how: string;
  strip: string[];
  whyEyebrow: string; why: [string, string, string]; pillars: { t: string; b: string }[];
  coursesEyebrow: string; coursesTitle: string; coursesLead: string;
  newCourse: string; onlineCourse: string; visualStory: string; open: string; storyOpen: string; storyFirst: string;
  exhibitEyebrow: string; exhibitTitleA: string; exhibitTitleB: string; exhibitMore: string; exhibitNote: string; exhibitLabel: string;
  actsEyebrow: string; actsTitle: string; actsLead: string;
  routesEyebrow: string; routesTitleA: string; routesTitleB: string; routesLead: string; route: string;
  howEyebrow: string; howTitle: string;
  indexEyebrow: string; indexTitle: string; live: string; soon: string;
  supportEyebrow: string; supportTitleA: string; supportTitleB: string; support1: string; support2: string; supportBtn: string; supportNote: string;
  faqEyebrow: string; faqTitle: string;
  ctaTitleA: string; ctaTitleB: string; ctaBody: string;
  continueHello: string; continueBtn: string; continueDone: string; moduleOf: string;
  metaTitle: string; metaDesc: string;
}> = {
  ru: {
    kicker: "Мифы · цивилизации · ремёсла",
    h1a: "Мир полон историй.",
    h1b: "Научитесь их читать.",
    lead: "Курсы и визуальные истории о культурах мира. Знание, которое начинает работать за пределами урока: в словах, именах, вещах и в том, как вы смотрите на привычное.",
    choose: "Выбрать мир",
    how: "Как это работает",
    strip: ["RU / EN", "в своём темпе", "тесты по желанию", "открыто для всех"],
    whyEyebrow: "Зачем это всё",
    why: [
      "Мифы не остались в прошлом. Богиня победы — на ваших кроссовках, сирена — на стаканчике кофе, Медуза — на логотипе модного дома. ",
      "MIYU показывает, откуда всё это пришло",
      " — и после этого привычный мир уже не выглядит прежним.",
    ],
    pillars: [
      { t: "Без подготовки", b: "Карта мира собирается постепенно, глава за главой." },
      { t: "Без давления", b: "Проверки только для себя. Можно просто читать." },
      { t: "Два языка", b: "Русский и английский переключаются в любой момент." },
    ],
    coursesEyebrow: "Курсы",
    coursesTitle: "Пять миров открыты",
    coursesLead: "Начните с того, что зовёт сильнее. Каждый курс самостоятельный: порядок не важен, подготовка не нужна.",
    newCourse: "Новый курс",
    onlineCourse: "Онлайн-курс",
    visualStory: "Визуальная история",
    open: "О курсе",
    storyOpen: "Смотреть историю",
    storyFirst: "Первая история:",
    exhibitEyebrow: "Экспонат",
    exhibitTitleA: "Лучше один раз прочитать, ",
    exhibitTitleB: "чем сто раз услышать",
    exhibitMore: "Читать дальше",
    exhibitNote: "Каждый визит — новый фрагмент",
    exhibitLabel: "фрагмент урока",
    actsEyebrow: "Интерактивы",
    actsTitle: "Здесь можно не только читать",
    actsLead: "В уроки встроены маленькие задания. Без баллов и таймеров: просто чтобы понять глубже и запомнить надолго.",
    routesEyebrow: "Маршруты",
    routesTitleA: "Один вопрос — ",
    routesTitleB: "несколько миров",
    routesLead: "Разные народы задавали одни и те же вопросы. Пройдите по одному из них через несколько курсов и посмотрите, как по-разному на него отвечали.",
    route: "Маршрут",
    howEyebrow: "Как устроено обучение",
    howTitle: "Три шага от интереса к пониманию",
    indexEyebrow: "Указатель",
    indexTitle: "Новые миры уже в работе",
    live: "Открыт",
    soon: "Скоро",
    supportEyebrow: "Поддержать проект",
    supportTitleA: "Знания остаются ",
    supportTitleB: "открытыми",
    support1: "MIYU — независимый проект. Здесь нет рекламы и платного доступа: курсы и истории открыты для всех.",
    support2: "Если вам нравится то, что здесь происходит, можно помочь появиться новым мирам. Разово или каждый месяц, от 5 € — по желанию и без обязательств.",
    supportBtn: "Поддержать на Ko-fi",
    supportNote: "Оплата картой или PayPal",
    faqEyebrow: "Вопросы",
    faqTitle: "Частые вопросы",
    ctaTitleA: "Привычный мир станет ",
    ctaTitleB: "глубже",
    ctaBody: "Пять миров уже открыты. Начните с любого — в своём темпе, на русском или английском. Одна глава, и смотреть на знакомые вещи по-старому уже не получится.",
    continueHello: "С возвращением",
    continueBtn: "Продолжить",
    continueDone: "{done} из {total} модулей пройдено",
    moduleOf: "модуль {n} из {total}",
    metaTitle: "MIYU Academy — мир полон историй",
    metaDesc: "Курсы и визуальные истории о мифах, цивилизациях и ремёслах: греческая и скандинавская мифология, Древний Египет, осетинский шёлковый платок и золотное шитьё. На русском и английском, открыто для всех.",
  },
  en: {
    kicker: "Myths · civilisations · crafts",
    h1a: "The world is full of stories.",
    h1b: "Learn to read them.",
    lead: "Courses and visual stories about the world's cultures. Knowledge that keeps working outside the lesson: in words, names, objects, and the way you look at the familiar.",
    choose: "Choose a world",
    how: "How it works",
    strip: ["RU / EN", "self-paced", "tests optional", "open to everyone"],
    whyEyebrow: "Why it matters",
    why: [
      "Myths never stayed in the past. The goddess of victory is on your trainers, a siren is on your coffee cup, Medusa is on a fashion house's logo. ",
      "MIYU shows where all of it came from",
      " — and after that, the familiar world never looks quite the same.",
    ],
    pillars: [
      { t: "No background needed", b: "The map comes together gradually, chapter by chapter." },
      { t: "No pressure", b: "Checks are just for you. You can simply read." },
      { t: "Two languages", b: "Switch between Russian and English at any moment." },
    ],
    coursesEyebrow: "Courses",
    coursesTitle: "Five worlds are open",
    coursesLead: "Start with whatever calls to you most. Every course stands on its own: no set order, no background needed.",
    newCourse: "New course",
    onlineCourse: "Online course",
    visualStory: "Visual story",
    open: "About the course",
    storyOpen: "View the story",
    storyFirst: "The first story:",
    exhibitEyebrow: "Exhibit",
    exhibitTitleA: "Better to read it once ",
    exhibitTitleB: "than hear about it a hundred times",
    exhibitMore: "Keep reading",
    exhibitNote: "A new fragment on every visit",
    exhibitLabel: "lesson fragment",
    actsEyebrow: "Interactive",
    actsTitle: "More than reading",
    actsLead: "Small tasks are built into the lessons. No points, no timers: just a way to understand more deeply and remember for longer.",
    routesEyebrow: "Routes",
    routesTitleA: "One question, ",
    routesTitleB: "several worlds",
    routesLead: "Different peoples asked the same questions. Follow one of them through several courses and see how differently it was answered.",
    route: "Route",
    howEyebrow: "How learning works",
    howTitle: "Three steps from curiosity to understanding",
    indexEyebrow: "Index",
    indexTitle: "New worlds are in the works",
    live: "Open",
    soon: "Soon",
    supportEyebrow: "Support the project",
    supportTitleA: "Knowledge stays ",
    supportTitleB: "open",
    support1: "MIYU is an independent project. There are no ads and no paywall: the courses and stories are open to everyone.",
    support2: "If you enjoy what happens here, you can help new worlds appear. Once or monthly, from €5 — entirely up to you, with no strings attached.",
    supportBtn: "Support on Ko-fi",
    supportNote: "Pay by card or PayPal",
    faqEyebrow: "Questions",
    faqTitle: "Frequently asked questions",
    ctaTitleA: "The familiar world is about to get ",
    ctaTitleB: "deeper",
    ctaBody: "Five worlds are already open. Start with any of them, at your own pace, in Russian or English. One chapter, and you won't see familiar things the old way again.",
    continueHello: "Welcome back",
    continueBtn: "Continue",
    continueDone: "{done} of {total} modules completed",
    moduleOf: "module {n} of {total}",
    metaTitle: "MIYU Academy — The World Is Full of Stories",
    metaDesc: "Courses and visual stories about myths, civilisations and crafts: Greek and Norse mythology, Ancient Egypt, the Ossetian silk headscarf and gold embroidery. In Russian and English, open to everyone.",
  },
};

/** The worlds across the first screen. `course` links to a course id, `story` to a story id. */
export const PANELS: { num: string; ref: { course?: string; story?: string }; title: L; meta: L; img: Img }[] = [
  { num: "01", ref: { course: "greek-mythology" }, title: { ru: "Греческая мифология", en: "Greek Mythology" }, meta: { ru: "8 модулей · ≈ 3,5 ч", en: "8 modules · ≈ 3.5 h" }, img: { src: `${V}/home/academy-arch-860.webp`, w: 860, h: 821, pos: "50% 50%" } },
  { num: "02", ref: { course: "norse-mythology" }, title: { ru: "Скандинавская мифология", en: "Norse Mythology" }, meta: { ru: "9 модулей · 3,5–4,5 ч", en: "9 modules · 3.5–4.5 h" }, img: { src: `${V}/norse/home/hero-1916.webp`, src960: `${V}/norse/home/hero-960.webp`, w: 1916, h: 821, pos: "72% 50%" } },
  { num: "03", ref: { course: "egyptian-mythology" }, title: { ru: "Древний Египет", en: "Ancient Egypt" }, meta: { ru: "Новый курс · 6 модулей", en: "New course · 6 modules" }, img: { src: `${V}/egypt/home/10-starlit-nile-beneath-the-pyramids-1672.webp`, src960: `${V}/egypt/home/10-starlit-nile-beneath-the-pyramids-960.webp`, w: 1672, h: 941, pos: "46% 50%" } },
  { num: "04", ref: { story: "ossetian-headscarf" }, title: { ru: "Осетинский шёлковый платок", en: "The Ossetian Silk Headscarf" }, meta: { ru: "Визуальная история · 8 глав", en: "Visual story · 8 chapters" }, img: { src: `${V}/ossetian-headscarf/towers-solitude-1149.webp`, src960: `${V}/ossetian-headscarf/towers-solitude-800.webp`, w: 1149, h: 1369, pos: "40% 40%" } },
  { num: "05", ref: { story: "ossetian-gold-embroidery" }, title: { ru: "Золотая нить", en: "The Golden Thread" }, meta: { ru: "Визуальная история · 7 глав", en: "Visual story · 7 chapters" }, img: { src: `${V}/ossetian-gold-embroidery/museum-hat-1122.webp`, src960: `${V}/ossetian-gold-embroidery/museum-hat-800.webp`, w: 1122, h: 1402, pos: "50% 45%" } },
];

/** Course spreads: the newest course first and full bleed, then two editorial spreads. */
export const SPREADS: Record<string, { num: string; img: Img; facts: { v: L; l: L }[] }> = {
  "egyptian-mythology": { num: "03", img: { src: `${V}/egypt/home/07-sunset-journey-to-egyptian-temple-1672.webp`, src960: `${V}/egypt/home/07-sunset-journey-to-egyptian-temple-960.webp`, w: 1672, h: 941, pos: "50% 60%" },
    facts: [{ v: { ru: "6", en: "6" }, l: { ru: "модулей", en: "modules" } }, { v: { ru: "2,5–3,5 ч", en: "2.5–3.5 h" }, l: { ru: "в своём темпе", en: "at your own pace" } }, { v: { ru: "✓", en: "✓" }, l: { ru: "тесты по желанию", en: "tests optional" } }] },
  "greek-mythology": { num: "01", img: { src: `${V}/home/course-hero-1916.webp`, src960: `${V}/home/course-hero-960.webp`, w: 1916, h: 821, pos: "64% 50%" },
    facts: [{ v: { ru: "8", en: "8" }, l: { ru: "модулей", en: "modules" } }, { v: { ru: "≈ 3,5 ч", en: "≈ 3.5 h" }, l: { ru: "в своём темпе", en: "at your own pace" } }, { v: { ru: "15", en: "15" }, l: { ru: "вопросов в финале", en: "final questions" } }] },
  "norse-mythology": { num: "02", img: { src: `${V}/norse/home/runes-1448.webp`, src960: `${V}/norse/home/runes-960.webp`, w: 1448, h: 1086, pos: "52% 50%" },
    facts: [{ v: { ru: "9", en: "9" }, l: { ru: "модулей", en: "modules" } }, { v: { ru: "3,5–4,5 ч", en: "3.5–4.5 h" }, l: { ru: "в своём темпе", en: "at your own pace" } }, { v: { ru: "✓", en: "✓" }, l: { ru: "тесты по желанию", en: "tests optional" } }] },
};

/** Pictures for the "Visual story" block, per story id. The block features the newest story in lib/stories.ts. */
export const STORY_ART: Record<string, { main: Img & { src960: string }; a: Img; b: Img }> = {
  "ossetian-headscarf": {
    main: { src: `${V}/ossetian-headscarf/silk-light-1448.webp`, src960: `${V}/ossetian-headscarf/silk-light-800.webp`, w: 1448, h: 1086 },
    a: { src: `${V}/ossetian-headscarf/netting-window-800.webp`, w: 800, h: 1000, pos: "50% 35%" },
    b: { src: `${V}/ossetian-headscarf/keepers-800.webp`, w: 800, h: 600, pos: "50% 50%" },
  },
  "ossetian-gold-embroidery": {
    main: { src: `${V}/ossetian-gold-embroidery/hat-on-head-1448.webp`, src960: `${V}/ossetian-gold-embroidery/hat-on-head-800.webp`, w: 1448, h: 965 },
    a: { src: `${V}/ossetian-gold-embroidery/tree-of-life-800.webp`, w: 800, h: 1000, pos: "50% 40%" },
    b: { src: `${V}/ossetian-gold-embroidery/hoop-closeup-800.webp`, w: 800, h: 533, pos: "50% 50%" },
  },
};

/** Lesson fragments, quoted verbatim. One is shown per visit. */
export const EXHIBITS: { course?: string; story?: string; module?: string; where: L; title: L; lines: Record<Locale, string[]>; img: Img; alt: L }[] = [
  {
    course: "egyptian-mythology", module: "module-04",
    where: { ru: "Древний Египет · модуль 4", en: "Ancient Egypt · module 4" },
    title: { ru: "Вы умерли. Но сначала пройдите проверку.", en: "You're Dead. But First, You Have to Pass the Test." },
    lines: { ru: ["Плохая новость: завтра не наступит.", "Вы умерли.", "Хорошая новость: древние египтяне вовсе не считали, что на этом всё заканчивается."], en: ["The bad news: tomorrow isn't coming.", "You've died.", "The good news: the ancient Egyptians did not believe that this was the end."] },
    img: { src: `${V}/egypt/m04/05-egyptian-hall-of-judgment-1448.webp`, src960: `${V}/egypt/m04/05-egyptian-hall-of-judgment-724.webp`, w: 1448, h: 1086 },
    alt: { ru: "Зал суда в египетском храме", en: "A hall of judgment in an Egyptian temple" },
  },
  {
    course: "norse-mythology", module: "module-08",
    where: { ru: "Скандинавская мифология · модуль 8", en: "Norse Mythology · module 8" },
    title: { ru: "Смерть — не конец. Условия обслуживания прилагаются.", en: "Death Isn't the End. Terms and Conditions Apply." },
    lines: { ru: ["Возможно, вы уже знаете ответ.", "Воин погибает в сражении.", "Валькирии подхватывают его.", "Он оказывается в Вальгалле."], en: ["Perhaps you already know the answer.", "A warrior dies in battle.", "Valkyries carry him away.", "He arrives in Valhalla."] },
    img: { src: `${V}/norse/m08/02-valhalla-einherjar-1448.webp`, src960: `${V}/norse/m08/02-valhalla-einherjar-724.webp`, w: 1448, h: 1086 },
    alt: { ru: "Пир воинов в Вальгалле", en: "Warriors feasting in Valhalla" },
  },
  {
    course: "greek-mythology", module: "module-01",
    where: { ru: "Греческая мифология · модуль 1", en: "Greek Mythology · module 1" },
    title: { ru: "Начнём не с Зевса", en: "Let's not start with Zeus" },
    lines: { ru: ["До Зевса было другое поколение богов.", "До него — ещё более древние существа."], en: ["Before Zeus, there was another generation of gods.", "And before them, there were even older beings."] },
    img: { src: `${V}/module-01/01-HERO-gaia-birth-of-order-1672.webp`, src960: `${V}/module-01/01-HERO-gaia-birth-of-order-836.webp`, w: 1672, h: 941 },
    alt: { ru: "Гея и рождение порядка", en: "Gaia and the birth of order" },
  },
  {
    story: "ossetian-headscarf",
    where: { ru: "Осетинский шёлковый платок · пролог", en: "The Ossetian Silk Headscarf · prologue" },
    title: { ru: "Вещь, которую хочется рассматривать медленно", en: "Something Worth Looking at Slowly" },
    lines: { ru: ["Невесомость обманчива. За ней — часы, недели, иногда месяцы человеческого времени."], en: ["Its weightlessness is deceptive. Behind it lie hours, weeks, sometimes months of a person's time."] },
    img: { src: `${V}/ossetian-headscarf/netting-window-1122.webp`, src960: `${V}/ossetian-headscarf/netting-window-800.webp`, w: 1122, h: 1402, pos: "50% 35%" },
    alt: { ru: "Женщина плетёт ажурную сетку у окна", en: "A woman netting an open-work headscarf by the window" },
  },
  {
    story: "ossetian-gold-embroidery",
    where: { ru: "Золотая нить · глава 07", en: "The Golden Thread · chapter 07" },
    title: { ru: "Нить, которая оборвалась на сто лет", en: "The thread that broke for a hundred years" },
    lines: { ru: ["Шёлк растили дома. Золото покупали.", "Может быть, поэтому одна нить выдержала, а другая оборвалась."], en: ["Silk was grown at home. Gold was bought.", "Perhaps that is why one thread held and the other broke."] },
    img: { src: `${V}/ossetian-gold-embroidery/empty-hoop-1448.webp`, src960: `${V}/ossetian-gold-embroidery/empty-hoop-800.webp`, w: 1448, h: 965 },
    alt: { ru: "Пустые пяльцы и недошитый золотой узор на бархате у сундука", en: "An empty hoop and an unfinished gold pattern on velvet by a chest" },
  },
];

export type ActKind = "scales" | "cartouche" | "rune" | "thread";
export const ACTS: { kind: ActKind; where: L; title: L; text: L; img: Img }[] = [
  { kind: "scales", where: { ru: "Древний Египет", en: "Ancient Egypt" }, title: { ru: "Весы Маат", en: "The Scales of Ma'at" }, text: { ru: "Правда или миф? Положите утверждение на весы и узнайте, что говорят об этом источники.", en: "Truth or myth? Put a statement on the scales and find out what the sources say." }, img: { src: `${V}/egypt/m04/01-weighing-of-the-heart-724.webp`, w: 724, h: 543, pos: "45% 50%" } },
  { kind: "cartouche", where: { ru: "Древний Египет", en: "Ancient Egypt" }, title: { ru: "Картуш", en: "Cartouche" }, text: { ru: "Запишите своё имя знаками, как писали имена фараонов. Имя никуда не отправляется.", en: "Write your name in signs, the way pharaohs' names were written. Your name is never sent anywhere." }, img: { src: `${V}/egypt/home/09-ancient-egyptian-study-at-sunset-960.webp`, w: 960, h: 540, pos: "30% 50%" } },
  { kind: "rune", where: { ru: "Скандинавская мифология", en: "Norse Mythology" }, title: { ru: "Мешочек рун", en: "The Rune Pouch" }, text: { ru: "За каждый пройденный модуль выпадает руна. Когда пройдёте все девять модулей, руны сложатся в ваше предсказание.", en: "Every module you finish draws a rune. Once all nine modules are done, your runes come together as your prophecy." }, img: { src: `${V}/norse/m03/04-elder-scholar-and-the-runestone-724.webp`, w: 724, h: 543, pos: "62% 50%" } },
  { kind: "thread", where: { ru: "Осетинский платок", en: "Ossetian headscarf" }, title: { ru: "Путь нити", en: "The Path of the Thread" }, text: { ru: "Пролистайте путь шёлка: от листа тутовника и кокона до челнока в руках мастерицы.", en: "Scroll the path of the silk: from mulberry leaf and cocoon to the shuttle in a craftswoman's hands." }, img: { src: `${V}/ossetian-headscarf/closeup-shuttle-800.webp`, w: 800, h: 600, pos: "50% 50%" } },
];

export const ROUTES: { num: string; title: L; text: L; stops: { course?: string; story?: string; module?: string; world: L; label: L; img: Img }[] }[] = [
  {
    num: "I",
    title: { ru: "Откуда берётся порядок", en: "Where order comes from" },
    text: {
      ru: "Греки начинают с Хаоса, скандинавы — с бездны между льдом и огнём, египтяне — с тёмных первозданных вод Нун. Ни в одном из миров порядок не дан сам собой: его создают и потом защищают.",
      en: "The Greeks begin with Chaos, the Norse with the void between ice and fire, the Egyptians with the dark primordial waters of Nun. In none of these worlds is order simply given: it has to be made, and then defended.",
    },
    stops: [
      { course: "greek-mythology", module: "module-01", world: { ru: "Греция · модуль 1", en: "Greece · module 1" }, label: { ru: "Хаос и Гея", en: "Chaos and Gaia" }, img: { src: `${V}/module-01/01-HERO-gaia-birth-of-order-836.webp`, w: 836, h: 470, pos: "50% 40%" } },
      { course: "norse-mythology", module: "module-01", world: { ru: "Скандинавия · модуль 1", en: "Scandinavia · module 1" }, label: { ru: "Гиннунгагап: лёд и огонь", en: "Ginnungagap: ice and fire" }, img: { src: `${V}/norse/m01/01-ginnungagap-ice-and-fire-724.webp`, w: 724, h: 543 } },
      { course: "egyptian-mythology", module: "module-01", world: { ru: "Египет · модуль 1", en: "Egypt · module 1" }, label: { ru: "Нун и первый холм", en: "Nun and the first mound" }, img: { src: `${V}/egypt/m01/01-nun-and-first-mound-724.webp`, w: 724, h: 543 } },
    ],
  },
  {
    num: "II",
    title: { ru: "Что ждёт после смерти", en: "What waits after death" },
    text: {
      ru: "В Египте умершего ждут сорок два судьи и сердце на весах Маат. У скандинавов адресов несколько: Вальгалла, Фолькванг и Хель, которая не ад, а просто другое место.",
      en: "In Egypt, the dead face forty-two judges and a heart on the scales of Ma'at. The Norse had several addresses: Valhalla, Fólkvangr, and Hel, which is not hell, just somewhere else.",
    },
    stops: [
      { course: "egyptian-mythology", module: "module-04", world: { ru: "Египет · модуль 4", en: "Egypt · module 4" }, label: { ru: "Путь к суду Осириса", en: "The road to Osiris's judgment" }, img: { src: `${V}/egypt/m04/04-journey-through-the-egyptian-afterlife-724.webp`, w: 724, h: 543 } },
      { course: "norse-mythology", module: "module-08", world: { ru: "Скандинавия · модуль 8", en: "Scandinavia · module 8" }, label: { ru: "Хель и дорога мёртвых", en: "Hel and the road of the dead" }, img: { src: `${V}/norse/m08/04-hel-underworld-724.webp`, w: 724, h: 543, pos: "40% 50%" } },
    ],
  },
  {
    num: "III",
    title: { ru: "Нить и судьба", en: "Thread and fate" },
    text: {
      ru: "У скандинавов судьба связана с норнами у источника Урд под корнями Иггдрасиля. В осетинском ремесле нить проходит долгий путь от кокона до ажурного платка. Два мира, где из самого тонкого вырастает самое важное.",
      en: "For the Norse, fate belongs to the Norns at the Well of Urd beneath the roots of Yggdrasil. In the Ossetian craft, a thread travels a long way from cocoon to open-work headscarf. Two worlds where the finest things grow into the most important.",
    },
    stops: [
      { course: "norse-mythology", module: "module-06", world: { ru: "Скандинавия · модуль 6", en: "Scandinavia · module 6" }, label: { ru: "Норны у источника Урд", en: "The Norns at the Well of Urd" }, img: { src: `${V}/norse/m06/05-norns-724.webp`, w: 724, h: 543, pos: "50% 40%" } },
      { story: "ossetian-headscarf", world: { ru: "Визуальная история", en: "Visual story" }, label: { ru: "От кокона к нити", en: "From cocoon to thread" }, img: { src: `${V}/ossetian-headscarf/spinning-silk-800.webp`, w: 800, h: 1000, pos: "50% 35%" } },
    ],
  },
];

export const STEPS3: Record<Locale, { t: string; b: string; img: Img }[]> = {
  ru: [
    { t: "Выберите мир", b: "Мифология, древняя цивилизация или живое ремесло. Начните с того, что зовёт сильнее: курсы не зависят друг от друга.", img: { src: `${V}/egypt/home/01-golden-dawn-over-ancient-egypt-960.webp`, w: 960, h: 540, pos: "50% 50%" } },
    { t: "Читайте и смотрите", b: "Короткие главы, кинематографичные иллюстрации и интерактивы. Понятная логика вместо энциклопедии.", img: { src: `${V}/ossetian-headscarf/three-generations-800.webp`, w: 800, h: 600, pos: "50% 45%" } },
    { t: "Проверяйте себя, если хочется", b: "Быстрые вопросы по ходу и самопроверки без оценок и таймеров. Их можно пропустить и просто читать.", img: { src: `${V}/norse/m03/07-wisdom-duel-in-the-mead-hall-724.webp`, w: 724, h: 543, pos: "50% 50%" } },
  ],
  en: [
    { t: "Choose a world", b: "Mythology, an ancient civilisation or a living craft. Start with whatever calls to you most: the courses don't depend on each other.", img: { src: `${V}/egypt/home/01-golden-dawn-over-ancient-egypt-960.webp`, w: 960, h: 540, pos: "50% 50%" } },
    { t: "Read and look", b: "Short chapters, cinematic illustrations and interactive moments. Clear logic instead of an encyclopedia.", img: { src: `${V}/ossetian-headscarf/three-generations-800.webp`, w: 800, h: 600, pos: "50% 45%" } },
    { t: "Check yourself, if you like", b: "Quick questions along the way and self-checks without grades or timers. Skip them and simply read if you prefer.", img: { src: `${V}/norse/m03/07-wisdom-duel-in-the-mead-hall-724.webp`, w: 724, h: 543, pos: "50% 50%" } },
  ],
};

export const HOME_FAQ: Record<Locale, { q: string; a: string }[]> = {
  ru: [
    { q: "Нужна ли подготовка?", a: "Нет. Каждый курс собирает картину постепенно, глава за главой, и не требует знаний заранее. Курсы не зависят друг от друга: начинать можно с любого." },
    { q: "Сколько времени это займёт?", a: "Модули идут по 15–35 минут. Греческая мифология — около 3,5 часа, скандинавская — 3,5–4,5 часа, Древний Египет — 2,5–3,5 часа. Проходить можно в своём темпе, прогресс сохраняется." },
    { q: "Чем визуальная история отличается от курса?", a: "Курс — это модули с проверками по желанию и сохранением прогресса. Визуальная история — одна большая иллюстрированная страница без модулей и тестов, которую читают как книгу с картинками." },
    { q: "Обязательны ли тесты?", a: "Нет. Проверки в уроках — только для себя, без оценок и таймеров. В греческом курсе есть финальный Final Myth Decoder на 15 вопросов, тоже по желанию." },
    { q: "Сколько это стоит?", a: "Курсы и визуальные истории открыты для всех. Если захочется поддержать проект, это можно сделать на Ko-fi — разово или ежемесячно, только по желанию." },
    { q: "Нужен ли аккаунт?", a: "Нет. Регистрации нет: прогресс сохраняется в вашем браузере, и вы продолжите с того же места на этом устройстве." },
    { q: "На каком языке курсы?", a: "На русском и на английском. Языки можно переключать в любой момент." },
    { q: "Можно ли удалить свои данные?", a: "Мы не храним ваших данных. Прогресс живёт только в вашем браузере, стереть его можно в настройках приватности." },
  ],
  en: [
    { q: "Do I need any background?", a: "No. Every course builds the picture gradually, chapter by chapter, and assumes no prior knowledge. The courses don't depend on each other, so you can start with any of them." },
    { q: "How long does it take?", a: "Modules take 15–35 minutes each. Greek Mythology is about 3.5 hours, Norse Mythology 3.5–4.5 hours, Ancient Egypt 2.5–3.5 hours. Go at your own pace; your progress is saved." },
    { q: "How is a visual story different from a course?", a: "A course is a set of modules with optional checks and saved progress. A visual story is one large illustrated page with no modules or tests, read like a picture book." },
    { q: "Are the tests required?", a: "No. The checks in the lessons are just for you, with no grades or timers. The Greek course also has the 15-question Final Myth Decoder, which is optional too." },
    { q: "How much does it cost?", a: "The courses and visual stories are open to everyone. If you'd like to support the project, you can do so on Ko-fi, once or monthly, entirely if you wish." },
    { q: "Do I need an account?", a: "No. There is no sign-up: progress is saved in your browser, so you continue where you left off on this device." },
    { q: "Which languages are the courses in?", a: "Russian and English. You can switch between them at any time." },
    { q: "Can I delete my data?", a: "We do not keep your data. Progress lives only in your browser, and you can erase it in Privacy settings." },
  ],
};
