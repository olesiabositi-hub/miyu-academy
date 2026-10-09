import { headers } from "next/headers";
import { isPreviewHost } from "@/lib/previewHost";

export async function isPreviewRequest(): Promise<boolean> {
  const h = await headers();
  return isPreviewHost(h.get("host"));
}
