# Push these deployment fixes to GitHub

The deployment fixes are already applied in this folder. To get them onto https://github.com/errthdesigns/shot-in-the-dark-v1:

## Option A – You already have the repo cloned

1. Open Terminal and go to your **clone** of `shot-in-the-dark-v1` (not this upload-to-github folder).
2. Copy the **updated files** from this folder into the clone (overwrite):
   - `src/styles/tailwind.css`
   - `src/styles/index.css`
   - `vite.config.ts`
   - `DEPLOY.md`
3. In the clone folder:
   ```bash
   git add src/styles/tailwind.css src/styles/index.css vite.config.ts DEPLOY.md
   git commit -m "Fix Vercel build (tw-animate-css) and GitHub Pages base path"
   git push origin main
   ```

## Option B – Use this folder as the repo

If this `upload-to-github` folder is the one connected to the GitHub repo:

1. In Terminal:
   ```bash
   cd "/Users/erin.thomson/Documents/Droga5 Projects/Diageo/Prototype/Diageo Prototype/upload-to-github"
   git add src/styles/tailwind.css src/styles/index.css vite.config.ts DEPLOY.md
   git status
   git commit -m "Fix Vercel build (tw-animate-css) and GitHub Pages base path"
   git push origin main
   ```

If `git push` asks for login, use your GitHub username and a **Personal Access Token** (not your password) for the password field.
