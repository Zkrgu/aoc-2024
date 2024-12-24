import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const [init, gates] = input.split("\n\n");

const wireMap = new Map(
  init.split("\n").map((e) => {
    const split = e.split(": ");
    return [split[0], parseInt(split[1])];
  }),
);

const queue = gates.split("\n").map((e) => {
  return e.split(/ -> | /g);
});

const wrong = queue
  .filter((e) => {
    const [w1, op, w2, ow] = e;
    if (ow.startsWith("z")) {
      const num = ow.slice(1, 3);
      if (num == "45") return op != "OR";
      if ((num != "00" && w1.startsWith("x")) || w1.startsWith("y"))
        return true;
      return op != "XOR";
    }
    if (!w1.startsWith("x") && !w1.startsWith("y")) {
      if (op == "XOR") return true;
    }
    const num = w1.slice(1, 3);
    const ru = queue.filter((e) => e[0] == ow || e[2] == ow);
    if (op == "XOR" || op == "OR") {
      return ru.length != 2;
    } else {
      return ru.length == 2 && num != "00";
    }
  })
  .map((e) => e[3]);

while (queue.length > 0) {
  const [w1, op, w2, ow] = queue.shift();
  if (wireMap.has(w1) && wireMap.has(w2)) {
    let out = 0;
    const w1v = wireMap.get(w1);
    const w2v = wireMap.get(w2);
    switch (op) {
      case "AND":
        out = w1v & w2v;
        break;
      case "OR":
        out = w1v | w2v;
        break;
      case "XOR":
        out = w1v ^ w2v;
        break;
    }
    wireMap.set(ow, out);
  } else {
    queue.push([w1, op, w2, ow]);
  }
}

const z = [...wireMap.entries().filter((e) => e[0].startsWith("z"))]
  .sort()
  .reverse()
  .reduce((p, c) => {
    return (p << 1n) + BigInt(c[1]);
  }, 0n);

console.log(z);
console.log(wrong.sort().join(","));
