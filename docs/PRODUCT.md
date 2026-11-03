# Product

## The game

- 4x4 grid of letter tiles, 80-second round.
- Drag across adjacent tiles, including diagonals, to spell words of three letters or more. A tile can be used once per word.
- Longer words score disproportionately more, using the reward ladder in [design/DESIGN.md](design/DESIGN.md) §7.
- Two players get the same board, and the higher total wins.
- Feedback for valid, duplicate and invalid words must differ by more than colour (haptics, sound, shape or text).

## Words

- The dictionary is ENABLE with two curated lists of exact words in `data/`:
  - **Blocked:** slurs, strong profanity, explicit sexual terms and sexual violence. Never valid.
  - **Mild:** mild profanity (ASS, DAMN, CRAP), crude humour and clinical terms (SEX, PENIS). Valid for players, but house players never play them.
  - **Finding a mild word gets a cheeky reaction** in place of the NICE!/GREAT! label, picked at random from a range: CHEEKY!, NAUGHTY!, HEY, WATCH IT!, OI!, LANGUAGE!, TUT TUT!, OOH, SPICY!, SCANDALOUS!, WE SAW THAT!, RUDE!, MIND YOUR MOUTH!, GASP! (user, 2026-11-03). The list lives in `src/game/engine/scoring.ts`.
- No disclaimer or setting is needed for release 1 (user, 2026-11-03). No law requires a word game to filter words. What matters is answering the store age-rating questions honestly: mild words count as "infrequent/mild profanity or crude humour", which fits the planned 13+ rating.
- If schools or parents ask for it later, a "family-friendly words" setting could also block the mild list.

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

## Rating

**Decided (user, 2026-11-02)**
- Ranked matches against house players count for rating.
- Wins get a bonus for the points margin, in tiers, with a cap. It applies to every ranked match, human or house player.
- Losses are softened, not amplified, so losing doesn't discourage players. A heavy loss costs no more than a close one. This replaces the earlier "heavy losses cost more" rule.
- The leaderboard is permanent: it ranks current ratings, with no weekly reset.
- Start 1,300, floor 1,000, tiers as DESIGN.md §8.

**Formula (engineering proposal; the structure follows the decisions above, the numbers are tunable in beta)**
1. **Expected result:** `E = 1 / (1 + 10^((opponent − player) / 400))`. A house player uses a hidden fixed rating: Pip 1,300, Dash 1,500, Bolt 1,700, Nova 1,950, Titan 2,200. It is never shown.
2. **Base change:** `K × (result − E)`, where result is 1 for a win, 0.5 for a tie and 0 for a loss. K is 32 normally, 48 for a player's first 10 ranked matches (placement), and 24 at 2,000 and above.
3. **Wins: margin multiplier**, from the margin as a share of the winner's score, `(winner − loser) / winner`:

   | Margin | Multiplier |
   |---|---|
   | under 10% | ×1.0 |
   | 10% to under 25% | ×1.15 |
   | 25% to under 50% | ×1.3 |
   | 50% or more | ×1.5 (cap) |

4. **Losses: softened.** A loss costs 75% of the base change, whatever the margin.
5. **Cap:** the change is rounded and never more than ±40 in one match (±60 during placement). Rating never drops below 1,000.
6. **Plausibility check (proposed):** if the winner's play looks inhuman (an implausible share of the board's points, or words found faster than a person can trace), the win gets no margin bonus and the match is flagged for review. Every match's change is stored, so a confirmed cheater's gains can be reversed and their opponents' losses refunded.

**Why these caps** (compared with similar ranked games, 2026-11-02):
- Valorant adds a performance bonus to wins but caps a match at +50 on a 100-point division. Apex caps its kill bonus and gives less for each extra kill. Scrawl's ×1.5 multiplier cap and ±40 match cap follow the same idea: performance counts, but one result can't jump a whole division.
- Clash Royale's ranked mode moves a flat ±30 per match, and established chess players move about 10–20 points a game with K around 20–32. A normal Scrawl win is +16 to +20, so a division (100 points) takes 5–6 wins, much like Valorant.
- Chess sites move new players by 100 or more points a game until their rating settles. Scrawl's placement K of 48 (cap ±60) is a milder version, so new players reach their level within about 10 matches.
- Both chess and Valorant shrink the changes near the top, so the leaderboard stays stable. Scrawl drops K to 24 at 2,000 and above.
- The margin is a share of the winner's score, so it can't exceed 100%, and everything from 50% up earns the same ×1.5. Running up a huge score, honestly or by cheating, earns nothing extra.

Worked examples for a 1,642 player:

| Match | Result | Change |
|---|---|---|
| vs human 1,655, 4,800 to 4,400 (8% margin) | win | +17 (matches the Results mockup) |
| vs Bolt (1,700), narrow win | win | +19 |
| vs Bolt, wins by 60% | win | +28 |
| vs human 1,655, any margin | loss | −12 |
| vs Bolt, any margin | loss | −10 |
| a 1,790 player beats Bolt by 60% | win | +18 |

**Side effects to watch in the beta**
- **Rating inflation.** Because winners gain more than losers lose, every human match adds a few points to the ladder overall (about +5 per even match). Over time ratings drift upward and the tiers get easier to reach. Options if it matters: shift the tier thresholds, slightly reduce K, or later keep a hidden, symmetric skill rating for matchmaking alongside the visible rating (Valorant does this).
- **House-player tuning.** Each house player should win about as often as its hidden rating predicts. Otherwise bot matches add or drain rating across the player base.
- The ResultsLoss mockup shows −15. With softened losses that match would show −12. No screen change needed.

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
