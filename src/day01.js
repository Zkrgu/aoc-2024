import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const l1 = [];
const l2 = [];

const l1count = new Map();
const l2count = new Map();

input.split("\n").map((e) => {
  const [a, b] = e.split(/\s+/).map((f) => parseInt(f));

  const aCount = l1count.get(a) ?? 0;
  l1count.set(a, aCount + 1);

  const bCount = l2count.get(b) ?? 0;
  l2count.set(b, bCount + 1);

  l1.push(parseInt(a));
  l2.push(parseInt(b));
});

l1.sort();
l2.sort();

let part1 = 0;
l1.forEach((e, i, a) => (part1 += Math.abs(e - l2[i])));

console.log(part1);

let part2 = 0;
for (const [k, v] of l1count.entries()) {
  part2 += k * v * (l2count.get(k) ?? 0);
}

console.log(part2);
