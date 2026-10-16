import type { Locale } from "@/lib/course";

/**
 * Visual story «Осетинский шёлковый платок / Цыллæ хыз».
 *
 * The approved text lives in content/ossetian-headscarf/story.<locale>.md and is rendered verbatim.
 * Interactive blocks and full-bleed pictures are placed by marker lines inside that text:
 *   [[light]] [[path]] [[weave]] [[touch]] [[year]] [[motifs]] [[gallery]] [[craft]] [[scene:<picture>]]
 * Move a marker in the .md file to move the block; a marker as the first block of a chapter is shown
 * above the chapter heading. Copy for the interactive blocks (quoted from the same text) is below.
 */

export const STORY_SLUG = "ossetian-headscarf";
export const STORY_DIR = "ossetian-headscarf";
export const MEDIA = "/visuals/ossetian-headscarf";

type L = Record<Locale, string>;

export const PICS: Record<string, { w: number; h: number; alt: L }> = {
  "golden-hour": { w: 1600, h: 900, alt: { ru: "Девушка в светлом шёлковом платке на фоне гор", en: "A young woman in a pale silk headscarf against the mountains" } },
  "silk-light": { w: 1448, h: 1086, alt: { ru: "Шёлковый платок с вышитой веткой в лучах солнца", en: "A silk headscarf with an embroidered branch in sunlight" } },
  hearth: { w: 1448, h: 1086, alt: { ru: "Женщина с рукоделием у очага", en: "A woman with her needlework by the hearth" } },
  cocoons: { w: 1448, h: 1086, alt: { ru: "Коконы шелкопряда и мотки шёлка", en: "Silkworm cocoons and skeins of silk" } },
  "closeup-shuttle": { w: 1448, h: 1086, alt: { ru: "Руки мастерицы с челноком плетут сетку", en: "A craftswoman's hands making the net with a shuttle" } },
  "two-women-motif": { w: 1448, h: 1086, alt: { ru: "Две женщины рассматривают вышитый узор на платке", en: "Two women examining the embroidered pattern on a headscarf" } },
  "bride-dressing": { w: 1448, h: 1086, alt: { ru: "Женщины помогают невесте с платком", en: "Women helping a bride with her headscarf" } },
  "bride-circle": { w: 1448, h: 1086, alt: { ru: "Невесте поправляют ажурный платок", en: "A bride's open-net headscarf being arranged" } },
  "bride-veil": { w: 1448, h: 1086, alt: { ru: "Невеста в ажурном платке и две женщины рядом", en: "A bride in an open-net headscarf with two women beside her" } },
  "bride-mountains": { w: 1448, h: 1086, alt: { ru: "Невеста в платке на фоне гор и башен", en: "A bride in a headscarf before mountains and towers" } },
  "dance-towers": { w: 1448, h: 1086, alt: { ru: "Танец в платке у старинных башен", en: "A dance in a headscarf by the old towers" } },
  keepers: { w: 1448, h: 1086, alt: { ru: "Две женщины бережно раскладывают старинный платок", en: "Two women carefully laying out an old headscarf" } },
  "three-generations": { w: 1448, h: 1086, alt: { ru: "Три поколения женщин за плетением", en: "Three generations of women netting together" } },
  "spinning-silk": { w: 1122, h: 1402, alt: { ru: "Женщина сматывает шёлковую нить с коконов", en: "A woman reeling silk thread from cocoons" } },
  "netting-window": { w: 1122, h: 1402, alt: { ru: "Женщина плетёт ажурную сетку у окна", en: "A woman netting an open-work headscarf by the window" } },
  "women-reeling": { w: 1122, h: 1402, alt: { ru: "Три женщины разматывают шёлк с коконов в горном селении", en: "Three women reeling silk from cocoons in a mountain village" } },
  "motif-sketches": { w: 1600, h: 900, alt: { ru: "Мастерица рассматривает узор на платке рядом с эскизами орнаментов", en: "A craftswoman examining the pattern on a headscarf beside sketches of motifs" } },
  "chest-memory": { w: 1600, h: 900, alt: { ru: "Женщина у сундука со старыми платками и семейной фотографией", en: "A woman by a chest of old headscarves and a family photograph" } },
  "towers-solitude": { w: 1149, h: 1369, alt: { ru: "Женщина в платке у старинных башен на закате", en: "A woman in a headscarf by the old towers at sunset" } },
};

