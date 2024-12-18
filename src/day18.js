import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const bytes = input
  .split("\n")
  .map((e) => e.split(",").map((e) => parseInt(e)));

const size = 71;

const falling = 1024;

const grid = new Array(size).fill(0).map(() => new Array(size).fill(0));

for (let i = 0; true; ++i) {
  const [x, y] = bytes[i];
  grid[y][x] = 1;
  if (i < falling - 1) {
    continue;
  }
  const dist = dijkstra();
  if (i == falling - 1) {
    console.log(dist);
  }
  if (dist == undefined) {
    console.log(`${x}, ${y}`);
    break;
  }
}

function dijkstra() {
  const q = [toKey(0, 0)];
  const seen = new Set();
  const dist = new Map();
  const previous = new Map();

  dist.set(q[0], 0);

  while (q.length > 0) {
    const u = q.shift();
    if (seen.has(u)) continue;
    seen.add(u);
    for (const neigh of getNeigh(...fromKey(u))) {
      const neighKey = toKey(...neigh);
      const alt = dist.get(u) + 1;
      const bestDist = dist.get(neighKey) ?? Infinity;
      if (alt < bestDist) {
        dist.set(neighKey, alt);
        previous.set(neighKey, [u]);
        q.push(neighKey);
      }
    }
    q.sort((a, b) => (dist.get(a) ?? Infinity) - (dist.get(b) ?? Infinity));
  }
  return dist.get(toKey(size - 1, size - 1));
}

function toKey(x, y) {
  return x + y * size;
}
function fromKey(pos) {
  const x = pos % size;
  const y = Math.floor(pos / size);
  return [x, y];
}

function getNeigh(x, y) {
  const dir = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  const neigh = [];
  for (const [dx, dy] of dir) {
    const newX = x + dx;
    const newY = y + dy;
    if (
      newX >= 0 &&
      newY >= 0 &&
      newX < size &&
      newY < size &&
      grid[newY][newX] != 1
    ) {
      neigh.push([newX, newY]);
      neigh.push([newX, newY]);
    }
  }
  return neigh;
}
