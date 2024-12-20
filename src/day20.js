import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const maze = input.split("\n").map((e) => e.split(""));

const width = maze[0].length;
const height = maze.length;

const startIndex = input.indexOf("S");
const startX = startIndex % (width + 1);
const startY = Math.floor(startIndex / (width + 1));

const endIndex = input.indexOf("E");
const endX = endIndex % (width + 1);
const endY = Math.floor(endIndex / (width + 1));

const q = [toKey(startX, startY)];
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
const regularPath = buildPath(previous, toKey(endX, endY));

let part1 = 0;
let part2 = 0;
for (const [i, step] of regularPath.slice(0, -100).entries()) {
  for (let j = i + 102; j < regularPath.length; ++j) {
    const step2 = regularPath[j];
    const dist = manhattan(step, step2);
    const saving = j - i - dist;
    if (dist <= 2 && saving >= 100) {
      ++part1;
    } else if (dist <= 20 && saving >= 100) {
      ++part2;
    }
  }
}

function manhattan(step1, step2) {
  const [x1, y1] = fromKey(step1);
  const [x2, y2] = fromKey(step2);
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

console.log(part1);
console.log(part2);

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
  return x + y * width;
}
function fromKey(pos) {
  const x = pos % width;
  const y = Math.floor(pos / width);
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
      newX < width &&
      newY < height &&
      maze[newY][newX] != "#"
    ) {
      neigh.push([newX, newY]);
    }
  }
  return neigh;
}
