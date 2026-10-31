# Architecture

Expo and Supabase are decided. Everything else here is proposed until confirmed in [DECISIONS.md](DECISIONS.md).

## Stack

- **Client:** Expo (React Native) with TypeScript, one codebase for iOS, Android and web. Board rendering and gestures with Reanimated, Gesture Handler and SVG, chosen so the same board code runs in the app and in any browser.
- **Backend:** Supabase (Postgres, auth, realtime, edge functions) until around the beta, then moved (see below).
- **Builds and releases:** EAS Build, EAS Submit and EAS Update.
- **Web hosting:** static hosting such as Vercel or Cloudflare Pages.
- **Monitoring:** Sentry or similar for crashes, plus an analytics service.

## Principles

- **Game logic is pure, shared code.** Scoring, path validation, board generation, the solver and bots have no UI or network dependencies, so the app, the web and the server use the same code and it is easy to test.
- **The server decides.** The client sends swipe paths with timestamps. The server checks each path against the board, the dictionary and the round clock, then computes the score.
- **One input model.** Drag only, whether by touch, mouse or trackpad. No typed words.
- **Pluggable modes.** A game mode is a rule set (board size, timer, scoring, win condition), so later modes slot in without restructuring.
- **Skinnable board.** Board and tile visuals come from a theme definition, ready for the store.
- **Old app versions keep working.** Players update slowly, so the server stays backward compatible, and a minimum supported version can force an update. The web is always the latest version.

## Accounts

- **One account, every platform.** Rating, stats and rivalries belong to the account, not the device.
- **Guests:** an anonymous account is created on first play, so a guest has a real profile from the start.
- **Upgrading:** signing up attaches a sign-in method to the guest account, so nothing has to be copied.
- **Sign-in methods:** Apple, Google and email magic link. No passwords. Apple sign-in is required on iOS when Google is offered.
- **Ranked on the web needs an account,** because the web has no device check.

## Leaving Supabase

The plan is to move off Supabase around the beta. To keep that move cheap:

- **Game rules live in our own TypeScript server code**, not in Postgres functions or row-level security policies.
- **The app talks to the backend through our own API layer.** Screens never call the Supabase client directly, so swapping the backend changes one module.
- **Realtime (live opponent score) sits behind our own interface**, so it can move to a dedicated websocket server.
- **Schema changes are plain SQL migrations**, which run on any Postgres.
- **Passwordless sign-in only.** Apple, Google and email identities move to a new auth system cleanly, while password hashes are awkward to migrate.
- **Option to keep in mind:** Supabase is open source and can be self-hosted, which would move the infrastructure without changing any code.

## Matches

- The server issues a board seed. Both players play the same board.
- A live match is two players starting the same seed together, with realtime messages carrying the opponent's score.
- Every play is stored with word timings. This enables replays, cheat analysis, and recorded human opponents later.
- Bot characters are data (name, avatar, rating band, play style), so the cast can grow without code changes.
- Data model room for later: matches can reference an optional rivalry (iteration 2) and a mode.

## Anti-cheat

Cheating can be contained but not eliminated. Ranked on the web makes it harder, because a solver or automation script is easy to run beside a desktop browser.

- Server-side path validation on every platform.
- Apple App Attest on iOS, Play Integrity on Android. The web has no equivalent.
- Signed-in accounts for ranked web play.
- Flags for inhuman pace or find rates, weighted more heavily for web play.
- Suspected cheaters are matched only with each other.
- If cheating concentrates on the web, the fallback is separate web and app ladders.

## Environments

Development, staging and production backends. Database changes live as migration files in the repo and deploy from CI.

## Release pipeline

1. **Pull request:** CI runs lint, typecheck and tests.
2. **Merge to main:** EAS Build produces signed iOS and Android builds, uploaded to TestFlight and the Play internal testing track. The web build deploys to a staging site.
3. **Internal testing:** up to 100 TestFlight testers, no Apple review. The Play internal track has no review.
4. **External beta:** up to 10,000 TestFlight testers after a light beta review, and the Play closed testing track.
5. **Store release:** submit with EAS Submit. App Review usually takes one to two days. Play review varies.
6. **Phased rollout** on both stores, which can be paused.
7. **JavaScript-only fixes** can ship over the air with EAS Update. Native changes need new builds and review. Web fixes deploy immediately.

## Store review checklist

- Distinct name and visual identity, since copycat apps get rejected.
- In-app account deletion.
- Profanity filter and player reporting for usernames.
- Sign in with Apple on iOS, since Google sign-in is offered.
- Privacy policy URL, privacy labels (Apple) and data safety form (Google), age ratings and screenshots.
