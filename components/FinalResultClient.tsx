"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/course";
import { COURSE_ID } from "@/lib/course";
import { courseBasePath } from "@/lib/courses";
import { t } from "@/lib/i18n";
import { readStore, saveFinal } from "@/lib/progress";
import { FinalReview, type ReviewQ } from "@/components/FinalReview";
import { SupportNote } from "@/components/SupportNote";
import { PreviewBadge } from "@/components/PreviewBadge";
import { useDemo } from "@/lib/useDemo";

const PASS = 12;

/** Result of the Final Myth Decoder, scored in the browser from the answers saved there. */
export function FinalResultClient({ locale, questions, preview }: { locale: Locale; questions: ReviewQ[]; preview: boolean }) {
  const demo = useDemo();
  const router = useRouter();
  const base = courseBasePath(locale);
  const [selected, setSelected] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    if (demo === undefined) return; // address not read yet
    if (preview && demo) {
      // Sample answers: all right except a few, so the review can be checked.
      const wrong: Record<string, number> = demo === "fail" ? { "FMD-01": 0, "FMD-03": 2, "FMD-05": 1, "FMD-07": 1, "FMD-09": 2, "FMD-11": 1 } : { "FMD-04": 2, "FMD-12": 1 };
      setSelected({ ...Object.fromEntries(questions.map((q) => [q.id, q.ru.answer])), ...wrong });
      return;
    }
    const sub = readStore().courses[COURSE_ID]?.final?.submitted;
    if (!sub) { router.replace(`${base}/final-myth-decoder`); return; }
    setSelected(sub);
  }, [preview, demo, questions, router, base]);

  const total = questions.length;
  const score = selected ? questions.filter((q) => selected[q.id] === q.ru.answer).length : 0;
  const passed = score >= PASS;

  useEffect(() => {
    if (!selected || (preview && demo)) return;
    const prev = readStore().courses[COURSE_ID]?.final;
    saveFinal(COURSE_ID, { latestScore: score, passed: passed || !!prev?.passed });
  }, [selected, score, passed, preview, demo]);

  if (!selected) return <section className="fmd fmdIntro" aria-busy="true" />;

  const badge = preview ? <><PreviewBadge locale={locale} /><p className="fmdNote"><Link href="?demo=pass">demo: pass</Link> · <Link href="?demo=fail">demo: fail</Link></p></> : null;
  if (passed) return <><section className="fmd fmdIntro fmdResult is-pass">{badge}
    <div className="lxEyebrow">FINAL MYTH DECODER</div>
    <div className="fmdScore">{t(locale, "fmd.scoreOf", { score, total })}</div>
    <h1 className="fmdHeadline">{t(locale, "fmd.resultPassTitle")}</h1>
    <p className="fmdLead">{t(locale, "fmd.resultPassBody")}</p>
    <Link className="lxBtn lxBtnGold" href={base}>{t(locale, "fmd.toCourse")} <span aria-hidden="true">→</span></Link>
  </section><FinalReview locale={locale} selected={selected} questions={questions} /><SupportNote locale={locale} /><div className="supportNoteSpacer" /></>;
  return <><section className="fmd fmdIntro fmdResult">{badge}
    <div className="lxEyebrow">FINAL MYTH DECODER</div>
    <div className="fmdScore">{t(locale, "fmd.scoreOf", { score, total })}</div>
    <h1 className="fmdHeadline">{t(locale, "fmd.almost")}</h1>
    <p className="fmdLead">{t(locale, "fmd.needed", { pass: PASS, total })}</p>
    <div className="fmdNav fmdNavStart">
      <Link className="lxBtn lxBtnGhost" href={base}>{t(locale, "fmd.toCourse")}</Link>
      <Link className="lxBtn" href={`${base}/final-myth-decoder`}>{t(locale, "fmd.retry")}</Link>
    </div>
  </section><FinalReview locale={locale} selected={selected} questions={questions} /><SupportNote locale={locale} /><div className="supportNoteSpacer" /></>;
}
