export default function createFamilyE(chip) {
  return {
    0x9E: (X) => { // Skips the next instruction if the key stored in VX is pressed
      chip.skipNextInstructionIf(
        chip.keyboard.keys[chip.V[X] & 0x0F]
      ) 
    },
    0xA1: (X) => { // Skips the next instruction if the key stored in VX is NOT pressed
      chip.skipNextInstructionIf(
        !chip.keyboard.keys[chip.V[X] & 0x0F]
      ) 
    }
  }
}