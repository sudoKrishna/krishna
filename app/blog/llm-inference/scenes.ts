import { layerCount, type transformerScenes } from "./transformer-script";

type Point = readonly [number, number, number];
type Project = (point: Point) => Point;

function coordinates(points: Point[]) {
  return points;
}

function projector(
  width: number,
  height: number,
  yaw: number,
  pitch: number,
  zoom: number,
): Project {
  const cy = Math.cos(yaw),
    sy = Math.sin(yaw);
  const cp = Math.cos(pitch),
    sp = Math.sin(pitch);
  return ([x, y, z]) => {
    const x1 = x * cy - z * sy;
    const z1 = x * sy + z * cy;
    const y1 = y * cp - z1 * sp;
    const depth = y * sp + z1 * cp;
    const scale = zoom / (1 + depth / 19);
    return [width * 0.5 + x1 * scale, height * 0.52 + y1 * scale, depth];
  };
}
function path(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  fill: string | null,
  stroke: string | null,
  width = 1,
) {
  ctx.beginPath();
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  if (fill) {
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.lineWidth = width;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}
const faceIndexes = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [0, 1, 5, 4],
  [1, 2, 6, 5],
  [2, 3, 7, 6],
  [3, 0, 4, 7],
];
function box(
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
  depth: number,
  top: string,
  side: string,
) {
  return { x, y, z, width, height, depth, top, side };
}
function drawBoxes(
  ctx: CanvasRenderingContext2D,
  project: Project,
  boxes: ReturnType<typeof box>[],
) {
  boxes
    .flatMap(({ x, y, z, width, height, depth, top, side }) => {
      const x0 = x - width / 2,
        x1 = x + width / 2,
        y0 = y - height / 2,
        y1 = y + height / 2,
        z0 = z - depth / 2,
        z1 = z + depth / 2;
      const pts = coordinates([
        [x0, y0, z0],
        [x1, y0, z0],
        [x1, y0, z1],
        [x0, y0, z1],
        [x0, y1, z0],
        [x1, y1, z0],
        [x1, y1, z1],
        [x0, y1, z1],
      ]).map(project);
      return faceIndexes.map((indices, i) => {
        const face = indices.map((index) => pts[index]);
        return {
          face,
          depth: face.reduce((sum, point) => sum + point[2], 0) / 4,
          fill: i === 0 ? top : side,
        };
      });
    })
    .sort((a, b) => b.depth - a.depth)
    .forEach(({ face, fill }) => path(ctx, face, fill, "#161616"));
}
export const gpuParts = {
  fans: {
    title: "Cooling fans",
    note: "Fans move air through the heatsink. When a card hits its thermal limit, lower clocks can cut sustained throughput.",
    anchor: [-2.63, -1.23, -0.24],
  },
  heatsink: {
    title: "Heatsink",
    note: "Metal fins carry heat away from the GPU and memory. Cooling matters during long runs with a steady stream of requests.",
    anchor: [2.16, -0.45, -2.14],
  },
  power: {
    title: "Power input",
    note: "The board draws power through its connectors. Serving efficiently means measuring useful tokens per watt as well as tokens per second.",
    anchor: [4.53, -0.61, -1.87],
  },
  compute: {
    title: "GPU die",
    note: "The die executes attention and matrix operations. During small-batch decode it can spend much of a step waiting for data.",
    anchor: [0.15, -0.53, -0.05],
  },
  vram: {
    title: "VRAM",
    note: "Memory chips hold model weights, the KV cache and working buffers. Capacity limits what fits. Bandwidth limits how fast data arrives.",
    anchor: [1.91, -0.32, 1.05],
  },
  host: {
    title: "PCIe edge connector",
    note: "PCIe links the GPU to the host. System RAM lives elsewhere on the motherboard. Offloading through this link can add latency.",
    anchor: [-2.18, 0.075, 2.31],
  },
} as const;

export type GpuPart = keyof typeof gpuParts;
export const gpuPartKeys = Object.keys(gpuParts) as GpuPart[];
export const isInternal = (part: GpuPart) =>
  part === "compute" || part === "vram" || part === "host";

