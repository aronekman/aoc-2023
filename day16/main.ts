import { dir } from 'console';
import { readFileSync } from 'fs';

const startTime = performance.now();
const input = readFileSync('day16/input.txt', 'utf-8').trim();

type Direction = 'right' | 'down' | 'left' | 'up';
type Beam = { x: number; y: number; direction: Direction };
type Element = '.' | '\\' | '/' | '|' | '-';

const grid = input.split('\n').map((row) => row.trim().split('')) as Element[][];

const height = grid.length;
const width = grid[0].length;

const calculateEnergizedTiles = (beam: Beam) => {
  const beams: Beam[] = [beam];
  const visited = [...new Array(height * width)].map(() => ({ right: false, down: false, left: false, up: false }));
  while (beams.length > 0) {
    beams.forEach((beam, index) => {
      const visitedIndex = beam.y * width + beam.x;
      if (beam.x < 0 || beam.y < 0 || beam.x >= width || beam.y >= height || visited[visitedIndex][beam.direction]) {
        beams.splice(index, 1);
        return;
      }
      visited[visitedIndex][beam.direction] = true;
      const element = grid[beam.y][beam.x];
      switch (beam.direction) {
        case 'right':
          if (element === '\\') {
            beam.y += 1;
            beam.direction = 'down';
          } else if (element === '/') {
            beam.y -= 1;
            beam.direction = 'up';
          } else if (element === '|') {
            beams.push({ x: beam.x, y: beam.y + 1, direction: 'down' });
            beam.y -= 1;
            beam.direction = 'up';
          } else {
            beam.x += 1;
          }
          break;
        case 'down':
          if (element === '\\') {
            beam.x += 1;
            beam.direction = 'right';
          } else if (element === '/') {
            beam.x -= 1;
            beam.direction = 'left';
          } else if (element === '-') {
            beams.push({ x: beam.x + 1, y: beam.y, direction: 'right' });
            beam.x -= 1;
            beam.direction = 'left';
          } else {
            beam.y += 1;
          }
          break;
        case 'left':
          if (element === '\\') {
            beam.y -= 1;
            beam.direction = 'up';
          } else if (element === '/') {
            beam.y += 1;
            beam.direction = 'down';
          } else if (element === '|') {
            beams.push({ x: beam.x, y: beam.y + 1, direction: 'down' });
            beam.y -= 1;
            beam.direction = 'up';
          } else {
            beam.x -= 1;
          }
          break;
        case 'up':
          if (element === '\\') {
            beam.x -= 1;
            beam.direction = 'left';
          } else if (element === '/') {
            beam.x += 1;
            beam.direction = 'right';
          } else if (element === '-') {
            beams.push({ x: beam.x + 1, y: beam.y, direction: 'right' });
            beam.x -= 1;
            beam.direction = 'left';
          } else {
            beam.y -= 1;
          }
          break;
      }
    });
  }

  return visited.reduce((prev, { right, down, left, up }) => prev + (right || down || left || up ? 1 : 0), 0);
};

const part1Result = calculateEnergizedTiles({ x: 0, y: 0, direction: 'right' });

let part2Result = 0;

for (let x = 0; x < width; x++) {
  part2Result = Math.max(part2Result, calculateEnergizedTiles({ x, y: 0, direction: 'down' }));
  part2Result = Math.max(part2Result, calculateEnergizedTiles({ x, y: height - 1, direction: 'up' }));
}
for (let y = 0; y < height; y++) {
  part2Result = Math.max(part2Result, calculateEnergizedTiles({ x: 0, y, direction: 'right' }));
  part2Result = Math.max(part2Result, calculateEnergizedTiles({ x: width - 1, y, direction: 'left' }));
}

console.log('Part 1:', part1Result);
console.log('Part 2:', part2Result);
console.log(`Performance: ${(performance.now() - startTime).toFixed(2)}ms`);
