import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const map = input.split("\n").map((e) => e.split(""));

const area = new Map();
const perimiter = new Map();
const sides = new Map();

const dirs = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

for (const [y, row] of map.entries()) {
  for (const [x, plot] of row.entries()) {
    if (plot === "#") continue;
    map[y][x] = "#";
    let areas = new Set();
    const queue = [[x, y]];
    while (queue.length > 0) {
      const [x, y] = queue.pop();
      const key = x + y * map[0].length;
      areas.add(key);
      for (const [dx, dy] of dirs) {
        const neighbour = map[y + dy]?.[x + dx];
        if (neighbour == plot) {
          queue.push([x + dx, y + dy]);
          map[y + dy][x + dx] = "#";
        }
      }
    }
    const key = x + y * map[0].length;
    area.set(key, areas);
  }
}

function fromKey(key) {
  const x = key % map[0].length;
  const y = Math.floor(key / map[0].length);
  return [x, y];
}

function toKey(x, y) {
  if (x < 0 || y < 0) return -1;
  return x + y * map[0].length;
}

for (const [k, set] of area.entries()) {
  let perimiters = 0;
  let sideCount = 0;
  for (const key of set) {
    const [x, y] = fromKey(key);
    let localPerim = [];
    for (const [i, [dx, dy]] of dirs.entries()) {
      if (y + dy < 0 || x + dx < 0) {
        localPerim.push(i);
        continue;
      }
      if (set.has(toKey(x + dx, y + dy))) continue;
      localPerim.push(i);
    }
    sideCount += !set.has(toKey(x - 1, y)) && !set.has(toKey(x, y - 1));
    sideCount += !set.has(toKey(x + 1, y)) && !set.has(toKey(x, y - 1));
    sideCount += !set.has(toKey(x - 1, y)) && !set.has(toKey(x, y + 1));
    sideCount += !set.has(toKey(x + 1, y)) && !set.has(toKey(x, y + 1));

    sideCount +=
      set.has(toKey(x - 1, y)) &&
      set.has(toKey(x, y - 1)) &&
      !set.has(toKey(x - 1, y - 1));
    sideCount +=
      set.has(toKey(x + 1, y)) &&
      set.has(toKey(x, y - 1)) &&
      !set.has(toKey(x + 1, y - 1));
    sideCount +=
      set.has(toKey(x - 1, y)) &&
      set.has(toKey(x, y + 1)) &&
      !set.has(toKey(x - 1, y + 1));
    sideCount +=
      set.has(toKey(x + 1, y)) &&
      set.has(toKey(x, y + 1)) &&
      !set.has(toKey(x + 1, y + 1));
    perimiters += localPerim.length;
  }
  perimiter.set(k, perimiters);
  sides.set(k, sideCount);
}

let part1 = 0;
let part2 = 0;
for (const [plot, set] of area.entries()) {
  const plotArea = set.size;
  const plotPerimiter = perimiter.get(plot);
  const plotSides = sides.get(plot);
  part1 += plotArea * plotPerimiter;
  part2 += plotArea * plotSides;
}

console.log(part1);
console.log(part2);
