import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
  const [artSize, setArtSize] = useState({ width: 15, height: 15 });

  let coordinateX = useRef(-1);
  let coordinateY = useRef(-1);

  const canvasMatrix = useRef([]);

  const pixelSize = useRef(0);

  // Returns the coordinate on the pixel grid (e.g. [1, 1] or [15, 4])
  const getCanvasCoordinate = (x, y) => {
    const canvasX = Math.ceil(x / pixelSize.current);
    const canvasY = Math.ceil(y / pixelSize.current);

    return [canvasX, canvasY];
  };

  // Returns the pixel's [0, 0] on the canvas (e.g. [63, 63] or [256, 144])
  const getPixelCoordinate = (x, y) => {
    const pixelX = pixelSize.current * x - pixelSize.current;
    const pixelY = pixelSize.current * y - pixelSize.current;

    return [pixelX, pixelY];
  };

  // Paints a pixel based on getCanvasCoordinate x and y values
  const paintPixel = (x, y, color) => {
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = color;

    const [fillX, fillY] = getPixelCoordinate(x, y);
    ctx.fillRect(fillX, fillY, pixelSize.current, pixelSize.current);
  };

  const setupEventListeners = () => {
    canvas.addEventListener('mousedown', (e) => {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.fillStyle = 'black';

      const [canvasX, canvasY] = getCanvasCoordinate(x, y);

      setPixelColor(canvasX, canvasY, 'black');
      paintPixel(canvasX, canvasY, 'black');
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const [mousePositionX, mousePositionY] = getCanvasCoordinate(x, y);

      if (mousePositionX !== coordinateX.current || mousePositionY !== coordinateY.current) {
        const oldPixelColor = getPixelColor(coordinateX.current, coordinateY.current);
        paintPixel(coordinateX.current, coordinateY.current, oldPixelColor);

        coordinateX.current = mousePositionX;
        coordinateY.current = mousePositionY;
      }

      paintPixel(mousePositionX, mousePositionY, 'darkGrey');
    });
  };

  const getPixelColor = (x, y) => canvasMatrix.current[x + 1][y + 1];
  const setPixelColor = (x, y, color) => (canvasMatrix.current[x + 1][y + 1] = color);

  const drawGrid = () => {
    let heightArr = [];
    let widthArr = [];

    for (let h = 1; h <= artSize.height; h++) {
      for (let w = 1; w <= artSize.width; w++) {
        if (h % 2 === 1 && w % 2 === 0) {
          paintPixel(w, h, 'lightGrey');
          widthArr.push('lightGrey');
        } else if (h % 2 === 0 && w % 2 === 1) {
          paintPixel(w, h, 'lightGrey');
          widthArr.push('lightGrey');
        } else {
          paintPixel(w, h, 'white');
          widthArr.push('white');
        }
      }
      heightArr.push(widthArr);
      widthArr = [];
    }

    canvasMatrix.current = heightArr;
  };

  const getPixelSize = () => {
    const bodyWidth = document.body.clientWidth;
    const bodyHeight = document.body.clientHeight;

    const pixelWidth = bodyWidth / artSize.width;
    const pixelHeight = bodyHeight / artSize.height;

    return Math.round(Math.min(pixelHeight, pixelWidth));
  };

  const resizeCanvas = (ctx) => {
    const canvasWidth = pixelSize.current * artSize.width;
    const canvasHeight = pixelSize.current * artSize.height;

    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;
  };

  useEffect(() => {
    const size = getPixelSize();
    pixelSize.current = size;

    if (canvas) {
      setupEventListeners();
      // Context for the canvas for 2 dimensional operations
      const ctx = canvas.getContext('2d');

      resizeCanvas(ctx);

      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;

      ctx.fillStyle = 'white';
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, width, height);

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
