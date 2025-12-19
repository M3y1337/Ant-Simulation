import { Global, rebuildObstacleGrid } from "./global.js";
import { Nest } from "./nest.js";
import { QuadTree, Rectangle } from "./quadtree.js";
import { Vector } from "./vector.js";
import { Config } from "./config.js";
import { setupUI, syncPauseUI, syncDebugUI, updateFPSUI, setUIPanelVisible, syncHUDUI } from "./ui.js";
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
    quadTree: false
};
let isPaused = false;
let pendingStep = false;
let uiVisible = true;

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
function initSimulation(p) {
    const width = p.width;
    const height = p.height;
    // Reset globals
    const fullFoodRect = new Rectangle(width / 2, height / 2, width / 2, height / 2);
    const fullPheromoneRect = new Rectangle(width / 2, height / 2, width / 2, height / 2);
    Global.food = new QuadTree(fullFoodRect, 4);
    Global.redPheromones = new QuadTree(fullPheromoneRect, 4);
    Global.bluePheromones = new QuadTree(fullPheromoneRect, 4);
    Global.tool = 0;
    Global.isBeingDragged = false;
    Global.obstacles = [
        // Horizontal borders
        { x1: 0, y1: 0, x2: width, y2: 0, pos: { x: width / 2, y: 0 } },
        { x1: 0, y1: height, x2: width, y2: height, pos: { x: width / 2, y: height } },
        // Vertical borders
        { x1: 0, y1: 0, x2: 0, y2: height, pos: { x: 0, y: height / 2 } },
        { x1: width, y1: 0, x2: width, y2: height, pos: { x: width, y: height / 2 } }
    ];

    const fullObstacleRect = new Rectangle(width / 2, height / 2, width / 2, height / 2);
    Global.obstacleTree = new QuadTree(fullObstacleRect, 4);
    for (const o of Global.obstacles) {
        Global.obstacleTree.insert(o);
    }
    rebuildObstacleGrid();
    // Reset local state
    const antCount = Config.antCount;
    nest = new Nest(width / 2, height / 2, antCount);
    // Spawn food as in the original index.ts
    for (let i = 0; i < 3; i++) {
        nest.spawnFood(width / 4, height / 4, Config.foodSpawnRadius);
        nest.spawnFood(3 * width / 4, height / 4, Config.foodSpawnRadius);
        nest.spawnFood(width / 4, 3 * height / 4, Config.foodSpawnRadius);
        nest.spawnFood(3 * width / 4, 3 * height / 4, Config.foodSpawnRadius);
    }
    mousePos = new Vector(0, 0);
}
function updateSimulation(p) {
    const width = p.width;
    const height = p.height;
    // Pheromones: age and flag expired
    const pheromoneRect = new Rectangle(width / 2, height / 2, width / 2, height / 2);
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
    const foodRect = new Rectangle(width / 2, height / 2, width / 2, height / 2);
    visibleFood = Global.food.query(foodRect, []);
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
function renderSimulation(p) {
    // Background
    p.background(Config.backgroundColor);
    // Pheromones (visually merged into nearby clusters)
    if (Config.showPheromones) {
        const cellSize = 8; // pixels
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

        p.noStroke();
        const drawPheroBuckets = (map, r, g, b) => {
            for (const bucket of map.values()) {
                const x = bucket.xSum / bucket.count;
                const y = bucket.ySum / bucket.count;
                const avgIntensity = bucket.intensitySum / bucket.count;
                const alpha = Math.min(255, avgIntensity * 255 * Math.min(3, bucket.count));
                if (alpha < 5) continue; // too faint to matter
                const radius = 3 + Math.min(5, Math.sqrt(bucket.count));
                p.fill(r, g, b, alpha);
                p.circle(x, y, radius * 2);
            }
        };
        drawPheroBuckets(redCells, 253, 33, 8);
        drawPheroBuckets(blueCells, 66, 135, 245);
    }
    // Food (visually merged into nearby clusters)
    {
        const cellSize = 8; // pixels
        const foodCells = new Map();
        for (let elem of visibleFood) {
            const food = elem.value;
            const cx = Math.floor(food.pos.x / cellSize);
            const cy = Math.floor(food.pos.y / cellSize);
            const key = cx + "," + cy;
            let bucket = foodCells.get(key);
            if (!bucket) {
                bucket = { xSum: 0, ySum: 0, count: 0 };
                foodCells.set(key, bucket);
            }
            bucket.xSum += food.pos.x;
            bucket.ySum += food.pos.y;
            bucket.count += 1;
        }
        p.noStroke();
        p.fill(0, 255, 0);
        for (const bucket of foodCells.values()) {
            const x = bucket.xSum / bucket.count;
            const y = bucket.ySum / bucket.count;
            const radius = 3 + Math.min(7, Math.sqrt(bucket.count));
            p.circle(x, y, radius * 2);
        }
    }
    // Obstacles
    if (Config.showObstacles) {
        p.stroke("#ffaf00");
        p.strokeWeight(5);
        for (let seg of Global.obstacles) {
            p.line(seg.x1, seg.y1, seg.x2, seg.y2);
        }
    }
    // Ants
    for (let ant of nest.ants) {
        ant.draw(p);
    }
    // Nest
    nest.draw(p);
    // HUD instructions
    if (Config.showHUD) {
        p.fill(255);
        p.textAlign(p.RIGHT, p.CENTER);
        p.textSize(16);
        p.text("F - Food, O - Obstacles", p.width - 15, p.height - 24);
        p.text("R - Reset, P - Pause/Resume", p.width - 15, p.height - 44);
        p.text("D - Sensors, Q - QuadTree", p.width - 15, p.height - 64);
        p.text("U - Toggle UI, H - Toggle HUD", p.width - 15, p.height - 84);
        p.text("S - Save PNG", p.width - 15, p.height - 104);
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
    // Simple FPS readout when any debug is on
    const fps = p.frameRate();
    if (Debug.sensors || Debug.quadTree) {
        p.fill(255);
        p.textAlign(p.LEFT, p.TOP);
        p.textSize(16);
        p.text(`FPS: ${fps.toFixed(1)}`, 10, 10);
    }
    // Always update FPS in the UI panel
    updateFPSUI(fps);
}
const sketch = (p) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        currentP = p;
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
                if (currentP) initSimulation(currentP);
            },
        });
        initSimulation(p);
    };
    p.draw = () => {
        if (pendingStep) {
            updateSimulation(p);
            pendingStep = false;
        }
        else if (!isPaused) {
            updateSimulation(p);
        }
        renderSimulation(p);
    };
    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        initSimulation(p);
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
            p.saveCanvas("ant-simulation", "png");
        }
        else if (p.key === "d" || p.key === "D")
            Debug.sensors = !Debug.sensors;
        else if (p.key === "q" || p.key === "Q")
            Debug.quadTree = !Debug.quadTree;
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
        if (!mousePos)
            return;
        mousePos.x = p.mouseX;
        mousePos.y = p.mouseY;
    };
    p.mousePressed = (event) => {
        if (isEventOnUI(event)) {
            return;
        }
        if (Global.tool === 0) {
            nest.spawnFood(p.mouseX, p.mouseY, Config.foodSpawnRadius);
        }
        else {
            Global.isBeingDragged = true;
            mousePos.x = p.mouseX;
            mousePos.y = p.mouseY;
            const obstacle = {
                x1: p.mouseX, y1: p.mouseY,
                x2: p.mouseX, y2: p.mouseY,
                pos: { x: p.mouseX, y: p.mouseY },
            };
            Global.obstacles.push(obstacle);
            if (Global.obstacleTree) Global.obstacleTree.insert(obstacle);
        }
    };
    p.mouseDragged = () => {
        if (Global.isBeingDragged && Global.obstacles.length > 0) {
            const last = Global.obstacles[Global.obstacles.length - 1];
            last.x2 = p.mouseX;
            last.y2 = p.mouseY;
            last.pos = { x: (last.x1 + last.x2) / 2, y: (last.y1 + last.y2) / 2 };
        }
    };
    p.mouseReleased = () => {
        if (Global.isBeingDragged) {
            Global.isBeingDragged = false;
            rebuildObstacleGrid();
        } else {
            Global.isBeingDragged = false;
        }
    };
};
new p5(sketch);
