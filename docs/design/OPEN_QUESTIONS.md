# Open design questions

Add questions here instead of guessing a look. The design chat resolves them and DESIGN.md gets updated. When a question is resolved, delete it here and record the answer in DESIGN.md.

Each question notes which roadmap stage it blocks and what engineering would build in the meantime. Recommendations are from engineering (Claude Code), not design decisions.

## Blocks Stage 1 or 2

1. **Bots become a recurring cast of characters (user decision, 2026-10-25).** Bots stay openly bots, but each is a named character with its own look and difficulty that players come to recognise ("oh, that's just Steve"). The same cast covers the tutorial, Practice and the ranked fallback. See docs/PRODUCT.md "Bots".
   - **Character designs:** an illustrated avatar for each of Pip, Dash, Bolt, Nova and Titan, replacing the shared robot glyph, fitting the fixed circular avatar slot (§4.8) at every size.
   - **Names:** keep Pip, Bolt and the others, or use more human names like "Steve"?
   - **Wording:** what replaces the "BOT" tag, for example "HOUSE PLAYER" or just the character's level? Does the "BOTS ARE ALWAYS LABELLED" pill stay?
   - **FindingBot and RevealBot:** reframe from "nobody nearby, here's a bot" to "Bolt stepped up". Keep the dashed outline or drop it?
   - **Board score card:** the character line ("LEVEL 1 · EASY") versus a rating.
   - **DESIGN.md §1, §4.8 and §5 (screens 2, 4, 5, 8)** need updating.
   - Meanwhile: bots are built as character data with the existing bot screens and robot glyph as placeholders.

2. **Web and desktop (user decision, 2026-10-31).** Scrawl is playable in any browser, including desktop, with ranked play. Built in iteration 2, so this doesn't block Stages 1 or 2, but the design is needed before then.
   - **Desktop layout** for every screen. Recommendation: keep the phone column centred, with the board scaled up and extra space used for the dot background on gameplay screens and calm empty space elsewhere.
   - **Mouse and trackpad:** hover state on tiles, cursor while tracing.
   - **Mobile browser:** the browser's own toolbars take height, so the board must still fit without scrolling.
   - Meanwhile: the phone layout centred in the browser window.

3. **Accounts across web and app (user decision, 2026-10-31).** One profile on every platform, with guests allowed.
   - **Sign-in screen or sheet** with Apple, Google and email magic link (confirmed). Where is it reached from: Profile, Settings and the guest prompt (and, in iteration 2, before ranked on the web)?
   - **Email magic link flow:** "check your email" state and returning to the game.
   - **Guest upgrade:** confirmation that progress was kept (confirmed: guests keep their progress).
   - **Signed-in state** in Profile and Settings, and sign out.
   - **"Sign in to play ranked"** prompt on the web (confirmed, needed for iteration 2).
   - Blocks: Stage 2.
   - Meanwhile: the existing guest prompt card and a plain list of sign-in buttons.

4. **Time bar: smooth single bar, or remove? (§4.4)**
   - Blocks: Board screen.
   - Meanwhile: no time bar. The timer circle already shows the time.
   - Recommendation: remove it. It repeats the timer, and the board area is tight on small phones.

5. **Tutorial: its own small results screen, or end on Home?**
   - Blocks: the round loop.
   - Meanwhile: end on Home, as currently mocked.
   - Recommendation: a short results screen without rating or rematch, ending in "Let's play" that leads to Home.

6. **Player avatars on every screen.** The avatar slot (§4.8) appears on Home, Reveal, the Board score cards, Results, Leaderboard and Profile, but release 1 only has flat glyphs. Needs a default avatar set for players, and how a player picks one (Profile has an edit pencil, but no picker is designed).

7. **Full tier ladder.**
   - Blocks: rank card, results progress bar and leaderboard tier chips beyond Gold.
   - Meanwhile: tiers are data, so the code takes any ladder. Only Gold II (1,600) and Gold I (1,700) exist.
   - Recommendation: Bronze, Silver, Gold, Platinum, Diamond, each split into II and I in 100-point steps, plus a top tier. Needs a chip treatment per tier.

8. **Missing states.**
   - Offline or no connection (Home and Finding).
   - Opponent disconnects mid-round. Recommendation: the round continues and their score freezes, with a "disconnected" mark on their score card.
   - Match cancelled before it starts.
   - Empty leaderboard, likely at launch for the country tab.
   - Error toasts (generic failure, report sent).
   - Screen-reader flow for the board.
   - Meanwhile: plain text messages using existing card styles.

9. **Android specifics.** Android now launches with iOS, so this blocks Stage 2.
   - Back button or gesture: recommendation is that it behaves like the in-app back or close button. On the Board it asks to forfeit. On Update required it does nothing.
   - Status bar and insets: handled in code. No design needed unless the Night theme needs a different status bar.
   - Sign-in buttons: Google and Apple both shown on Android.

## Not blocking development

10. **Trademark check for "Scrawl".** The name is decided. The store, domain and trademark checks are a Stage 0 task.

## File issues

11. **Mockup variants don't render on their own.** The small variant files (for example `Board-Dupe.dc.html`) only import the main mockup and depend on `support.js`, which isn't in the repo. Either add `support.js` or export PNGs of every screen to `docs/design/screens/`.
