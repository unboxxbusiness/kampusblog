import urllib.request
import ssl
import subprocess
import json
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

out = []

# 1. Git info
out.append("=== GIT INFO ===")
try:
    status = subprocess.check_output(["git", "status"], cwd=r"e:\brandapp\kampusfilter", text=True)
    log = subprocess.check_output(["git", "log", "-n", "3"], cwd=r"e:\brandapp\kampusfilter", text=True)
    out.append("STATUS:\n" + status)
    out.append("LOG:\n" + log)
except Exception as e:
    out.append(f"Git error: {e}")

# 2. Turso DB Slugs
out.append("\n=== TURSO DB SLUGS ===")
TURSO_URL = 'https://kampusdb-theaskt.aws-ap-south-1.turso.io/v2/pipeline'
TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODM3NDY3MTYsImlkIjoiMDE5ZjQ2YTAtNzYwMS03NzY4LWEzZTgtOGZmMTg5YzFhOGJlIiwia2lkIjoiX1NrZXd2aHdlVmI1TE94YUVqN19ySTVJeWk1ai10OEl0NkZhblIwMTJMNCIsInJpZCI6IjVjNTdmZjEyLWIzYTUtNDM3NS04OGExLTA4MGEzODVhYmNhMiJ9.F0Jb2wEUKy2oRbsmZptfr7lkfe6x-EVw0nrHvZa3T3YK7e0U9FCyPScxk9FlXgKKZYina9XI5sEsrMysfCg5Bg'
try:
    payload = json.dumps({'requests': [{'type': 'execute', 'stmt': {'sql': 'SELECT slug, category, status FROM articles ORDER BY publishedAt DESC LIMIT 15'}}]}).encode('utf-8')
    req = urllib.request.Request(TURSO_URL, data=payload, headers={'Authorization': f'Bearer {TURSO_TOKEN}', 'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, context=ctx) as resp:
        res = json.loads(resp.read().decode('utf-8'))
        rows = res['results'][0]['response']['result']['rows']
        out.append(f"Total rows fetched: {len(rows)}")
        for r in rows:
            out.append(f"  slug: {r[0]['value']} ({r[1]['value']}, status: {r[2]['value']})")
except Exception as e:
    out.append(f"Turso error: {e}")

# 3. Live URL check
out.append("\n=== LIVE NETLIFY URL STATUS ===")
SLUGS = [
    "du-csas-ug-2026-round-2-seat-allocation-on-july-25-fee-deadline-july-28",
    "bitsat-2026-iteration-iv-allotment-out-today-fee-deadline-july-25-classes-start-august-2",
    "rhodes-scholarship-2027-india-fully-funded-oxford-apply-by-july-23",
    "pm-internship-scheme-2026-9000month-stipend-insurance-at-indias-top-500-companies",
    "niti-aayog-internship-2026-how-to-apply-in-august-window-open-aug-1-10",
    "world-bank-group-pioneers-internship-2026-paid-global-programme-apply-by-august-12",
    "ugc-mandates-swayam-moocs-in-colleges-cabinet-approves-unified-education-regulator-2026",
    "nta-reforms-2026-no-score-normalization-for-cuet-computer-adaptive-testing-coming",
    "gcc-hiring-boom-2026-8-18-lpa-for-ai-skilled-freshers-what-you-must-know",
    "get-14500-back-for-learning-ai-nasscom-futureskills-prime-free-google-microsoft-certifications-2026"
]
for idx, slug in enumerate(SLUGS, 1):
    url = f"https://kampusfilter.com/articles/{slug}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, context=ctx) as resp:
            out.append(f"{idx}. [200 OK] {url}")
    except urllib.error.HTTPError as e:
        out.append(f"{idx}. [{e.code} ERROR] {url}")
    except Exception as e:
        out.append(f"{idx}. [ERR: {e}] {url}")

output_path = r"e:\brandapp\kampusfilter\debug_info_output.txt"
with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(out))
