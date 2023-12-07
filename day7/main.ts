import { readFileSync } from 'fs';

const startTime = performance.now();
const input = readFileSync('day7/input.txt', 'utf-8').trim().split('\n');

const hands = input.map((row) => {
  const [hand, rank] = row.split(' ');
  return { hand, rank: parseInt(rank) };
});

type Hand = (typeof hands)[0];

const cards1 = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const cards2 = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

const getHandStrenght = (hand: string, joker: boolean) => {
  const characterCount = {};
  hand.split('').forEach((char) => {
    if (characterCount[char]) {
      characterCount[char] += 1;
    } else {
      characterCount[char] = 1;
    }
  });
  const length = Object.keys(characterCount).length;
  const jokerCount = joker ? characterCount['J'] : false;
  if (length === 5) {
    return jokerCount ? 1 : 0;
  }
  if (length === 4) {
    return jokerCount ? 3 : 1;
  }
  if (length === 3) {
    if (Object.values(characterCount).includes(2)) {
      if (jokerCount) {
        return jokerCount === 1 ? 4 : 5;
      }
      return 2;
    } else {
      return jokerCount ? 5 : 3;
    }
  }
  if (length === 2) {
    if (Object.values(characterCount).includes(2)) {
      return jokerCount ? 6 : 4;
    } else {
      return jokerCount ? 6 : 5;
    }
  }
  return 6;
};

const compareHands = (hand1: string, hand2: string, joker: boolean) => {
  const hand1Strength = getHandStrenght(hand1, joker);
  const hand2Strength = getHandStrenght(hand2, joker);
  const cards = joker ? cards2 : cards1;
  if (hand1Strength === hand2Strength) {
    for (let i = 0; i < 5; i++) {
      const card1Strength = cards.findIndex((card) => card === hand1[i]);
      const card2Strength = cards.findIndex((card) => card === hand2[i]);
      if (card1Strength !== card2Strength) {
        return card1Strength > card2Strength;
      }
    }
  }
  return hand1Strength < hand2Strength;
};

const partition = (array: Hand[], low: number, high: number, joker: boolean) => {
  const pivotHand = array[high];
  let i = low - 1;
  for (let j = low; j <= high - 1; j++) {
    if (compareHands(array[j].hand, pivotHand.hand, joker)) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  [array[i + 1], array[high]] = [array[high], array[i + 1]];
  return i + 1;
};
const quickSortHands = (array: Hand[], low: number, high: number, joker: boolean) => {
  if (low < high) {
    const partitionIndex = partition(array, low, high, joker);
    quickSortHands(array, low, partitionIndex - 1, joker);
    quickSortHands(array, partitionIndex + 1, high, joker);
  }
};

quickSortHands(hands, 0, hands.length - 1, false);
const part1Result = hands.reduce((prev, curr, index) => prev + curr.rank * (index + 1), 0);
quickSortHands(hands, 0, hands.length - 1, true);
const part2Result = hands.reduce((prev, curr, index) => prev + curr.rank * (index + 1), 0);
console.log('Part 1:', part1Result);
console.log('Part 2:', part2Result);
console.log(`Performance: ${(performance.now() - startTime).toFixed(2)}ms`);
