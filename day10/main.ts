import { readFileSync } from 'fs';

type Pipe = {
  tile: string;
  pos: [number, number];
  prev: [number, number];
  next: [number, number];
  distance: number;
};

const startTime = performance.now();
const input = readFileSync('day10/input.txt', 'utf-8').split('\n');

const grid = input.map((row) => row.trim().split(''));

const animalPosition: [number, number] = grid.reduce(
  (prev, curr, y) => {
    const animal = curr.findIndex((tile) => tile === 'S');
    if (animal > 0) return [animal, y];
    return prev;
  },
  [0, 0]
);

const getNext = (tile: string, prev: [number, number], pos: [number, number]): [number, number] => {
  switch (tile) {
    case '|':
      return pos[1] > prev[1] ? [pos[0], pos[1] + 1] : [pos[0], pos[1] - 1];
    case '-':
      return pos[0] > prev[0] ? [pos[0] + 1, pos[1]] : [pos[0] - 1, pos[1]];
    case 'L':
      return pos[1] > prev[1] ? [pos[0] + 1, pos[1]] : [pos[0], pos[1] - 1];
    case 'J':
      return pos[1] > prev[1] ? [pos[0] - 1, pos[1]] : [pos[0], pos[1] - 1];
    case '7':
      return pos[1] < prev[1] ? [pos[0] - 1, pos[1]] : [pos[0], pos[1] + 1];
    case 'F':
      return pos[1] < prev[1] ? [pos[0] + 1, pos[1]] : [pos[0], pos[1] + 1];
  }
};
const down = grid[animalPosition[1] + 1][animalPosition[0]];
const up = grid[animalPosition[1] - 1][animalPosition[0]];
const left = grid[animalPosition[1]][animalPosition[0] - 1];
const right = grid[animalPosition[1]][animalPosition[0] + 1];
const getStart = (): Pipe => {
  if (['|', 'J', 'L'].includes(down)) {
    return {
      tile: down,
      prev: animalPosition,
      pos: [animalPosition[0], animalPosition[1] + 1],
      next: getNext(down, animalPosition, [animalPosition[0], animalPosition[1] + 1]),
      distance: 1
    };
  } else if (['|', '7', 'F'].includes(up)) {
    return {
      tile: up,
      prev: animalPosition,
      pos: [animalPosition[0], animalPosition[1] - 1],
      next: getNext(down, animalPosition, [animalPosition[0], animalPosition[1] - 1]),
      distance: 1
    };
  } else if (['-', 'F', 'L'].includes(left)) {
    return {
      tile: left,
      prev: animalPosition,
      pos: [animalPosition[0] - 1, animalPosition[1]],
      next: getNext(down, animalPosition, [animalPosition[0] - 1, animalPosition[1]]),
      distance: 1
    };
  } else {
    return {
      tile: right,
      prev: animalPosition,
      pos: [animalPosition[0] + 1, animalPosition[1]],
      next: getNext(down, animalPosition, [animalPosition[0] + 1, animalPosition[1]]),
      distance: 1
    };
  }
};
let current = getStart();

const pipes: Pipe[] = [current];

while (true) {
  const nextTile = grid[current.next[1]][current.next[0]];
  if (nextTile === 'S') break;
  current = {
    tile: nextTile,
    prev: current.pos,
    pos: current.next,
    next: getNext(nextTile, current.pos, current.next),
    distance: current.distance + 1
  };
  pipes.push(current);
}
pipes.push({ tile: 'S', distance: 0, next: pipes[0].pos, prev: pipes.at(-1).pos, pos: pipes.at(-1).next });
pipes.reverse().forEach((pipe, index) => {
  pipe.distance = Math.min(pipe.distance, index + 1);
});
pipes.reverse();
const part1Result = Math.max(...pipes.map((pipe) => pipe.distance));
let part2Result = 0;

const width = grid[0].length;
const height = grid.length;

const cordinateToString = (x: number, y: number) => `${x},${y}`;

const esacpingTiles = new Set<string>();
const pipePositions = new Set<string>(pipes.map((pipe) => cordinateToString(pipe.pos[0], pipe.pos[1])));

const visited = new Set<string>();

const canEscape = (x: number, y: number): boolean => {
  const cord = cordinateToString(x, y);
  if (esacpingTiles.has(cord)) return true;
  if (pipePositions.has(cord)) return false;
  if (visited.has(cord)) return false;
  visited.add(cord);
  if (x <= 0 || x >= width - 1 || y <= 0 || y >= height - 1) {
    esacpingTiles.add(cord);
    return true;
  }
  const escape = canEscape(x, y - 1) || canEscape(x, y + 1) || canEscape(x - 1, y) || canEscape(x + 1, y);
  if (escape) {
    esacpingTiles.add(cord);
  }
  return escape;
};
const isTrap = (x: number, y: number) => {
  let horizontal = 0;
  let prev = '';
  for (let i = 0; i <= x; i++) {
    const pipe = pipes.find((pipe) => pipe.pos[0] === i && pipe.pos[1] === y);
    switch (pipe?.tile) {
      case '|':
        horizontal++;
        break;
      case 'L':
      case 'F':
        prev = pipe.tile;
        break;
      case '7':
        if (prev === 'L') {
          horizontal++;
        } else {
          prev = '';
        }
        break;
      case 'J':
        if (prev === 'F') {
          horizontal++;
        } else {
          prev = '';
        }
        break;
    }
  }

  return horizontal % 2 == 0;
};

grid.forEach((row, y) =>
  row.forEach((tile, x) => {
    if (pipePositions.has(cordinateToString(x, y))) return;
    visited.clear();
    if (canEscape(x, y)) return;
    if (isTrap(x, y)) return;
    part2Result++;
  })
);

console.log('Part 1:', part1Result);
console.log('Part 2:', part2Result);
console.log(`Performance: ${(performance.now() - startTime).toFixed(2)}ms`);
