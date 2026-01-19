# Portfolio Overview

This repository contains a personal portfolio built with **Next.js 14**, **React 18**, **TypeScript**, and **Tailwind CSS**. It showcases projects, skills, certifications, and contact options, plus standalone demo/download pages for featured apps.

## What’s Included
- Live site: https://portfolio-nextjs-three-sepia.vercel.app/homepage
- Homepage with hero, stats, resume download, and featured projects (4 shown on home; full list on `/projects-showcase`)
- Project cards for:
  - Auto Matcher (demo at `/demo.html`)
  - Charge Spotter (download/QR page at `/charge-spotter-download.html`)
  - Web Security Hub
  - Weather Atmosphere
  - Celebrity Image Classifier
  - Chat App
  - YouTube Dual Subtitle
- About section with tech stack and certifications
- Contact CTA that opens the default mail client to `akiyamatakuro0212@gmail.com`
- Static assets in `public/assets/images/`
- Resume files: `public/TakuroAkiyama-resume1.pdf` (current), `public/TakuroAkiyama-resume.pdf` (legacy)

## Top 5 Skills Used (also visible in the Skills section)
- Next.js (App Router, SSR/SSG)
- React 18 + TypeScript
- Tailwind CSS (responsive UI)
- Node.js / Express-style backend patterns
- API integration & deployment (Vercel/Netlify)

## Quick Start
1) Install
```bash
npm install
# or
yarn install
```
2) Run dev server
```bash
npm run dev
```
Open http://localhost:4028
3) Production build & serve locally
```bash
npm run build
npm run start   # serves on http://localhost:3000 by default
```
4) Static demo pages (dev server running)
- Auto Matcher demo: http://localhost:4028/demo.html
- Charge Spotter download: http://localhost:4028/charge-spotter-download.html

## Deployment
- **Vercel (recommended):** Import the GitHub repo → auto-detect Next.js → Deploy. A live URL like `https://*.vercel.app` will be issued.
- **Netlify:** Build command `npm run build`, publish directory `.next` (a `netlify.toml` is included).

## Tech Stack
- Frameworks: Next.js, React, TypeScript
- Styling: Tailwind CSS
- Images: `src/components/ui/AppImage` wraps Next/Image with fallback support
- Routing: App Router (`src/app`), static HTML under `public/`

## Scripts
- `npm run dev` — start dev server (4028)
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` / `npm run lint:fix` — ESLint
- `npm run format` — Prettier

## Notes
- Keep static assets in `public/assets/images/`.
- Update resume downloads by replacing `public/TakuroAkiyama-resume1.pdf` and ensuring any download links reference that filename.