#!/usr/bin/env python3
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

def send_log(msg):
    try:
        req = urllib.request.Request(
            "https://kampusfilter.com/api/receive-log",
            data=json.dumps({"log": msg}).encode('utf-8'),
            headers={"Content-Type": "application/json"},
            method='POST'
        )
        with urllib.request.urlopen(req) as resp:
            pass
    except Exception as e:
        pass

def main():
    db_url = os.environ.get('TURSO_CONNECTION_URL', '')
    db_token = os.environ.get('TURSO_AUTH_TOKEN', '')
    if not db_url or not db_token:
        send_log("ERROR: missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN")
        return

    http_url = db_url.replace('libsql://', 'https://')
    pipeline_url = f"{http_url}/v2/pipeline"
    headers = {
        "Authorization": f"Bearer {db_token}",
        "Content-Type": "application/json"
    }

    report_lines = []
    report_lines.append(f"DB URL: {db_url}")

    # Query 1: Group by status
    q1 = {
        "requests": [
            {
                "type": "execute",
                "stmt": {
                    "sql": "SELECT status, count(*) FROM articles GROUP BY status",
                    "args": []
                }
            },
            {"type": "close"}
        ]
    }
    req1 = urllib.request.Request(pipeline_url, data=json.dumps(q1).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req1) as resp:
            res_json = json.loads(resp.read().decode('utf-8'))
            rows = res_json['results'][0]['response']['result']['rows']
            report_lines.append("\n--- Status Counts ---")
            for r in rows:
                report_lines.append(f"Status: {r[0]['value']} | Count: {r[1]['value']}")
    except Exception as e:
        report_lines.append(f"Q1 Error: {e}")

    # Query 2: Check DU CSAS slug specifically
    slug_to_check = 'du-csas-ug-2026-round-2-seat-allocation-on-july-25-fee-deadline-july-28'
    q2 = {
        "requests": [
            {
                "type": "execute",
                "stmt": {
                    "sql": "SELECT id, title, status, published_at FROM articles WHERE slug = ?",
                    "args": [{"type": "text", "value": slug_to_check}]
                }
            },
            {"type": "close"}
        ]
    }
    req2 = urllib.request.Request(pipeline_url, data=json.dumps(q2).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req2) as resp:
            res_json = json.loads(resp.read().decode('utf-8'))
            rows = res_json['results'][0]['response']['result']['rows']
            report_lines.append(f"\n--- Check Slug '{slug_to_check}' ---")
            if len(rows) == 0:
                report_lines.append("Slug NOT FOUND in database!")
            else:
                for r in rows:
                    report_lines.append(f"Found: ID={r[0]['value']}, Title='{r[1]['value']}', Status={r[2]['value']}, PubAt={r[3]['value']}")
    except Exception as e:
        report_lines.append(f"Q2 Error: {e}")

    # Query 3: Top 15 published articles
    q3 = {
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
    req3 = urllib.request.Request(pipeline_url, data=json.dumps(q3).encode('utf-8'), headers=headers, method='POST')
    try:
        with urllib.request.urlopen(req3) as resp:
            res_json = json.loads(resp.read().decode('utf-8'))
            rows = res_json['results'][0]['response']['result']['rows']
            report_lines.append("\n--- Top 15 Published Articles (DESC published_at) ---")
            for r in rows:
                report_lines.append(f"- {r[0]['value']} (pubAt={r[2]['value']})")
    except Exception as e:
        report_lines.append(f"Q3 Error: {e}")

    full_report = "\n".join(report_lines)
    send_log(full_report)

if __name__ == '__main__':
    main()
