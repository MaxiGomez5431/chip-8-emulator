import { getRandomInt } from "../utils.js"

export default function createOpcodeTable(chip) {
  return {
    0x0: (d) => chip.family0(d),
    0x1: (d) => chip.pc = d.NNN, // Jumps PC to NNN
    0x2: (d) => chip.subrutineAt(d.NNN),
    0x3: (d) => chip.skipNextInstructionIf(chip.V[d.X] === d.NN), //Skips the next instruction if VX equals NN (usually the next instruction is a jump to skip a code block).
    0x4: (d) => chip.skipNextInstructionIf(chip.V[d.X] !== d.NN), //Skips the next instruction if VX does not equal NN (usually the next instruction is a jump to skip a code block).
    0x5: (d) => chip.skipNextInstructionIf(chip.V[d.X] === chip.V[d.Y]), //Skips the next instruction if VX equals VY (usually the next instruction is a jump to skip a code block).
    0x6: (d) => chip.V[d.X] = d.NN, //Sets VX to NN.
    0x7: (d) => chip.V[d.X] = chip.V[d.X] + d.NN, //Adds NN to VX (carry flag is not changed).
    0x8: (d) => chip.family8(d),
    0x9: (d) => chip.skipNextInstructionIf(chip.V[d.X] !== chip.V[d.Y]), //Skips the next instruction if VX does not equal VY. (Usually the next instruction is a jump to skip a code block).
    0xA: (d) => chip.I = d.NNN, //Sets I to the address NNN.
    0xB: (d) => chip.pc = chip.V[0] + d.NNN, //Jumps to the address NNN plus V0.
    0xC: (d) => chip.V[d.X] = getRandomInt(255) & d.NN, //Sets VX to the result of a bitwise and operation on a random number (Typically: 0 to 255) and NN
    0xD: (d) => chip.drawSpriteAt(chip.V[d.X], chip.V[d.Y], d.N), //Draws a sprite at coordinate (VX, VY) that has a width of 8 pixels and a height of N pixels.
    0xE: (d) => chip.familyE(d.opcode), 
    0xF: (d) => chip.familyF(d.opcode), 
  }
}
