# Next.js

A modern Next.js 14 application built with TypeScript and Tailwind CSS.

## 🚀 Features

- **Next.js 14** - Latest version with improved performance and features
- **React 18** - Latest React version with enhanced capabilities
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn


## 🛠️ Installation

1. Install dependencies:
  ```bash
  npm install
  # or
  yarn install
  ```

2. Start the development server:
  ```bash
  npm run dev
  # or
  yarn dev
  ```
3. Open [http://localhost:4028](http://localhost:4028) with your browser to see the result.

## 📁 Project Structure

```
nextjs-js-tailwind/
├── public/             # Static assets
├── src/
│   ├── app/            # App router components
│   │   ├── layout.tsx  # Root layout component
│   │   └── page.tsx    # Main page component
│   ├── components/     # Reusable UI components
│   ├── styles/         # Global styles and Tailwind configuration
├── next.config.mjs     # Next.js configuration
├── package.json        # Project dependencies and scripts
├── postcss.config.js   # PostCSS configuration
└── tailwind.config.js  # Tailwind CSS configuration

```

## 🧩 Page Editing

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## 🎨 Styling

This project uses Tailwind CSS for styling with the following features:
- Utility-first approach for rapid development
- Custom theme configuration
- Responsive design utilities
- PostCSS and Autoprefixer integration

## 📦 Available Scripts

- `npm run dev` - Start development server on port 4028
- `npm run build` - Build the application for production
- `npm run start` - Start the development server
- `npm run serve` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

## 📱 Deployment

### 公開URL（他の人がアクセスできるURL）を作る方法

#### Vercel（おすすめ・最短）
- GitHub にこのプロジェクトを push
- Vercel にログイン → 「New Project」→ リポジトリを選択
- Framework: Next.js（自動認識）
- Deploy を押す
- 数分後に **`https://xxxxx.vercel.app`** が発行され、そのURLを共有すれば他の人も見られます

#### Netlify
- GitHub に push
- Netlify → 「Add new site」→ 「Import an existing project」
- Build command: `npm run build`
- Publish directory: `.next`
- `netlify.toml` を追加済みなので、基本は自動で動きます

### ローカルで本番起動する
このプロジェクトは本番用に `npm run start`（= `next start`）を使います。

  ```bash
  npm run build
  npm run start
  ```

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial

You can check out the [Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🙏 Acknowledgments

- Built with [Rocket.new](https://rocket.new)
- Powered by Next.js and React
- Styled with Tailwind CSS

Built with ❤️ on Rocket.new

## 📝 Recent Changes

### CarSwipe Demo Integration (Latest Update)

**Added Files:**
- `public/demo.html` - CarSwipe demo page with features, how-it-works section, and QR code modal
- `public/demo.css` - Styling for the CarSwipe demo page with responsive design
- `public/demo.js` - JavaScript functionality for smooth scrolling, QR code generation, and modal interactions
- `public/assets/images/For-car-swipe.png` - Blue Porsche 911 GT3 car image for the Auto Matcher project

**Modified Files:**
- `src/app/homepage/components/ProjectHighlights.tsx`
  - Updated Auto Matcher project image to use local file: `/assets/images/For-car-swipe.png`
  - Added `url: '/demo.html'` property to enable "View Details" link navigation to the demo page
  - Updated alt text to reflect the blue Porsche 911 GT3 supercar image

**Changes:**
1. Integrated CarSwipe demo page as a standalone HTML page accessible at `/demo.html`
2. Updated the Auto Matcher project card in the ProjectHighlights component to display the blue car image
3. Configured the "View Details" link to navigate to the demo page when clicked
4. Demo page includes features showcase, step-by-step instructions, tech stack, and QR code modal for mobile access

### Homepage Updates (Latest)
- Removed the top-right project overlay icons for a cleaner card design
- Updated hero stats to three items: `5+ Years Experience`, `10+ Projects Completed`, and a highlighted `Certified Professional` (AWS, Google Cloud, multiple development certifications)
- Contact form now opens the default mail client to email `akiyamatakuro0212@gmail.com` with the user’s message details
- Adjusted code card overlay sizing/padding to avoid covering text and centered stats content
- QR modal default Web App URL set to `https://auto-matcher-e5ig-18qv0tktt-takuro-akiyamas-projects.vercel.app/`
- Updated Charge Spotter project: added `url` property linking to `https://charge-spotter-wjwh-rjm60m0u2-takuro-akiyamas-projects.vercel.app` and changed image path to `/assets/images/charge-spotter.png`