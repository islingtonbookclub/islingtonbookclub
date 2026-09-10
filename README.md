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

Open `/#admin`, unlock (passphrase `margin` — change it in `onUnlock` in the component's logic), open **Repository and token** and fill in:

- **owner / repository / branch** — where the site lives.
- **File** — `data.json`.
- **Fine-grained token** — GitHub → Settings → Developer settings → Fine-grained tokens → new token, **this repository only**, permission **Contents: read and write**, nothing else. Give it a 1-year expiry.

The token is stored in that browser's localStorage and is sent only to api.github.com. It never enters the repository. Treat it like a house key: anyone with the device and the passphrase can commit with it. If it leaks, revoke it on GitHub and make a new one.

### Day to day

1. Add books (paste a Goodreads link or ISBN → **Fetch** pulls title, author, pages and cover from Open Library) and events.
2. Press **Publish to GitHub**. That writes `data.json`; Pages redeploys in about a minute.
3. No token to hand? **Copy data** puts the same JSON on the clipboard — paste it over `data.json` in the GitHub web editor and commit. Same outcome.

The badge at the top of the admin panel says whether this browser holds unpublished changes. "Discard local changes" at the foot throws them away and reloads the published file.

## What this design cannot do

- **Two admins on two devices will clobber each other.** Whoever publishes last wins — the earlier edits are overwritten, not merged. Fine for one or two organisers who take turns; not fine for a committee editing at once.
- **Members cannot add anything.** Only someone with the passphrase and a token can write.
- **Votes are not tallied here.** Voting is a link out to a poll service (set the URL in the admin ballot form), because a real shared tally needs a server. If you want live vote counts and phone-friendly editing without GitHub, the honest answer is a free Supabase or Firebase project — say the word and it can be swapped in.
- **Gallery photos are per-browser.** Dropped images live in your browser only. For published photos, commit image files and replace the `<image-slot>` elements with `<img>`.

## Notes

- Covers are hotlinked from Open Library. Goodreads has had no public API since 2020, so a pasted Goodreads URL is matched on its title slug — check the fetched details before adding.
