Poster Point — React migration

This is a minimal React (Vite) migration of the Poster Point front-end. It includes core components: Header, Categories panel, Product Grid, and Cart.

Key features implemented
- Cart persistence in `localStorage` (cart survives page reloads).
- Size-aware product selection (poster sizes A4/A3/A5/Pocket/4x6) with per-size pricing.
- Quantity controls (+ / −) in the cart and correct total calculation.
- Simple offer summary applied client-side (Buy 3 → 1 free, Buy 5 → 2 free, Buy 10 → 5 free).
- Product filtering by category and search (toolbar search input).

Quick start (Windows PowerShell)

1. Install dependencies:

```powershell
cd react-app
npm install
```

2. Run dev server:

```powershell
npm run dev
```

3. Open the URL Vite shows (usually `http://localhost:5173`).

How to use the app
- Use the categories button to open the categories panel and select a category.
- Use the search box to search by product name, id, category or tags. The toolbar shows the query and result count.
- Click "Buy now" on a product to add it to the cart. If you add the same product with the same size, the quantity increments.
- Open the cart to change quantities with + / −, remove an item, or checkout via WhatsApp (message includes size, qty and total).

Working with the original manifest & images
- The app fetches `public/data/products.json` at runtime. A helper script is included to convert the legacy JS manifest into JSON:

```powershell
node react-app/scripts/convert-manifest.js
```

- Copy your `outputs/` images folder into the React public folder so image paths resolve:

```powershell
# from repo root (PowerShell)
Copy-Item -Path .\outputs -Destination .\react-app\public\ -Recurse
```

Build & QA notes
- I ran a production build (`npm run build`) to verify the app compiles — the build completed without errors.
- Recommended QA: add items with multiple sizes, verify offer counts, verify WhatsApp checkout message, and test persistence across browser sessions.

Next actions I can take (ask me to do any):
- Port remaining legacy `js/*.js` utilities and exact pricing/thumbnail rules into React.
- Improve offer calculation to match server-side rules exactly.
- Add unit tests and a CI workflow for builds.
- Help deploy the built `dist/` to a static host (Netlify/Vercel/S3).

If you'd like, I can proceed with any of the items above — tell me which one and I'll continue.
# Poster-Point
