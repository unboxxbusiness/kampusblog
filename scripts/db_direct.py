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

def main():
    log_path = os.path.join(os.path.dirname(__file__), '..', 'db_exact.txt')
    log = ""

    db_url = os.environ.get('TURSO_CONNECTION_URL', '')
    db_token = os.environ.get('TURSO_AUTH_TOKEN', '')

    if not db_url:
        with open(log_path, 'w', encoding='utf-8') as f:
            f.write("Error: TURSO_CONNECTION_URL is missing")
        return

    http_url = db_url.replace('libsql://', 'https://')
    pipeline_url = f"{http_url}/v2/pipeline"

    # Query content
    payload = {
        "requests": [
            {
                "type": "execute",
                "stmt": {
                    "sql": "SELECT content FROM articles WHERE slug = 'isro-ursc-research-internship-2026-complete-guide-eligibility'"
                }
            },
            {
                "type": "close"
            }
        ]
    }

    headers = {
        "Authorization": f"Bearer {db_token}",
        "Content-Type": "application/json"
    }

    try:
        req = urllib.request.Request(
            pipeline_url,
            data=json.dumps(payload).encode('utf-8'),
            headers=headers,
            method='POST'
        )
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            res_json = json.loads(res_body)
            rows = res_json['results'][0]['response']['result']['rows']
            
            if len(rows) > 0:
                content = rows[0][0]['value']
                log += f"Original content snippet: {content[:300]}\n"
                
                # Perform the cleanup in python
                cleaned = content.replace("<h2>## ", "<h2>").replace("<h2>##", "<h2>")
                cleaned = cleaned.replace("<h3>### ", "<h3>").replace("<h3>###", "<h3>")
                
                log += f"Cleaned content snippet: {cleaned[:300]}\n"
                
                # Update database
                update_payload = {
                    "requests": [
                        {
                            "type": "execute",
                            "stmt": {
                                "sql": "UPDATE articles SET content = ? WHERE slug = ?",
                                "args": [
                                    {"type": "text", "value": cleaned},
                                    {"type": "text", "value": "isro-ursc-research-internship-2026-complete-guide-eligibility"}
                                ]
                            }
                        },
                        {
                            "type": "close"
                        }
                    ]
                }
                
                update_req = urllib.request.Request(
                    pipeline_url,
                    data=json.dumps(update_payload).encode('utf-8'),
                    headers=headers,
                    method='POST'
                )
                with urllib.request.urlopen(update_req) as update_res:
                    update_body = update_res.read().decode('utf-8')
                    log += f"Update Response: {update_body}\n"
            else:
                log += "No article found in database\n"
    except Exception as e:
        log += f"Error: {e}\n"

    with open(log_path, 'w', encoding='utf-8') as f:
        f.write(log)

if __name__ == '__main__':
    main()
