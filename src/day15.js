import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const [mapStart, preMoves] = input.split("\n\n");

const map1 = mapStart.split("\n").map((e) => e.split(""));
const map = mapStart
  .replaceAll(".", "..")
  .replaceAll("#", "##")
  .replaceAll("O", "[]")
  .replaceAll("@", "@.")
  .split("\n")
  .map((e) => e.split(""));
const height = map.length;
const width = mapStart.indexOf("\n");

const moves = preMoves.replace(/\s/g, "").split("");

const startIndex = mapStart.indexOf("@");
let robotX1 = startIndex % (width + 1);
let robotY1 = Math.floor(startIndex / (width + 1));
let robotX = (startIndex % (width + 1)) * 2;
let robotY = Math.floor(startIndex / (width + 1));

const dirs = new Map([
  ["<", [-1, 0]],
  ["^", [0, -1]],
  [">", [1, 0]],
  ["v", [0, 1]],
]);

for (const move of moves) {
  const dir = dirs.get(move);
  if (makeMove(robotX1, robotY1, dir, map1)) {
    robotX1 = robotX1 + dir[0];
    robotY1 = robotY1 + dir[1];
  }
  if (makeMove(robotX, robotY, dir, map)) {
    robotX = robotX + dir[0];
    robotY = robotY + dir[1];
  }
}

let part1 = 0;

for (let y = 0; y < map1.length; ++y) {
  for (let x = 0; x < map1[y].length; ++x) {
    if (map1[y][x] == "O") {
      part1 += x + 100 * y;
    }
  }
}

let part2 = 0;

for (let y = 0; y < map.length; ++y) {
  for (let x = 0; x < map[y].length; ++x) {
    if (map[y][x] == "[") {
      part2 += x + 100 * y;
    }
  }
}
console.log(part1);
console.log(part2);

function makeMove(x, y, dir, map) {
  const newX = x + dir[0];
  const newY = y + dir[1];

  if (map[newY][newX] == "#") {
    return false;
  }
  if (map[newY][newX] == ".") {
    map[newY][newX] = map[y][x];
    map[y][x] = ".";
    return true;
  }
  if (map[newY][newX] == "O") {
    if (makeMove(newX, newY, dir, map)) {
      map[newY][newX] = map[y][x];
      map[y][x] = ".";
      return true;
    }
  }
  if (dir[1] != 0) {
    if (map[newY][newX] == "[") {
      if (canMove(newX, newY, dir) && canMove(newX + 1, newY, dir)) {
        makeMove(newX, newY, dir, map);
        makeMove(newX + 1, newY, dir, map);
        map[newY][newX] = map[y][x];
        map[y][x] = ".";
        return true;
      }
    }
    if (map[newY][newX] == "]") {
      if (canMove(newX, newY, dir) && canMove(newX - 1, newY, dir)) {
        makeMove(newX, newY, dir, map);
        makeMove(newX - 1, newY, dir, map);
        map[newY][newX] = map[y][x];
        map[y][x] = ".";
        return true;
      }
    }
  } else {
    if (map[newY][newX] == "]" || map[newY][newX] == "[") {
      if (makeMove(newX, newY, dir, map)) {
        map[newY][newX] = map[y][x];
        map[y][x] = ".";
        return true;
      }
    }
  }
}
function canMove(x, y, dir) {
  const newX = x + dir[0];
  const newY = y + dir[1];

  if (map[newY][newX] == "#") {
    return false;
  }
  if (map[newY][newX] == ".") {
    return true;
  }
  if (dir[1] != 0) {
    if (map[newY][newX] == "[") {
      if (canMove(newX, newY, dir) && canMove(newX + 1, newY, dir)) {
        return true;
      }
    }
    if (map[newY][newX] == "]") {
      if (canMove(newX, newY, dir) && canMove(newX - 1, newY, dir)) {
        return true;
      }
    }
  } else {
    if (map[newY][newX] == "]" || map[newY][newX] == "[") {
      if (canMove(newX, newY, dir)) {
        return true;
      }
    }
  }
}
