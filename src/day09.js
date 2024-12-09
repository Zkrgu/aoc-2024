import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const blocks = [];
const part1Blocks = [];

input.split("").forEach((e, i) => {
  const num = parseInt(e);
  blocks.push({ id: i, count: num });
  for (let j = 0; j < num; ++j) {
    if (i & 1) {
      part1Blocks.push(undefined);
    } else {
      part1Blocks.push(i / 2);
    }
  }
});

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
  const blocksIndex = blocks.findIndex((e) => e.id === i * 2);
  const count = blocks.at(blocksIndex).count;

  const freeIndex = blocks.findIndex((e) => e.id & 1 && e.count >= count);
  if (freeIndex > -1 && freeIndex < blocksIndex) {
    const block = blocks.splice(blocksIndex, 1, { id: 0, count })[0];
    if (blocks[freeIndex].count > count) {
      blocks[freeIndex].count -= count;
      blocks.splice(freeIndex, 0, block);
    } else {
      blocks.splice(freeIndex, 1, block);
    }
  }
}

let idx = 0;
const part2 = blocks.reduce((p, c) => {
  if (c.id & 1) {
    idx += c.count;
    return p;
  }
  let ret = p + (c.id * c.count * (c.count + 2 * idx - 1)) / 4;
  idx += c.count;
  return ret;
}, 0);

console.log(part1);
console.log(part2);
