export default function createFamily0(chip) {
  return {
    0x00E0: () => chip.display.clearScreen(),
    0x00EE: () => { throw new Error("reading 0x00EE, not implemented - family0") }
  }
}