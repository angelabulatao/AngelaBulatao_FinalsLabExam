# Wanderlist – Travel Bucket List

A four-view travel planning app: explore Philippine and international destinations, save them, plan trips and stamp places as visited. Built with HTML, CSS, JavaScript and Bootstrap 5.3 (CDN). No build step.

## Run it
Open `index.html` in a browser (internet needed for Bootstrap, Google Fonts and Unsplash photos). Or serve the folder: `python3 -m http.server` and visit `localhost:8000`.

## Structure
```
wanderlist/
├── index.html      markup for all four views, modal, toast
├── css/style.css   design tokens, layout, components
├── js/data.js      16 destinations (8 PH, 8 international)
├── js/app.js       router, rendering, filters, bucket list, trip CRUD
├── README.md
└── PROMPT_LOG.md
```

## Features
- **Home** – hero, live stats (saved / visited / trips), featured destinations, category shortcuts.
- **Discover** – text search (name, country, category, description), category chips, region select, result count, empty state.
- **My Bucket List** – save/remove, mark visited (passport stamp appears), All / To visit / Visited tabs, progress bar.
- **Trip Planner** – create, edit, delete trips; validation (name, destination, dates, return ≥ departure, budget ≥ 0); live duration (days / nights); status (in N days, happening now, completed).
- **Persistence** – `wl_saved` and `wl_trips` in localStorage.
- **Routing** – hash routes `#home #discover #bucket #planner`; back/forward and deep links work.

## Accessibility
Skip link, semantic landmarks, one `h1` per view, labelled inputs, `aria-pressed` on toggles, `aria-current` on nav, live regions for results/toasts, visible focus, `prefers-reduced-motion` respected, alt text on photos.

## Design notes
Forest `#1f3d2b`, sage `#a8bba0`, cream `#f6f1e6`, white. Fraunces (display) + Figtree (text). The distinctive element is the rotated passport stamp on visited destinations.

## Known limitations
- Photos are hot-linked from Unsplash; if one fails, the card shows a green fallback with the place name. Swap in local files via `img` in `data.js` if needed.
- Delete/remove use the browser `confirm()` dialog.
- Data is per browser; there is no account or sync.
