import { readFileSync } from 'fs';

const startTime = performance.now();
const input = readFileSync('day14/input.txt', 'utf-8').trim();
const grid = input.split('\n').map((row) => row.trim().split(''));

const height = grid.length;
const width = grid[0].length;

const currentload = () =>
  grid.reduce(
    (prev, row, index) => prev + row.reduce((prev, curr) => (curr === 'O' ? prev + height - index : prev), 0),
    0
  );

const spin = (times: number) => {
  while (times > 0) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (grid[y][x] === 'O') {
          grid[y][x] = '.';
          let i = y;
          while (i > 0 && grid[i - 1][x] === '.') i--;
          grid[i][x] = 'O';
        }
      }
    }

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (grid[y][x] === 'O') {
          grid[y][x] = '.';
          let i = x;
          while (i > 0 && grid[y][i - 1] === '.') i--;
          grid[y][i] = 'O';
        }
      }
    }

    for (let y = height - 1; y >= 0; y--) {
      for (let x = 0; x < width; x++) {
        if (grid[y][x] === 'O') {
          grid[y][x] = '.';
          let i = y;
          while (i < height - 1 && grid[i + 1][x] === '.') i++;
          grid[i][x] = 'O';
        }
      }
    }

    for (let x = width - 1; x >= 0; x--) {
      for (let y = 0; y < height; y++) {
        if (grid[y][x] === 'O') {
          grid[y][x] = '.';
          let i = x;
          while (i < width - 1 && grid[y][i + 1] === '.') i++;
          grid[y][i] = 'O';
        }
      }
    }
    times--;
  }
};

grid.forEach((row, y) =>
  row.forEach((elem, x) => {
    if (elem === 'O') {
      grid[y][x] = '.';
      let i = y;
      while (i > 0 && grid[i - 1][x] === '.') i--;
      grid[i][x] = 'O';
    }
  })
);
const part1Result = currentload();
const prevPositions = [grid.map((row) => row.join('')).join('')];
while (true) {
  spin(1);

  const currentPosition = grid.map((row) => row.join('')).join('');
  const match = prevPositions.findIndex((pos) => pos === currentPosition);
  if (match !== -1) {
    spin(((1000000000 - match + 1) % (prevPositions.length - match)) - 1);
    break;
  }
  prevPositions.push(currentPosition);
}

const part2Result = currentload();

console.log('Part 1:', part1Result);
console.log('Part 2:', part2Result);
console.log(`Performance: ${(performance.now() - startTime).toFixed(2)}ms`);
