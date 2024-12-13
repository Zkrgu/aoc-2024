import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const claws = input.split("\n\n").map((e) => e.split("\n"));

const button_regex = /X[+=-](\d+), Y[+=-](\d+)/g;

function solve(ax, ay, bx, by, px, py) {
  // Solve the linear system
  // m * ax + n * bx = px
  // m * ay + n * by = py
  const n = (ax * py - ay * px) / (ax * by - ay * bx);
  const m = (px - n * bx) / ax;
  // Only interested in the integer solutions
  if (m % 1 === 0 && n % 1 === 0) return m * 3 + n;
  return 0;
}

let part1 = 0;
let part2 = 0;
for (const claw of claws) {
  const a = claw[0].matchAll(button_regex).next().value;
  const b = claw[1].matchAll(button_regex).next().value;
  const p = claw[2].matchAll(button_regex).next().value;

  const ax = parseInt(a[1]);
  const ay = parseInt(a[2]);
  const bx = parseInt(b[1]);
  const by = parseInt(b[2]);
  const px = parseInt(p[1]);
  const py = parseInt(p[2]);

  part1 += solve(ax, ay, bx, by, px, py);
  part2 += solve(ax, ay, bx, by, px + 10000000000000, py + 10000000000000);
}

console.log(part1);
console.log(part2);
