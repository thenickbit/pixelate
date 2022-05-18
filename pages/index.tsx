import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { BlockPicker } from 'react-color';

export default function Home() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>();
  const [artSize, setArtSize] = useState({ width: 16, height: 16 });

  const color = useRef('#000');
  const coordinateX = useRef(-1);
  const coordinateY = useRef(-1);
  const canvasMatrix = useRef([]);
  const pixelSize = useRef(0);
  const ctx = useRef(null);

  // Returns the coordinate on the pixel grid (e.g. [1, 1] or [15, 4])
  const getCanvasPixelCoordinate = (x, y) => {
    const canvasX = Math.ceil(x / pixelSize.current);
    const canvasY = Math.ceil(y / pixelSize.current);

    return [canvasX, canvasY];
  };

  // Returns the pixel's [0, 0] on the canvas (e.g. [63, 63] or [256, 144])
  const getCanvasCoordinate = (x, y) => {
    const pixelX = pixelSize.current * x - pixelSize.current;
    const pixelY = pixelSize.current * y - pixelSize.current;

    return [pixelX, pixelY];
  };

  // Paints a pixel based on getCanvasCoordinate x and y values
  const paintPixel = (x, y, color, saveColor = true) => {
    if (!x || !y) return;

    ctx.current.fillStyle = color;

    const [fillX, fillY] = getCanvasCoordinate(x, y);
    ctx.current.fillRect(fillX, fillY, pixelSize.current, pixelSize.current);
    if (saveColor) setPixelColor(x, y, color);
  };

  // Erases a pixel based on getCanvasCoordinate x and y values
  const erasePixel = (x, y) => {
    if (!x || !y) return;

    let color;

    if (x % 2 === 1 && y % 2 === 0) {
      color = 'lightGrey';
    } else if (x % 2 === 0 && y % 2 === 1) {
      color = 'lightGrey';
    } else {
      color = 'white';
    }

    ctx.current.fillStyle = color;

    const [fillX, fillY] = getCanvasCoordinate(x, y);
    ctx.current.fillRect(fillX, fillY, pixelSize.current, pixelSize.current);
    setPixelColor(x, y, color);
  };

  const setupEventListeners = () => {
    // Disables right-click
    document.addEventListener('contextmenu', (event) => event.preventDefault());

    canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const [mousePositionX, mousePositionY] = getCanvasPixelCoordinate(x, y);

      if (e.buttons === 1) {
        paintPixel(mousePositionX, mousePositionY, color.current);
      } else if (e.buttons === 2) {
        erasePixel(mousePositionX, mousePositionY);
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const [mousePositionX, mousePositionY] = getCanvasPixelCoordinate(x, y);

      // Button is pressed, ignore hover painting
      if (e.buttons === 1) {
        paintPixel(mousePositionX, mousePositionY, color.current);
      } else if (e.buttons === 2) {
        erasePixel(mousePositionX, mousePositionY);
      } else {
        if (mousePositionX !== coordinateX.current || mousePositionY !== coordinateY.current) {
          const oldPixelColor = getPixelColor(coordinateX.current, coordinateY.current);
          paintPixel(coordinateX.current, coordinateY.current, oldPixelColor, false);

          coordinateX.current = mousePositionX;
          coordinateY.current = mousePositionY;
        }

        paintPixel(mousePositionX, mousePositionY, 'darkGrey', false);
      }
    });

    window.addEventListener('resize', () => {
      setPixelSize();
      resizeCanvas();
      redrawCanvas();
    });
  };

  // Creates an empty bi-dimensional array for the canvas matrix based on the artSize
  const initializeCanvasMatrix = () => {
    const matrix = [...Array(artSize.width)].map(() => Array(artSize.height));
    canvasMatrix.current = matrix;
  };

  const getPixelColor = (x, y) => {
    if (x <= 0 || y <= 0) return;
    return canvasMatrix.current[x - 1][y - 1];
  };
  const setPixelColor = (x, y, color) => {
    if (x <= 0 || y <= 0) return;
    canvasMatrix.current[x - 1][y - 1] = color;
  };

  const drawGrid = () => {
    let heightArr = [];
    let widthArr = [];

    for (let w = 1; w <= artSize.width; w++) {
      for (let h = 1; h <= artSize.height; h++) {
        if (w % 2 === 1 && h % 2 === 0) {
          paintPixel(h, w, 'lightGrey');
          widthArr.push('lightGrey');
        } else if (w % 2 === 0 && h % 2 === 1) {
          paintPixel(h, w, 'lightGrey');
          widthArr.push('lightGrey');
        } else {
          paintPixel(h, w, 'white');
          widthArr.push('white');
        }
      }
      heightArr.push(widthArr);
      widthArr = [];
    }

    canvasMatrix.current = heightArr;
  };

  const redrawCanvas = () => {
    for (let w = 1; w <= artSize.width; w++) {
      for (let h = 1; h <= artSize.height; h++) {
        paintPixel(h, w, getPixelColor(h, w));
      }
    }
  };

  const setPixelSize = () => {
    const bodyWidth = canvas.parentElement.clientWidth;
    const bodyHeight = canvas.parentElement.clientHeight;

    const pixelWidth = (bodyWidth - 20) / artSize.width;
    const pixelHeight = (bodyHeight - 20) / artSize.height;
    pixelSize.current = Math.round(Math.min(pixelHeight, pixelWidth));
  };

  const resizeCanvas = () => {
    if (canvas) {
      const canvasWidth = pixelSize.current * artSize.width;
      const canvasHeight = pixelSize.current * artSize.height;

      ctx.current.canvas.width = canvasWidth;
      ctx.current.canvas.height = canvasHeight;
    }
  };

  const setupCanvas = () => {
    // Context for the canvas for 2 dimensional operations
    ctx.current = canvas.getContext('2d');

    setPixelSize();
    setupEventListeners();
    initializeCanvasMatrix();
    resizeCanvas();
    drawGrid();
  };

  useEffect(() => {
    if (canvas) {
      setupCanvas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, artSize]);

  return (
    <div className="h-screen w-screen">
      <Head>
        <title>Pixelate</title>
        <meta name="description" content="Create multi-layered infinite pixel art" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="text-black flex flex-col md:flex-row justify-between h-full w-full">
        <div className="bg-slate-700 w-full md:w-40 h-40 md:h-full">
          {/* <input
            type="number"
            value={artSize.width}
            onChange={(e) => setArtSize({ width: parseInt(e.target.value), height: artSize.height })}
          />
          <input
            type="number"
            value={artSize.height}
            onChange={(e) => setArtSize({ width: artSize.width, height: parseInt(e.target.value) })}
          /> */}
          <BlockPicker color={color.current} onChange={(e) => (color.current = e.hex)} />
          {/* <SketchPicker color={color} onChangeComplete={(e) => (color.current = e.hex)} />; */}
        </div>
        <div className="flex flex-1 max-w-full max-h-full overflow-hidden items-center justify-center flex-shrink p-5">
          <canvas ref={(node) => setCanvas(node)} />
        </div>
        <div className="bg-slate-700 w-full md:w-40 h-40 md:h-full"></div>
      </main>
    </div>
  );
}
