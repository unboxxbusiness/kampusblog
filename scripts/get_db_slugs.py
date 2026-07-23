import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://kampusdb-theaskt.aws-ap-south-1.turso.io/v2/pipeline'
token = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODM3NDY3MTYsImlkIjoiMDE5ZjQ2YTAtNzYwMS03NzY4LWEzZTgtOGZmMTg5YzFhOGJlIiwia2lkIjoiX1NrZXd2aHdlVmI1TE94YUVqN19ySTVJeWk1ai10OEl0NkZhblIwMTJMNCIsInJpZCI6IjVjNTdmZjEyLWIzYTUtNDM3NS04OGExLTA4MGEzODVhYmNhMiJ9.F0Jb2wEUKy2oRbsmZptfr7lkfe6x-EVw0nrHvZa3T3YK7e0U9FCyPScxk9FlXgKKZYina9XI5sEsrMysfCg5Bg'

req = urllib.request.Request(url, 
    data=json.dumps({'requests': [{'type': 'execute', 'stmt': {'sql': 'SELECT slug, category, title, status FROM articles ORDER BY publishedAt DESC'}}]}).encode('utf-8'),
    headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req, context=ctx) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        rows = res['results'][0]['response']['result']['rows']
        print(f"TOTAL_DB_ARTICLES={len(rows)}")
        for r in rows:
            print(f"SLUG={r[0]['value']} | STATUS={r[3]['value']} | CAT={r[1]['value']}")
except Exception as e:
    print(f"DB_ERROR={e}")
