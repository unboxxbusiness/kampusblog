import os, sys, json, urllib.request

def load_env(env_path):
    env = {}
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                if '=' in line and not line.strip().startswith('#'):
                    k, v = line.strip().split('=', 1)
                    env[k] = v.strip('"\'')
    return env

def clean_kampus_courses():
    env = load_env('.env.local')
    db_url = env.get('TURSO_CONNECTION_URL', env.get('TURSO_DATABASE_URL', '')).replace('libsql://', 'https://')
    token = env.get('TURSO_AUTH_TOKEN', '')

    if not db_url or not token:
        print("[!] Missing Turso credentials in Kampus Filter .env.local")
        return

    pipeline_url = f"{db_url}/v2/pipeline"
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }

    # Query existing course articles
    check_payload = {
        "requests": [
            {
                "type": "execute",
                "stmt": {
                    "sql": "SELECT id, title, category, content_type FROM articles WHERE category = 'Course' OR content_type = 'course'"
                }
            }
        ]
    }

    req = urllib.request.Request(pipeline_url, data=json.dumps(check_payload).encode('utf-8'), headers=headers, method='POST')
    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        rows = res['results'][0]['response']['result']['rows']
        print(f"[*] Found {len(rows)} course rows in Kampus Filter Turso DB.")

        if len(rows) == 0:
            print("[+] Kampus Filter DB is already 100% clean of course articles!")
            return

        # Execute DELETE query
        delete_payload = {
            "requests": [
                {
                    "type": "execute",
                    "stmt": {
                        "sql": "DELETE FROM articles WHERE category = 'Course' OR content_type = 'course'"
                    }
                }
            ]
        }

        del_req = urllib.request.Request(pipeline_url, data=json.dumps(delete_payload).encode('utf-8'), headers=headers, method='POST')
        with urllib.request.urlopen(del_req) as del_resp:
            del_res = json.loads(del_resp.read().decode('utf-8'))
            affected = del_res['results'][0]['response']['result'].get('affected_row_count', len(rows))
            print(f"[+] Successfully deleted {affected} course articles from Kampus Filter Turso DB!")

if __name__ == '__main__':
    clean_kampus_courses()
