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
3. **Authority Citations**: Mapped in `<div class="geo-citations">` containing outbound links to original sources.
4. **Heading Hierarchy**: Use exactly these eight H2 headings in sequence, written strictly as native HTML tags (do NOT use markdown '#' or '##' hashes):
   - `<h2>Introduction: [Briefing Subtitle]</h2>`
   - `<h2>What Happened? [Context / News / Announcement]</h2>`
   - `<h2>Why It Matters</h2>`
   - `<h2>Who Should Care?</h2>` (Followed by exactly three h3 sub-sections: `<h3>1. Students and Graduates</h3>`, `<h3>2. Job Seekers & Aspirants</h3>`, `<h3>3. Institutions</h3>`)
   - `<h2>How Does It Work? [Technical Details / Workflow]</h2>`
     * Include a Mermaid.js diagram inside `<div class=\"geo-mermaid\"> ... </div>` to visualize processes/flows.
     * All flowchart diagrams must start with `flowchart TD` (vertical layout) to fit screens better and prevent horizontal cutoff.
     * Keep focused: 4-7 nodes max using node shapes `([...])`, `[...]`, `{...}`, `[(...)]`.
   - `<h2>Eligibility, Dates & Resource Links</h2>` (Include a styled HTML dates/milestones table)
   - `<h2>What Should You Do Next?</h2>` (Actionable 3-step student checklist starting with "1. Step 1 (Action): ...")
   - `<h2>Final Thoughts: [Briefing Conclusion]</h2>` (Must contain a brief closing and naturally weave in a link to https://kampusfilter.com)
5. **Structured Q&A FAQ Block**: End the content body with exactly 6 detailed student Q&As inside '<div class="geo-faq"><div class="faq-item"><h4 class="faq-question">Question?</h4><p class="faq-answer">Detailed Answer.</p></div>...</div>'.
   * IMPORTANT: The FAQ block must terminate with exactly two closing divs ('</div>\n</div>') to prevent React hydration errors. Do NOT add a third closing div.

---

## Part A: Google Antigravity 2.0 Writing Engine
* Content writing is handled directly by the built-in Google Antigravity 2.0 content generator (agentic file creation) inside workspace sessions, resolving draft creation without requiring third-party API key configurations.

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
