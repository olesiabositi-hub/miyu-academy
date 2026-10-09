import type { Locale } from "@/lib/course";

/** Copy shared by the Academy home and the course home. Prices, terms and next-course topics are intentionally absent. */
export const FAQ: Record<Locale, {q:string;a:string}[]> = {
  ru: [
    {q:"Нужно ли знать мифологию заранее?",a:"Нет. Курс собирает карту постепенно, модуль за модулем: от того, как устроен мир мифов, до героев, Трои, Одиссеи и мифов в современной жизни."},
    {q:"Сколько времени занимает курс?",a:"Восемь модулей по 15–35 минут, в сумме около 3,5 часов. Проходить можно в своём темпе, прогресс сохраняется."},
    {q:"Нужен ли аккаунт?",a:"Да, чтобы сохранять прогресс, продолжать с того же места и получить личный сертификат. Войти можно через Google или по ссылке на email."},
    {q:"На каком языке курс?",a:"На русском и на английском. Языки можно переключать в любой момент."},
    {q:"Как устроен Final Myth Decoder?",a:"Это 15 вопросов на узнавание, смысл и связи. Чтобы пройти, нужно ответить правильно на 12. Без таймера, попыток можно сколько угодно."},
    {q:"Что за сертификат?",a:"Личный сертификат MIYU Academy с вашим именем, датой, уникальным ID и QR-кодом. Его можно скачать в PDF и проверить подлинность по ссылке."},
    {q:"Можно ли удалить свои данные?",a:"Да. В настройках аккаунта можно удалить аккаунт вместе с прогрессом и сертификатом."},
  ],
  en: [
    {q:"Do I need to know mythology beforehand?",a:"No. The course builds the map gradually, module by module: from how the world of myth is structured to heroes, Troy, the Odyssey and myths in modern life."},
    {q:"How long does the course take?",a:"Eight modules of 15–35 minutes each, about 3.5 hours in total. Study at your own pace; your progress is saved."},
    {q:"Do I need an account?",a:"Yes, to save your progress, continue where you left off and receive your personal certificate. You can sign in with Google or with an email link."},
    {q:"Which languages is the course in?",a:"Russian and English. You can switch between them at any time."},
    {q:"How does the Final Myth Decoder work?",a:"It has 15 questions on recognition, meaning and connections. Answer 12 correctly to pass. There is no timer and you can try as many times as you like."},
    {q:"What is the certificate?",a:"A personal MIYU Academy certificate with your name, date, a unique ID and a QR code. You can download it as a PDF, and anyone can verify it with the link."},
    {q:"Can I delete my data?",a:"Yes. In your account settings you can delete your account together with your progress and certificate."},
  ],
};

export const AUTHOR: Record<Locale, {eyebrow:string;title:string;paragraphs:string[];quote:string;alt:string}> = {
  ru: {
    eyebrow:"ОБ АВТОРЕ",
    title:"Немного обо мне",
    paragraphs:[
      "Привет! Я Олеся, создатель MIYU Academy.",
      "Уже больше 16 лет я работаю в маркетинге и технологических компаниях. За это время я научилась превращать сложную информацию в понятные и интересные истории, создавать образовательные материалы и помогать людям осваивать новое.",
      "Но мне всегда хотелось учиться не только ради работы. Разбираться в искусстве, мифологии, музыке — просто потому, что интересно.",
      "Так появилась MIYU Academy. Я решила объединить свой профессиональный опыт с любовью к новым знаниям и создать место, где сложные темы становятся понятными, а обучение приносит удовольствие.",
    ],
    quote:"Ведь не всё, чему мы учимся, должно быть полезно для карьеры. Иногда достаточно того, что это делает нашу жизнь интереснее.",
    alt:"Олеся, создатель MIYU Academy",
  },
  en: {
    eyebrow:"ABOUT THE AUTHOR",
    title:"A Little About Me",
    paragraphs:[
      "Hi! I'm Olesia, the founder of MIYU Academy.",
      "I've spent over 16 years working in marketing and tech companies. Along the way, I've learned how to turn complex information into clear, engaging stories, create learning materials, and help people discover and understand new things.",
      "But I've always wanted to learn beyond my career. To explore art, mythology, music — simply for the joy of discovering something new.",
      "That's how MIYU Academy came to life. I wanted to bring together my professional experience and my love of learning to create a space where complex topics feel approachable and learning is something to genuinely enjoy.",
    ],
    quote:"Because not everything we learn has to help us grow professionally. Sometimes, it's enough that it makes our lives a little more interesting.",
    alt:"Olesia, founder of MIYU Academy",
  },
};

export const STEPS: Record<Locale, {n:string;title:string;body:string}[]> = {
  ru: [
    {n:"01",title:"Читай и смотри",body:"Короткие истории и визуальные остановки: понятная логика вместо энциклопедии."},
    {n:"02",title:"Проверяй себя",body:"Быстрые вопросы по ходу и самопроверка в конце модуля, без давления и оценок."},
    {n:"03",title:"Расшифруй финал",body:"Final Myth Decoder на 15 вопросов. После успешного прохождения открывается сертификат."},
  ],
  en: [
    {n:"01",title:"Read and look",body:"Short stories and visual stops: clear logic instead of an encyclopedia."},
    {n:"02",title:"Check yourself",body:"Quick questions along the way and a self-check at the end of each module, without pressure or grades."},
    {n:"03",title:"Decode the finale",body:"The 15-question Final Myth Decoder. Pass it to unlock your certificate."},
  ],
};

export const SOON: Record<Locale, {key:string;title:string;body:string;chip:string}[]> = {
  ru: [
    {key:"language",title:"Язык",body:"Слова, у которых есть история.",chip:"Скоро"},
    {key:"culture",title:"Культура",body:"Знакомые образы, символы и смыслы.",chip:"Скоро"},
    {key:"meaning",title:"Смысл и современность",body:"Как старые идеи живут в сегодняшнем мире.",chip:"Скоро"},
  ],
  en: [
    {key:"language",title:"Language",body:"Words with a story behind them.",chip:"Coming soon"},
    {key:"culture",title:"Culture",body:"Familiar images, symbols and meanings.",chip:"Coming soon"},
    {key:"meaning",title:"Meaning and modernity",body:"How old ideas live in today's world.",chip:"Coming soon"},
  ],
};
