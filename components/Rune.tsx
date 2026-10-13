/**
 * Elder Futhark runes drawn as SVG strokes, so they look the same on every device (font support for
 * the Runic block is patchy). Decorative only: they are never read as text and carry no translation.
 */
const PATHS = {
  fehu: "M6 3v22M6 9l9-6M6 16l9-6",
  thurisaz: "M6 3v22M6 7l9 6-9 6",
  ansuz: "M6 3v22M6 6l9 5M6 13l9 5",
  kenaz: "M15 5L7 14l8 9",
  naudhiz: "M10 3v22M4 11l12 5",
  isa: "M10 3v22",
  hagalaz: "M5 3v22M15 3v22M5 10l10 6",
  algiz: "M10 3v22M10 12L3 5M10 12l7-7",
  othala: "M10 3l7 8-7 8-7-8zM5 25l5-6 5 6",
  dagaz: "M5 3v22l10-22v22",
  tiwaz: "M10 3v22M10 3L3 11M10 3l7 8",
  berkano: "M5 3v22M5 3l9 5-9 5 9 5-9 5",
  sowilo: "M14 3L6 11l8 6-8 8",
  laguz: "M6 25V3l9 6",
  uruz: "M5 25V3l10 7v15",
  raidho: "M5 3v22M5 3h7l4 4-4 5H5M5 12l11 13",
  gebo: "M4 4l12 20M16 4L4 24",
  wunjo: "M6 3v22M6 3h7l4 4-4 4H6",
  jera: "M7 4l5 5-5 5M13 13l-5 5 5 5",
  eihwaz: "M10 3v22M10 3l5 5M10 25l-5-5",
  perthro: "M5 3v22M5 3l10 6-10 6M5 15l10 6-10 4",
  ehwaz: "M5 25V3M15 25V3M5 3l5 7 5-7",
  mannaz: "M5 25V3M15 25V3M5 3l10 10M15 3L5 13",
  ingwaz: "M10 3l7 11-7 11-7-11z",
} as const;

export type RuneName = keyof typeof PATHS;

export function Rune({ name, size = 22, className }: { name: RuneName; size?: number; className?: string }) {
  return <svg className={className} viewBox="0 0 20 28" width={size * 20 / 28} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true" focusable="false">
    <path d={PATHS[name]} />
  </svg>;
}
