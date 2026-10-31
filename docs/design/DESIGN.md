# DESIGN.md — Scrawl (working name)

Source of truth for the UI of a competitive mobile word-hunt game. Written from the approved mockups (the "Scrawl flow" page of the design canvas). When this file and a mockup disagree, this file wins; when this file is silent, ask or record the question in `docs/design/OPEN_QUESTIONS.md` rather than inventing a look.

Canvas (design-side reference, may not be reachable from tooling): https://claude.ai/artifact/R4qSWPexqZPyX7vyDWjgGz
Mockup sources: `docs/design/source/*.dc.html` (HTML mockups, 390×844. They use a custom runtime and are **reference only, not code to import**).

---

## 1. Product in one paragraph

A 4×4 grid of letters and an 80-second timer. The player drags a finger across adjacent tiles (diagonals included) to spell words of 3+ letters. Longer words score disproportionately more. Two players get the same board; the higher total wins. Ranked quick-match against players worldwide (like 8 Ball Pool does for pool), with labelled bots covering an empty lobby. Inspired by GamePigeon's Word Hunt but must not look like it (no wood, tan tiles, green highlight).

Audience: teens and young adults, iPhone first (US), Android later from the same Expo/React Native codebase. Short, repeated sessions; they care about beating people.

Release 1 loop: guest start → tutorial vs easy bot → Home → ranked match (or bot fallback) → round → results → rematch. Plus Practice, Leaderboard, Profile, Settings, Report, Update-required.

Non-negotiables:
- Original identity. Never reuse GamePigeon styling.
- Nothing may depend on iOS-only UI. The board must also run in a mobile browser (friend challenge links, later).
- Colour is never the only signal (see §8).
- Bots are always labelled as bots.
- The busy, loud atmosphere belongs to gameplay and matchmaking. Navigation screens stay calm and flat.

---

## 2. Identity

Name: **Scrawl** — working name only, not checked for trademark or store availability.
Direction: "sticker-sheet pop". Thick ink outlines, hard offset shadows, flat saturated colour, chunky type. Cheeky and tactile, like stickers slapped on a table.
Themes: **Butter** (light, default) and **Night** (dark). Both ship in release 1.

---

## 3. Design tokens

### 3.1 Colour

Theme-dependent (set on the screen root, read everywhere):

| Token | Butter (light) | Night (dark) | Use |
|---|---|---|---|
| `bg` | `#FFD84A` | `#17142E` | screen background |
| `dot` | `rgba(20,20,20,.13)` | `rgba(255,246,214,.07)` | dot pattern (gameplay screens only) |
| `text` | `#141414` | `#FFF6D6` | text on `bg` |
| `muted` | `#3B3B3B` | `#C9C3E8` | secondary text on `bg` |
| `card` | `#FFFFFF` | `#2A2552` | cards, list containers, secondary buttons |
| `cardText` | `#141414` | `#FFF6D6` | text on `card` |
| `line` | `#141414` | `#0B0A1A` | outlines |
| `shadow` | `#141414` | `#0B0A1A` | hard shadows |
| `tile` | `#FFFFFF` | `#FFFFFF` | tile face (stays white in both themes) |
| `board` | `#2F4BFF` | `#2F4BFF` | board plate |

Fixed accents (same in both themes):

| Name | Hex | Role |
|---|---|---|
| Cobalt | `#2F4BFF` | primary action, board plate, progress fill, "VS" backdrops. Text on it is white. |
| Bubblegum | `#FF5FA2` | opponent, selected tiles, invalid, loss, danger fills |
| Mint | `#19D3A2` | valid, win, "you", ahead chips, ON toggle |
| Butter | `#FFD84A` | highlights, duplicate state, tier chip, chain colour while tracing |
| Ink | `#141414` | outlines, text on bright fills, numbered badges |
| Paper | `#FFFFFF` | tiles, chain on valid word |
| Hatch grey | `#D3D3E0` | stripe partner for invalid tiles |

Rules: text on Bubblegum, Mint and Butter is always Ink. Text on Cobalt is always white. Never put Bubblegum text on white (fails contrast).

### 3.2 Type

