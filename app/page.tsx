import React from "react";
import Link from "next/link";
import { ArrowRight, Newspaper, Wrench, GraduationCap, Cpu, Layers, TrendingUp, BookOpen, Briefcase } from "lucide-react";
import FeaturedArticleCard from "@/features/articles/FeaturedArticleCard";
import ArticleCard from "@/features/articles/ArticleCard";
import TrendingSidebar from "@/features/articles/TrendingSidebar";
import {
  getArticles,
  getFeaturedArticles,
  getTrendingThisWeek,
  getArticlesByCategory,
  getActiveCategoriesAndTags,
} from "@/services/articles";

// ISR Caching configuration (60 seconds)
export const revalidate = 60;

interface HomePageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { type = "all" } = await searchParams;

  // Run queries in parallel for high performance
  const [
    featured,
    trending,
    allArticles,
    { categories: activeCategories },
  ] = await Promise.all([
    getFeaturedArticles(5),
    getTrendingThisWeek(5),
    getArticles(40), // Get latest 40 articles to build sections in-memory
    getActiveCategoriesAndTags(),
  ]);

  // Extract sections from allArticles to save DB roundtrips
  const latestNewsRaw = allArticles.filter((a) => a.category === "Education News");
  const featuredOpportunities = allArticles.filter((a) => a.category === "Scholarships" || a.category === "Student Opportunities");
  const homeAvailableTypes = new Set(allArticles.map((a) => a.contentType));

  // Filter out 'Education News' from the homepage columns as it is the main feed
  const gridCategories = activeCategories.filter(
    (c) => c !== "Education News"
  ).slice(0, 3);

  // Fetch articles for active grid categories in parallel
  const gridData = await Promise.all(
    gridCategories.map(async (cat) => {
      const list = await getArticlesByCategory(cat, 3);
      return { category: cat, articles: list };
    })
  );

  // Determine which list to display in the main section based on content_type filter with smart fallback
  let activeType = type;
  if (activeType !== "all" && !homeAvailableTypes.has(activeType)) {
    activeType = "all";
  }

  let displayArticles = allArticles;
  if (activeType !== "all") {
    displayArticles = allArticles.filter((a) => a.contentType === activeType);
  }

  // Use the top featured article as the Hero, otherwise fallback to the most recent
  const heroArticle = featured[0] || latestNewsRaw[0] || allArticles[0];
  const editorsPicks = featured.slice(1, 4);

  return (
    <div className="space-y-16">
      {/* 1. Hero Section */}
      {heroArticle && (
        <section className="animate-fade-in-up">
          <FeaturedArticleCard article={heroArticle} />
        </section>
      )}

      {/* 2. Main Content Grid (Latest Articles + Trending Sidebar) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Latest Articles column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3 gap-3">
            <h3 className="font-heading text-lg font-extrabold uppercase tracking-tight text-foreground flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              Latest Insights & Updates
            </h3>
            
            {/* Content Type Tabs on Homepage */}
            {homeAvailableTypes.size > 1 && (
              <div className="flex flex-wrap gap-1 text-[10px] uppercase font-bold tracking-wider">
                {[
                  { id: "all", label: "All" },
                  { id: "news", label: "News" },
                  { id: "tutorial", label: "Tutorials" },
                  { id: "comparison", label: "Comparisons" },
                  { id: "tool-review", label: "Reviews" },
                ]
                  .filter((tab) => tab.id === "all" || homeAvailableTypes.has(tab.id))
                  .map((tab) => {
                    const isActive = activeType === tab.id;
                    return (
                      <Link
                        key={tab.id}
                        href={`/?type=${tab.id}`}
                        className={`px-2.5 py-1 rounded transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-primary-foreground font-black shadow-sm"
                            : "bg-secondary text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {tab.label}
                      </Link>
                    );
                  })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {displayArticles.slice(0, 6).map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
            {displayArticles.length === 0 && (
              <div className="col-span-2 text-center text-sm text-muted-foreground py-16 bg-secondary/10 rounded-2xl border border-dashed border-border">
                No articles matches the selected type yet. Check back soon!
              </div>
            )}
          </div>
        </div>

        {/* Trending Sidebar column */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <TrendingSidebar articles={trending} />
        </div>
      </section>

      {/* 3. Featured Scholarships & Opportunities Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-heading text-lg font-extrabold uppercase tracking-tight text-foreground flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Featured Scholarships & Opportunities
          </h3>
          <Link
            href="/scholarships"
            className="text-xs font-bold text-primary hover:text-indigo-500 flex items-center gap-1 hover:translate-x-0.5 transition-all"
          >
            Browse All Opportunities <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredOpportunities.slice(0, 4).map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
          {featuredOpportunities.length === 0 && (
            <div className="col-span-full text-center text-sm text-muted-foreground py-10 bg-secondary/20 rounded-xl border border-dashed border-border">
              No scholarships or opportunities listed yet.
            </div>
          )}
        </div>
      </section>

      {/* 4. Daily Briefing CTA Banner Section */}
      <section className="bg-gradient-to-r from-primary/5 via-indigo-500/5 to-transparent border border-primary/10 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-md">
            Kampus Filter
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 text-foreground">
            Filter the Noise & Make Better Decisions
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
            Get your 5-minute briefing on admissions, scholarships, internships, and future skills delivered straight to your inbox and dashboard.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/university-admissions"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/95 transition-colors shadow-md text-xs"
          >
            Explore Admissions
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* 5. Dynamic Tri-Category Grid */}
      {gridData.length > 0 && (
        <section className={`grid grid-cols-1 lg:grid-cols-${gridData.length} gap-8`}>
          {gridData.map(({ category, articles: catArticles }) => (
            <div key={category} className="space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  {category === "University Admissions" && <GraduationCap className="h-4.5 w-4.5 text-primary" />}
                  {category === "Scholarships" && <BookOpen className="h-4.5 w-4.5 text-primary" />}
                  {category === "Internships" && <Briefcase className="h-4.5 w-4.5 text-primary" />}
                  {category !== "University Admissions" && category !== "Scholarships" && category !== "Internships" && <Newspaper className="h-4.5 w-4.5 text-primary" />}
                  {category}
                </h4>
                <Link
                  href={`/${category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  See All
                </Link>
              </div>
              <div className={
                gridData.length === 1
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : gridData.length === 2
                    ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
                    : "flex flex-col gap-4"
              }>
                {catArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
                {catArticles.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-6 col-span-full">No articles available.</p>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 6. Editor's Picks Section */}
      {editorsPicks.length > 0 && (
        <section className="space-y-6 bg-secondary/25 border border-border rounded-3xl p-6 sm:p-8">
          <div className="border-b border-border pb-3">
            <h3 className="font-heading text-base font-extrabold uppercase tracking-wider text-foreground flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Editor's Picks
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {editorsPicks.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