function polygon(
  project: Project,
  x: number,
  y: number,
  z: number,
  radius: number,
  count: number,
) {
  return Array.from({ length: count }, (_, i) => {
    const theta = (i / count) * Math.PI * 2;
    return project([
      x + Math.cos(theta) * radius,
      y,
      z + Math.sin(theta) * radius,
    ]);
  });
}

function drawFan(
  ctx: CanvasRenderingContext2D,
  project: Project,
  x: number,
  y: number,
  active: boolean,
) {
  path(ctx, polygon(project, x, y, 0.1, 1.66, 38), "#818181", "#1c1c1c", 1.4);
  path(
    ctx,
    polygon(project, x, y - 0.015, 0.1, 1.5, 38),
    "#171717",
    active ? "#e8e8e8" : "#505050",
    1.2,
  );
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2;
    const blade = [
      [0.38, 0],
      [0.86, -0.18],
      [1.38, -0.39],
      [1.39, -0.12],
      [1.12, 0.11],
      [0.7, 0.24],
      [0.39, 0.18],
    ];
    path(
      ctx,
      blade.map(([r, t]) =>
        project([
          x + Math.cos(angle + t) * r,
          y - 0.025,
          0.1 + Math.sin(angle + t) * r,
        ]),
      ),
      i % 2 ? "#5b5b5b" : "#6e6e6e",
      "#313131",
      0.6,
    );
  }
  path(
    ctx,
    polygon(project, x, y - 0.045, 0.1, 0.39, 26),
    "#929292",
    "#3d3d3d",
    1,
  );
  path(
    ctx,
    polygon(project, x, y - 0.05, 0.1, 0.22, 26),
    "#454545",
    "#aaaaaa",
    0.8,
  );
}

