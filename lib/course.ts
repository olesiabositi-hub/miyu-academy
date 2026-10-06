export const COURSE_ID = "greek-mythology" as const;
export const CONTENT_VERSION = "gm-v2" as const;
export const LOCALES = ["en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];

export const COURSE_TITLE: Record<Locale,string> = {
  en: "Greek Mythology: Decode the World Around You",
  ru: "Греческая мифология: расшифруй мир вокруг себя",
};

export const MODULE_IDS = Array.from({length:8},(_,i)=>`module-${String(i+1).padStart(2,"0")}`) as readonly string[];

export function isLocale(value:string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
