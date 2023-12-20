import { readFileSync } from 'fs';

const startTime = performance.now();
const input = readFileSync('day15/input.txt', 'utf-8').trim().split(',');

const getHash = (sequense: string) => {
  let currentValue = 0;
  sequense.split('').forEach((char) => {
    const ascii = char.charCodeAt(0);
    currentValue += ascii;
    currentValue *= 17;
    currentValue %= 256;
  });
  return currentValue;
};

let part1Result = 0;
input.forEach((step) => {
  part1Result += getHash(step);
});

type Step = { label: string } & ({ operation: '='; focalLength: number } | { operation: '-' });
const steps: Step[] = input.map((step) => {
  if (step.includes('=')) {
    const [label, focalLength] = step.split('=');
    return { label, operation: '=', focalLength: parseInt(focalLength) };
  }
  return { label: step.slice(0, step.length - 1), operation: '-' };
});

const boxes: { label: string; focalLength: number }[][] = [...new Array(256)].map(() => []);

steps.forEach((step, i) => {
  const hash = getHash(step.label);
  const index = boxes[hash].findIndex((slot) => slot.label === step.label);
  if (step.operation === '-') {
    if (index !== -1) {
      boxes[hash].splice(index, 1);
    }
  } else {
    if (index !== -1) {
      boxes[hash].splice(index, 1, { label: step.label, focalLength: step.focalLength });
    } else {
      boxes[hash].push({ label: step.label, focalLength: step.focalLength });
    }
  }
  /* console.log(`After "${step.label}${step.operation}${step.operation === '=' ? step.focalLength : ''}"`);
  boxes.forEach((box, boxNumber) => {
    if (box.length > 0) console.log(`Box ${boxNumber}`, box.map((b) => `[${b.label} ${b.focalLength}]`).join(' '));
  });
  console.log(); */
});

const part2Result = boxes.reduce(
  (prev, box, boxNumber) =>
    prev +
    box.reduce((prev, slot, slotnumber) => {
      return prev + (boxNumber + 1) * (slotnumber + 1) * slot.focalLength;
    }, 0),
  0
);

console.log('Part 1:', part1Result);
console.log('Part 2:', part2Result);
console.log(`Performance: ${(performance.now() - startTime).toFixed(2)}ms`);
