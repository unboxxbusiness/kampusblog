import subprocess
import os
import time

cwd = "e:\\brandapp\\kampusfilter"
cmd = "node C:\\Users\\Admin\\.gemini\\antigravity\\brain\\3fac9e3c-51dd-4344-a291-4b096750be3c\\scratch\\inspect_articles.js"

print(f"Executing '{cmd}'...")
try:
    result = subprocess.run(
        cmd,
        shell=True,
        capture_output=True,
        text=True,
        timeout=30
    )
    # Write output to a file so we can view it
    with open("scripts/inspect_result.txt", "w", encoding="utf-8") as f:
        f.write("--- STDOUT ---\n")
        f.write(result.stdout)
        f.write("\n--- STDERR ---\n")
        f.write(result.stderr)
        f.write(f"\n--- EXIT CODE: {result.returncode} ---\n")
    print("Saved inspection log successfully!")
except Exception as e:
    print(f"--- ERROR: {e} ---")

time.sleep(3.0)
