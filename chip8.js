import { createLoop } from './loop.js';

const displayElement = document.getElementById('chip8-display');

class Chip8 {
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
    this.debugDisplay = new Uint8Array(64 * 32).fill(0);
    
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
      0x3: () => this.skipNextInstructionIf(this.V[X] === NN), //Skips the next instruction if VX equals NN (usually the next instruction is a jump to skip a code block).
      0x4: () => this.skipNextInstructionIf(this.V[X] !== NN), //Skips the next instruction if VX does not equal NN (usually the next instruction is a jump to skip a code block).
      0x5: () => this.skipNextInstructionIf(this.V[X] === this.V[Y]), //Skips the next instruction if VX equals VY (usually the next instruction is a jump to skip a code block).
      0x6: () => this.V[X] = NN, //Sets VX to NN.
      0x7: () => this.V[X] = this.V[X] + NN, //Adds NN to VX (carry flag is not changed).
      0x8: (opcode, X, Y) => this.family8(opcode, X, Y),
      0x9: () => this.skipNextInstructionIf(this.V[X] !== this.V[Y]), //Skips the next instruction if VX does not equal VY. (Usually the next instruction is a jump to skip a code block).
      0xA: () => this.I = NNN, //Sets I to the address NNN.
      0xB: () => this.pc = this.V[0] + NNN, //Jumps to the address NNN plus V0.
      0xC: () => this.V[X] = this.getRandomInt(255) & NN, //Sets VX to the result of a bitwise and operation on a random number (Typically: 0 to 255) and NN
      0xD: () => this.drawSpriteAt(this.V[X], this.V[Y], N), //Draws a sprite at coordinate (VX, VY) that has a width of 8 pixels and a height of N pixels.
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

  skipNextInstructionIf(condition) {
    if (condition) {
      this.pc += 2
    }
  }

  family8(opcode, X, Y) {
    return undefined
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  drawPixelAt(x,y){
    // wrap
    x = x % 64;
    y = y % 32;

    const index = x + (y * 64)
    if(this.debugDisplay[index] === 0) {
      this.canvasContext.fillStyle = 'white';
      this.canvasContext.fillRect(x * this.SCALE, y * this.SCALE, this.SCALE, this.SCALE);
      this.debugDisplay[index] = 1
    } else {
      this.canvasContext.fillStyle = 'black';
      this.canvasContext.fillRect(x * this.SCALE, y * this.SCALE, this.SCALE, this.SCALE);
      this.V[0xF] = 1 //It resets in drawSpriteAt() 
      this.debugDisplay[index] = 0
    }
  }

  drawByteAt(x, y, byte){
    if (byte < 0) throw new Error(`drawByte - byte ${byte} is below 0x00`);
    if (byte > 255) throw new Error(`drawByte - byte ${byte} exceeds 0xFF value`);
    let variableX = x

    for (let position = 7; position >= 0; position--) {
      const bit = (byte >> position) & 1;
      if (bit) {
        this.drawPixelAt(variableX, y)
      }
      variableX++
    }
  }

  drawSpriteAt(x,y,height){
    this.V[0xF] = 0
    let memoryIndex = this.I
    let variableY = y

    for (let idx1 = 0; idx1 < height; idx1++) {
      let byte = this.memory[memoryIndex]
      this.drawByteAt(x, variableY, byte)
      memoryIndex++
      variableY++
    }
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
    this.pc += 2; //points to the next instruction 
    this.decodeAndExecuteOpcode(opcode);
  }

  startEmulation(hz = 700) {
    this.emulationLoop = createLoop(hz, () => this.executeOneCycle())
    this.emulationLoop.start()
    this.startTimers()
  }

}

const chip8 = new Chip8(displayElement);

chip8.drawByteAt(0,1,245)

chip8.startEmulation()
