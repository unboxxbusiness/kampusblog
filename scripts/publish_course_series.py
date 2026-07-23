import os, sys, json, math, time, urllib.request, urllib.parse

# Force UTF-8 stdout encoding for Windows console
try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

def log_print(msg):
    try:
        print(msg)
    except Exception:
        print(msg.encode('ascii', 'ignore').decode('ascii'))

def load_env(env_path):
    env = {}
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                if '=' in line and not line.strip().startswith('#'):
                    k, v = line.strip().split('=', 1)
                    env[k] = v.strip('"\'')
    return env

def search_youtube_videos(query, api_key, max_results=3):
    if not api_key:
        return []
    try:
        url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q={urllib.parse.quote(query)}&type=video&maxResults={max_results}&key={api_key}"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            items = data.get('items', [])
            results = []
            for item in items:
                snippet = item.get('snippet', {})
                results.append({
                    'video_id': item.get('id', {}).get('videoId'),
                    'title': snippet.get('title'),
                    'channel': snippet.get('channelTitle'),
                    'description': snippet.get('description'),
                    'published_at': snippet.get('publishedAt')
                })
            return results
    except Exception as e:
        log_print(f"[!] YouTube API search error: {e}")
        return []

def slugify(text):
    import re
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

def calculate_reading_time(html_content):
    import re
    plain_text = re.sub(r'<[^>]+>', '', html_content)
    words = len(plain_text.strip().split())
    return max(1, math.ceil(words / 225))

