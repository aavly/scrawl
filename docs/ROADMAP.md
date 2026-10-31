# Roadmap

The current stage is recorded at the top of [CLAUDE.md](../CLAUDE.md). Durations are rough solo estimates. A stage is finished when its exit criteria are met, not when its time runs out.

| Stage | Produces | Rough time |
|---|---|---|
| 0. Close out planning | Decisions locked, name and visual identity chosen | 1 week |
| 1. Playable game | A full round against a bot character that feels great, including the head-to-head moments | 2–4 weeks |
| 2. Build iteration 1 | Accounts, online ranked play, profiles, leaderboards | 6–8 weeks |
| 3. Beta | Tuned game, tested by real players, backend moved off Supabase | 2–4 weeks |
| 4. Launch on iOS and Android | Live on the App Store and Google Play | 1–2 weeks |
| 5. Iteration 2 | Full web version, friendlies by link, rivalries, iMessage icon | 6–9 weeks |
| 6. Later iterations | Solo and daily modes, store, hybrid modes | ongoing |

The full web version (ranked on the web, desktop layout, web sign-in) is in iteration 2. Until then the board must still run in a mobile browser, so nothing in the game screen may be native-only.

## Stage 0: close out planning

- [x] Choose the app framework (Expo)
- [x] Choose the backend (Supabase, leaving around the beta)
- [x] Decide whether Android launches with iOS (yes, together)
- [x] Decide how bots are presented (a recurring cast of named characters)
- [x] Decide the web scope (a full platform, including ranked)
- [x] Run the [design brief](DESIGN_BRIEF.md), pick a visual direction and a name (Scrawl, [design/DESIGN.md](design/DESIGN.md))
- [x] Decide when the full web version is built (iteration 2)
- [x] Confirm the account rules (Apple, Google and email sign-in; ranked on web needs an account; guests keep progress)
- [ ] Confirm the monetization rules and phasing in [PRODUCT.md](PRODUCT.md#monetization)
- [ ] Decide whether to publish as an individual or a company. If a company, request a D-U-N-S number now (it can take up to two weeks)
- [ ] Choose the final name. Scrawl is a placeholder because of the conflicts found on 2026-10-31. Run the same checks on any replacement:
  - Big Potato Games sells a party board game called Scrawl and filed a US trademark for SCRAWL for a drawing game (serial 87102320, filed 2016). Check its status on the USPTO site, and ideally get a trademark attorney's view before spending on branding.
  - An iPhone drawing game called Scrawl is live on the App Store, so the store listing needs a longer name such as "Scrawl: Word Battle".
  - A web drawing party game called Scrawl launched on Product Hunt in 2026.
  - Domains: scrawl.com, getscrawl.com and scrawl.gg are taken. playscrawl.com and scrawlgame.com were unregistered.
- [ ] Register the chosen domain
- [ ] Send the design follow-ups to the design chat and resolve the questions that block Stage 1 or 2 in [design/OPEN_QUESTIONS.md](design/OPEN_QUESTIONS.md)
- [ ] Play the existing Word Hunt clones and note where they fall short
- [x] Create the GitHub repository and push (https://github.com/aavly/scrawl)

**Exit:** no open decisions block Stage 1. Met on 2026-10-31. The unticked items above carry on alongside Stage 1, and must be done before the stage noted:
- Final name, domain and individual-or-company choice: before developer account sign-up at the end of Stage 1.
- Design follow-ups: the bot cast and the time bar are needed for Stage 1's round and reveal, with placeholders until then. Sign-in screens are needed for Stage 2.
- Monetization confirmation: before Stage 2.

## Stage 1: playable game

The focus is the actual gameplay and how it feels, including the social feel of facing an opponent. Everything runs locally against bot characters, with no backend.

1. **Foundations**
   - [ ] Scaffold the Expo app and fill in Commands and Layout in [CLAUDE.md](../CLAUDE.md)
   - [ ] Load fonts, build the theme tokens (Butter and Night) and the `StickerBox` component
2. **Game engine** (plain TypeScript, unit tested, no React)
   - [ ] Board generation, adjacency, trace validation, dictionary lookup and scoring, using the sample data in DESIGN.md §6
   - [ ] Dictionary loaded (ENABLE, with offensive words filtered)
   - [ ] Solver that rejects boards with too few words
   - [ ] Bot characters as data, with difficulty and play style
3. **The round**
   - [ ] Swipe board with all eight directions, a forgiving hit radius and the chain drawn under the finger
   - [ ] Every feedback state from DESIGN.md §7 (valid, already found, invalid, last 10 seconds), with haptics, animations and sound hooks
4. **The head-to-head experience**
   - [ ] Opponent reveal before the round
   - [ ] Live opponent score during the round, with the "+points" pop
   - [ ] Results: win or loss, both word lists, best missed words, rating change (mocked)
   - [ ] Rematch straight into a new round
   - [ ] Tutorial round against the easiest character
5. **Cross-platform check**
   - [ ] Same game running on an iPhone, a mid-range Android phone and in mobile Safari (Expo Go is enough, no developer accounts needed)
6. **Developer accounts, by the end of this stage** (Stage 2 needs them)
   - [ ] Enrol in the Apple Developer Program ($99/yr)
   - [ ] Register a Google Play Console account ($25 one-time) and complete identity verification

**Exit:** on a real iPhone and a mid-range Android phone, swiping feels good, the feedback feels rewarding, and playtesters reach for Rematch without being asked. The same game code runs in a mobile browser.

## Stage 2: build iteration 1

Features are specified in [PRODUCT.md](PRODUCT.md#iteration-1-ranked-play).

1. **Pipeline**
   - [ ] CI on pull requests: lint, typecheck, tests
   - [ ] Builds to TestFlight and the Play internal testing track from main
2. **Remaining screens**
   - [ ] Welcome, Home, Finding, Practice, Leaderboard, Profile, Settings, Report and Update (DESIGN.md §5)
3. **Accounts and backend**
   - [ ] Guest accounts, and Apple, Google and email sign-in that keeps one profile and the guest's progress
   - [ ] Server-side validation of swipe paths
   - [ ] Match records and replay storage
4. **Online play**
   - [ ] Matchmaking with bot fallback after about 10 seconds
   - [ ] Live opponent score
   - [ ] Rating and rank tiers
   - [ ] Global and per-country leaderboards
5. **Release requirements**
   - [ ] Profile and settings
   - [ ] Player reporting and username filter
   - [ ] Account deletion
   - [ ] Minimum-version check
   - [ ] Analytics events and crash reporting
6. **Monetization foundations** (nothing visible to players)
   - [ ] Purchases tied to accounts, ready for a cross-platform purchase service such as RevenueCat
   - [ ] Privacy and consent setup that ads will need

**Exit:** test builds on iPhone and Android where two people can play a ranked match against each other, and against a bot character when alone.

## Stage 3: beta

- [ ] Internal testing with friends (TestFlight and Play internal track)
- [ ] External testing with a wider group. With a personal Google account, at least 12 testers must stay opted in to a closed test for 14 days in a row before Google allows a production release
- [ ] No monetization during the beta, so retention is measured cleanly
- [ ] Tune bot difficulty, board quality, scoring and rating changes
- [ ] Check performance on low-end Android phones
- [ ] Decide where the backend moves after Supabase, and migrate while user data is still small

**Exit:** testers play several rounds per session and come back the next day without being asked.

## Stage 4: launch on iOS and Android

- [ ] Store listings, screenshots, privacy details and age ratings (13 and up) for both stores
- [ ] Ads between matches and a "Remove ads" purchase (see [PRODUCT.md](PRODUCT.md#monetization))
- [ ] App Review and Play review passed
- [ ] Phased rollout on both stores
- [ ] Dashboard for retention (next day and seven day), rounds per session, match wait time and share of bot matches

**Exit:** live, and retention looks healthy enough to spend effort on growth.

## Stage 5: iteration 2, web, friendlies and social

Start only once retention is healthy, because the web and friendlies bring exposure and exposure is wasted on a game people don't return to. Specified in [PRODUCT.md](PRODUCT.md#iteration-2-web-friendlies-and-social).

- [ ] Full web version: ranked on the web, desktop layout, web sign-in
- [ ] Challenge links with rich preview cards
- [ ] Rivalries with running tallies
- [ ] Rivals page
- [ ] Push notification when a friend takes their turn
- [ ] iMessage extension
- [ ] Funnel analytics: links sent, opened, rounds completed, installs

## Stage 6: later iterations

Suggested order, not yet confirmed by the user:

1. Solo modes and a daily puzzle
2. Customisation store with in-app purchases
3. Hybrid modes (word hunt mixed with Wordle or crosswords)
