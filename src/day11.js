import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

let stones = new Map();

input.split(" ").forEach((e) => {
  const count = stones.get(e) ?? 0;
  stones.set(e, count + 1);
});

for (let i = 0; i < 75; ++i) {
  let newStones = new Map();
  for (const [stone, count] of stones) {
    if (stone === "0") {
      const cc = newStones.get("1") ?? 0;
      newStones.set("1", count + cc);
    } else if (stone.length % 2 === 0) {
      const str1 = stone.slice(0, stone.length / 2);
      const str2 = "" + parseInt(stone.slice(stone.length / 2));
      const c1 = newStones.get(str1) ?? 0;
      newStones.set(str1, c1 + count);
      const c2 = newStones.get(str2) ?? 0;
      newStones.set(str2, c2 + count);
    } else {
      const str = "" + parseInt(stone) * 2024;
      const cc = newStones.get(str) ?? 0;
      newStones.set(str, count + cc);
    }
  }
  stones = newStones;
}

console.log(stones.entries().reduce((p, c) => p + parseInt(c[1]), 0));