export const UI = {
  ru: {
    eyebrowOrig: "Цыллæ хыз",
    title: "Осетинский шёлковый платок",
    sub: "История, сплетённая из шёлка",
    lede: "Осетинский платок, женские руки и искусство сохранять красоту посреди повседневного труда.",
    scroll: "Листайте",
    motionOn: "Анимация включена",
    motionOff: "Анимация выключена",
    illustration: "Иллюстрация",
    lightHint: "Ведите курсором или пальцем — свет движется по шёлку",
    back: "Вернуться в Академию",
    metaTitle: "Осетинский шёлковый платок — MIYU Academy",
    metaDesc: "Визуальная история о цыллæ хыз: как из шёлковой нити появляется ажурный платок и почему ремесло продолжает жить.",
  },
  en: {
    eyebrowOrig: "Цыллæ хыз",
    title: "The Ossetian Silk Headscarf",
    sub: "A Story Woven from Silk",
    lede: "The Ossetian silk headscarf, women's hands, and the art of preserving beauty amid the work of everyday life.",
    scroll: "Scroll",
    motionOn: "Motion on",
    motionOff: "Motion off",
    illustration: "Illustration",
    lightHint: "Move your cursor or finger — the light moves across the silk",
    back: "Back to the Academy",
    metaTitle: "The Ossetian Silk Headscarf — MIYU Academy",
    metaDesc: "A visual story about tsyllæ khyz: how silk thread becomes an open-net headscarf, and why the craft lives on.",
  },
} as const;

export const PATH = {
  label: { ru: "Путь нити", en: "The path of the thread" },
  title: { ru: "До первого узла", en: "Before the first knot" },
  sub: { ru: "Листайте: нить проходит весь путь — от листа тутовника до челнока.", en: "Keep scrolling: the thread travels from mulberry leaf to netting shuttle." },
  steps: [
    { h: { ru: "Тутовник", en: "Mulberry" }, p: { ru: "Сначала нужно было вырастить шелкопряда. Для этого требовались листья тутовника, подходящее место и постоянный уход.", en: "First, silkworms had to be raised. That required mulberry leaves, a suitable place, and constant care." } },
    { h: { ru: "Шелкопряд", en: "Silkworms" }, p: { ru: "Личинок приносили в небольших коробочках, затем размещали в тепле на листьях тутовника.", en: "The larvae were brought in small boxes and then kept warm among mulberry leaves." }, q: { ru: "Гизель, 1960-е — по воспоминаниям мастерицы", en: "Gizel, 1960s — as a craftswoman recalled" } },
    { h: { ru: "Коконы", en: "Cocoons" }, p: { ru: "Гусеницы питались, росли, образовывали коконы.", en: "The caterpillars fed, grew, and spun their cocoons." } },
    { h: { ru: "Горячая вода", en: "Hot water" }, p: { ru: "Коконы обрабатывали горячей водой, разматывали волокно.", en: "Cocoons were treated with hot water; fibres were unwound." } },
    { h: { ru: "Нить", en: "Thread" }, p: { ru: "Волокно очищали, размягчали, соединяли и скручивали нити. Качество нити влияло на всё, что происходило после.", en: "Fibres were cleaned, softened, combined, and twisted into threads. The quality of the thread affected everything that followed." } },
    { h: { ru: "Челнок", en: "The shuttle" }, p: { ru: "До того как мастерица брала в руки челнок, материал уже проходил через длинную цепочку действий.", en: "Before a craftswoman picked up her netting shuttle, the material had already passed through a long sequence of tasks." } },
  ],
};

