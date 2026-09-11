# Islington Book Club

Static site for GitHub Pages. No server, no build step. All content lives in `data.json`.

## Publish the site

1. Push **every** file, keeping the structure: `index.html`, `Islington Book Club.dc.html`, `admin/index.html`, `support.js`, `image-slot.js`, `data.json`, the `ds/` folder, and `.nojekyll`.
2. **Settings → Pages → Deploy from a branch**, branch `main`, folder `/ (root)`.
3. The site appears at `https://<user>.github.io/<repo>/`.

### If the site loads but looks unstyled

Two possible causes, in order of likelihood.

1. **The `ds/` folder did not get uploaded.** It holds the entire look — fonts, colours, every component style. Check it is there in the repository, with `styles.css` and `ds-bundle.js` inside.
2. **A missing `.nojekyll`.** GitHub Pages runs Jekyll by default, and Jekyll skips files and folders whose names begin with an underscore. This project keeps its styles in `ds/` precisely so that cannot bite, but `.nojekyll` is included as a belt-and-braces measure. Dotfiles are invisible to many Git clients and to drag-and-drop uploads, so if it is missing, add it in the browser: **Add file → Create new file**, name it `.nojekyll`, leave it empty, commit.

Either way, open the browser console on the live site — a 404 tells you exactly which file did not arrive. Then hard-refresh; Pages caches for a minute or two.

## Where is the admin page?

`https://<user>.github.io/<repo>/admin/` — the trailing slash matters on Pages.

That path is a small redirect (`admin/index.html`) into the main page's admin view. The direct equivalent is `…/Islington%20Book%20Club.dc.html#admin`, which is worth bookmarking if the redirect is ever cached oddly. There is deliberately no Admin link in the site navigation.

## How persistence works

There is no database. `data.json` in the repository *is* the database, and every visitor loads it. The admin page edits a copy in your browser and then commits the result back to `data.json` — after which everyone sees it.

### One-time admin setup

Open `/#admin`, unlock (passphrase `BookKeeper` — change it via `ADMIN_PASS` in the component's logic), open **Repository and token** and fill in:

- **owner / repository / branch** — where the site lives.
- **File** — `data.json`.
- **Fine-grained token** — GitHub → Settings → Developer settings → Fine-grained tokens → new token, **this repository only**, permission **Contents: read and write**, nothing else. Give it a 1-year expiry.

The token is stored in that browser's localStorage and is sent only to api.github.com. It never enters the repository. Treat it like a house key: anyone with the device and the passphrase can commit with it. If it leaks, revoke it on GitHub and make a new one.

### Setting the current read

Tick **Make this the current read** when adding a book and the form opens up: meeting date, location, blurb, and the discussion questions (one per line). Those drive the Reading page. Leave any of them empty to keep what is already published.

### Photographs

Two places take an image, both under Housekeeping:

- **Home page illustration** — sits behind the centred title, under a dark wash.
- **Event photograph** — shows on the event, and appears automatically in the Gallery.

Each field accepts a pasted web address, or **Upload a file**, which commits the image into the repository's `images/` folder and stores the path. Uploading needs the token; it is the better option, since a pasted address dies whenever that other site does. Keep files under about 1MB — the repository grows forever.

The Gallery also has a personal scratchpad of drop-frames at the bottom. Those live in your browser only and are never published; they are for trying a photo out.

### Day to day

1. Add events. An event is the unit of everything: date, title, book author, cover, where, time and the note from the night. When a meeting has happened, press **Mark as happened** — it drops into Past events, which is what the shelf on the Events page and the scrolling covers on the home page are built from.
2. Press **Publish to GitHub**. That writes `data.json`; Pages redeploys in about a minute.
3. No token to hand? **Copy data** puts the same JSON on the clipboard — paste it over `data.json` in the GitHub web editor and commit. Same outcome.

The badge at the top of the admin panel says whether this browser holds unpublished changes. "Discard local changes" at the foot throws them away and reloads the published file.

## What this design cannot do

- **Two admins on two devices will clobber each other.** Whoever publishes last wins — the earlier edits are overwritten, not merged. Fine for one or two organisers who take turns; not fine for a committee editing at once.
- **Members cannot add anything.** Only someone with the passphrase and a token can write.
- **The token is stored in this browser.** Housekeeping keeps the repository details and the token in local storage so you do not retype them. It is protected by the passphrase and nothing else — use a fine-grained token scoped to this one repository, and press **Forget token on this device** on a shared computer.
- **Gallery photos are per-browser.** Dropped images live in your browser only. For published photos, commit image files and replace the `<image-slot>` elements with `<img>`.

## The pages

Home (centred title, scrolling covers pulled from past events, then the three-up summary), Events (upcoming meetings with RSVPs, then the shelf of everything we have read), Gallery, Join, and Housekeeping — the admin page, linked quietly at the end of the nav and also at `/admin/`.

## Notes

- The passphrase is `BookKeeper`, set by `ADMIN_PASS` near the top of the logic block in `Islington Book Club.dc.html`. It is readable in the page source, so treat it as a doormat lock, not a safe. The GitHub token is the thing that actually matters, and that never leaves your browser.
- Covers are hotlinked from Open Library. Goodreads has had no public API since 2020, so a pasted Goodreads URL is matched on its title slug — check the fetched details before adding.
