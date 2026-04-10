# Andre's Portfolio - Vite + Tailwind CSS

This is a modern portfolio website built with Vite and Tailwind CSS.

## Setup Instructions

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/
   - Recommended: LTS version

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```
   - Open your browser to the URL shown (usually http://localhost:5173)
   - Changes will hot-reload automatically

4. **Build for Production**
   ```bash
   npm run build
   ```
   - Creates optimized files in the `dist` folder
   - Deploy the `dist` folder to your hosting service

5. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Project Structure

```
kechibi.github.io/
├── src/
│   ├── main.js          # JavaScript entry point
│   └── style.css        # Tailwind CSS imports
├── images/              # Your images
├── index-new.html       # New Tailwind-based HTML
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
├── vite.config.js       # Vite configuration
└── postcss.config.js    # PostCSS configuration
```

## Features

- ⚡ Vite for fast development and optimized builds
- 🎨 Tailwind CSS for utility-first styling
- 🌙 Dark mode with smooth transitions
- ⭐ Animated stars in dark mode
- 📱 Fully responsive design
- 🎭 Smooth page transitions

## Migration Steps

To use the new Vite + Tailwind version:

1. Rename `index.html` to `index-old.html` (backup)
2. Rename `index-new.html` to `index.html`
3. Run `npm install`
4. Run `npm run dev`

## Deployment

For GitHub Pages:
1. Build: `npm run build`
2. Deploy the `dist` folder contents to your gh-pages branch

## Technologies Used

- Vite 5.x
- Tailwind CSS 3.x
- Vanilla JavaScript
- PostCSS & Autoprefixer
