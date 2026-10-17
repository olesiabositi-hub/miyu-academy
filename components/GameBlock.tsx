"use client";
import type { Locale } from "@/lib/course";
import { YggdrasilGame } from "@/components/YggdrasilGame";
import { ActivityBlock } from "@/components/Activities";

/** Picks the interactive for a `[[game:name]]` or `[[activity:id]]` chunk of a lesson. Unknown names render nothing. */
export function GameBlock({ game, locale, courseId }: { game: string; locale: Locale; courseId: string }) {
  if (game.startsWith("activity:")) return <ActivityBlock id={game.slice(9)} locale={locale} />;
  if (game === "yggdrasil") return <YggdrasilGame locale={locale} courseId={courseId} />;
  return null;
}
