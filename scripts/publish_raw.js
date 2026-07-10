const fs = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client');

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

function calculateReadingTime(htmlContent) {
  const wordsPerMinute = 225;
  const plainText = htmlContent.replace(/<[^>]*>/g, '');
  const words = plainText.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

async function publish() {
  const draftPath = path.join(__dirname, '..', 'draft_article.json');
  if (!fs.existsSync(draftPath)) {
    console.error('Draft file not found');
    fs.writeFileSync(path.join(__dirname, '..', 'publish_log.txt'), 'Error: Draft file not found', 'utf8');
    process.exit(1);
  }

  const raw = fs.readFileSync(draftPath, 'utf8');
  const draft = JSON.parse(raw);

  const dbUrl = process.env.TURSO_CONNECTION_URL;
  const dbToken = process.env.TURSO_AUTH_TOKEN;

  if (!dbUrl) {
    console.error('Connection URL is missing');
    fs.writeFileSync(path.join(__dirname, '..', 'publish_log.txt'), 'Error: Connection URL is missing', 'utf8');
    process.exit(1);
  }

  const client = createClient({ url: dbUrl, authToken: dbToken });

  const slug = slugify(draft.title);
  const id = Math.random().toString(36).substring(2, 15);
  const readingTime = calculateReadingTime(draft.content);
  const now = Date.now();

  const newArticle = {
    id,
    title: draft.title.trim(),
    slug,
    excerpt: draft.excerpt.trim(),
    content: draft.content.trim(),
    category: draft.category,
    image: draft.image.trim(),
    author: draft.author.trim(),
    published_at: now,
    created_at: now,
    updated_at: now,
    featured: draft.featured ? 1 : 0,
    status: 'published',
    meta_title: draft.title.trim(),
    meta_description: draft.excerpt.trim(),
    keywords: draft.keywords || draft.category.toLowerCase(),
    reading_time: readingTime,
    views: 0,
    tags: draft.tags || '',
    content_type: draft.content_type || 'news',
    viral_score: draft.viral_score || 0,
    source_name: draft.source_name || '',
    source_url: draft.source_url || '',
    views_7d: 0,
    views_30d: 0,
    og_image: draft.og_image || draft.image.trim(),
    twitter_image: draft.twitter_image || draft.image.trim(),
    published_by: draft.author.trim(),
    research_ref: draft.research_ref || '',
    metadata: draft.metadata || ''
  };

  try {
    console.log('Inserting article into Turso...');
    
    const query = `
      INSERT INTO articles (
        id, title, slug, excerpt, content, category, image, author,
        published_at, created_at, updated_at, featured, status,
        meta_title, meta_description, keywords, reading_time, views,
        tags, content_type, viral_score, source_name, source_url,
        views_7d, views_30d, og_image, twitter_image, published_by,
        research_ref, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      newArticle.id, newArticle.title, newArticle.slug, newArticle.excerpt, newArticle.content,
      newArticle.category, newArticle.image, newArticle.author, newArticle.published_at,
      newArticle.created_at, newArticle.updated_at, newArticle.featured, newArticle.status,
      newArticle.meta_title, newArticle.meta_description, newArticle.keywords, newArticle.reading_time,
      newArticle.views, newArticle.tags, newArticle.content_type, newArticle.viral_score,
      newArticle.source_name, newArticle.source_url, newArticle.views_7d, newArticle.views_30d,
      newArticle.og_image, newArticle.twitter_image, newArticle.published_by, newArticle.research_ref,
      newArticle.metadata
    ];

    await client.execute({ sql: query, args: params });
    console.log('Article published successfully!');
    
    // Clean up draft
    fs.unlinkSync(draftPath);

    fs.writeFileSync(path.join(__dirname, '..', 'publish_log.txt'), 'Success: Article published successfully!', 'utf8');

    // Trigger local revalidate if possible
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const revalidateWebhookUrl = `${baseUrl.replace(/\/$/, '')}/api/revalidate`;
    const notifySecret = process.env.KAMPUSFILTER_API_KEY;

    if (notifySecret) {
      fetch(revalidateWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': notifySecret,
        },
        body: JSON.stringify({ slug: newArticle.slug, category: newArticle.category }),
      }).catch(() => {});
    }

  } catch (err) {
    console.error('Database insert failed:', err.message);
    fs.writeFileSync('publish_log.txt', 'Error: ' + err.message + '\n' + err.stack, 'utf8');
  } finally {
    client.close();
  }
}

publish();
