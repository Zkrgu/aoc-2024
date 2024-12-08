import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

let part1 = 0;
let part2 = 0;
input.split("\n").forEach((line) => {
  const nums = line.split(" ").map((f) => parseInt(f));
  const badness = validateNums(nums);
  if (badness === 0) ++part1;
  if (badness === 1) ++part2;
});

/**
 * @param {number[]} nums
 */
function validateNums(nums) {
  let asc;
  let acc = 0;
  for (let i = 1; i < nums.length; ++i) {
    if (acc == 2) break;
    const num = nums.at(i);
    const prev = nums.at(i - 1);
    if (i === 1) {
      asc = num > prev;
    }
    if (!isGood(num, prev, asc)) {
      ++acc;
      if (acc > 1) {
        continue;
      }
      const next = nums.at(i + 1);
      const nextNext = nums.at(i + 2);
      if (
        i == 1 &&
        ((isGood(next, num, !asc) && isGood(nextNext, next, !asc)) ||
          (isGood(next, num, asc) && isGood(nextNext, next, asc)))
      ) {
        asc = next > num;
      } else if (
        i == 2 &&
        isGood(next, num, !asc) &&
        isGood(nextNext, next, !asc) &&
        (isGood(num, prev, !asc) || isGood(num, nums.at(i - 2), !asc))
      ) {
        asc = !asc;
      } else if (isGood(next, prev, asc) && isGood(nextNext, next, asc)) {
        ++i;
      } else if (isGood(num, nums.at(i - 2), asc)) {
      } else {
        ++acc;
      }
    }
  }
  return acc;
}

function isGood(current, previous, asc) {
  if (current === undefined || previous === undefined) return true;
  const diff = current - previous;
  if (Math.abs(diff) > 3 || Math.abs(diff) < 1) return false;
  if ((diff < 0 && asc) || (diff > 0 && !asc && asc != undefined)) return false;
  return true;
}

console.log(part1);
console.log(part1 + part2);
