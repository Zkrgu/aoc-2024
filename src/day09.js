import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const blocks = [];
const spaces = [];
const spaceIdx = [];
const part1Blocks = [];

input.split("").forEach((e, i) => {
  const num = parseInt(e);
  if (i & 1) {
    spaceIdx.push(part1Blocks.length);
    spaces.push(num);
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

const t = [];

function build(a, v, tl, tr) {
  if (tl == tr) {
    t[v] = a[tl];
  } else {
    const tm = Math.floor((tl + tr) / 2);
    build(a, v * 2, tl, tm);
    build(a, v * 2 + 1, tm + 1, tr);
    t[v] = Math.max(t[v * 2], t[v * 2 + 1]);
  }
}

build(spaces, 1, 0, spaces.length - 1);

function update(v, tl, tr, pos, new_val) {
  if (tl == tr) {
    t[v] = new_val;
  } else {
    const tm = Math.floor((tl + tr) / 2);
    if (pos <= tm) update(v * 2, tl, tm, pos, new_val);
    else update(v * 2 + 1, tm + 1, tr, pos, new_val);
    t[v] = Math.max(t[v * 2], t[v * 2 + 1]);
  }
}

function first(v, tl, tr, l, r, x) {
  if (tl > r || tr < l) return -1;
  if (t[v] < x) return -1;
  if (tl == tr) return tl;

  const tm = tl + Math.floor((tr - tl) / 2);
  const left = first(2 * v, tl, tm, l, r, x);
  if (left != -1) return left;
  return first(2 * v + 1, tm + 1, tr, l, r, x);
}

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
  const freeIndex = first(
    1,
    0,
    spaces.length - 1,
    0,
    spaces.length - 1,
    block.count,
  );
  const freeBlock = spaces[freeIndex];
  if (freeIndex >= 0 && spaceIdx[freeIndex] < block.idx) {
    for (let i = 0; i < block.count; ++i) {
      finalBlocks[spaceIdx[freeIndex] + i] = block.id;
      finalBlocks[block.idx + i] = undefined;
    }
    update(1, 0, spaces.length - 1, freeIndex, freeBlock - block.count);
    spaceIdx[freeIndex] += block.count;
  }
}

const part2 = finalBlocks.reduce((p, c, i) => {
  if (c === undefined) return p;
  return p + c * i;
}, 0);

console.log(part1);
console.log(part2);