export function drawGraphicsCard(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  yaw: number,
  pitch: number,
  split: number,
  activePart: GpuPart,
) {
  const project = projector(
    w,
    h,
    yaw,
    pitch,
    Math.min(w / (14 + 1.6 * split), h / (8.4 + 0.9 * split)),
  );
  const boardProject: Project = ([x, y, z]) =>
    project([x, y + 0.48 * split, z - 0.55 * split]);
  const up = -2.46 * split;
  const shift = 0.34 * split;
  const on = (name: GpuPart) => name === activePart;
  const lineColor = "#3b3b3b";
  for (let i = -7; i <= 7; i++) {
    path(
      ctx,
      coordinates([
        [i, 1.16, -4.6],
        [i, 1.16, 4.6],
      ]).map(project),
      null,
      lineColor,
      0.8,
    );
    path(
      ctx,
      coordinates([
        [-7, 1.16, i * 0.7],
        [7, 1.16, i * 0.7],
      ]).map(project),
      null,
      lineColor,
      0.8,
    );
  }

  drawBoxes(ctx, boardProject, [
    box(0, 0.17, 0, 10.5, 0.16, 4.23, "#434343", "#232323"),
  ]);
  for (let i = 0; i < 24; i++) {
    const x = -4.75 + i * 0.408;
    path(
      ctx,
      coordinates([
        [x, 0.084, -2],
        [x, 0.084, -1.52],
        [x - 0.23, 0.084, -1.16],
        [x - 0.23, 0.084, 1.71],
      ]).map(boardProject),
      null,
      i % 3 === 0 ? "#8b8b8b" : "#686868",
      0.75,
    );
  }
  const board = [
    box(0.15, -0.065, 0, 2.35, 0.29, 1.89, "#595959", "#2f2f2f"),
    box(
      0.15,
      -0.29,
      0,
      1.54,
      0.18,
      1.28,
      on("compute") ? "#e6e6e6" : "#939393",
      "#5f5f5f",
    ),
  ];
  for (const x of [-1.86, 1.91])
    for (const z of [-1.26, 0, 1.06]) {
      board.push(
        box(
          x,
          -0.09,
          z,
          0.64,
          0.31,
          0.64,
          on("vram") ? "#d3d3d3" : "#717171",
          "#464646",
        ),
      );
    }
  for (let i = 0; i < 18; i++)
    board.push(
      box(
        -3.5 + i * 0.155,
        0.06,
        2.26,
        0.104,
        0.105,
        0.48,
        on("host") ? "#e2e2e2" : "#959595",
        "#626262",
      ),
    );
  for (let i = 0; i < 10; i++)
    board.push(
      box(
        -4.7 + i * 0.39,
        -0.08,
        -1.66,
        0.16,
        0.22,
        0.22,
        "#8e8e8e",
        "#505050",
      ),
    );
  drawBoxes(ctx, boardProject, board);
  for (let i = 0; i < 5; i++) {
    const o = -0.55 + i * 0.27;
    path(
      ctx,
      coordinates([
        [0.15 + o, -0.384, -0.49],
        [0.15 + o, -0.384, 0.49],
      ]).map(boardProject),
      null,
      "#4c4c4c",
      0.8,
    );
    path(
      ctx,
      coordinates([
        [-0.46, -0.384, o + 0.03],
        [0.76, -0.384, o + 0.03],
      ]).map(boardProject),
      null,
      "#4c4c4c",
      0.8,
    );
  }
  const housing = [
    box(
      shift,
      -0.33 + up,
      0,
      10.75,
      0.47,
      4.32,
      "#3b3b3b",
      on("heatsink") ? "#929292" : "#313131",
    ),
    box(shift, -0.82 + up, 0, 10.9, 0.44, 4.4, "#585858", "#2a2a2a"),
    box(
      -5.48 + shift,
      -0.55 + up,
      0.03,
      0.18,
      0.83,
      4.53,
      "#a3a3a3",
      "#6a6a6a",
    ),
    box(5.42 + shift, -0.53 + up, 0, 0.26, 0.73, 4.25, "#8f8f8f", "#575757"),
    box(
      4.5 + shift,
      -0.64 + up,
      -2.12,
      1.01,
      0.43,
      0.56,
      on("power") ? "#e6e6e6" : "#aaaaaa",
      "#313131",
    ),
  ];
  drawBoxes(ctx, project, housing);
  for (let i = 0; i < 30; i++) {
    const x = -5.05 + shift + i * 0.348;
    const color = on("heatsink") ? "#d2d2d2" : "#656565";
    for (const z of [-2.167, 2.167])
      path(
        ctx,
        coordinates([
          [x, -0.55 + up, z],
          [x, -0.16 + up, z],
        ]).map(project),
        null,
        color,
        1.4,
      );
  }
  const trim = (points: [number, number][], fill: string, outline: string) =>
    path(
      ctx,
      points.map(([x, z]) => project([x + shift, -1.048 + up, z])),
      fill,
      outline,
      1.25,
    );
  trim(
    [
      [-5.41, -2.13],
      [-4.76, -2.13],
      [-2.7, 2.11],
      [-5.41, 2.11],
    ],
    "#6c6c6c",
    "#323232",
  );
  trim(
    [
      [5.41, -2.13],
      [5.41, 2.11],
      [4.73, 2.11],
      [2.67, -2.13],
    ],
    "#767676",
    "#3e3e3e",
  );
  trim(
    [
      [-0.87, -2.13],
      [0.48, -2.13],
      [2.05, 2.11],
      [0.68, 2.11],
    ],
    "#909090",
    "#545454",
  );
  for (const x of [-2.62, 2.62])
    drawFan(ctx, project, x + shift, -1.068 + up, on("fans"));
  const screws = [
    [-4.92, -1.74],
    [-4.92, 1.73],
    [4.98, -1.74],
    [4.98, 1.73],
  ];
  for (const [x, z] of screws)
    path(
      ctx,
      polygon(project, x + shift, -1.053 + up, z, 0.105, 12),
      "#c6c6c6",
      "#454545",
      0.9,
    );
  const [labelX, labelY] = project([0.14 + shift, -0.46 + up, 2.23]);
  ctx.save();
  const [nextX, nextY] = project([1.15 + shift, -0.46 + up, 2.23]);
  ctx.translate(labelX, labelY);
  ctx.rotate(Math.atan2(nextY - labelY, nextX - labelX));
  ctx.fillStyle = "#e3e3e3";
  ctx.font = "700 12px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText("RTX", 0, 3);
  ctx.restore();

  return (part: GpuPart) => {
    const [x, y, z] = gpuParts[part].anchor;
    return isInternal(part)
      ? boardProject([x, y, z])
      : project([x + shift, y + up, z]);
  };
}

