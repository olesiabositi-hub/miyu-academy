import type { Locale } from "@/lib/course";
import { OPERATOR } from "@/lib/legal";

export type LegalSection = { h: string; p?: string[]; list?: string[] };
export type LegalDoc = { title: string; lead: string; sections: LegalSection[] };

const contact = (loc: Locale) => OPERATOR.privacyEmail ?? (loc === "ru" ? "[контактный email]" : "[contact email]");

export function privacyDoc(loc: Locale): LegalDoc {
  return loc === "ru" ? {
    title: "Политика конфиденциальности",
    lead: "Мы собираем только то, что нужно для работы курса, и не продаём данные учеников.",
    sections: [
      { h: "1. Контакты", p: [`По вопросам о ваших данных на сайте ${OPERATOR.site} пишите на ${contact(loc)}.`] },
      { h: "2. Какие данные мы обрабатываем", list: [
        "Аккаунтов на сайте нет: мы не спрашиваем имя, email или пароль.",
        "Прогресс обучения (статусы модулей, место, где вы остановились, ответы на проверки, руны, ответы и результат Final Myth Decoder) хранится только в локальном хранилище вашего браузера. Он не отправляется нам, и мы его не видим.",
        "Технические журналы: IP-адрес и сведения о браузере, которые создаёт хостинг и защита от злоупотреблений.",
        "Аналитика: только если вы дали согласие (см. раздел 6)."] },
      { h: "3. Для чего и на каком основании", list: [
        "Предоставление курса: это нужно, чтобы оказать запрошенную вами услугу.",
        "Безопасность и защита от злоупотреблений: наш законный интерес.",
        "Аналитика: ваше согласие. Его можно отозвать в любой момент в настройках приватности. Курс работает без аналитики."] },
      { h: "4. Кому мы передаём данные", p: ["Мы используем поставщиков, которые обрабатывают данные по нашему поручению:"], list: [
        "Netlify: хостинг сайта.",
        "Google: только с вашего согласия, Google Analytics."] },
      { h: "5. Передача данных за границу", p: ["Поставщики могут обрабатывать данные за пределами вашей страны, в том числе в США. Мы опираемся на условия обработки данных и гарантии этих поставщиков."] },
      { h: "6. Cookies и аналитика", p: ["Локальное хранилище браузера нужно, чтобы помнить ваш прогресс и ваш выбор по аналитике. Google Analytics 4 включается только после вашего согласия. Подробности на странице «Cookies». Рекламных и маркетинговых трекеров нет, запись сессий не ведётся."] },
      { h: "7. Срок хранения", p: ["Прогресс хранится в вашем браузере, пока вы его не удалите: кнопкой «Стереть прогресс» в настройках приватности или очисткой данных сайта в браузере. Технические журналы хранятся в сроки, которые устанавливают поставщики."] },
      { h: "8. Ваши права", p: [`Вы можете запросить доступ к данным, их исправление, удаление, ограничение обработки, возражать против обработки, запросить копию данных и отозвать согласие. Напишите на ${contact(loc)}. Вы также можете подать жалобу в надзорный орган по защите данных.`] },
      { h: "9. Возраст", p: ["Курс рассчитан на читателей от 16 лет."] },
      { h: "10. Автоматическая проверка финала", p: ["Ответы в Final Myth Decoder проверяются автоматически в вашем браузере по заранее заданным правильным ответам. Результат носит учебный характер, не влияет на ваши права или обязательства и нужен только для того, чтобы показать вам итог."] },
      { h: "11. Изменения", p: [`Редакция от ${OPERATOR.effectiveDate.ru}. Если мы существенно изменим политику, мы обновим дату и сообщим об этом на сайте.`] },
    ],
  } : {
    title: "Privacy Notice",
    lead: "We collect only what the course needs, and we never sell learner data.",
    sections: [
      { h: "1. Contact", p: [`For questions about your data on ${OPERATOR.site}, write to ${contact(loc)}.`] },
      { h: "2. Data we process", list: [
        "There are no accounts: we do not ask for your name, email or a password.",
        "Learning progress (module statuses, where you left off, answers to checks, runes, Final Myth Decoder answers and result) is kept only in your browser's local storage. It is never sent to us and we cannot see it.",
        "Technical logs: IP address and browser details created by hosting and abuse protection.",
        "Analytics: only if you consent (see section 6)."] },
      { h: "3. Purposes and legal bases", list: [
        "Providing the course: necessary to deliver the service you requested.",
        "Security and abuse prevention: our legitimate interest.",
        "Analytics: your consent. You can withdraw it at any time in Privacy settings. The course works without analytics."] },
      { h: "4. Who receives data", p: ["We use providers that process data on our behalf:"], list: [
        "Netlify: website hosting.",
        "Google: only with your consent, Google Analytics."] },
      { h: "5. International transfers", p: ["Providers may process data outside your country, including in the United States. We rely on the data-processing terms and safeguards of these providers."] },
      { h: "6. Cookies and analytics", p: ["Your browser's local storage is used to remember your progress and your analytics choice. Google Analytics 4 is switched on only after you consent. See the Cookies page for details. There are no advertising or marketing trackers and no session recording."] },
      { h: "7. Retention", p: ["Progress stays in your browser until you remove it: with “Erase progress” in Privacy settings or by clearing this site's data in your browser. Technical logs are kept for the periods set by our providers."] },
      { h: "8. Your rights", p: [`You can request access, correction, deletion, restriction, object to processing, ask for a copy of your data and withdraw consent. Write to ${contact(loc)}. You may also complain to a data protection authority.`] },
      { h: "9. Age", p: ["The course is meant for readers aged 16 or over."] },
      { h: "10. Automated scoring", p: ["Final Myth Decoder answers are scored automatically in your browser against predefined correct answers. The result is for learning only, has no legal or similar effect on you, and is used only to show you your outcome."] },
      { h: "11. Changes", p: [`Version of ${OPERATOR.effectiveDate.en}. If we make material changes, we will update the date and say so on the site.`] },
    ],
  };
}

