import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const lines = input.split("\n");

const width = input.indexOf("\n");
const height = lines.length;

const aMap = new Map();

for (const [y, row] of lines.entries()) {
  for (const [x, cha] of row.split("").entries()) {
    if (cha !== ".") {
      const list = aMap.get(cha) ?? [];
      list.push([x, y]);
      aMap.set(cha, list);
    }
  }
}

const part1 = new Set();
const part2 = new Set();

for (const antennas of aMap.values()) {
  for (let i = 0; i < antennas.length; ++i) {
    const [x1, y1] = antennas[i];
    for (let j = i + 1; j < antennas.length; ++j) {
      const [x2, y2] = antennas[j];
      const dx = x1 - x2;
      const dy = y1 - y2;

      for (
        let anx1 = x1, any1 = y1;
        anx1 >= 0 && anx1 < width && any1 >= 0 && any1 < height;
        anx1 += dx, any1 += dy
      ) {
        part2.add(anx1 + any1 * width);
      }
      for (
        let anx2 = x2, any2 = y2;
        anx2 >= 0 && anx2 < width && any2 >= 0 && any2 < height;
        anx2 -= dx, any2 -= dy
      ) {
        part2.add(anx2 + any2 * width);
      }

      const anx1 = x1 + dx;
      const any1 = y1 + dy;
      const anx2 = x2 - dx;
      const any2 = y2 - dy;

      if (anx1 >= 0 && anx1 < width && any1 >= 0 && any1 < height) {
        part1.add(anx1 + any1 * width);
      }

      if (anx2 >= 0 && anx2 < width && any2 >= 0 && any2 < height) {
        part1.add(anx2 + any2 * width);
      }
    }
  }
}

console.log(part1.size);
console.log(part2.size);
