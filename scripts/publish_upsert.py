#!/usr/bin/env python3
import os
import json
import urllib.request
import urllib.parse
import re
import time
import math

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
    log = []
    def log_print(msg):
        print(msg)
        log.append(msg)

    draft_path = os.path.join(os.path.dirname(__file__), '..', 'draft_article.json')
    if not os.path.exists(draft_path):
        log_print("[!] Error: draft_article.json does not exist.")
        return

    with open(draft_path, 'r', encoding='utf-8') as f:
        draft = json.load(f)

    db_url = os.environ.get('TURSO_CONNECTION_URL', '')
    db_token = os.environ.get('TURSO_AUTH_TOKEN', '')

    if not db_url or not db_token:
        log_print("[!] Error: TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN is missing in .env.local")
        return

    http_url = db_url.replace('libsql://', 'https://')
    pipeline_url = f"{http_url}/v2/pipeline"
    headers = {
        "Authorization": f"Bearer {db_token}",
        "Content-Type": "application/json"
    }

    title = draft["title"].strip()
    slug = slugify(title)
    excerpt = draft["excerpt"].strip()
    content = draft["content"].strip()
    category = draft["category"].strip()
    image = draft["image"].strip()
    author = draft["author"].strip()
    reading_time = calculate_reading_time(content)
    now_ms = int(time.time() * 1000)

    log_print(f"[*] Processing article: '{title}'")
    log_print(f"[*] Target slug: '{slug}'")

    # Step 1: Check if article with slug exists
    check_payload = {
        "requests": [
            {
                "type": "execute",
                "stmt": {
                    "sql": "SELECT id, title FROM articles WHERE slug = ?",
                    "args": [{"type": "text", "value": slug}]
                }
            },
            {"type": "close"}
        ]
    }

    req = urllib.request.Request(
        pipeline_url,
        data=json.dumps(check_payload).encode('utf-8'),
        headers=headers,
        method='POST'
    )

    try:
        with urllib.request.urlopen(req) as resp:
            res_json = json.loads(resp.read().decode('utf-8'))
            rows = res_json['results'][0]['response']['result']['rows']

            if len(rows) > 0:
                article_id = rows[0][0]['value']
                log_print(f"[+] Found existing article (ID: {article_id}). Executing UPDATE query...")

                update_sql = """
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
                """
                update_args = [
                    {"type": "text", "value": title},
                    {"type": "text", "value": excerpt},
                    {"type": "text", "value": content},
                    {"type": "text", "value": category},
                    {"type": "text", "value": image},
                    {"type": "text", "value": author},
                    {"type": "integer", "value": str(now_ms)},
                    {"type": "text", "value": title},
                    {"type": "text", "value": excerpt},
                    {"type": "text", "value": draft.get("keywords", category.lower())},
                    {"type": "integer", "value": str(reading_time)},
                    {"type": "text", "value": draft.get("og_image", image)},
                    {"type": "text", "value": draft.get("twitter_image", image)},
                    {"type": "text", "value": author},
                    {"type": "text", "value": slug}
                ]

                update_payload = {
                    "requests": [
                        {
                            "type": "execute",
                            "stmt": {
                                "sql": update_sql,
                                "args": update_args
                            }
                        },
                        {"type": "close"}
                    ]
                }

                up_req = urllib.request.Request(
                    pipeline_url,
                    data=json.dumps(update_payload).encode('utf-8'),
                    headers=headers,
                    method='POST'
                )
                with urllib.request.urlopen(up_req) as up_resp:
                    log_print(f"[+] SUCCESS: Live article '{title}' successfully updated on Turso DB!")
            else:
                log_print(f"[*] Article slug '{slug}' not found. Executing INSERT query...")
                new_id = f"art_{now_ms}"

                insert_sql = """
                INSERT INTO articles (
                    id, title, slug, excerpt, content, category, image, author,
                    published_at, created_at, updated_at, featured, status,
                    meta_title, meta_description, keywords, reading_time, views,
                    tags, content_type, viral_score, source_name, source_url,
                    views_7d, views_30d, og_image, twitter_image, published_by,
                    research_ref, metadata
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """

                insert_args = [
                    {"type": "text", "value": new_id},
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
                    {"type": "integer", "value": "1" if draft.get("featured") else "0"},
                    {"type": "text", "value": "published"},
                    {"type": "text", "value": title},
                    {"type": "text", "value": excerpt},
                    {"type": "text", "value": draft.get("keywords", category.lower())},
                    {"type": "integer", "value": str(reading_time)},
                    {"type": "integer", "value": "0"},
                    {"type": "text", "value": draft.get("tags", "")},
                    {"type": "text", "value": draft.get("content_type", "news")},
                    {"type": "integer", "value": str(draft.get("viral_score", 0))},
                    {"type": "text", "value": draft.get("source_name", "")},
                    {"type": "text", "value": draft.get("source_url", "")},
                    {"type": "integer", "value": "0"},
                    {"type": "integer", "value": "0"},
                    {"type": "text", "value": draft.get("og_image", image)},
                    {"type": "text", "value": draft.get("twitter_image", image)},
                    {"type": "text", "value": author},
                    {"type": "text", "value": draft.get("research_ref", "")},
                    {"type": "text", "value": draft.get("metadata", "")}
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

                in_req = urllib.request.Request(
                    pipeline_url,
                    data=json.dumps(insert_payload).encode('utf-8'),
                    headers=headers,
                    method='POST'
                )
                with urllib.request.urlopen(in_req) as in_resp:
                    log_print(f"[+] SUCCESS: Live article '{title}' successfully published to Turso DB!")

    except Exception as e:
        log_print(f"[!] Database execution error: {e}")

    # Write log file
    log_out = os.path.join(os.path.dirname(__file__), '..', 'publish_result.txt')
    with open(log_out, 'w', encoding='utf-8') as f:
        f.write("\n".join(log))

if __name__ == "__main__":
    main()
