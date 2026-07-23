import os, shutil

skill_path = os.path.join(os.getcwd(), '.agents', 'skills', 'write_course_series')
if os.path.exists(skill_path):
    shutil.rmtree(skill_path)
    print(f"[+] Removed course series skill folder from Kampus Filter: {skill_path}")
else:
    print("[+] No write_course_series skill folder found in Kampus Filter.")
