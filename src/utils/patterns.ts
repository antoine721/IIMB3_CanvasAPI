import { PatternType, PatternSettings, CANVAS_SIZE } from "../constants/cover";

type PatternDrawer = (
  ctx: CanvasRenderingContext2D,
  color: string,
  scale: number
) => void;

const drawWaves: PatternDrawer = (ctx, color, scale) => {
  const spacing = 40 * scale;
  const amplitude = 20 * scale;
  const wavelength = 80 * scale;

  ctx.strokeStyle = color;
  ctx.lineWidth = 2 * scale;

  for (let y = spacing; y < CANVAS_SIZE; y += spacing) {
    ctx.beginPath();
    for (let x = 0; x <= CANVAS_SIZE; x += 2) {
      const waveY = y + Math.sin((x / wavelength) * Math.PI * 2) * amplitude;
      if (x === 0) {
        ctx.moveTo(x, waveY);
      } else {
        ctx.lineTo(x, waveY);
      }
    }
    ctx.stroke();
  }
};

const drawLines: PatternDrawer = (ctx, color, scale) => {
  const spacing = 30 * scale;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5 * scale;

  for (let y = spacing; y < CANVAS_SIZE; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_SIZE, y);
    ctx.stroke();
  }
};

const drawSquares: PatternDrawer = (ctx, color, scale) => {
  const size = 40 * scale;
  const gap = 20 * scale;
  const totalSize = size + gap;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5 * scale;

  for (let y = gap; y < CANVAS_SIZE; y += totalSize) {
    for (let x = gap; x < CANVAS_SIZE; x += totalSize) {
      ctx.strokeRect(x, y, size, size);
    }
  }
};

const drawDots: PatternDrawer = (ctx, color, scale) => {
  const spacing = 30 * scale;
  const radius = 3 * scale;

  ctx.fillStyle = color;

  for (let y = spacing; y < CANVAS_SIZE; y += spacing) {
    for (let x = spacing; x < CANVAS_SIZE; x += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

const drawDiagonal: PatternDrawer = (ctx, color, scale) => {
  const spacing = 30 * scale;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5 * scale;

  for (let i = -CANVAS_SIZE; i < CANVAS_SIZE * 2; i += spacing) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + CANVAS_SIZE, CANVAS_SIZE);
    ctx.stroke();
  }
};

const drawGrid: PatternDrawer = (ctx, color, scale) => {
  const spacing = 40 * scale;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1 * scale;

  for (let x = spacing; x < CANVAS_SIZE; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_SIZE);
    ctx.stroke();
  }

  for (let y = spacing; y < CANVAS_SIZE; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_SIZE, y);
    ctx.stroke();
  }
};

const drawCircles: PatternDrawer = (ctx, color, scale) => {
  const spacing = 60 * scale;
  const radius = 20 * scale;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5 * scale;

  for (let y = spacing; y < CANVAS_SIZE; y += spacing) {
    for (let x = spacing; x < CANVAS_SIZE; x += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
};

const drawTriangles: PatternDrawer = (ctx, color, scale) => {
  const size = 40 * scale;
  const height = (size * Math.sqrt(3)) / 2;
  const spacingX = size * 1.5;
  const spacingY = height;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5 * scale;

  let row = 0;
  for (let y = spacingY; y < CANVAS_SIZE + height; y += spacingY) {
    const offsetX = row % 2 === 0 ? 0 : size * 0.75;
    for (let x = offsetX; x < CANVAS_SIZE + size; x += spacingX) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + size / 2, y - height);
      ctx.lineTo(x + size, y);
      ctx.closePath();
      ctx.stroke();
    }
    row++;
  }
};

const drawHexagons: PatternDrawer = (ctx, color, scale) => {
  const size = 25 * scale;
  const spacingX = size * 3;
  const spacingY = size * Math.sqrt(3);

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5 * scale;

  const drawHex = (cx: number, cy: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  };

  let row = 0;
  for (let y = spacingY; y < CANVAS_SIZE + spacingY; y += spacingY) {
    const offsetX = row % 2 === 0 ? 0 : spacingX / 2;
    for (let x = offsetX + size; x < CANVAS_SIZE + spacingX; x += spacingX) {
      drawHex(x, y);
    }
    row++;
  }
};

const patternDrawers: Record<Exclude<PatternType, "none">, PatternDrawer> = {
  waves: drawWaves,
  lines: drawLines,
  squares: drawSquares,
  dots: drawDots,
  diagonal: drawDiagonal,
  grid: drawGrid,
  circles: drawCircles,
  triangles: drawTriangles,
  hexagons: drawHexagons,
};

export const drawPattern = (
  ctx: CanvasRenderingContext2D,
  pattern: PatternSettings
): void => {
  if (pattern.type === "none") return;

  const drawer = patternDrawers[pattern.type];
  if (!drawer) return;

  ctx.save();
  ctx.globalAlpha = pattern.opacity;
  drawer(ctx, pattern.color, pattern.scale);
  ctx.restore();
};

export const getRandomPattern = (): PatternSettings => {
  const types: Exclude<PatternType, "none">[] = [
    "waves",
    "lines",
    "squares",
    "dots",
    "diagonal",
    "grid",
    "circles",
    "triangles",
    "hexagons",
  ];

  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomOpacity = 0.1 + Math.random() * 0.25;
  const randomScale = 0.5 + Math.random() * 1.5;

  const colors = [
    "#ffffff",
    "#e94560",
    "#00d4ff",
    "#ffd700",
    "#9b59b6",
    "#2ecc71",
    "#f39c12",
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return {
    type: randomType,
    color: randomColor,
    opacity: Math.round(randomOpacity * 100) / 100,
    scale: Math.round(randomScale * 100) / 100,
  };
};
