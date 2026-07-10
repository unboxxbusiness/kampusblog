import shutil
import os

source = r"C:\Users\Admin\.gemini\antigravity\brain\3fac9e3c-51dd-4344-a291-4b096750be3c\theaskt_logo_1783576008747.png"
destinations = [
    r"e:\brandapp\theaskt\app\favicon.ico",
    r"e:\brandapp\theaskt\public\favicon.ico",
    r"e:\brandapp\theaskt\app\icon.png",
    r"e:\brandapp\theaskt\public\icon-192.png",
    r"e:\brandapp\theaskt\public\icon-512.png",
    r"e:\brandapp\theaskt\public\icon-maskable.png"
]

print(f"Checking source: {source} -> {os.path.exists(source)}")

for dest in destinations:
    try:
        # Create directories if they don't exist
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.copy(source, dest)
        print(f"Success: Copied to {dest} (Size: {os.path.getsize(dest)} bytes)")
    except Exception as e:
        print(f"Error copying to {dest}: {e}")
