import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const split = input.split("\n");

const len = split[0].length;

const rejoined = split.join("");

let part1 = 0;
for (let i = 0; i > -1; i = rejoined.indexOf("X", i + 1)) {
  const test = findAnyDir(i % len, Math.floor(i / len), "MAS");
  part1 += test.length;
}

console.log(part1);

function findAnyDir(x, y, str) {
  return [
    find(x, y, 1, 0, str),
    find(x, y, 0, 1, str),
    find(x, y, 1, 1, str),
    find(x, y, -1, 0, str),
    find(x, y, 0, -1, str),
    find(x, y, -1, -1, str),
    find(x, y, 1, -1, str),
    find(x, y, -1, 1, str),
  ].filter(Boolean);
}

function find(x, y, dx, dy, str) {
  const strIndex = x + dx + (y + dy) * len;
  if (x + dx >= len || x + dx < 0 || y + dy < 0 || y + dy >= split.length)
    return false;
  if (strIndex < 0 || strIndex > rejoined.length) return false;
  if (rejoined[strIndex] === str[0]) {
    if (str.length === 1) return true;
    return find(x + dx, y + dy, dx, dy, str.slice(1));
  }
  return false;
}

let part2 = 0;
for (let i = 0; i > -1; i = rejoined.indexOf("A", i + 1)) {
  const test = findXmas(i % len, Math.floor(i / len));
  part2 += test;
}

function findXmas(x, y) {
  const diag1 =
    (find(x, y, -1, -1, "M") && find(x, y, 1, 1, "S")) ||
    (find(x, y, -1, -1, "S") && find(x, y, 1, 1, "M"));

  const diag2 =
    (find(x, y, -1, 1, "M") && find(x, y, 1, -1, "S")) ||
    (find(x, y, -1, 1, "S") && find(x, y, 1, -1, "M"));
  return diag1 && diag2;
}

console.log(part2);
