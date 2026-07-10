import React from "react";
import Link from "next/link";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import { Article } from "@/db/schema";
import { DynamicEditorialBanner } from "@/components/DynamicEditorialBanner";

interface FeaturedArticleCardProps {
  article: Article;
}

export default function FeaturedArticleCard({ article }: FeaturedArticleCardProps) {
  const { title, slug, excerpt, category, publishedAt, readingTime, author } = article;

  const formattedDate = new Date(publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12">
      {/* Hero Image Block — pure CSS dynamic editorial graphic */}
      <div className="relative lg:col-span-7 aspect-[16/10] lg:aspect-auto min-h-[250px] sm:min-h-[300px] lg:min-h-[420px] overflow-hidden flex items-center justify-center lg:border-r border-border">
        <DynamicEditorialBanner title={title} category={category} className="w-full h-full" />
        
        {/* Category Overlay */}
        <span className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-lg shadow-md border border-primary/20">
          Featured: {category}
        </span>
      </div>

      {/* Content Block */}
      <div className="p-5 sm:p-8 lg:col-span-5 flex flex-col justify-center">
        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {readingTime} Min Read
          </span>
        </div>

        <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground group-hover:text-primary transition-colors leading-tight mb-4">
          <Link href={`/articles/${slug}`} className="hover:underline focus:outline-none">
            {title}
          </Link>
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
          {excerpt}
        </p>

        {/* Author information & Read Button — Stack on mobile, side-by-side on tablet/desktop */}
        <div className="mt-auto pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-sm text-primary uppercase flex-shrink-0 border border-border">
              {author.slice(0, 2)}
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">{author}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Expert Author</div>
            </div>
          </div>

          <Link
            href={`/articles/${slug}`}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/95 transition-colors shadow-md text-sm group-hover:shadow-lg w-full sm:w-auto text-center"
          >
            Read Article
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
