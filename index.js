import Chip8 from './emulator/chip8.js';

const displayElement = document.getElementById('chip8-display');

const chip8 = new Chip8(displayElement);

const romInput = document.getElementById('romLoader')

romInput.addEventListener('change', (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = () => {
    const romBuffer = reader.result
    const romBytes = new Uint8Array(romBuffer)

    chip8.reset()
    chip8.loadProgram(romBytes)
    chip8.startEmulation(700);
  }

  reader.readAsArrayBuffer(file)
})