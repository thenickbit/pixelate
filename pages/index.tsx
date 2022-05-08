import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
  const [currentColor, setCurrentColor] = useState('red');
  const [artSize, setArtSize] = useState({ width: 16, height: 16 });

  // const resizeCanvas = () => {
  //   canvas.style.height = `90vh`;
  //   canvas.style.width = `90vw`;
  // };

  const setupEventListeners = () => {
    canvas.addEventListener('mousedown', (e) => {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.fillStyle = 'black';
      ctx.fillRect(x, y, ctx.canvas.width / 16, ctx.canvas.height / 16);
    });

    canvas.addEventListener('mousemove', () => drawInfiniteGrid());

    // canvas.addEventListener('mousemove', (e) => {
    //   const ctx = canvas.getContext('2d');
    //   const rect = canvas.getBoundingClientRect();

    //   const x = e.clientX - rect.left;
    //   const y = e.clientY - rect.top;

    //   ctx.fillStyle = 'black';
    //   ctx.fillRect(x, y, artSize.width, artSize.height);
    // });
  };

  const drawGrid = () => {
    // const
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const drawInfiniteGrid = async () => {
    const ctx = canvas.getContext('2d');
    const colors = ['red', 'green', 'blue', 'yellow', 'black', 'purple', 'white'];

    for (let k = 0; k < 1; k++) {
      for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
          ctx.fillStyle = colors[Math.floor(Math.random() * 7)];
          ctx.fillRect(i * 62.5, j * 62.5, 62.5, 62.5);
        }
      }
    }
  };

  useEffect(() => {
    const countFps = () => {
      const kFps: HTMLHeadingElement = document.querySelector('#kFps');
      const kpFps: HTMLProgressElement = document.querySelector('#kpFps');

      let be = Date.now(),
        fps = 0;
      requestAnimationFrame(function loop() {
        let now = Date.now();
        fps = Math.round(1000 / (now - be));
        be = now;
        requestAnimationFrame(loop);
        if (fps < 35) {
          kFps.style.color = 'red';
          kFps.textContent = `${fps}`;
        }
        if (fps >= 35 && fps <= 41) {
          kFps.style.color = 'deepskyblue';
          kFps.textContent = fps + ' FPS';
        } else {
          kFps.style.color = 'white';
          kFps.textContent = fps + ' FPS';
        }
        kpFps.value = fps;
      });
    };

    countFps();

    if (canvas) {
      setupEventListeners();
      // Context for the canvas for 2 dimensional operations
      const ctx = canvas.getContext('2d');

      ctx.canvas.width = 1000;
      ctx.canvas.height = 1000;

      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.fillStyle = 'white';
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, width, height);

      ctx.lineTo;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas]);

  return (
    <div className="bg-slate-800 w-screen h-screen flex items-center justify-center overflow-hidden flex-col text-white">
      <Head>
        <title>Pixelate</title>
        <meta name="description" content="Create multi-layered infinite pixel art" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <button onClick={drawInfiniteGrid}>Start show</button>
      <h3 id="kFps" className="text-white">
        0
      </h3>
      <progress id="kpFps" value="0" max="100"></progress>
      <main className="p-14 text-white">
        <canvas ref={(node) => setCanvas(node)} />
      </main>
    </div>
  );
}
