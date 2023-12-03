import { readFileSync } from 'fs';
type Cordinate = {
  x: number;
  y: number;
};

type Number = {
  value: number;
  coord: Cordinate;
};

const symbols: Cordinate[] = [];
const gears: Cordinate[] = [];

const numbers: Number[] = [];

const input = readFileSync(`day3/input.txt`, 'utf-8');
input.split('\n').forEach((row, y) => {
  let match = row.match(/\d+/);

  let index = 0;

  while (match) {
    numbers.push({
      value: parseInt(match[0]),
      coord: { x: index + (match.index ?? 0), y }
    });
    index += (match.index ?? 0) + match?.[0].length;
    match = row.slice(index).match(/\d+/);
  }

  row.split('').forEach((char, x) => {
    if (char === '*') {
      gears.push({ x, y });
    }
    if (!isNaN(parseInt(char)) || char === '.') return;
    symbols.push({ x, y });
  });
});

const part1Result = numbers.reduce((prev, number) => {
  for (let x = number.coord.x - 1; x < number.coord.x + number.value.toString().length + 1; x += 1) {
    if (symbols.find((symbol) => symbol.y >= number.coord.y - 1 && symbol.y <= number.coord.y + 1 && symbol.x == x)) {
      return prev + number.value;
    }
  }
  return prev;
}, 0);

const part2Result = gears.reduce((prev, gear) => {
  const neighbours = numbers.filter((number) => {
    if (number.coord.y > gear.y + 1 || number.coord.y < gear.y - 1) return false;
    if (number.coord.x + number.value.toString().length < gear.x || number.coord.x > gear.x + 1) return false;
    return true;
  });
  if (neighbours.length == 2) {
    return prev + neighbours[0].value * neighbours[1].value;
  }
  return prev;
}, 0);

console.log('Part 1:', part1Result);
console.log('Part 2:', part2Result);
