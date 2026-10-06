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
      a:({href,children})=><a href={href} rel="noreferrer">{children}</a>,
    }}
  >{children}</ReactMarkdown>;
}
