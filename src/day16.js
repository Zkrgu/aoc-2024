import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const maze = input.split("\n").map((e) => e.split(""));

const startIndex = input.indexOf("S");
const goalIndex = input.indexOf("E");

const width = maze[0].length;
const height = maze.length;

const startX = startIndex % (width + 1);
const startY = Math.floor(startIndex / (width + 1));

const endX = goalIndex % (width + 1);
const endY = Math.floor(goalIndex / (width + 1));

const q = [[startX, startY, 0]];
const dist = new Map();
const previous = new Map();

dist.set(toKey(...q[0]), 0);

while (q.length > 0) {
  const u = q.pop();
  for (const neigh of getNeigh(...u)) {
    const alt = dist.get(toKey(...u)) + neigh[3];
    const bestDist = dist.get(toKey(neigh[0], neigh[1], neigh[2])) ?? Infinity;
    if (alt < bestDist) {
      dist.set(toKey(neigh[0], neigh[1], neigh[2]), alt);
      previous.set(toKey(neigh[0], neigh[1], neigh[2]), [u]);
      q.push([neigh[0], neigh[1], neigh[2]]);
    } else if (alt == bestDist) {
      previous.get(toKey(neigh[0], neigh[1], neigh[2])).push(u);
    }
  }
}

function toKey(x, y, dir) {
  const pos = x + y * width;
  const k = (pos << 2) + dir;
  return k;
}
function fromKey(num) {
  const dir = num & 3;
  const pos = num >> 2;
  const x = pos % width;
  const y = Math.floor(pos / width);
  return [x, y, dir];
}

const endNodes = [
  toKey(endX, endY, 0),
  toKey(endX, endY, 1),
  toKey(endX, endY, 2),
  toKey(endX, endY, 3),
];

const part1 = endNodes.reduce(
  (p, c) => Math.min(p, dist.get(c) ?? Infinity),
  Infinity,
);

const q2 = endNodes.filter((e) => dist.get(e) == part1);
const unique = new Set();
while (q2.length > 0) {
  const u = q2.pop();
  const [x, y] = fromKey(u);
  maze[y][x] = "O";
  unique.add(u >> 2);
  const prevNodes = previous.get(u) ?? [];
  for (const prev of prevNodes) {
    q2.push(toKey(...prev));
  }
}

const part2 = unique.size;
console.log(part1);
console.log(part2);

function getNeigh(x, y, facing) {
  const dir = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];
  const neigh = [];
  for (const i of [facing, (facing + 1) % 4, (facing + 3) % 4]) {
    const [dx, dy] = dir[i];
    const newX = x + dx;
    const newY = y + dy;
    if (maze[newY][newX] != "#") {
      if (i == facing) {
        neigh.push([newX, newY, i, 1]);
      } else {
        neigh.push([newX, newY, i, 1001]);
      }
    }
  }
  return neigh;
}
