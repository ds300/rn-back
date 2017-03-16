// @flow

import {observable} from 'mobx';
import RandomSeed from 'random-seed';

type Letter =
  'T' |
  'S' |
  'K' |
  'R' |
  'H' |
  'Q' |
  'X';

type GameState = {|
  letters: Letter[];
  positions: number[];
  index: number;
  letterHitReported: boolean;
  positionHitReported: boolean;
  letterHits: number;
  letterMisses: number;
  positionHits: number;
  positionMisses: number;
|};

type RoundResult = {|
  n: number;
  letterHits: number;
  letterMisses: number;
  positionHits: number;
  positionMisses: number;
|};

const CHARS: Letter[] = Object.freeze([
  'T',
  'S',
  'K',
  'R',
  'H',
  'Q',
  'X'
]);

export class AppState {
  @observable n = 2;
  @observable history: RoundResult[] = [];
  @observable gameState: ?GameState = null;
}

/**
 *
 * @param {any[]} items
 * @param {number} n
 */
function calculatePossibleHits(items: any[], n: number): number {
  let possibleHits = 0;
  for (let i = 0; i < items.length - n; i++) {
    if (items[i] === items[i + n]) {
      possibleHits++;
    }
  }
  return possibleHits;
}

/**
 *
 * @param {string} seed - a seed for the random number generator
 * @param {number} n - the n in n-back
 * @param {number} length - the length of the round
 */
function newGameState(seed: string, n: number, length: number = 20): GameState {
  const letters = [];
  const positions = [];
  const rng = RandomSeed.create(seed);

  let possibleLetterHits = 0;
  let possiblePositionHits = 0;
  for (let i = 0; i < length; i++) {
    const letter = rng.intBetween(0, CHARS.length-1);
    const position = rng.intBetween(0, 8);
    if (i >= n) {
      if (letters[i-n] === letter) {
        possibleLetterHits++;
      }
      if (positions[i-n] === position) {
        possiblePositionHits++;
      }
    }

    letters.push(letter);
    positions.push(position);
  }

  // guarantee a certain proportion of possible hits per round
  while (possibleLetterHits + possiblePositionHits < length / 4) {
    if (rng.intBetween(0, 1) === 0) {
      let i;

      do {
        i = rng.intBetween(0, (length - n) - 1);
      } while (letters[i] === letters[i+n])

      letters[i] = letters[i+n];
      possibleLetterHits++;
    } else {
      let i;

      do {
        i = rng.intBetween(0, (length - n) - 1);
      } while (positions[i] === positions[i+n])

      positions[i] = positions[i+n];
      possiblePositionHits++;
    }
  }

  return {
    letters,
    positions,
    index: 0,
    letterHitReported: false,
    positionHitReported: false,
    letterHits: 0,
    letterMisses: 0,
    positionHits: 0,
    positionMisses: 0
  };
}


