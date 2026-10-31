# Design brief

The prompt below was written on 2026-10-13 to give a fresh Claude session the context to produce UI mockups. Paste everything under the line into a new session. Update it if product decisions change, and record the chosen visual direction and name in [DECISIONS.md](DECISIONS.md).

---

I'm building a mobile word game and want you to design the UI as a mockup. You have no prior context, so everything you need is below. Please read it all before designing.

## The product

A competitive word hunt game for phones. It is inspired by the Word Hunt game in GamePigeon (the iMessage game collection), which is hugely popular with young iPhone users but can only be played against contacts inside iMessage. My app takes the same core game and adds what GamePigeon lacks: ranked matches against players from around the world, in the way 8 Ball Pool does for pool.

The game itself: a 4x4 grid of letter tiles and an 80-second timer. The player drags a finger across adjacent tiles (including diagonals) to spell words of three letters or more. Longer words score disproportionately more. Two players get the same board and the higher total wins. In a ranked match the opponent's score updates live during the round.

The goal is to grow and monetize this, so it needs to look like a polished commercial game, not a prototype.

## Who it is for

Mainly teens and young adults who already know Word Hunt from iMessage, starting in the US on iPhone. They play in short bursts, many rounds in a row, and care about beating people. The app launches on iOS first and Android later from one codebase (Expo/React Native), so the design should not depend on iOS-only interface conventions.

## The most important constraint: it must not look like GamePigeon

Apple rejects apps that look like clones of existing ones, and I want my own identity anyway. Don't reuse GamePigeon's look (its wooden board, tan tiles, green highlight and general styling). The mechanics can be familiar. The name, colours, tile design, typography and personality must be original.

The app has no name or visual identity yet. Please propose them.

## What to design: the first release

The first release is one complete loop: ranked head-to-head play, with bots covering for an empty lobby. These are the screens and states I need.

1. First run. A new player can start immediately as a guest with no sign-up. Their first round is a practice match against an easy bot that doubles as the tutorial.
2. Home. The main action is "Play" (ranked quick match). Secondary: Practice, Leaderboard, Profile. The player's rating and rank tier should be visible.
3. Finding a match. A short wait while the server looks for a similarly rated opponent, then an opponent reveal showing name, avatar, country and rating. If nobody is found in about 10 seconds the player gets a bot near their rating. Bots are clearly labelled as bots and are not disguised as real people.
4. The game board. This is the screen that matters most. It needs the 4x4 grid, the timer, the player's score, the opponent's live score, and the word currently being traced. Show these states: tracing a word in progress, a valid word, a word already found, an invalid word, and the last 10 seconds. The grid must be comfortable to swipe with a thumb on a small phone, and nothing important should sit where the hand covers it.
5. Results. Win or lose, final scores, both players' word lists side by side, the best words the player missed, the rating change, and a rematch button.
6. Practice. Choose a bot difficulty from about five tiers. Unranked.
7. Leaderboard. Global and per-country, with the player's own position.
8. Profile. Username, avatar, country, rating and tier, win/loss record, best word, high score. Guests see a prompt to sign in with Apple to keep their progress.
9. Settings. Sound, haptics, account, delete account.
10. Small but required: a way to report a player, and a "please update the app" screen.

## What comes later, which the design should leave room for

Don't design these screens now, but don't paint the design into a corner either.

- A customisation store selling board and tile designs. The board and tiles should therefore be a swappable skin within a stable layout, and your default skin is the first of many.
- More modes: solo play (timed challenges, minigames), daily puzzles, and hybrids of word hunt with Wordle or crosswords. Home needs to grow from one mode to several without a redesign.
- Friendly matches by link. An app user sends a challenge link to a contact, who plays in a web browser with no download. These never affect rank. Each pair of friends has a running head-to-head tally, and the link's preview card in the chat shows it (for example "Anna 3 – 2 Sam"). The game screen will therefore also run in a mobile browser, so it should work without native-only interface elements.
- Ads and in-app purchases. Not in the first release, and I don't want placeholder ad slots, but be aware they are coming.

## What I'd like from you

Work in two steps.

Step 1: propose three clearly different visual directions. For each, give a name idea, the palette, the typography, the tile and board treatment, and the personality in a sentence, and show it applied to just two screens: the game board mid-round and the home screen. Make them genuinely distinct from each other, not three variations of one idea. Then stop and let me choose.

Step 2: once I pick a direction, design the full set of screens above in it, at phone size, as a mockup I can click through in order from first run to results. Use realistic content throughout: real boards with real findable words, plausible usernames, scores and ratings, not placeholder text.

Things that matter to me: the board screen should feel fast and satisfying, since players will see it hundreds of times. The feedback for a valid word should feel rewarding and the longer the word, the more so. Results should make the player want another round immediately. Rank and rating should feel worth chasing. It should read clearly in both light and dark surroundings, and colour should never be the only signal for valid, duplicate or invalid.

If something here is ambiguous, make a sensible choice and tell me what you assumed, instead of stopping to ask.
