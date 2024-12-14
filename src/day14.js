import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();
const width = 101;
const height = 103;

const robots = input.split("\n").map((line) =>
  line.split(" ").map((p) =>
    p
      .slice(2)
      .split(",")
      .map((n) => parseInt(n)),
  ),
);

for (let i = 1; i < 100000; ++i) {
  for (let j = 0; j < robots.length; ++j) {
    const [pos, vel] = robots[j];
    const npos = [
      safeMod(pos[0] + vel[0] * 1, width),
      safeMod(pos[1] + vel[1] * 1, height),
    ];
    robots[j][0] = npos;
  }
  if (i == 100) {
    const part1 = scorePart1();
    console.log(part1);
  }
  if (uniqueRobots()) {
    console.log(i);
    break;
  }
}

function safeMod(num, mod) {
  return ((num % mod) + mod) % mod;
}

function uniqueRobots() {
  return (
    new Set(robots.map((robot) => robot[0][0] + robot[0][1] * width)).size ==
    robots.length
  );
}

function scorePart1() {
  const q = [0, 0, 0, 0];
  for (const robot of robots) {
    const [pos] = robot;
    if (pos[0] < Math.floor(width / 2) && pos[1] < Math.floor(height / 2))
      ++q[0];
    else if (pos[0] > Math.floor(width / 2) && pos[1] < Math.floor(height / 2))
      ++q[1];
    else if (pos[0] < Math.floor(width / 2) && pos[1] > Math.floor(height / 2))
      ++q[2];
    else if (pos[0] > Math.floor(width / 2) && pos[1] > Math.floor(height / 2))
      ++q[3];
  }
  return q.reduce((p, c) => p * c);
}
