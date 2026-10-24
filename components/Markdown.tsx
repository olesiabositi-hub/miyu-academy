import { Children } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Text content of React children (for measuring a line). */
function plain(node:unknown):string{
  if(node==null||typeof node==="boolean") return "";
  if(typeof node==="string"||typeof node==="number") return String(node);
  if(Array.isArray(node)) return node.map(plain).join("");
  const props=(node as {props?:{children?:unknown}}).props;
  return props?plain(props.children):"";
}

/** A paragraph that starts with a short bold label ("**Главная мысль модуля:** …") — shown as a note. */
function noteLabel(kids:ReturnType<typeof Children.toArray>):string|null{
  const first=kids[0] as {type?:unknown;props?:{children?:unknown}}|undefined;
  if(!first||first.type!=="strong"||kids.length<2) return null;
  const label=String(Children.toArray(first.props?.children as never).join("")).trim();
  return /^[^\n]{2,60}:$/.test(label)?label.slice(0,-1):null;
}

/** `notes`: turn "**Label:** text" paragraphs into notes (lesson text of courses on the base). */
export function Markdown({children,notes=false}:{children:string;notes?:boolean}){
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
        // A short bold line ("Гера", "«по версии Гесиода…»") is a key line; a longer one is a pull quote.
        const strongText=only&&only.type==="strong"?plain((only as {props?:{children?:unknown}}).props?.children):"";
        const cls=only&&only.type==="strong"?(strongText.length<40?"keyLine":"pullLine"):only&&only.type==="em"?"leadLine":undefined;
        const label=notes&&!cls?noteLabel(kids):null;
        if(label) return <aside className="mxNote"><div className="mxNoteLabel">{label}</div><div className="mxNoteBody"><p>{kids.slice(1)}</p></div></aside>;
        return <p className={cls}>{children}</p>;
      },
      img:({src,alt})=><figure className="lessonFigure"><img src={typeof src==="string"?src:undefined} alt={alt??""} loading="lazy" decoding="async"/>{alt?<figcaption>{alt}</figcaption>:null}</figure>,
      a:({href,children})=><a href={href} target={href&&/^https?:/.test(href)?"_blank":undefined} rel="noreferrer noopener">{children}</a>,
    }}
  >{children}</ReactMarkdown>;
}
