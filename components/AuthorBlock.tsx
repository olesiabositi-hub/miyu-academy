import type { Locale } from "@/lib/course";
import { AUTHOR } from "@/lib/content/home";

export function AuthorBlock({locale}:{locale:Locale}){
  const a=AUTHOR[locale];
  return <section className="hxSection hxAuthor" aria-labelledby="author-title">
    <div className="hxWrap hxAuthorGrid">
      <figure className="hxPortrait">
        <picture>
          <source media="(max-width: 700px)" srcSet="/visuals/home/author-420.webp"/>
          <img src="/visuals/home/author-720.webp" width={720} height={960} alt={a.alt} loading="lazy" decoding="async"/>
        </picture>
      </figure>
      <div className="hxAuthorCopy">
        <div className="lxEyebrow">{a.eyebrow}</div>
        <h2 className="hxH2" id="author-title">{a.title}</h2>
        {a.paragraphs.map((p,i)=><p key={i}>{p}</p>)}
        <blockquote className="hxQuote">{a.quote}</blockquote>
      </div>
    </div>
  </section>;
}
