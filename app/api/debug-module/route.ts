import { NextResponse } from "next/server";
import { isLocale, MODULE_IDS } from "@/lib/course";
import { parseLesson } from "@/lib/content/parser";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale") ?? "ru";
  const moduleId = url.searchParams.get("module") ?? "module-01";

  if (!isLocale(locale) || !MODULE_IDS.includes(moduleId)) {
    return NextResponse.json({ ok: false, stage: "input" }, { status: 400 });
  }

  try {
    const model = parseLesson(moduleId, locale);
    return NextResponse.json({
      ok: true,
      moduleId: model.moduleId,
      locale: model.locale,
      blocks: model.blocks.length,
      firstBlock: model.blocks[0]?.type ?? null
    });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      name: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
