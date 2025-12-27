import { Global } from "./global.js";
import { Nest } from "./nest.js";
import { QuadTree, Rectangle } from "./quadtree.js";
import { Vector } from "./vector.js";
import { Config } from "./config.js";
import { setupUI, syncPauseUI, syncDebugUI, updateFPSUI, setUIPanelVisible, syncHUDUI, updatePalettePreview, updateStatusMessage } from "./ui.js";
import { renderClusteredPheromones, renderClusteredFood, renderPixelPheromones, renderPixelFood, renderPixelObstacles } from "./rendering.js";
import { rebuildObstacleGrid, drawObstacles } from "./obstacle.js";
import { Camera } from "./Camera.js";
import { Food } from "./food.js";
import { ImageMap, buildImageMap } from "./imagemap.js";
import { getColorPalette } from "./ColorHelpers.js";
// Simulation state
let nest;
let mousePos;
// Cached visible elements for rendering (computed each frame in update)
let visibleFood = [];
let visibleRedPheromones = [];
let visibleBluePheromones = [];
// Debug flags
const Debug = {
    sensors: false,
    quadTree: false,
    antState: false,
};
let isPaused = !Config.autoStartSimulation;
let hasStarted = Config.autoStartSimulation;
let pendingStep = false;
let uiVisible = true;
let camera = null;
let isPanning = false;
let lastPanMouseX = 0;
let lastPanMouseY = 0;
let simStepAccumulator = 0;
let mapImage = null;
let autoPausedForNoFood = false;
let imageMapLayer = null;
// Tracks whether the cached imageMapLayer was built with
// mapShowAllCells enabled or not, so we can rebuild when
// the config changes at runtime.
let imageMapLayerShowAllCells = null;

function isEventOnUI(event) {
    if (!event)
        return false;
    const uiPanelElement = document.getElementById("ui-panel");
    if (!uiPanelElement)
        return false;
    const target = event.target;
    if (!(target instanceof HTMLElement))
        return false;
    return uiPanelElement.contains(target);
}

// Keep reference to current p5 instance for UI callbacks
let currentP = null;

function rebuildImageMapLayer(p, worldWidth, worldHeight) {
    if (!(Config.useImageMap && ImageMap.cells && ImageMap.cells.length > 0)) {
        imageMapLayer = null;
        imageMapLayerShowAllCells = null;
        return;
    }
    imageMapLayer = p.createGraphics(worldWidth, worldHeight);
    imageMapLayerShowAllCells = !!Config.mapShowAllCells;
    if (imageMapLayer.pixelDensity) {
        imageMapLayer.pixelDensity(1);
    }
    imageMapLayer.noStroke();
    imageMapLayer.rectMode(imageMapLayer.CENTER);
    for (const cell of ImageMap.cells) {
        if (!Config.mapShowAllCells && cell.kind === "empty") continue;
        const c = cell.renderColor;
        imageMapLayer.fill(c.r, c.g, c.b);
        imageMapLayer.rect(cell.worldX, cell.worldY, ImageMap.cellWidth, ImageMap.cellHeight);
        cell.dirty = false;
    }
    ImageMap.dirtyIndices = [];
}

function flushDirtyImageMapCells() {
    if (!imageMapLayer || !ImageMap.dirtyIndices || ImageMap.dirtyIndices.length === 0) return;
    imageMapLayer.noStroke();
    imageMapLayer.rectMode(imageMapLayer.CENTER);
    for (const idx of ImageMap.dirtyIndices) {
        const cell = ImageMap.cells[idx];
        if (!cell) continue;
        const c = cell.renderColor;
        imageMapLayer.fill(c.r, c.g, c.b);
        imageMapLayer.rect(cell.worldX, cell.worldY, ImageMap.cellWidth, ImageMap.cellHeight);
        cell.dirty = false;
    }
    ImageMap.dirtyIndices = [];
}

