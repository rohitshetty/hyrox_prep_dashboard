# Hyrox Training Prep

(Disclaimer: The plans are not accurate, and work in progress. This app was vibe coded to explore training plan visualization)

(Homecooked software)

A training command center dashboard for Hyrox race preparation. Visualizes your weekly training schedule including running, strength, and Hyrox station workouts.

## Tech Stack

- **Nunjucks** - HTML templating
- **js-yaml** - YAML data parsing
- **Chokidar** - File watching for development

## Project Structure

```
├── src/
│   ├── templates/index.njk    # Main template
│   └── styles/styles.css      # Styling
├── run_plan.yml               # Running schedule
├── hyrox_plan.yml             # Hyrox station workouts
├── strength_plan.yml          # Strength training plan
├── build.js                   # Build script
└── dist/index.html            # Generated output
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Build the site
pnpm run build

# Development with auto-rebuild
pnpm run watch
```

Open `dist/index.html` in your browser.

## Customizing Your Plan

Edit the YAML files to customize your training:

- `run_plan.yml` - Weekly running workouts
- `hyrox_plan.yml` - Hyrox-specific station training
- `strength_plan.yml` - Strength and conditioning

## Deployment

The output is a single static HTML file. Deploy anywhere:

**Netlify Drop** (quickest)
- Drag `dist` folder to [netlify.com/drop](https://app.netlify.com/drop)

**GitHub Pages**
- Push to GitHub → Settings → Pages → Select `/dist` folder

**Vercel**
```bash
npx vercel dist
```

**Surge**
```bash
npx surge dist
```
