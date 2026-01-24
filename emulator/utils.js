export function createLoop(hz, update) {
  const interval = 1000 / hz;

  let lastTime = 0;
  let accumulator = 0;
  let running = false;
  let rafId = null;

  function frame(now) {
    if (!running) return;

    if (lastTime === 0) {
      lastTime = now;
    }

    const delta = now - lastTime;
    lastTime = now;
    accumulator += delta;

    while (accumulator >= interval) {
      update();
      accumulator -= interval;
    }

    rafId = requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) return;

      running = true;
      lastTime = 0;
      accumulator = 0;
      rafId = requestAnimationFrame(frame);
    },

    stop() {
      running = false;

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },

    isRunning(){
      return running
    }
  };
}

export function getFirstNibble(opcode) {
  return (opcode & 0xF000) >> 12;
}

export function getSecondNibble(opcode) {
  return (opcode & 0x0F00) >> 8;
}

export function getThirdNibble(opcode) {
  return (opcode & 0x00F0) >> 4;
}

export function getFourthNibble(opcode) {
  return opcode & 0x000F;
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function loadFonsetInto(memory) {
  let updatedMemory = memory

  const FONTSET_START_ADDRESS = 0x50;
  const fontset = [
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

  for (let i = 0; i < fontset.length; i++) {
    updatedMemory[FONTSET_START_ADDRESS + i] = fontset[i];
  }

  return updatedMemory

}