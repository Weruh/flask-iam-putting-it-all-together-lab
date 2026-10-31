# Reciplease verification

Verified locally on 31 October 2026.

## Automated checks

- `.venv/bin/pytest -q --disable-warnings`: **31 passed** (19 original lab scenarios and 12 additional boundary/security cases). The suite uses a temporary database.
- `npm run build --prefix client`: production build compiled successfully.
- `git diff --check`: no whitespace errors.

## Browser checks

Automated headless Google Chrome with Playwright was used against the actual React development server on port 4000 and Flask API on port 5555. The connected computer-use tool reported no available browser session; these checks did not use an interactive desktop browser.

The following flows passed through the UI and real API/database:

- Demo login and loading the six seeded recipes.
- Invalid login feedback, signup password mismatch feedback, signup, logout, and subsequent login with the created account.
- Session restoration after a page refresh.
- Recipe title search, an empty search, clearing filters, the 30-minute filter, and the user's own recipe filter.
- Opening a recipe, rendering its Markdown, and refreshing its detail URL.
- Writing a recipe, observing its live Markdown preview, saving it, opening the resulting detail URL, refreshing, and finding it in the user's recipes.

No JavaScript page errors were recorded during the completed flow test. Browser-test accounts and recipes were removed afterward; the seeded demo cookbook remains.

Screenshots were captured at **1440px, 768px, and 390px** widths. Login, collection, recipe detail, signup, and editor screens were visually inspected. Checks confirmed no horizontal overflow. The mobile sharing callout was refined after screenshot review; its final heading has 264px of available width at the 390px viewport.

Final screenshots:

- [Desktop collection](docs/preview-desktop.png)
- [Mobile collection](docs/preview-mobile.png)

## Limitations

- Verification used Chrome, not Safari or Firefox, and does not constitute a full accessibility audit.
- The inherited React 17 / Create React App 5 dependency tree reported 80 npm audit findings during installation (21 low, 20 moderate, 33 high, 6 critical). A production release needs a separately reviewed dependency modernization; no force-upgrade was applied.
- The preview uses Flask's development server and a local SQLite database. Deployment configuration, HTTPS, secure cookies, and rate limiting require production setup.
- The frontend build emits a stale Browserslist data notice. Python's inherited dependency versions also emit deprecation warnings on Python 3.12.

## Reproducible startup

See [README.md](README.md) for dependency installation, migrations, seed, startup commands, and demo credentials.
