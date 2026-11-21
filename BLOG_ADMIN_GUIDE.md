# Private blog admin

The site now includes a private article editor and a local SQLite data store. Public URLs remain `/blog` and `/blog/<slug>`; only published posts are returned publicly.

## First local setup

Use Node.js 24 and npm. From this folder:

1. Install dependencies with `npm install`.
2. Run `npm run admin:setup`. Enter the administrator password in the hidden prompt. The script writes `ADMIN_EMAIL`, a scrypt password hash, and a random session secret to ignored `.env.local`; it never echoes or stores the plaintext password.
3. Run `npm run dev`; the site is available at `http://localhost:3000`.
4. Open `http://localhost:3000/admin/login` directly to sign in. The admin is not linked from the public site.

The original two published articles and the 19 articles from `data/articles-import.json` are already in the working database. To restore the original two legacy articles in a fresh database, run `npm run blog:migrate`. To import the 19 document articles, run `npm run blog:import-articles`; it skips existing slugs. No image files existed in the old media directory.

## Managing articles

1. Sign in, then choose **New article**.
2. Enter a title, slug, and excerpt. The slug follows the title until you edit it; duplicate slugs are rejected.
3. Write in the rich text editor. The toolbar supports H1–H3, emphasis, lists, quotes, code, links, alignment, colors, highlights, rules, and undo/redo. Upload an image from the toolbar, or paste/drop one into the editor. Add alt text and an optional title when prompted. Set image alignment and width with the image controls.
4. **Save Draft** keeps the article private. Drafts autosave after 30 seconds. **Publish** makes it visible on `/blog` and `/blog/<slug>`.
5. Edit, unpublish, or delete from the dashboard. Deletion asks for confirmation.

The backend sanitizes saved HTML using an allowlist. Uploads are restricted to JPG, PNG, WebP, and GIF, checked against file signatures, limited to 5 MB, and stored under randomized names.

## API and access

- Public: `GET /api/posts`, `GET /api/posts/<slug>`, and image reads under `/api/uploads/blog/<filename>`.
- Admin: `/api/admin/login`, `/api/admin/logout`, `/api/admin/posts`, `/api/admin/posts/<id>`, and `/api/admin/upload`.
- Admin APIs require an 8-hour signed, HttpOnly, Secure, SameSite=Lax session. Mutating requests check same-origin and CSRF tokens. Five failed logins per IP within 15 minutes are rate limited.
- Admin pages include `noindex,nofollow`; `/robots.txt` disallows `/admin`.

## Production self-hosting

Build and run the Node server with `npm run build` and `npm start`. Use a Node 24 VPS or container with persistent writable storage. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (generate with `npm run admin:hash` or the setup script), and a random `BLOG_SESSION_SECRET` of at least 32 characters. Set `BLOG_DATA_DIR` to a persistent directory and back it up; it holds both the SQLite database and uploaded images.

Terminate HTTPS at the app or a trusted reverse proxy that preserves the original `Host` header. The browser session cookie is Secure, so production must use HTTPS. The public site can build for Vercel, but the filesystem-backed SQLite admin database and uploaded files do not persist reliably on Vercel serverless functions. For live article management, run the app on a VPS/container with persistent storage or move the blog database and uploads to managed persistent services before relying on the admin on Vercel.

### Diagnose or reset an admin on a persistent Node host

The runtime auth variables are `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `BLOG_SESSION_SECRET`. On database initialization, the app creates the configured admin if missing and synchronizes the existing account's email/hash to these values, clearing old sessions when they change. `ADMIN_PASSWORD` is only read by the local setup helper; `DATABASE_URL` and `JWT_SECRET` are not used by this SQLite/session implementation. Keep the session secret stable and at least 32 characters long. `.env.local` is ignored by Git and is not deployed automatically.

For a host with a persistent SQLite volume, run these commands in a shell attached to that host, with `BLOG_DATA_DIR` set to the directory containing its existing `blog.sqlite` file:

```powershell
$env:BLOG_DATA_DIR = "D:\path\to\persistent\blog-data"
$env:ADMIN_EMAIL = "mohan@arjunaexports.com"
npm.cmd run admin:db -- --check
npm.cmd run admin:db -- --reset-existing
```

`--check` reports the normalized email, whether the admin exists, whether the hidden password input matches, the scrypt hash length, and the database path. `--seed-from-env` creates or updates the account from `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH`; `--reset-existing` instead prompts for a new password without echoing it. Both create the account if missing, update it if present, and clear its sessions. The script refuses Vercel/AWS serverless runtimes because their `/tmp` SQLite files are not shared persistent storage. On Vercel, app startup now synchronizes the configured admin in each runtime's database copy, but SQLite content changes still do not persist reliably across serverless instances.

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and a stable `BLOG_SESSION_SECRET` in your hosting dashboard's Production environment, then redeploy. Set `BLOG_DATA_DIR` to the mounted persistent data directory on a VPS/container. `ADMIN_AUTH_DEBUG_ERRORS=true` temporarily returns separate messages for a missing admin and a wrong password; turn it off after diagnosis. Server logs report the normalized email, whether the admin was found, the password comparison result, the host, and database path, but never the password. Use persistent database and file storage for production article CRUD.

The login form posts same-origin JSON `{ email, password }` with a CSRF header and cookies. JSON is parsed in the route; no separate body middleware or cross-origin CORS setup is required. Session cookies are Secure, HttpOnly, SameSite=Lax, and host-only, which is correct for the HTTPS admin page on the same domain.

`.env.local`, `.env`, the SQLite database, and uploaded files are ignored by Git. Keep production secrets in the host’s secret environment settings.
