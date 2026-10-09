/**
 * Operator details shown on the legal pages. Fill the `null` fields before the public launch:
 * the pages show a visible notice while any of them is missing, and the build keeps working.
 */
export const OPERATOR = {
  brand: "MIYU Academy",
  site: "miyu.academy",
  legalName: "Olesia Botsieva, IE" as string | null,
  address: null as string | null,
  country: null as string | null,
  privacyEmail: null as string | null,
  governingLaw: null as string | null,
  effectiveDate: { ru: "9 октября 2026", en: "9 October 2026" },
};

export function operatorComplete(): boolean {
  return !!(OPERATOR.legalName && OPERATOR.address && OPERATOR.country && OPERATOR.privacyEmail && OPERATOR.governingLaw);
}