export function drawTransformer(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  activeLayer: number,
  scene: (typeof transformerScenes)[number],
  phase: number,
) {
  const scale = Math.min(width / 370, height / 350);
  const startX = width * 0.48;
  const startY = height * 0.83;
  const project: Project = ([x, y, z]) => [
    startX + (x + z * 0.52) * scale,
    startY + (y - z * 0.35) * scale,
    z,
  ];
  const level = (layer: number) => -(layer - 1) * 7.5;
  const marker = scene.phase === "Decode" ? "#fbc180" : "#99bbff";
  const cache = "#76dfc5";

  function line(from: Point, to: Point, color: string, thickness = 1) {
    path(ctx, [project(from), project(to)], null, color, thickness);
  }

  function dot(point: Point, size: number, color: string) {
    const [x, y] = project(point);
    ctx.beginPath();
    ctx.arc(x, y, size * scale, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function label(text: string, point: Point, color: string) {
    const [x, y] = project(point);
    ctx.fillStyle = color;
    ctx.font = `600 ${11 * scale}px ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.fillText(text, x, y);
  }

  line([105, 4, 0], [105, level(layerCount), 0], "#385a58");
  for (let layer = 1; layer <= layerCount; layer++) {
    const y = level(layer);
    const focused = layer === activeLayer;
    const done = layer < activeLayer;
    const fill = focused ? marker : done ? "#3e4b66" : "#263149";
    drawBoxes(ctx, project, [
      box(0, y, 0, 124, 3, 56, fill, focused ? "#677691" : "#131a29"),
    ]);
    if (focused || layer === 1 || layer === layerCount || layer % 8 === 0) {
      label(
        String(layer).padStart(2, "0"),
        [-100, y + 4, 0],
        focused ? marker : "#aeb8cb",
      );
    }
    const cached =
      scene.phase === "Decode" ||
      done ||
      scene.visual === "output" ||
      (focused && scene.visual === "write");
    if (cached) dot([105, y, 0], focused ? 3.2 : 1.8, cache);
  }

  const activeY = level(activeLayer);
  const mode = scene.visual;
  if (mode === "write" || mode === "read" || mode === "stack") {
    line([58, activeY, 0], [105, activeY, 0], cache, 1.5);
    const reading = scene.phase === "Decode" && phase < 0.55;
    const offset =
      scene.phase === "Decode"
        ? reading
          ? 1 - phase / 0.55
          : (phase - 0.55) / 0.45
        : phase;
    dot([58 + 47 * offset, activeY, 0], 3.3, cache);
  }

  const count = scene.phase === "Prefill" && mode !== "output" ? 5 : 1;
  const packetY =
    mode === "input"
      ? 35 * (1 - phase)
      : mode === "output"
        ? activeY - 29 * phase
        : activeY - (mode === "stack" ? ((phase * layerCount) % 1) * 7.5 : 10);
  for (let i = 0; i < count; i++) {
    dot([(i - (count - 1) / 2) * 14, packetY, 12], 4.5, marker);
  }

  if (mode === "attention") {
    const projections = [
      ["Q", -38, "#99bbff"],
      ["K", 0, "#76dfc5"],
      ["V", 38, "#fbc180"],
    ] as const;
    for (const [name, x, color] of projections) {
      line([0, activeY + 22, 0], [x, activeY - 34, 22], color);
      dot([x * phase, activeY + 22 - 56 * phase, 22 * phase], 3.7, color);
      label(name, [x, activeY - 35, 25], color);
    }
  }

  label("PER-LAYER KV", [104, level(layerCount) - 14, 0], cache);
  label(
    "VOCABULARY HEAD",
    [-10, level(layerCount) - 26, 0],
    mode === "output" ? marker : "#aeb8cb",
  );
  label(
    mode === "attention"
      ? "Q · K · V"
      : scene.phase === "Prefill"
        ? "PROMPT POSITIONS"
        : "CURRENT POSITION",
    [0, 48, 0],
    marker,
  );
}
