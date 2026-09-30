import { Fragment } from "react";
import Link from "next/link";
import { parseBlogContent, parseInline } from "@/lib/blog";

// Builds elements from parsed text, never raw HTML, so post content cannot inject markup.
function Inline({ text }) {
  return parseInline(text).map((token, index) => {
    if (token.type === "strong") return <strong key={index}>{token.text}</strong>;
    if (token.type === "em") return <em key={index}>{token.text}</em>;
    if (token.type === "link") {
      return token.href.startsWith("/")
        ? <Link key={index} href={token.href}>{token.text}</Link>
        : <a key={index} href={token.href}>{token.text}</a>;
    }
    return <Fragment key={index}>{token.text}</Fragment>;
  });
}

export function BlogContent({ content }) {
  return <div className="apm-prose">
    {parseBlogContent(content).map((block, index) => {
      if (block.type === "h2") return <h2 key={index}><Inline text={block.text} /></h2>;
      if (block.type === "h3") return <h3 key={index}><Inline text={block.text} /></h3>;
      if (block.type === "quote") return <blockquote key={index}><p><Inline text={block.text} /></p></blockquote>;
      if (block.type === "ul" || block.type === "ol") {
        const List = block.type;
        return <List key={index}>{block.items.map((item, i) => <li key={i}><Inline text={item} /></li>)}</List>;
      }
      return <p key={index}><Inline text={block.text} /></p>;
    })}
  </div>;
}
