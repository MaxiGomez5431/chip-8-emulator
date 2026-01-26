export default function createFamilyF(chip) {
  return {
    0x07: (X) => { // Sets VX to the value of the delay timer
      chip.V[X] = chip.timers.getDelayTimer() 
    },
    0x0A: (X) => { // A key press is awaited, and then stored in VX 
      chip.isPcHalted = true
      chip.keyboard.onNextKeyPress = (key) => {
        chip.V[X] = key
        chip.isPcHalted = false
      }
    },
    0x15: (X) => { // Sets the delay timer to VX.
      chip.timers.setDelayTimer(chip.V[X])
    },
    0x18: (X) => { //Sets the sound timer to VX.
      chip.timers.setSoundTimer(chip.V[X])
    },
    0x1E: (X) => { //Adds VX to I.
      chip.I = chip.I + chip.V[X]
    },
    0x29: (X) => { //Sets I to the location of the sprite for the character in VX
      chip.I = 0x050 + (chip.V[X] * 5)
    },
    0x33: (X) => { 
      //Stores the binary-coded decimal representation of VX, with the hundreds digit in 
      //memory at location in I, the tens digit at location I+1, and the ones digit at location I+2.
      
      let decimal = chip.V[X]
      chip.memory[chip.I] = Math.floor(decimal / 100)
      chip.memory[chip.I + 1] = (decimal % 100) / 10
      chip.memory[chip.I + 2] = Math.floor(decimal % 10)
    },
    0x55: (X) => { //Stores from V0 to VX (including VX) in memory, starting at address I. 
      for (let i = 0; i <= X; i++){
        chip.memory[chip.I + i] = chip.V[i]
      }
    },
    0x65: (X) => { 
      for (let i = 0; i <= X; i++){
        chip.V[i] = chip.memory[chip.I + i]
      }
    },
  }
}