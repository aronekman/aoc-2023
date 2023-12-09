import { readFileSync } from 'fs';

const startTime = performance.now();
const input = readFileSync('day9/input.txt', 'utf-8').split('\n');
const histories = input.map((row) => row.split(' ').map((num) => parseInt(num)));

const getNextRow = (row: number[]) => [...new Array(row.length - 1)].map((_, i) => row[i + 1] - row[i]);

let part1Result = 0;
let part2Result = 0;

histories.forEach((history) => {
  const rows = [history];
  while (!rows.at(-1).every((num) => num === 0)) rows.push(getNextRow(rows.at(-1)));
  rows.at(-1).push(0, 0);
  for (let i = rows.length - 1; i > 0; i--) {
    rows[i - 1].push(rows[i - 1].at(-1) + rows[i].at(-1));
    rows[i - 1].unshift(rows[i - 1][0] - rows[i][0]);
  }
  part1Result += rows[0].at(-1);
  part2Result += rows[0][0];
});

console.log('Part 1:', part1Result);
console.log('Part 2:', part2Result);
console.log(`Performance: ${(performance.now() - startTime).toFixed(2)}ms`);
