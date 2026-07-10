import React from "react";
import { sanitizeHTML } from "@/utils/sanitizer";
import "@/styles/article.css";

interface ArticleBodyProps {
  htmlContent: string;
}

export default function ArticleBody({ htmlContent }: ArticleBodyProps) {
  const sanitized = sanitizeHTML(htmlContent);
  return (
    <div 
      className="article-body" 
      dangerouslySetInnerHTML={{ __html: sanitized }} 
    />
  );
}
