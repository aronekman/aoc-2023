import { readFileSync } from 'fs';

const startTime = performance.now();
const input = readFileSync('day5/input.txt', 'utf-8');
const rows = input.split('\n').map((row) => row.trimEnd());
const seeds = rows[0].match(/\d+/g).map((num) => parseInt(num));

const seedsAndRange: number[][] = [];
for (let i = 0; i < seeds.length; i += 2) {
  seedsAndRange.push([seeds[i], seeds[i + 1]]);
}

const seedToSoil = rows
  .slice(rows.indexOf('seed-to-soil map:') + 1, rows.indexOf('soil-to-fertilizer map:') - 1)
  .map((row) => row.split(' ').map((num) => parseInt(num)));
const soilToFertilizer = rows
  .slice(rows.indexOf('soil-to-fertilizer map:') + 1, rows.indexOf('fertilizer-to-water map:') - 1)
  .map((row) => row.split(' ').map((num) => parseInt(num)));
const fertilizerToWater = rows
  .slice(rows.indexOf('fertilizer-to-water map:') + 1, rows.indexOf('water-to-light map:') - 1)
  .map((row) => row.split(' ').map((num) => parseInt(num)));
const waterToLight = rows
  .slice(rows.indexOf('water-to-light map:') + 1, rows.indexOf('light-to-temperature map:') - 1)
  .map((row) => row.split(' ').map((num) => parseInt(num)));
const lightToTemperature = rows
  .slice(rows.indexOf('light-to-temperature map:') + 1, rows.indexOf('temperature-to-humidity map:') - 1)
  .map((row) => row.split(' ').map((num) => parseInt(num)));
const temperatureToHumidity = rows
  .slice(rows.indexOf('temperature-to-humidity map:') + 1, rows.indexOf('humidity-to-location map:') - 1)
  .map((row) => row.split(' ').map((num) => parseInt(num)));
const humidityToLocation = rows
  .slice(rows.indexOf('humidity-to-location map:') + 1, rows.length - 1)
  .map((row) => row.split(' ').map((num) => parseInt(num)));

const convert = (current: number, converterArray: number[][]): number => {
  for (const [destination, source, length] of converterArray) {
    if (current < source) continue;
    const diff = current - source;
    if (diff <= length) {
      return destination + diff;
    }
  }
  return current;
};

const converter2 = (start: number, range: number, converterArray: number[][], print: boolean = false): number[][] => {
  let tempStart = start;
  let tempRange = range;
  const result: number[][] = [];
  for (const [destination, source, length] of [...converterArray].sort((a, b) => a[1] - b[1])) {
    if (tempStart + tempRange < source || tempStart > source + length) continue;
    if (tempStart < source) {
      const diff = source - tempStart;
      result.push([tempStart, diff]);
      if (tempRange - diff < length) {
        return [...result, [destination, tempRange - diff]];
      } else {
        result.push([destination, length]);
        tempStart += length - diff;
        tempRange -= length - diff;
      }
    } else {
      const diff = tempStart - source;
      if (tempRange <= length) {
        return [...result, [destination + diff, tempRange]];
      } else {
        result.push([destination + diff, length - diff]);
        tempStart += length - diff;
        tempRange -= length - diff;
      }
    }
  }
  return result.length > 0 ? result : [[start, range]];
};

const part1 = () => {
  const soils = seeds.map((seed) => convert(seed, seedToSoil));
  const fertilizers = soils.map((soil) => convert(soil, soilToFertilizer));
  const waters = fertilizers.map((fertilizer) => convert(fertilizer, fertilizerToWater));
  const lights = waters.map((water) => convert(water, waterToLight));
  const temperatures = lights.map((light) => convert(light, lightToTemperature));
  const humidities = temperatures.map((temperature) => convert(temperature, temperatureToHumidity));
  const locations = humidities.map((humidity) => convert(humidity, humidityToLocation));
  return Math.min(...locations);
};

const part2 = () => {
  return seedsAndRange.reduce((prev, seed) => {
    const soils = converter2(seed[0], seed[1], seedToSoil);
    const fertilizers = soils.map((soil) => converter2(soil[0], soil[1], soilToFertilizer)).flat();
    const waters = fertilizers.map((fertilizer) => converter2(fertilizer[0], fertilizer[1], fertilizerToWater)).flat();
    const lights = waters.map((water) => converter2(water[0], water[1], waterToLight)).flat();
    const temperatures = lights.map((light) => converter2(light[0], light[1], lightToTemperature)).flat();
    const humidities = temperatures.map((temp) => converter2(temp[0], temp[1], temperatureToHumidity)).flat();
    const locations = humidities.map((humidity) => converter2(humidity[0], humidity[1], humidityToLocation)).flat();
    return Math.min(...locations.map((loc) => loc[0]), prev);
  }, Number.MAX_VALUE);
};

console.log('Part 1:', part1());
console.log('Part 2:', part2());

console.log(`Performance: ${(performance.now() - startTime).toFixed(2)}ms`);
