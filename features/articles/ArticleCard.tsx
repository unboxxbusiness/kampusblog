import Link from "next/link";
import { Article } from "@/db/schema";
import { EditorialThumbnail } from "@/components/EditorialThumbnail";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { title, slug, excerpt, category, publishedAt, readingTime, author, viralScore } = article;

  const isTrending = (viralScore || 0) >= 75;

  return (
    <Link href={`/articles/${slug}`} className="group block h-full">
      <article className="flex flex-col h-full rounded-2xl overflow-hidden bg-card border border-border hover:border-border/80 hover:shadow-md transition-all duration-200">

        {/* Thumbnail — soft coloured icon area */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <EditorialThumbnail title={title} category={category} metadataStr={article.metadata} className="w-full h-full" />

          {/* Trending badge */}
          {isTrending && (
            <span className="absolute top-3 right-3 bg-rose-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full z-10">
              🔥 Trending
            </span>
          )}
        </div>

        {/* Card body — matches Notion blog style */}
        <div className="flex flex-col flex-1 px-5 pt-4 pb-5 gap-2">
          {/* Category */}
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            {category}
          </span>

          {/* Title */}
          <h3 className="text-[17px] font-bold text-foreground leading-snug group-hover:text-primary transition-colors duration-150 line-clamp-3">
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mt-0.5">
              {excerpt}
            </p>
          )}

          {/* Author row */}
          <div className="mt-auto pt-3 flex items-center gap-2.5">
            {/* Avatar placeholder — initials */}
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase flex-shrink-0">
              {(author || "KF").slice(0, 2)}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[12px] font-semibold text-foreground">{author || "Kampus Filter"}</span>
              <span className="text-[10px] text-muted-foreground">{readingTime} min read</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
