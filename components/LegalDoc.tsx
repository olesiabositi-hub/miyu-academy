import type { Locale } from "@/lib/course";
import type { LegalDoc as Doc } from "@/lib/content/legal";
import { OPERATOR, operatorComplete } from "@/lib/legal";

export function LegalDocView({doc,locale,showOperatorNotice=true}:{doc:Doc;locale:Locale;showOperatorNotice?:boolean}){
  return <article className="legalDoc">
    <div className="lxEyebrow">MIYU ACADEMY</div>
    <h1 className="legalTitle">{doc.title}</h1>
    <p className="legalLead">{doc.lead}</p>
    {showOperatorNotice&&!operatorComplete()&&<div className="certNote" role="note">
      {locale==="ru"?"Черновик: перед публичным запуском нужно указать реквизиты оператора (адрес, страна, email, применимое право).":"Draft: operator details (address, country, email, governing law) must be filled in before the public launch."}
    </div>}
    {doc.sections.map(s=><section key={s.h} className="legalSection">
      <h2>{s.h}</h2>
      {s.p?.map((t,i)=><p key={i}>{t}</p>)}
      {s.list&&<ul>{s.list.map((t,i)=><li key={i}>{t}</li>)}</ul>}
    </section>)}
    <p className="legalDate">{locale==="ru"?"Редакция от":"Version of"} {OPERATOR.effectiveDate[locale]}</p>
  </article>;
}