- **Bricolage Grotesque** (400–800): all display and UI text. Most headings and buttons use 800.
- **Space Mono** (400, 700): labels, tags, timers, ratings, word-list chips, numbers that should feel mechanical.

Scale used in the mockups (px / weight):
- Display: 44–54 / 800 (welcome headline 54, "Time for an update" 44, results headline 44, Play 50)
- Screen title: 32 / 800
- Score numerals: 34 / 800 (header cards), 44 / 800 (results), 96 / 800 (Home rating)
- Word being traced: 42 / 800, letter-spacing .08em
- Tile letter: 40 / 800
- Card title / row: 17–21 / 800
- Body: 15–19 / 500–600
- Mono label: 11–13 / 700, letter-spacing .04–.14em, uppercase
- Timer: Space Mono 25 / 700 (30 in last 10 s)

### 3.3 Shape

- Outline: **3px solid `line`** on every card, button, tile, chip (chips and small pills use 2px).
- Radii: tile 16, board plate 30, score card 16, cards 20–28, buttons 22–28, pills 99.
- Hard shadows, no blur, colour = `shadow`:
  - cards: `4px 5px 0` (large cards `5px 6px 0`)
  - tiles and buttons use a "step": `0 5px 0` (Play button `0 8px 0`)
  - pressed tile: `0 1px 0` plus `translateY(4px)`
- Dot background: 18px grid, 1.5px dots, colour `dot`. Used on Welcome, Finding, Reveal, Board, Results only. **Not** on Home, Practice, Leaderboard, Profile, Settings, Report, Update.
- Tap targets ≥ 44px. Primary buttons 68–104px tall.

### 3.4 Spacing

Frame 390×844. Top safe padding 56 (leave room for the real status bar, never draw a fake one). Bottom padding 28–34. Horizontal gutters 12–20. Gaps 10–16 between stacked cards.

---

## 4. Components

### 4.1 Tile and board (the most important component)

- Board plate: width 366 (border-box), padding 8, border 3, radius 30, fill `board`, shadow `5px 6px 0`. Inner area 344×344.
- Grid: 4×4, tile 80×80, gap 8. **Tile size scales with grid size** (see §10).
- Tile states:

| State | Fill | Extra |
|---|---|---|
| Idle | `tile` | border 3 Ink, radius 16, shadow `0 5px 0` Ink |
| Selected (tracing) | Bubblegum | pressed (`0 1px 0`, down 4px), numbered badge |
| Valid word | Mint | pressed, numbered badge |
| Already found | Butter | pressed, 3px **dashed** Ink outline, offset 2 |
| Invalid | white/`#D3D3E0` 45° stripes, 6px bands | pressed, numbered badge |
| Hint (tutorial) | idle | 3px dashed Bubblegum outline, offset 2 |

- Numbered badge: 20px circle, Ink fill, Butter text, Space Mono 11/700, top-left offset 3px, shows order 1..n.
- Letters are always Ink on tiles.
- Chain (path through the traced tiles), drawn as an SVG polyline between tile centres (centre = 40 + col×88, 40 + row×88): an Ink stroke width 20 underneath, a coloured stroke width 9 on top, round caps and joins.
  - tracing: Butter solid
  - valid: Paper solid
  - already found: Butter dashed `14 12`
  - invalid: Bubblegum dotted `1 16`
  - tutorial hint: Butter dotted `2 12`, width 6, from last traced tile to the hint tile
- The board sits at the bottom of the screen (thumb zone). Scores and timer sit at the top. The traced word sits directly above the board.

### 4.2 Score cards

Two cards flanking the timer. Left = you (`card` fill), right = opponent (Bubblegum fill, text Ink). Content: mono label (YOU / OPPONENT NAME · COUNTRY), score 34/800, and a bottom line: for you a mint chip "▲ AHEAD n" when leading, else your username; for the opponent their rating (or "LEVEL 1 · EASY" for a bot). When the opponent scores, a small white "+300" tag pops above the card for a moment.

### 4.3 Timer

Circle 78px (92px in last 10 s), border 3, shadow `3px 4px 0`, Space Mono time `M:SS`. Normal: fill `text`, text `bg`. Last 10 s: Bubblegum fill, Ink text, pulsing ring, "LAST 10!" sticker (see §7).

