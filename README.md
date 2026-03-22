# GunGen

Procedural firearm silhouette generator.

[vilsepi.github.io/gungen](https://vilsepi.github.io/gungen/)

## Usage

### Development

Install dependencies and start the Vite dev server:

- `npm install`
- `npm run dev`

Vite will serve the app with automatic reloads whenever sources change.

### Headless SVG rendering

Render a weapon SVG without opening the browser:

- `npx tsx render-svg.mjs --category=AssaultRifle --dataModelSeed=5f930404 --partSizeSeed=a784b217 --aestheticDetailSeed=44c43249`
- `npx tsx scripts/render-svg.mjs --category=AssaultRifle --dataModelSeed=5f930404 --partSizeSeed=a784b217 --aestheticDetailSeed=44c43249`
- `npm run --silent render:svg -- --category=AssaultRifle --dataModelSeed=5f930404 --partSizeSeed=a784b217 --aestheticDetailSeed=44c43249`

Any omitted option is generated randomly. The command writes only the SVG document to stdout, which makes it suitable for CI snapshots and render regression checks.

## Production build

- `npm run build`
- `npm run preview`
