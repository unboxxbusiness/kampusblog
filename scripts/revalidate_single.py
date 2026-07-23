import os, urllib.request, urllib.parse, json

def main():
    env_path = os.path.join(os.getcwd(), '.env.local')
    env = {}
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if '=' in line and not line.strip().startswith('#'):
                    k, v = line.strip().split('=', 1)
                    env[k] = v.strip('"\'')
    
    api_key = env.get('KAMPUSFILTER_API_KEY', '')
    base_url = 'https://kampusfilter.com'
    
    slug = 'national-overseas-scholarship-scheme-2026-fully-funded-masters-phd-abroad'
    category = 'scholarships'
    
    payload = json.dumps({"slug": slug, "category": category}).encode('utf-8')
    
    try:
        req = urllib.request.Request(
            f"{base_url}/api/revalidate",
            data=payload,
            headers={'x-api-key': api_key, 'Content-Type': 'application/json'},
            method='POST'
        )
        with urllib.request.urlopen(req) as resp:
            print(f"[+] Revalidated Home, Category, and Article - Status: {resp.status}")
    except Exception as e:
        print(f"[!] Failed to revalidate: {e}")

if __name__ == '__main__':
    main()
