/**
 * Preview mode: ONLY for Netlify deploy previews of this site
 * (deploy-preview-<n>--miyu-academy.netlify.app). Lets the owner look at lessons and the
 * Final Myth Decoder without signing in. Nothing is read from or written to the database.
 * The production domain and the plain *.netlify.app site never match.
 * Pure function: safe to import from middleware.
 */
const PREVIEW_HOST = /^deploy-preview-\d+--miyu-academy\.netlify\.app$/i;

export function isPreviewHost(host: string | null | undefined): boolean {
  if(!host||!PREVIEW_HOST.test(host)) return false;
  // Netlify sets CONTEXT at build/run time; when present it must be a deploy preview.
  const ctx=process.env.CONTEXT;
  return !ctx||ctx==="deploy-preview";
}
