import { readFileSync } from 'fs';

const startTime = performance.now();
const input = readFileSync('day12/input.txt', 'utf-8').trim().split('\n');
const lines = input.map((row) => {
  const [conditions, counts] = row.trim().split(' ');
  return { row: conditions.split(''), counts: counts.split(',').map((n) => parseInt(n)) };
});

let part1Result = 0;

const recursive = (row: string[], counts: number[]): number => {
  !counts.length ? console.log(row.join(''), counts, row.includes('#') ? 0 : 1) : console.log(row.join(''), counts);
  if (!counts.length) return row.includes('#') ? 0 : 1;
  if (!row.length || counts[0] > row.length) return 0;
  if (row.slice(0, counts[0]).every((c) => c === '?' || c === '#') && row.at(counts[0]) !== '#') {
    if (row[0] === '#') return recursive(row.slice(counts[0] + 1), counts.slice(1));

    return recursive(row.slice(counts[0] + 1), counts.slice(1)) + recursive(row.slice(1), counts);
  }
  return recursive(row.slice(1), counts);
};

lines.slice(9, 10).forEach(({ row, counts }) => {
  part1Result += recursive(row, counts);
});
console.log('Part 1:', part1Result);
console.log('Part 2:', 0);
console.log(`Performance: ${(performance.now() - startTime).toFixed(2)}ms`);
