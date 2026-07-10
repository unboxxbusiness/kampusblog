/**
 * A lightweight, high-performance, zero-dependency server-safe HTML sanitizer.
 * It removes malicious scripts, event handlers, and javascript: protocols,
 * while preserving standard text, layout, and link tags.
 */
export function sanitizeHTML(html: string): string {
  if (!html) return "";

  // 1. Remove script tags and their inner content
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // 2. Remove iframe and embed tags to prevent clickjacking
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
  clean = clean.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "");

  // 3. Remove inline event handlers (e.g. onload, onerror, onclick)
  // Matches both quoted values (onload="...") and unquoted values (onload=...)
  clean = clean.replace(/on\w+\s*=\s*(["'])(.*?)\1/gi, "");
  clean = clean.replace(/on\w+\s*=\s*([^>\s]+)/gi, "");

  // 4. Neutralize javascript: href links
  clean = clean.replace(/href\s*=\s*(["'])javascript:(.*?)\1/gi, 'href="#"');

  return clean;
}
