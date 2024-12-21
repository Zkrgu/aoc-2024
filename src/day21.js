import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const lines = input.split("\n");

const numkey = ["7", "8", "9", "4", "5", "6", "1", "2", "3", -1, "0", "A"];

const dirKey = [-1, "^", "A", "<", "v", ">"];

function toKey(p1, p2, rounds) {
  return (((p1 << 4) + p2) << 5) + rounds;
}
function iterChars(str, rounds, keys) {
  let out = 0;
  let prev = keys.indexOf("A");
  for (let i = 0; i < str.length; ++i) {
    const cur = keys.indexOf(str[i]);
    const n = solveChar(prev, cur, rounds, keys);

    out += n;
    prev = cur;
  }
  return out;
}

const charMap = new Map();
function solveChar(p1, p2, rounds, keys) {
  const key = toKey(p1, p2, rounds);
  if (charMap.has(key)) {
    return charMap.get(key);
  }
  const dx = (p2 % 3) - (p1 % 3);
  const dy = Math.floor(p2 / 3) - Math.floor(p1 / 3);

  if (rounds === 0) return Math.abs(dx) + Math.abs(dy) + 1;

  let xstr = "";
  for (let i = 0; i < Math.abs(dx); ++i) {
    if (dx < 0) {
      xstr += "<";
    } else if (dx > 0) {
      xstr += ">";
    }
  }
  let ystr = "";
  for (let i = 0; i < Math.abs(dy); ++i) {
    if (dy < 0) {
      ystr += "^";
    } else if (dy > 0) {
      ystr += "v";
    }
  }

  const xfirst =
    keys[(p1 % 3) + dx + Math.floor(p1 / 3) * 3] == -1
      ? Infinity
      : iterChars(xstr + ystr + "A", rounds - 1, dirKey);
  const yfirst =
    keys[(p1 % 3) + (Math.floor(p1 / 3) + dy) * 3] == -1
      ? Infinity
      : iterChars(ystr + xstr + "A", rounds - 1, dirKey);

  let len = Math.min(xfirst, yfirst);

  charMap.set(key, len);
  return len;
}

let part1 = 0;
let part2 = 0;
for (const line of lines) {
  const num = parseInt(line.slice(0, 3));
  part1 += num * iterChars(line, 2, numkey);
  part2 += num * iterChars(line, 25, numkey);
}
console.log(part1);
console.log(part2);
