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

let minXvar = [Infinity];
let minYvar = [Infinity];

for (let i = 0; i < Math.max(width, height); ++i) {
  const newPos = robots.map(([pos, vel]) => [
    safeMod(pos[0] + vel[0] * i, width),
    safeMod(pos[1] + vel[1] * i, height),
  ]);
  if (i == 100) {
    const part1 = scorePart1(newPos);
    console.log(part1);
  }
  const [xVar, yVar] = variance(newPos);
  if (yVar < minYvar[0]) {
    minYvar = [yVar, i];
  }
  if (xVar < minXvar[0]) {
    minXvar = [xVar, i];
  }
}

function gcd(a, b) {
  if (b == 0) {
    return [a, 1, 0];
  }
  const [d, x, y] = gcd(b, a % b);
  return [d, y, x - y * Math.floor(a / b)];
}

console.log(
  minXvar[1] +
    safeMod(
      (gcd(width, height)[1] % height) * (minYvar[1] - minXvar[1]),
      height,
    ) *
      width,
);

function safeMod(num, mod) {
  return ((num % mod) + mod) % mod;
}

function variance(robots) {
  const xs = [],
    ys = [];
  robots.forEach((e) => {
    xs.push(e[0]);
    ys.push(e[1]);
  });
  const xsum = xs.reduce((p, c) => p + c);
  const ysum = ys.reduce((p, c) => p + c);
  const xMean = xsum / xs.length;
  const yMean = ysum / ys.length;
  const xVariance = xs.reduce((p, c) => p + (c - xMean) ** 2, 0) / xs.length;
  const yVariance = ys.reduce((p, c) => p + (c - yMean) ** 2, 0) / ys.length;
  return [xVariance, yVariance];
}

function scorePart1(robots) {
  const q = [0, 0, 0, 0];
  for (const pos of robots) {
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
