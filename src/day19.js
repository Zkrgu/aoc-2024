import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const [possible, display] = input.split("\n\n");

const patterns = possible.split(", ");
const lines = display.split("\n");

const cache = new Map();
function tryDesign(line) {
  if (cache.has(line)) return cache.get(line);
  const ret = patterns.reduce((p, c) => {
    if (line.startsWith(c)) {
      if (c.length == line.length) return p + 1;
      return p + tryDesign(line.slice(c.length));
    } else {
      return p;
    }
  }, 0);
  cache.set(line, ret);
  return ret;
}
let part1 = 0;
let part2 = 0;
lines.forEach((line) => {
  const designs = tryDesign(line);
  part2 += designs;
  if (designs) ++part1;
});

console.log(part1);
console.log(part2);
