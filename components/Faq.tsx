import type { Locale } from "@/lib/course";
import { FAQ } from "@/lib/content/home";

/** Accessible accordion (native details/summary) plus FAQPage structured data. */
export function Faq({locale,title,eyebrow}:{locale:Locale;title:string;eyebrow:string}){
  const items=FAQ[locale];
  const ld={
    "@context":"https://schema.org","@type":"FAQPage",
    mainEntity:items.map(i=>({"@type":"Question",name:i.q,acceptedAnswer:{"@type":"Answer",text:i.a}})),
  };
  return <section className="hxSection hxFaq" aria-labelledby="faq-title">
    <div className="hxWrap hxFaqGrid">
      <div className="hxFaqHead">
        <div className="lxEyebrow">{eyebrow}</div>
        <h2 className="hxH2" id="faq-title">{title}</h2>
      </div>
      <div className="hxFaqList">
        {items.map(i=><details className="hxFaqItem" key={i.q}>
          <summary>{i.q}<span aria-hidden="true"/></summary>
          <p>{i.a}</p>
        </details>)}
      </div>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld).replace(/</g,"\\u003c")}}/>
  </section>;
}
