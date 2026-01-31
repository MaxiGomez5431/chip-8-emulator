import { createLoop, getFirstNibble, getSecondNibble, getThirdNibble, getFourthNibble, loadFonsetInto } from './utils.js';
import Display from './display.js'
import Timers from './timers.js'
import Keyboard from './keyboard.js'
import createOpcodeTable from './opcodes/opcodeTable.js';
import createFamily0 from './opcodes/family0.js';
import createFamily8 from './opcodes/family8.js';
import createFamilyE from './opcodes/familyE.js';
import createFamilyF from './opcodes/familyF.js';

export default class Chip8 {
  constructor(canvas) {
    this.memory = loadFonsetInto(new Uint8Array(4096));
    this.V = new Uint8Array(16);
    this.I = 0;
    this.pc = 0x200;
    this.opcode = 0;
    this.stack = [];
    this.sp = 0;

    this.pcIsHalted = false;
    this.instructionChangePC = false;

    this.display = new Display(canvas)
    this.timers = new Timers()
    this.keyboard = new Keyboard()

    this.emulationLoop

    this.opcodeTable = createOpcodeTable(this)
    this.family0Table = createFamily0(this)
    this.family8Table = createFamily8(this)
    this.familyETable = createFamilyE(this)
    this.familyFTable = createFamilyF(this)

  }

  decodeAndExecuteOpcode(opcode) {
    const decoded = {
      opcode,
      firstNibble: getFirstNibble(opcode),
      X: getSecondNibble(opcode),
      Y: getThirdNibble(opcode),
      N: getFourthNibble(opcode),
      NN: opcode & 0x00FF,
      NNN: opcode & 0x0FFF
    }

    const handler = this.opcodeTable[decoded.firstNibble]
    // console.log(`Executing opcode: 0x${opcode.toString(16).toUpperCase().padStart(4, '0')}`);

    if (!handler) throw new Error('Opcode not implemented');
    handler(decoded);
  }

  family0(decode) {
    const handler = this.family0Table[decode.opcode]

    if (handler) {
      handler()
    } else {
      console.log(`reading unexisting upcode: 0x${decode.opcode.toString(16).toUpperCase().padStart(4, '0')} - family0`)
    }
  }

  family8(decode) {
    const handler = this.family8Table[decode.opcode & 0x000F]

    if (handler) {
      handler(decode)
    } else {
      throw new Error(`reading unexisting upcode: ${decode.opcode} - family8`)
    }
  }

  familyE(decode) {
    const handler = this.familyETable[decode.opcode & 0x00FF]

    if (handler) {
      handler(decode.X)
    } else {
      throw new Error(`reading unexisting upcode: ${decode.opcode} - familyE`)
    }
  }

  familyF(decode) {
    const handler = this.familyFTable[decode.opcode & 0x00FF]

    if (handler) {
      handler(decode.X)
    } else {
      throw new Error(`reading unexisting upcode: ${decode.opcode} - familyF`)
    }
  }

  subrutineAt(NNN) {
    this.stack.push(this.pc)
    this.sp++
    this.pc = NNN - 2 //-2 because pc will be increased after opcode execution
  }

  skipNextInstructionIf(condition) {
    if (condition) {
      this.instructionChangePC = true
      this.pc += 4
    }
  }

  drawSpriteAt(x, y, height) {
    this.V[0xF] = 0
    let memoryIndex = this.I
    let variableY = y

    for (let i = 0; i < height; i++) {
      let byte = this.memory[memoryIndex]
      this.V[0xF] = this.display.drawByteAt(x, variableY, byte, this.V[0xF])
      memoryIndex++
      variableY++
    }
  }

  loadProgram(buffer) {
    const program = new Uint8Array(buffer)

    if (program.length + 0x200 > this.memory.length) {
      throw new Error('Program too large to fit in memory')
    }
    // Copy program to memory
    for (let i = 0; i < program.length; i++) {
      this.memory[0x200 + i] = program[i]
    }
    // Reset pc to program start
    this.pc = 0x200
  }

  loadValueIntoMemory(index, value) {
    this.memory[index] = value
  }

  reset() {
    this.display.clearScreen()
    this.timers.resetTimers()
    this.memory = loadFonsetInto(new Uint8Array(4096));
    this.V.fill(0);
    this.I = 0;
    this.pc = 0x200;
    this.opcode = 0;
    this.stack = [];
    this.sp = 0;
    this.pcIsHalted = false;
  }

  executeOneCycle() {
    if (this.pc + 1 >= this.memory.length) {
      throw new Error(`PC out of memory range: ${this.pc}`);
    }
    const opcode = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];

    this.opcode = opcode;
    this.decodeAndExecuteOpcode(opcode);

    //points to the next instruction if not halted or pc was changed
    if(!this.pcIsHalted && !this.instructionChangePC){
      this.pc += 2; 
      this.pcIsHalted = null;
    }
    this.instructionChangePC = false;
  }

  startEmulation(hz = 1000) {
    this.emulationLoop = createLoop(hz, () => this.executeOneCycle())
    this.emulationLoop.start()
    this.timers.startTimers(this)
  }

}