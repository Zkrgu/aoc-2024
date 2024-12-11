import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

let stones = new Map();

input.split(" ").forEach((e) => {
  const num = parseInt(e);
  const count = stones.get(num) ?? 0;
  stones.set(num, count + 1);
});

for (let i = 1; i <= 75; ++i) {
  let newStones = new Map();
  for (const [stone, count] of stones) {
    const log = Math.floor(Math.log10(stone));
    if (stone === 0) {
      const cc = newStones.get(1) ?? 0;
      newStones.set(1, count + cc);
    } else if (log & 1) {
      const pow = Math.pow(10, (log + 1) / 2);
      const first = Math.floor(stone / pow);
      const second = stone % pow;

      const c1 = newStones.get(first) ?? 0;
      newStones.set(first, c1 + count);

      const c2 = newStones.get(second) ?? 0;
      newStones.set(second, c2 + count);
    } else {
      const num = stone * 2024;

      const cc = newStones.get(num) ?? 0;
      newStones.set(num, count + cc);
    }
  }
  stones = newStones;
  if (i === 25) {
    console.log(stones.values().reduce((p, c) => p + c, 0));
  }
}

console.log(stones.values().reduce((p, c) => p + c, 0));
