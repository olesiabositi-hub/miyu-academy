import { Children } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Markdown({children}:{children:string}){
  return <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1:({children})=><h2>{children}</h2>,
      h2:({children})=><h3>{children}</h3>,
      h3:({children})=><h4>{children}</h4>,
      blockquote:({children})=><blockquote>{children}</blockquote>,
      // A paragraph that is only one bold phrase is a pull line; only one italic phrase is a lead.
      p:({children})=>{
        const kids=Children.toArray(children);
        const only=kids.length===1?kids[0] as {type?:unknown;props?:{src?:unknown}}:null;
        // A picture on its own line is a figure: it must not sit inside a <p>.
        if(only&&only.props&&"src" in only.props) return <>{children}</>;
        const cls=only&&only.type==="strong"?"pullLine":only&&only.type==="em"?"leadLine":undefined;
        return <p className={cls}>{children}</p>;
      },
      img:({src,alt})=><figure className="lessonFigure"><img src={typeof src==="string"?src:undefined} alt={alt??""} loading="lazy" decoding="async"/>{alt?<figcaption>{alt}</figcaption>:null}</figure>,
      a:({href,children})=><a href={href} target={href&&/^https?:/.test(href)?"_blank":undefined} rel="noreferrer noopener">{children}</a>,
    }}
  >{children}</ReactMarkdown>;
}
