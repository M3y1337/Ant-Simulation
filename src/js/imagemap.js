import { Config } from "./config.js";
import { getColorDistance } from "./ColorHelpers.js";

export const ImageMap = {
  cells: [],
  cols: 0,
  rows: 0,
  cellWidth: 0,
  cellHeight: 0,
  // Indices of cells whose renderColor changed and need layer updates.
  dirtyIndices: [],
};

function parseHexColor(hex) {
  if (!hex) return { r: 0, g: 0, b: 0 };
  let h = String(hex).trim();
  if (h[0] === "#") h = h.slice(1);
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    return { r, g, b };
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return { r, g, b };
  }
  return { r: 0, g: 0, b: 0 };
}

export function buildImageMap(p, img, worldWidth, worldHeight) {
  ImageMap.cells = [];
  ImageMap.cols = 0;
  ImageMap.rows = 0;
  ImageMap.cellWidth = 0;
  ImageMap.cellHeight = 0;
  ImageMap.dirtyIndices = [];

  if (!img) return;

  const step = Config.mapSampleStep || 4;
  const cols = Math.max(1, Math.floor(img.width / step));
  const rows = Math.max(1, Math.floor(img.height / step));

  ImageMap.cols = cols;
  ImageMap.rows = rows;
  ImageMap.cellWidth = worldWidth / cols;
  ImageMap.cellHeight = worldHeight / rows;

  const foodColor = parseHexColor(Config.mapFoodColor);
  const obstacleColor = parseHexColor(Config.mapObstacleColor);
  const nestColor = parseHexColor(Config.mapNestColor);
  const baseTol = Config.mapColorTolerance != null ? Config.mapColorTolerance : 60;
  const tolFood = Config.mapFoodColorTolerance != null ? Config.mapFoodColorTolerance : baseTol;
  const tolObstacle = Config.mapObstacleColorTolerance != null ? Config.mapObstacleColorTolerance : baseTol;
  const tolNest = Config.mapNestColorTolerance != null ? Config.mapNestColorTolerance : baseTol;
  const method = Config.colorDistanceMethod != null ? Config.colorDistanceMethod : 0;
  const foodUnitsPerCell = Config.mapFoodUnitsPerCell || 1;

  img.loadPixels();

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const sampleX = Math.min(img.width - 1, Math.floor(col * step + step / 2));
      const sampleY = Math.min(img.height - 1, Math.floor(row * step + step / 2));
      const idx = 4 * (sampleY * img.width + sampleX);

      const r = img.pixels[idx];
      const g = img.pixels[idx + 1];
      const b = img.pixels[idx + 2];
      const sample = { r, g, b };

      let kind = "empty";
      let bestDist = Infinity;
      let bestKind = "empty";

      const dFood = getColorDistance(sample, foodColor, method);
      if (dFood <= tolFood && dFood < bestDist) {
        bestDist = dFood;
        bestKind = "food";
      }
      const dObs = getColorDistance(sample, obstacleColor, method);
      if (dObs <= tolObstacle && dObs < bestDist) {
        bestDist = dObs;
        bestKind = "obstacle";
      }
      const dNest = getColorDistance(sample, nestColor, method);
      if (dNest <= tolNest && dNest < bestDist) {
        bestDist = dNest;
        bestKind = "nest";
      }

      if (bestKind !== "empty") {
        kind = bestKind;
      }

      const worldX = (col + 0.5) * ImageMap.cellWidth;
      const worldY = (row + 0.5) * ImageMap.cellHeight;

      const maxFoodUnits = kind === "food" ? foodUnitsPerCell : 0;

      ImageMap.cells.push({
        col,
        row,
        worldX,
        worldY,
        kind,
        baseColor: { r, g, b },
        renderColor: { r, g, b },
        maxFoodUnits,
        foodUnits: maxFoodUnits,
        dirty: false,
      });
    }
  }

  applyMorphologyFilters();
}

