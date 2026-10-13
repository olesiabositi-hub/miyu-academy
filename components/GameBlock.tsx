"use client";
import type { Locale } from "@/lib/course";
import { YggdrasilGame } from "@/components/YggdrasilGame";

/** Picks the interactive for a `[[game:name]]` chunk of a lesson. Unknown names render nothing. */
export function GameBlock({ game, locale, courseId }: { game: string; locale: Locale; courseId: string }) {
  if (game === "yggdrasil") return <YggdrasilGame locale={locale} courseId={courseId} />;
  return null;
}
