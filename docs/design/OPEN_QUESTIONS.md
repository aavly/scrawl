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

Small fix for next time:
- §4.1b's table says a 360×592 Android phone gets 64px tiles, but the formula gives 72 (min(336, 520 − 160) = 336). Engineering follows the formula.
