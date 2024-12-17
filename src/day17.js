import { readFileSync } from "node:fs";

const input = readFileSync(process.stdin.fd, "utf-8").trim();

const [regs, prog] = input.split("\n\n");

const origRegs = regs.split("\n").map((e) => parseInt(e.split(":")[1]));

const program = prog
  .slice(9)
  .split(",")
  .map((e) => parseInt(e));

function runProgram(registers) {
  const out = [];
  for (let i = 0; i < program.length; i += 2) {
    const op = program[i];
    const literal = program[i + 1];
    const combo = literal > 3 ? registers[literal - 4] : literal;
    switch (op) {
      case 0:
        registers[0] = Math.floor(registers[0] / 2 ** combo);
        break;
      case 1:
        registers[1] ^= literal;
        break;
      case 2:
        registers[1] = combo % 8;
        break;
      case 3:
        if (registers[0] == 0) break;
        i = literal - 2;
        break;
      case 4:
        registers[1] ^= registers[2];
        break;
      case 5:
        out.push(((combo % 8) + 8) % 8);
        break;
      case 6:
        registers[1] = Math.floor(registers[0] / 2 ** combo);
        break;
      case 7:
        registers[2] = Math.floor(registers[0] / 2 ** combo);
        break;
    }
  }
  return out;
}

let a = 0;
while (true) {
  const registers = [...origRegs];
  registers[0] = a;
  const out = runProgram(registers);
  if (out[0] == program[program.length - out.length]) {
    if (out.length == program.length) {
      break;
    }
    a *= 8;
  } else {
    ++a;
  }
}

console.log(runProgram(origRegs).join(","));
console.log(a);
