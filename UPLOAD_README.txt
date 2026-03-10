SHOT IN THE DARK – upload to GitHub (under 100 files)
=====================================================

BEFORE YOU UPLOAD THIS FOLDER:
This folder is INCOMPLETE on purpose (so it stays small). You must run ONE command first to copy in the rest of the essential files (the 6 screen components, video, package-lock, SVG files). Then you’ll have under 30 files total – safe for GitHub drag-and-drop.

1. Open Terminal.
2. Go to your main project folder (the one that contains "upload-to-github" and "prepare-upload.py"):
   cd "/Users/erin.thomson/Documents/Droga5 Projects/Diageo/Prototype/Diageo Prototype"
3. Run:
   python3 prepare-upload.py
4. You should see: "Done. ... has XX files (under 100)."
5. Now drag the entire "upload-to-github" folder to your GitHub repo (https://github.com/errthdesigns/shot-in-the-dark-v1) – use “uploading an existing file” and drag the folder or its contents.

AFTER UPLOADING:
- Clone the repo (or download).
- In the folder:  npm install
- Run:  npm run dev
- Open http://localhost:5173
- Optional: add image PNGs to src/assets from your full project (see src/assets/ASSETS_NEEDED.md).
