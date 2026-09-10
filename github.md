repo: islingtonbookclub/islingtonbookclub
branch: main

## Last sync

date: 2026-09-10T09:26:33Z

### Updated in this project

- Added a hairline "IBC" roundel logo beside the wordmark in the header.
- Added a fixed ticker along the foot of every page scrolling recently read books.
- Styles now load from `ds/` (not `_ds/`), so GitHub Pages' Jekyll cannot skip them.
- Admin is reachable at `/admin/` and via the dimmed "Housekeeping" nav link.

## Screen map

| Screen | Repo files |
| --- | --- |
| Whole site (Home, The Club, Reading, Events, Gallery, Vote, Housekeeping) | `Islington Book Club.dc.html` |
| Published content (books, events, ballot) | `data.json` |
| Hero illustration explorations | `Hero illustration options.dc.html` |
| Entry redirect | `index.html` |
| Admin redirect | `admin/index.html` |
| Design system (Classical) | `ds/styles.css`, `ds/ds-bundle.js` |
| Runtime | `support.js`, `image-slot.js` |

## Notes

- The repo still contains a stale `_ds/` folder from the first upload; it is unused and safe to delete.
- `.nojekyll` should exist at the repo root as a backstop.
