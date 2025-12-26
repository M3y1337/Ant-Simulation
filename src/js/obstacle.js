import { Global } from "./global.js";
import { Config } from "./config.js";

const OBSTACLE_CELL_SIZE = 64; // pixels
let obstacleGrid = new Map();

function indexObstacleInGrid(obstacle) {
  const cellSize = OBSTACLE_CELL_SIZE;
  const minX = Math.min(obstacle.x1, obstacle.x2);
  const maxX = Math.max(obstacle.x1, obstacle.x2);
  const minY = Math.min(obstacle.y1, obstacle.y2);
  const maxY = Math.max(obstacle.y1, obstacle.y2);
  const minCellX = Math.floor(minX / cellSize);
  const maxCellX = Math.floor(maxX / cellSize);
  const minCellY = Math.floor(minY / cellSize);
  const maxCellY = Math.floor(maxY / cellSize);

  for (let cx = minCellX; cx <= maxCellX; cx++) {
    for (let cy = minCellY; cy <= maxCellY; cy++) {
      const key = cx + "," + cy;
      let bucket = obstacleGrid.get(key);
      if (!bucket) {
        bucket = [];
        obstacleGrid.set(key, bucket);
      }
      bucket.push(obstacle);
    }
  }
}

export function rebuildObstacleGrid() {
  obstacleGrid = new Map();
  for (const o of Global.obstacles) {
    indexObstacleInGrid(o);
  }
}

export function getObstaclesNearLine(x1, y1, x2, y2) {
  const cellSize = OBSTACLE_CELL_SIZE;
  if (!obstacleGrid) return Global.obstacles;

  const minX = Math.min(x1, x2);
  const maxX = Math.max(x1, x2);
  const minY = Math.min(y1, y2);
  const maxY = Math.max(y1, y2);
  const minCellX = Math.floor(minX / cellSize);
  const maxCellX = Math.floor(maxX / cellSize);
  const minCellY = Math.floor(minY / cellSize);
  const maxCellY = Math.floor(maxY / cellSize);

  const result = new Set();
  for (let cx = minCellX; cx <= maxCellX; cx++) {
    for (let cy = minCellY; cy <= maxCellY; cy++) {
      const key = cx + "," + cy;
      const bucket = obstacleGrid.get(key);
      if (!bucket) continue;
      for (const o of bucket) {
        result.add(o);
      }
    }
  }
  return Array.from(result);
}

export function drawObstacles(p) {
  if (!Global.obstacles || Global.obstacles.length === 0) return;
  p.stroke(Config.obstacleColor || "#ffaf00");
  p.strokeWeight(5);
  for (const seg of Global.obstacles) {
    p.line(seg.x1, seg.y1, seg.x2, seg.y2);
  }
}
