const fs = require('fs');
const path = require('path');

// 1. Helper to manually load environment variables locally
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0]?.trim();
        const value = parts.slice(1).join('=').trim().replace(/(^["']|["']$)/g, '');
        if (key) process.env[key] = value;
      }
    });
  }
}

loadEnv();

const { createClient } = require('@libsql/client');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function calculateSimilarity(str1, str2) {
  const clean = (s) => s.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
  const w1 = new Set(clean(str1));
  const w2 = new Set(clean(str2));
  if (w1.size === 0 || w2.size === 0) return 0;
  const intersection = new Set([...w1].filter(x => w2.has(x)));
  const union = new Set([...w1, ...w2]);
  return intersection.size / union.size;
}

async function getRecentArticles() {
  const dbUrl = process.env.TURSO_CONNECTION_URL;
  const dbToken = process.env.TURSO_AUTH_TOKEN;
  if (!dbUrl) {
    console.warn('[!] TURSO_CONNECTION_URL is missing. Skipping database recent article fetch.');
    return [];
  }
  try {
    const client = createClient({ url: dbUrl, authToken: dbToken });
    const result = await client.execute('SELECT title, slug FROM articles ORDER BY published_at DESC LIMIT 30');
    client.close();
    return result.rows.map(row => ({ title: row.title, slug: row.slug }));
  } catch (err) {
    console.warn('[!] Failed to retrieve recent articles from database:', err.message);
    return [];
  }
}


