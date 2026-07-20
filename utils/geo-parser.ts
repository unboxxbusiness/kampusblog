export interface FAQItem {
  question: string;
  answer: string;
}

export interface CitationItem {
  text: string;
  url: string;
}

export interface ParsedGEOData {
  takeaways: string[];
  faqs: FAQItem[];
  citations: CitationItem[];
  cleanContent: string;
}

/**
 * Automatically injects safe lower-case kebab IDs to all H2 tags inside the HTML content
 * if they do not already have one. This enables proper Table of Contents anchors.
 */
export function injectHeadingIds(html: string): string {
  if (!html) return "";
  return html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (match, attrs, text) => {
    // If it already has an id, keep it
    if (attrs.includes("id=")) {
      return match;
    }
    const cleanText = text.replace(/<[^>]*>/g, "").trim();
    const id = cleanText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return `<h2${attrs} id="${id}">${text}</h2>`;
  });
}

/**
 * Parses article HTML content to extract semantic GEO metadata containers (takeaways, citations, faqs)
 * and strips them from the main content to allow custom React UI rendering.
 */
export function parseGEOContent(rawContent: string): ParsedGEOData {
  const data: ParsedGEOData = {
    takeaways: [],
    faqs: [],
    citations: [],
    cleanContent: rawContent,
  };

  if (!rawContent) return data;

  // 1. Extract Key Takeaways
  const takeawaysMatch = rawContent.match(/<div[^>]*class=["']geo-takeaways["'][^>]*>([\s\S]*?)<\/div>/);
  if (takeawaysMatch) {
    const inner = takeawaysMatch[1] || "";
    const liRegex = /<li>([\s\S]*?)<\/li>/g;
    let match;
    while ((match = liRegex.exec(inner)) !== null) {
      if (match[1]) {
        data.takeaways.push(match[1].replace(/<[^>]*>/g, "").trim());
      }
    }
  }

  // 2. Extract Citations
  const citationsMatch = rawContent.match(/<div[^>]*class=["']geo-citations["'][^>]*>([\s\S]*?)<\/div>/);
  if (citationsMatch) {
    const inner = citationsMatch[1] || "";
    const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/g;
    let match;
    while ((match = linkRegex.exec(inner)) !== null) {
      if (match[1] && match[2]) {
        data.citations.push({
          url: match[1].trim(),
          text: match[2].replace(/<[^>]*>/g, "").trim(),
        });
      }
    }
  }

  // 3. Extract FAQ Items
  const faqMatch = rawContent.match(/<div[^>]*class=["']geo-faq["'][^>]*>([\s\S]*)/i);
  if (faqMatch) {
    const inner = faqMatch[1] || "";
    const itemRegex = /<div[^>]*class=["']faq-item["'][^>]*>([\s\S]*?)<\/div>/gi;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(inner)) !== null) {
      const itemContent = itemMatch[1] || "";
      const qMatch = itemContent.match(/<h[234][^>]*class=["']faq-question["'][^>]*>([\s\S]*?)<\/h[234]>/i);
      const aMatch = itemContent.match(/<p[^>]*class=["']faq-answer["'][^>]*>([\s\S]*?)<\/p>/i);
      if (qMatch && aMatch && qMatch[1] && aMatch[1]) {
        data.faqs.push({
          question: qMatch[1].replace(/<[^>]*>/g, "").trim(),
          answer: aMatch[1].trim(),
        });
      }
    }
  }

  // 4. Clean Content (Strip the custom containers and inject heading IDs)
  const stripped = rawContent
    .replace(/<div[^>]*class=["']geo-takeaways["'][^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*class=["']geo-citations["'][^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*class=["']geo-faq["'][^>]*>[\s\S]*/gi, "")
    .trim();

  data.cleanContent = injectHeadingIds(stripped);

  return data;
}
