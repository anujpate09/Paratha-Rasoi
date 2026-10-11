# Paratha Rasoi

One-page React (Vite) website for Paratha Rasoi, Gunjur, Bengaluru.

```bash
npm install
npm run dev      # local dev: API (port 3001) + Vite site together
npm run build    # production build in dist/
npm start        # serve dist/ + API from one Node server
```

Needs Node 22.9+ (the npm scripts use `--env-file-if-exists`).

## Database

Reservations and contact-form messages are saved with [libSQL](https://github.com/tursodatabase/libsql-client-ts):

- **Locally:** a SQLite file, `data/paratha-rasoi.db` (created automatically, git-ignored). Change the path with `DB_PATH`.
- **In production:** a free hosted [Turso](https://turso.tech) database, so data survives restarts and redeploys
  (Render's free plan has no persistent disk). Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`.
  Tables are created automatically on first start.

- `GET /api/settings`, `PUT /api/settings` (admin): booking mode
- `POST /api/otp`: sends a booking OTP to the customer's WhatsApp
- `POST /api/reservations`: reservation modal (saved only with the correct OTP)
- `POST /api/messages`: contact form (WhatsApp still opens as before)
- `GET /api/reservations`, `GET /api/messages`: view saved entries. Needs `ADMIN_TOKEN` set in `.env`
  and the header `Authorization: Bearer <token>`.

**Admin page:** open `/admin` (e.g. http://localhost:5173/admin) and log in with `ADMIN_TOKEN`
to see reservations and messages and mark reservations confirmed or cancelled.

To browse the data directly, open the `.db` file in [DB Browser for SQLite](https://sqlitebrowser.org/)
or the VS Code "SQLite Viewer" extension.

## WhatsApp OTP for bookings

The admin page has a **Table booking** switch:

- **Direct WhatsApp** (default): the form opens WhatsApp with the booking details and saves the entry, like before.
- **OTP on WhatsApp**: a 6-digit OTP is sent to the customer's WhatsApp number.
The booking is saved only after they enter it (valid 5 minutes, 5 tries; max 5 OTPs per number per hour).

Until WhatsApp is set up, the OTP is printed in the server terminal, so you can still test.

1. Create an app at [developers.facebook.com](https://developers.facebook.com/) → add the **WhatsApp** product.
2. Add and verify the restaurant's business phone number (it can't be a number already used in the WhatsApp app).
3. In WhatsApp Manager → **Message templates**, create a template:
   category **Authentication**, name `booking_otp`, language English, with the **Copy code** button. Wait for approval.
4. Create a **System User** in Business Settings with a permanent token (`whatsapp_business_messaging` permission).
5. In `.env` set `WHATSAPP_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` (shown under WhatsApp → API Setup), then restart the server.

Meta charges per authentication message (about ₹0.12–0.15 each in India); check current pricing in WhatsApp Manager.

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

## Deploy on Render (free)

1. Create a database at [turso.tech](https://turso.tech) and copy its URL (`libsql://…`) and an auth token.
2. On [render.com](https://render.com): **New → Web Service** → connect this GitHub repo.
   - Build command: `npm install --include=dev && npm run build`
   - Start command: `npm start`
3. Environment variables: `NODE_VERSION=24`, `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `ADMIN_TOKEN`,
   and optionally `VITE_GOOGLE_MAPS_API_KEY`, `VITE_GOOGLE_PLACE_ID`, `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`.

Every push to `main` redeploys automatically. On the free plan the site sleeps after 15 minutes idle
and takes about a minute to wake up.