function drawImageMapLayer(p) {
    if (!Config.useImageMap)
        return;
    if (!ImageMap.cells || ImageMap.cells.length === 0)
        return;
    // If the cached layer was built with a different
    // mapShowAllCells setting, rebuild it to match the
    // current configuration so that we either show all
    // cells or only the functional ones, as requested.
    if (imageMapLayer && imageMapLayerShowAllCells !== !!Config.mapShowAllCells) {
        const worldWidth = Config.simulationWidth || p.width;
        const worldHeight = Config.simulationHeight || p.height;
        rebuildImageMapLayer(p, worldWidth, worldHeight);
    }
    if (!imageMapLayer) {
        // Fallback: draw directly if layer has not been built yet.
        p.push();
        p.noStroke();
        p.rectMode(p.CENTER);
        for (const cell of ImageMap.cells) {
            if (!Config.mapShowAllCells && cell.kind === "empty")
                continue;
            const c = cell.renderColor;
            p.fill(c.r, c.g, c.b);
            p.rect(cell.worldX, cell.worldY, ImageMap.cellWidth, ImageMap.cellHeight);
        }
        p.pop();
        return;
    }
    flushDirtyImageMapCells();
    p.push();
    p.imageMode(p.CORNER);
    p.image(imageMapLayer, 0, 0);
    p.pop();
}
function drawPixelWorld(p) {
    // Image-map background layer (drawn in world space beneath everything).
    drawImageMapLayer(p);
    if (p.noSmooth) {
        // Prefer crisp scaling/blitting when available.
        p.noSmooth();
    }
    // Pheromones rendered as pixel-aligned cells.
    if (Config.showPheromones && ImageMap.cells && ImageMap.cells.length > 0) {
        renderPixelPheromones(p, visibleRedPheromones, visibleBluePheromones, ImageMap.cellWidth, ImageMap.cellHeight, ImageMap.cols, ImageMap.rows);
    }
    // Food rendered directly from image-map cell state for a crisp, grid-based look
    if (Config.useImageMap && !Config.mapFoodRenderCellsOnly && ImageMap.cells && ImageMap.cells.length > 0) {
        renderPixelFood(p, ImageMap, Config.foodColor);
    }
    // Obstacles: in pixel + cell-obstacle mode, draw obstacle cells as solid
    // blocks; otherwise fall back to line segment rendering.
    if (Config.showObstacles) {
        if (Config.useImageMap && Config.pixelUseCellObstacles && ImageMap.cells && ImageMap.cells.length > 0) {
            renderPixelObstacles(p, ImageMap, Config.obstacleColor);
            // Still draw border segments from Global.obstacles so world bounds remain visible.
            drawObstacles(p);
        }
        else {
            drawObstacles(p);
        }
    }
    // Ants
    for (let ant of nest.ants) {
        ant.draw(p);
    }
    // Nest
    if (!Config.useImageMap || Config.mapShowNestMarker) {
        nest.draw(p);
    }
    // Debug overlays (same as regular world rendering)
    if (Debug.quadTree) {
        drawQuadTreeBounds(p, Global.food, "rgba(0, 255, 0, 128)");
        drawQuadTreeBounds(p, Global.redPheromones, "rgba(253, 33, 8, 128)");
        drawQuadTreeBounds(p, Global.bluePheromones, "rgba(66, 135, 245, 128)");
    }
    if (Debug.sensors) {
        for (let ant of nest.ants) {
            if (ant.debugDrawSensors)
                ant.debugDrawSensors(p);
        }
    }
    if (Debug.antState) {
        for (let ant of nest.ants) {
            if (ant.debugDrawState)
                ant.debugDrawState(p);
        }
    }
}
function drawCurrentWorld(p) {
    if (Config.pixelMode) {
        drawPixelWorld(p);
    }
    else {
        drawWorld(p);
    }
}
function initSimulation(p) {
    if (Config.useImageMap && Config.mapUseImageSize && mapImage) {
        // Derive world size directly from the image dimensions when requested.
        Config.simulationWidth = mapImage.width;
        Config.simulationHeight = mapImage.height;
    }
    const worldWidth = Config.simulationWidth || p.width;
    const worldHeight = Config.simulationHeight || p.height;

    if (camera) {
        const lin = Config.camLiniency != null ? Config.camLiniency : 0;
        const marginX = worldWidth * lin;
        const marginY = worldHeight * lin;
        // Allow the camera center to move slightly beyond the simulation rectangle,
        // but clamp so the viewport never shows outside the margins.
        camera.setBounds(0 - marginX, 0 - marginY, worldWidth + marginX, worldHeight + marginY);
        camera.offset = { x: -worldWidth / 2, y: -worldHeight / 2 };
    }
    // Reset globals
    const fullFoodRect = new Rectangle(worldWidth / 2, worldHeight / 2, worldWidth / 2, worldHeight / 2);
    const fullPheromoneRect = new Rectangle(worldWidth / 2, worldHeight / 2, worldWidth / 2, worldHeight / 2);
    const capacity = Config.quadTreeCapacity || 4;
    Global.food = new QuadTree(fullFoodRect, capacity);
    Global.redPheromones = new QuadTree(fullPheromoneRect, capacity);
    Global.bluePheromones = new QuadTree(fullPheromoneRect, capacity);
    Global.tool = 0;
    Global.isBeingDragged = false;
    Global.obstacles = [
        // Horizontal borders
        { x1: 0, y1: 0, x2: worldWidth, y2: 0, pos: { x: worldWidth / 2, y: 0 } },
        { x1: 0, y1: worldHeight, x2: worldWidth, y2: worldHeight, pos: { x: worldWidth / 2, y: worldHeight } },
        // Vertical borders
        { x1: 0, y1: 0, x2: 0, y2: worldHeight, pos: { x: 0, y: worldHeight / 2 } },
        { x1: worldWidth, y1: 0, x2: worldWidth, y2: worldHeight, pos: { x: worldWidth, y: worldHeight / 2 } }
    ];

    const fullObstacleRect = new Rectangle(worldWidth / 2, worldHeight / 2, worldWidth / 2, worldHeight / 2);
    Global.obstacleTree = new QuadTree(fullObstacleRect, capacity);
    for (const o of Global.obstacles) {
        Global.obstacleTree.insert(o);
    }

    // If an image map is configured and loaded, build a discrete map of cells
    // and, unless pixel cell obstacles are enabled, add image-derived
    // obstacle line segments before rebuilding the obstacle grid.
    if (Config.useImageMap && mapImage) {
        buildImageMap(p, mapImage, worldWidth, worldHeight);
        rebuildImageMapLayer(p, worldWidth, worldHeight);
        // Palette preview is now generated manually via the UI button.
        if (ImageMap.cells && ImageMap.cells.length > 0) {
            const cols = ImageMap.cols;
            const rows = ImageMap.rows;
            const cellW = ImageMap.cellWidth;
            const cellH = ImageMap.cellHeight;

            // When pixel cell obstacles are enabled, we do not generate
            // interior obstacle line segments; the cells themselves act
            // as blockers. Otherwise, build merged obstacle edges as
            // before.
            if (!(Config.pixelMode && Config.pixelUseCellObstacles)) {
                const getKind = (col, row) => {
                    if (col < 0 || col >= cols || row < 0 || row >= rows)
                        return "empty";
                    const idx = row * cols + col;
                    const c = ImageMap.cells[idx];
                    return c ? c.kind : "empty";
                };

                // Horizontal edges (top and bottom), merged across columns
                for (let row = 0; row < rows; row++) {
                    // Top edges for this row
                    let runStartCol = null;
                    for (let col = 0; col <= cols; col++) {
                        const isEdgeCell = col < cols && getKind(col, row) === "obstacle" && getKind(col, row - 1) !== "obstacle";
                        if (isEdgeCell && runStartCol === null) {
                            runStartCol = col;
                        }
                        else if ((!isEdgeCell || col === cols) && runStartCol !== null) {
                            const startCol = runStartCol;
                            const endCol = col - 1;
                            const x1 = startCol * cellW;
                            const x2 = (endCol + 1) * cellW;
                            const y = row * cellH;
                            const obstacle = {
                                x1,
                                y1: y,
                                x2,
                                y2: y,
                                pos: { x: (x1 + x2) / 2, y },
                            };
                            Global.obstacles.push(obstacle);
                            Global.obstacleTree.insert(obstacle);
                            runStartCol = null;
                        }
                    }

                    // Bottom edges for this row
                    runStartCol = null;
                    for (let col = 0; col <= cols; col++) {
                        const isEdgeCell = col < cols && getKind(col, row) === "obstacle" && getKind(col, row + 1) !== "obstacle";
                        if (isEdgeCell && runStartCol === null) {
                            runStartCol = col;
                        }
                        else if ((!isEdgeCell || col === cols) && runStartCol !== null) {
                            const startCol = runStartCol;
                            const endCol = col - 1;
                            const x1 = startCol * cellW;
                            const x2 = (endCol + 1) * cellW;
                            const y = (row + 1) * cellH;
                            const obstacle = {
                                x1,
                                y1: y,
                                x2,
                                y2: y,
                                pos: { x: (x1 + x2) / 2, y },
                            };
                            Global.obstacles.push(obstacle);
                            Global.obstacleTree.insert(obstacle);
                            runStartCol = null;
                        }
                    }
                }

                // Vertical edges (left and right), merged across rows
                for (let col = 0; col < cols; col++) {
                    // Left edges for this column
                    let runStartRow = null;
                    for (let row = 0; row <= rows; row++) {
                        const isEdgeCell = row < rows && getKind(col, row) === "obstacle" && getKind(col - 1, row) !== "obstacle";
                        if (isEdgeCell && runStartRow === null) {
                            runStartRow = row;
                        }
                        else if ((!isEdgeCell || row === rows) && runStartRow !== null) {
                            const startRow = runStartRow;
                            const endRow = row - 1;
                            const x = col * cellW;
                            const y1 = startRow * cellH;
                            const y2 = (endRow + 1) * cellH;
                            const obstacle = {
                                x1: x,
                                y1,
                                x2: x,
                                y2,
                                pos: { x, y: (y1 + y2) / 2 },
                            };
                            Global.obstacles.push(obstacle);
                            Global.obstacleTree.insert(obstacle);
                            runStartRow = null;
                        }
                    }

                    // Right edges for this column
                    runStartRow = null;
                    for (let row = 0; row <= rows; row++) {
                        const isEdgeCell = row < rows && getKind(col, row) === "obstacle" && getKind(col + 1, row) !== "obstacle";
                        if (isEdgeCell && runStartRow === null) {
                            runStartRow = row;
                        }
                        else if ((!isEdgeCell || row === rows) && runStartRow !== null) {
                            const startRow = runStartRow;
                            const endRow = row - 1;
                            const x = (col + 1) * cellW;
                            const y1 = startRow * cellH;
                            const y2 = (endRow + 1) * cellH;
                            const obstacle = {
                                x1: x,
                                y1,
                                x2: x,
                                y2,
                                pos: { x, y: (y1 + y2) / 2 },
                            };
                            Global.obstacles.push(obstacle);
                            Global.obstacleTree.insert(obstacle);
                            runStartRow = null;
                        }
                    }
                }
            }
        }
    }
    rebuildObstacleGrid();
    // Reset local state
    const antCount = Config.antCount;
    // Determine nest position based on configuration and image map.
    const pickNestPosition = () => {
        // Simulation center fallback
        let x = worldWidth / 2;
        let y = worldHeight / 2;

        if (!(Config.useImageMap && ImageMap.cells && ImageMap.cells.length > 0)) {
            return { x, y };
        }

        const cells = ImageMap.cells;
        const nestCells = [];
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            if (cell.kind === "nest") {
                nestCells.push({ index: i, cell });
            }
        }

        if (nestCells.length === 0) {
            // No nest-colored cells; fall back to simulation center.
            return { x, y };
        }

        const mode = Config.nestPlacementMode != null ? Config.nestPlacementMode : 2;

        if (mode === 0) {
            // Simulation center (explicitly chosen).
            return { x, y };
        }

        if (mode === 3) {
            // Random nest cell
            const pick = nestCells[Math.floor(Math.random() * nestCells.length)];
            return { x: pick.cell.worldX, y: pick.cell.worldY };
        }

        // Helper: centroid of all nest cells.
        const centroidAll = () => {
            let sumX = 0;
            let sumY = 0;
            for (const entry of nestCells) {
                sumX += entry.cell.worldX;
                sumY += entry.cell.worldY;
            }
            const count = nestCells.length;
            return count > 0 ? { x: sumX / count, y: sumY / count } : { x, y };
        };

        if (mode === 1) {
            return centroidAll();
        }

        // Default / mode 2: center of largest connected blob of nest cells.
        const cols = ImageMap.cols;
        const rows = ImageMap.rows;
        const isNestIndex = new Array(cells.length).fill(false);
        for (const entry of nestCells) {
            isNestIndex[entry.index] = true;
        }
        const visited = new Array(cells.length).fill(false);

        let bestCount = 0;
        let bestSumX = 0;
        let bestSumY = 0;

        const neighbors = (idx) => {
            const list = [];
            const col = idx % cols;
            const row = Math.floor(idx / cols);
            const pushIfValid = (c, r) => {
                if (c < 0 || c >= cols || r < 0 || r >= rows) return;
                const ni = r * cols + c;
                if (isNestIndex[ni]) list.push(ni);
            };
            pushIfValid(col - 1, row);
            pushIfValid(col + 1, row);
            pushIfValid(col, row - 1);
            pushIfValid(col, row + 1);
            return list;
        };

        for (const entry of nestCells) {
            const startIdx = entry.index;
            if (visited[startIdx]) continue;
            let queue = [startIdx];
            visited[startIdx] = true;
            let count = 0;
            let sumBlobX = 0;
            let sumBlobY = 0;

            while (queue.length > 0) {
                const idx = queue.pop();
                const c = cells[idx];
                count++;
                sumBlobX += c.worldX;
                sumBlobY += c.worldY;
                for (const ni of neighbors(idx)) {
                    if (!visited[ni]) {
                        visited[ni] = true;
                        queue.push(ni);
                    }
                }
            }

            if (count > bestCount) {
                bestCount = count;
                bestSumX = sumBlobX;
                bestSumY = sumBlobY;
            }
        }

        if (bestCount > 0) {
            return { x: bestSumX / bestCount, y: bestSumY / bestCount };
        }

        // Fallback if something went wrong: centroid of all nest cells.
        return centroidAll();
    };

    const nestPos = pickNestPosition();

    // After choosing the logical nest position from image-map cells,
    // optionally collapse all "nest" cells down to a single functional
    // nest cell for rendering when mapShowAllCells is disabled. This way,
    // only the cell corresponding most closely to the actual nest position
    // remains of kind "nest" and is drawn when showing functional cells
    // only.
    if (Config.useImageMap && !Config.mapShowAllCells && ImageMap.cells && ImageMap.cells.length > 0) {
        const cells = ImageMap.cells;
        let bestIdx = null;
        let bestDistSq = Infinity;
        for (let i = 0; i < cells.length; i++) {
            const c = cells[i];
            if (c.kind !== "nest")
                continue;
            const dx = c.worldX - nestPos.x;
            const dy = c.worldY - nestPos.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < bestDistSq) {
                bestDistSq = d2;
                bestIdx = i;
            }
        }
        if (bestIdx != null) {
            for (let i = 0; i < cells.length; i++) {
                const c = cells[i];
                if (c.kind === "nest" && i !== bestIdx) {
                    c.kind = "empty";
                }
            }
            const worldWidthForLayer = Config.simulationWidth || p.width;
            const worldHeightForLayer = Config.simulationHeight || p.height;
            rebuildImageMapLayer(p, worldWidthForLayer, worldHeightForLayer);
        }
    }
    nest = new Nest(nestPos.x, nestPos.y, antCount);

    // Spawn food either from the image map (if enabled) or using the
    // original radial spawning pattern.
    if (Config.useImageMap && ImageMap.cells && ImageMap.cells.length > 0) {
        for (let index = 0; index < ImageMap.cells.length; index++) {
            const cell = ImageMap.cells[index];
            if (cell.kind !== "food" || cell.maxFoodUnits <= 0)
                continue;
            for (let i = 0; i < cell.maxFoodUnits; i++) {
                const food = new Food(cell.worldX, cell.worldY);
                food.mapCellIndex = index;
                Global.food.insert(food);
            }
        }
    }
    else {
        // Spawn food as in the original index.ts
        for (let i = 0; i < 3; i++) {
            nest.spawnFood(worldWidth / 4, worldHeight / 4, Config.foodSpawnRadius);
            nest.spawnFood(3 * worldWidth / 4, worldHeight / 4, Config.foodSpawnRadius);
            nest.spawnFood(worldWidth / 4, 3 * worldHeight / 4, Config.foodSpawnRadius);
            nest.spawnFood(3 * worldWidth / 4, 3 * worldHeight / 4, Config.foodSpawnRadius);
        }
    }
    // Pre-populate visibleFood for prestart visualization before any simulation steps run.
    const foodRect = new Rectangle(worldWidth / 2, worldHeight / 2, worldWidth / 2, worldHeight / 2);
    visibleFood = Global.food.query(foodRect, []);
    visibleRedPheromones = [];
    visibleBluePheromones = [];
    mousePos = new Vector(0, 0);
    autoPausedForNoFood = false;
    updateStatusMessage("");
}