### 4.4 Time bar (OPEN DECISION)

Currently a row of 10 outlined segments, each = 8 s, filled segments = time remaining, emptying right to left. It duplicates the timer and is unlabelled. Recommended change: a single bar that drains smoothly with the clock (or remove it). Do not build the 10-segment version until this is decided; see OPEN_QUESTIONS.

### 4.5 Word display (above the board)

Height 64, radius 16, border 3, shadow `4px 5px 0`. Word centred, 42/800, tracked. Variants:
- Pending (tracing): card fill, dashed empty circle on the left, letter count on the right (mono 11).
- Valid: card fill, Mint check circle, plus a cobalt "+points" sticker (rotated 5°, top-right) and a starburst word-tier label (see ladder §7).
- Already found: dashed outline, Butter repeat icon, word at 70% opacity, Butter "ALREADY FOUND" sticker.
- Invalid: Bubblegum fill, Ink circle with white ✕, shakes for ~400 ms, white "NOT A WORD" sticker.

### 4.6 Found-word chips

Wrapping row under the word display, newest first, slightly rotated (−1.5°, 1°, −1°, 1.5° cycle). Chip: 2px outline, radius 10, shadow `2px 2px 0`, 13px. Newest valid chip is Mint and shows its points ("SPEND +600"). On a duplicate, the existing chip turns Butter with a dashed outline and wiggles.

### 4.7 Buttons and cards

