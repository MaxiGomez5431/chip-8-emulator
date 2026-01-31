export default function createFamily8(chip) {
  return {
    0x0: (d) => chip.V[d.X] = chip.V[d.Y], //Sets VX to the value of VY.
    
    0x1: (d) => { //Sets VX to VX or VY. (bitwise OR operation) | Resets VF to 0
      chip.V[d.X] = chip.V[d.X] | chip.V[d.Y]
      chip.V[0xF] = 0
    }, 
    0x2: (d) => { //Sets VX to VX and VY. (bitwise AND operation) | Resets VF to 0
      chip.V[d.X] = chip.V[d.X] & chip.V[d.Y]
      chip.V[0xF] = 0
    }, 
    0x3: (d) => { //Sets VX to VX xor VY. (bitwise XOR operation) | Resets VF to 0
      chip.V[d.X] = chip.V[d.X] ^ chip.V[d.Y]
      chip.V[0xF] = 0
    }, 
    0x4: (d) => { //Adds VY to VX. VF is set to 1 when there's an overflow, and to 0 when there is not REVISAR
      const add = chip.V[d.X] + chip.V[d.Y] 
      chip.V[d.X] = add & 0xFF
      chip.V[0xF] = add > 255 ? 1 : 0
    },
    0x5: (d) => { //VY is subtracted from VX. VF is set to 0 when there's an underflow, and 1 when there is not. REVISAR
      const sub = chip.V[d.X] - chip.V[d.Y]
      chip.V[d.X] = sub & 0xFF
      chip.V[0xF] = sub < 0 ? 0 : 1
    },
    0x6: (d) => { //Shifts VX to the right by 1, then stores the least significant bit of VX prior to the shift into VF
      const lastBite = chip.V[d.X] & 0x1
      chip.V[d.X] = chip.V[d.Y] >> 1 & 0xFF // chip.V[d.Y] can be replaced by chip.V[d.X]
      chip.V[0xF] = lastBite
    },
    0x7: (d) => { //Sets VX to VY minus VX. VF is set to 0 when there's an underflow, and 1 when there is not. REVISAR
      const sub = chip.V[d.Y] - chip.V[d.X]
      chip.V[d.X] = sub & 0xFF
      chip.V[0xF] = sub < 0 ? 0 : 1
    },
    0xE: (d) => { //Shifts VX to the left by 1, then sets VF to 1 if the most significant bit of VX prior to that shift was set, or to 0 if it was unset
      const firstBite = (chip.V[d.X] & 0x80) >> 7
      chip.V[d.X] = chip.V[d.Y] << 1 & 0xFF // chip.V[d.Y] can be replaced by chip.V[d.X]
      chip.V[0xF] = firstBite
    }
  }
  }