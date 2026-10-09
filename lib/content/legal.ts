import type { Locale } from "@/lib/course";
import { OPERATOR } from "@/lib/legal";

export type LegalSection = { h: string; p?: string[]; list?: string[] };
export type LegalDoc = { title: string; lead: string; sections: LegalSection[] };

const contact = (loc: Locale) => OPERATOR.privacyEmail ?? (loc === "ru" ? "[контактный email]" : "[contact email]");
const who = (loc: Locale) => {
  const name = OPERATOR.legalName ?? (loc === "ru" ? "[имя оператора]" : "[operator name]");
  const place = [OPERATOR.address, OPERATOR.country].filter(Boolean).join(", ");
  return place ? `${name}, ${place}` : name;
};

export function privacyDoc(loc: Locale): LegalDoc {
  return loc === "ru" ? {
    title: "Политика конфиденциальности",
    lead: "Мы собираем только то, что нужно для работы курса, и не продаём данные учеников.",
    sections: [
      { h: "1. Кто отвечает за данные", p: [`Оператор сервиса ${OPERATOR.brand} (${OPERATOR.site}): ${who(loc)}.`, `По вопросам о данных пишите на ${contact(loc)}.`] },
      { h: "2. Какие данные мы обрабатываем", list: [
        "Аккаунт: email и технические данные входа. При входе через Google мы используем только адрес email.",
        "Профиль: язык интерфейса и время подтверждения, что вам не меньше 16 лет.",
        "Обучение: статусы модулей, время начала и завершения, место, где вы остановились, ответы на проверки внутри уроков.",
        "Final Myth Decoder: порядок вопросов и вариантов, выбранные ответы, результат, дата попытки.",
        "Сертификат: имя, которое вы указали, дата завершения, ID сертификата, токен проверки, статус.",
        "Технические журналы: IP-адрес и сведения о браузере, которые создаёт хостинг и защита от злоупотреблений.",
        "Аналитика: только если вы дали согласие (см. раздел 6)."] },
      { h: "3. Для чего и на каком основании", list: [
        "Предоставление курса, сохранение прогресса, проверка финала и выпуск сертификата: это нужно, чтобы оказать запрошенную вами услугу.",
        "Безопасность и защита от злоупотреблений: наш законный интерес.",
        "Аналитика: ваше согласие. Его можно отозвать в любой момент в настройках приватности. Курс работает без аналитики."] },
      { h: "4. Кому мы передаём данные", p: ["Мы используем поставщиков, которые обрабатывают данные по нашему поручению:"], list: [
        "Supabase: аккаунты, авторизация и база данных.",
        "Netlify: хостинг сайта.",
        "Google: вход через Google и, только с вашего согласия, Google Analytics.",
        "Сервис отправки писем: ссылки для входа по email."] },
      { h: "5. Передача данных за границу", p: ["Поставщики могут обрабатывать данные за пределами вашей страны, в том числе в США. Мы опираемся на условия обработки данных и гарантии этих поставщиков."] },
      { h: "6. Cookies и аналитика", p: ["Необходимые cookies и локальное хранилище нужны для входа, безопасности и сохранения вашего выбора. Google Analytics 4 включается только после вашего согласия. Подробности на странице «Cookies». Рекламных и маркетинговых трекеров нет, запись сессий не ведётся."] },
      { h: "7. Сертификат и проверка", p: ["Сертификат не индексируется поисковиками. Любой, у кого есть ссылка или QR-код, увидит имя в сертификате, название курса, дату завершения, ID и статус. Ваш email, результаты и прогресс при проверке не показываются. Публичного каталога сертификатов и поиска по имени нет."] },
      { h: "8. Срок хранения", p: ["Данные хранятся, пока существует ваш аккаунт. Вы можете удалить аккаунт в настройках: вместе с ним удаляются прогресс, результаты финала, сертификат и профиль, а ссылка и QR сертификата перестают работать. Технические журналы хранятся в сроки, которые устанавливают поставщики."] },
      { h: "9. Ваши права", p: [`Вы можете запросить доступ к данным, их исправление, удаление, ограничение обработки, возражать против обработки, запросить копию данных и отозвать согласие. Напишите на ${contact(loc)}. Вы также можете подать жалобу в надзорный орган по защите данных.`] },
      { h: "10. Возраст", p: ["Аккаунты предназначены для пользователей от 16 лет. Открытые страницы можно смотреть без аккаунта."] },
      { h: "11. Автоматическая проверка финала", p: ["Ответы в Final Myth Decoder проверяются автоматически по заранее заданным правильным ответам. Результат не влияет на ваши права или обязательства и используется только для выдачи сертификата."] },
      { h: "12. Изменения", p: [`Редакция от ${OPERATOR.effectiveDate.ru}. Если мы существенно изменим политику, мы обновим дату и сообщим об этом на сайте.`] },
    ],
  } : {
    title: "Privacy Notice",
    lead: "We collect only what the course needs, and we never sell learner data.",
    sections: [
      { h: "1. Who is responsible", p: [`Operator of ${OPERATOR.brand} (${OPERATOR.site}): ${who(loc)}.`, `For privacy questions write to ${contact(loc)}.`] },
      { h: "2. Data we process", list: [
        "Account: email and technical sign-in data. When you sign in with Google we use only your email address.",
        "Profile: interface language and the time you confirmed you are at least 16.",
        "Learning: module statuses, start and completion times, where you left off, and your answers to in-lesson checks.",
        "Final Myth Decoder: question and option order, selected answers, result and attempt date.",
        "Certificate: the name you confirm, completion date, Certificate ID, verification token and status.",
        "Technical logs: IP address and browser details created by hosting and abuse protection.",
        "Analytics: only if you consent (see section 6)."] },
      { h: "3. Purposes and legal bases", list: [
        "Providing the course, saving progress, scoring the final and issuing the certificate: necessary to deliver the service you requested.",
        "Security and abuse prevention: our legitimate interest.",
        "Analytics: your consent. You can withdraw it at any time in Privacy settings. The course works without analytics."] },
      { h: "4. Who receives data", p: ["We use providers that process data on our behalf:"], list: [
        "Supabase: accounts, authentication and database.",
        "Netlify: website hosting.",
        "Google: Google sign-in and, only with your consent, Google Analytics.",
        "Email delivery service: email sign-in links."] },
      { h: "5. International transfers", p: ["Providers may process data outside your country, including in the United States. We rely on the data-processing terms and safeguards of these providers."] },
      { h: "6. Cookies and analytics", p: ["Essential cookies and local storage are used for sign-in, security and remembering your choice. Google Analytics 4 is switched on only after you consent. See the Cookies page for details. There are no advertising or marketing trackers and no session recording."] },
      { h: "7. Certificate and verification", p: ["Your certificate is not indexed by search engines. Anyone with its link or QR code can see the name on the certificate, the course, completion date, ID and status. Your email, scores and progress are not shown. There is no public certificate directory or search by name."] },
      { h: "8. Retention", p: ["Data is kept while your account exists. You can delete your account in settings: your progress, Final Myth Decoder results, certificate and profile are deleted with it, and the certificate link and QR stop working. Technical logs are kept for the periods set by our providers."] },
      { h: "9. Your rights", p: [`You can request access, correction, deletion, restriction, object to processing, ask for a copy of your data and withdraw consent. Write to ${contact(loc)}. You may also complain to a data protection authority.`] },
      { h: "10. Age", p: ["Accounts are for people aged 16 or over. Public pages can be viewed without an account."] },
      { h: "11. Automated scoring", p: ["Final Myth Decoder answers are scored automatically against predefined correct answers. The result has no legal or similar effect on you and is used only to issue the certificate."] },
      { h: "12. Changes", p: [`Version of ${OPERATOR.effectiveDate.en}. If we make material changes, we will update the date and say so on the site.`] },
    ],
  };
}

