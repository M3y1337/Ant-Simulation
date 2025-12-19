const width = window.innerWidth;
const height = window.innerHeight;
import { QuadTree, Rectangle } from "./quadtree.js";
const fullScreenRect = new Rectangle(width / 2, height / 2, width / 2, height / 2);

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
};

// Seed initial obstacles into the obstacleTree
for (const o of Global.obstacles) {
    Global.obstacleTree.insert(o);
}
