import os
import json
import urllib.request

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

db_url = os.environ.get('TURSO_CONNECTION_URL', '')
db_token = os.environ.get('TURSO_AUTH_TOKEN', '')
http_url = db_url.replace('libsql://', 'https://')
pipeline_url = f"{http_url}/v2/pipeline"
headers = {
    "Authorization": f"Bearer {db_token}",
    "Content-Type": "application/json"
}

slug = "unesco-coursera-launch-free-global-ai-ethics-course"

payload = {
    "requests": [
        {
            "type": "execute",
            "stmt": {
                "sql": "SELECT id, title, slug, category, published_at FROM articles WHERE slug = ?",
                "args": [{"type": "text", "value": slug}]
            }
        },
        {"type": "close"}
    ]
}

req = urllib.request.Request(
    pipeline_url,
    data=json.dumps(payload).encode('utf-8'),
    headers=headers,
    method='POST'
)

out_file = os.path.join(os.path.dirname(__file__), '..', 'verify_output.txt')

try:
    with urllib.request.urlopen(req) as resp:
        res_json = json.loads(resp.read().decode('utf-8'))
        rows = res_json['results'][0]['response']['result']['rows']
        if len(rows) > 0:
            row = rows[0]
            res_str = f"SUCCESS: Article found in DB!\nID: {row[0]['value']}\nTitle: {row[1]['value']}\nSlug: {row[2]['value']}\nCategory: {row[3]['value']}"
        else:
            res_str = f"FAILED: Article with slug '{slug}' not found in DB."
        with open(out_file, 'w', encoding='utf-8') as f:
            f.write(res_str)
except Exception as e:
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(f"ERROR: {e}")
