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
  let logs = [];
  const log = (...args) => logs.push(args.join(' '));

  const draftPath = path.join(__dirname, '..', 'draft_article.json');
  if (!fs.existsSync(draftPath)) {
    log('Error: Draft file not found');
    fs.writeFileSync(path.join(__dirname, '..', 'publish_upsert_log.txt'), logs.join('\n'), 'utf8');
    process.exit(1);
  }

  const raw = fs.readFileSync(draftPath, 'utf8');
  const draft = JSON.parse(raw);

  const dbUrl = process.env.TURSO_CONNECTION_URL;
  const dbToken = process.env.TURSO_AUTH_TOKEN;

  if (!dbUrl) {
    log('Error: TURSO_CONNECTION_URL is missing in .env.local');
    fs.writeFileSync(path.join(__dirname, '..', 'publish_upsert_log.txt'), logs.join('\n'), 'utf8');
    process.exit(1);
  }

  const client = createClient({ url: dbUrl, authToken: dbToken });

  const slug = slugify(draft.title);
  const readingTime = calculateReadingTime(draft.content);
  const now = Date.now();

  try {
    log(`[*] Checking if article slug "${slug}" exists in Turso database...`);
    const checkRes = await client.execute({
      sql: 'SELECT id, title FROM articles WHERE slug = ?',
      args: [slug]
    });

    if (checkRes.rows.length > 0) {
      const existingId = checkRes.rows[0].id;
      log(`[+] Found existing article with slug "${slug}" (ID: ${existingId}). Updating row...`);

      const updateQuery = `
        UPDATE articles SET
          title = ?,
          excerpt = ?,
          content = ?,
          category = ?,
          image = ?,
          author = ?,
          updated_at = ?,
          meta_title = ?,
          meta_description = ?,
          keywords = ?,
          reading_time = ?,
          og_image = ?,
          twitter_image = ?,
          published_by = ?
        WHERE slug = ?
      `;

      const updateArgs = [
        draft.title.trim(),
        draft.excerpt.trim(),
        draft.content.trim(),
        draft.category,
        draft.image.trim(),
        draft.author.trim(),
        now,
        draft.title.trim(),
        draft.excerpt.trim(),
        draft.keywords || draft.category.toLowerCase(),
        readingTime,
        draft.og_image || draft.image.trim(),
        draft.twitter_image || draft.image.trim(),
        draft.author.trim(),
        slug
      ];

      await client.execute({ sql: updateQuery, args: updateArgs });
      log(`[+] SUCCESS: Updated live article "${draft.title}" on database!`);
    } else {
      log(`[*] Article slug "${slug}" not found in database. Inserting new article...`);
      const newId = Math.random().toString(36).substring(2, 15);

      const insertQuery = `
        INSERT INTO articles (
          id, title, slug, excerpt, content, category, image, author,
          published_at, created_at, updated_at, featured, status,
          meta_title, meta_description, keywords, reading_time, views,
          tags, content_type, viral_score, source_name, source_url,
          views_7d, views_30d, og_image, twitter_image, published_by,
          research_ref, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const insertArgs = [
        newId,
        draft.title.trim(),
        slug,
        draft.excerpt.trim(),
        draft.content.trim(),
        draft.category,
        draft.image.trim(),
        draft.author.trim(),
        now,
        now,
        now,
        draft.featured ? 1 : 0,
        'published',
        draft.title.trim(),
        draft.excerpt.trim(),
        draft.keywords || draft.category.toLowerCase(),
        readingTime,
        0,
        draft.tags || '',
        draft.content_type || 'news',
        draft.viral_score || 0,
        draft.source_name || '',
        draft.source_url || '',
        0,
        0,
        draft.og_image || draft.image.trim(),
        draft.twitter_image || draft.image.trim(),
        draft.author.trim(),
        draft.research_ref || '',
        draft.metadata || ''
      ];

      await client.execute({ sql: insertQuery, args: insertArgs });
      log(`[+] SUCCESS: Published new article "${draft.title}" to database!`);
    }

    // Ping Netlify revalidate endpoint if API key present
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kampusfilter.com';
    const revalidateWebhookUrl = `${baseUrl.replace(/\/$/, '')}/api/revalidate`;
    const notifySecret = process.env.KAMPUSFILTER_API_KEY;

    if (notifySecret) {
      try {
        await fetch(revalidateWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': notifySecret,
          },
          body: JSON.stringify({ slug, category: draft.category }),
        });
        log('[+] Revalidation webhook triggered successfully.');
      } catch (e) {
        log('[!] Revalidation trigger note:', e.message);
      }
    }

  } catch (err) {
    log('[!] Database operation failed:', err.message);
  } finally {
    client.close();
    const outDir = "C:/Users/Admin/.gemini/antigravity/brain/fce01f4b-9b57-4b52-9044-1a0f0ab08850/scratch";
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'publish_result.txt'), logs.join('\n'), 'utf8');
    fs.writeFileSync(path.join(__dirname, '..', 'publish_upsert_log.txt'), logs.join('\n'), 'utf8');
  }
}

publish();
