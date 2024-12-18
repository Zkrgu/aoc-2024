import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const bytes = input
  .split("\n")
  .map((e) => e.split(",").map((e) => parseInt(e)));

const size = 71;

const falling = 1024;

const grid = new Array(size).fill(0).map(() => new Array(size).fill(0));

let path;
for (let i = 0; true; ++i) {
  const [x, y] = bytes[i];
  grid[y][x] = 1;
  if (i < falling - 1) {
    continue;
  }
  if (path && !path.includes(toKey(x, y))) continue;
  path = bfs();
  if (i == falling - 1) {
    console.log(path.length - 1);
  }
  if (path.length == 1) {
    console.log(`${x},${y}`);
    break;
  }
}

function bfs() {
  const q = [toKey(0, 0)];
  const seen = new Set();
  const previous = new Map();

  seen.add(q[0]);

  while (q.length > 0) {
    const u = q.shift();
    for (const neigh of getNeigh(...fromKey(u))) {
      const neighKey = toKey(...neigh);
      if (seen.has(neighKey)) continue;
      seen.add(neighKey);
      previous.set(neighKey, u);
      q.push(neighKey);
    }
  }
  const path = buildPath(previous, toKey(size - 1, size - 1));
  return path;
}

function buildPath(prev, key) {
  let k = key;
  let p = [key];
  while (prev.has(k)) {
    k = prev.get(k);
    p.push(k);
  }
  return p;
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
