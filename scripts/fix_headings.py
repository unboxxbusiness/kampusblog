import os
import re
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
    db_url = os.environ.get('TURSO_CONNECTION_URL', '')
    db_token = os.environ.get('TURSO_AUTH_TOKEN', '')

    if not db_url:
        print('Error: TURSO_CONNECTION_URL is missing')
        return

    # Convert libsql:// to https:// for urllib
    http_url = db_url.replace('libsql://', 'https://')
    pipeline_url = f"{http_url}/v2/pipeline"

    # SQLite replace SQL statement
    sql_query = "UPDATE articles SET content = replace(replace(content, '<h2>## ', '<h2>'), '<h3>### ', '<h3>') WHERE slug = 'isro-ursc-research-internship-2026-complete-guide-eligibility'"

    payload = {
        "requests": [
            {
                "type": "execute",
                "stmt": {
                    "sql": sql_query
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
            print('Successfully executed HTTP REST update pipeline!')
            print(res_body)
    except Exception as e:
        print(f"Error executing HTTP request: {e}")

if __name__ == '__main__':
    main()
