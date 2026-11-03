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
| 2026-11-01 | Design v2.0 adopted ([design/DESIGN.md](design/DESIGN.md)): house-player cast, player avatars, tier ladder, accounts, desktop and mobile web layouts, new states | User (design chat) |
| 2026-11-01 | Build follows the roadmap stages, not the design handoff's order. Design features outside the current stage are reference for later stages. The design is guidance: conflicts that would obstruct the game get flagged and sent back to the design chat | User |
| 2026-11-02 | Ranked matches against house players count for rating | User |
| 2026-11-02 | Rating change includes a tiered bonus for the points margin, with a cap. Formula proposed in [PRODUCT.md](PRODUCT.md#rating) | User |
| 2026-11-02 | The margin layer applies to human matches too | User |
| 2026-11-02 | ~~Heavy losses cost more (same multiplier on losses)~~ Superseded by the next row | User |
| 2026-11-02 | Losses are softened rather than amplified, so losing doesn't discourage players. No margin penalty on losses | User |
| 2026-11-02 | No weekly leaderboard reset. The leaderboard is permanent and ranks current ratings | User |
| 2026-11-02 | Skip for now, revisit later: the "Beaten 3 of 5" strip on Profile, the "MORE SOON" locked avatars and the leaderboard footer. Not built in release 1 | User |
| 2026-11-02 | Design v2.1 adopted: compact board layout for small phones, one bounded found-words row, five-digit score sizes, Appearance group in Settings | User (design chat) |
| 2026-11-01 | ~~Butter (light) is the default theme. The phone's own light/dark setting is ignored~~ Superseded by the next row | User |
| 2026-11-03 | The theme follows the phone's light or dark mode by default (Butter in light, Night in dark). Settings can pin Butter or Night, or go back to following the phone | User |
| 2026-11-03 | All in-game text is short and concise: one instruction or idea per line, no repeated phrases | User |
| 2026-11-03 | The tutorial is two parts: first learn alone (no opponent, no clock) by making three words with Pip coaching, then a first match against a gentle Pip | User |
| 2026-11-03 | Pip's coaching uses a speech bubble that looks clearly different from the players' score cards | User |
| 2026-11-03 | Found words wrap inside a taller area (the spare space above the board) instead of one scrolling row, so players can see how much they've found. Supersedes DESIGN.md v2.1 §4.6; the board still never moves | User |
| 2026-11-03 | No separate "meet the house players" page. The Practice list is enough | User |
| 2026-11-03 | Mild words get a fun exclamation when found ("CHEEKY!", "NAUGHTY!", "HEY, WATCH IT!" and others, picked at random) | User |
| 2026-11-03 | Mild words such as ASS are valid. Slurs, strong profanity and explicit sexual terms stay blocked. No disclaimer or setting to switch mild words off for release 1 | User |
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
| The rating numbers in [PRODUCT.md](PRODUCT.md#rating): K of 32 (48 for the first 10 matches, 24 at 2,000+), win margin multiplier capped at ×1.5, losses at 75% of base, match cap ±40 (±60 in placement), hidden house-player ratings | Benchmarked against Valorant, Apex, Clash Royale and chess. Tunable in beta. Softened losses cause mild rating inflation to watch |
| A plausibility check on ranked wins: inhuman play gets no margin bonus and is flagged; stored rating changes allow reversing a cheater's gains and refunding their opponents | The margin cap limits the bonus, but not a cheater who simply wins every match |
| ENABLE dictionary with two curated lists of exact words (2026-11-03): `data/blocked-words.txt` (never valid) and `data/mild-words.txt` (valid, but house players never play them). 170,258 words, 140 blocked, 98 mild | The first filter added suffixes automatically and blocked ordinary words such as BUTTER, SPICY and SNATCH |
| House players draw on SCOWL word-commonness levels, so they favour everyday words | Without it they find obscure ENABLE words ("ORT") and feel robotic |
| No Q tiles in release 1, and at most one of each rare letter (J, K, V, X, Z) per board | A lone Q is nearly unplayable. Harder letters are a later mode (DESIGN.md §16) |
| Boards need at least 70 findable words and a 6-letter word | Calibrated on 300 random boards: median 97 words. Rejects the weakest tenth |
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
