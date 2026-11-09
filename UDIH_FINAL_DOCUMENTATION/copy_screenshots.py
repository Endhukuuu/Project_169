import shutil
import os
from PIL import Image

src_files = {
    "screenshot_login.png": r"C:\Users\arell\.gemini\antigravity\brain\a3ab9489-61e1-4785-b7f6-aeb27e2741f1\.user_uploaded\media_1794027871486_db2f76ee.jpg",
    "screenshot_analyzing.png": r"C:\Users\arell\.gemini\antigravity\brain\a3ab9489-61e1-4785-b7f6-aeb27e2741f1\.user_uploaded\media_1794027871463_95a5718b.png",
    "screenshot_architecture.png": r"C:\Users\arell\.gemini\antigravity\brain\a3ab9489-61e1-4785-b7f6-aeb27e2741f1\.user_uploaded\media_1794027871467_971d9bcd.png",
    "screenshot_overview.png": r"C:\Users\arell\.gemini\antigravity\brain\a3ab9489-61e1-4785-b7f6-aeb27e2741f1\.user_uploaded\media_1794027871533_6908f9f4.jpg",
    "screenshot_analytics.png": r"C:\Users\arell\.gemini\antigravity\brain\a3ab9489-61e1-4785-b7f6-aeb27e2741f1\.user_uploaded\media_1794027901205_379d68d0.png",
    "screenshot_settings.png": r"C:\Users\arell\.gemini\antigravity\brain\a3ab9489-61e1-4785-b7f6-aeb27e2741f1\.user_uploaded\media_1794028309700_aca1f4a0.png"
}

dest_dir = r"D:\Capstone\Project-169\UDIH_FINAL_DOCUMENTATION"

for name, src in src_files.items():
    dest_path = os.path.join(dest_dir, name)
    # Open and convert to PNG if needed, maintaining quality
    try:
        im = Image.open(src)
        im.save(dest_path, "PNG")
        print(f"Copied & converted: {name} (Size: {im.size})")
    except Exception as e:
        print(f"Error copying {name}: {e}")
