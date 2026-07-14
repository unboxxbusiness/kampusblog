const fs = require('fs');
const path = require('path');

function validate() {
  const draftPath = path.join(__dirname, 'draft_article.json');
  if (!fs.existsSync(draftPath)) {
    console.error("Error: draft_article.json does not exist");
    process.exit(1);
  }

  const raw = fs.readFileSync(draftPath, 'utf8');
  let draft;
  try {
    draft = JSON.parse(raw);
  } catch (err) {
    console.error("Error: draft_article.json is not valid JSON:", err.message);
    process.exit(1);
  }

  // 1. Schema validations
  const requiredFields = ['title', 'excerpt', 'category', 'image', 'author', 'content'];
  for (const field of requiredFields) {
    if (!draft[field]) {
      console.error(`Error: Missing required field "${field}"`);
      process.exit(1);
    }
  }

  if (draft.title.length > 60) {
    console.warn(`Warning: Title length is ${draft.title.length} characters (should be under 60)`);
  }
  if (draft.excerpt.length > 150) {
    console.warn(`Warning: Excerpt length is ${draft.excerpt.length} characters (should be under 150)`);
  }

  const allowedCategories = [
    "University Admissions",
    "Scholarships",
    "Internships",
    "Student Opportunities",
    "Education News",
    "Career Signals",
    "Future Skills"
  ];
  if (!allowedCategories.includes(draft.category)) {
    console.error(`Error: Category "${draft.category}" is not one of the allowed categories:`, allowedCategories);
    process.exit(1);
  }

  const content = draft.content;

  // 2. GEO Takeaways validation
  const takeawaysMatch = content.match(/<div[^>]*class=["']geo-takeaways["'][^>]*>([\s\S]*?)<\/div>/);
  if (!takeawaysMatch) {
    console.error("Error: Could not find <div class=\"geo-takeaways\">...</div> in content");
    process.exit(1);
  }
  const liMatches = takeawaysMatch[1].match(/<li>/g);
  if (!liMatches || liMatches.length === 0) {
    console.error("Error: No takeaways bullets (<li>) found in geo-takeaways");
    process.exit(1);
  }
  console.log(`[+] Found ${liMatches.length} takeaways bullets.`);

  // 3. GEO Citations validation
  const citationsMatch = content.match(/<div[^>]*class=["']geo-citations["'][^>]*>([\s\S]*?)<\/div>/);
  if (!citationsMatch) {
    console.error("Error: Could not find <div class=\"geo-citations\">...</div> in content");
    process.exit(1);
  }
  const linkMatches = citationsMatch[1].match(/<a[^>]*href=/g);
  if (!linkMatches || linkMatches.length === 0) {
    console.error("Error: No citation links (<a>) found in geo-citations");
    process.exit(1);
  }
  console.log(`[+] Found ${linkMatches.length} citation links.`);

  // 4. Heading sequence validation
  const h2Matches = [...content.matchAll(/<h2>([\s\S]*?)<\/h2>/g)].map(m => m[1]);
  const expectedH2Count = 6;
  if (h2Matches.length !== expectedH2Count) {
    console.error(`Error: Found ${h2Matches.length} <h2> headings, expected exactly ${expectedH2Count}`);
    console.log("Found headings:", h2Matches);
    process.exit(1);
  }

  const expectedHeadings = [
    /^Introduction:/i,
    /^What Happened\?/i,
    /^Why It Matters$/i,
    /^Who Should Care\?$/i,
    /^Eligibility, Dates & Resource Links$/i,
    /^What Should You Do Next\?$/i
  ];

  for (let i = 0; i < expectedH2Count; i++) {
    const headingText = h2Matches[i].replace(/<[^>]*>/g, '').trim();
    if (!expectedHeadings[i].test(headingText)) {
      console.error(`Error: Heading ${i+1} "${headingText}" does not match pattern ${expectedHeadings[i]}`);
      process.exit(1);
    }
  }
  console.log("[+] All 6 <h2> headings match the required sequence.");

  // 5. H3 subsections check
  const h3Matches = [...content.matchAll(/<h3>([\s\S]*?)<\/h3>/g)].map(m => m[1].replace(/<[^>]*>/g, '').trim());
  const expectedH3 = [
    "1. Students and Graduates",
    "2. Job Seekers & Aspirants",
    "3. Institutions"
  ];
  if (h3Matches.length !== 3) {
    console.error(`Error: Found ${h3Matches.length} <h3> sub-sections under "Who Should Care?", expected exactly 3`);
    process.exit(1);
  }
  for (let i = 0; i < 3; i++) {
    if (h3Matches[i] !== expectedH3[i]) {
      console.error(`Error: <h3> ${i+1} is "${h3Matches[i]}", expected "${expectedH3[i]}"`);
      process.exit(1);
    }
  }
  console.log("[+] All 3 <h3> subsections match exactly.");

  // 6. GEO FAQ block validation
  // Test regex from geo-parser: /<div[^>]*class=["']geo-faq["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/
  const faqMatch = content.match(/<div[^>]*class=["']geo-faq["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/);
  if (!faqMatch) {
    console.error("Error: FAQ block validation failed. It must have class=\"geo-faq\" and terminate with exactly two closing divs (</div>\\n</div> or </div></div>)");
    process.exit(1);
  }

  const faqInner = faqMatch[1];
  const itemRegex = /<div[^>]*class=["']faq-item["'][^>]*>([\s\S]*?)<\/div>/g;
  const faqItems = [...faqInner.matchAll(itemRegex)].map(m => m[1]);
  if (faqItems.length !== 4) {
    console.error(`Error: Found ${faqItems.length} faq-items, expected exactly 4`);
    process.exit(1);
  }

  for (let i = 0; i < 4; i++) {
    const item = faqItems[i];
    const qMatch = item.match(/<h[234][^>]*class=["']faq-question["'][^>]*>([\s\S]*?)<\/h[234]>/);
    const aMatch = item.match(/<p[^>]*class=["']faq-answer["'][^>]*>([\s\S]*?)<\/p>/);
    if (!qMatch || !aMatch) {
      console.error(`Error: FAQ item ${i+1} is missing faq-question or faq-answer class tags`);
      process.exit(1);
    }
  }
  console.log("[+] FAQ block contains exactly 4 questions and answers, and matches class markup patterns.");

  console.log("\n==============================================================");
  console.log("  ✅ SUCCESS: draft_article.json is 100% valid and compliant!");
  console.log("==============================================================\n");
}

validate();
