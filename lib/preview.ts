/**
 * Deploy previews are separate Netlify builds with CONTEXT=deploy-preview. Deciding "preview or not" at build time
 * (instead of reading the request host) lets every page be built in advance as a ready file.
 * Locally (no CONTEXT) this is false.
 */
export const IS_PREVIEW = process.env.CONTEXT === "deploy-preview";

/** Kept as a function so pages read the same way as before. Never reads the request, so pages stay static. */
export async function isPreviewRequest(): Promise<boolean> {
  return IS_PREVIEW;
}
