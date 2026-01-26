import { createLoop } from './utils.js';

export default class Timers {
  constructor () {
    this.delayTimer = 0;
    this.soundTimer = 0;
    this.timersLoop
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