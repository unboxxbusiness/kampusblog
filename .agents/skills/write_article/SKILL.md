---
name: write_article
description: Write and publish a premium, student-centric, SEO/GEO-optimized article for Kampus Filter using Google Trends, RSS, & YouTube research data.
---

# Instructions for Drafting & Publishing Articles for Kampus Filter

Use this skill when the user asks you to write or publish a new article based on trending student opportunities and educational news.

---

## Part 1: Kampus Filter Brand Angle (Strict Constraint)

Do **NOT** write standard boring news articles. Always filter stories through our brand promise:
> "How does this help students make smarter education or career decisions?"

- ❌ *Incorrect (standard announcement):* "Government announces new scholarship scheme"
- ✅ *Correct (Kampus Filter brand angle):* "Government's New Scholarship Scheme 2026: Eligibility, Direct Apply Links & Deadlines for College Students"

---

## Part 2: Read Trends Research Data

Read the local file `.agents/research/trends_research.json` to identify:
1. `top_stories`: High-virality student/opportunity announcements.
2. `youtube_trending` / `youtube_growing`: Educational video references with view counts, channels, and descriptions.
3. `google_trends`: Daily search traffic query keywords (e.g. CUET, JEE, NEET).
4. `reddit_highlights`: Student community discussions (from r/JEENEETards, r/Btechtards, r/Indian_Academia, etc.).

Always choose the unpublished item with the highest `viral_score` that matches one of today's target categories.

---

## Part 3: Mandatory Article Structure & HTML Constraints

Every article MUST follow this exact layout within the database `content` column. 

### CRITICAL FORMATTING CONSTRAINT: NO HASHTAGS IN HEADINGS
* Do **NOT** use any markdown heading symbols (like `#`, `##`, `###`) anywhere inside the HTML content or headings.
* Do **NOT** use hashes for numbering (e.g. write `<h3>1. Students</h3>` instead of `<h3>#1. Students</h3>` or `<h3># 1. Students</h3>`).
* Write all headings as clean, native HTML tags (`<h2>`, `<h3>`, `<h4>`) containing only plain text.

### Required Layout:
1. **Viral Headline**: Student-centric and clear.
2. **Key Takeaways (TL;DR)**: Mapped in `<div class="geo-takeaways">` (3 GEO student takeaways).
3. **Overview**: Clear description of the opportunity/news, starting with `<h2>Introduction: ...</h2>`.
4. **Eligibility Criteria**: Bulleted checklist (`✅`) indicating degree, CGPA, age limits, and requirements.
5. **Key Timelines & Deadlines**: Mapped in a clean HTML Table showing critical dates (application start, end, exam dates).
6. **Step-by-Step Application Guide**: An ordered list (`<ol>`) showing how to register, documents required (e.g., HoD NOC, transcripts), and where to submit.
7. **Future Scope / Career Impact**: How this opportunity benefits the student's career or university profile.
8. **Frequently Asked Questions**: Mapped in `<div class="geo-faq">` containing at least 4 detailed student Q&As (GEO block).
9. **Sources & Reference Links**: Outbound links to the official announcements inside `<div class="geo-citations">`.

---

## Part 4: Write Draft & Execute Publication

1. Save the draft inside `draft_article.json` in the root of the project using the following exact format. 

Make sure to populate the `metadata` field as a stringified JSON object containing structured contextual details (amount, deadline, stipend, prerequisites, etc. depending on the category), the custom audience profiling keys (`who_should_read` / `who_should_skip`), and the `illustration_tag` matching one of the 20 available illustration folders (e.g. `scholarships`, `admissions`, `exams`, `abroad`, `skills`, `ai`):

```json
{
  "title": "Viral Headline",
  "excerpt": "Short 1-2 sentence hook summarizing the article.",
  "category": "Internships", // Must match one of our 20 categories (e.g. "Scholarships", "Admissions", "Internships", "Competitive Exams", etc.)
  "content_type": "news", // news, tutorial, comparison, or tool-review
  "author": "Kampus Filter Editorial",
  "keywords": "isro ursc internship, college internship, students",
  "tags": "isro,internships,college,btech",
  "featured": true,
  "viral_score": 85,
  "source_name": "ISRO Portal",
  "source_url": "https://www.isro.gov.in/",
  "research_ref": "top_stories[0]",
  "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200", // Fallback only
  "metadata": "{\"stipend\":\"₹15,000/month\",\"duration\":\"6 Months\",\"location\":\"Bengaluru (Hybrid)\",\"deadline\":\"31 January 2026\",\"who_should_read\":\"Pre-final and final year B.Tech/M.Tech students in STEM.\",\"who_should_skip\":\"Non-technical students or those looking for immediate full-time jobs.\",\"illustration_tag\":\"internships\"}",
  "content": "Full article HTML with takeaways, tables, and FAQ containers."
}
```

2. Run the terminal command to publish the article:
```bash
pnpm publish-article
```
This inserts the record into Turso, parses the `metadata` JSON, registers the illustration path dynamically, invalidates the Next.js cache, and pings the search indexing engines.

---

## Part 5: Daily Category Rotation & Prompt Template

When writing, prioritize this daily rotation (but you can generate extra articles for any category at any time):

| Day | Category | Content Focus |
|:---|:---|:---|
| **Monday** | University Admissions | College admissions, entrance tests, criteria |
| **Tuesday** | Scholarships | Government & private scholarships, fellowships |
| **Wednesday** | Internships | Research, corporate, and government internships |
| **Thursday** | Student Opportunities | Competitions, exchange programs, campus ambassador roles |
| **Friday** | Education News | Board exams, university circulars, policy changes |
| **Saturday** | Career Signals | Emerging careers, highest-paying jobs, path guides |
| **Sunday** | Future Skills | Tech, coding, language, and other high-demand skills |
