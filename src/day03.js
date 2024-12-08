import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8");

const mulRegex = /mul\((\d{1,3}),(\d{1,3})\)/g;

const part1 = input
  .matchAll(mulRegex)
  .reduce((p, c) => p + parseInt(c[1]) * parseInt(c[2]), 0);
const part2 = input
  .split("do()")
  .map((e) => e.split("don't()")[0])
  .join("")
  .matchAll(mulRegex)
  .reduce((p, c) => p + parseInt(c[1]) * parseInt(c[2]), 0);

console.log(part1);
console.log(part2);
