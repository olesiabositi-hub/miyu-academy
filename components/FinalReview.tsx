import type { Locale } from "@/lib/course";
import { t } from "@/lib/i18n";

export type ReviewQ={id:string;ru:{question:string;options:string[];answer:number;feedback:string};en:{question:string;options:string[];answer:number;feedback:string}};

/**
 * Shown only on the result page, i.e. after an attempt has been submitted.
 * Correct answers and explanations never reach the browser during the test itself.
 */
export function FinalReview({locale,selected,questions}:{locale:Locale;selected:Record<string,number>;questions:ReviewQ[]}){
  const wrong=questions
    .map((q,i)=>({q,n:i+1,L:q[locale],given:selected[q.id]}))
    .filter(x=>x.given!==x.L.answer);
  return <section className="fmdReview" aria-labelledby="fmd-review-title">
    <h2 id="fmd-review-title" className="fmdReviewTitle">{t(locale,"fmd.reviewResultTitle")}</h2>
    {wrong.length===0
      ?<p className="fmdReviewOk">{t(locale,"fmd.reviewAllRight")}</p>
      :<>
        <p className="fmdReviewCount">{t(locale,"fmd.reviewWrong",{n:wrong.length})}</p>
        <ol className="fmdReviewList">
          {wrong.map(({q,n,L,given})=><li key={q.id} className="fmdReviewItem">
            <div className="fmdReviewNum">{String(n).padStart(2,"0")}</div>
            <div className="fmdReviewBody">
              <p className="fmdReviewQ">{L.question}</p>
              <p className="fmdReviewRow is-bad"><span>{t(locale,"fmd.yourAnswer")}</span>{typeof given==="number"&&L.options[given]?L.options[given]:t(locale,"fmd.noAnswer")}</p>
              <p className="fmdReviewRow is-good"><span>{t(locale,"fmd.correctAnswer")}</span>{L.options[L.answer]}</p>
              <p className="fmdReviewWhy">{L.feedback}</p>
            </div>
          </li>)}
        </ol>
      </>}
  </section>;
}
