import { expectedScore, marginMultiplier, ratingChange } from '../engine/rating';
import { housePlayer, housePlayerForRating } from '../housePlayers';
import { pointsToNextTier, tierForRating } from '../tiers';

const established = { matchesPlayed: 50 };
const bolt = housePlayer('bolt').hiddenRating;

describe('ratingChange: the worked examples in docs/PRODUCT.md', () => {
  it('close win over a 1,655 human: +17, as on the Results mockup', () => {
    expect(ratingChange({ playerRating: 1642, opponentRating: 1655, playerScore: 4800, opponentScore: 4400, ...established }).delta).toBe(17);
  });

  it('narrow win over Bolt: +19', () => {
    expect(ratingChange({ playerRating: 1642, opponentRating: bolt, playerScore: 5000, opponentScore: 4800, ...established }).delta).toBe(19);
  });

  it('win over Bolt by 60%: +28', () => {
    expect(ratingChange({ playerRating: 1642, opponentRating: bolt, playerScore: 10000, opponentScore: 4000, ...established }).delta).toBe(28);
  });

  it('loss to a 1,655 human, any margin: −12', () => {
    for (const opponentScore of [4900, 20000]) {
      expect(ratingChange({ playerRating: 1642, opponentRating: 1655, playerScore: 4800, opponentScore, ...established }).delta).toBe(-12);
    }
  });

  it('loss to Bolt, any margin: −10', () => {
    expect(ratingChange({ playerRating: 1642, opponentRating: bolt, playerScore: 1000, opponentScore: 9000, ...established }).delta).toBe(-10);
  });

  it('a 1,790 player beating Bolt by 60%: +18', () => {
    expect(ratingChange({ playerRating: 1790, opponentRating: bolt, playerScore: 10000, opponentScore: 4000, ...established }).delta).toBe(18);
  });
});

describe('ratingChange: rules', () => {
  it('caps the margin bonus: a crushing win earns no more than a 50% win', () => {
    const at50 = ratingChange({ playerRating: 1500, opponentRating: 1500, playerScore: 2000, opponentScore: 1000, ...established });
    const crushing = ratingChange({ playerRating: 1500, opponentRating: 1500, playerScore: 30000, opponentScore: 1000, ...established });
    expect(crushing.delta).toBe(at50.delta);
    expect(crushing.multiplier).toBe(1.5);
  });

  it('never moves more than 40 in a match, or 60 during placement', () => {
    const upset = { playerRating: 1000, opponentRating: 2400, playerScore: 9000, opponentScore: 1000 };
    expect(ratingChange({ ...upset, ...established }).delta).toBe(40);
    expect(ratingChange({ ...upset, matchesPlayed: 0 }).delta).toBe(60);
  });

  it('uses the bigger K in placement and the smaller K from 2,000', () => {
    const even = { opponentScore: 1000, playerScore: 1050 };
    expect(ratingChange({ ...even, playerRating: 1500, opponentRating: 1500, matchesPlayed: 3 }).delta).toBe(24);
    expect(ratingChange({ ...even, playerRating: 1500, opponentRating: 1500, ...established }).delta).toBe(16);
    expect(ratingChange({ ...even, playerRating: 2050, opponentRating: 2050, ...established }).delta).toBe(12);
  });

  it('gives no margin bonus to an implausible win', () => {
    const win = { playerRating: 1500, opponentRating: 1500, playerScore: 9000, opponentScore: 1000, ...established };
    expect(ratingChange(win).delta).toBe(24);
    expect(ratingChange({ ...win, plausible: false }).delta).toBe(16);
  });

  it('never drops below the 1,000 floor', () => {
    expect(ratingChange({ playerRating: 1003, opponentRating: 1000, playerScore: 0, opponentScore: 5000, ...established }).newRating).toBe(1000);
  });

  it('treats a tie as half a win', () => {
    expect(ratingChange({ playerRating: 1500, opponentRating: 1500, playerScore: 3000, opponentScore: 3000, ...established })).toMatchObject({
      result: 'tie',
      delta: 0,
    });
  });

  it('computes expectations and margins', () => {
    expect(expectedScore(1500, 1500)).toBe(0.5);
    expect(marginMultiplier(1000, 950)).toBe(1);
    expect(marginMultiplier(1000, 800)).toBe(1.15);
    expect(marginMultiplier(1000, 600)).toBe(1.3);
  });
});

describe('tiers', () => {
  it('matches the sample data: 1,642 is Gold II, 58 to Gold I', () => {
    expect(tierForRating(1642).id).toBe('gold2');
    expect(pointsToNextTier(1642)).toMatchObject({ next: { id: 'gold1' }, points: 58 });
  });

  it('shows ratings under 1,200 as Bronze II and 2,200+ as Legend', () => {
    expect(tierForRating(1000).id).toBe('bronze2');
    expect(tierForRating(2250).id).toBe('legend');
    expect(pointsToNextTier(2250)).toBeNull();
  });
});

describe('house-player matching', () => {
  it.each([
    [1000, 'pip'],
    [1399, 'pip'],
    [1400, 'dash'],
    [1642, 'bolt'],
    [1800, 'nova'],
    [2099, 'nova'],
    [2100, 'titan'],
    [2600, 'titan'],
  ])('a %i player meets %s', (rating, id) => {
    expect(housePlayerForRating(rating).id).toBe(id);
  });
});
