import type { Locale } from "@/lib/course";

/**
 * Activities that can be dropped into any lesson with one marker line in the module text:
 *
 *     [[activity:<id>]]
 *
 * (in its own `---` chunk, like a picture). Four kinds, all voluntary, no points, no timers:
 *  - scales     «Весы Маат»: put each statement on the scales — true (balances the feather) or myth (the pan sinks)
 *  - order      «Ладья Ра»: put cards into the right order, then check
 *  - match      «Кто есть кто»: pair names with what they stand for
 *  - cartouche  «Картуш»: write your name with Egyptian signs (no data needed, works in any module)
 *
 * To add one: copy an entry below, give it a new id, write RU + EN, and put `[[activity:<id>]]` into the
 * lesson (for Ancient Egypt: add it to ACTIVITIES in scripts/import_egypt.py so a re-import keeps it).
 * Every statement here repeats what the module itself says; nothing new is claimed.
 */
type L = Record<Locale, string>;

export type ScalesActivity = { kind: "scales"; title: L; intro: L; items: { text: L; truth: boolean; why: L }[] };
export type OrderActivity = { kind: "order"; title: L; intro: L; items: L[]; done: L };
export type MatchActivity = { kind: "match"; title: L; intro: L; pairs: { left: L; right: L }[]; done: L };
export type CartoucheActivity = { kind: "cartouche"; title: L; intro: L };
export type Activity = ScalesActivity | OrderActivity | MatchActivity | CartoucheActivity;

