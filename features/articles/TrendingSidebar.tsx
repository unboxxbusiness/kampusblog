import React from "react";
import Link from "next/link";
import { TrendingUp, Clock } from "lucide-react";
import { Article } from "@/db/schema";

interface TrendingSidebarProps {
  articles: Article[];
}

export default function TrendingSidebar({ articles }: TrendingSidebarProps) {
  return (
    <aside className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6 border-b border-border pb-3">
        <TrendingUp className="h-5 w-5 text-primary" />
        <h3 className="font-heading font-bold text-base text-foreground uppercase tracking-wider">
          Trending on Kampus Filter
        </h3>
      </div>

      <div className="flex flex-col gap-5">
        {articles.map((article, index) => {
          const { title, slug, category, readingTime } = article;
          const rank = String(index + 1).padStart(2, "0");

          return (
            <div key={slug} className="flex gap-4 group">
              {/* Numeric rank */}
              <span className="font-heading font-extrabold text-2xl text-primary/20 group-hover:text-primary transition-colors select-none leading-none pt-0.5">
                {rank}
              </span>

              {/* Title & metadata */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                  {category}
                </span>
                
                <h4 className="font-heading text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors mt-0.5 mb-1.5">
                  <Link href={`/articles/${slug}`} className="hover:underline focus:outline-none block truncate-2-lines">
                    {title}
                  </Link>
                </h4>

                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{readingTime} Min Read</span>
                </div>
              </div>
            </div>
          );
        })}

        {articles.length === 0 && (
          <div className="text-center text-xs text-muted-foreground py-6">
            No trending articles found.
          </div>
        )}
      </div>
    </aside>
  );
}
