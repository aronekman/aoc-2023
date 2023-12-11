import { readFileSync } from 'fs';

//1 for part 1, 1000000 for part 2
const MULTIPLIER = 1000000;

const startTime = performance.now();
const input = readFileSync('day11/input.txt', 'utf-8').split('\n');
type Cordinate = { x: number; y: number };
const galaxies: Cordinate[] = [];
input.forEach((row, y) => row.split('').forEach((c, x) => c === '#' && galaxies.push({ x, y })));
const originalWidth = input[0].trim().length;
const originalHeight = input.length;
const rowsToExpand = [];
const columnsToExpand = [];
for (let y = 0; y < originalHeight; y++) {
  if (galaxies.every((galaxy) => galaxy.y !== y)) {
    rowsToExpand.push(y);
  }
}
for (let x = 0; x < originalWidth; x++) {
  if (galaxies.every((galaxy) => galaxy.x !== x)) {
    columnsToExpand.push(x);
  }
}

rowsToExpand.forEach((row, index) => {
  galaxies
    .filter((galaxy) => galaxy.y > row + index * (MULTIPLIER - 1))
    .forEach((galaxy) => (galaxy.y += MULTIPLIER - 1));
});

columnsToExpand.forEach((col, index) => {
  galaxies
    .filter((galaxy) => galaxy.x > col + index * (MULTIPLIER - 1))
    .forEach((galaxy) => (galaxy.x += MULTIPLIER - 1));
});

const combinations = galaxies.map((g1, i) => galaxies.slice(i + 1).map((g2) => [g1, g2])).flat();

const part1Result = combinations.reduce(
  (prev, curr) => prev + Math.abs(curr[0].y - curr[1].y) + Math.abs(curr[0].x - curr[1].x),
  0
);

console.log('Part 1:', part1Result);
console.log('Part 2:', 0);
console.log(`Performance: ${(performance.now() - startTime).toFixed(2)}ms`);
