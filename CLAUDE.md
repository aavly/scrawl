# Scrawl (placeholder name)

The name may change, so keep it out of code identifiers, file names and package names. It belongs in app config and user-facing copy only.

A competitive word hunt game: a 4x4 letter grid, 80-second rounds, swipe adjacent tiles to make words. It is inspired by GamePigeon's Word Hunt, plus ranked matches against players worldwide. The goal is to grow and monetize it. One Expo codebase serves iOS and Android (launching together) and the web (any browser, including desktop). The app's focus is social play with friends through messages.

Repository: https://github.com/aavly/scrawl

## Design

**All UI follows [docs/design/DESIGN.md](docs/design/DESIGN.md).** Read the relevant sections before building or changing any screen or component.

- **Precedence:** when DESIGN.md and a mockup disagree, DESIGN.md wins. When a newer entry in [docs/DECISIONS.md](docs/DECISIONS.md) contradicts DESIGN.md, the decision wins until DESIGN.md is updated. The first part of [OPEN_QUESTIONS.md](docs/design/OPEN_QUESTIONS.md) lists the user decisions DESIGN.md hasn't caught up with yet (for example, the theme toggle, and that the full web version waits for iteration 2).
- **Visual reference:** the PNGs in [docs/design/screens/](docs/design/screens/) (`phone/`, `desktop/`, `specs/`; `v1-archive/` is old). After building a screen, compare it with its PNG and report deviations.
- **Mockups:** [docs/design/source/](docs/design/source/) holds the HTML mockups. Use them to look up exact values only, never import or port their markup. Serve the folder over HTTP to render them. `source/generator/avatars.js` has the SVG art for all 13 avatars.
- **When DESIGN.md is silent:** don't invent a look. Add the question to [docs/design/OPEN_QUESTIONS.md](docs/design/OPEN_QUESTIONS.md), build the most conservative option, and flag it in your reply.
- **Tokens:** every colour, font, radius and shadow comes from the one theme object (Butter light, Night dark) built from DESIGN.md §3. No hard-coded hex values in components.
- **Hard-shadow look:** use the shared `StickerBox` component, never a one-off shadow.
- **Feedback states:** valid, already found and invalid each need their non-colour signals exactly as DESIGN.md §7 specifies.
- **Busy visuals** (dot background, stickers, confetti) appear only on gameplay and matchmaking screens. Navigation screens stay flat.
- **Don't build anything in DESIGN.md §16** ("Planned, not designed yet"), but keep grid size, tile size and the avatar slot parameterised.
- **Build to the roadmap, not the design's scope.** DESIGN.md covers every stage. Screens and features outside the current roadmap stage are reference for later only. Treat the design as guidance, not gospel: when a spec would obstruct building the game (it doesn't fit, contradicts itself, or misses a state), log it in OPEN_QUESTIONS.md and tell the user, rather than building around it silently.

## Current stage

**Stage 1: playable game.** A full round against bot characters with no backend, focused on gameplay feel and the head-to-head experience. A few Stage 0 items carry on alongside it (final name, design follow-ups, monetization confirmation). Details and checklist are in [docs/ROADMAP.md](docs/ROADMAP.md).

## Every session

1. **Before starting**, read the current stage in [docs/ROADMAP.md](docs/ROADMAP.md) and keep the work inside it. If a request belongs to a later stage, say which stage and ask before pulling it forward.
2. **Check [docs/DECISIONS.md](docs/DECISIONS.md)** before choosing a library, a service or a product behaviour.
   - Don't reopen a decided item unless the user does.
   - A "proposed" item needs the user's confirmation before you build on it.
3. **When finishing**, update the docs in the same change as the work:
   - Tick completed items in the roadmap and update the "Current stage" line above when a stage's exit criteria are met.
   - Add any new decision to the decision log, with the date and who made it.
   - When code exists, keep the Commands and Layout sections below current.
4. **When the user changes a requirement or makes a decision in conversation**, update every affected doc in the same turn, even when no code is involved. Strike superseded decisions through instead of deleting them, and add anything the design chat needs to [docs/design/OPEN_QUESTIONS.md](docs/design/OPEN_QUESTIONS.md).

## Docs

