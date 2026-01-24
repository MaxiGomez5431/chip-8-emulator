export default class Display {
  constructor(canvas) {
    this.width = 64;
    this.height = 32;

    this.debugDisplay = new Uint8Array(64 * 32).fill(0);

    this.CANVAS_SIZE_MULTIPLIER = 10;
    this.SCALE = this.CANVAS_SIZE_MULTIPLIER;
    canvas.width = 64 * this.SCALE;
    canvas.height = 32 * this.SCALE;

    this.canvasContext = canvas.getContext('2d');
  }

  clearScreen(){
    this.debugDisplay.fill(0)
    this.canvasContext.clearRect(0, 0, 64 * this.SCALE, 32 * this.SCALE)
  }
  
  drawPixelAt(x, y, actualVF){
    // wrap
    x = x % 64;
    y = y % 32;

    let VF = actualVF

    const index = x + (y * 64)
    if(this.debugDisplay[index] === 0) {
      this.canvasContext.fillStyle = 'white';
      this.canvasContext.fillRect(x * this.SCALE, y * this.SCALE, this.SCALE, this.SCALE);
      this.debugDisplay[index] = 1
    } else {
      this.canvasContext.fillStyle = 'black';
      this.canvasContext.fillRect(x * this.SCALE, y * this.SCALE, this.SCALE, this.SCALE);
      VF = 1 //It resets in drawSpriteAt() 
      this.debugDisplay[index] = 0
    }

    return VF
  }

  drawByteAt(x, y, byte, actualVF){
    if (byte < 0) throw new Error(`drawByte - byte ${byte} is below 0x00`);
    if (byte > 255) throw new Error(`drawByte - byte ${byte} exceeds 0xFF value`);
    let variableX = x
    let VF = actualVF

    for (let position = 7; position >= 0; position--) {
      const bit = (byte >> position) & 1;
      if (bit) {
        VF = this.drawPixelAt(variableX, y, VF)
      }
      variableX++
    }

    return VF
  }
}