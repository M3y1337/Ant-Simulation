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

  const drawPheroBuckets = (map, r, g, b) => {
    for (const bucket of map.values()) {
      const x = bucket.xSum / bucket.count;
      const y = bucket.ySum / bucket.count;
      const avgIntensity = bucket.intensitySum / bucket.count;
      let radius = 3 + Math.sqrt(bucket.count); // base radius plus count-based growth

      // Base alpha scales with intensity and count.
      let alpha = Math.min(255, avgIntensity * 255 * Math.min(3, bucket.count));
      if (Config.pheromoneDiffusionEnabled) {
        // Match behavioural diffusion: older pheromones are broader but weaker.
        const ageFactor = 1 - avgIntensity; // 0 = fresh, 1 = old
        const strength = Config.pheromoneDiffusionStrength != null ? Config.pheromoneDiffusionStrength : 1.0;
        alpha *= 1 - 0.6 * ageFactor * strength;
        radius += ageFactor * 3 * strength;
      }
      if (alpha < 5) continue; 
      // too faint to matter

     
      if (Config.pheromoneDiffusionEnabled) {
       
      }

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

  drawPheroBuckets(redCells, redRGB.r, redRGB.g, redRGB.b);
  drawPheroBuckets(blueCells, blueRGB.r, blueRGB.g, blueRGB.b);
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
