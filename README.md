# 🇳🇬 Naija Hustle

Naija Hustle is a self-contained Nigerian business/tycoon game built with React + Vite.

## GitHub Pages — IMPORTANT

Do **not** publish the repository using **Settings → Pages → Deploy from a branch**. That would serve the raw JSX source and can result in a white screen.

Use **GitHub Actions**:

1. Push this repository to GitHub on the `main` branch.
2. Open **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Push a new commit or manually run **Actions → Deploy Naija Hustle to GitHub Pages → Run workflow**.
5. Wait for the green workflow run.
6. Open the Pages URL shown by GitHub.

The workflow runs `npm install`, `npm run build`, and deploys the generated `dist` folder.

## Local

```bash
npm install
npm run dev
npm run build
```

## Independence

The core game does not require AppDeploy, ChatGPT, an AI API, or an external database. Game state is stored locally in the browser. Optional online services can be added later.

## Included

- Nigerian business economy and upgrades
- Separate bank accounts and transfer UI
- Properties and rental income
- Vehicle garage and operating costs
- Daily simulation and random events
- XP, levels, reputation and missions
- Net-worth tracking and transactions
- Local autosave + save export/import
- Mobile-first responsive interface
- Self-contained SVG visual assets
