# source/

- `*.dc.html` — the v2 mockups (125 screens, 390×844 phone or 1440×900 desktop). Reference only, not code to import.
- `support.js` — the mockup runtime, so the `.dc.html` files render in a browser: serve this folder over http (`npx serve .`) and open any file. They load Bricolage Grotesque and Space Mono from Google Fonts.
- `generator/` — Node scripts that produced every screen (`node build.js` writes the `.dc.html` files into `OUTDIR`). `avatars.js` holds the SVG art for the 5 house players and 8 player avatars.
- `render/shot.js` — Playwright script used to export the PNGs (`PROJ=<folder> OUT=<folder> node shot.js Home:390:844 ...`; needs the two fonts available locally or online).
