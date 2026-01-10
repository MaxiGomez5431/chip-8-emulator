export function createLoop(hz, update) {
  const interval = 1000 / hz;

  let lastTime = 0;
  let accumulator = 0;
  let running = false;
  let rafId = null;

  function frame(now) {
    if (!running) return;

    if (lastTime === 0) {
      lastTime = now;
    }

    const delta = now - lastTime;
    lastTime = now;
    accumulator += delta;

    while (accumulator >= interval) {
      update();
      accumulator -= interval;
    }

    rafId = requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) return;

      running = true;
      lastTime = 0;
      accumulator = 0;
      rafId = requestAnimationFrame(frame);
    },

    stop() {
      running = false;

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },

    isRunning(){
      return running
    }
  };
}
