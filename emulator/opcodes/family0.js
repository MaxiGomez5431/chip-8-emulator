export default function createFamily0(chip) {
  return {
    0x00E0: () => chip.display.clearScreen(),
    0x00EE: () => { 
      chip.pc = chip.stack.pop()
      chip.sp--
    }
  }
}