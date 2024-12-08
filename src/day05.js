import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const [deps, orders] = input.split("\n\n");

const depMap = new Map();

for (const dep of deps.split("\n")) {
  const [d1, d2] = dep.split("|");
  if (!depMap.get(d2)) depMap.set(d2, []);
  depMap.get(d2).push(d1);
}

function reverseMap(depMap) {
  const inverse = new Map();
  for (const [key, value] of depMap.entries()) {
    value.forEach((ld) => {
      if (!inverse.get(ld)) inverse.set(ld, []);
      inverse.get(ld).push(key);
    });
  }
  return inverse;
}

function kahn(depMap, revMap, include) {
  const stack = include.filter(
    (e) =>
      (depMap.get(e) ?? []).filter((f) => include.includes(f)).length === 0,
  );
  const order = [];

  while (stack.length > 0) {
    const node = stack.shift();
    order.push(node);
    (revMap.get(node) ?? [])
      .filter((e) => include.includes(e))
      .forEach((nei) => {
        const edges = depMap.get(nei).filter((e) => include.includes(e));
        const newEdges = edges.filter((e) => !order.includes(e));
        if (newEdges.length === 0) stack.push(nei);
      });
  }
  return order;
}

const revMap = reverseMap(depMap);

let part1 = 0;
let part2 = 0;
for (const line of orders.split("\n")) {
  const vals = line.split(",");
  const valid = vals.every((e, i, a) =>
    (depMap.get(e) ?? []).every((f, j) => a.indexOf(f) < i),
  );
  if (valid) part1 += parseInt(vals.at(Math.floor(vals.length / 2)));
  else {
    const newVals = kahn(depMap, revMap, vals);
    part2 += parseInt(newVals.at(Math.floor(vals.length / 2)));
  }
}

console.log(part1);
console.log(part2);
