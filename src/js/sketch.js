import { Global } from "./global.js";
import { Nest } from "./nest.js";
import { QuadTree, Rectangle } from "./quadtree.js";
import { Vector } from "./vector.js";
import { Config } from "./config.js";
import { setupUI, syncPauseUI, syncDebugUI, updateFPSUI, setUIPanelVisible, syncHUDUI } from "./ui.js";
import { renderClusteredPheromones, renderClusteredFood } from "./rendering.js";
import { rebuildObstacleGrid, drawObstacles } from "./obstacle.js";
import { Camera } from "./Camera.js";
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
let isPaused = false;
let pendingStep = false;
let uiVisible = true;
let camera = null;
let isPanning = false;
let lastPanMouseX = 0;
let lastPanMouseY = 0;
let simStepAccumulator = 0;

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
    const worldWidth = Config.simulationWidth || p.width;
    const worldHeight = Config.simulationHeight || p.height;
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
    rebuildObstacleGrid();
    // Reset local state
    const antCount = Config.antCount;
    nest = new Nest(worldWidth / 2, worldHeight / 2, antCount);
    // Spawn food as in the original index.ts
    for (let i = 0; i < 3; i++) {
        nest.spawnFood(worldWidth / 4, worldHeight / 4, Config.foodSpawnRadius);
        nest.spawnFood(3 * worldWidth / 4, worldHeight / 4, Config.foodSpawnRadius);
        nest.spawnFood(worldWidth / 4, 3 * worldHeight / 4, Config.foodSpawnRadius);
        nest.spawnFood(3 * worldWidth / 4, 3 * worldHeight / 4, Config.foodSpawnRadius);
    }
    mousePos = new Vector(0, 0);
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
    if (camera) {
        camera.begin();
    }
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
    if (Config.useClusteredFood) {
        renderClusteredFood(p, visibleFood);
    }
    else {
        // Fallback: draw individual food points when clustered mode is off.
        p.noStroke();
        p.fill(0, 255, 0);
        for (const elem of visibleFood) {
            const food = elem.value;
            p.circle(food.pos.x, food.pos.y, 4);
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
    nest.draw(p);
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
const sketch = (p) => {
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        currentP = p;
        camera = new Camera(p);
        const mult = 1 + Config.camLiniency;
        camera.setBounds(-Config.simulationWidth*mult, -Config.simulationHeight*mult, Config.simulationWidth/2*mult, Config.simulationHeight/2*mult);
        camera.offset ={x: -Config.simulationWidth / 2, y: -Config.simulationHeight / 2};
        // need to set these point-mirrored for some reason

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
        if (!mousePos)
            return;
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
            nest.spawnFood(world.x, world.y, Config.foodSpawnRadius);
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
            camera.pan(dx, dy);
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
new p5(sketch);
