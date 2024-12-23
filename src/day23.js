import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const adjacency = new Map();

for (const line of input.split("\n")) {
  const [a, b] = line.split("-");

  const aArr = adjacency.get(a) ?? [];
  aArr.push(b);
  adjacency.set(a, aArr);

  const bArr = adjacency.get(b) ?? [];
  bArr.push(a);
  adjacency.set(b, bArr);
}

const entries = adjacency.entries().toArray();

let part1 = 0;
for (let i = 0; i < entries.length - 2; ++i) {
  for (let j = i; j < entries.length - 1; ++j) {
    for (let k = j; k < entries.length; ++k) {
      if (
        entries[j][1].includes(entries[i][0]) &&
        entries[k][1].includes(entries[i][0]) &&
        entries[k][1].includes(entries[j][0])
      ) {
        if (
          entries[i][0].startsWith("t") ||
          entries[j][0].startsWith("t") ||
          entries[k][0].startsWith("t")
        ) {
          ++part1;
        }
      }
    }
  }
}

const cliques = [];

const q = [undefined];
let cand = new Set(adjacency.keys());

let subgraph = new Set(cand);
const stack = [];

let u;
let l = 0;
for (const v of subgraph) {
  const intersection = cand.intersection(new Set(adjacency.get(v)));
  if (intersection.length > l) {
    u = v;
    l = intersection.length;
  }
}
let extU = [...cand.difference(new Set(adjacency.get(u)))];

while (true) {
  if (extU.length > 0) {
    const qn = extU.pop();
    cand.delete(qn);
    q[q.length - 1] = qn;
    const adjQ = new Set(adjacency.get(qn));
    const subgraphQ = subgraph.intersection(adjQ);
    if (subgraphQ.size == 0) {
      cliques.push([...q]);
    } else {
      const candQ = cand.intersection(adjQ);
      if (candQ.size > 0) {
        stack.push([subgraph, cand, extU]);
        q.push(undefined);
        subgraph = subgraphQ;
        cand = candQ;

        l = 0;
        for (const v in subgraph) {
          const intersection = cand.intersection(new Set(adjacency.get(v)));
          if (intersection.length > l) {
            u = v;
            l = intersection.length;
          }
        }
        extU = [...cand.difference(new Set(adjacency.get(u)))];
      }
    }
  } else {
    q.pop();
    if (stack.length == 0) break;
    [subgraph, cand, extU] = stack.pop();
  }
}

const part2 = cliques.sort((a, b) => b.length - a.length)[0];

console.log(part1);
console.log(part2.sort().join(","));
