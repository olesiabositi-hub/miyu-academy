/**
 * Public contact details shown on the legal pages.
 * No personal or sole-proprietor identity details are published on the site.
 */
export const OPERATOR = {
  brand: "MIYU Academy",
  site: "miyu.academy",
  privacyEmail: "privacy@miyu.academy" as string | null,
  governingLaw: { ru: "законодательство Грузии", en: "the laws of Georgia" } as { ru: string; en: string } | null,
  effectiveDate: { ru: "23 октября 2026", en: "23 October 2026" },
};

export function operatorComplete(): boolean {
  return !!(OPERATOR.privacyEmail && OPERATOR.governingLaw);
}
