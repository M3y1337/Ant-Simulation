import { Config } from "./config.js";
import { getColorDistance } from "./ColorHelpers.js";

export const ImageMap = {
  cells: [],
  cols: 0,
  rows: 0,
  cellWidth: 0,
  cellHeight: 0,
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
  const tol = Config.mapColorTolerance != null ? Config.mapColorTolerance : 60;
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
      if (dFood < bestDist) {
        bestDist = dFood;
        bestKind = "food";
      }
      const dObs = getColorDistance(sample, obstacleColor, method);
      if (dObs < bestDist) {
        bestDist = dObs;
        bestKind = "obstacle";
      }
      const dNest = getColorDistance(sample, nestColor, method);
      if (dNest < bestDist) {
        bestDist = dNest;
        bestKind = "nest";
      }

      if (bestDist <= tol) {
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
      });
    }
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
}
