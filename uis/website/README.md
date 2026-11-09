# Nexova Solutions — Public Website

Corporate website for [Nexova Solutions](https://nexova.com), a talent acquisition and HR consulting firm.

## Tech stack

- **HTML5** with semantic elements and Schema.org microdata
- **Tailwind CSS v3** via CDN (`cdn.tailwindcss.com`) — no build step required
- **Vanilla JavaScript** (`validation.js`) for client-side form validation
- **Serve** via `npx serve` (zero-config static file server)

## How to run locally (Codespaces / terminal)

```bash
# From the monorepo root:
npx serve uis/website -l 3000
```

Or from inside this folder:

```bash
cd uis/website
npm run dev
```

Then open http://localhost:3000 in your browser.

### Why `npx serve`?

- Works **out of the box** in Codespaces (no global installs needed)
- Serves static files as-is with no build step
- SPA fallback, directory listing, and CORS headers included
- Port `3000` is auto-forwarded by Codespaces

## Project structure

```
uis/website/
├── index.html        # Main landing page
├── application.html  # Job application form
├── validation.js     # Client-side form validation
├── package.json      # Dev scripts
├── README.md         # This file (en)
└── README.es.md      # This file (es)
```

## Features

- Responsive design (mobile, tablet, desktop)
- Semantic HTML with Schema.org JSON-LD + microdata
- Client-side validation for 3 forms (quick apply, contact, full application)
- WCAG-friendly: labels, alt text, ARIA attributes, focus management
- Touch-friendly: minimum 44×44 px touch targets
