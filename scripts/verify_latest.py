import os, json, urllib.request

def main():
    env_path = os.path.join(os.getcwd(), '.env.local')
    env = {}
    with open(env_path, 'r') as f:
        for line in f:
            if '=' in line and not line.strip().startswith('#'):
                k, v = line.strip().split('=', 1)
                env[k] = v.strip('"\'')
    
    url = env['TURSO_CONNECTION_URL'].replace('libsql://', 'https://')
    req = urllib.request.Request(
        url + '/v2/pipeline',
        data=json.dumps({
            "requests": [
                {
                    "type": "execute",
                    "stmt": {
                        "sql": "SELECT title, slug FROM articles ORDER BY created_at DESC LIMIT 3"
                    }
                },
                {"type": "close"}
            ]
        }).encode('utf-8'),
        headers={'Authorization': 'Bearer ' + env['TURSO_AUTH_TOKEN']}
    )
    
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())
        rows = data['results'][0]['response']['result']['rows']
        print("LATEST ARTICLES IN TURSO DB:")
        for row in rows:
            print(f"- {row[0]['value']} (Slug: {row[1]['value']})")

if __name__ == '__main__':
    main()