| File | What it holds | Read it when |
|---|---|---|
| [docs/ROADMAP.md](docs/ROADMAP.md) | Stages, checklists, exit criteria | Every session |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Decided, proposed and open decisions | Before any choice |
| [docs/design/DESIGN.md](docs/design/DESIGN.md) | Tokens, components, every screen, sample data, round feedback | Any UI work |
| [docs/design/OPEN_QUESTIONS.md](docs/design/OPEN_QUESTIONS.md) | Design questions waiting on the design chat | Before building something DESIGN.md doesn't cover |
| [docs/PRODUCT.md](docs/PRODUCT.md) | Game rules and the features in each iteration | Building or changing features |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack, backend, anti-cheat, release pipeline | Building infrastructure or backend |
| [docs/DESIGN_BRIEF.md](docs/DESIGN_BRIEF.md) | The original prompt that produced the design (historical) | Rarely |

## Product rules that are easy to get wrong

- **Friendlies never affect rank.** These are matches started from a challenge link.
- **The web is a full platform, not a teaser,** arriving in iteration 2. Ranked play will work on the web too, and until then the game code must still run in a browser. The app's reason to install is the social and messaging experience, so don't gate web features to push installs.
- **One profile everywhere.** A signed-in player has the same rating, stats and rivalries on web and app. Guests can play without signing up.
- **Bots are a known cast**, not anonymous "BOT" opponents and not disguised as people. They never appear on leaderboards.
- **Don't copy GamePigeon's name or visual design.** Apple rejects copycat apps. The mechanics can be familiar.
- **The server decides scores.** Clients send swipe paths, and the server checks them against the board, the dictionary and the clock.

## Commands

```bash
npm install                 # install dependencies
npx expo start              # dev server; scan the QR code with Expo Go on a phone
npx expo start --web        # run in the browser
npm run typecheck           # TypeScript check
npm test                    # unit tests (Jest); the game engine is covered in src/game/__tests__
node scripts/build-dictionary.js  # rebuild the word list after changing anything in data/
npx expo-doctor             # check dependency and config issues
npx expo install <package>  # ALWAYS add packages this way, so versions match the Expo SDK
node scripts/generate-avatars.js  # re-copy avatar art after the design files change
```

Run the typecheck and the tests before declaring any task done.

## Expo notes

- **Expo SDK 58 is newer than your training data.** Before using an Expo, EAS or React Native API, check the versioned docs at `https://docs.expo.dev/versions/v58.0.0/` or the index at https://docs.expo.dev/llms.txt instead of answering from memory.
- **Expo Go only includes its bundled native modules.** Everything so far runs in Expo Go. Adding a library with other native code means switching to a development build, so check before adding one.
- **Never create or edit `ios/` or `android/`.** They are generated. Configure native behaviour in `app.json` and config plugins.

## Layout

- `src/app/`: Expo Router routes only. Every file is a screen, `_layout.tsx` files define navigators. `index.tsx` is currently a temporary specimen page (avatars, tier chips, theme switch).
- `src/theme/`: design tokens from DESIGN.md §3 (`tokens.ts`, the only place raw UI colours live), `ThemeProvider` with `useTheme` and `useThemeChoice`, font assets.
- `src/game/`: plain TypeScript game logic and data, no React. Runs in the app, the browser and later the server.
  - `tiers.ts` (rank ladder) and `housePlayers.ts` (the cast and how each plays).
  - `engine/`: board, traces, dictionary, scoring, solver, board generator, a player's round, house-player round plans, rating maths and plausibility checks. `words.generated.ts` is built from `data/` and never edited by hand.
  - `__tests__/` and `__fixtures__/` (the DESIGN.md §6 sample board and match).
- `data/`: source word lists with their licences. ENABLE (public domain), the LDNOOBW offensive-word list (CC BY 4.0, needs attribution) and SCOWL commonness levels (keep `SCOWL-COPYRIGHT.txt`).
- `src/components/`: shared UI. `StickerBox` (outline plus hard shadow), `DotBackground` (gameplay screens only), `TierChip`, `icons`, and `avatar/Avatar` with its generated art (`art.generated.ts`, never edit by hand).
  - `board/`: `Board` (plate, tiles, chain, pan gesture), `Tile`, and `geometry.ts` (layout and hit-testing, unit tested).
  - `round/`: the board screen's header pieces: `ScoreCard`, `Timer`, `WordDisplay`, `FoundWords`, `Pop`.
- `src/features/round/`: `useLocalRound` (a round against a house player, on the device) and `RoundView` (the board screen layout, no logic).
- `src/feedback/feedback.ts`: the only place round events become haptics, and later sound.
- `src/app/round.tsx` plays a round (`?opponent=bolt&seed=123`). `src/app/dev/board.tsx` freezes the board screen in each mockup state (`?state=valid`) for comparing with the PNGs; dev only.
- `scripts/`: dev scripts, such as the avatar art generator.
- `docs/`: planning docs, and `docs/design/` for the design spec and mockups.
- Import from `src` with the `@/` alias, for example `@/theme`.
