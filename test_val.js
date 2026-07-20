const fs = require('fs');
const path = require('path');
const draftPath = "E:/brandapp/kampusfilter/draft_article.json";
const raw = fs.readFileSync(draftPath, 'utf8');
const draft = JSON.parse(raw);

let logs = [];
const log = (...args) => logs.push(args.join(' '));

log("[+] Title length:", draft.title.length);
log("[+] Excerpt length:", draft.excerpt.length);
log("[+] Category:", draft.category);

const allowedCategories = [
  "University Admissions",
  "Scholarships",
  "Internships",
  "Student Opportunities",
  "Education News",
  "Career Signals",
  "Future Skills"
];
if (!allowedCategories.includes(draft.category)) log("ERROR category");

const content = draft.content;

// 2. GEO Takeaways validation
const takeawaysMatch = content.match(/<div[^>]*class=["']geo-takeaways["'][^>]*>([\s\S]*?)<\/div>/);
if (!takeawaysMatch) log("ERROR geo-takeaways");
else {
  const liMatches = takeawaysMatch[1].match(/<li>/g);
  log("[+] Takeaways bullets count:", liMatches ? liMatches.length : 0);
}

// 3. GEO Citations validation
const citationsMatch = content.match(/<div[^>]*class=["']geo-citations["'][^>]*>([\s\S]*?)<\/div>/);
if (!citationsMatch) log("ERROR geo-citations");
else {
  const linkMatches = citationsMatch[1].match(/<a[^>]*href=/g);
  log("[+] Citation links count:", linkMatches ? linkMatches.length : 0);
}

// 4. Heading sequence validation
const h2Matches = [...content.matchAll(/<h2>([\s\S]*?)<\/h2>/g)].map(m => m[1]);
log("[+] h2 count:", h2Matches.length);
const expectedHeadings = [
  /^Introduction:/i,
  /^What Happened\?/i,
  /^Why It Matters$/i,
  /^Who Should Care\?$/i,
  /^Eligibility, Dates & Resource Links$/i,
  /^What Should You Do Next\?$/i
];

for (let i = 0; i < 6; i++) {
  const headingText = h2Matches[i] ? h2Matches[i].replace(/<[^>]*>/g, '').trim() : '';
  if (!expectedHeadings[i].test(headingText)) {
    log(`ERROR heading ${i+1}: "${headingText}" does not match ${expectedHeadings[i]}`);
  } else {
    log(`[+] Heading ${i+1} matched: "${headingText}"`);
  }
}

// 5. H3 subsections check
const h3Matches = [...content.matchAll(/<h3>([\s\S]*?)<\/h3>/g)].map(m => m[1].replace(/<[^>]*>/g, '').trim());
const expectedH3 = [
  "1. Students and Graduates",
  "2. Job Seekers & Aspirants",
  "3. Institutions"
];
log("[+] h3 count:", h3Matches.length);
for (let i = 0; i < 3; i++) {
  if (h3Matches[i] !== expectedH3[i]) {
    log(`ERROR h3 ${i+1}: "${h3Matches[i]}" !== "${expectedH3[i]}"`);
  } else {
    log(`[+] h3 ${i+1} matched: "${h3Matches[i]}"`);
  }
}

// 6. GEO FAQ block validation
const faqMatch = content.match(/<div[^>]*class=["']geo-faq["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/);
if (!faqMatch) {
  log("ERROR FAQ block regex failed");
} else {
  const faqInner = faqMatch[1];
  const itemRegex = /<div[^>]*class=["']faq-item["'][^>]*>([\s\S]*?)<\/div>/g;
  const faqItems = [...faqInner.matchAll(itemRegex)].map(m => m[1]);
  log("[+] FAQ items count:", faqItems.length);
  for (let i = 0; i < faqItems.length; i++) {
    const item = faqItems[i];
    const qMatch = item.match(/<h[234][^>]*class=["']faq-question["'][^>]*>([\s\S]*?)<\/h[234]>/);
    const aMatch = item.match(/<p[^>]*class=["']faq-answer["'][^>]*>([\s\S]*?)<\/p>/);
    if (!qMatch || !aMatch) {
      log(`ERROR FAQ item ${i+1} missing q/a class tags`);
    } else {
      log(`[+] FAQ item ${i+1} validated Q and A`);
    }
  }
}

const outDir = "C:/Users/Admin/.gemini/antigravity/brain/fce01f4b-9b57-4b52-9044-1a0f0ab08850/scratch";
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'val_res.txt'), logs.join('\n'));
