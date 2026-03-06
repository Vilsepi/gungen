# GunGen

Procedural 2D firearm silhouette generator.

## Supported classes

- Pistol
- SMG
- Assault rifle
- Battle rifle
- DMR

## Current features

- Seed-based deterministic generation
- Mandatory core parts: chassis, barrel, magazine, pistol grip
- Weighted optional attachments: optics, flashlights, lasers, muzzle devices
- SVG-based vector rendering with line work and light fills

## Usage

### Development

Install dependencies and start the Vite dev server:

- `npm install`
- `npm run dev`

Vite will serve the app with automatic reloads whenever sources change.

## Production build

- `npm run build`
- `npm run preview`
