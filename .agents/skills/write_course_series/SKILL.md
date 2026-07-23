---
name: write_course_series
description: Generate and publish a 5-part interconnected micro-course series for students based on daily trending education/career topics using YouTube API & Google Search grounding.
---

# Instructions for Drafting & Publishing 5-Part Interconnected Course Series for Kampus Filter

> **CRITICAL REQUIREMENT**: Every article in the 5-part series MUST strictly follow the **Premium Human-Like Content Generation Framework** in `CONTENT_FRAMEWORK.md`.

---

## 1. Dual Intelligence Discovery
1. Use **Google Grounded Search** to find today's #1 breaking student/education trend.
2. Query **YouTube Data API v3** (using `YOUTUBE_API_KEY` from `.env.local`) to pull educational video IDs, channel benchmarks, and key timestamps.

---

## 2. The 5-Module Curriculum Structure
Generate 5 interconnected articles in sequence:
* **Part 1: The Foundation & Trend Analysis** (Hook, trend context, overview table, intro to course)
* **Part 2: System Architecture & Flowcharts** (Deep dive mechanics, `<div class="geo-mermaid">` 40% zoom diagram)
* **Part 3: Hands-On Tutorial & Video Walkthrough** (`<p>1. Step 1 (Action): ...</p>` checklist, setup guide, embedded YouTube video reference)
* **Part 4: Real-World Case Study & Metrics** (Before/After comparison table, career/stipend metrics, student stories)
* **Part 5: Masterclass & Future Roadmap** (Decision matrix, comprehensive `<div class="geo-faq">`, resources, CTA)

---

## 3. Save & Publish Command
1. Write the 5 articles to `draft_course_series.json`:
```json
{
  "series_title": "Mastering [Topic] in 2026",
  "articles": [
    {
      "title": "Part 1 Title",
      "excerpt": "...",
      "category": "Scholarships",
      "image": "https://images.unsplash.com/...",
      "author": "Kampus Filter Desk",
      "viral_score": 95,
      "content": "HTML Body with geo-takeaways, tables, etc."
    },
    ... (Part 2, 3, 4, 5)
  ]
}
```
2. Execute publication:
```bash
python scripts/publish_course_series.py
```
This automatically links the 5 articles with header banners (`<div class="geo-series-header">`) and course syllabus widgets (`<div class="geo-course-syllabus">`), inserts all 5 into Turso DB, and revalidates Next.js caches.
