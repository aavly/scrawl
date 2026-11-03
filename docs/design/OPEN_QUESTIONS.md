# Open design questions

Add questions here instead of guessing a look. The design chat resolves them and DESIGN.md gets updated.

Resolved in v2.1:
- Email magic link: yes.
- Web guests playing ranked: no (account required on web).
- Theme: Butter is always the default; OS setting ignored; Settings > Appearance toggles Night (DESIGN.md §3.5).
- Small phones: compact board layout + one tile formula (§4.1b); bounded found-words row (§4.6); five-digit scores (§4.2).
- Pip covers Bronze only; no weekly reset in release 1.

Resolved earlier: time bar removed, tutorial ending, full tier ladder, missing states, Android back/sign-in.

Decided by the user since v2.1 (2026-11-02), for DESIGN.md to catch up on:
- House-player matches count for rating, with a capped bonus for the points margin. House players get a hidden fixed rating for the maths, never shown. No screen changes expected (see docs/PRODUCT.md "Rating").
- Optional extras are skipped for now: the "Beaten 3 of 5" strip, the "MORE SOON" locked avatars and the leaderboard footer. Remove them from release 1; revisit later.

Still open:
- Final name and trademark check for "Scrawl" (working name).

Built differently from the mockup (engineering, 2026-11-02):
- **Tier chip division dots.** §4.9 says one dot means II and two mean I, but in `Spec-Tiers.png` the dots are ink on an ink glyph, so they're invisible. The app draws them in the chip's fill colour so they show, as the mockup code already does for Diamond. No change needed unless the design chat prefers another treatment.

- **Board screen, where the PNGs and DESIGN.md disagree** (engineering, 2026-11-02). The board was built to DESIGN.md. Which is intended?
  - Valid word bar: the PNG fills it Mint with an Ink check disc; §4.5 says card fill with a Mint check circle.
  - Valid chain: the PNG draws it Butter; §4.1 says Paper (white).
  - Invalid tiles: the PNG uses #E9E4D0 / #CFC8AE stripes with grey letters; §4.1 says white / #D3D3E0 stripes with Ink letters.
  - Invalid ✕: the PNG draws a Bubblegum ✕ on Ink; §4.5 says a white ✕.
  - Score card corners: the PNG uses 22px radius; §3.3 says 16.
  - Word-tier labels (NICE!, GREAT!, AMAZING!, LEGENDARY!): §4.5 calls for a starburst label but no PNG shows one. Engineering drew a simple Butter starburst at the top left of the word bar. It needs a design.
- **Engineering choices where the design is silent:**
  - Tracing one or two letters and letting go does nothing: no "not a word" feedback, since a short trace is usually an accidental touch.
  - Sliding back onto the previous tile undoes the last letter.

- **Theme: the user reversed the v2.1 default (2026-11-03).** The theme now follows the phone's light or dark mode by default, and Settings can pin Butter or Night. The §3.5 Appearance group shows only Butter and Night swatches, so it needs a third option, such as "Match phone", which is selected by default. Meanwhile the specimen page has a plain three-way picker: Phone, Butter, Night.

- **Mild-word reactions (user, 2026-11-03).** A valid mild word (ASS, DAMN …) shows a random cheeky exclamation ("CHEEKY!", "NAUGHTY!", "HEY, WATCH IT!") in place of the word-tier label. Engineering reused the starburst sticker in Bubblegum. It needs a design: the sticker look, and whether it gets its own sound and animation.

- **Step 4 choices where the design is silent (engineering, 2026-11-03):**
  - **Finding search time:** shortened to 3 s in Stage 1, then the house player steps up. With no server there are no humans to find. Stage 2 restores the ~10 s search.
  - **Practice entry:** Practice goes through Reveal with the headline "PRACTICE MATCH" and a practice note, reusing the house-player Reveal layout.
  - **Practice results:** the Results screen without the rating card, plus the caption "PRACTICE ROUNDS NEVER CHANGE YOUR RATING".
  - **Results headlines:** a loss says "SO CLOSE" whoever the opponent is, and a tie says "DEAD HEAT!". The tutorial loss says "GOOD TRY!" on Butter.
  - **Report flag:** hidden on Results against house players, since there's nobody to report.
  - **Tutorial coaching** before ONE is started: "Drag across touching letters. Start on the O and slide down to the N." After ONE: "Nice one! Longer words score way more. Find as many as you can before the time runs out."
  - **Best words you missed:** familiar words first, so suggestions teach rather than show obscure ENABLE words.

Small fix for next time:
- §4.1b's table says a 360×592 Android phone gets 64px tiles, but the formula gives 72 (min(336, 520 − 160) = 336). Engineering follows the formula.
