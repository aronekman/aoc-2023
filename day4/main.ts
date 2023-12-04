import { readFileSync } from 'fs';
type Card = {
  instances: number;
  winningNumbers: number[];
  ownNumbers: number[];
};
const cards: Card[] = [];
const input = readFileSync(`day4/input.txt`, 'utf-8');
input.split('\n').forEach((row) => {
  const numbers = row.split(': ')[1].split(' | ');
  cards.push({
    instances: 1,
    winningNumbers: numbers[0]
      .split(' ')
      .map((num) => parseInt(num))
      .filter(Boolean),
    ownNumbers: numbers[1]
      .split(' ')
      .map((num) => parseInt(num))
      .filter(Boolean)
  });
});

const part1Result = cards.reduce(
  (prev, card) =>
    prev +
    card.ownNumbers.reduce((worth, number) => {
      if (card.winningNumbers.includes(number)) {
        return worth > 0 ? worth * 2 : 1;
      }
      return worth;
    }, 0),
  0
);

cards.forEach((card, index) => {
  const matchings = card.ownNumbers.reduce((prev, number) => {
    if (card.winningNumbers.includes(number)) {
      return prev + 1;
    }
    return prev;
  }, 0);
  for (let i = index + 1; i < cards.length && i < index + matchings + 1; i += 1) {
    cards[i].instances += card.instances;
  }
});

const part2Result = cards.reduce((prev, card) => prev + card.instances, 0);
console.log('Part 1:', part1Result);
console.log('Part 2:', part2Result);