- Primary (Play): cobalt, white text, radius 28, 104px tall, shadow `0 8px 0`, play-glyph circle (Butter) on the right.
- Other primary CTAs (Let's play, Update now, Send report, Rematch): cobalt, 68–88px tall.
- Secondary: `card` fill, `cardText`, 3px outline, radius 18–22, shadow `3px 4px 0` / `4px 5px 0`.
- Circular icon buttons (back, settings): 44px, `card` fill.
- Pills/tags: 2–3px outline, 99 radius, mono 10–12.
- Toggle: 76×42 pill, outline 3. ON = Mint fill, "ON" label left, white knob right. OFF = transparent, "OFF" label right, `card` knob left. Real switch semantics (`role="switch"`, `aria-checked`).
- Segmented control (leaderboard): two pills; selected = `text` fill with `bg` text and a check icon; unselected = `card`.
- Radio rows (report): 60px rows; selected = Butter fill with Ink filled radio and check.
- Progress bar: 16–20px tall, 3px outline, cobalt fill with a 3px right edge.

### 4.8 Avatars

Round, shoulders-up slot, 3px outline, sizes 34 (lists), 40–44 (headers), 52 (practice), 92 (reveal/profile). Release 1 uses a flat colour with a simple glyph (triangle for "you", circle for the rival, robot for bots). **This slot is where custom avatars go later**; keep it a fixed circle so a bust illustration can replace the glyph without layout changes.

---

## 5. Screens (release 1)

Each section lists purpose, layout (top to bottom), content, links. Mockup filenames in `source/`.

1. **Welcome** (`Welcome.dc.html`). First run. Dot background. Six rotated, bobbing tiles spell SCRAWL (S Bubblegum, C white, R Mint, A white, W Cobalt, L Bubblegum) with a cobalt squiggle beneath; pink "1v1" starburst top-right. Headline "Find words. Beat people." Subcopy "80-second word battles. Climb the ranks against players around the world." Bottom: cobalt "Let's play" (88px) → Tutorial. Caption "NO SIGN-UP · YOU'LL PLAY AS A GUEST".
2. **Tutorial** (`Tutorial.dc.html`, board in tutorial mode). Practice vs Pip (easy bot, level 1). Score cards 0 / 0, timer 1:18. A coach card replaces the found-word chips: bot avatar + "PIP · YOUR PRACTICE BOT" + "Drag across touching letters. Diagonals count! Slide on to the E to finish ONE." The player has traced O→N, the E tile has a dashed pink hint and a dotted hint line. Ends on Home.
3. **Home** (`Home.dc.html`). Flat, calm. Header: avatar + username (left), settings circle (right). One rank card: tier chip "GOLD II", RATING label, 96px rating "1,642", progress bar, "58 TO GOLD I". Then the Play button, then three equal 100px cards: Practice, Ranks, Profile. Nothing else. No bottom bar, no recent results, no season text.
4. **Finding a match** (`Finding.dc.html`). Dots. Top: "RANKED · 80 SEC" and the player's rating. One centre card: 2×2 bobbing tiles spelling FIND, "Finding a rival", "Looking for players around 1,642.", a progress bar with "0:04" and "UP TO 0:10". Cancel pill below (→ Home). **Bot variant** (`FindingBot.dc.html`): "Nobody nearby", "Bringing in a bot near your rating, 1,640.", a Butter "BOTS ARE ALWAYS LABELLED" pill, bar full at "0:10". Matching rule: ~10 s then a bot near the player's rating.
5. **Opponent reveal** (`Reveal.dc.html`). Headline slam "MATCH FOUND!" (Mint). Two 92px-avatar cards side by side with a "VS" disc between: you (card fill) and the rival (Bubblegum): name, country chip, tier, rating (e.g. kaijumo, JP, 1,655). Note card: "Ranked · same board for both of you · 80 seconds. Higher total wins." Bottom: round cobalt countdown "STARTING IN 3" → Board. **Bot variant** (`RevealBot.dc.html`): "BOT MATCH", the rival card has a **dashed** outline, robot avatar, a solid-Ink "BOT" tag instead of a country, name Echo, rating 1,640, and the note says plainly that a bot stepped in.
6. **Board** (`Board.dc.html` and variants). Header (score cards + timer), time bar, word display, chips, board plate. States: tracing, valid, already found, invalid, last 10 s, tutorial. See §7.
7. **Results** (`Results.dc.html`, `ResultsLoss.dc.html`). Dots. Slam headline "YOU WIN!" (Mint) or "SO CLOSE" (Bubblegum). Scoreboard card: both scores 44/800, "WINNER" tag under the winner. Rating card: old rating → new rating (e.g. 1,642 → 1,659), delta pill (▲ +17 Mint / ▼ −15 Bubblegum), progress bar with "41 TO GOLD I". Words card: two columns of every word each player found; words only that player found are Butter with a ★. "BEST WORDS YOU MISSED": three dashed tiles with word and points (ASTRIDE +1,600, CHARTS +1,000, SATIRE +1,000). Fixed bottom bar: large pulsing cobalt **Rematch** ("Run it back" on a loss) with "VS KAIJUMO · 1,655", then Home and a flag icon button (→ Report). Win has confetti shapes behind the headline.
8. **Practice** (`Practice.dc.html`). Back + "Practice", "Pick a bot. Unranked, so your rating never changes." Five rows, each: coloured bot avatar, name, one-line description, level label and a 5-bar meter. Bots: Pip (EASY), Dash (CASUAL), Bolt (SKILLED), Nova (HARD), Titan (BRUTAL).
9. **Leaderboard** (`Leaderboard.dc.html`, `Leaderboard-US.dc.html`). Back + title, segmented control Global | United States, a card of 8 rows (rank, avatar, username, country chip, rating), and a pinned bottom row for the player (Bubblegum): "#4,218 / You · wordfox_ / GOLD II / 1,642" (country tab: "#612").
10. **Profile** (`Profile.dc.html`). Back + title. 92px avatar with an edit pencil, username 30/800, chips "US" and a dashed "GUEST". Rating card (GOLD II, 1,642). 2×2 stats: WINS 38, LOSSES 21, BEST WORD ASTRIDE, HIGH SCORE 5,240. Guest prompt card (cobalt): "Keep your progress" with a black **Sign in with Apple** button. Use Apple's official button component in the build.
11. **Settings** (`Settings.dc.html`). Back + title. SOUND AND FEEL: Sound effects, Music, Haptics toggles. ACCOUNT: "Playing as a guest" with a Sign in button; full-width Bubblegum "Delete account" row with a trash icon. Footer "SCRAWL 1.0.0 (42)".
12. **Report a player** (`Report.dc.html`). Close X (→ Results) + "Report kaijumo". Radio list: Offensive username or avatar / Cheating or using a tool / Harassment or abusive behaviour / Something else. Optional details textarea. Cobalt "Send report". Reached from the flag on Results. The match result is unaffected.
13. **Update required** (`Update.dc.html`). Centre: three stacked tiles with an up arrow, "Time for an update", "This version of Scrawl is out of date. Update to keep playing ranked matches.", cobalt "Update now", caption "VERSION 1.0.2 OR NEWER REQUIRED". Blocking, no dismiss.

Dark variants (`Home-Dark`, `Board-Dark`, `Board-Valid-Dark`, `Results-Dark`) show the Night theme. Every screen should support both themes via tokens.

### Click-through order in the mockups
Welcome → Tutorial → Home → (Play) Finding → Reveal → Board (tracing) → valid → already found → invalid → last 10 s → Results → Rematch (→ Reveal) or Home. From Home: Practice, Ranks (Leaderboard), Profile, Settings. Results flag → Report → Results.

---

## 6. Sample data used in the mockups (reuse for fixtures and Storybook)

Board (row-major): `C H A S / L O R T / E N I E / P S D A`

All of these are findable on it: STRIDE, ASTRIDE, CHART, CHARTS, CLONE, CLONES, SPEND, SATIRE, HORN, HORNS, EDIT, TIDE, ARID, SEND, LENS, ONE, DIN.

Final match: wordfox_ **4,800** (STRIDE, CHART, CLONE, SPEND, LENS, SEND, ARID, TIDE, HORN, EDIT, ONE, DIN) beats kaijumo **4,400** (SATIRE, CLONES, CHART, HORNS, LENS, SEND, TIDE, ARID). Rating 1,642 → 1,659 (+17) against a 1,655 opponent.

Players: wordfox_ (US, 1,642, Gold II), kaijumo (JP, 1,655), Echo (bot, 1,640). Practice bots: Pip, Dash, Bolt, Nova, Titan. Leaderboard names: mxlr_ (KR), quillbert (US), sawdust.ln (GB), haru_no_ji (JP), papaya_pete (BR), ellisonw (US), zoe.bee (AU), tomkat_ (CA).

Tiers: Gold II starts at 1,600, Gold I at 1,700 (implied by the mockups). Full tier ladder is not designed yet.

---

## 7. Round feedback: what the player sees, hears, feels

### Word reward ladder (placeholder numbers, tune in playtests)

| Letters | Points | Label | Extra |
|---|---|---|---|
| 3 | 100 | none | tiny tick, small "+100" pop |
| 4 | 300 | none | bip, "+300" pop |
| 5 | 600 | NICE! | double chime |
| 6 | 1,000 | GREAT! | starburst, confetti, fanfare |
| 7 | 1,600 | AMAZING! | screen shake, riser, crowd cheer |
| 8+ | 2,400 | LEGENDARY! | full-board flash, stinger |

### States and their non-colour signals

| State | Signals (colour is never the only one) |
|---|---|
| Valid | check icon, "+points" sticker, Mint tiles, white chain, rising sound, medium haptic |
| Already found | repeat icon, dashed outline, "ALREADY FOUND" tag, old chip wiggles, soft "bonk", double-tap haptic |
| Invalid | ✕ icon, hatched tiles, dotted chain, "NOT A WORD" tag, 200–400 ms shake, buzz, error-notch haptic |
| Last 10 s | bigger Bubblegum timer, pulsing ring, 6px pulsing Bubblegum frame around the screen, "LAST 10!" sticker, tick every second |
| Win / loss | words "YOU WIN!" / "SO CLOSE", WINNER tag, up or down arrow with the rating change |

### Audio, haptics, animation (design intent; **not built yet**)
- Music: rallying upbeat loop during rounds, builds in the last 10 s (tempo up, filter opens). Ducks under big-word stings. Menus stay quiet: a light bed or silence.
- Tile touch: soft tick rising a semitone per letter. Opponent score: faint tick, quiet. Round start: 3-2-1 beeps and horn. Round end: buzzer then win or lose jingle. Rating bar fills with a rolling count-up.
- Haptics: light per tile, medium on valid, heavy on 7+, double on duplicate, flat notch on invalid.
- Animation: tiles squash on press (~80 ms), chain draws live under the finger, valid-word tiles pop in sequence, points fly to the score card, score rolls up, new chip drops in with a bounce, results headline slams in, Rematch bounces/pulses.
- Respect reduced-motion. Sound and music toggles live in Settings.

---

## 8. Accessibility

- Colour is never the only signal (table above).
- Tap targets ≥ 44px. Real buttons/links in the mockups; use proper roles in the app (`accessibilityRole`, switch semantics for toggles, radios for report reasons).
- Text contrast ≥ 4.5:1 (checked for Ink on Butter/Mint/Bubblegum, white on Cobalt, cream on Night cards).
- Icon-only buttons need labels (Back, Settings, Report, Change avatar).
- Reduced-motion must disable shakes, pulses, bobbing and confetti.
- A screen-reader path through the board is an open question (see OPEN_QUESTIONS).

---

## 9. Implementation guidance (suggestions for the React Native build, not design requirements)

- Put the tokens in §3 in one theme object with `light` and `dark` variants; every component reads colours from it. Skins later swap `tile`, tile outline, `board`, selection colours and chain colours only.
- Fonts: Bricolage Grotesque and Space Mono (e.g. via `@expo-google-fonts`). Load before first paint.
- Hard shadows: iOS supports `shadowRadius: 0` with an offset; Android `elevation` cannot do a hard coloured offset, so build the shadow as a sibling or underlay `View` offset by 4–6px. Make one shared `StickerBox` component so this is solved once.
- Dot background: a tiled SVG pattern or a repeated small image on gameplay screens only.
- Board input: use a pan gesture over the whole plate; hit-test tiles by distance from tile centre with a forgiving radius (about 60–70% of half a tile) so diagonal slides do not trigger the wrong tile. Draw the chain with `react-native-svg`. Run animations on the UI thread (Reanimated).
- Keep game logic (grid generation, adjacency, trace validation, dictionary lookup, scoring, bot) in plain TypeScript with unit tests, separate from UI, so the same logic can run server-side for ranked matches and in the browser for friend links.
- Share components with the web build (react-native-web or equivalent) so the board runs in a mobile browser without native-only controls.

---

## 10. Planned, not designed yet (leave room, do not build)

- **Avatar customisation**, shoulders-up, bought with game currency earned from wins, dailies and story levels. A coin count would sit in the Home header beside the avatar. Store skins share the same currency.
- **Store** for board and tile skins. The skin swaps only tile/board/selection/chain colours; layout never changes.
- **More modes**: minigames, daily challenges, and a **story mode** for single play (level map in the sticker style, characters per stop). These may use other grids and harder letters. New modes appear on Home as cards above the three small buttons (or a strip behind Play); Play stays the single hero.
- **Other grids**: tile size scales within the same 344px inner area.

| Grid | Tile size |
|---|---|
| 3×3 | about 108 px |
| 4×4 | 80 px |
| 5×5 | about 64 px |
| 6×6 | about 52 px |

Above 6×6 diagonal swiping gets too tight on small phones. Non-square shapes (diamond, hex) fit the same plate. Harder letter sets (Q, Z, X, QU) and bonus tiles (double letter, triple word as a corner sticker) are possible.
- **Friend matches by link**: an app user sends a challenge link, the friend plays in a mobile browser with no download, never affects rank. Each pair has a running head-to-head tally (e.g. "Anna 3 – 2 Sam") shown on the link's chat preview card and in the score header.
- **Ads and in-app purchases**: coming later. Do not add placeholder slots now.

---

## 11. Open decisions

1. Time bar: smooth single bar, or remove? (§4.4)
2. Final name, and a trademark/store-availability check for "Scrawl".
3. Full tier ladder (names and rating bands beyond Gold I/II).
4. Does the tutorial get its own tiny results screen, or keep ending on Home?
5. Missing states: offline / no connection, opponent disconnects mid-round, match cancelled, empty leaderboard, error toasts, first-launch permission prompts (notifications, haptics), screen-reader flow for the board.
6. Android specifics: back behaviour, status bar insets, the equivalent of Sign in with Apple.
