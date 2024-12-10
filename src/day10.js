import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const map = input.split("\n").map((e) => e.split("").map((f) => parseInt(f)));

const width = map[0].length;
const height = map.length;

const dirs = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

const scoreForCell = new Map();

function getScore(x, y) {
  const tile = map[y][x];
  if (tile === 9) return [x + y * width];

  if (scoreForCell.has(x + y * width)) {
    return scoreForCell.get(x + y * width);
  }

  let sum = [];
  for (const [dx, dy] of dirs) {
    if (y + dy >= 0 && y + dy < height && x + dx >= 0 && x + dx < width) {
      if (map[y + dy][x + dx] === tile + 1) {
        sum = sum.concat(getScore(x + dx, y + dy));
      }
    }
  }
  scoreForCell.set(x + y * width, sum);
  return sum;
}

let part1 = 0;
let part2 = 0;
for (
  let startPos = input.indexOf("0");
  startPos > -1;
  startPos = input.indexOf("0", startPos + 1)
) {
  const x = startPos % (width + 1);
  const y = Math.floor(startPos / (width + 1));
  const solutions = getScore(x, y);
  part1 += new Set(solutions).size;
  part2 += solutions.length;
}
console.log(part1);
console.log(part2);
