# Product

## The game

- 4x4 grid of letter tiles, 80-second round.
- Drag across adjacent tiles, including diagonals, to spell words of three letters or more. A tile can be used once per word.
- Longer words score disproportionately more, using the reward ladder in [design/DESIGN.md](design/DESIGN.md) §7.
- Two players get the same board, and the higher total wins.
- Feedback for valid, duplicate and invalid words must differ by more than colour (haptics, sound, shape or text).

## Platforms

- **App (iOS and Android, launching together in iteration 1):** the social home. Friends, messages, rivalries, push notifications and the iMessage icon. People install it for the social experience, not to unlock features.
- **Web (iteration 2):** playable on anything with a browser, phone or desktop, with no install. Includes ranked play. It is how Scrawl spreads, like a quick game passed around an office. Until then, the game code must still run in a browser.
- **One game everywhere:** the same rules, board and ranked ladder on every platform. Input is drag only (touch, mouse or trackpad). Typing words is not allowed.

## Accounts

- **One profile across web and app.** Signing in on any platform shows the same rating, stats and rivalries.
- **Guests for temporary sessions.** Anyone can start playing immediately without signing up.
- **Upgrading keeps progress:** when a guest signs up, their guest rating and stats stay with them.
- **Sign-in methods:** Apple, Google and email magic link. No passwords.
- **Ranked on the web needs an account,** for anti-cheat. Guests can play ranked in the app.

## Iteration 1: ranked play

**Matches**
- **Quick match:** pairs players by rating on the same board, with the opponent's score updating live.
- **Bot fallback:** if nobody is found in about 10 seconds, the player gets the bot character whose level is nearest their rating.
- **Results:** both word lists side by side, the best missed words, the rating change and a rematch button.
- **Practice:** play a chosen bot character, unranked. The first round is a tutorial against the easiest character.

**Bots**
- **A recurring cast.** Bots are a small fixed roster of characters with their own names, illustrated avatars and difficulty, so players get to know them. Being matched with one should feel normal, not like a consolation ("oh, that's just Steve").
- **One cast everywhere.** The same characters appear in the tutorial, in Practice (where the player picks one) and as the ranked fallback. The current roster from the design is Pip (easy), Dash (casual), Bolt (skilled), Nova (hard) and Titan (brutal).
- **Each covers a rating band.** In ranked, the player meets the character whose band contains their rating, with some variation in strength within the band. More characters can join as the tier ladder grows.
- **They never appear on leaderboards.**
- **Personality in play style, not just strength** (proposed): for example one finds many short words fast, another hunts long words.
- **How they play:** the server knows every word on the board. A bot picks a subset and "finds" them at human-like intervals across the round. Difficulty comes from four levers: target score, share of long words, how obscure its vocabulary is (by word frequency), and pace.
- **Later idea, not iteration 1:** a personal record against each character ("You're 4–1 vs Bolt"), reusing the rivalry tally.

**Players**
- **Profile:** username, avatar, country, rating, win/loss record, best word, high score.
- **Ranking:** Elo-style rating with named tiers, plus global and per-country leaderboards.

**Required for release**
- Player reporting and a username profanity filter.
- Account deletion.
- A "please update" screen driven by a minimum supported version.

**Out of scope for iteration 1:** friend invites, chat, ads and purchases, push notifications, and everything below.

## Iteration 2: web, friendlies and social

**Full web version**
- Every screen in the browser, with a desktop layout.
- Ranked on the web, signed in only, on the same ladder as the app.
- Web sign-in with the same account methods as the app.

**Friendlies** never affect rank.

**Challenge links**
1. An app user creates a challenge. The link carries a rivalry ID.
2. It shows in the chat as a preview card with the running tally, for example "Anna 3 – 2 Sam".
3. If the recipient has the app, the link opens the app. If not, it opens the web version.
4. The recipient plays the same board, as a guest or signed in.

**Rivalries**
- Every rematch link inherits the rivalry ID, so the tally continues whoever sends it.
- Any old link in a rivalry opens the rivalry page with its current state: the tally, a round waiting, or a Rematch button.
- A link sent to a group chat gives each person who opens it their own rivalry with the sender.
- Signed-in players see their rivalries on every platform. A guest's rivalries move into their account when they sign up.

**Starting a game from the web**
- Rematch needs no sending: the app user gets a push notification when the web player takes their turn.
- "Send to chat" opens the share sheet with the link ready, falling back to "Copy link".
- A rivals page lists the player's rivals with a "New game" button.
- The site can be added to the home screen to get an icon.

**iMessage extension (app users only)**
- Puts an icon in the Messages app drawer, like GamePigeon. Tap it in any conversation to drop in a new challenge.
- It inserts a plain web link, so the recipient still plays without the app.
- It knows which conversation it's in (as an anonymous ID), so rivalries attach to the chat automatically.
- iPhone only. Android has no equivalent.

## Monetization

Proposed, not yet confirmed. Nothing is visible to players before launch.

**Rules**
- Never sell a competitive advantage. Purchases are cosmetic or convenience only, so ranked stays fair.
- No ads during a round, only between matches.
- Purchases belong to the account, not the device, so something bought in the app also works on the web.
- Ages 13 and up.

**Phasing**
1. **Stage 2, foundations only:** analytics events, purchases tied to accounts, and the privacy and consent setup ads will need (Apple's tracking prompt, consent in the EU and UK).
2. **Stage 3, beta:** no monetization, to get a clean retention baseline.
3. **Stage 4, launch:** an ad between matches every few games, plus a one-off "Remove ads" purchase.
4. **Iteration 2, web:** no ads on friend-link games, so the shared experience stays smooth.
5. **Store iteration:** coins earned from wins, cosmetic skins and avatars bought with coins or money, and opt-in rewarded ads (for example, watch an ad to double coins).
6. **Later:** a season pass tied to ranked seasons, and possibly a subscription (no ads plus perks).

**Numbers to watch:** retention (day 1, 7 and 30), average revenue per daily player, share of players who ever pay, and lifetime value against the cost of acquiring a player.

## Later iterations

- **Solo play:** timed challenges and minigames.
- **Other word modes:** daily puzzles, and hybrids of word hunt with Wordle or crosswords.
- **Customisation store:** board and tile designs, and avatars. Iteration 1 already renders the board and tiles from a theme definition so the store needs no rework.