export const WEAVE = {
  label: { ru: "Соткать нить", en: "Draw the thread" },
  title: { ru: "Узел за узлом", en: "Knot by knot" },
  sub: { ru: "Проведите курсором или пальцем по полю, словно протягиваете шёлковую нить. Платок проходит те же четыре этапа, что и в руках мастерицы.", en: "Move your cursor or finger across the field as if drawing a silk thread. The headscarf passes through the same four stages as in a craftswoman's hands." },
  tip: { ru: "Проведите здесь", en: "Draw here" },
  done: { ru: "Показать готовый платок", en: "Show the finished headscarf" },
  reset: { ru: "Начать заново", en: "Start again" },
  aria: { ru: "Поле для плетения. Стрелка вправо или пробел — следующий ряд.", en: "Netting field. Right arrow or Space adds the next row." },
  stages: [
    { n: { ru: "Сетка", en: "Net" }, t: { ru: "Сначала формируют первые петли и узлы. Затем постепенно наращивают ряды. Сетка растёт медленно — иногда за одно занятие заметен лишь небольшой участок.", en: "First come the initial loops and knots. Then row after row is added. The net grows slowly—sometimes a single session produces only a small visible section." }, f: { ru: "250–300 узлов", en: "250–300 knots" }, fs: { ru: "набирают для начала большого платка — по словам мастериц. Всего узлов в изделии гораздо больше.", en: "to begin a large headscarf, craftswomen say. The finished piece has far more." } },
    { n: { ru: "Вышивка", en: "Embroidery" }, t: { ru: "Плотной шёлковой нитью по ячейкам формируют орнамент. Там, где сетка остаётся прозрачной, возникает свободное пространство. Там, где ложится вышивка, появляется линия или плоскость рисунка.", en: "Using a denser silk thread, the craftswoman forms a pattern across the openings. Where the net remains transparent, there is open space. Where the embroidery is laid, a line or a filled section appears." } },
    { n: { ru: "Край", en: "Edge" }, t: { ru: "После вышивки остаётся край. Его можно украсить кружевной обработкой или бахромой. Каждая кисть должна быть аккуратной и согласованной с остальными. И это снова время.", en: "After the embroidery comes the edge. It may be finished with openwork or a fringe. Each tassel must be neat and work in harmony with the others. And once again, that takes time." } },
    { n: { ru: "Форма", en: "Shaping" }, t: { ru: "После плетения ячейки могут быть вытянуты ромбами. Сетку увлажняют, расправляют и фиксируют: каждую петлю по краям надевают на длинные спицы, пока ячейки не приобретут правильную форму.", en: "After netting, the openings may be elongated into diamonds. The net is moistened, spread out and secured: each loop along the edges is slipped onto long needles until the openings take on the proper shape." } },
  ],
};

export const TOUCH = {
  label: { ru: "Прикоснуться к истории", en: "Touch the story" },
  title: { ru: "Рассмотрите платок вблизи", en: "Look closer at the headscarf" },
  sub: { ru: "Нажмите на светлые точки. Пояснения — из текста очерка.", en: "Tap the light points. Notes come from the essay itself." },
  from: { ru: "Из очерка", en: "From the essay" },
  close: { ru: "Закрыть", en: "Close" },
  spots: [
    { x: 12, y: 22, h: { ru: "Цвет некрашеного шёлка", en: "The colour of undyed silk" }, p: { ru: "Это не ослепительно белый, а мягкий, чуть тёплый оттенок — от светло-бежевого до жемчужного, иногда с золотистым отливом. Он меняется в зависимости от освещения.", en: "It is not a dazzling white, but a soft, slightly warm shade—from pale beige to pearl, sometimes with a golden sheen. It changes with the light." }, s: { ru: "Глава 01", en: "Chapter 01" } },
    { x: 28, y: 35, h: { ru: "Челнок", en: "The netting shuttle" }, p: { ru: "Для плетения сетки мастерица использует тонкую нить, специальный челнок — инструмент, похожий на спицу с раздвоенными концами, — и палочку или планку, помогающую выдерживать размер ячеек. Чем тоньше палочка, тем мельче сетка.", en: "To make the net, a craftswoman uses fine thread, a special netting shuttle—a tool resembling a slender needle with forked ends—and a small rod or gauge that keeps the openings an even size. The finer the gauge, the smaller the openings." }, s: { ru: "Глава 04", en: "Chapter 04" } },
    { x: 44, y: 62, h: { ru: "Сетка", en: "The net" }, p: { ru: "Сетчатую основу не ткут на станке как плотное полотно. Её последовательно плетут, образуя ряды ячеек. Плетение держится на повторении, но не прощает невнимательности.", en: "The netted foundation is not woven on a loom like solid cloth. It is made progressively, row after row of small openings. Netting depends on repetition, but it does not forgive inattention." }, s: { ru: "Главы 01, 04", en: "Chapters 01, 04" } },
    { x: 67, y: 22, h: { ru: "Растительный мотив", en: "Plant motif" }, p: { ru: "Узоры бывают и растительными: очертания листьев, бутонов, побегов. Добиться мягкости ветви на геометрической основе сетки — отдельное искусство.", en: "Patterns can also be botanical: outlines of leaves, buds, and shoots. Achieving the softness of a branch on the geometric foundation of a net is an art in itself." }, s: { ru: "Глава 04", en: "Chapter 04" } },
    { x: 76, y: 76, h: { ru: "Бахрома", en: "Fringe" }, p: { ru: "Бахрома важна не только как украшение: она завершает силуэт платка, смягчает геометрию сетки, красиво движется. Каждая кисть должна быть аккуратной и согласованной с остальными.", en: "The fringe is more than an embellishment: it completes the silhouette, softens the geometry of the net, and moves beautifully. Each tassel must be neat and work in harmony with the others." }, s: { ru: "Глава 04", en: "Chapter 04" } },
  ],
};

