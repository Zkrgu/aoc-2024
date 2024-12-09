import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const blocks = [];

input.split("").forEach((e, i) => {
  const num = parseInt(e);
  for (let j = 0; j < num; ++j) {
    if (i & 1) {
      blocks.push(undefined);
    } else {
      blocks.push(i / 2);
    }
  }
});

const part1Blocks = [...blocks];

for (let i = part1Blocks.length - 1; i > 0; --i) {
  const freeIndex = part1Blocks.indexOf(undefined);
  if (freeIndex >= i) break;
  if (i === undefined) continue;
  part1Blocks[freeIndex] = part1Blocks[i];
  part1Blocks[i] = undefined;
}

const part1 = part1Blocks.reduce((p, c, i) => {
  if (c === undefined) return p;
  return p + c * i;
}, 0);

for (let i = (input.length - 1) / 2; i > 0; --i) {
  const count = parseInt(input[i * 2]);
  const firstIndex = blocks.indexOf(i);

  const freeIndex = blocks.findIndex((e, j) => {
    let match = true;
    for (let k = 0; k < count; ++k) {
      if (blocks.at(j + k) != undefined) {
        match = false;
        break;
      }
    }
    return match;
  });
  if (freeIndex > -1 && freeIndex < firstIndex) {
    blocks.splice(freeIndex, count, ...new Array(count).fill(i));
    blocks.splice(firstIndex, count, ...new Array(count).fill(undefined));
  }
}
const part2 = blocks.reduce((p, c, i) => {
  if (c === undefined) return p;
  return p + c * i;
}, 0);

console.log(part1);
console.log(part2);