function applyMorphologyFilters() {
  const { cells, cols, rows } = ImageMap;
  if (!cells || cells.length === 0) return;

  const len = cells.length;
  const makeMask = (kind) => {
    const mask = new Array(len);
    for (let i = 0; i < len; i++) mask[i] = cells[i].kind === kind;
    return mask;
  };

  let foodMask = makeMask("food");
  let obstacleMask = makeMask("obstacle");
  let nestMask = makeMask("nest");

  const erode = (mask, iterations) => {
    if (!iterations || iterations <= 0) return mask;
    const w = cols;
    const h = rows;
    let cur = mask.slice();
    for (let it = 0; it < iterations; it++) {
      const next = new Array(len).fill(false);
      for (let row = 0; row < h; row++) {
        for (let col = 0; col < w; col++) {
          const idx = row * w + col;
          if (!cur[idx]) continue;
          let keep = true;
          const check = (c, r) => {
            if (c < 0 || c >= w || r < 0 || r >= h) {
              keep = false;
              return;
            }
            const ni = r * w + c;
            if (!cur[ni]) keep = false;
          };
          // 4-connected neighbourhood
          check(col - 1, row);
          if (!keep) {
            next[idx] = false;
            continue;
          }
          check(col + 1, row);
          if (!keep) {
            next[idx] = false;
            continue;
          }
          check(col, row - 1);
          if (!keep) {
            next[idx] = false;
            continue;
          }
          check(col, row + 1);
          if (!keep) {
            next[idx] = false;
            continue;
          }
          next[idx] = true;
        }
      }
      cur = next;
    }
    return cur;
  };

  const dilate = (mask, iterations) => {
    if (!iterations || iterations <= 0) return mask;
    const w = cols;
    const h = rows;
    let cur = mask.slice();
    for (let it = 0; it < iterations; it++) {
      const next = cur.slice();
      for (let row = 0; row < h; row++) {
        for (let col = 0; col < w; col++) {
          const idx = row * w + col;
          if (!cur[idx]) continue;
          const setIfValid = (c, r) => {
            if (c < 0 || c >= w || r < 0 || r >= h) return;
            const ni = r * w + c;
            next[ni] = true;
          };
          // 4-connected neighbourhood
          setIfValid(col - 1, row);
          setIfValid(col + 1, row);
          setIfValid(col, row - 1);
          setIfValid(col, row + 1);
        }
      }
      cur = next;
    }
    return cur;
  };

  foodMask = erode(foodMask, Config.mapFoodErodeIterations || 0);
  foodMask = dilate(foodMask, Config.mapFoodDilateIterations || 0);

  obstacleMask = erode(obstacleMask, Config.mapObstacleErodeIterations || 0);
  obstacleMask = dilate(obstacleMask, Config.mapObstacleDilateIterations || 0);

  nestMask = erode(nestMask, Config.mapNestErodeIterations || 0);
  nestMask = dilate(nestMask, Config.mapNestDilateIterations || 0);

  // Reassign kinds with a clear priority: obstacle > nest > food.
  for (let i = 0; i < len; i++) {
    let kind = "empty";
    if (obstacleMask[i]) kind = "obstacle";
    else if (nestMask[i]) kind = "nest";
    else if (foodMask[i]) kind = "food";

    cells[i].kind = kind;
    const maxFoodUnits = kind === "food" ? (Config.mapFoodUnitsPerCell || 1) : 0;
    cells[i].maxFoodUnits = maxFoodUnits;
    cells[i].foodUnits = maxFoodUnits;
  }
}

export function onMapFoodConsumed(cellIndex) {
  if (cellIndex == null) return;
  const cell = ImageMap.cells[cellIndex];
  if (!cell || cell.maxFoodUnits <= 0) return;
  if (cell.foodUnits <= 0) return;

  cell.foodUnits -= 1;

  const depletedColor = parseHexColor(Config.mapFoodDepletedColor || "#000000");
  const ratio = cell.maxFoodUnits > 0 ? cell.foodUnits / cell.maxFoodUnits : 0;
  const t = 1 - ratio;

  const r = Math.round(cell.baseColor.r * (1 - t) + depletedColor.r * t);
  const g = Math.round(cell.baseColor.g * (1 - t) + depletedColor.g * t);
  const b = Math.round(cell.baseColor.b * (1 - t) + depletedColor.b * t);

  cell.renderColor = { r, g, b };

  if (!cell.dirty) {
    cell.dirty = true;
    ImageMap.dirtyIndices.push(cellIndex);
  }
}