function resetCameraView(p) {
    if (!camera)
        return;
    const worldWidth = Config.simulationWidth || p.width;
    const worldHeight = Config.simulationHeight || p.height;
    const lin = Config.camLiniency != null ? Config.camLiniency : 0;
    if (Config.useCamBounds) {
        const marginX = worldWidth * lin;
        const marginY = worldHeight * lin;
        camera.setBounds(0 - marginX, 0 - marginY, worldWidth + marginX, worldHeight + marginY);
    } else {
        camera.bounds = null;
    }
    camera.offset = { x: -worldWidth / 2, y: -worldHeight / 2 };
    camera.zoom = 1;
}
function updateSimulation(p) {
    const worldWidth = Config.simulationWidth || p.width;
    const worldHeight = Config.simulationHeight || p.height;
    // Pheromones: age and flag expired
    const pheromoneRect = new Rectangle(worldWidth / 2, worldHeight / 2, worldWidth / 2, worldHeight / 2);
    visibleRedPheromones = Global.redPheromones.query(pheromoneRect, []);
    visibleBluePheromones = Global.bluePheromones.query(pheromoneRect, []);
    for (let pool of [visibleRedPheromones, visibleBluePheromones]) {
        for (let i = pool.length - 1; i >= 0; i--) {
            const elem = pool[i];
            elem.value.life--;
            if (elem.value.life === 0)
                elem.flagged = true;
        }
    }
    // Food: cache visible set for rendering
    const foodRect = new Rectangle(worldWidth / 2, worldHeight / 2, worldWidth / 2, worldHeight / 2);
    visibleFood = Global.food.query(foodRect, []);
    const anyAntCarryingFood = nest.ants.some((ant) => ant.hasFood);
    if (visibleFood.length === 0 && !anyAntCarryingFood) {
        if (Config.pauseWhenNoFood && !autoPausedForNoFood) {
            isPaused = true;
            autoPausedForNoFood = true;
            updateStatusMessage("Simulation paused: all food returned to nest. Press Resume or add more food.");
            syncPauseUI(isPaused);
        }
    }
    else if (autoPausedForNoFood && (visibleFood.length > 0 || anyAntCarryingFood)) {
        autoPausedForNoFood = false;
        updateStatusMessage("");
    }
    // Ant behavior and movement
    for (let ant of nest.ants) {
        ant.steer();
        ant.move();
    }
}
function drawQuadTreeBounds(p, tree, strokeColor) {
    if (!tree)
        return;
    const boundary = tree.boundary;
    p.push();
    p.noFill();
    p.stroke(strokeColor);
    p.rectMode(p.CENTER);
    p.rect(boundary.x, boundary.y, boundary.w * 2, boundary.h * 2);
    p.pop();
    if (tree.divided) {
        if (tree.northwest)
            drawQuadTreeBounds(p, tree.northwest, strokeColor);
        if (tree.northeast)
            drawQuadTreeBounds(p, tree.northeast, strokeColor);
        if (tree.southwest)
            drawQuadTreeBounds(p, tree.southwest, strokeColor);
        if (tree.southeast)
            drawQuadTreeBounds(p, tree.southeast, strokeColor);
    }
}
function drawWorld(p) {
    // Image-map background layer (drawn in world space beneath everything).
    drawImageMapLayer(p);
    // Pheromones (optionally merged into nearby clusters)
    if (Config.showPheromones) {
        if (Config.useClusteredPheromones) {
            renderClusteredPheromones(p, visibleRedPheromones, visibleBluePheromones);
        }
        else {
            for (const elem of visibleRedPheromones) {
                elem.value.draw(p);
            }
            for (const elem of visibleBluePheromones) {
                elem.value.draw(p);
            }
        }
    }
    // Food (visually merged into nearby clusters)
    if (!Config.useImageMap || !Config.mapFoodRenderCellsOnly) {
        if (Config.useClusteredFood) {
            renderClusteredFood(p, visibleFood);
        }
        else { // TODO: this is redundant with food.js Food.draw()!
            // Fallback: draw individual food points when clustered mode is off.
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
            const defaults = { r: 0, g: 255, b: 0 };
            const rgb = hexToRgb(Config.foodColor, defaults);
            const radius = Config.foodRenderRadius != null ? Config.foodRenderRadius : 6;
            p.fill(rgb.r, rgb.g, rgb.b);
            for (const elem of visibleFood) {
                const food = elem.value;
                p.circle(food.pos.x, food.pos.y, radius);
            }
        }
    }
    // Obstacles
    if (Config.showObstacles) {
        drawObstacles(p);
    }
    // Ants
    for (let ant of nest.ants) {
        ant.draw(p);
    }
    // Nest
    if (!Config.useImageMap || Config.mapShowNestMarker) {
        nest.draw(p);
    }
    // Debug overlays
    if (Debug.quadTree) {
        drawQuadTreeBounds(p, Global.food, "rgba(0, 255, 0, 128)");
        drawQuadTreeBounds(p, Global.redPheromones, "rgba(253, 33, 8, 128)");
        drawQuadTreeBounds(p, Global.bluePheromones, "rgba(66, 135, 245, 128)");
    }
    if (Debug.sensors) {
        for (let ant of nest.ants) {
            if (ant.debugDrawSensors)
                ant.debugDrawSensors(p);
        }
    }
    if (Debug.antState) {
        for (let ant of nest.ants) {
            if (ant.debugDrawState)
                ant.debugDrawState(p);
        }
    }
}

