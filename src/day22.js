// -00:22:45
import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const numberOfSecrets = 2000;

function* getSecret(n) {
  while (true) {
    n = transform(n);
    yield n;
  }
}

// 2**24 - 1
const bm = 16777215;

function transform(line) {
  let a = ((line * 64) ^ line) & bm;
  let b = (a / 32) ^ a;
  let c = ((b * 2048) ^ b) & bm;
  return c;
}

function toKey(a, b, c, d) {
  return ((((((a + 16) << 5) + b + 16) << 5) + c + 16) << 5) + d + 16;
}

let part1 = 0;
const globalScore = new Map();
for (const line of input.split("\n")) {
  const num = +line;
  const priceChanges = new Set();

  let a;
  let b;
  let c;
  let d;

  let prevPrice = num % 10;
  const secrets = getSecret(num);

  for (let i = 1; i <= numberOfSecrets; ++i) {
    a = b;
    b = c;
    c = d;
    const secret = secrets.next().value;
    if (i == numberOfSecrets) part1 += secret;
    const price = secret % 10;
    d = price - prevPrice;
    prevPrice = price;
    if (a == undefined) continue;
    const diffKey = toKey(a, b, c, d);

    if (!priceChanges.has(diffKey)) {
      priceChanges.add(diffKey);
      const currentGlobal = globalScore.get(diffKey) ?? 0;
      globalScore.set(diffKey, currentGlobal + price);
    }
  }
}

let part2 = 0;
for (const score of globalScore.values()) {
  if (score > part2) part2 = score;
}

console.log(part1);
console.log(part2);
