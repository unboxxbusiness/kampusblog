import subprocess
import os

cwd = r"e:\brandapp\kampusfilter"
cmd = "node scripts/batch_publish.js"

print(f"Executing '{cmd}' in {cwd}...")
try:
    result = subprocess.run(
        cmd,
        cwd=cwd,
        shell=True,
        capture_output=True,
        text=True,
        timeout=60
    )
    print("--- STDOUT ---")
    print(result.stdout)
    print("--- STDERR ---")
    print(result.stderr)
    print(f"--- EXIT CODE: {result.returncode} ---")
except Exception as e:
    print(f"--- ERROR: {e} ---")
