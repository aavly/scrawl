# DESIGN.md — Scrawl (working name) — v2.1

Source of truth for the UI of a competitive word-hunt game for iOS, Android and the web. When this file and a mockup disagree, this file wins; when this file is silent, record the question in `docs/design/OPEN_QUESTIONS.md` rather than inventing a look.

**How to read the markers.** Every change since v1.1 is tagged so you can scan for it:
- **[NEW]** did not exist in v1.1
- **[CHANGED]** existed, now different (the old behaviour is named)
- **[DECIDED]** an open question from v1.1 that is now answered
- **[v2.1]** changed or added in this revision, after engineering reviewed v2.0 against the build
- **[PROPOSED]** designed, but cheap to drop if you decide against it. Each says what to delete.
Untagged text is unchanged from v1.1.

Canvas (design-side reference): https://claude.ai/artifact/R4qSWPexqZPyX7vyDWjgGz (pages: Phone flow, Accounts and web, Cast avatars and specs, Desktop 1440×900).
PNG exports of every screen: `docs/design/screens/` — `phone/` (390×844 @2x), `desktop/` (1440×900 @2x), `specs/`, and `v1-archive/` (the v1.1 screens exactly as handed off). **These PNGs are the build reference.** The `.dc.html` files in `docs/design/source/` render in a browser: `support.js` is in that folder, so serve it over HTTP (`npx serve docs/design/source`) and open any file. They are reference for exact values, not code to import.

Changelog: v1 handoff · v1.1 removed time bar, added tutorial results · v2.0 house-player cast, player avatars, web and desktop, accounts, tier ladder, new states, Android · **v2.1 (this file)** small-phone board layout, bounded found-words row, five-digit scores, theme toggle, accounts decisions, corrections.

---

## 0. What changed in v2, at a glance

| Area | Change |
|---|---|
| Bots | **[CHANGED]** "Bots" are now five named **house players** (Pip, Dash, Bolt, Nova, Titan) with illustrated avatars. Still openly computer players. §6 |
| Avatars | **[NEW]** 8 default player avatars (people) + picker + locked/premium slots. House players are animals so the two never mix. §7 |
| Web / desktop | **[NEW]** Ranked in any browser. Desktop layouts at 1440×900 for every screen, mouse states, mobile-browser fit. §10 |
| Accounts | **[NEW]** Apple, Google, email magic link. Guest progress kept. Web ranked needs an account. §9 |
| Tiers | **[DECIDED]** Full ladder, Bronze II → Legend, 11 chips. §8 |
| Missing states | **[DECIDED]** offline, disconnect, cancelled, empty leaderboard, toasts, screen-reader flow. §11 |
| Android | **[DECIDED]** back behaviour, both sign-in buttons. §12 |
| Time bar, tutorial ending | **[DECIDED]** already resolved in v1.1; confirmed. §4.4, §5 |

### 0b. What changed in v2.1  **[v2.1]**

| # | Change | Where |
|---|---|---|
| 1 | Email magic link **confirmed** (no longer PROPOSED) | §9.1 |
| 2 | Web ranked needs an account **confirmed**; web guests can't play ranked; open decision closed | §9.1, §17 |
| 3 | **Butter is always the default**; the OS light/dark setting is ignored; Settings has an **Appearance** toggle | §3.5, §5 (Settings) |
| 4 | Native apps ship first; web and desktop come later. Desktop designs stay, but nothing in the phone app is optimised for web | §10.0 |
| 5 | **Board fits small phones**: full layout on ≥390×720, compact layout and one tile formula below that; new 360×640 and 375×667 screens | §4.13 |
| 6 | **Found words are one bounded row**, never more than ~38px tall; board never moves | §4.6 |
| 7 | **Five-digit scores** shrink by a stated rule (`12,400` shown on Board and Results) | §4.2 |
| 8 | Fix: Pip covers **Bronze only**; Silver II belongs to Dash (table, Ladder screen) | §6.1, §8 |
| 9 | Fix: no weekly reset in release 1; empty-leaderboard copy rewritten | §11.4 |
| 10 | Fix: header note about `support.js` | top of file |
| 11 | Fix: Last-10 frame (6px pulsing Bubblegum border from v1) is back on `Board-Last10` | §13 |

---

## 1. Product in one paragraph  **[CHANGED]**

A 4×4 grid of letters and an 80-second timer. The player drags across adjacent tiles (diagonals included) to spell words of 3+ letters. Longer words score disproportionately more. Two players get the same board; the higher total wins. Ranked quick-match against players worldwide; when no human is found in about 10 seconds a **house player** at the player's level steps in. **[CHANGED]** v1.1 said "labelled bots cover an empty lobby"; same idea, now a recurring cast people get to know. Playable on iOS, Android **[NEW]** and **any web browser [NEW]**, one profile across all of them. Inspired by GamePigeon's Word Hunt but must not look like it.

Audience: teens and young adults who want quick, repeated sessions and to beat people. Web is aimed at the quick-game-that-spreads-through-an-office use.

Release 1 loop: guest start → tutorial vs Pip → tutorial results → Home → ranked match (or house-player fallback) → round → results → rematch. Plus Practice, Leaderboard, Profile (avatar picker), Settings, Report, Update-required, **[NEW]** sign-in flow, rank ladder.

Non-negotiables:
- Original identity. Never reuse GamePigeon styling.
- Nothing may depend on iOS-only UI. The board runs in a mobile browser and on desktop.
- Colour is never the only signal (§14).
- **[CHANGED]** Computer players are always identifiable as computer players (§6.4), but the label is a friendly "HOUSE PLAYER", not a warning.
- The busy, loud atmosphere belongs to gameplay and matchmaking. Navigation screens stay calm and flat. This holds on desktop too (§10).

---

## 2. Identity

Name: **Scrawl**, working name only, not checked for trademark or store availability.
Direction: "sticker-sheet pop". Thick ink outlines, hard offset shadows, flat saturated colour, chunky type.
Themes: **Butter** (light, default) and **Night** (dark). Both ship in release 1. Every new screen has a Night version or is covered by the same tokens.

---

## 3. Design tokens

### 3.1 Colour
Theme tokens (unchanged): `bg`, `dot`, `text`, `muted`, `card`, `cardText`, `line`, `shadow`, `tile`, `board` as in v1.1 (Butter `#FFD84A` / Night `#17142E` background, card `#FFFFFF` / `#2A2552`, text `#141414` / `#FFF6D6`, line and shadow `#141414` / `#0B0A1A`, muted `#3B3B3B` / `#C9C3E8`, tile white and board Cobalt in both).
**[NEW]** `soft`: hairline dividers inside cards. Butter `rgba(20,20,20,.08)`, Night `rgba(255,246,214,.10)`.