export function termsDoc(loc: Locale): LegalDoc {
  return loc === "ru" ? {
    title: "Условия использования",
    lead: "Короткие правила работы с MIYU Academy.",
    sections: [
      { h: "1. О сервисе", p: [`${OPERATOR.brand} (${OPERATOR.site}) — образовательный сайт с открытыми курсами. Пользуясь сайтом, вы принимаете эти условия.`] },
      { h: "2. Без аккаунта", list: ["Регистрация не нужна: курсы открыты всем.", "Прогресс хранится только в вашем браузере. Если очистить данные сайта или открыть курс на другом устройстве, прогресс начнётся заново."] },
      { h: "3. Материалы курса", p: ["Тексты, иллюстрации, структура курса и Final Myth Decoder принадлежат MIYU Academy. Вы можете проходить курс для личного обучения. Нельзя копировать, распространять или перепродавать материалы без письменного разрешения."] },
      { h: "4. Тесты", p: ["Проверки в уроках и Final Myth Decoder необязательны: их можно пройти для себя или просто читать курс. Результаты носят учебный характер и не являются официальной оценкой, документом об образовании или квалификацией."] },
      { h: "5. Правила использования", list: ["Не нарушайте работу сайта.", "Не используйте сайт в незаконных целях."] },
      { h: "6. Доступность и ответственность", p: ["Мы стараемся, чтобы сайт работал стабильно, но не гарантируем бесперебойность. Материалы носят образовательный характер. В пределах, разрешённых законом, мы не отвечаем за косвенные убытки."] },
      { h: "7. Удаление прогресса и прекращение доступа", p: ["Вы можете стереть свой прогресс в настройках приватности в любой момент. Мы можем ограничить доступ при нарушении этих условий."] },
      { h: "8. Изменения и право", p: [`Мы можем обновлять условия, актуальная редакция всегда на этой странице. Применимое право: ${OPERATOR.governingLaw?.ru ?? "[применимое право]"}.`, `Вопросы: ${contact(loc)}. Редакция от ${OPERATOR.effectiveDate.ru}.`] },
    ],
  } : {
    title: "Terms of Use",
    lead: "Short rules for using MIYU Academy.",
    sections: [
      { h: "1. About the service", p: [`${OPERATOR.brand} (${OPERATOR.site}) is an educational website with open courses. By using the site you accept these terms.`] },
      { h: "2. No account", list: ["No sign-up is needed: the courses are open to everyone.", "Progress is kept only in your browser. If you clear this site's data or open a course on another device, your progress starts again."] },
      { h: "3. Course materials", p: ["The texts, illustrations, course structure and Final Myth Decoder belong to MIYU Academy. You may take the course for your own learning. You may not copy, distribute or resell the materials without written permission."] },
      { h: "4. Tests", p: ["In-lesson checks and the Final Myth Decoder are optional: you can take them for yourself or simply read the course. Results are for learning only and are not an official assessment, educational document or qualification."] },
      { h: "5. Acceptable use", list: ["Do not disrupt the site.", "Do not use the site for unlawful purposes."] },
      { h: "6. Availability and liability", p: ["We aim to keep the site reliable but do not guarantee uninterrupted service. The materials are educational. To the extent permitted by law, we are not liable for indirect losses."] },
      { h: "7. Erasing progress and termination", p: ["You can erase your progress in Privacy settings at any time. We may restrict access if these terms are breached."] },
      { h: "8. Changes and governing law", p: [`We may update these terms; the current version is always on this page. Governing law: ${OPERATOR.governingLaw?.en ?? "[governing law]"}.`, `Questions: ${contact(loc)}. Version of ${OPERATOR.effectiveDate.en}.`] },
    ],
  };
}

export function cookiesDoc(loc: Locale): LegalDoc {
  return loc === "ru" ? {
    title: "Cookies и локальное хранилище",
    lead: "Необходимое работает всегда. Аналитика включается только с вашего согласия.",
    sections: [
      { h: "Необходимые", list: [
        "miyu.progress.v1 (локальное хранилище): ваш прогресс по курсам. Не покидает браузер.",
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
        "miyu.progress.v1 (local storage): your course progress. It never leaves your browser.",
        "miyu_analytics_consent (local storage): remembers your analytics choice."] },
      { h: "Analytics, only with consent", list: [
        "Google Analytics 4 (“_ga” and “_ga_…” cookies, up to 2 years): anonymous visit statistics to help improve the course.",
        "There are no advertising or marketing trackers and no session recording."] },
      { h: "How to change your choice", p: ["Open “Privacy settings” at the bottom of any page. Withdrawing consent is as easy as giving it and does not affect the course."] },
    ],
  };
}