export const ACTIVITIES: Record<string, Activity> = {
  // ---------- Module 1 ----------
  "m01-elements": {
    kind: "match",
    title: { ru: "Кто есть кто: первая семья", en: "Who is who: the first family" },
    intro: { ru: "Соедините бога с тем, что он олицетворяет. Сначала выберите имя, потом — стихию.", en: "Match each deity with what they stand for. Pick a name first, then its element." },
    pairs: [
      { left: { ru: "Шу", en: "Shu" }, right: { ru: "воздух", en: "air" } },
      { left: { ru: "Тефнут", en: "Tefnut" }, right: { ru: "влага", en: "moisture" } },
      { left: { ru: "Геб", en: "Geb" }, right: { ru: "земля", en: "earth" } },
      { left: { ru: "Нут", en: "Nut" }, right: { ru: "небо", en: "sky" } },
    ],
    done: { ru: "Всё на месте. Земля — мужчина, небо — женщина: в Египте всё наоборот.", en: "All in place. Earth is male, sky is female: in Egypt it's the other way round." },
  },
  "m01-ennead": {
    kind: "order",
    title: { ru: "Ладья Ра: родословная Эннеады", en: "Ra's barque: the Ennead's family tree" },
    intro: { ru: "Расставьте поколения богов гелиопольской традиции по порядку — от первого к последнему.", en: "Put the generations of the Heliopolitan gods in order, from first to last." },
    items: [
      { ru: "Атум", en: "Atum" },
      { ru: "Шу и Тефнут", en: "Shu and Tefnut" },
      { ru: "Геб и Нут", en: "Geb and Nut" },
      { ru: "Осирис, Исида, Сет и Нефтида", en: "Osiris, Isis, Set and Nephthys" },
    ],
    done: { ru: "Девять богов — Великая Эннеада. Гор в этот классический список не входит.", en: "Nine gods: the Great Ennead. Horus is not part of this classic list." },
  },

  // ---------- Module 2 ----------
  "m02-family": {
    kind: "match",
    title: { ru: "Кто есть кто: семья Осириса", en: "Who is who: Osiris's family" },
    intro: { ru: "Соедините имя с ролью в мифе.", en: "Match each name with its role in the myth." },
    pairs: [
      { left: { ru: "Сет", en: "Set" }, right: { ru: "губит Осириса", en: "kills Osiris" } },
      { left: { ru: "Исида", en: "Isis" }, right: { ru: "ищет тело мужа", en: "searches for her husband's body" } },
      { left: { ru: "Анубис", en: "Anubis" }, right: { ru: "участвует в погребальном восстановлении", en: "takes part in the funerary restoration" } },
      { left: { ru: "Гор", en: "Horus" }, right: { ru: "отстаивает право на трон", en: "fights for the right to the throne" } },
    ],
    done: { ru: "Тело — заботами Исиды и её союзников, законное наследие — благодаря Гору.", en: "The body, thanks to Isis and her allies; the rightful inheritance, thanks to Horus." },
  },

  // ---------- Module 3 ----------
  "m03-sun": {
    kind: "order",
    title: { ru: "Ладья Ра: одни сутки солнца", en: "Ra's barque: one day of the sun" },
    intro: { ru: "Проведите солнце через полный цикл. Расставьте этапы по порядку, начиная с рассвета.", en: "Take the sun through a full cycle. Put the stages in order, starting at dawn." },
    items: [
      { ru: "Хепри — рассвет", en: "Khepri: dawn" },
      { ru: "Ра — дневное небо", en: "Ra: the daytime sky" },
      { ru: "Атум — закат", en: "Atum: sunset" },
      { ru: "Ночной путь через Дуат", en: "The night journey through the Duat" },
      { ru: "Схватка с Апопом", en: "The fight with Apep" },
      { ru: "Новый рассвет", en: "A new sunrise" },
    ],
    done: { ru: "Рассвет состоялся. Завтра всё начнётся снова.", en: "Sunrise achieved. Tomorrow it all starts again." },
  },

  // ---------- Module 4 ----------
  "m04-hall": {
    kind: "match",
    title: { ru: "Кто есть кто в зале суда", en: "Who is who in the hall of judgment" },
    intro: { ru: "Соедините участника сцены взвешивания с его ролью.", en: "Match each figure of the weighing scene with their role." },
    pairs: [
      { left: { ru: "Анубис", en: "Anubis" }, right: { ru: "проверяет весы", en: "checks the scales" } },
      { left: { ru: "Тот", en: "Thoth" }, right: { ru: "записывает итог", en: "records the result" } },
      { left: { ru: "Осирис", en: "Osiris" }, right: { ru: "принимает оправданного", en: "receives the justified" } },
      { left: { ru: "Аммат", en: "Ammit" }, right: { ru: "угроза окончательного уничтожения", en: "the threat of final annihilation" } },
    ],
    done: { ru: "Сцена прочитана. Можно смотреть на папирусы в музее как специалист.", en: "Scene decoded. You can now read the papyri in a museum like a specialist." },
  },
  "m04-scales": {
    kind: "scales",
    title: { ru: "Весы Маат", en: "The scales of Ma'at" },
    intro: { ru: "Положите каждое утверждение на весы. Правда уравновесит перо, миф потянет чашу вниз.", en: "Put each statement on the scales. Truth balances the feather; a myth drags the pan down." },
    items: [
      { text: { ru: "Если сердце легче пера, человек попадает в рай.", en: "If the heart is lighter than the feather, the person goes to paradise." }, truth: false,
        why: { ru: "Главное — равновесие сердца с Маат, а не «чем легче, тем лучше».", en: "What matters is the heart's balance with Ma'at, not “the lighter, the better.”" } },
      { text: { ru: "При бальзамировании сердце старались сохранить.", en: "During embalming, they tried to keep the heart." }, truth: true,
        why: { ru: "С сердцем связывали мысли, память и нравственную ответственность.", en: "The heart was linked with thought, memory and moral responsibility." } },
      { text: { ru: "«Книга мёртвых» — одна книга с неизменным содержанием.", en: "The “Book of the Dead” is one book with fixed contents." }, truth: false,
        why: { ru: "Это современное название разных сборников погребальных формул.", en: "It is a modern name for various collections of funerary spells." } },
      { text: { ru: "Фигурки ушебти должны были работать в загробном мире вместо владельца.", en: "Ushabti figurines were meant to work in the afterlife in their owner's place." }, truth: true,
        why: { ru: "На многих писали формулу 6-й главы «Книги мёртвых».", en: "Many carried the spell of Chapter 6 of the “Book of the Dead.”" } },
    ],
  },

  // ---------- Module 5 ----------
  "m05-pyramids": {
    kind: "order",
    title: { ru: "Ладья Ра: от мастабы к Гизе", en: "Ra's barque: from mastaba to Giza" },
    intro: { ru: "Расставьте погребальные постройки в том порядке, в каком они появлялись.", en: "Put the royal tombs in the order in which they appeared." },
    items: [
      { ru: "Мастабы раннего Египта", en: "Early Egyptian mastabas" },
      { ru: "Ступенчатая пирамида Джосера в Саккаре", en: "Djoser's Step Pyramid at Saqqara" },
      { ru: "Пирамиды Снофру", en: "Sneferu's pyramids" },
      { ru: "Великая пирамида Хуфу в Гизе", en: "Khufu's Great Pyramid at Giza" },
    ],
    done: { ru: "Между Джосером и Гизой — история экспериментов, а не внезапное чудо.", en: "Between Djoser and Giza lies a history of experiments, not a sudden miracle." },
  },

  // ---------- Module 6 ----------
  "m06-scales": {
    kind: "scales",
    title: { ru: "Весы Маат: сенсация или факт?", en: "The scales of Ma'at: sensation or fact?" },
    intro: { ru: "Положите каждое утверждение на весы. Правда уравновесит перо, миф потянет чашу вниз.", en: "Put each statement on the scales. Truth balances the feather; a myth drags the pan down." },
    items: [
      { text: { ru: "В гробнице Тутанхамона нашли надпись со знаменитым проклятием.", en: "Tutankhamun's tomb contained an inscription with the famous curse." }, truth: false,
        why: { ru: "Достоверной надписи с таким проклятием в KV62 не обнаружено.", en: "No reliable inscription with such a curse was found in KV62." } },
      { text: { ru: "«Вертолёт» в Абидосе — это наложение надписей Сети I и Рамсеса II.", en: "The Abydos “helicopter” is an overlap of inscriptions of Seti I and Ramesses II." }, truth: true,
        why: { ru: "При переделке надписи старые и новые линии наложились.", en: "When the inscription was altered, old and new lines overlapped." } },
      { text: { ru: "На Розеттском камне один указ записан тремя системами письма.", en: "The Rosetta Stone carries one decree in three writing systems." }, truth: true,
        why: { ru: "Иероглифической, демотической и греческой.", en: "Hieroglyphic, Demotic and Greek." } },
      { text: { ru: "Раз мы не знаем всех деталей стройки, пирамиды строили пришельцы.", en: "Since we don't know every detail of the building work, aliens built the pyramids." }, truth: false,
        why: { ru: "Неизвестные детали — исследовательская задача, а не доказательство.", en: "Unknown details are a research question, not evidence." } },
    ],
  },
  "m06-cartouche": {
    kind: "cartouche",
    title: { ru: "Картуш: ваше имя знаками", en: "Cartouche: your name in signs" },
    intro: {
      ru: "Царские имена египтяне заключали в овальную рамку — картуш. Напишите своё имя и посмотрите, как оно выглядело бы односогласными знаками. Имя никуда не отправляется и не сохраняется.",
      en: "Egyptians enclosed royal names in an oval frame, the cartouche. Type your name and see how it might look in single-consonant signs. The name is not sent or stored anywhere.",
    },
  },
};

export function getActivity(id: string): Activity | undefined {
  return ACTIVITIES[id];
}