Fixed accents: Cobalt `#2F4BFF`, Bubblegum `#FF5FA2`, Mint `#19D3A2`, Butter `#FFD84A`, Ink `#141414`, Paper `#FFFFFF`, Hatch grey `#D3D3E0`. Rules unchanged: text on Bubblegum, Mint, Butter is Ink; on Cobalt is white; never Bubblegum text on white.

**[NEW]** Tier colours, used only inside tier chips: Bronze `#E39A5B`, Silver `#DADDE8`, Gold `#FFD84A`, Platinum `#9FE8F2`, Diamond `#2F4BFF`, Legend `#141414` (Butter text).
**[NEW]** Avatar backgrounds come from the accent set only (Butter, Mint, Bubblegum, Cobalt, Ink, cream `#FFF6D6`).

### 3.2 Type
Unchanged: Bricolage Grotesque 400–800 for display and UI, Space Mono 400/700 for labels, numbers, tags. **[NEW]** Desktop uses the same sizes; the extra space comes from layout, except the 72px score numerals on the desktop board rails and the 84px welcome headline.

### 3.3 Shape
Unchanged: 3px ink outlines (2px on small chips), hard offset shadows, dot background on gameplay, matchmaking, Welcome and results screens only. **[NEW]** Desktop rule: dots fill the whole window on gameplay and matchmaking, are **absent** elsewhere, where the extra width is plain Butter with four sparse confetti shapes in the corners.

### 3.4 Spacing
Phone frame 390×844, top safe padding 56, bottom 28–34, gutters 12–20. **[NEW]** Desktop frame 1440×900: 76px top nav, content column 520–620px centred (board screens use the three-column layout in §10.2).

### 3.5 Theme selection  **[v2.1]**
- **Butter is the default on every platform and first launch,** whatever the phone, browser or OS is set to. The OS light/dark setting is **ignored**.
- Settings → **Appearance** switches between Butter and Night (§5, Settings). The choice is stored on the device (and on the account when signed in; a different device keeps its own choice until changed there). It applies instantly, no restart.
- Because Night is now opt-in, every screen still needs both themes, but Night does not need to be the first thing reviewed.

---

## 4. Components

### 4.1 Tile and board
Unchanged on phone (plate 366, tile 80, gap 8, states and chain as v1.1). **[NEW]** The board is parametrised by tile size and gap; sizes used: phone 80/8, desktop 128/12, mobile web 80/8 → 76/8 (§10.4). Tile radius = 20% of tile; plate radius = 8.2% of plate width. Two new pointer states:

| State | Fill | Extra |
|---|---|---|
| Hover (mouse only) **[NEW]** | pale butter `#FFF1A8` | lifts 3px, shadow grows, cursor = pointing hand |
| Keyboard / screen-reader focus **[NEW]** | idle | 4px Cobalt outline, 3px offset |

### 4.1b Board layouts by screen size  **[v2.1]**
The 390×844 mockups were the only size drawn in v2.0. The native apps now use two layouts of the same screen:

| | **Full layout** | **Compact layout** |
|---|---|---|
| Used when | width ≥ 390 **and** height ≥ 720 | width < 390 **or** height < 720 |
| Typical devices | iPhone 12–16 and Plus/Max, most Android phones ≥ 390dp wide | iPhone SE and mini (375), many Android phones (360dp), short screens |
| Top padding | 56 (real inset, no fake status bar) | the real safe-area inset + 4 |
| Score cards | 88–96px tall, 28px avatars, 40px score | ~58px tall, 24px avatars, 26px score, 3-line text |
| Timer | 74px | 58px |
| Word display | 62px | 48px |
| Found words | bounded row, 38px (§4.6) | same row |
| Tutorial coach card | 52px avatar, 15–16px text | 44px avatar, 13px text |

**One tile formula, both layouts and the mobile web build:**
`tile = min(80, floor((min(W − 24, A − 160) − 22 − 3·gap) / 4))`, gap 8, where **W** is the width and **A** is the height left after real safe-area insets (status bar, home indicator, browser bars). Plate = 4·tile + 3·gap + 22. 160 is the header block (cards + word display + row + gaps). Full layout results in 80; below that:

| Screen (W × H) | Insets (top/bottom) | A | Tile | Plate |
|---|---|---|---|---|
| 390×844 iPhone 14 | 59/34 → full layout | 751 | 80 | 366 |
| 375×812 iPhone 13 mini | 50/34 → compact | 728 | 76 | 350 |
| 375×667 iPhone SE | 20/0 (+4/+14 padding) → compact | 629 | 76 | 350 |
| 360×640 Android | 24/0 (+4/+16 padding) → compact | 596 | 72 | 334 |
| 360×592 short Android | 24/48 | 520 | 64 | 302 |

The board stays bottom-anchored (thumb zone); any spare height is plain dotted background between the found-words row and the board. Never scale a tile below 56px: below that, show a "This screen is too small to play" card. Mockups: `Board-360`, `Tutorial-360`, `Board-Last10-360`, `Board-HighScore-360`, `Board-375`, `Tutorial-375`, `Board-Last10-375`.

### 4.2 Score cards  **[CHANGED]**
Two cards flanking the timer. Left = you (`card` fill), right = opponent (Bubblegum, Ink text). **[CHANGED]** each card starts with a **28px avatar** (no level badge at this size) next to the mono name, then the score (40/800), then the bottom line:
- you: mint "▲ AHEAD n" when leading, white "▼ BEHIND n" when trailing.
- human opponent: `RATING 1,655`.
- **[CHANGED]** house player: an Ink pill `LV 3 · SKILLED`. **Decision: a house player shows its level, never a rating,** because levels are fixed and a rating would imply it sits on the leaderboard.
- **[NEW]** disconnected human: score dims to 55%, white pill `DISCONNECTED` with a wifi-off icon.
- The opponent's "+300" tag pops above their card as before.
Names are shortened to the username without the country (country shows on Reveal and Results; the header is too cramped).

**Five-digit scores [v2.1]** (`Board-HighScore`, `Board-HighScore-360`, `Results-HighScore`). Scores can pass 10,000, so the numeral steps down by character count (the comma counts), never wraps and never truncates:

| Characters | Example | Board card (full) | Board card (compact) | Results | Desktop rail |
|---|---|---|---|---|---|
| ≤ 5 | `3,700` | 40px | 26px | 44px | 72px |
| 6 | `12,400` | 34px | 22px | 38px | 61px |
| 7 | `100,200` | 30px | 19px | 33px | 54px |

Both cards on a screen use their own size (they may differ). If the two Results numerals differ in length, both use the smaller size so they line up. Mono delta chips (`+1,600`, `AHEAD 500`) keep their size.

### 4.3 Timer
Unchanged (circle 74–78px, Space Mono, last-10 s treatment in §13).

### 4.4 Time bar: REMOVED  **[DECIDED]**
Confirmed from v1.1. Do not build it.

