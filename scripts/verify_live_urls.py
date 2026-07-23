import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

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

print("=== CHECKING NETLIFY LIVE HTTP STATUS FOR ALL 10 ARTICLES ===")
success = 0
for idx, slug in enumerate(SLUGS, 1):
    url = f"https://kampusfilter.com/articles/{slug}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, context=ctx) as resp:
            status = resp.status
            print(f"{idx}. [{status} OK] {url}")
            success += 1
    except urllib.error.HTTPError as e:
        print(f"{idx}. [{e.code} ERROR] {url}")
    except Exception as e:
        print(f"{idx}. [FETCH ERR: {e}] {url}")

print(f"\nSTATUS REPORT: {success}/{len(SLUGS)} URLs are LIVE (200 OK)")
