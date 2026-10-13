import { Rune } from "@/components/Rune";
import type { RuneName } from "@/components/Rune";

/** Thin decorative divider: a line fading out on both sides with three runes. Purely visual. */
export function RuneDivider({ runes = ["fehu", "algiz", "tiwaz"] }: { runes?: [RuneName, RuneName, RuneName] }) {
  return <div className="runeDivider" aria-hidden="true">
    {runes.map((r) => <Rune key={r} name={r} size={24} />)}
  </div>;
}
