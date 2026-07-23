# Article Generation Rules

Whenever an article is generated or edited in this repository, strictly adhere to the **Premium Human-Like Content Generation Framework** outlined in `CONTENT_FRAMEWORK.md`.

### Core Requirements:
1. **Length & Quality**: Minimum 1,000+ words of deep, research-backed, publication-ready content written like an expert teaching a smart friend.
2. **Readability & Tone**: Grade 7-9 readability, varied sentence lengths, conversational & authoritative tone. No fluff or generic AI phrases ("In today's digital world...", "It is important to note...").
3. **Structured HTML Elements**:
   - Lead paragraph: `<p class="text-lg leading-relaxed text-muted-foreground mb-6">`
   - Key Takeaways: `<div class="geo-takeaways">`
   - Mermaid.js Diagrams: `<div class="geo-mermaid">flowchart TD...</div>` (rendered at 40% initial zoom size)
   - Comparison & Data Tables: `<table class="geo-dates-table">`
   - 3-Step Action Checklist: `<p>1. Step 1 (Action): ...</p>`
   - Citations & References: `<div class="geo-citations">`
   - FAQ Accordion: `<div class="geo-faq">`
4. **Publishing Workflow**:
   - Save JSON draft to `draft_article.json`
   - Execute `python scripts/publish_upsert.py`
