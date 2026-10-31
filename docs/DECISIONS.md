# Decisions

Add new decisions at the bottom of the relevant table, with the date and who made them. Move an item from Proposed to Decided only when the user confirms it. When a decision replaces an earlier one, strike the old row through and point to the new one rather than deleting it.

## Decided

| Date | Decision | By |
|---|---|---|
| 2026-10-10 | The goal is to grow and monetize, not a hobby project | User |
| 2026-10-10 | Cross-platform is the ideal | User |
| 2026-10-10 | Iteration 1 is ranked play against players worldwide, with bots of several difficulties for empty lobbies and practice | User |
| 2026-10-10 | Solo modes, other word modes and the customisation store come in later iterations | User |
| 2026-10-10 | Friendlies (link matches) never affect rank and belong in iteration 2 | User |
| 2026-10-10 | ~~The web version is scoped to friendlies and quick play~~ Superseded on 2026-10-31 | User |
| 2026-10-10 | ~~Ranked play against random players is the only install hook; no install gates on the web~~ Superseded on 2026-10-31 | User |
| 2026-10-10 | Friendlies keep a running head-to-head record between two contacts, like GamePigeon | User |
| 2026-10-10 | At least one player in a friendly has the app | User |
| 2026-10-25 | Name is Scrawl. Trademark and store availability not yet checked | User |
| 2026-10-31 | ~~Scrawl is the final name~~ Superseded by the next row | User |
| 2026-10-31 | Scrawl stays as a placeholder name while the user brainstorms alternatives, because the checks found a trademark conflict (see [ROADMAP.md](ROADMAP.md#stage-0-close-out-planning)). Keep the name easy to change: in config and copy, not baked into code identifiers | User |
| 2026-10-31 | GitHub repository is https://github.com/aavly/scrawl | User |
| 2026-10-25 | Visual identity is "sticker-sheet pop" with Butter (light) and Night (dark) themes, specified in [design/DESIGN.md](design/DESIGN.md) | User (design chat) |
| 2026-10-25 | Word scoring uses the reward ladder in DESIGN.md §7 (placeholder values, tuned in playtests) | User (design chat) |
| 2026-10-25 | ~~Bots are always labelled as generic bots~~, then ~~ranked bots are not labelled~~. Both superseded by the next row | User |
| 2026-10-25 | Bots are a fixed cast of recurring characters, each with its own look and a difficulty players learn to recognise ("oh, that's just Steve"). Openly bots, but presented as known characters, not as a generic "BOT". The same cast covers the tutorial, Practice and the ranked fallback. Details in [PRODUCT.md](PRODUCT.md#bots) | User |
| 2026-10-25 | Backend is Supabase for now, with a plan to move off it around the beta. Build so that move is cheap (see [ARCHITECTURE.md](ARCHITECTURE.md#leaving-supabase)) | User |
| 2026-10-31 | Scrawl is playable on anything with a web browser, including desktop, in the spirit of Krillion (a quick web game that spread through offices). The web is a full platform, including ranked, not just friendlies | User |
| 2026-10-31 | The app's focus is social: interaction with friends through messages. Its reason to install is the social and messaging experience, not access to ranked play | User |
| 2026-10-31 | Accounts tie progress together: the same profile on web and app. Guest accounts are allowed for temporary sessions | User |
| 2026-10-31 | App framework is Expo (React Native) | User |
| 2026-10-31 | Android launches alongside iOS | User |
| 2026-10-31 | Web and app share one ranked ladder, drag input only (no typing words) | User |
| 2026-10-31 | Ranked on the web requires a signed-in account. Guests can play ranked in the app | User |
| 2026-10-31 | Sign-in methods: Apple, Google and email magic link. No passwords | User |
| 2026-10-31 | A guest who signs up keeps their guest progress | User |
| 2026-10-31 | The full web version (ranked on the web, desktop layout, web sign-in) is built in iteration 2. Iteration 1 ships the iOS and Android apps, but the board must still run in a browser from Stage 1 | User |
| 2026-10-31 | Stage 1 focuses on the actual gameplay and user experience, including the social feel of a head-to-head match (Claude's reading: reveal, live opponent score, results and rematch against bot characters, not the iteration 2 friend features) | User |

## Proposed (needs user confirmation)

| Proposal | Reasoning |
|---|---|
| Bot matches move rating by a reduced amount | Bots stand in for real opponents, so a win against one should count for less |
| ENABLE dictionary with offensive words filtered | Public domain. The tournament word lists are licensed |
| The rivalry ID travels in the link, not in browser storage | Safari clears storage and in-app browsers don't share it |
| Monetization arrives after the beta, phased as in [PRODUCT.md](PRODUCT.md#monetization) (user's instinct, Claude's phasing) | A clean beta measures retention without ads skewing it. Light ads at launch avoid a later "they added ads" backlash |
| Never sell a competitive advantage. Purchases are cosmetic or convenience only | Ranked play has to stay fair or the competitive core collapses |
| Scrawl is for ages 13 and up | Under-13 players bring child privacy law (COPPA) and heavy ad restrictions |
| Publish under a company rather than personally (user to decide) | A company is the seller of record, limits personal liability, and skips Google's 12-tester rule. Needs a D-U-N-S number, which can take up to two weeks |

## Open

- Whether to publish as an individual or a company
- The final name (Scrawl is a placeholder)
- Order of the later iterations
- Design questions are tracked separately in [design/OPEN_QUESTIONS.md](design/OPEN_QUESTIONS.md)
