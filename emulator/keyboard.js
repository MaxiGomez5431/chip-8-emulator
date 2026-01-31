export default class Keyboard {
  constructor() {
    this.keys = new Array(16).fill(false);

    this.isWaitingForKeyPress = false;

    this.keyMap = {
      Digit1: 0x1,
      Digit2: 0x2,
      Digit3: 0x3,
      Digit4: 0xC,

      KeyQ: 0x4,
      KeyW: 0x5,
      KeyE: 0x6,
      KeyR: 0xD,

      KeyA: 0x7,
      KeyS: 0x8,
      KeyD: 0x9,
      KeyF: 0xE,

      KeyZ: 0xA,
      KeyX: 0x0,
      KeyC: 0xB,
      KeyV: 0xF
    }

    this.onKeyDown = (event) => {
      if (event.repeat) return

      console.log(event.code)
      const key = this.keyMap[event.code]
      if (key !== undefined) {
        event.preventDefault()
          this.keys[key] = true
      }
    }

    this.onKeyUp = (event) => {
      if (event.repeat) return
      const key = this.keyMap[event.code]
      if (key !== undefined) {
        event.preventDefault()
        this.keys[key] = false
        if (this.onNextKeyPress) {
          console.log('Key pressed while waiting for key press:', key);
          const callback = this.onNextKeyPress;
          this.onNextKeyPress = null;
          callback(key);
        }
      }
    }

    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)

  }

  removeEventListeners() {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
  }

}