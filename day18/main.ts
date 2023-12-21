import { dir } from 'console';
import { readFileSync } from 'fs';

const startTime = performance.now();
const input = readFileSync('day18/input.txt', 'utf-8').trim();

type Position = { x: number; y: number };
const commands = input.split('\n').map((row) => {
  const [direction, distance, color] = row.trim().split(' ');
  return { direction, distance: parseInt(distance), color: color.slice(1, color.length - 1) };
}) as { direction: 'R' | 'D' | 'L' | 'U'; distance: number; color: string }[];

const trenchPositions: Position[] = [];

let currentPos: Position = { x: 0, y: 0 };
commands.forEach(({ direction, distance }) => {
  switch (direction) {
    case 'R':
      for (let i = 1; i <= distance; i++) trenchPositions.push({ x: currentPos.x + i, y: currentPos.y });
      currentPos.x += distance;
      break;
    case 'D':
      for (let i = 1; i <= distance; i++) trenchPositions.push({ x: currentPos.x, y: currentPos.y + i });
      currentPos.y += distance;
      break;
    case 'L':
      for (let i = 1; i <= distance; i++) trenchPositions.push({ x: currentPos.x - i, y: currentPos.y });
      currentPos.x -= distance;
      break;
    case 'U':
      for (let i = 1; i <= distance; i++) trenchPositions.push({ x: currentPos.x, y: currentPos.y - i });
      currentPos.y -= distance;
      break;
  }
});

const minY = Math.min(...trenchPositions.map(({ y }) => y));
const maxY = Math.max(...trenchPositions.map(({ y }) => y));
const minX = Math.min(...trenchPositions.map(({ x }) => x));
const maxX = Math.max(...trenchPositions.map(({ x }) => x));
const grid: ('#' | '.')[][] = [];
for (let y = minY - 1; y <= maxY + 1; y++) {
  grid.push([]);
  for (let x = minX - 1; x <= maxX + 1; x++) {
    if (trenchPositions.find((trench) => trench.x === x && trench.y === y)) {
      grid.at(-1).push('#');
    } else {
      grid.at(-1).push('.');
    }
  }
}

grid.forEach((row) => console.log(row.join('')));
console.log();

grid.forEach((row, y) => {
  let direction: 'U' | 'D' = undefined;
  let count = 0;
  row.forEach((cell, x) => {
    if (cell === '#') {
      if (!direction) {
        if (grid[y][x + 1] === '#') {
          direction = grid[y + 1][x] === '#' ? 'U' : 'D';
        } else {
          count++;
        }
        return;
      }
      if (grid[y][x + 1] === '#') return;
      if (direction === 'D' && grid[y + 1][x] === '#') {
        count++;
        direction = undefined;
      } else if (direction === 'U' && grid[y + 1][x] === '.') {
        count++;
        direction = undefined;
      } else {
        direction = undefined;
      }
    } else if (count % 2 === 1) {
      grid[y][x] = '#';
    }
  });
});

grid.forEach((row) => console.log(row.join('')));

const part1Result = grid.reduce((prev, row) => prev + row.reduce((prev, cell) => prev + (cell === '#' ? 1 : 0), 0), 0);

console.log('Part 1:', part1Result);
console.log('Part 2:', 0);
console.log(`Performance: ${(performance.now() - startTime).toFixed(2)}ms`);
