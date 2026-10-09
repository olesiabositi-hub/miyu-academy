import type { Locale } from "@/lib/course";

/**
 * Interface dictionary (RU / EN).
 *
 * Only UI chrome lives here: navigation, buttons, labels, footer. Lesson text and the
 * Final Myth Decoder come from /content and are never edited through this file.
 * Add a key to `ru` first; TypeScript then requires the same key in `en`.
 */
const ru = {
  "skip.main": "Перейти к содержимому",

  "nav.primary": "Основная навигация",
  "nav.academy": "Академия",
  "nav.course": "Курс",
  "nav.progress": "Прогресс",
  "nav.progressModule": "Мой прогресс",
  "nav.menuOpen": "Открыть меню",
  "nav.menuClose": "Закрыть меню",
  "nav.language": "Язык",
  "nav.moduleOf": "Модуль {n} из {total}",

  "module.eyebrow": "МОДУЛЬ {n} ИЗ {total}",
  "module.previous": "Предыдущий модуль",
  "module.next": "Следующий модуль",
  "module.allModules": "Все модули",
  "module.navLabel": "Навигация по модулям",
  "module.duration": "~{min} мин",

  "footer.tagline": "Культурные курсы, в которых знание начинает работать за пределами урока.",
  "footer.groupAcademy": "Академия",
  "footer.groupLegal": "Правовая информация",
  "footer.groupMore": "Ещё",
  "footer.privacy": "Конфиденциальность",
  "footer.terms": "Условия",
  "footer.accessibility": "Доступность",
  "footer.credits": "Источники",
  "footer.privacySettings": "Настройки приватности",
  "footer.rights": "Все права защищены.",
} as const;

export type UiKey = keyof typeof ru;

const en: Record<UiKey, string> = {
  "skip.main": "Skip to main content",

  "nav.primary": "Primary",
  "nav.academy": "Academy",
  "nav.course": "Course",
  "nav.progress": "Progress",
  "nav.progressModule": "My progress",
  "nav.menuOpen": "Open menu",
  "nav.menuClose": "Close menu",
  "nav.language": "Language",
  "nav.moduleOf": "Module {n} of {total}",

  "module.eyebrow": "MODULE {n} OF {total}",
  "module.previous": "Previous module",
  "module.next": "Next module",
  "module.allModules": "All modules",
  "module.navLabel": "Module navigation",
  "module.duration": "~{min} min",

  "footer.tagline": "Cultural learning designed to keep working outside the lesson.",
  "footer.groupAcademy": "Academy",
  "footer.groupLegal": "Legal",
  "footer.groupMore": "More",
  "footer.privacy": "Privacy",
  "footer.terms": "Terms",
  "footer.accessibility": "Accessibility",
  "footer.credits": "Credits",
  "footer.privacySettings": "Privacy settings",
  "footer.rights": "All rights reserved.",
};

export function t(locale: Locale, key: UiKey, vars?: Record<string, string | number>): string {
  const raw: string = locale === "ru" ? ru[key] : en[key];
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (whole, name: string) => (name in vars ? String(vars[name]) : whole));
}
