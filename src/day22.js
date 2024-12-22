// -00:22:45
import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();
const lines = input.split("\n").map((e) => BigInt(e));

const numberOfSecrets = 2000;

function* getSecret(n) {
  while (true) {
    n = transform(n);
    yield n;
  }
}

function transform(line) {
  let a = ((line * 64n) ^ line) % 16777216n;
  let b = (a / 32n) ^ a;
  let c = ((b * 2048n) ^ b) % 16777216n;
  return c;
}

function toKey(a, b, c, d) {
  return ((((((a + 16n) << 5n) + b + 16n) << 5n) + c + 16n) << 5n) + d + 16n;
}

let part1 = 0n;
const globalScore = new Map();
for (const line of lines) {
  const priceChanges = new Set();

  let a;
  let b;
  let c;
  let d;

  let prevPrice = line % 10n;
  const secrets = getSecret(line);

  for (let i = 1; i <= numberOfSecrets; ++i) {
    a = b;
    b = c;
    c = d;
    const secret = secrets.next().value;
    if (i == numberOfSecrets) part1 += secret;
    const price = secret % 10n;
    d = price - prevPrice;
    prevPrice = price;
    if (a == undefined) continue;
    const diffKey = toKey(a, b, c, d);

    if (!priceChanges.has(diffKey)) {
      priceChanges.add(diffKey);
      const currentGlobal = globalScore.get(diffKey) ?? 0n;
      globalScore.set(diffKey, currentGlobal + price);
    }
  }
}

let part2 = 0n;
for (const score of globalScore.values()) {
  if (score > part2) part2 = score;
}

console.log(part1.toString());
console.log(part2.toString());
