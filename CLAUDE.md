# Scrawl (placeholder name)

The name may change, so keep it out of code identifiers, file names and package names. It belongs in app config and user-facing copy only.

A competitive word hunt game: a 4x4 letter grid, 80-second rounds, swipe adjacent tiles to make words. It is inspired by GamePigeon's Word Hunt, plus ranked matches against players worldwide. The goal is to grow and monetize it. One Expo codebase serves iOS and Android (launching together) and the web (any browser, including desktop). The app's focus is social play with friends through messages.

Repository: https://github.com/aavly/scrawl

## Design

**All UI follows [docs/design/DESIGN.md](docs/design/DESIGN.md).** Read the relevant sections before building or changing any screen or component.

- **Precedence:** when DESIGN.md and a mockup disagree, DESIGN.md wins. When a newer entry in [docs/DECISIONS.md](docs/DECISIONS.md) contradicts DESIGN.md, the decision wins until DESIGN.md is updated (for example, bots are now a recurring cast of named characters, and the web now needs a desktop layout).
- **Mockups:** [docs/design/source/](docs/design/source/) holds HTML mockups at 390×844. Use them to look up exact values only. Never import or port their markup. PNG references go in `docs/design/screens/` if added.
- **When DESIGN.md is silent:** don't invent a look. Add the question to [docs/design/OPEN_QUESTIONS.md](docs/design/OPEN_QUESTIONS.md), build the most conservative option, and flag it in your reply.
- **Tokens:** every colour, font, radius and shadow comes from the one theme object (Butter light, Night dark) built from DESIGN.md §3. No hard-coded hex values in components.
- **Hard-shadow look:** use the shared `StickerBox` component, never a one-off shadow.
- **Feedback states:** valid, already found and invalid each need their non-colour signals exactly as DESIGN.md §7 specifies.
- **Busy visuals** (dot background, stickers, confetti) appear only on gameplay and matchmaking screens. Navigation screens stay flat.
- **Don't build anything in DESIGN.md §10** ("Planned, not designed yet"), but keep grid size, tile size and the avatar slot parameterised.

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

None yet. Add the install, run, test, typecheck and lint commands here once the project is scaffolded in Stage 1.

## Layout

None yet. Add a short map of the top-level folders here once code exists.