def publish_to_turso(env, article_data):
    db_url = env.get('TURSO_CONNECTION_URL', '').replace('libsql://', 'https://')
    token = env.get('TURSO_AUTH_TOKEN', '')
    if not db_url or not token:
        log_print("[!] Missing Turso credentials in env.")
        return False

    pipeline_url = f"{db_url}/v2/pipeline"
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    slug = article_data['slug']
    now_ms = int(time.time() * 1000)
    reading_time = calculate_reading_time(article_data['content'])

    # Check if slug exists
    check_payload = {
        "requests": [
            {
                "type": "execute",
                "stmt": {
                    "sql": "SELECT id FROM articles WHERE slug = ?",
                    "args": [{"type": "text", "value": slug}]
                }
            },
            {"type": "close"}
        ]
    }

    try:
        req = urllib.request.Request(pipeline_url, data=json.dumps(check_payload).encode('utf-8'), headers=headers, method='POST')
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            rows = data['results'][0]['response']['result']['rows']
            exists = len(rows) > 0
    except Exception as e:
        log_print(f"[!] Error checking DB existence for {slug}: {e}")
        return False

    if exists:
        update_sql = """
        UPDATE articles SET
            title = ?, excerpt = ?, content = ?, category = ?, image = ?, author = ?,
            updated_at = ?, featured = ?, status = 'published', meta_title = ?, meta_description = ?,
            keywords = ?, reading_time = ?, tags = ?, viral_score = ?, source_name = ?, source_url = ?
        WHERE slug = ?
        """
        args = [
            {"type": "text", "value": article_data['title']},
            {"type": "text", "value": article_data['excerpt']},
            {"type": "text", "value": article_data['content']},
            {"type": "text", "value": article_data['category']},
            {"type": "text", "value": article_data['image']},
            {"type": "text", "value": article_data['author']},
            {"type": "integer", "value": str(now_ms)},
            {"type": "integer", "value": "1" if article_data.get('featured') else "0"},
            {"type": "text", "value": article_data['title']},
            {"type": "text", "value": article_data['excerpt']},
            {"type": "text", "value": article_data.get('keywords', '')},
            {"type": "integer", "value": str(reading_time)},
            {"type": "text", "value": article_data.get('tags', '')},
            {"type": "integer", "value": str(article_data.get('viral_score', 90))},
            {"type": "text", "value": article_data.get('source_name', '')},
            {"type": "text", "value": article_data.get('source_url', '')},
            {"type": "text", "value": slug}
        ]
        payload = {"requests": [{"type": "execute", "stmt": {"sql": update_sql, "args": args}}, {"type": "close"}]}
    else:
        new_id = f"art_{now_ms}_{slug[:10]}"
        insert_sql = """
        INSERT INTO articles (
            id, title, slug, excerpt, content, category, image, author,
            published_at, created_at, updated_at, featured, status,
            meta_title, meta_description, keywords, reading_time, views,
            tags, content_type, viral_score, source_name, source_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?, 0, ?, 'course', ?, ?, ?)
        """
        args = [
            {"type": "text", "value": new_id},
            {"type": "text", "value": article_data['title']},
            {"type": "text", "value": slug},
            {"type": "text", "value": article_data['excerpt']},
            {"type": "text", "value": article_data['content']},
            {"type": "text", "value": article_data['category']},
            {"type": "text", "value": article_data['image']},
            {"type": "text", "value": article_data['author']},
            {"type": "integer", "value": str(now_ms)},
            {"type": "integer", "value": str(now_ms)},
            {"type": "integer", "value": str(now_ms)},
            {"type": "integer", "value": "1" if article_data.get('featured') else "0"},
            {"type": "text", "value": article_data['title']},
            {"type": "text", "value": article_data['excerpt']},
            {"type": "text", "value": article_data.get('keywords', '')},
            {"type": "integer", "value": str(reading_time)},
            {"type": "text", "value": article_data.get('tags', '')},
            {"type": "integer", "value": str(article_data.get('viral_score', 90))},
            {"type": "text", "value": article_data.get('source_name', '')},
            {"type": "text", "value": article_data.get('source_url', '')}
        ]
        payload = {"requests": [{"type": "execute", "stmt": {"sql": insert_sql, "args": args}}, {"type": "close"}]}

    try:
        req = urllib.request.Request(pipeline_url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
        with urllib.request.urlopen(req) as resp:
            log_print(f"[+] Published to Turso: {article_data['title']}")
            return True
    except Exception as e:
        log_print(f"[!] Error publishing to Turso: {e}")
        return False

def revalidate_urls(env, slugs, category):
    api_key = env.get('KAMPUSFILTER_API_KEY') or env.get('THEASKT_API_KEY', '')
    base_url = env.get('NEXT_PUBLIC_SITE_URL', 'https://kampusfilter.com')
    
    target_urls = [
        "http://localhost:3000/api/revalidate",
        f"{base_url}/api/revalidate"
    ]
    
    for slug in slugs:
        payload = json.dumps({"slug": slug, "category": category}).encode('utf-8')
        for url in target_urls:
            try:
                req = urllib.request.Request(
                    url,
                    data=payload,
                    headers={'x-api-key': api_key, 'Content-Type': 'application/json'},
                    method='POST'
                )
                with urllib.request.urlopen(req) as resp:
                    log_print(f"[+] Revalidated {slug} at {url} (Status: {resp.status})")
            except Exception:
                pass

def main():
    env = load_env(os.path.join(os.getcwd(), '.env.local'))
    draft_file = os.path.join(os.getcwd(), 'draft_course_series.json')

    if not os.path.exists(draft_file):
        log_print("[!] draft_course_series.json not found. Please create it first.")
        return

    with open(draft_file, 'r', encoding='utf-8') as f:
        series_data = json.load(f)

    series_title = series_data.get('series_title', 'Masterclass Series')
    articles = series_data.get('articles', [])

    if len(articles) != 5:
        log_print(f"[!] Expected 5 articles in series, found {len(articles)}")

    # Pre-generate slugs
    for i, art in enumerate(articles):
        art['slug'] = slugify(art['title'])
        art['part'] = i + 1

    # Enrich each article with Series Header Banner & Course Syllabus Widget
    slugs = [art['slug'] for art in articles]
    category = articles[0].get('category', 'Scholarships')

    for i, art in enumerate(articles):
        part_num = i + 1
        prev_slug = slugs[i - 1] if i > 0 else None
        next_slug = slugs[i + 1] if i < len(slugs) - 1 else None

        # Build Series Header
        nav_html = ""
        if prev_slug:
            nav_html += f'<a href="/articles/{prev_slug}" class="text-primary hover:underline">← Part {part_num - 1}</a> '
        if prev_slug and next_slug:
            nav_html += ' | '
        if next_slug:
            nav_html += f'<a href="/articles/{next_slug}" class="text-primary hover:underline">Part {part_num + 1} →</a>'

        header_banner = f"""
<div class="bg-primary/5 border border-primary/20 rounded-xl p-4 my-6">
  <div class="flex items-center justify-between text-xs font-semibold text-primary uppercase tracking-wider mb-1">
    <span>🎓 Course Series: Part {part_num} of 5</span>
    <span>{series_title}</span>
  </div>
  <div class="text-sm font-medium text-foreground flex items-center justify-between">
    <span>Module {part_num}: {art['title']}</span>
    <div class="space-x-2 text-xs">{nav_html}</div>
  </div>
</div>
"""

        # Build Course Syllabus Widget
        syllabus_items = ""
        for j, s_art in enumerate(articles):
            p = j + 1
            if p == part_num:
                syllabus_items += f'<li class="font-bold text-primary py-1">👉 Part {p}: {s_art["title"]} (Current Module)</li>'
            elif p < part_num:
                syllabus_items += f'<li class="py-1"><a href="/articles/{s_art["slug"]}" class="text-muted-foreground hover:text-foreground">✅ Part {p}: {s_art["title"]}</a></li>'
            else:
                syllabus_items += f'<li class="py-1"><a href="/articles/{s_art["slug"]}" class="text-muted-foreground hover:text-foreground">🔒 Part {p}: {s_art["title"]}</a></li>'

        syllabus_widget = f"""
<div class="bg-secondary/40 border border-border rounded-xl p-6 my-8">
  <h3 class="text-lg font-bold text-foreground mb-4">Complete 5-Part Course Syllabus</h3>
  <ol class="list-none space-y-1 text-sm">
    {syllabus_items}
  </ol>
</div>
"""

        # Inject header and syllabus into content
        art['content'] = header_banner + art['content'] + syllabus_widget

        # Publish to Turso
        publish_to_turso(env, art)

    # Trigger revalidation for all 5 slugs
    revalidate_urls(env, slugs, category)
    log_print(f"[+] Successfully published 5-Part Course Series: '{series_title}' to Turso DB!")

if __name__ == '__main__':
    main()