function renderSimulation(p) {
    // Background
    p.background(Config.backgroundColor);
    if (camera) {
        camera.begin();
    }

    drawCurrentWorld(p);

    if (camera) {
        camera.end();
    }
    // Simple FPS readout when any debug is on (screen-space)
    const fps = p.frameRate();
    if (Debug.sensors || Debug.quadTree || Debug.antState) {
        p.fill(255);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(16);
        p.text(`FPS: ${fps.toFixed(1)}`, 10, 10);
    }
    // Always update FPS in the UI panel
    updateFPSUI(fps);
}

function exportWorldImage(p, filename = "ant-simulation-world") {
    const worldWidth = Config.simulationWidth || p.width;
    const worldHeight = Config.simulationHeight || p.height;

    const pg = p.createGraphics(worldWidth, worldHeight);
    // Use pixelDensity 1 to keep export size predictable and not tied to device DPI.
    if (pg.pixelDensity) {
        pg.pixelDensity(1);
    }
    pg.background(Config.backgroundColor);
    drawCurrentWorld(pg);
    p.saveCanvas(pg, filename, "png");
}
function setPrestartMode(active) {
    const body = document.body;
    if (!body)
        return;
    if (active) {
        body.classList.add("prestart");
    }
    else {
        body.classList.remove("prestart");
    }
}
const sketch = (p) => {
    const reloadResourcesAndReset = () => {
        if (!currentP) return;

        const doInit = () => {
            initSimulation(currentP);
        };

        if (Config.useImageMap && Config.mapImagePath) {
            currentP.loadImage(Config.mapImagePath, (img) => {
                mapImage = img;
                doInit();
            }, () => {
                console.warn("Failed to load map image from", Config.mapImagePath);
                mapImage = null;
                doInit();
            });
        } else {
            mapImage = null;
            doInit();
        }
    };
    p.preload = () => {
        if (Config.useImageMap && Config.mapImagePath) {
            mapImage = p.loadImage(Config.mapImagePath);
        }
    };
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        currentP = p;
        camera = new Camera(p);
        resetCameraView(p);

        setupUI({
            getNest: () => nest,
            getDebug: () => Debug,
            setDebug: (key, value) => {
                Debug[key] = value;
                syncDebugUI(Debug);
            },
            getPaused: () => isPaused,
            setPaused: (value) => {
                isPaused = value;
                syncPauseUI(isPaused);
            },
            requestStep: () => {
                isPaused = true;
                pendingStep = true;
                syncPauseUI(isPaused);
            },
            resetSimulation: () => {
                reloadResourcesAndReset();
            },
            exportWorld: () => {
                exportWorldImage(p);
            },
            startSimulation: () => {
                hasStarted = true;
                isPaused = false;
                setPrestartMode(false);
                syncPauseUI(isPaused);
            },
            resetCamera: () => {
                resetCameraView(p);
            },
            generatePalette: () => {
                if (!Config.useImageMap || !mapImage) {
                    updatePalettePreview([]);
                    return;
                }
                try {
                    const paletteMinDist = Config.mapPaletteMinDistance != null
                        ? Config.mapPaletteMinDistance
                        : (Config.mapColorTolerance != null ? Config.mapColorTolerance : 60);
                    const palette = getColorPalette(mapImage, Config.mapSampleDepth, Config.mapSampleStep || 4, paletteMinDist, Config.colorDistanceMethod, false);
                    updatePalettePreview(palette);
                } catch (e) {
                    console.warn("Failed to compute image palette:", e);
                    updatePalettePreview([]);
                }
            },
        });
        initSimulation(p);

        if (Config.autoStartSimulation) {
            hasStarted = true;
            isPaused = false;
            setPrestartMode(false);
        } else {
            hasStarted = false;
            isPaused = true;
            setPrestartMode(true);
        }
        syncPauseUI(isPaused);
    };
    p.draw = () => {
        if (pendingStep) {
            // Single-step ignores simulationSpeed and just advances once.
            updateSimulation(p);
            pendingStep = false;
        }
        else if (!isPaused) {
            const speed = Config.simulationSpeed || 1.0;
            simStepAccumulator += speed;
            while (simStepAccumulator >= 1.0) {
                updateSimulation(p);
                simStepAccumulator -= 1.0;
            }
        }
        renderSimulation(p);
    };
    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        //initSimulation(p);
    };
    p.keyPressed = () => {
        if (p.key === "f" || p.key === "F")
            Global.tool = 0;
        else if (p.key === "o" || p.key === "O")
            Global.tool = 1;
        else if (p.key === "r" || p.key === "R")
            initSimulation(p);
        else if (p.key === "p" || p.key === "P") {
            isPaused = !isPaused;
            syncPauseUI(isPaused);
        }
        else if (p.key === "s" || p.key === "S") {
            // Save current canvas as PNG
            p.saveCanvas("ant-simulation_"+p.frameCount, "png"); // Appending frame count for uniqueness. Maybe replace with timestamp?
        }
        else if (p.key === "e" || p.key === "E") {
            // Export full simulation world as PNG (world-sized image)
            exportWorldImage(p);
        }
        else if (p.key === "d" || p.key === "D")
            Debug.sensors = !Debug.sensors;
        else if (p.key === "q" || p.key === "Q")
            Debug.quadTree = !Debug.quadTree;
        else if (p.key === "a" || p.key === "A")
            Debug.antState = !Debug.antState;
        else if (p.key === "u" || p.key === "U") {
            uiVisible = !uiVisible;
            setUIPanelVisible(uiVisible);
        }
        else if (p.key === "h" || p.key === "H") {
            Config.showHUD = !Config.showHUD;
            syncHUDUI();
        }
        syncDebugUI(Debug);
    };
    p.mouseMoved = () => {
        if (!mousePos) {
            return;
        }
        mousePos.x = p.mouseX;
        mousePos.y = p.mouseY;
    };
    p.mousePressed = (event) => {
        if (isEventOnUI(event)) {
            return;
        }
        if (event.button === 1) {
            // Middle mouse: start panning
            isPanning = true;
            lastPanMouseX = p.mouseX;
            lastPanMouseY = p.mouseY;
            return;
        }
        // Left mouse: interact with simulation in world space
        const world = camera ? camera.screenToWorld(p.mouseX, p.mouseY) : { x: p.mouseX, y: p.mouseY };
        if (Global.tool === 0) {
            if (Config.useImageMap && Config.mapFoodPlacementCellsOnly && ImageMap.cells && ImageMap.cells.length > 0) {
                // Place food only on food-designated grid cells, but
                // interpret the user's click as a cluster centered at
                // the clicked position. All food is snapped to nearby
                // valid cells so that positions conform to the grid.
                const radius = Config.foodSpawnRadius != null ? Config.foodSpawnRadius : 50;
                const radiusSq = radius * radius;

                const candidateIndices = [];
                for (let i = 0; i < ImageMap.cells.length; i++) {
                    const cell = ImageMap.cells[i];
                    if (cell.kind !== "food") continue;
                    const dx = cell.worldX - world.x;
                    const dy = cell.worldY - world.y;
                    const d2 = dx * dx + dy * dy;
                    if (d2 <= radiusSq) {
                        candidateIndices.push(i);
                    }
                }

                if (candidateIndices.length > 0) {
                    // Spawn one food unit at each qualifying food cell.
                    for (const idx of candidateIndices) {
                        const cell = ImageMap.cells[idx];
                        const food = new Food(cell.worldX, cell.worldY);
                        food.mapCellIndex = idx;
                        Global.food.insert(food);
                    }
                } else {
                    // Fallback: no food cells within the radius; snap to
                    // the nearest food cell so clicks far from the grid
                    // still produce usable food.
                    let bestIdx = -1;
                    let bestDistSq = Infinity;
                    for (let i = 0; i < ImageMap.cells.length; i++) {
                        const cell = ImageMap.cells[i];
                        if (cell.kind !== "food") continue;
                        const dx = cell.worldX - world.x;
                        const dy = cell.worldY - world.y;
                        const d2 = dx * dx + dy * dy;
                        if (d2 < bestDistSq) {
                            bestDistSq = d2;
                            bestIdx = i;
                        }
                    }
                    if (bestIdx >= 0) {
                        const cell = ImageMap.cells[bestIdx];
                        const food = new Food(cell.worldX, cell.worldY);
                        food.mapCellIndex = bestIdx;
                        Global.food.insert(food);
                    }
                }
            }
            else {
                nest.spawnFood(world.x, world.y, Config.foodSpawnRadius);
            }
        }
        else {
            Global.isBeingDragged = true;
            mousePos.x = world.x;
            mousePos.y = world.y;
            const obstacle = {
                x1: world.x, y1: world.y,
                x2: world.x, y2: world.y,
                pos: { x: world.x, y: world.y },
            };
            Global.obstacles.push(obstacle);
            if (Global.obstacleTree)
                Global.obstacleTree.insert(obstacle);
        }
    };
    p.mouseDragged = (event) => {
        if (isPanning && camera) {
            const dx = p.mouseX - lastPanMouseX;
            const dy = p.mouseY - lastPanMouseY;
            camera.pan(dx, dy, Config.useCamBounds);
            lastPanMouseX = p.mouseX;
            lastPanMouseY = p.mouseY;
            return;
        }
        if (Global.isBeingDragged && Global.obstacles.length > 0) {
            const last = Global.obstacles[Global.obstacles.length - 1];
            const world = camera ? camera.screenToWorld(p.mouseX, p.mouseY) : { x: p.mouseX, y: p.mouseY };
            last.x2 = world.x;
            last.y2 = world.y;
            last.pos = { x: (last.x1 + last.x2) / 2, y: (last.y1 + last.y2) / 2 };
        }
    };
    p.mouseReleased = () => {
        isPanning = false;
        if (Global.isBeingDragged) {
            Global.isBeingDragged = false;
            rebuildObstacleGrid();
        }
        else {
            Global.isBeingDragged = false;
        }
    };
    p.mouseWheel = (event) => {
        if (isEventOnUI(event)) {
            return;
        }
        if (camera) {
            camera.zoomAt(event.delta, p.mouseX, p.mouseY);
        }
        // Prevent page scroll
        return false;
    };
};

function startSketch() {
    new p5(sketch);
}

// Auto-load external config (and thus any map/image paths it defines) before starting the sketch.
if (Config.configPath && typeof fetch === "function") {
    fetch(Config.configPath)
        .then((resp) => {
        if (!resp.ok)
            throw new Error(`Failed to load config from ${Config.configPath}: ${resp.status}`);
        return resp.json();
    })
        .then((parsed) => {
        if (parsed && typeof parsed === "object") {
            for (const key of Object.keys(parsed)) {
                if (Object.prototype.hasOwnProperty.call(Config, key)) {
                    Config[key] = parsed[key];
                }
            }
        }
        startSketch();
    })
        .catch((err) => {
        console.warn("Failed to auto-load configPath JSON:", err);
        startSketch();
    });
}
else {
    startSketch();
}
