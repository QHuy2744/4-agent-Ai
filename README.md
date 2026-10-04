# NEXUS TITAN

A massive, modular client-side productivity and stress-testing web application built with vanilla HTML, CSS, and ES6+ JavaScript.

## Architecture
Organized into dedicated modules:
- `index.html`, `style.css`: App Shell & Styling
- `state.js`, `storage.js`: State management & IndexedDB with localStorage fallback
- `tasks.js`, `projects.js`: Core domain engines with validation
- `calendar.js`, `analytics.js`, `search.js`, `commands.js`: Advanced productivity features
- `worker.js`: Web Worker for performance-heavy computations
- `pwa`: `manifest.json` & `service-worker.js`

## Running the App
Simply open `index.html` in any modern web browser or serve via a local static server.
