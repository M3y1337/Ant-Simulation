const width = window.innerWidth;
const height = window.innerHeight;
import { QuadTree, Rectangle } from "./quadtree.js";
const fullScreenRect = new Rectangle(width / 2, height / 2, width / 2, height / 2);
const OBSTACLE_CELL_SIZE = 64; // pixels

export const Global = {
    food: new QuadTree(fullScreenRect, 4),
    bluePheromones: new QuadTree(fullScreenRect, 4),
    redPheromones: new QuadTree(fullScreenRect, 4),
    tool: 0,
    isBeingDragged: false,
    // Each obstacle has endpoints and a pos (midpoint) for QuadTree indexing
    obstacles: [
        // Horizontal
        { x1: 0, y1: 0, x2: width, y2: 0, pos: { x: width / 2, y: 0 } },
        { x1: 0, y1: height, x2: width, y2: height, pos: { x: width / 2, y: height } },
        // Vertical
        { x1: 0, y1: 0, x2: 0, y2: height, pos: { x: 0, y: height / 2 } },
        { x1: width, y1: 0, x2: width, y2: height, pos: { x: width, y: height / 2 } },
    ],
    obstacleTree: new QuadTree(fullScreenRect, 4),
    // Spatial hash grid for obstacles: key "cx,cy" -> obstacle[]
    obstacleGrid: new Map(),
};

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
            let bucket = Global.obstacleGrid.get(key);
            if (!bucket) {
                bucket = [];
                Global.obstacleGrid.set(key, bucket);
            }
            bucket.push(obstacle);
        }
    }
}

export function rebuildObstacleGrid() {
    Global.obstacleGrid = new Map();
    for (const o of Global.obstacles) {
        indexObstacleInGrid(o);
    }
}

export function getObstaclesNearLine(x1, y1, x2, y2) {
    const cellSize = OBSTACLE_CELL_SIZE;
    if (!Global.obstacleGrid) return Global.obstacles;
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
            const bucket = Global.obstacleGrid.get(key);
            if (!bucket) continue;
            for (const o of bucket) {
                result.add(o);
            }
        }
    }
    return Array.from(result);
}

// Seed initial obstacles into the obstacleTree and grid
for (const o of Global.obstacles) {
    Global.obstacleTree.insert(o);
}
rebuildObstacleGrid();
