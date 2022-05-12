import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
  const [artSize, setArtSize] = useState({ width: 40, height: 16 });

  const pixelSize = Math.round(1000 / 40);

  let mousePositionX: Number;
  let mousePositionY: Number;

  // Returns the coordinate on the pixel grid (e.g. [1, 1] or [15, 4])
  const getCanvasCoordinate = (x, y) => {
    const canvasX = Math.ceil(x / pixelSize);
    const canvasY = Math.ceil(y / pixelSize);

    return [canvasX, canvasY];
  };

  // Returns the pixel's [0, 0] on the canvas (e.g. [63, 63] or [256, 144])
  const getPixelCoordinate = (x, y) => {
    const pixelX = pixelSize * x - pixelSize;
    const pixelY = pixelSize * y - pixelSize;

    return [pixelX, pixelY];
  };

  const paintPixel = (x, y, color) => {
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = color;

    const [fillX, fillY] = getPixelCoordinate(x, y);
    console.log(fillX, fillY);
    ctx.fillRect(fillX, fillY, pixelSize, pixelSize);
  };

  const setupEventListeners = () => {
    canvas.addEventListener('mousedown', (e) => {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.fillStyle = 'black';

      const [canvasX, canvasY] = getCanvasCoordinate(x, y);
      console.log(canvasX, canvasY);

      paintPixel(canvasX, canvasY, 'black');
    });

    canvas.addEventListener('mousemove', (e) => {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const [mousePositionX, mousePositionY] = getCanvasCoordinate(x, y);
    });
  };

  const drawGrid = () => {
    const ctx = canvas.getContext('2d');

    const cw = canvas.width;
    const ch = canvas.height;

    for (let i = 0; i < ch; i += pixelSize) {
      for (let j = 0; j < cw; j += pixelSize) {
        if (i % 2 === 1 && j % 2 === 0) {
          const [canvasX, canvasY] = getCanvasCoordinate(i, j);
          paintPixel(canvasX, canvasY, 'lightGrey');
        }
        if (i % 2 === 0 && j % 2 === 1) {
          const [canvasX, canvasY] = getCanvasCoordinate(i, j);
          paintPixel(canvasX, canvasY, 'lightGrey');
        }
      }
    }
  };

  const resizeCanvas = (ctx) => {
    const bodyWidth = document.body.clientWidth;
    const bodyHeight = document.body.clientHeight;

    const canvasPixelSize = Math.floor(bodyWidth / artSize.width);

    const canvasWidth = canvasPixelSize * artSize.width;
    const canvasHeight = canvasPixelSize * artSize.height;

    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;
  };

  useEffect(() => {
    if (canvas) {
      setupEventListeners();
      // Context for the canvas for 2 dimensional operations
      const ctx = canvas.getContext('2d');

      // ctx.canvas.width = 1000;
      // ctx.canvas.height = 1000;

      resizeCanvas(ctx);

      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.fillStyle = 'white';
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, width, height);

      ctx.lineTo;

      drawGrid();
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

      <main className="p-14 text-white">
        <canvas ref={(node) => setCanvas(node)} />
      </main>
    </div>
  );
}
