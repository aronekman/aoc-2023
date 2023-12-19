import { readFileSync } from 'fs';
import { after } from 'node:test';

const startTime = performance.now();
const input = readFileSync('day13/input.txt', 'utf-8').trim();

const patterns = input.split(/\n\s*\n/).map((pattern) => {
  return pattern.split('\n').map((row) => row.trim().split(''));
});

const checkVertical = (pattern: string[][], lineNumber: number) => {
  const rightAmount = Math.min(pattern[0].length - lineNumber, lineNumber);
  const leftStart = lineNumber > rightAmount ? lineNumber - rightAmount : 0;
  let foundSmudge = false;
  for (const row of pattern) {
    const leftPattern = row.slice(leftStart, lineNumber).join('');
    const rightPattern = row
      .slice(lineNumber, lineNumber + rightAmount)
      .reverse()
      .join('');
    if (leftPattern !== rightPattern) {
      if (foundSmudge) return false;
      let count = 0;
      for (let j = 0; j < leftPattern.length; j++) {
        if (leftPattern[j] !== rightPattern[j]) {
          count++;
        }
      }
      if (count > 1) return false;
      foundSmudge = true;
    }
  }
  return foundSmudge;
};

const checkHorizontal = (pattern: string[][], lineNumber: number) => {
  const downAmount = Math.min(pattern.length - lineNumber, lineNumber);
  const start = lineNumber > downAmount ? lineNumber - downAmount : 0;
  let foundSmudge = false;
  for (let i = 0; i < pattern[0].length; i++) {
    const beforePattern = pattern
      .slice(start, lineNumber)
      .map((row) => row[i])
      .join('');
    const afterPattern = pattern
      .slice(lineNumber, lineNumber + downAmount)
      .map((row) => row[i])
      .reverse()
      .join('');

    if (beforePattern !== afterPattern) {
      if (foundSmudge) return false;
      let count = 0;
      for (let j = 0; j < beforePattern.length; j++) {
        if (beforePattern[j] !== afterPattern[j]) {
          count++;
        }
      }
      if (count > 1) return false;
      foundSmudge = true;
    }
  }
  return foundSmudge;
};

let result = 0;
patterns.forEach((pattern) => {
  let horizontal = 0;
  let vertical = 0;
  for (let i = 1; i < Math.max(pattern[0].length, pattern.length); i++) {
    if (vertical === 0 && i < pattern[0].length && checkVertical(pattern, i)) {
      vertical = i;
    }
    if (horizontal === 0 && i < pattern.length && checkHorizontal(pattern, i)) {
      horizontal = i;
    }
  }
  result += vertical + 100 * horizontal;
});
console.log('Part 2:', result);
console.log(`Performance: ${(performance.now() - startTime).toFixed(2)}ms`);
