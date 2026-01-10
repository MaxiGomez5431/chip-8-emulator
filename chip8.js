import { createLoop } from './loop.js';

const displayElement = document.getElementById('chip8-display');

class Chip8Display {
  constructor(canvas) {
    this.memory = new Uint8Array(4096);
    this.V = new Uint8Array(16);
    this.I = 0;
    this.pc = 0x200;
    this.opcode = 0;
    this.stack = [];
    this.sp = 0;
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.width = 64;
    this.height = 32;
    this.keys = []
    
    this.timersLoop
    this.emulationLoop

    this.FONTSET_START_ADDRESS = 0x50;
    this.fontset = [
      0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
      0x20, 0x60, 0x20, 0x20, 0x70, // 1
      0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
      0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
      0x90, 0x90, 0xF0, 0x10, 0x10, // 4
      0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
      0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
      0xF0, 0x10, 0x20, 0x40, 0x40, // 7
      0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
      0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
      0xF0, 0x90, 0xF0, 0x90, 0x90, // A
      0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
      0xF0, 0x80, 0x80, 0x80, 0xF0, // C
      0xE0, 0x90, 0x90, 0x90, 0xE0, // D
      0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
      0xF0, 0x80, 0xF0, 0x80, 0x80  // F
    ];

    for (let i = 0; i < this.fontset.length; i++) {
      this.memory[this.FONTSET_START_ADDRESS + i] = this.fontset[i];
    }

    //setup canvas
    this.CANVAS_SIZE_MULTIPLIER = 10;
    this.SCALE = this.CANVAS_SIZE_MULTIPLIER;
    canvas.width = 64 * this.SCALE;
    canvas.height = 32 * this.SCALE;

    this.canvasContext = canvas.getContext('2d');

    this.canvasContext.fillStyle = 'white'; //revisar, creo que el coloreado de pixeles tiene que ser xor, no solo blanco
    this.canvasContext.fillRect(31 * this.SCALE, 14 * this.SCALE, this.SCALE, this.SCALE);
  }
  
  getFirstNibble(opcode) {
    return (opcode & 0xF000) >> 12;
  }

  getSecondNibble(opcode) {
    return (opcode & 0x0F00) >> 8;
  }

  getThirdNibble(opcode) {
    return (opcode & 0x00F0) >> 4;
  }

  getFourthNibble(opcode) {
    return opcode & 0x000F;
  }

  showMemory() {
    console.log('memory:', this.memory);
  }

  decodeAndExecuteOpcode(opcode) {
    const firstNibble = this.getFirstNibble(opcode);
    const NNN = opcode & 0x0FFF;
    const NN = opcode & 0x00FF;
    const N = this.getFourthNibble(opcode);
    const X = this.getSecondNibble(opcode);
    const Y = this.getThirdNibble(opcode);

    const opcodeTable = {
      0x0: () => this.family0(opcode, NNN),
      0x1: () => this.jumpTo(NNN),
      0x2: () => this.subrutineAt(NNN),
      0x3: undefined, //Skips the next instruction if VX equals NN (usually the next instruction is a jump to skip a code block).
      0x4: undefined, //Skips the next instruction if VX does not equal NN (usually the next instruction is a jump to skip a code block).
      0x5: undefined, //Skips the next instruction if VX equals VY (usually the next instruction is a jump to skip a code block).
      0x6: undefined, //Sets VX to NN.
      0x7: undefined, //Adds NN to VX (carry flag is not changed).
      0x8: (opcode, X, Y) => this.family8(opcode, X, Y),
      0x9: undefined, //Skips the next instruction if VX does not equal VY. (Usually the next instruction is a jump to skip a code block).
      0xA: undefined, //Sets I to the address NNN.
      0xB: () => { this.pc = this.V[0] + NNN }, //Jumps to the address NNN plus V0.
      0xC: undefined, //Sets VX to the result of a bitwise and operation on a random number (Typically: 0 to 255) and NN
      0xD: undefined, 
      0xE: (opcode) => this.familyE(opcode), 
      0xF: (opcode) => this.familyF(opcode), 
    }

    const handler = opcodeTable[firstNibble];
    if (!handler) throw new Error('Opcode not implemented');
    handler();
  }

  family0(opcode, NNN) {

    if (opcode === 0x00E0){ //Clears the screen
      this.canvasContext.clearRect(0, 0, 64 * this.SCALE, 32 * this.SCALE)
    } else if (opcode === 0x00EE) {
      return 1
    } else { // 0x0NNN
      console.log("reading 0x0000, not implemented - family0")
    }
  }

  jumpTo(NNN) {
    this.pc = NNN
  }

  subrutineAt(NNN) {
    return undefined
  }

  family8(opcode, X, Y) {
    return undefined
  }

  startTimers(){
    this.timersLoop = createLoop(60, () => {
      if (this.delayTimer > 0) {delayTimer--}
      if (this.soundTimer > 0) {
        console.log('BEEP!')  
        soundTimer--
      }
    })

    this.timersLoop.start()
  }

  executeOneCycle() {
    if (this.pc + 1 >= this.memory.length) {
      throw new Error(`PC out of memory range: ${this.pc}`);
    }
    const opcode = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
    this.opcode = opcode;
    this.pc += 2;
    this.decodeAndExecuteOpcode(opcode);
  }

  startEmulation(hz = 700) {
    this.emulationLoop = createLoop(hz, () => this.executeOneCycle())
    this.emulationLoop.start()
    this.startTimers()
  }

}

const chip8Display = new Chip8Display(displayElement);


chip8Display.startEmulation()
