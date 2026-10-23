import type { RuneName } from "@/components/Rune";
import { drawRuneLocal } from "@/lib/progress";

/**
 * Draws a rune for this source and keeps it in this browser. The same source always gives the same rune,
 * and a rune never repeats. Returns null when all 24 are already drawn (the lesson goes on anyway).
 */
export async function drawRune(courseId: string, source: string, _seed = 1): Promise<RuneName | null> {
  try { return drawRuneLocal(courseId, source); } catch { return null; }
}
