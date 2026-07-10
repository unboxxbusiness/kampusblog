import subprocess
import os
import time

cwd = "e:\\brandapp\\kampusfilter"
cmd = "pnpm publish-article"

print(f"Executing '{cmd}' in {cwd}...")
try:
    result = subprocess.run(
        cmd,
        cwd=cwd,
        shell=True,
        capture_output=True,
        text=True,
        timeout=30
    )
    print("--- STDOUT ---")
    print(result.stdout)
    print("--- STDERR ---")
    print(result.stderr)
    print(f"--- EXIT CODE: {result.returncode} ---")
except Exception as e:
    print(f"--- ERROR: {e} ---")

# Sleep to force it to run in the background
time.sleep(3.0)