export function termsDoc(loc: Locale): LegalDoc {
  return loc === "ru" ? {
    title: "Условия использования",
    lead: "Короткие правила работы с MIYU Academy.",
    sections: [
      { h: "1. О сервисе", p: [`${OPERATOR.brand} (${OPERATOR.site}) — образовательный сайт. Оператор: ${who(loc)}. Пользуясь сайтом, вы принимаете эти условия.`] },
      { h: "2. Аккаунт", list: ["Аккаунт можно создать, если вам не меньше 16 лет.", "Вы отвечаете за доступ к своей почте и аккаунту Google.", "Укажите в сертификате своё настоящее имя. После выпуска имя изменить нельзя."] },
      { h: "3. Материалы курса", p: ["Тексты, иллюстрации, структура курса, Final Myth Decoder и дизайн сертификата принадлежат MIYU Academy. Вы можете проходить курс для личного обучения. Нельзя копировать, распространять или перепродавать материалы без письменного разрешения."] },
      { h: "4. Сертификат", p: ["Сертификат подтверждает, что вы прошли курс MIYU Academy и успешно завершили Final Myth Decoder. Он не является государственным документом об образовании или официальной квалификацией. Подлинность проверяется по ссылке или QR-коду."] },
      { h: "5. Правила использования", list: ["Не пытайтесь получить доступ к чужим аккаунтам и данным.", "Не нарушайте работу сайта и не обходите проверку финала.", "Не используйте сайт в незаконных целях."] },
      { h: "6. Доступность и ответственность", p: ["Мы стараемся, чтобы сайт работал стабильно, но не гарантируем бесперебойность. Материалы носят образовательный характер. В пределах, разрешённых законом, оператор не отвечает за косвенные убытки."] },
      { h: "7. Удаление аккаунта и прекращение доступа", p: ["Вы можете удалить аккаунт в настройках в любой момент. Мы можем ограничить доступ при нарушении этих условий."] },
      { h: "8. Изменения и право", p: [`Мы можем обновлять условия, актуальная редакция всегда на этой странице. Применимое право: ${OPERATOR.governingLaw ?? "[применимое право]"}.`, `Вопросы: ${contact(loc)}. Редакция от ${OPERATOR.effectiveDate.ru}.`] },
    ],
  } : {
    title: "Terms of Use",
    lead: "Short rules for using MIYU Academy.",
    sections: [
      { h: "1. About the service", p: [`${OPERATOR.brand} (${OPERATOR.site}) is an educational website. Operator: ${who(loc)}. By using the site you accept these terms.`] },
      { h: "2. Your account", list: ["You can create an account if you are at least 16.", "You are responsible for access to your email and Google account.", "Enter your real name for the certificate. It cannot be changed after issuing."] },
      { h: "3. Course materials", p: ["The texts, illustrations, course structure, Final Myth Decoder and certificate design belong to MIYU Academy. You may take the course for your own learning. You may not copy, distribute or resell the materials without written permission."] },
      { h: "4. Certificate", p: ["The certificate confirms that you completed a MIYU Academy course and passed the Final Myth Decoder. It is not an official educational document or a state-recognised qualification. Its authenticity can be checked with its link or QR code."] },
      { h: "5. Acceptable use", list: ["Do not try to access other people's accounts or data.", "Do not disrupt the site or bypass the Final Myth Decoder checks.", "Do not use the site for unlawful purposes."] },
      { h: "6. Availability and liability", p: ["We aim to keep the site reliable but do not guarantee uninterrupted service. The materials are educational. To the extent permitted by law, the operator is not liable for indirect losses."] },
      { h: "7. Account deletion and termination", p: ["You can delete your account in settings at any time. We may restrict access if these terms are breached."] },
      { h: "8. Changes and governing law", p: [`We may update these terms; the current version is always on this page. Governing law: ${OPERATOR.governingLaw ?? "[governing law]"}.`, `Questions: ${contact(loc)}. Version of ${OPERATOR.effectiveDate.en}.`] },
    ],
  };
}

