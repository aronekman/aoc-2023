import { readFileSync } from 'fs';

const startTime = performance.now();
const input = readFileSync('day8/input.txt', 'utf-8').trim().split('\n');

const navigation = input[0].trim().split('');
const nodes: Map<string, { left: string; right: string }> = new Map();
input.slice(2).forEach((row) => {
  const [label, nextElements] = row.trim().split(' = ');
  const [left, right] = nextElements.slice(1, nextElements.length - 1).split(', ');
  nodes.set(label, { left, right });
});

const startingNodes = [...nodes.keys()].filter((node) => node[2] === 'A');
const firstEncounter: number[] = [];
startingNodes.forEach((node) => {
  let current = node;
  let i = 0;
  let count = 0;
  while (current[2] !== 'Z') {
    if (i >= navigation.length) {
      i = 0;
    }
    const next = nodes.get(current);
    current = navigation[i] === 'R' ? next.right : next.left;
    count++;
    i++;
  }
  firstEncounter.push(count);
});

const gcd = (a: number, b: number) => (b ? gcd(b, a % b) : a);

let result = firstEncounter[0];

firstEncounter.slice(1).forEach((number) => {
  result = (number * result) / gcd(number, result);
});

console.log('Part 2:', result);
console.log(`Performance: ${(performance.now() - startTime).toFixed(2)}ms`);