async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('\n[!] Error: OPENAI_API_KEY is missing in your .env.local file.');
    console.log('    Please add: OPENAI_API_KEY=your-api-key-here to .env.local first.\n');
    process.exit(1);
  }

  const trendsPath = path.join(__dirname, '..', '.agents', 'research', 'trends_research.json');
  if (!fs.existsSync(trendsPath)) {
    console.error(`[!] Error: Research trends JSON not found at ${trendsPath}.`);
    console.log('    Run: python scripts/fetch_trends.py first.\n');
    process.exit(1);
  }

  console.log('[*] Reading trends research report...');
  const trendsRaw = fs.readFileSync(trendsPath, 'utf8');
  const trendsData = JSON.parse(trendsRaw);

  console.log('[*] Fetching recent articles from database for deduplication...');
  const recentArticles = await getRecentArticles();
  const recentArticlesList = recentArticles.map(a => `- ${a.title}`).join('\n') || 'None';

  // Grab some trending topics to summarize in the prompt
  const topNews = trendsData.top_stories?.slice(0, 3).map(s => `- ${s.title} (${s.source})`).join('\n') || 'None';
  const topYT = trendsData.youtube_trending?.slice(0, 3).map(y => `- ${y.title} (${y.channel})`).join('\n') || 'None';

  console.log('[*] Selected trending references for AI context:');
  console.log(topNews);
  console.log(topYT);

  const prompt = `You are the Lead Editor for Kampus Filter (a daily student intelligence platform helping students make smarter education and career decisions).
Your task is to review today's student education trends research and draft a highly optimized, daily briefing for our readers.

### Recently Covered Articles (DO NOT write about these topics or use similar titles):
${recentArticlesList}

### Daily Niche Scraper Data:
Top Stories & Government Notifications:
\${topNews}

Top Trending Student Videos:
\${topYT}

Choose the single most viral and relevant student admissions, scholarship, exam, or opportunity theme from the topics above.
Do not choose a topic that matches or is highly similar to any of the recently covered articles listed above.

You must output a strictly structured JSON object in the exact format defined below.

### Output JSON Format:
{
  "title": "[Engaging, keyword-rich student headline. Keep under 60 characters]",
  "excerpt": "[Short, action-focused daily briefing summary. Keep under 150 characters]",
  "category": "[Must match exactly one of these: University Admissions, Scholarships, Internships, Student Opportunities, Education News, Career Signals, Future Skills]",
  "image": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200",
  "author": "Kampus Filter Editorial",
  "keywords": "[Comma-separated lowercase SEO keywords]",
  "featured": true,
  "tags": "[Comma-separated lowercase search tags]",
  "content_type": "[One of: news, tutorial, comparison, tool-review]",
  "viral_score": 90,
  "source_name": "[The primary source name, e.g. UGC Portal, NTA, Josh Talks]",
  "source_url": "[URL of the primary source reference]",
  "research_ref": "[Citation reference name, e.g. UGC Notification 2026]",
  "content": "[HTML formatted string (see formatting rules below)]"
}

### Content Formatting Rules (Strict):
Your "content" string MUST strictly utilize standard HTML5 tags and follow this exact layout:

1. **GEO Takeaways Section**: Add a '<div class="geo-takeaways"><ul><li>Bullet 1</li>...</ul></div>' at the very beginning of the body.
2. **Authority Citations**: Add a '<div class="geo-citations"><a href="...">Source Name</a>...</div>' referencing the source URLs.
3. **Heading Hierarchy**: Use exactly these eight H2 headings in sequence, written strictly as native HTML tags (do NOT use markdown '#' or '##' hashes):
   - '<h2>Introduction: [Briefing Subtitle]</h2>'
   - '<h2>What Happened? [Context / News / Announcement]</h2>'
   - '<h2>Why It Matters</h2>'
   - '<h2>Who Should Care?</h2>' (Followed by exactly three h3 sub-sections: '<h3>1. Students and Graduates</h3>', '<h3>2. Job Seekers & Aspirants</h3>', '<h3>3. Institutions</h3>')
   - '<h2>How Does It Work? [Technical Details / Workflow]</h2>'
     * Include a Mermaid.js diagram inside '<div class="geo-mermaid"> ... </div>' to visualize processes/flows.
     * All flowchart diagrams must start with `flowchart TD` (vertical layout) to fit screens better and prevent horizontal cutoff.
     * Keep focused: 4-7 nodes max using node shapes `([...])`, `[...]`, `{...}`, `[(...)]`.
   - '<h2>Eligibility, Dates & Resource Links</h2>' (Include a styled HTML dates/milestones table)
   - '<h2>What Should You Do Next?</h2>' (Actionable 3-step student checklist starting with "1. Step 1 (Action): ...")
   - '<h2>Final Thoughts: [Briefing Conclusion]</h2>' (Must contain a brief closing and naturally weave in a link to https://kampusfilter.com)
4. **Structured Q&A FAQ Block**: End the content body with exactly 6 detailed Q&As inside '<div class="geo-faq"><div class="faq-item"><h4 class="faq-question">Question?</h4><p class="faq-answer">Detailed Answer.</p></div>...</div>'.
   * IMPORTANT: The FAQ block must terminate with exactly two closing divs ('</div>\\n</div>') to prevent React hydration errors. Do NOT add a third closing div.
`;

  console.log('[*] Contacting OpenAI API...');
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer \${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a professional educational editor. You write high-quality student briefings and output strictly formatted JSON objects.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API call failed: status \${response.status} - \${errorText}`);
    }

    const responseData = await response.json();
    const articleJson = responseData.choices[0].message.content;

    // Local validation check for exact slug matches or high similarity
    let draftObj;
    try {
      draftObj = JSON.parse(articleJson);
    } catch (e) {
      console.warn('[!] Failed to parse generated draft JSON locally. Skipping validation.');
    }

    if (draftObj && recentArticles.length > 0) {
      const generatedSlug = slugify(draftObj.title);
      for (const article of recentArticles) {
        const existingSlug = slugify(article.title);
        const score = calculateSimilarity(article.title, draftObj.title);
        if (existingSlug === generatedSlug || score > 0.8) {
          console.error(`\n[!] Error: Generated draft is a duplicate of an existing article!`);
          console.error(`    Proposed Title : "${draftObj.title}"`);
          console.error(`    Existing Title : "${article.title}"`);
          console.error(`    Similarity Score: ${Math.round(score * 100)}% (Threshold: 80%)`);
          console.error(`    Process aborted to prevent duplicate content creation.\n`);
          process.exit(1);
        }
      }
    }

    const outputPath = path.join(__dirname, '..', 'draft_article.json');
    fs.writeFileSync(outputPath, articleJson, 'utf8');

    console.log('\n============================================================');
    console.log('  ✅ Automated Draft Generated Successfully!');
    console.log('============================================================');
    console.log(`  Saved to: \${outputPath}`);
    console.log('  You are ready to publish by running: npx tsx scripts/publish_article.ts');
    console.log('============================================================\n');

  } catch (err) {
    console.error('[!] API call or draft generation failed:', err.message);
  }
}

main();
