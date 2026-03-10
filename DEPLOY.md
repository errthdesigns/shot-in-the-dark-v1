# Deploying Shot In The Dark

## Vercel
Connect the repo and deploy. The build uses a direct `tw-animate-css` import so the Tailwind plugin no longer fails with "Can't resolve 'tw-anima'".

## GitHub Pages
Pages serves from a subpath: `https://errthdesigns.github.io/shot-in-the-dark-v1/`

**Set the base path when building** so assets load:
- **Environment variable:** `VITE_BASE_PATH=/shot-in-the-dark-v1/`
- Then run `npm run build` and deploy the `dist/` folder (e.g. to `gh-pages` branch or via GitHub Actions).

Build locally for GitHub Pages:
```bash
VITE_BASE_PATH=/shot-in-the-dark-v1/ npm run build
```
Then deploy the contents of `dist/` (e.g. `npx gh-pages -d dist` or push to your Pages branch).