export const YEAR = {
  label: { ru: "Год в узлах", en: "A year in knots" },
  title: { ru: "У платка есть продолжительность", en: "A headscarf has a duration" },
  sub: { ru: "Одна из мастериц плела свадебный платок около года, не менее двух часов каждый день. Каждый ромб — один день.", en: "One craftswoman spent about a year on her wedding headscarf, at least two hours every day. Each diamond is one day." },
  days: { ru: "дней из ≈365", en: "days of ≈365" },
  hours: { ru: "не менее {h} часов работы", en: "at least {h} hours of work" },
  eve: { ru: "Последние элементы узора она доделала накануне свадьбы.", en: "She finished the last elements of the pattern on the eve of her wedding." },
};

export const MOTIFS = {
  label: { ru: "Узор без словаря", en: "A pattern without a dictionary" },
  items: [
    { n: { ru: "Ромб", en: "Diamond" }, r: { ru: "В народных и современных исследовательских толкованиях ромб связывают с плодородием, продолжением рода, благополучием.", en: "In folk interpretations and modern scholarly readings, the diamond is associated with fertility, the continuation of the family line, and prosperity." } },
    { n: { ru: "Растительный мотив", en: "Plant motif" }, r: { ru: "Растительный мотив часто понимают как знак роста и жизни.", en: "Plant motifs are often understood as signs of growth and life." } },
    { n: { ru: "Геометрия", en: "Geometry" }, r: { ru: "Геометрические фигуры соотносят с порядком мира, защитой и гармонией.", en: "Geometric figures are connected with the order of the world, protection, and harmony." } },
  ],
  readLabel: { ru: "Толкование", en: "Interpretation" },
  butLabel: { ru: "Но", en: "And yet" },
  but: { ru: "Это не доказывает, что каждая мастерица вкладывала в знак один и тот же смысл. Женщины старшего поколения, вероятно, не размышляли каждый раз над значением узора: они делали то, чему научились у своих бабушек.", en: "This does not prove that every craftswoman gave the sign the same meaning. Women of the older generation probably did not reflect on a pattern's meaning every time: they made what their own grandmothers had taught them to make." },
};

export const CRAFT = {
  label: { ru: "Протянуть нить дальше", en: "Carry the thread on" },
  title: { ru: "Ремесло продолжает жить", en: "The craft lives on" },
  sub: { ru: "Нажимайте на следующий узел — нить протянется дальше и откроет, где традиция живёт сегодня.", en: "Tap the next knot to carry the thread on and see where the tradition lives today." },
  nodes: [
    { n: { ru: "Мастер-классы", en: "Workshops" }, d: { ru: "Во Владикавказе проходят мастер-классы. Старый навык становится делом, которое можно попробовать — с уважением к его сложности.", en: "Workshops take place in Vladikavkaz. An old skill becomes something a person can try—with respect for its difficulty." } },
    { n: { ru: "Ученицы", en: "Pupils" }, d: { ru: "Женщины учатся плести. Особенно важно услышать объяснение от того, кто сам прошёл через ошибки и долгие часы плетения.", en: "Women learn the technique. It is especially valuable to hear it from someone who has worked through mistakes and long hours of netting." } },
    { n: { ru: "Свадебные образы", en: "Wedding outfits" }, d: { ru: "Невесты выбирают ажурные платки для свадебного костюма.", en: "Brides choose open-net headscarves for their wedding outfits." } },
    { n: { ru: "Семейные платки", en: "Family headscarves" }, d: { ru: "Женщины фотографируют старые семейные платки и ищут тех, кто сможет объяснить их устройство.", en: "Women photograph old family headscarves and look for people who can explain how they were made." } },
  ],
  final: { ru: "Традиция вышла за пределы музейной витрины.", en: "The tradition has moved beyond the museum display case." },
};

export const GALLERY = ["spinning-silk", "netting-window", "bride-circle", "towers-solitude"];
