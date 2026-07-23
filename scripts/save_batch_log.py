import subprocess

res = subprocess.run("node scripts/batch_publish.js", cwd=r"e:\brandapp\kampusfilter", shell=True, capture_output=True, text=True)
with open(r"e:\brandapp\kampusfilter\batch_run_output.txt", "w", encoding="utf-8") as f:
    f.write("=== STDOUT ===\n" + res.stdout + "\n=== STDERR ===\n" + res.stderr + f"\n=== EXIT CODE: {res.returncode} ===")
