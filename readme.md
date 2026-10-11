# Paratha Rasoi

One-page React (Vite) website for Paratha Rasoi, Gunjur, Bengaluru.

```bash
npm install
npm run dev      # local dev: API (port 3001) + Vite site together
npm run build    # production build in dist/
npm start        # serve dist/ + API from one Node server
```

Needs Node 22.13+ (uses the built-in `node:sqlite`).

## Database

Reservations and contact-form messages are saved in a local SQLite file,
`data/paratha-rasoi.db` (created automatically, git-ignored). Change the path with `DB_PATH` in `.env`.

- `POST /api/reservations`: reservation modal
- `POST /api/messages`: contact form (WhatsApp still opens as before)
- `GET /api/reservations`, `GET /api/messages`: view saved entries. Needs `ADMIN_TOKEN` set in `.env`
  and the header `Authorization: Bearer <token>`.

**Admin page:** open `/admin` (e.g. http://localhost:5173/admin) and log in with `ADMIN_TOKEN`
to see reservations and messages and mark reservations confirmed or cancelled.

To browse the data directly, open the `.db` file in [DB Browser for SQLite](https://sqlitebrowser.org/)
or the VS Code "SQLite Viewer" extension.

## Live Google reviews

The reviews section loads the restaurant's live rating and reviews from Google
(Maps JavaScript API, Places library). Google returns up to 5 reviews.

1. In [Google Cloud Console](https://console.cloud.google.com/) create a project with billing enabled.
2. Enable **Maps JavaScript API** and **Places API (New)**.
3. Create an API key and restrict it to your site's domain (HTTP referrers) and to those two APIs.
4. Copy `.env.example` to `.env` and set `VITE_GOOGLE_MAPS_API_KEY`.
   Optionally set `VITE_GOOGLE_PLACE_ID` to skip the name lookup.
5. Rebuild (`npm run build`). Env vars are baked in at build time.

Without a key the section shows a "Read all reviews on Google" link instead.

## Files

- `src/data.js`: menu items, prices, contact details
- `src/googlePlaces.js`: Google reviews fetching (cached per browser session for 6 hours)
- `src/api.js`: frontend calls to the API
- `server/`: Express API (`index.js`) and SQLite setup (`db.js`)
- `src/components/`: one component per section
- `public/assets/`: images
