import type { Locale } from "@/lib/course";

/** Small notice shown only on deploy previews. */
export function PreviewBadge({locale}:{locale:Locale}){
  return <div className="previewBadge" role="note">{locale==="ru"?"Режим просмотра: без входа, прогресс не сохраняется":"Preview mode: no sign-in, progress is not saved"}</div>;
}
