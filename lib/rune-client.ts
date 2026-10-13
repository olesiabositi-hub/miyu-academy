import { RUNE_IDS, runeById } from "@/lib/runes";
import type { RuneName } from "@/components/Rune";

/**
 * Asks the server for a rune. In a deploy preview nothing is stored and the server answers `preview`,
 * so we show a stable demo rune instead. Returns null when the draw failed (the lesson goes on anyway).
 */
export async function drawRune(courseId: string, source: string, seed = 1): Promise<RuneName | null> {
  try {
    const r = await fetch("/api/rune/draw", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ courseId, source }) });
    if (!r.ok) return null;
    const j = await r.json();
    if (j?.preview) return RUNE_IDS[(seed * 7) % RUNE_IDS.length];
    return j?.rune && runeById(j.rune) ? (j.rune as RuneName) : null;
  } catch { return null; }
}
