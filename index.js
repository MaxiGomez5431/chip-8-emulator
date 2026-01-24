import Chip8 from './emulator/chip8.js';

const displayElement = document.getElementById('chip8-display');

const chip8 = new Chip8(displayElement);

const getX = (offset, position) => offset + position * 5;

const program = [
  0x61, 0x0D, // set y-coordinate = 0x0D = 13
  0x60, getX(18, 0), 0xA0, 0x50, 0xD0, 0x15,  // set x-coordinate (0x60 0xXX), set sprite address to new number (0xA0 0xXX), draw sprite (0xD0 0x0N)
  0x60, getX(18, 1), 0xA0, 0x55, 0xD0, 0x15,  // set x-coordinate (0x60 0xXX), set sprite address to new number (0xA0 0xXX), draw sprite (0xD0 0x0N)
  0x60, getX(18, 2), 0xA0, 0x5A, 0xD0, 0x15,  // set x-coordinate (0x60 0xXX), set sprite address to new number (0xA0 0xXX), draw sprite (0xD0 0x0N)
  0x60, getX(18, 3), 0xA0, 0x5F, 0xD0, 0x15,  // set x-coordinate (0x60 0xXX), set sprite address to new number (0xA0 0xXX), draw sprite (0xD0 0x0N)
  0x60, getX(18, 4), 0xA0, 0x64, 0xD0, 0x15,  // set x-coordinate (0x60 0xXX), set sprite address to new number (0xA0 0xXX), draw sprite (0xD0 0x0N)
  0x60, getX(18, 5), 0xA0, 0x69, 0xD0, 0x15,  // set x-coordinate (0x60 0xXX), set sprite address to new number (0xA0 0xXX), draw sprite (0xD0 0x0N)
  0x12, 0x00]; // jump to address 0x200, starting point of the program, loaded at address 0x200 (so creating an infinite loop)  

const testProgram = [
  // --- LIMPIAR PANTALLA ---
  0x00, 0xE0,        // CLS

  // --- REGISTROS BASE ---
  0x60, 0x05,        // V0 = 5
  0x61, 0x03,        // V1 = 3
  0x62, 0xFF,        // V2 = 255

  // --- SKIP TEST ---
  0x30, 0x05,        // skip if V0 == 5 (true)
  0x60, 0x00,        // (salteado)
  0x40, 0x06,        // skip if V0 != 6 (true)
  0x60, 0x00,        // (salteado)

  // --- FAMILY 8 ---
  0x80, 0x10,        // V0 = V1
  0x80, 0x11,        // V0 = V0 OR V1
  0x80, 0x12,        // V0 = V0 AND V1
  0x80, 0x13,        // V0 = V0 XOR V1

  0x80, 0x14,        // V0 += V1 (carry test)
  0x82, 0x14,        // V2 += V1 (overflow → VF)

  0x80, 0x15,        // V0 -= V1
  0x81, 0x17,        // V1 = V0 - V1

  0x80, 0x06,        // SHR V0
  0x80, 0x0E,        // SHL V0

  // --- I REGISTER ---
  0xA2, 0x20,        // I = 0x220

  // --- RANDOM ---
  0xC3, 0x0F,        // V3 = rand & 0x0F

  // --- DRAW TEST ---
  0x60, 0x0A,        // V0 = 10 (x)
  0x61, 0x08,        // V1 = 8  (y)
  0xD0, 0x15,        // draw sprite at (V0,V1) height 5

]

chip8.loadProgram(program)

chip8.startEmulation(10)
