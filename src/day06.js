import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const map = input.split("\n").map((e) => e.split(""));

const width = input.indexOf("\n");
const maxX = width - 1;
const maxY = map.length - 1;

const startIndex = input.indexOf("^");
const startX = startIndex % (width + 1);
const startY = Math.floor(startIndex / (width + 1));

const visited = new Set();

visited.add(startX + startY * width);

function part1() {
  let dir = 0;
  let posX = startX;
  let posY = startY;
  while (true) {
    let newX = posX;
    let newY = posY;
    switch (dir) {
      case 0:
        newY -= 1;
        break;
      case 1:
        newX += 1;
        break;
      case 2:
        newY += 1;
        break;
      case 3:
        newX -= 1;
        break;
    }

    if (newY < 0 || newX < 0 || newX > maxX || newY > maxY) break;
    if (map[newY][newX] === "#") {
      dir = (dir + 1) % 4;
    } else {
      visited.add(newX + newY * width);
      posX = newX;
      posY = newY;
    }
  }
}

part1();
console.log(visited.size);

let part2 = 0;
for (const ix of visited.values()) {
  const x = ix % width;
  const y = Math.floor(ix / width);
  const newRow = map[y].toSpliced(x, 1, "#");
  const newMap = map.toSpliced(y, 1, newRow);
  part2 += !terminates(newMap);
}
console.log(part2);

function terminates(map) {
  let dir = 0;
  let posX = startX;
  let posY = startY;
  let terminated = false;
  for (let i = 0; i < 6000; ++i) {
    let newX = posX;
    let newY = posY;
    switch (dir) {
      case 0:
        newY -= 1;
        break;
      case 1:
        newX += 1;
        break;
      case 2:
        newY += 1;
        break;
      case 3:
        newX -= 1;
        break;
    }

    if (newY < 0 || newX < 0 || newX > maxX || newY > maxY) {
      terminated = true;
      break;
    }
    if (map[newY][newX] === "#") {
      dir = (dir + 1) % 4;
    } else {
      posX = newX;
      posY = newY;
    }
  }
  return terminated;
}
