import type { Locale } from "@/lib/course";

/** Small notice shown only on deploy previews. */
export function PreviewBadge({locale}:{locale:Locale}){
  return <div className="previewBadge" role="note">{locale==="ru"?"Режим просмотра: прогресс хранится только в этом браузере":"Preview mode: progress is kept in this browser only"}</div>;
}
