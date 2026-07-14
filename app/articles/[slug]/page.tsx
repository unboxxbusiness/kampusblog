import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ChevronRight, User, BookOpen, Quote, HelpCircle, Eye, Link as CitationIcon } from "lucide-react";
import ArticleBody from "@/features/articles/ArticleBody";
import ReadingProgressCard from "@/features/articles/ReadingProgressCard";
import DownloadNotes from "@/features/articles/DownloadNotes";
import { sanitizeHTML } from "@/utils/sanitizer";
import { getArticleBySlug, getRelatedArticles, getPrevAndNextArticles, incrementArticleViews } from "@/services/articles";
import { parseGEOContent } from "@/utils/geo-parser";
import ShareButtons from "@/features/articles/ShareButtons";
import TableOfContents from "@/features/articles/TableOfContents";
import ArticleCard from "@/features/articles/ArticleCard";
import { siteConfig } from "@/config/site";
import { EditorialHero } from "@/components/EditorialHero";

// ISR Caching configuration (300 seconds / 5 minutes)
export const revalidate = 300;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// 1. Dynamic SEO Metadata Generation
export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article does not exist.",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.url;
  const canonicalUrl = `${baseUrl}/articles/${slug}`;

  return {
    title: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    keywords: article.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      url: canonicalUrl,
      type: "article",
      publishedTime: new Date(article.publishedAt).toISOString(),
      modifiedTime: new Date(article.updatedAt).toISOString(),
      authors: [article.author],
      images: [
        {
          url: `${baseUrl}/api/og?slug=${slug}`,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.excerpt,
      images: [`${baseUrl}/api/og?slug=${slug}`],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Increment views in background (safe, does not block rendering)
  incrementArticleViews(article.id);

  // Fetch concurrent related and pagination articles
  const [related, pagination] = await Promise.all([
    getRelatedArticles(article.category, article.slug, 3),
    getPrevAndNextArticles(article.publishedAt),
  ]);

  // Parse GEO-optimizations (Key Takeaways, Citations, FAQs) from HTML
  const { takeaways, faqs, citations, cleanContent } = parseGEOContent(article.content);

  const formattedPublishedDate = new Date(article.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedUpdatedDate = new Date(article.updatedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const categorySlug = article.category.toLowerCase().replace(/\s+/g, "-");

  const contentTypeLabel = {
    "news": "News",
    "tutorial": "Tutorial",
    "comparison": "Comparison",
    "tool-review": "Tool Review",
    "career": "Career Guide"
  }[article.contentType || "news"] || "Article";

  const formatViews = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M reads`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K reads`;
    return `${count} reads`;
  };

  // --- Dynamic JSON-LD Generation ---
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";
  const articleUrl = `${baseUrl}/articles/${slug}`;
  const publisherLogo = `${baseUrl}/icon-512.png`;

  // NewsArticle Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": article.title,
    "image": [article.image],
    "datePublished": new Date(article.publishedAt).toISOString(),
    "dateModified": new Date(article.updatedAt).toISOString(),
    "author": {
      "@type": "Person",
      "name": article.author,
      "url": `${baseUrl}/author/${encodeURIComponent(article.author.toLowerCase())}`,
    },
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": publisherLogo,
      },
    },
    "description": article.metaDescription || article.excerpt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };

  // Breadcrumbs Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": article.category,
        "item": `${baseUrl}/${categorySlug}`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": article.title,
        "item": articleUrl,
      },
    ],
  };

  // FAQ Schema (if FAQs exist)
  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer.replace(/<[^>]*>/g, ""), // clean HTML tags for text schemas
      },
    })),
  } : null;

  // ── HowTo Schema Extraction ──
  // Extracts checklist steps (1. Step 1 (Action): ...) and builds Google Rich Snippets HowTo Schema
  const stepPattern = /<p>\s*(\d+\.\s*(?:Step\s*\d+\s*\(Action\):\s*)?([\s\S]*?))<\/p>/gi;
  const howToSteps = [];
  let stepMatch;
  while ((stepMatch = stepPattern.exec(article.content)) !== null) {
    const rawStepText = stepMatch[1].replace(/<[^>]*>/g, "").trim();
    const cleanStepText = rawStepText.replace(/^\d+\.\s*(Step\s*\d+\s*\(Action\):\s*)?/i, "");
    if (cleanStepText.length > 5) {
      howToSteps.push({
        "@type": "HowToStep",
        "name": `Step ${howToSteps.length + 1}`,
        "text": cleanStepText,
        "url": `${articleUrl}#what-should-you-do-next`
      });
    }
  }

  const howToSchema = howToSteps.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to implement: ${article.title}`,
    "description": article.metaDescription || article.excerpt,
    "step": howToSteps
  } : null;

  return (
    <>
      {/* 1. Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}


      {/* 3. Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/${categorySlug}`} className="hover:text-primary transition-colors">{article.category}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate max-w-[200px] sm:max-w-xs">{article.title}</span>
      </nav>



      {/* Dynamic Editorial Hero Card */}
      <EditorialHero 
        articleId={article.id}
        title={article.title}
        category={article.category} 
        metadataStr={article.metadata} 
        readingTime={article.readingTime} 
        updatedAt={article.updatedAt}
        author={article.author}
        contentType={article.contentType || "news"}
      />

      {/* 5. Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Article Body */}
        <div className="lg:col-span-8 space-y-8">
          {/* Key Takeaways Box (GEO Highlight) */}
          {takeaways.length > 0 && (
            <section className="bg-gradient-to-tr from-primary/5 via-indigo-500/5 to-transparent border border-primary/20 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">
                  Key Takeaways (TL;DR)
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                {takeaways.map((takeaway, i) => (
                  <li key={i} className="leading-relaxed">{takeaway}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Mobile Table of Contents (Hidden on Desktop) */}
          <div className="lg:hidden">
            <TableOfContents htmlContent={article.content} />
          </div>

          {/* Mobile Reading Progress Card */}
          <div className="lg:hidden">
            <ReadingProgressCard readingTime={article.readingTime} />
          </div>

          {/* Mobile Download Notes Card */}
          <div className="lg:hidden">
            <DownloadNotes
              title={article.title}
              slug={article.slug}
              excerpt={article.excerpt}
              category={article.category}
              author={article.author}
              publishedAt={article.publishedAt}
              takeaways={takeaways}
              content={article.content}
            />
          </div>

          {/* Cleaned Article Text */}
          <ArticleBody htmlContent={cleanContent} category={article.category} />

          {/* Tags list (Interactive Navigation) */}
          {article.tags ? (
            <div className="flex flex-wrap gap-2 pt-6 border-t border-border/60">
              {article.tags.split(",").map((tag) => (
                <Link
                  key={tag}
                  href={`/search?tag=${encodeURIComponent(tag.trim().toLowerCase())}`}
                  className="text-xs bg-secondary hover:bg-primary/10 hover:text-primary text-muted-foreground px-3 py-1 rounded-lg border border-border transition-colors font-semibold"
                >
                  #{tag.trim()}
                </Link>
              ))}
            </div>
          ) : article.keywords ? (
            <div className="flex flex-wrap gap-2 pt-6 border-t border-border/60">
              {article.keywords.split(",").map((tag) => (
                <Link
                  key={tag}
                  href={`/search?q=${encodeURIComponent(tag.trim().toLowerCase())}`}
                  className="text-xs bg-secondary hover:bg-primary/10 hover:text-primary text-muted-foreground px-3 py-1 rounded-lg border border-border transition-colors font-semibold"
                >
                  #{tag.trim()}
                </Link>
              ))}
            </div>
          ) : null}

          {/* Source Attribution (E-E-A-T Footnote) */}
          {article.sourceName && (
            <div className="text-xs text-muted-foreground pt-4 mt-2 flex items-center gap-1.5 border-t border-border/40">
              <span className="font-semibold text-foreground">Source:</span>
              {article.sourceUrl ? (
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="text-primary hover:underline font-bold inline-flex items-center gap-0.5"
                >
                  {article.sourceName}
                </a>
              ) : (
                <span className="font-bold">{article.sourceName}</span>
              )}
            </div>
          )}

          {/* Outbound Verified Citations & References (GEO Grounded Search) */}
          {citations.length > 0 && (
            <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <CitationIcon className="h-4.5 w-4.5 text-primary" />
                <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">
                  Verified Sources & Citations
                </h3>
              </div>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-muted-foreground">
                {citations.map((cite, index) => (
                  <li key={index} className="leading-relaxed">
                    <a
                      href={cite.url}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="text-primary hover:underline font-semibold"
                    >
                      {cite.text}
                    </a>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* Dynamic Interactive FAQ Section (GEO Search scrapable) */}
          {faqs.length > 0 && (
            <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <HelpCircle className="h-4.5 w-4.5 text-primary" />
                <h3 className="font-heading text-sm font-bold text-foreground uppercase tracking-wider">
                  Frequently Asked Questions
                </h3>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
                    <h4 className="font-heading text-sm font-bold text-foreground flex items-start gap-1">
                      <span className="text-primary mr-1">Q:</span>
                      {faq.question}
                    </h4>
                    <p
                      className="text-xs text-muted-foreground leading-relaxed mt-1.5 pl-4 border-l-2 border-primary/20"
                      dangerouslySetInnerHTML={{ __html: sanitizeHTML(faq.answer) }}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Social Share bar & Link copy */}
          <div className="flex items-center justify-between border-t border-b border-border py-4 my-8">
            <ShareButtons title={article.title} slug={article.slug} />
          </div>

          {/* Previous / Next Pagination Links */}
          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4" aria-label="Pagination">
            {pagination.prev ? (
              <Link
                href={`/articles/${pagination.prev.slug}`}
                className="group p-4 bg-card border border-border rounded-xl hover:border-primary/20 hover:shadow-md transition-all text-left flex flex-col justify-center"
              >
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Previous Article</span>
                <span className="text-xs font-semibold text-foreground group-hover:text-primary mt-1 line-clamp-1">{pagination.prev.title}</span>
              </Link>
            ) : (
              <div className="hidden sm:block" />
            )}
            {pagination.next && (
              <Link
                href={`/articles/${pagination.next.slug}`}
                className="group p-4 bg-card border border-border rounded-xl hover:border-primary/20 hover:shadow-md transition-all text-right flex flex-col justify-center"
              >
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Next Article</span>
                <span className="text-xs font-semibold text-foreground group-hover:text-primary mt-1 line-clamp-1">{pagination.next.title}</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Sticky Sidebar (Table of Contents & Meta) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="hidden lg:block">
            <TableOfContents htmlContent={article.content} />
          </div>

          {/* Desktop Reading Progress Card */}
          <div className="hidden lg:block">
            <ReadingProgressCard readingTime={article.readingTime} />
          </div>
          
          {/* Premium Article stats block */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <h4 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Article Insights
            </h4>
            <div className="flex items-center gap-2 text-sm text-foreground/80 font-medium">
              <Eye className="h-4 w-4 text-primary animate-pulse" />
              <span>{formatViews(article.views)}</span>
            </div>
            <div className="text-[10px] text-muted-foreground leading-normal pt-1 border-t border-border/40">
              Published by <span className="font-semibold text-foreground">{article.author}</span> in the <span className="font-semibold text-foreground">{article.category}</span> category.
            </div>
          </div>

          {/* Desktop Download Notes Card */}
          <div className="hidden lg:block">
            <DownloadNotes
              title={article.title}
              slug={article.slug}
              excerpt={article.excerpt}
              category={article.category}
              author={article.author}
              publishedAt={article.publishedAt}
              takeaways={takeaways}
              content={article.content}
            />
          </div>
        </div>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-border mt-16">
          <h3 className="font-heading text-lg font-extrabold uppercase tracking-tight text-foreground">
            Related Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((item) => (
              <ArticleCard key={item.slug} article={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
