import { Config } from "./config.js";

export function renderClusteredPheromones(p, visibleRedPheromones, visibleBluePheromones) {
  const cellSize = Config.pheromoneClusterCellSize || 8; // pixels
  const redCells = new Map();
  const blueCells = new Map();

  const accumulatePhero = (map, elem) => {
    const ph = elem.value;
    const cx = Math.floor(ph.pos.x / cellSize);
    const cy = Math.floor(ph.pos.y / cellSize);
    const key = cx + "," + cy;
    const normLife = ph.lifeAmount > 0 ? ph.life / ph.lifeAmount : 0;
    let bucket = map.get(key);
    if (!bucket) {
      bucket = { xSum: 0, ySum: 0, count: 0, intensitySum: 0 };
      map.set(key, bucket);
    }
    bucket.xSum += ph.pos.x;
    bucket.ySum += ph.pos.y;
    bucket.count += 1;
    bucket.intensitySum += normLife;
  };

  for (let elem of visibleRedPheromones) accumulatePhero(redCells, elem);
  for (let elem of visibleBluePheromones) accumulatePhero(blueCells, elem);

  const drawPheroBuckets = (map, r, g, b, useDiffusion, diffusionStrength) => {
    for (const bucket of map.values()) {
      const x = bucket.xSum / bucket.count;
      const y = bucket.ySum / bucket.count;
      const avgIntensity = bucket.intensitySum / bucket.count;
      let radius = 3 + Math.sqrt(bucket.count); // base radius plus count-based growth

      // Base alpha scales with intensity and count.
      let alpha = Math.min(255, avgIntensity * 255 * Math.min(3, bucket.count));
      if (useDiffusion) {
        // Match behavioural diffusion: older pheromones are broader but weaker.
        const ageFactor = 1 - avgIntensity; // 0 = fresh, 1 = old
        const strength = diffusionStrength != null ? diffusionStrength : 1.0;
        alpha *= 1 - 0.6 * ageFactor * strength;
        radius += ageFactor * 3 * strength;
      }
      if (alpha < 5) continue; 
      // too faint to matter

      // Apply global visual caps, if configured.
      if (Config.pheromoneMaxRadius != null) {
        radius = Math.min(radius, Config.pheromoneMaxRadius);
      }
      const intensityFactor = Config.pheromoneMaxIntensity != null ? Config.pheromoneMaxIntensity : 1.0;
      if (intensityFactor !== 1.0) {
        alpha *= intensityFactor;
      }
      if (alpha > 255) alpha = 255;
      if (alpha < 0) alpha = 0;

     
      p.noStroke();
      p.fill(r, g, b, alpha);
      p.circle(x, y, radius * 2);
    }
  };

  const hexToRgb = (hex, fallback) => {
    if (!hex || typeof hex !== "string") return fallback;
    let h = hex.trim();
    if (h[0] === "#") h = h.slice(1);
    if (h.length === 3) {
      h = h.split("").map((c) => c + c).join("");
    }
    if (h.length !== 6) return fallback;
    const num = parseInt(h, 16);
    if (Number.isNaN(num)) return fallback;
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const redDefaults = { r: 253, g: 33, b: 8 };
  const blueDefaults = { r: 66, g: 135, b: 245 };
  const redRGB = hexToRgb(Config.pheromoneRedColor, redDefaults);
  const blueRGB = hexToRgb(Config.pheromoneBlueColor, blueDefaults);

  const redUseDiff = Config.redPheromoneDiffusionEnabled != null ? Config.redPheromoneDiffusionEnabled : Config.pheromoneDiffusionEnabled;
  let redStrength = Config.redPheromoneDiffusionStrength != null ? Config.redPheromoneDiffusionStrength : Config.pheromoneDiffusionStrength;
  if (redStrength == null) redStrength = 1.0;

  const blueUseDiff = Config.bluePheromoneDiffusionEnabled != null ? Config.bluePheromoneDiffusionEnabled : Config.pheromoneDiffusionEnabled;
  let blueStrength = Config.bluePheromoneDiffusionStrength != null ? Config.bluePheromoneDiffusionStrength : Config.pheromoneDiffusionStrength;
  if (blueStrength == null) blueStrength = 1.0;

  drawPheroBuckets(redCells, redRGB.r, redRGB.g, redRGB.b, redUseDiff, redStrength);
  drawPheroBuckets(blueCells, blueRGB.r, blueRGB.g, blueRGB.b, blueUseDiff, blueStrength);
}

// Simpler, pixel-aligned pheromone rendering for pixel mode.
// Pheromones are accumulated per image-map cell (or approximate pixel cell)
// and drawn as solid rectangles at cell centers to preserve a crisp look.
export function renderPixelPheromones(p, visibleRedPheromones, visibleBluePheromones, cellWidth, cellHeight, cols, rows) {
  if (!cellWidth || !cellHeight) return;

  const redCells = new Map();
  const blueCells = new Map();

  const accumulate = (map, elem) => {
    const ph = elem.value;
    const col = Math.max(0, Math.min(cols - 1, Math.floor(ph.pos.x / cellWidth)));
    const row = Math.max(0, Math.min(rows - 1, Math.floor(ph.pos.y / cellHeight)));
    const key = col + "," + row;
    const normLife = ph.lifeAmount > 0 ? ph.life / ph.lifeAmount : 0;
    let bucket = map.get(key);
    if (!bucket) {
      bucket = { col, row, intensitySum: 0, count: 0 };
      map.set(key, bucket);
    }
    bucket.intensitySum += normLife;
    bucket.count += 1;
  };

  for (const elem of visibleRedPheromones) accumulate(redCells, elem);
  for (const elem of visibleBluePheromones) accumulate(blueCells, elem);

  const hexToRgb = (hex, fallback) => {
    if (!hex || typeof hex !== "string") return fallback;
    let h = hex.trim();
    if (h[0] === "#") h = h.slice(1);
    if (h.length === 3) {
      h = h.split("").map((c) => c + c).join("");
    }
    if (h.length !== 6) return fallback;
    const num = parseInt(h, 16);
    if (Number.isNaN(num)) return fallback;
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const redDefaults = { r: 253, g: 33, b: 8 };
  const blueDefaults = { r: 66, g: 135, b: 245 };
  const redRGB = hexToRgb(Config.pheromoneRedColor, redDefaults);
  const blueRGB = hexToRgb(Config.pheromoneBlueColor, blueDefaults);

  const drawBuckets = (map, rgb) => {
    for (const bucket of map.values()) {
      const avgIntensity = bucket.count > 0 ? bucket.intensitySum / bucket.count : 0;
      let alpha = Math.min(255, avgIntensity * 255 * bucket.count);
      if (alpha < 5) continue;

      const intensityFactor = Config.pheromoneMaxIntensity != null ? Config.pheromoneMaxIntensity : 1.0;
      if (intensityFactor !== 1.0) {
        alpha *= intensityFactor;
      }
      if (alpha > 255) alpha = 255;
      if (alpha < 0) alpha = 0;

      const cx = (bucket.col + 0.5) * cellWidth;
      const cy = (bucket.row + 0.5) * cellHeight;

      p.noStroke();
      p.rectMode(p.CENTER);
      p.fill(rgb.r, rgb.g, rgb.b, alpha);
      p.rect(cx, cy, cellWidth, cellHeight);
    }
  };

  drawBuckets(redCells, redRGB);
  drawBuckets(blueCells, blueRGB);
}

export function renderClusteredFood(p, visibleFood) {
  const cellSize = Config.foodClusterCellSize || 8; // pixels
  const foodCells = new Map();

  for (let elem of visibleFood) {
    const food = elem.value;
    const cx = Math.floor(food.pos.x / cellSize);
    const cy = Math.floor(food.pos.y / cellSize);
    const key = cx + "," + cy;
    let bucket = foodCells.get(key);
    if (!bucket) {
      bucket = {
        cx,
        cy,
        xSum: 0,
        ySum: 0,
        count: 0,
        minX: food.pos.x,
        maxX: food.pos.x,
        minY: food.pos.y,
        maxY: food.pos.y,
      };
      foodCells.set(key, bucket);
    }
    bucket.xSum += food.pos.x;
    bucket.ySum += food.pos.y;
    bucket.count += 1;
    if (food.pos.x < bucket.minX) bucket.minX = food.pos.x;
    if (food.pos.x > bucket.maxX) bucket.maxX = food.pos.x;
    if (food.pos.y < bucket.minY) bucket.minY = food.pos.y;
    if (food.pos.y > bucket.maxY) bucket.maxY = food.pos.y;
  }

  // Merge neighbouring occupied cells into larger clusters so that spatially
  // close food is rendered as a single circle with a count.
  const visited = new Set();
  const clusters = [];

  const getKey = (cx, cy) => cx + "," + cy;

  for (const [key, bucket] of foodCells.entries()) {
    if (visited.has(key)) continue;

    const stack = [bucket];
    visited.add(key);

    const cluster = {
      xSum: 0,
      ySum: 0,
      count: 0,
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
    };

    while (stack.length > 0) {
      const b = stack.pop();
      cluster.xSum += b.xSum;
      cluster.ySum += b.ySum;
      cluster.count += b.count;
      if (b.minX < cluster.minX) cluster.minX = b.minX;
      if (b.maxX > cluster.maxX) cluster.maxX = b.maxX;
      if (b.minY < cluster.minY) cluster.minY = b.minY;
      if (b.maxY > cluster.maxY) cluster.maxY = b.maxY;

      // Visit 8-connected neighbours (including diagonals).
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const nKey = getKey(b.cx + dx, b.cy + dy);
          if (visited.has(nKey)) continue;
          const nb = foodCells.get(nKey);
          if (!nb) continue;
          visited.add(nKey);
          stack.push(nb);
        }
      }
    }

    if (cluster.count > 0) {
      clusters.push(cluster);
    }
  }

  p.noStroke();
  const hexToRgb = (hex, fallback) => {
    if (!hex || typeof hex !== "string") return fallback;
    let h = hex.trim();
    if (h[0] === "#") h = h.slice(1);
    if (h.length === 3) {
      h = h.split("").map((c) => c + c).join("");
    }
    if (h.length !== 6) return fallback;
    const num = parseInt(h, 16);
    if (Number.isNaN(num)) return fallback;
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const foodDefaults = { r: 0, g: 255, b: 0 };
  const foodRGB = hexToRgb(Config.foodClusterColor || Config.foodColor, foodDefaults);

  p.fill(foodRGB.r, foodRGB.g, foodRGB.b);
  for (const cluster of clusters) {
    const x = cluster.xSum / cluster.count;
    const y = cluster.ySum / cluster.count;

    // Approximate footprint of all dots in this merged cluster using its
    // overall bounding box, expanded by the dot radius.
    const foodRadius = Config.foodClusterRadius != null ? Config.foodClusterRadius : 6; // approximate radius for footprint
    const width = Math.max(4, (cluster.maxX - cluster.minX)) + foodRadius;
    const height = Math.max(4, (cluster.maxY - cluster.minY)) + foodRadius;

    // Render as a single circle-like ellipse.
    const radius = Math.max(width, height) / 2;
    p.circle(x, y, radius * 2);

    if (Config.showFoodCounts) {
      const textDefaults = { r: 0, g: 0, b: 0 };
      const textRGB = hexToRgb(Config.foodClusterTextColor, textDefaults);
      p.fill(textRGB.r, textRGB.g, textRGB.b);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(10);
      p.text(String(cluster.count), x, y);
      p.fill(foodRGB.r, foodRGB.g, foodRGB.b);
    }
  }
}

// Pixel-mode food rendering: draw per-cell food overlays based on
// ImageMap-style cell dimensions and remaining food units in each cell.
// This is driven from ImageMap state in sketch.js rather than the Food
// objects themselves so visuals always match cell depletion.
export function renderPixelFood(p, imageMap, baseColor) {
  if (!imageMap || !imageMap.cells || !imageMap.cells.length) return;

  const cells = imageMap.cells;
  const cellW = imageMap.cellWidth;
  const cellH = imageMap.cellHeight;
  if (!cellW || !cellH) return;

  const hexToRgb = (hex, fallback) => {
    if (!hex || typeof hex !== "string") return fallback;
    let h = hex.trim();
    if (h[0] === "#") h = h.slice(1);
    if (h.length === 3) {
      h = h.split("").map((c) => c + c).join("");
    }
    if (h.length !== 6) return fallback;
    const num = parseInt(h, 16);
    if (Number.isNaN(num)) return fallback;
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const defaults = { r: 0, g: 255, b: 0 };
  const rgb = baseColor
    ? hexToRgb(baseColor, defaults)
    : hexToRgb(Config.foodColor, defaults);

  p.noStroke();
  p.rectMode(p.CENTER);

  for (const cell of cells) {
    if (cell.kind !== "food") continue;
    if (!cell.maxFoodUnits || cell.foodUnits <= 0) continue;

    const ratio = cell.maxFoodUnits > 0 ? cell.foodUnits / cell.maxFoodUnits : 0;
    if (ratio <= 0) continue;

    const alpha = 80 + Math.round(175 * ratio);
    const inset = Math.max(1, Math.min(cellW, cellH) * 0.25);
    const w = Math.max(1, cellW - inset * 2);
    const h = Math.max(1, cellH - inset * 2);

    p.fill(rgb.r, rgb.g, rgb.b, alpha);
    p.rect(cell.worldX, cell.worldY, w, h);
  }
}

// Pixel-mode obstacle rendering: draw per-cell obstacle overlays based on
// ImageMap cell dimensions. This is used when pixel cell obstacles are
// enabled so that obstacle cells are clearly visible as solid blocks.
export function renderPixelObstacles(p, imageMap, baseColor) {
  if (!imageMap || !imageMap.cells || !imageMap.cells.length) return;

  const cells = imageMap.cells;
  const cellW = imageMap.cellWidth;
  const cellH = imageMap.cellHeight;
  if (!cellW || !cellH) return;

  const hexToRgb = (hex, fallback) => {
    if (!hex || typeof hex !== "string") return fallback;
    let h = hex.trim();
    if (h[0] === "#") h = h.slice(1);
    if (h.length === 3) {
      h = h.split("").map((c) => c + c).join("");
    }
    if (h.length !== 6) return fallback;
    const num = parseInt(h, 16);
    if (Number.isNaN(num)) return fallback;
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const defaults = { r: 255, g: 175, b: 0 };
  const rgb = baseColor
    ? hexToRgb(baseColor, defaults)
    : hexToRgb(Config.obstacleColor, defaults);

  p.noStroke();
  p.rectMode(p.CENTER);

  for (const cell of cells) {
    if (cell.kind !== "obstacle") continue;

    const inset = Math.max(0, Math.min(cellW, cellH) * 0.1);
    const w = Math.max(1, cellW - inset * 2);
    const h = Math.max(1, cellH - inset * 2);

    p.fill(rgb.r, rgb.g, rgb.b);
    p.rect(cell.worldX, cell.worldY, w, h);
  }
}
