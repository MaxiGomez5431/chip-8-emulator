import { createLoop } from './utils.js';

export default class Timers {
  constructor () {
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.timersLoop
  }

  startTimers(chip){
    this.timersLoop = createLoop(60, () => {
      if (this.delayTimer > 0) {this.delayTimer--}
      if (this.soundTimer > 0) {
        console.log('BEEP!')  
        this.soundTimer--
      }

      if(chip.display.needRedraw){
        chip.display.redrawFromDebugDisplay()
        chip.display.needRedraw = false
      }
    })

    this.timersLoop.start()
  }

  resetTimers(){
    this.delayTimer = 0;
    this.soundTimer = 0;
  }

  getDelayTimer() {
    return this.delayTimer
  }

  setDelayTimer(value) {
    this.delayTimer = value
  }

  setSoundTimer(value) {
    this.soundTimer = value
  }
}