### 4.5 Word display
Unchanged (pending, valid, already found, invalid). **[NEW]** On desktop it sits beside the timer, 540px wide, same states.

### 4.6 Found-word chips  **[v2.1]**
**One bounded row, on every phone layout.** v2.0 let the chips wrap into rows above the board; a good round finds 20–30 words, so that pushed the board. Now:
- A single horizontal strip, **38px tall** (30px in the compact layout's spacing), under the word display. It never grows, so the board never moves.
- **Newest first, at the left.** The newest valid word is Mint with its points ("SPEND +600"); older chips follow in the old slight-tilt cycle. The row snaps back to the start whenever a word is added.
- Overflow scrolls sideways (drag or swipe; not needed during play). The right edge fades out, and a **count pill** (Ink, Butter numerals, "22") is pinned at the right end.
- **Duplicate:** the existing chip jumps to the front, turns Butter with a dashed outline and wiggles (±3°) once, as before.
- Desktop keeps wrapped chips inside the left-rail "YOUR WORDS" card, which is capped at ~330px tall and fades at the bottom; it scrolls inside the card.
- The opponent's words stay hidden until the round ends on every platform; the right rail shows only their count.

### 4.7 Buttons and cards
Unchanged. **[NEW]** Disabled primary button: `#CFC8AE` fill, `#4A4A4A` text, lock icon, caption says why ("NEEDS INTERNET").

### 4.8 Avatars  **[CHANGED]**
The slot is still a fixed circle with a 3px outline (2px at 34px, 4px at 92px). Sizes: **34** (lists; 28 in the board header), **40–44** (headers), **52** (practice rows), **92** (reveal, profile; picker preview 120–130). Two families, deliberately different so a player never reads as a computer:

| | House players | Players |
|---|---|---|
| Subject | animals | people, shoulders up |
| Fill | face runs edge to edge | bust sits lower, lots of background showing |
| Badge | white level badge (1–5) bottom-right from 40px up | never a badge |
| Backgrounds | one fixed colour per character | any accent colour |

Art for both at every size: `screens/specs/Spec-Avatars.png` (and `-Dark`). Source art is plain SVG in a 100×100 viewBox (`source/generator/avatars.js`); export it as vector assets for the app. It is a first pass; have an illustrator refine it before launch.

### 4.9 Tier chip  **[NEW]**
Pill, 2px outline (3px at size L), glyph + name in Space Mono 700. The tier family sets colour **and** glyph (shield Bronze/Silver, star Gold, hexagon Platinum, gem Diamond, crown Legend); one centre dot (II) or two dots (I) set the division. Rank never depends on colour alone. Sizes: **L** (Home, Profile), **M** (Reveal, ladder), **S** (score and leaderboard rows). `screens/specs/Spec-Tiers.png`.

### 4.10 House-player tag and level pips  **[NEW]**
- Tag: Ink pill, white mono text: `HOUSE PLAYER` (Reveal, tutorial results) or `HOUSE PLAYER · LV 3` (Finding, Results).
- Level pips: five 9×16 bars filled up to the level, on Practice rows and the Reveal card.
- Level badge on the avatar: §4.8.

### 4.11 Sign-in buttons  **[NEW]**
Use the platform's official components so they pass review. **Do not add the ink outline or hard shadow to Apple or Google buttons;** place them on a white card. The mockups draw them 54px tall with 12px radius, which both guidelines allow. "Email me a link" is ours: `card` fill, 3px ink outline. Order is platform-appropriate: Apple first on iOS and Safari, Google first on Android and other browsers; email always last.

### 4.12 Toasts and banners  **[NEW]**
- Toast: 3px ink outline, radius 18, `4px 5px 0` shadow, icon + bold title (+ optional line). Under the status bar on phone (over the found-word area on the Board so scores stay visible); top-right, 360px wide on desktop. 4 s, tap or click to dismiss, announced politely to screen readers.
- Kinds: **info** Ink fill (white text), **warning** Butter, **error** Bubblegum, **success** Mint. Always icon plus words. Specimen: `Toasts`.
- Banner (inline, not auto-dismissing): same shape, 14px text; used for offline and opponent-disconnected on the Board.

---

## 5. Screens

Filenames refer to `screens/phone/` (390×844) and `screens/desktop/` (`D-` prefix, 1440×900). Night versions have the `-Dark` suffix.

1. **Welcome** (`Welcome`). **[CHANGED]** adds a quiet link "I already have an account" under Let's play (→ SignIn). Still "NO SIGN-UP · YOU'LL PLAY AS A GUEST". Desktop `D-Welcome`: headline and CTA left, a live-looking board right.
2. **Tutorial** (`Tutorial`). **[CHANGED]** opponent is **Pip** with his chick avatar (28px in the header, 52px with level badge in the coach card). Coach label "PIP · YOUR PRACTICE PARTNER". The E hint is a dashed Bubblegum outline. Desktop: the coach card replaces the left-rail words card.
2b. **Tutorial results** (`TutorialResults`). **[CHANGED]** avatars for you and Pip; Pip tagged `HOUSE PLAYER` / `PIP · LV 1`; a new line "Pip will be around in Practice and when the lobby is quiet" so players learn the cast exists. **[DECIDED]** still no rating, no rematch, no report, no sign-in prompt; Continue → Home.
3. **Home** (`Home`, `-Dark`, `-Offline`). **[CHANGED]** header avatar is a player avatar; tier chip is the L chip and "SEE ALL RANKS ›" opens the ladder (§8); the Practice tile shows two overlapping house-player avatars instead of a robot glyph. **[NEW]** Offline variant: black banner "You're offline. Ranked needs a connection. Practice still works.", Play disabled with lock and "NEEDS INTERNET". Desktop: only two shortcut cards (Practice, Ranks) because the top nav carries navigation.
4. **Finding a match** (`Finding`, `-Dark`). Unchanged. **[CHANGED]** fallback variant `FindingBot`: the house player's avatar at 92px, headline **"Bolt stepped up"** (replaces "Nobody nearby"), tag `HOUSE PLAYER · LV 3`, one sentence: "Quiet right now, so Bolt, one of our house players, is taking this one. A computer opponent at your level. It counts for your rating." Bar full at "0:10 · FOUND". **[DECIDED]** the "BOTS ARE ALWAYS LABELLED" pill is removed (the tag plus that sentence do the job without sounding like a warning). **[DECIDED]** the card outline stays **solid**; dashed is reserved for "not counted / not real" (duplicate words, locked items, guest chip).
5. **Reveal** (`Reveal`, `RevealBot`, `-Dark`). **[CHANGED]** both cards use 92px avatars and tier chips (human) or level pips (house player). House-player variant: headline **"BOLT STEPPED UP"** (Butter), Bubblegum card with solid outline, tag `HOUSE PLAYER`, `LEVEL 3 · SKILLED`, three pips, "plays like Gold". Note: "Bolt is a computer player at your level. Same board, same 80 seconds, and it counts for your rating."
6. **Board** (`Board` and variants). **[CHANGED]** header has avatars (§4.2). **[v2.1]** found words are one bounded row (§4.6); small phones use the compact layout (§4.1b; `Board-360`, `Tutorial-360`, `Board-Last10-360`, `-375` versions); five-digit scores (`Board-HighScore`, `Board-HighScore-360`, `Results-HighScore`). **[NEW]** states: `Board-VsBolt`, `Board-Disconnected`, `Board-Offline`, `Board-Forfeit`, `Board-Toast`, `Board-Access` (§11.6). Existing: tracing, valid, already found, invalid, last 10 s, tutorial. Desktop: §10.2.
7. **Results** (`Results`, `ResultsLoss`, `-Dark`). **[CHANGED]** both score columns have 34px avatars; the words card shows the first 8 words per side plus "+n" on phone (the full list on desktop and via tap); best-missed row unchanged. **[NEW]** `Results-VsBolt`: "YOU BEAT BOLT!", opponent tagged `HOUSE PLAYER · LV 3`, button "Play Bolt again · LEVEL 3 · SKILLED". **[v2.1]** `Results-HighScore` shows `12,400` vs `11,900` (§4.2). **[NEW]** `Results-Walkover`: headline "THEY LEFT" (Butter), opponent tagged `LEFT THE MATCH`, normal win and rating change. **[NEW]** `MatchCancelled`: opponent never reached the board; no rating change, mint pill "RATING UNCHANGED · 1,642", Find a new rival / Home.
8. **Practice** (`Practice`, `-Dark`). **[CHANGED]** five rows with the new avatars (52px with badge), name, one-liner, `LV n · LABEL` and level pips. **Bolt carries a "NEAREST YOU" pill** (the house player whose band contains the player's rating). Copy: "Pick a house player. Unranked, so your rating never changes. Works offline." Footer link "MEET THE HOUSE PLAYERS ›" → **[NEW]** `Cast` (one card per character: 72px avatar, intro line, band).
9. **Leaderboard** (`Leaderboard`, `-US`, `-Dark`, `-Empty`). **[CHANGED]** rows use 34px player avatars; the pinned "You" row adds an S tier chip. **[DECIDED]** house players never appear; a footer says so ("HUMAN PLAYERS ONLY · HOUSE PLAYERS ARE NEVER RANKED"; delete it if noisy). **[NEW]** Empty state: dashed trophy circle, "No scores here yet", "Play ranked" button, pinned row shows "—".
10. **Profile** (`Profile`, `-SignedIn`, `-Dark`). **[CHANGED]** 92px player avatar, the edit pencil opens the picker, tier chip L + rating. **[PROPOSED]** "Beaten 3 of 5 house players" strip with the five avatars (unbeaten ones greyscale at 35%, "NEXT: NOVA · LV 4"); delete the strip to drop collection mechanics. Guest: cobalt "Keep your progress" card with a Sign in button (opens SignIn). **[NEW]** Signed in: the card becomes a quiet row "Signed in with Apple · a•••@icloud.com · on every device" with Manage (→ Settings).
11. **Settings** (`Settings`, `-SignedIn`, `-Dark`). **[v2.1]** a new **APPEARANCE** group sits at the **top** (above SOUND AND FEEL) in the same card style: two selectable swatch tiles side by side, **Butter** ("The default look") and **Night** ("Easier on the eyes"). Each tile shows a mini preview (background and dots, a white letter tile, a Bubblegum tile, a Cobalt disc); the selected one has a 4px Cobalt ring and a check badge; tap switches immediately. `Settings-Dark` shows Night selected. Desktop: same card, same position (`D-Settings`, `D-Settings-Dark`). **[CHANGED]** adds an ACCESSIBILITY group: **Tap-to-spell board**, **Reduce motion**. ACCOUNT group: guest shows "Playing as a guest · Progress lives on this device only" with Sign in, and a "Delete progress" row; signed in shows avatar, name, provider and masked email, **Sign out**, and "Delete account" (Bubblegum). Sign out keeps the account, returns the device to a fresh guest state, and shows a "Signed out" toast.
12. **Report** (`Report`). Unchanged. Close → Results.
13. **Update required** (`Update`). Unchanged. **[NEW]** caption notes Android back does nothing here (§12).
14. **Avatar picker** (`AvatarPicker`, `-Dark`) **[NEW]** §7.
15. **Rank ladder** (`Ladder`) **[NEW]** §8.
16. **Sign in** (`SignIn`, `SignIn-Android`, `SignIn-Dark`), **Email** (`MagicLink`, `MagicLink-Error`), **Check your email** (`CheckEmail`), **Progress kept** (`ProgressKept`), **Ranked gate** (`RankedGate`) **[NEW]** §9.
17. **Meet the house players** (`Cast`) **[NEW]** §6.
18. **Toasts specimen** (`Toasts`) **[NEW]** §4.12.
19. **Mobile web board** (`MobileWeb-Board`, `MobileWeb-Board-Small`) and **pointer states** (`Pointer-States`) **[NEW]** §10.

### Click-through order in the mockups
Welcome → Tutorial → Tutorial results → Home → Play → Finding → Reveal → Board (tracing → valid → duplicate → invalid → last 10) → Results → Rematch or Home. Home → Practice → Cast. Home → Ranks → Leaderboard; Home rating card → Ladder; Profile → avatar pencil → Picker; Profile or Settings → SignIn → CheckEmail → ProgressKept.

---

## 6. The house-player cast  **[NEW]**

### 6.1 Roster

| Level | Name | Animal, background | Personality | Meets players rated | Tier families |
|---|---|---|---|---|---|
| 1 EASY | **Pip** | chick, Mint | wide-eyed, friendly, slow ("just discovered words") | up to 1,399 | Bronze **[v2.1: was "Bronze, Silver II"]** |
| 2 CASUAL | **Dash** | hare, Butter | tongue out, one ear flopped, quick but sloppy | 1,400–1,599 | Silver (II and I) |
| 3 SKILLED | **Bolt** | cat in shades with a lightning mark, Bubblegum | cool, unbothered, solid all-rounder | 1,600–1,799 | Gold |
| 4 HARD | **Nova** | owl with star pupils and round glasses, Cobalt | has read the dictionary, finds the long ones | 1,800–2,099 | Platinum, Diamond II |
| 5 BRUTAL | **Titan** | polar bear, furrowed brows and a scar, Ink | focused, hardly misses | 2,100+ | Diamond I, Legend |

**[DECIDED] Keep the names.** Short, one syllable each, they already encode the ladder (Pip is small, Titan is huge) and none can be mistaken for a username. Human-style names ("Steve") are friendlier but make "is this a person?" ambiguous, which the labelling rule forbids. Reserve all five names (case-insensitive, including simple leetspeak variants) so no player can register them.

Species and colour are the main readable signal; each also has a unique **silhouette** at 34px (chick tuft, tall ears, pointed ears with shades, owl ear tufts, round ears on black). The colour doubles as the character's accent wherever it appears.

### 6.2 Where they appear
Tutorial (always Pip), Practice (player picks), ranked fallback (the one whose band contains the player's rating; if ambiguous pick the higher), Profile "met" strip **[PROPOSED]**. **Never** on leaderboards, in friend challenges or in any "recent opponents" list.

### 6.3 Matching rule
Search up to ~10 s for a human within the normal rating window. On timeout, FindingBot ("stepped up") for the nearest band. **[DECIDED]** fallback matches **count for rating** with the normal formula (the player is told on Finding, Reveal and Results). **[PROPOSED]** product may later damp swings against house players; the screens work either way.

### 6.4 Labelling  **[DECIDED]**
- Where a human shows a country chip or rating, a house player shows the tag **HOUSE PLAYER** and a **level** (pips on Reveal and Practice; `LV n · LABEL` pill on the Board header and Results).
- The "BOTS ARE ALWAYS LABELLED" pill is **removed**; a one-sentence plain explanation on Finding and Reveal ("Bolt is a computer player at your level") replaces it. Clearer and less accusatory.
- The dashed card outline is **removed**; Reveal and Finding cards are solid.
- Never present a house player as a person: no country, no online dot, never on a leaderboard, results always say HOUSE PLAYER.

### 6.5 Voice
Characters have no chat. Their voice is the intro line (`Cast`) and the one-liners on Practice. Result headlines name them ("YOU BEAT BOLT!", "BOLT STEPPED UP").

---

## 7. Player avatars and the picker  **[NEW]**

### 7.1 Default set (free, 8)
Sprout, Haze, Marlow, Juno, Kit, Ash, Wren, Teddy. People, shoulders up, varied skin tones, hair, glasses, hat, beard; backgrounds from the accent set. New accounts get one at random; guests keep theirs on sign-in. The set is deliberately **not** animals, has no badge, and sits smaller in the slot, so any list shows at a glance who is a person.

### 7.2 Picker (`AvatarPicker`, `D-AvatarPicker`)
Reached from Profile's pencil. Back + title, live 120px preview ringed in Cobalt, **STARTERS · FREE** card (4×2 grid of 70px avatars with names; the selected one gets a Cobalt ring and check badge), **MORE SOON** card (dashed, no shadow, four locked slots), cobalt **Use this one** (→ Profile). Selecting a tile updates the preview; saving shows a mint toast "Avatar saved".

### 7.3 Room for locked and premium items  **[PROPOSED]**
Locked slot: dashed 3px circle, `#E9E4D0` fill, greyed silhouette, lock badge, caption `LOCKED` or `PREMIUM` (Butter badge). Tapping opens the store when it exists; until then it is inert. **Delete the "MORE SOON" card** if you don't want to tease it in release 1; nothing else depends on it. The store itself is not designed.

---

## 8. Tier ladder  **[DECIDED]**

Each tier splits into II then I in 100-point steps; one top tier.

| Tier | Rating | | Tier | Rating |
|---|---|---|---|---|
| Bronze II | 1,200–1,299 | | Platinum II | 1,800–1,899 |
| Bronze I | 1,300–1,399 | | Platinum I | 1,900–1,999 |
| Silver II | 1,400–1,499 | | Diamond II | 2,000–2,099 |
| Silver I | 1,500–1,599 | | Diamond I | 2,100–2,199 |
| Gold II | 1,600–1,699 | | **Legend** | 2,200+ |
| Gold I | 1,700–1,799 | | | |

New players start at 1,300 (Bronze I). Rating never drops below 1,000; 1,000–1,199 shows as Bronze II (no separate lower tier). Legend shows the rating only (no divisions). Chips: §4.9, specimen `Spec-Tiers`. The **Ladder** screen (`Ladder`, from "SEE ALL RANKS ›" on Home) lists the 11 tiers top-down with range, a "YOU" marker on the current (Butter) row, and the face of the house player met in that band (Bronze II/I Pip, Silver II/I Dash, Gold II/I Bolt, Platinum II/I and Diamond II Nova, Diamond I and Legend Titan; **[v2.1]** Silver II was wrongly shown as Pip's); a footnote states the start rating and the floor. Consistent with the sample data: 1,642 → Gold II, "58 TO GOLD I".

---

## 9. Accounts  **[NEW]**

### 9.1 Rules
- One profile works on iOS, Android and web. Guests play without signing up and keep progress on the device.
- **Methods:** Sign in with Apple, Sign in with Google, **email magic link [v2.1: DECIDED, no longer proposed]** (no passwords).
- **Web ranked needs an account [v2.1: DECIDED, no longer proposed].** Web guests cannot play ranked (they can play Practice); in the native apps guests can still play ranked.
- Apple and Google are offered on every platform so a profile made on one platform opens on another. Order follows the platform (§4.11).

### 9.2 Flows
1. **Sign-in sheet** (`SignIn`, `-Android`, `-Dark`; desktop is a centred 460px modal over dimmed Home). Title "Save your progress", one sentence, three buttons, caption "NO PASSWORDS · YOU CAN KEEP PLAYING AS A GUEST". Entry points: Profile card, Settings, Welcome link, Home header on web.
2. **Email** (`MagicLink`): one field, "Send me a link" (disabled until the address is valid; `MagicLink-Error` shows the inline message), note "The link works for 15 minutes, once. Your guest progress comes with you."
3. **Check your email** (`CheckEmail`): MAIL tile wordmark, masked address, "Open mail app", "Resend in 0:24" (30 s cooldown), "Different email", and a note about opening the link on another device (that device signs in, this one follows). The "simulate tapping the link" text exists only in the clickable mockup.
4. **Progress kept** (`ProgressKept`): confetti, slam "PROGRESS KEPT!", player card (avatar, name, tier chip, rating, wins/losses/best word), a row naming the provider, Continue → Home.
5. **Web ranked gate** (`RankedGate`; phone width for mobile web, desktop modal): "Sign in to play ranked", explanation, the three methods, then "Practice instead" and "Get the app", caption "IN THE APP YOU CAN PLAY RANKED AS A GUEST".

### 9.3 Edge rules (behaviour, not pictured)
- Signing in on a device with guest progress **to an account that already has progress**: ask which to keep (modal, two cards "This device: 1,310" / "Your account: 1,642", default account). Never silently merge ratings.
- Failed or cancelled sign-in: error toast ("Sign-in was cancelled. Nothing changed."); user stays where they were.
- Expired or reused link: error toast "That link has expired" with a button to send a new one.
- Username is chosen once at first sign-in (prefilled from the guest name) and may not equal a reserved house-player name (§6.1).
- Sign out keeps the account and clears the device; "Signed out" toast.

---

## 10. Web and desktop  **[NEW]**

### 10.0 Build order  **[v2.1]**
The **native apps (iOS and Android) ship first.** The full web version (ranked on web, the desktop layouts in §10.2–10.3, web sign-in and the ranked gate) comes in a later iteration. The desktop designs stay as the target; **do not trade any phone-app quality, performance or code structure for web.** Practical consequences: build the shared `Board` and tokens so they *can* run on web, but do not add desktop breakpoints, pointer states or the web gate to the first native release.

### 10.1 Principle
The phone screens are the product. On a big screen the board scales up and nothing else gets louder. **Gameplay and matchmaking** get the dot background across the whole window; **everything else** is a calm Butter field with a slim top nav and one centred column. (This is the suggested approach, kept; the improvement is the three-column board layout in §10.2 that uses the width for the two players instead of padding.)

### 10.2 Layouts at 1440×900 (all in `screens/desktop/`)
- **Top nav (non-gameplay)** 76px, `card` fill with a 3px bottom line: SCRAWL tile wordmark, pill links Play / Practice / Ranks / Profile (active = Ink fill, Butter text), right side avatar + name + S tier chip (guest: "GUEST" + Sign in). It replaces the phone's three small cards and settings circle (Settings is reached from Profile).
- **Content column** 520–620px, centred. Home, Practice, Cast, Leaderboard (and variants), Ladder, Profile, Settings, Avatar picker (620), Report, Update, Welcome (two-column, 1,100), results, the sign-in flow. Spacing, cards and type are the phone's; nothing is stretched.
- **Matchmaking and reveal**: dots, nav reduced to the wordmark, same cards scaled 1.25×.
- **Board (the one new layout):** three columns, 34px gaps. Left rail 300px: *you* card (64px avatar, name, tier chip, 72px score, AHEAD/BEHIND pill) and a "YOUR WORDS" card. Centre: timer (84px circle) and word display on one row above the board; board with **128px tiles, 12px gap (plate 570px)**. Right rail 300px: opponent card (Bubblegum) and "KAIJUMO HAS FOUND 8 words / Their words stay hidden until the round ends". Slim top bar: wordmark left, `RANKED · 80 SEC` and **Leave** right (→ forfeit dialog). Board states on desktop: tracing (with cursor), valid, hover, duplicate, invalid, last 10 s, vs Bolt, disconnected, toast, forfeit, tutorial (coach card replaces the words card), and Night for tracing and valid.
- **Modals** (sign-in, ranked gate, forfeit, picker as a page): dimmed 55% black overlay, centred 440–480px card with 4px ink outline and `8px 10px 0` shadow; Esc closes (on the Board, Esc opens the forfeit dialog).
- Minimum supported window 1,024×720. Below 1,280 wide, rails drop to 240px; below 1,024 use the phone layout centred with the board at 80/8.

### 10.3 Mouse and trackpad  (`Pointer-States`, `D-Board-Hover`, `D-Board`)
- **Hover** a tile: pale butter fill, lifts 3px, pointing hand. Nothing selects until the button is pressed.
- **Press and drag**: the chain starts on button-down; tiles press in pink with numbered badges; the cursor becomes a closed hand and a dashed Butter halo (1.3× tile) follows it. Same hit-test forgiveness as touch (§15).
- **Release** submits; valid mint / duplicate butter dashed / invalid hatched with shake. Dragging off the board keeps the chain; Esc or right-click clears it.
- Keyboard: Tab moves through buttons; on the board, arrow keys move focus, Space or Enter toggles a tile into the word, Enter on the word submits, Backspace undoes (same model as tap-to-spell, §11.6).
- Trackpad scroll must never move the page during a round.

### 10.4 Mobile browser: the board still fits  (`MobileWeb-Board`, `MobileWeb-Board-Small`)
Browser chrome eats height, so the web build uses a compact header and **never scrolls during a round**:
- No fake status bar; top padding 8. Score cards shrink to ~58px tall (24px avatars, 26px scores), timer 58px, word display 48px, found words become **one horizontally scrolling row** (30px, fade at the right edge).
- **Tile rule [v2.1: unified with the native apps, §4.1b]:** `tile = min(80, floor((min(W − 24, A − 160) − 22 − 3·gap) / 4))`, gap 8, with A = viewport height minus the 8px top and 10px bottom padding. Examples: 390×664 (iPhone Safari with both bars) → 80; 375×548 (small phone) → 76; 360×480 (small Android) → 64.
- Use `100dvh`, not `100vh`, and recompute on `visualViewport` resize (toolbars sliding). Disable pull-to-refresh and overscroll on the board (`overscroll-behavior: none`, `touch-action: none` on the plate).
- Below a 340px-wide or 440px-tall viewport show a "Rotate or enlarge your window" card instead of a cramped board.

---

## 11. Missing states  **[DECIDED]**

### 11.1 Offline
- Before a match: `Home-Offline` (banner, Play disabled "NEEDS INTERNET"). Practice fully works against the house players, which run on-device. Leaderboard and Profile show cached data with a small "OFFLINE" mono tag; sign-in and ranked buttons are disabled with the same explanation.
- During a round: `Board-Offline`. The round keeps running on the local clock; black banner "You're offline. Reconnecting… your words are saved on this phone for 15 s." with a countdown. Reconnect inside 15 s: the banner disappears and play continues. After 15 s the match is abandoned and counts as a disconnect for you (a loss).

### 11.2 Opponent disconnects mid-round  (`Board-Disconnected`, `D-Board-Disconnected`)
Their score **freezes** (dimmed to 55%) with a white `DISCONNECTED` pill. A Butter banner: "Kaijumo lost connection. Their score is frozen — keep playing. If they don't return, you win by walkover." You play to the end of the 80 s. If they rejoin they resume from their frozen score. If they never return: `Results-Walkover` ("THEY LEFT"), normal win and rating change. If they drop **before** the board appears: `MatchCancelled`.

### 11.3 Match cancelled  (`MatchCancelled`)
Card with the opponent's avatar and an ✕ badge, "Match cancelled", reason, mint pill "RATING UNCHANGED · 1,642", cobalt Find a new rival, Home. Triggers: opponent never loads; server fault before the first word.

### 11.4 Empty leaderboard  (`Leaderboard-Empty`)
Dashed trophy, "No scores here yet", one sentence ("Nobody has finished a ranked round yet." or "Nobody in the United States has finished a ranked round yet.") plus "Play a ranked match to claim the top spot.", and a "Play ranked" button. **[v2.1]** Release 1 has **no weekly reset**: the leaderboard ranks current ratings, so the earlier "resets every Monday" line is gone.

### 11.5 Errors, toasts, dialogs  (`Toasts`, `Board-Toast`, `Board-Forfeit`)
Toast copy is plain and says what happens next: "Couldn't reach Scrawl. Check your connection and try again." / "Connection is slow. Your score is still counting." / "That link has expired. Links work for 15 minutes. Send a new one." / "Sign-in was cancelled. Nothing changed." Success: "Avatar saved", "Signed out". **Forfeit dialog** (iOS ✕, Android back, desktop Leave or Esc): "Leave the round?", "Leaving counts as a loss. Your opponent keeps their score and you lose rating.", cobalt **Keep playing**, secondary **Forfeit**. Permission prompts: release 1 asks for nothing at launch. Notifications (daily challenges, later) get a pre-prompt card in the sticker style at the moment of value, never on first launch.

### 11.6 Screen-reader flow for the board  (`Board-Access`)
Dragging is hard or impossible with VoiceOver/TalkBack, so there is an alternate **tap-to-spell** mode (Settings → Accessibility; **auto-offered the first time a screen reader is detected**). Layout: compact line (`YOU 3,700 · KAIJUMO 3,100`, timer), word display, three large controls **Undo / Clear / Submit** (54px), the board with a "TAP LETTERS IN ORDER" tag, and a caption of what is announced.
- Tiles are 16 buttons in reading order. Label: "E, row 3 column 1", and once a tile is selected, adjacent tiles add "next to N"; non-adjacent tiles read "not adjacent" and are disabled.
- Announcements (polite, debounced): "Selected: O, N. Word so far: ON, 2 letters." On submit: "STRIDE, 6 letters, plus 1,000. Total 4,700." Invalid: "SRT is not a word." Duplicate: "STRIDE already found."
- Timer announces every 20 s and at 10, 5, 3, 2, 1; opponent score changes are **not** announced (too chatty); a "What's the score?" action reads both.
- Reduce motion disables shake, pulses, confetti and bobbing; the icon and text signals already carry the meaning.

---

## 12. Android  **[DECIDED]**

Launches together with iOS from the same Expo/React Native code.
- **Back button / gesture** behaves like the in-app back arrow on every screen that has one. **On the Board it opens the forfeit dialog** (`Board-Forfeit`); pressing back again closes the dialog. On **Update required it does nothing.** On Home, back exits the app (standard). During Finding, back = Cancel. On Results, back = Home.
- Sign-in shows **Google first, Apple second**, then email (`SignIn-Android`). Use Google's official button and Apple's web flow.
- Insets: honour status-bar and gesture-bar insets with the same 56px top / 34px bottom padding as iOS; never draw a fake status bar. Edge-to-edge on Android 15+.
- Many Android phones are 360dp wide, so they use the **compact board layout** (§4.1b; `Board-360`) **[v2.1]**.
- Hard shadows need the underlay-view technique (§15), because `elevation` can't draw them.

---

## 13. Round feedback: what the player sees, hears, feels
**[v2.1]** `Board-Last10` (and the compact versions) draw the 6px pulsing Bubblegum screen frame from §13's last-10 treatment; v2.0's mockup had left it out by mistake. Otherwise unchanged from v1.1: word reward ladder 3/4/5/6/7/8+ letters = 100/300/600/1,000/1,600/2,400 (placeholders), non-colour signals per state, audio/haptics/animation intent (**not built yet**; rallying round music, tile ticks rising a semitone, win/loss jingles, per-state haptics, squash/pop/slam animation). **[NEW]** On desktop: same sounds; hover has no sound; haptics are skipped.

---

## 14. Accessibility  **[CHANGED]**
- Colour is never the only signal (tile states, tier chips carry glyph and division dots, toasts carry icon and words, DISCONNECTED has an icon).
- Tap targets ≥ 44px; desktop pointer targets ≥ 32px. Proper roles (`accessibilityRole`, switch semantics, radios in Report).
- Contrast ≥ 4.5:1 (Ink on Butter/Mint/Bubblegum and tier colours; white on Cobalt and Diamond; cream on Night cards).
- Icon-only buttons need labels (Back, Settings, Report, Change avatar, Close).
- Avatars have alt text: house players "Bolt, house player, level 3"; players "Avatar: Marlow".
- Reduced motion disables shakes, pulses, bobbing, confetti and the slam animation.
- Screen-reader board flow §11.6; keyboard flow §10.3; focus ring Cobalt 4px.

---

## 15. Implementation guidance (suggestions, not design requirements)
Everything in v1.1 still applies (theme object, fonts, StickerBox for hard shadows, tiled dot background, pan-gesture board with forgiving hit radius of ~60–70% of half a tile, plain-TypeScript game logic, shared web components). **[NEW]** additions:
- **Avatars:** ship the 13 avatars (5 + 8) as vectors (`react-native-svg`) from `source/generator/avatars.js`; slot, border and badge are code, not art. Locked slots are one component with a `kind` prop.
- **Tier chip:** one `TierChip({tier, size})` driven by the table in §8; glyph and dots drawn in code.
- **Board:** one `Board` component with `tile`, `gap`, `mode` props for phone (80/8), desktop (128/12) and mobile web (formula §10.4). Web pointer states from `onPointerEnter/Down/Move/Up` alongside the native pan gesture.
- **Platform split:** `Platform.select` for sign-in button order, `BackHandler` on Android, and the desktop shell (top nav + rails) at ≥ 1,024px width.
- **House players** are plain TypeScript profiles keyed by id (level, accuracy, speed, word-length bias, rating band); the same code runs server-side for ranked fallback and on device for Practice and the tutorial. Never store a house player as a user row; avatars are chosen by id only.
- **Magic link:** universal links (iOS), app links (Android) and a web route; the one-time token binds to the account, not the device.

---

## 16. Planned, not designed yet (leave room, do not build)
- **[CHANGED]** Avatar customisation now has its picker (§7). Purchasable avatars and the **store** come later; a coin count would sit in the Home header beside the avatar. Locked slots are placeholders (§7.3).
- Minigames, daily challenges, story mode (other grids: 3×3 ≈108px, 4×4 80px, 5×5 ≈64px, 6×6 ≈52px tiles; harder letters; bonus tiles). Story mode could reuse the house players as characters.
- Friend matches by link (browser, never affects rank, head-to-head tally).
- Ads and in-app purchases: no placeholder slots.

---

## 17. Open decisions
1. Final name and trademark/store check for "Scrawl". **Still open** (working name; keep it behind one constant).
2. Rating treatment of house-player matches. Still open on the product side. Current screens assume fallback matches count for rating with the normal formula (`Results-VsBolt` shows +14). Engineering has floated a **hidden fixed rating per house player** inside its band (e.g. Pip 1,300, Dash 1,500, Bolt 1,700, Nova 1,950, Titan 2,200); if that is chosen, the screens need no change because house-player ratings are never displayed.
3. Optional extras still **[PROPOSED]** until decided: "Beaten 3 of 5" strip, "MORE SOON" locked avatars, leaderboard footer.
Closed in v2.1: email magic link (yes), web guests playing ranked (no).
Resolved earlier: tier ladder, missing states, Android back, Apple/Google equivalent, time bar, tutorial ending.

---

## 18. Assumptions made in v2 (tell the design chat if any is wrong)
1. **Names kept** (Pip, Dash, Bolt, Nova, Titan) and reserved from usernames; animals, never humanoid.
2. Bands: Pip ≤1,399, Dash 1,400–1,599, Bolt 1,600–1,799, Nova 1,800–2,099, Titan 2,100+. Fallback uses the band containing the player's rating, so a Gold II player meets **Bolt**. v1's fallback character "Echo" is retired.
3. House players show **level, not rating**; the Board header shows `LV n · LABEL`.
4. "BOTS ARE ALWAYS LABELLED" pill **removed** and dashed Reveal/Finding outline **removed**; replaced by the HOUSE PLAYER tag and one plain sentence.
5. Fallback matches **count for rating** with the normal formula.
6. Eight default avatars (people) is enough for release 1; the picker shows four locked placeholders.
7. Tier ladder as §8; new players start 1,300; floor 1,000 displayed as Bronze II; no tier below 1,200.
8. Desktop = centred column for calm screens and a three-column rail layout for gameplay; **not** a stretched phone. Minimum 1,024px wide.
9. Mobile web never scrolls during a round and uses the tile formula in §10.4.
10. The "Beaten 3 of 5" strip, locked-slot teaser and the leaderboard footer stay **[PROPOSED]** and dropable (instructions at each). **[v2.1]** Magic link and web-needs-account are now decided.
11. Apple and Google shown on all platforms, order platform-specific; official buttons unmodified, on a white card (no ink outline).
12. Magic link valid 15 minutes, single use; resend cooldown 30 s.
13. Offline grace mid-round is 15 s; opponent disconnect = freeze, walkover win if they don't return; before the board appears = cancelled, no rating change.
14. Android back on Board = forfeit dialog; on Update = nothing; on Home = exit.
15. Screen-reader users get tap-to-spell (auto-offered), timer announced every 20 s, opponent score not announced.
16. Signing into an existing account with different guest progress asks which to keep (default: account).
17. No permission prompts at first launch.
18. The 26 v1 screens in `screens/v1-archive/` are kept for comparison; v2 versions share filenames under `screens/phone/`.
19. PNGs were rendered from the HTML mockups with local copies of Bricolage Grotesque and Space Mono. The SVG avatar art is a first pass and worth an illustrator's review before final export.
20. In the board header, opponent country is dropped (cramped); it still shows on Reveal and Results.

### Assumptions added in v2.1
21. Full layout threshold is **width ≥ 390 and height ≥ 720** (engineering suggested ~760; the new one-row found-words strip needs only ~680, so 720 leaves margin). A 375-wide phone is always compact even when tall (the 366 plate would not fit).
22. Compact layout always shows the found-words as one scrolling row and, in the tutorial, a smaller coach card; spare height stays empty above the board.
23. Minimum tile is 56px; below that a "too small to play" card (not drawn).
24. Found-words row snaps back to newest on each new word; duplicate chip jumps to the front.
25. Score numerals step down by character count (table in §4.2); I stopped at 7 characters (`100,200`), beyond that use the 7-character size.
26. Theme choice is per device (and synced to the account when signed in); the OS appearance setting is never read. Appearance sits at the **top** of Settings because it changes how every other row looks.
27. No weekly reset in release 1 (you gave two options; I took the first). The empty leaderboard copy is rewritten accordingly.
28. The house-player rating decision and the three optional extras were left blank in the brief, so they are still open/PROPOSED (§17).
29. Settings on desktop uses the same Appearance card in the same position; desktop Settings is reached from Profile, as in v2.0.
30. The Last-10 frame omitted in v2.0's mockup is restored (it was in the v2.0 text).
31. Reveal screens re-export differently only because of the pulsing countdown animation; they did not change.

---

## 19. Screen index (file → status)

| File | Status |
|---|---|
| Welcome, Home, Practice, Leaderboard, Leaderboard-US, Profile, Settings, Report, Update | **[CHANGED]** (avatars, tier chip, account, copy) |
| Home-Offline, Leaderboard-Empty, Profile-SignedIn, Settings-SignedIn | **[NEW]** |
| Finding, FindingBot, Reveal, RevealBot | **[CHANGED]** (house-player framing) |
| Board, Board-Valid, -Dupe, -Invalid, -Last10, Tutorial, TutorialResults | **[CHANGED]** (avatars) |
| Board-VsBolt, -Disconnected, -Offline, -Forfeit, -Toast, -Access | **[NEW]** |
| Results, ResultsLoss | **[CHANGED]** |
| Results-VsBolt, Results-Walkover, MatchCancelled | **[NEW]** |
| AvatarPicker, Cast, Ladder, Toasts | **[NEW]** |
| SignIn, SignIn-Android, MagicLink, MagicLink-Error, CheckEmail, ProgressKept, RankedGate | **[NEW]** |
| MobileWeb-Board, MobileWeb-Board-Small, Pointer-States, Spec-Avatars(-Dark), Spec-Tiers | **[NEW]** |
| Board-360, Tutorial-360, Board-Last10-360, Board-HighScore-360, Board-375, Tutorial-375, Board-Last10-375, Board-HighScore, Results-HighScore, D-Board-HighScore, D-Results-HighScore | **[v2.1] [NEW]** |
| Board, -Valid, -Dupe, -Invalid, -Last10, -VsBolt, -Disconnected, -Offline, -Toast, -Forfeit (+ Night) and their `D-` versions | **[v2.1] [CHANGED]** (one-row found words; Last-10 frame) |
| Settings, Settings-SignedIn, Settings-Dark (+ `D-`) | **[v2.1] [CHANGED]** (Appearance toggle) |
| Ladder, D-Ladder | **[v2.1] [CHANGED]** (Silver II shown as Dash's) |
| Leaderboard-Empty, D-Leaderboard-Empty | **[v2.1] [CHANGED]** (no weekly reset copy) |
| D-* (57 desktop screens in v2.0, 59 now) | **[NEW]** |
| `-Dark` variants | Night versions of Home, Finding, FindingBot, Reveal, RevealBot, Board, Board-Valid, Board-VsBolt, Results, Results-VsBolt, Practice, Leaderboard, Profile, Settings, AvatarPicker, SignIn (+ desktop Night for the same where listed) |
