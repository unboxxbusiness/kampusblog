#!/usr/bin/env python3
import os
import sys
import json
import urllib.request
import urllib.error
import re
import time
import math
import subprocess

def load_env():
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith('#'):
                    continue
                parts = line.split('=', 1)
                if len(parts) == 2:
                    key = parts[0].strip()
                    val = parts[1].strip().strip('"').strip("'")
                    os.environ[key] = val

load_env()

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'[^\w\-]+', '', text)
    text = re.sub(r'\-\-+', '-', text)
    return text.strip('-')

def calculate_reading_time(html_content):
    plain_text = re.sub(r'<[^>]*>', '', html_content)
    words = len(plain_text.strip().split())
    return max(1, math.ceil(words / 225))

def main():
    print("[*] Loading 10 articles from publish_batch_articles.ts via tsx...")
    try:
        cmd = ['npx', 'tsx', '-e', 'import { ARTICLES } from "./scripts/publish_batch_articles"; console.log(JSON.stringify(ARTICLES));']
        output = subprocess.check_output(cmd, cwd=os.path.join(os.path.dirname(__file__), '..')).decode('utf-8')
        articles = json.loads(output)
        print(f"[+] Successfully loaded {len(articles)} articles from TS source.")
    except Exception as e:
        print(f"[!] Error loading articles from TS source: {e}")
        return

    db_url = os.environ.get('TURSO_CONNECTION_URL', '')
    db_token = os.environ.get('TURSO_AUTH_TOKEN', '')
    api_key = os.environ.get('KAMPUSFILTER_API_KEY', 'kf_webhook_8a7d3c8e4f1b2c9d0d5365')

    if not db_url or not db_token:
        print("[!] Error: TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN is missing")
        return

    http_url = db_url.replace('libsql://', 'https://')
    pipeline_url = f"{http_url}/v2/pipeline"
    headers = {
        "Authorization": f"Bearer {db_token}",
        "Content-Type": "application/json"
    }

    published_count = 0
    slug_list = []

    for draft in articles:
        title = draft["title"].strip()
        slug = slugify(title)
        excerpt = draft.get("excerpt", "").strip()
        content = draft.get("content", "").strip()
        category = draft.get("category", "General").strip()
        image = draft.get("image", "").strip()
        author = draft.get("author", "Kampus Filter Desk").strip()
        featured = 1 if draft.get("featured", False) else 0
        keywords = draft.get("keywords", category.lower()).strip()
        tags = draft.get("tags", "").strip()
        viral_score = int(draft.get("viral_score", 80))
        source_name = draft.get("source_name", "").strip()
        source_url = draft.get("source_url", "").strip()
        reading_time = calculate_reading_time(content)
        now_ms = int(time.time() * 1000)
        article_id = f"art_{int(time.time())}_{published_count}"

        # 1. Delete any existing row with this slug
        delete_payload = {
            "requests": [
                {
                    "type": "execute",
                    "stmt": {
                        "sql": "DELETE FROM articles WHERE slug = ?",
                        "args": [{"type": "text", "value": slug}]
                    }
                },
                {"type": "close"}
            ]
        }
        req_del = urllib.request.Request(pipeline_url, data=json.dumps(delete_payload).encode('utf-8'), headers=headers, method='POST')
        try:
            with urllib.request.urlopen(req_del) as resp:
                pass
        except Exception as e:
            print(f"[!] Warning on DELETE {slug}: {e}")

        # 2. Insert with status = 'published'
        insert_sql = """
        INSERT INTO articles (
            id, title, slug, excerpt, content, category, image, author,
            published_at, created_at, updated_at, featured, status,
            meta_title, meta_description, keywords, reading_time, views,
            tags, content_type, viral_score, source_name, source_url,
            views_7d, views_30d, last_viewed_at, og_image, twitter_image,
            published_by, research_ref, metadata
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?,
            ?, ?, ?
        )
        """
        insert_args = [
            {"type": "text", "value": article_id},
            {"type": "text", "value": title},
            {"type": "text", "value": slug},
            {"type": "text", "value": excerpt},
            {"type": "text", "value": content},
            {"type": "text", "value": category},
            {"type": "text", "value": image},
            {"type": "text", "value": author},
            {"type": "integer", "value": str(now_ms)},
            {"type": "integer", "value": str(now_ms)},
            {"type": "integer", "value": str(now_ms)},
            {"type": "integer", "value": str(featured)},
            {"type": "text", "value": "published"},
            {"type": "text", "value": title},
            {"type": "text", "value": excerpt},
            {"type": "text", "value": keywords},
            {"type": "integer", "value": str(reading_time)},
            {"type": "integer", "value": "120"},
            {"type": "text", "value": tags},
            {"type": "text", "value": "news"},
            {"type": "integer", "value": str(viral_score)},
            {"type": "text", "value": source_name},
            {"type": "text", "value": source_url},
            {"type": "integer", "value": "85"},
            {"type": "integer", "value": "120"},
            {"type": "integer", "value": str(now_ms)},
            {"type": "text", "value": image},
            {"type": "text", "value": image},
            {"type": "text", "value": author},
            {"type": "text", "value": ""},
            {"type": "null"}
        ]

        insert_payload = {
            "requests": [
                {
                    "type": "execute",
                    "stmt": {
                        "sql": insert_sql,
                        "args": insert_args
                    }
                },
                {"type": "close"}
            ]
        }

        req_ins = urllib.request.Request(pipeline_url, data=json.dumps(insert_payload).encode('utf-8'), headers=headers, method='POST')
        try:
            with urllib.request.urlopen(req_ins) as resp:
                res_json = json.loads(resp.read().decode('utf-8'))
                if 'error' in res_json.get('results', [{}])[0]:
                    print(f"[!] Insert DB Error ({slug}): {res_json['results'][0]['error']}")
                else:
                    print(f"[+] Successfully PUBLISHED: {slug}")
                    published_count += 1
                    slug_list.append((slug, category))
        except Exception as e:
            print(f"[!] Insert Exception ({slug}): {e}")

    print(f"\n[*] Inserted {published_count} articles into Turso DB.")

    # 3. Verify top 15 latest published rows
    verify_payload = {
        "requests": [
            {
                "type": "execute",
                "stmt": {
                    "sql": "SELECT slug, status, published_at FROM articles WHERE status = 'published' ORDER BY published_at DESC LIMIT 15",
                    "args": []
                }
            },
            {"type": "close"}
        ]
    }
    req_ver = urllib.request.Request(pipeline_url, data=json.dumps(verify_payload).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req_ver) as resp:
            res_json = json.loads(resp.read().decode('utf-8'))
            rows = res_json['results'][0]['response']['result']['rows']
            print("\n[*] Latest 15 Published Articles currently in Turso DB:")
            for r in rows:
                print(f"    - {r[0]['value']} (Status: {r[1]['value']}, PubAt: {r[2]['value']})")
    except Exception as e:
        print(f"[!] Verification check error: {e}")

    # 4. Trigger Netlify revalidation
    print("\n[*] Triggering Netlify cache revalidation for all 10 live articles...")
    revalidate_headers = {
        "Content-Type": "application/json",
        "x-api-key": api_key
    }
    for slug, cat in slug_list:
        payload = json.dumps({"slug": slug, "category": cat}).encode('utf-8')
        req_rev = urllib.request.Request("https://kampusfilter.com/api/revalidate", data=payload, headers=revalidate_headers, method='POST')
        try:
            with urllib.request.urlopen(req_rev) as resp:
                print(f"    [Revalidate OK] {slug} -> {resp.status}")
        except Exception as e:
            print(f"    [Revalidate Error] {slug} -> {e}")

    # Also revalidate home
    try:
        req_home = urllib.request.Request("https://kampusfilter.com/api/revalidate", data=json.dumps({"slug": ""}).encode('utf-8'), headers=revalidate_headers, method='POST')
        with urllib.request.urlopen(req_home) as resp:
            print(f"    [Revalidate Home OK] -> {resp.status}")
    except Exception as e:
        print(f"    [Revalidate Home Error] -> {e}")

    print("\n[SUCCESS] Script finished.")

if __name__ == '__main__':
    main()
