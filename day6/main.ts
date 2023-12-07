import { readFileSync } from 'fs';

type Race = { time: number; distance: number };

const startTime = performance.now();
const input = readFileSync('day6/input.txt', 'utf-8').split('\n');
const timeInputs = input[0].match(/\d+/g).map((num) => parseInt(num));
const distanceInputs = input[1].match(/\d+/g).map((num) => parseInt(num));
const races: Race[] = [];
for (let i = 0; i < timeInputs.length; i++) {
  races.push({ time: timeInputs[i], distance: distanceInputs[i] });
}

let part1Result = 1;
for (const race of races) {
  let winCount = 0;
  for (let i = 1; i < race.time; i++) {
    const totalDist = i * (race.time - i);
    if (totalDist > race.distance) {
      winCount++;
    }
  }
  part1Result *= winCount;
}

const part2Time = parseInt(timeInputs.join(''));
const part2Distance = parseInt(distanceInputs.join(''));
let part2Result = 0;
for (let i = 0; i < part2Time; i++) {
  if (i * (part2Time - i) > part2Distance) {
    part2Result++;
  }
}
console.log('Part 1:', part1Result);

console.log('Part 2:', part2Result);

console.log(`Performance: ${(performance.now() - startTime).toFixed(2)}ms`);
