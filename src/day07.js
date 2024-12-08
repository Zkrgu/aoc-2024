import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

let sum = 0;
let sum2 = 0;
for (const line of input.split("\n")) {
  const [totalStr, rest] = line.split(": ");
  const total = parseInt(totalStr);
  const numbers = rest.split(" ").map((e) => parseInt(e));
  const valid = recurseMath(total, numbers[0], numbers.slice(1), false);
  if (valid) {
    sum += total;
  } else {
    const validConcat = recurseMath(total, numbers[0], numbers.slice(1), true);
    if (validConcat) sum2 += total;
  }
}

function recurseMath(total, acc, rest, canConcat) {
  const add = acc + rest[0];
  const mult = acc * rest[0];
  const concat = parseInt("" + acc + ("" + rest[0]));
  if (rest.length === 1) {
    if (total === add) return true;
    if (total === mult) return true;
    if (canConcat && total === concat) return true;
    else return false;
  }
  if (add <= total) {
    const addStack = recurseMath(total, add, rest.slice(1), canConcat);
    if (addStack) return addStack;
  }
  if (canConcat && concat <= total) {
    const concatStack = recurseMath(total, concat, rest.slice(1), canConcat);
    if (concatStack) return concatStack;
  }
  if (mult <= total) {
    const multStack = recurseMath(total, mult, rest.slice(1), canConcat);
    return multStack;
  }
  return false;
}

console.log(sum);
console.log(sum + sum2);
