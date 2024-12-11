import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const blocks = [];
const spaces = [];
const part1Blocks = [];

input.split("").forEach((e, i) => {
  const num = parseInt(e);
  if (i & 1) {
    spaces.push({ idx: part1Blocks.length, count: num });
  } else {
    blocks.push({ id: i / 2, idx: part1Blocks.length, count: num });
  }
  for (let j = 0; j < num; ++j) {
    if (i & 1) {
      part1Blocks.push(undefined);
    } else {
      part1Blocks.push(i / 2);
    }
  }
});

const finalBlocks = [...part1Blocks];

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

for (const block of blocks.reverse()) {
  const freeBlock = spaces.find((e) => e.count >= block.count);
  if (freeBlock?.idx < block.idx) {
    for (let i = 0; i < block.count; ++i) {
      finalBlocks[freeBlock.idx + i] = block.id;
      finalBlocks[block.idx + i] = undefined;
    }
    freeBlock.count -= block.count;
    freeBlock.idx += block.count;
  }
}

const part2 = finalBlocks.reduce((p, c, i) => {
  if (c === undefined) return p;
  return p + c * i;
}, 0);

console.log(part1);
console.log(part2);
