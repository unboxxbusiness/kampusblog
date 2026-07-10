import React from "react";
import { notFound } from "next/navigation";
import { ChevronRight, Layers, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getArticlesByCategory } from "@/services/articles";
import ArticleCard from "@/features/articles/ArticleCard";
import { siteConfig } from "@/config/site";

// Next.js dynamic routing with searchParams
interface CategoryPageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ type?: string; sort?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const dbCategory = siteConfig.categoryMapping[category];

  if (!dbCategory) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${dbCategory} Articles | ${siteConfig.name}`,
    description: `Browse all briefings, news updates, and opportunities in the ${dbCategory} section of ${siteConfig.name}.`,
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { category } = await params;
  const { type = "all", sort = "latest" } = await searchParams;
  
  // Resolve URL slug to DB category name
  const dbCategory = siteConfig.categoryMapping[category];

  if (!dbCategory) {
    notFound();
  }

  // Fetch articles belonging to this category (fetch larger set to filter in-memory)
  const rawArticlesList = await getArticlesByCategory(dbCategory, 100);

  // Extract available content types for this specific category
  const availableTypes = new Set(rawArticlesList.map((a) => a.contentType));

  // Apply Content Type Filtering with smart fallback
  let activeType = type;
  if (activeType !== "all" && !availableTypes.has(activeType)) {
    activeType = "all";
  }

  let articlesList = rawArticlesList;
  if (activeType !== "all") {
    articlesList = rawArticlesList.filter(
      (article) => article.contentType === activeType
    );
  }

  // Apply Sorting
  if (sort === "popular") {
    articlesList = [...articlesList].sort((a, b) => b.views - a.views);
  } else if (sort === "trending") {
    articlesList = [...articlesList].sort((a, b) => b.views7d - a.views7d);
  } else {
    // Default is latest
    articlesList = [...articlesList].sort((a, b) => b.publishedAt - a.publishedAt);
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-foreground">{dbCategory}</span>
      </nav>

      {/* Header section */}
      <header className="space-y-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-md">
          <Layers className="h-3.5 w-3.5" />
          Category Archive
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          {dbCategory}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
          Learn, build, and grow with our curated resources covering {dbCategory.toLowerCase()} techniques and strategies.
        </p>
      </header>

      {/* Advanced filter / sorting bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        {/* Content Type Filter Links */}
        {availableTypes.size > 1 && (
          <div className="flex flex-wrap gap-1.5 text-xs">
            {[
              { id: "all", label: "All Content" },
              { id: "news", label: "News" },
              { id: "tutorial", label: "Tutorials" },
              { id: "comparison", label: "Comparisons" },
              { id: "tool-review", label: "Tool Reviews" },
            ]
              .filter((item) => item.id === "all" || availableTypes.has(item.id))
              .map((item) => {
                const isActive = activeType === item.id;
                return (
                  <Link
                    key={item.id}
                    href={`/${category}?type=${item.id}${sort ? `&sort=${sort}` : ""}`}
                    className={`px-3 py-1.5 rounded-lg border transition-all duration-200 font-medium ${
                      isActive
                        ? "bg-primary border-primary text-primary-foreground shadow-sm"
                        : "bg-card border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
          </div>
        )}

        {/* Sort Options Links */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Sort by:</span>
          {[
            { id: "latest", label: "Latest" },
            { id: "popular", label: "Popular" },
            { id: "trending", label: "Trending" },
          ].map((item) => {
            const isActive = sort === item.id;
            return (
              <Link
                key={item.id}
                href={`/${category}?sort=${item.id}${type ? `&type=${type}` : ""}`}
                className={`font-semibold hover:text-primary transition-colors py-1 px-1.5 rounded-md ${
                  isActive 
                    ? "text-primary bg-primary/5 font-bold" 
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Articles Listing Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articlesList.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </section>

      {/* Empty State */}
      {articlesList.length === 0 && (
        <div className="text-center py-20 bg-secondary/15 rounded-3xl border border-dashed border-border max-w-md mx-auto flex flex-col items-center">
          <div className="h-12 w-12 bg-secondary rounded-2xl flex items-center justify-center text-muted-foreground mb-4">
            🔍
          </div>
          <h3 className="font-heading font-bold text-base text-foreground mb-1">
            No articles matches filter
          </h3>
          <p className="text-xs text-muted-foreground mb-6">
            Try choosing a different content filter or sort option above.
          </p>
          <Link
            href={`/${category}?type=all&sort=latest`}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-xl hover:bg-primary/95 transition-colors shadow-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Reset Filters
          </Link>
        </div>
      )}
    </div>
  );
}
