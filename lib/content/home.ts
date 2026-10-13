import type { Locale } from "@/lib/course";

/** Copy shared by the Academy home and the course home. Prices, terms and next-course topics are intentionally absent. */
export const FAQ: Record<Locale, {q:string;a:string}[]> = {
  ru: [
    {q:"Нужно ли знать мифологию заранее?",a:"Нет. Курс собирает карту постепенно, модуль за модулем: от того, как устроен мир мифов, до героев, Трои, Одиссеи и мифов в современной жизни."},
    {q:"Сколько времени занимает курс?",a:"Восемь модулей по 15–35 минут, в сумме около 3,5 часов. Проходить можно в своём темпе, прогресс сохраняется."},
    {q:"Нужен ли аккаунт?",a:"Аккаунт нужен, чтобы сохранять прогресс и продолжать с того же места. Войти можно через Google или по ссылке на email."},
    {q:"На каком языке курс?",a:"На русском и на английском. Языки можно переключать в любой момент."},
    {q:"Как устроен Final Myth Decoder?",a:"Это необязательная проверка для себя: 15 вопросов на узнавание, смысл и связи. Правильных ответов нужно 12, но можно и просто читать курс. Без таймера, попыток сколько угодно."},
    {q:"Обязательны ли тесты?",a:"Нет. Проверки в уроках и финал можно пройти для себя, а можно просто читать. Курс открыт для всех."},
    {q:"Можно ли удалить свои данные?",a:"Да. В настройках аккаунта можно удалить аккаунт вместе с прогрессом и результатами."},
  ],
  en: [
    {q:"Do I need to know mythology beforehand?",a:"No. The course builds the map gradually, module by module: from how the world of myth is structured to heroes, Troy, the Odyssey and myths in modern life."},
    {q:"How long does the course take?",a:"Eight modules of 15–35 minutes each, about 3.5 hours in total. Study at your own pace; your progress is saved."},
    {q:"Do I need an account?",a:"An account is only needed to save your progress and continue where you left off. You can sign in with Google or with an email link."},
    {q:"Which languages is the course in?",a:"Russian and English. You can switch between them at any time."},
    {q:"How does the Final Myth Decoder work?",a:"It is an optional check for yourself: 15 questions on recognition, meaning and connections. Answer 12 correctly to pass, or simply read the course instead. There is no timer and you can try as many times as you like."},
    {q:"Are the tests required?",a:"No. The in-lesson checks and the final are there if you want to test yourself; you can also just read. The course is open to everyone."},
    {q:"Can I delete my data?",a:"Yes. In your account settings you can delete your account together with your progress and results."},
  ],
};

export const AUTHOR: Record<Locale, {eyebrow:string;title:string;paragraphs:string[];quote:string;alt:string}> = {
  ru: {
    eyebrow:"ОБ АВТОРЕ",
    title:"Немного обо мне",
    paragraphs:[
      "Привет! Я Олеся, создатель MIYU Academy.",
      "Больше 16 лет я работаю в маркетинге и технологических компаниях, а последние пять с лишним лет создаю курсы, тренинги и образовательные инициативы для IT-специалистов. Я научилась превращать сложное в понятное и помогать людям осваивать новое.",
      "Теперь я хочу заняться тем, что люблю больше всего: мифологией, историей, искусством и историями, которые делают мир богаче.",
      "MIYU Academy — это место, где знания доступны каждому. Без обязательных тестов и давления: приходите, читайте и учитесь просто потому, что это интересно.",
    ],
    quote:"Ведь не всё, чему мы учимся, должно быть полезно для карьеры. Иногда достаточно того, что это делает нашу жизнь интереснее.",
    alt:"Олеся, создатель MIYU Academy",
  },
  en: {
    eyebrow:"ABOUT THE AUTHOR",
    title:"A Little About Me",
    paragraphs:[
      "Hi! I'm Olesia, the founder of MIYU Academy.",
      "I've spent over 16 years in marketing and tech companies, and for the last five-plus years I've been creating courses, training programmes and learning initiatives for IT professionals. Along the way I learned how to turn the complex into the clear, and to help people discover new things.",
      "Now I want to do what I love most: mythology, history, art, and the stories that make the world richer.",
      "MIYU Academy is a place where knowledge is open to everyone. No required tests, no pressure: come, read and learn simply because it's interesting.",
    ],
    quote:"Because not everything we learn has to help us grow professionally. Sometimes, it's enough that it makes our lives a little more interesting.",
    alt:"Olesia, founder of MIYU Academy",
  },
};

export const STEPS: Record<Locale, {n:string;title:string;body:string}[]> = {
  ru: [
    {n:"01",title:"Читай и смотри",body:"Короткие истории и визуальные остановки: понятная логика вместо энциклопедии."},
    {n:"02",title:"Проверяй себя",body:"Быстрые вопросы по ходу и самопроверка в конце модуля, без давления и оценок."},
    {n:"03",title:"Расшифруй финал",body:"Final Myth Decoder на 15 вопросов, по желанию. Можно пройти для себя или пропустить."},
  ],
  en: [
    {n:"01",title:"Read and look",body:"Short stories and visual stops: clear logic instead of an encyclopedia."},
    {n:"02",title:"Check yourself",body:"Quick questions along the way and a self-check at the end of each module, without pressure or grades."},
    {n:"03",title:"Decode the finale",body:"The 15-question Final Myth Decoder, if you like. Take it for yourself or skip it."},
  ],
};

export const SOON: Record<Locale, {key:string;title:string;chip:string}[]> = {
  ru: [
    {key:"norse",title:"Скандинавская мифология",chip:"Скоро"},
    {key:"nart",title:"Нартский эпос",chip:"Скоро"},
    {key:"egypt",title:"Древнеегипетская мифология",chip:"Скоро"},
  ],
  en: [
    {key:"norse",title:"Norse Mythology",chip:"Coming soon"},
    {key:"nart",title:"The Nart Epic",chip:"Coming soon"},
    {key:"egypt",title:"Ancient Egyptian Mythology",chip:"Coming soon"},
  ],
};