export function cookiesDoc(loc: Locale): LegalDoc {
  return loc === "ru" ? {
    title: "Cookies и локальное хранилище",
    lead: "Необходимое работает всегда. Аналитика включается только с вашего согласия.",
    sections: [
      { h: "Необходимые", list: [
        "Сессия входа (cookies Supabase, имя начинается с «sb-»): держит вас в аккаунте.",
        "miyu_analytics_consent (локальное хранилище): запоминает ваш выбор по аналитике."] },
      { h: "Аналитика, только с согласием", list: [
        "Google Analytics 4 (cookies «_ga» и «_ga_…», срок до 2 лет): анонимная статистика посещений, чтобы улучшать курс.",
        "Рекламных и маркетинговых трекеров нет, запись сессий не ведётся."] },
      { h: "Как изменить выбор", p: ["Откройте «Настройки приватности» внизу любой страницы. Отзыв согласия так же прост, как его выдача, и не влияет на работу курса."] },
    ],
  } : {
    title: "Cookies and local storage",
    lead: "Essentials always work. Analytics runs only with your consent.",
    sections: [
      { h: "Essential", list: [
        "Sign-in session (Supabase cookies whose names start with “sb-”): keeps you signed in.",
        "miyu_analytics_consent (local storage): remembers your analytics choice."] },
      { h: "Analytics, only with consent", list: [
        "Google Analytics 4 (“_ga” and “_ga_…” cookies, up to 2 years): anonymous visit statistics to help improve the course.",
        "There are no advertising or marketing trackers and no session recording."] },
      { h: "How to change your choice", p: ["Open “Privacy settings” at the bottom of any page. Withdrawing consent is as easy as giving it and does not affect the course."] },
    ],
  };
}
