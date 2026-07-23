import urllib.request
import ssl
import json
import traceback

f = open(r"e:\brandapp\kampusfilter\schema_dump.txt", "w", encoding="utf-8")
f.write("=== START ===\n")
f.flush()

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

TURSO_URL = 'https://kampusdb-theaskt.aws-ap-south-1.turso.io/v2/pipeline'
TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODM3NDY3MTYsImlkIjoiMDE5ZjQ2YTAtNzYwMS03NzY4LWEzZTgtOGZmMTg5YzFhOGJlIiwia2lkIjoiX1NrZXd2aHdlVmI1TE94YUVqN19ySTVJeWk1ai10OEl0NkZhblIwMTJMNCIsInJpZCI6IjVjNTdmZjEyLWIzYTUtNDM3NS04OGExLTA4MGEzODVhYmNhMiJ9.F0Jb2wEUKy2oRbsmZptfr7lkfe6x-EVw0nrHvZa3T3YK7e0U9FCyPScxk9FlXgKKZYina9XI5sEsrMysfCg5Bg'

def query(sql):
    payload = json.dumps({'requests': [{'type': 'execute', 'stmt': {'sql': sql}}]}).encode('utf-8')
    req = urllib.request.Request(TURSO_URL, data=payload, headers={'Authorization': f'Bearer {TURSO_TOKEN}', 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, context=ctx) as resp:
        return json.loads(resp.read().decode('utf-8'))

try:
    f.write("Querying PRAGMA table_info...\n")
    f.flush()
    res = query('PRAGMA table_info(articles)')
    f.write(json.dumps(res, indent=2) + "\n")
    f.flush()
except Exception as e:
    f.write("Error PRAGMA: " + str(e) + "\n" + traceback.format_exc() + "\n")
    f.flush()

try:
    f.write("Querying Drizzle SELECT...\n")
    f.flush()
    drizzle_sql = "SELECT id, title, slug, excerpt, content, category, image, author, published_at, created_at, updated_at, featured, status, meta_title, meta_description, keywords, reading_time, views, tags, content_type, viral_score, source_name, source_url, views_7d, views_30d, last_viewed_at, og_image, twitter_image, published_by, research_ref, metadata FROM articles WHERE slug = 'du-csas-ug-2026-round-2-seat-allocation-on-july-25-fee-deadline-july-28' LIMIT 1"
    res2 = query(drizzle_sql)
    f.write(json.dumps(res2, indent=2) + "\n")
    f.flush()
except Exception as e:
    f.write("Error SELECT: " + str(e) + "\n" + traceback.format_exc() + "\n")
    f.flush()

f.close()
