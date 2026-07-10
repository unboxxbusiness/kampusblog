import React from "react";
import { Search, ChevronRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import { searchArticles } from "@/services/articles";
import ArticleCard from "@/features/articles/ArticleCard";
import { siteConfig } from "@/config/site";

// Caching configuration (30 seconds)
export const revalidate = 30;

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  return {
    title: q ? `Search results for "${q}" | ${siteConfig.name}` : `Search | ${siteConfig.name}`,
    description: "Search college admissions, scholarships, internships, opportunities, and education news on Kampus Filter.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const searchQuery = q?.trim() || "";

  // Perform SQL LIKE search in database
  const searchResults = await searchArticles(searchQuery, 24);

  return (
    <div className="space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-foreground">Search Results</span>
      </nav>

      {/* Header section */}
      <header className="space-y-3 border-b border-border pb-6">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-md">
          <Search className="h-3.5 w-3.5" />
          Search Portal
        </span>
        <h1 className="font-heading text-3xl font-extrabold text-foreground tracking-tight">
          {searchQuery ? `Results for "${searchQuery}"` : "Search Platform"}
        </h1>
        <p className="text-xs text-muted-foreground">
          {searchResults.length > 0
            ? `We found ${searchResults.length} matching articles in our database.`
            : searchQuery
            ? "No matches found. Try using different keywords."
            : "Type query above to find articles."}
        </p>
      </header>

      {/* Search form box */}
      <div className="max-w-2xl bg-secondary/25 border border-border p-4 rounded-2xl">
        <form action="/search" method="GET" className="flex items-center gap-2">
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="Search title, category, keywords, or content..."
            className="flex-1 px-4 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-1.5"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </form>
      </div>

      {/* Results grid */}
      {searchResults.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </section>
      ) : (
        searchQuery && (
          <div className="text-center py-16 bg-secondary/15 rounded-3xl border border-dashed border-border max-w-md mx-auto flex flex-col items-center">
            <HelpCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-heading font-bold text-base text-foreground mb-1">
              No results found
            </h3>
            <p className="text-xs text-muted-foreground px-6 leading-relaxed">
              We couldn't find any articles matching "{searchQuery}". Try searching for categories like "Admissions", "Scholarships", "Internships", or "Future Skills".
            </p>
          </div>
        )
      )}
    </div>
  );
}
