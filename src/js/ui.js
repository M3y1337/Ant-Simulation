import { Config } from "./config.js";

let antCountInput = null;
let antCountValueLabel = null;
let antSpeedInput = null;
let antSpeedValueLabel = null;
let antSightInput = null;
let antSightValueLabel = null;
let pheromoneLifeInput = null;
let pheromoneLifeValueLabel = null;
let foodRadiusInput = null;
let foodRadiusValueLabel = null;
let bgColorInput = null;
let showPheromonesInput = null;
let showObstaclesInput = null;
let showHUDInput = null;
let debugSensorsInput = null;
let debugQuadTreeInput = null;
let pauseButton = null;
let stepButton = null;
let resetButton = null;
let fpsValueLabel = null;
let uiPanel = null;

// options:
//  - getNest(): Nest | null
//  - getDebug(): { sensors: boolean; quadTree: boolean }
//  - setDebug(key: "sensors" | "quadTree", value: boolean): void
//  - getPaused(): boolean
//  - setPaused(value: boolean): void
//  - requestStep(): void
//  - resetSimulation(): void
export function setupUI(options) {
  const {
    getNest,
    getDebug,
    setDebug,
    getPaused,
    setPaused,
    requestStep,
    resetSimulation,
  } = options;

  uiPanel = document.getElementById("ui-panel");

  antCountInput = document.getElementById("antCount");
  antCountValueLabel = document.getElementById("antCountValue");
  antSpeedInput = document.getElementById("antSpeed");
  antSpeedValueLabel = document.getElementById("antSpeedValue");
  antSightInput = document.getElementById("antSight");
  antSightValueLabel = document.getElementById("antSightValue");
  pheromoneLifeInput = document.getElementById("pheromoneLife");
  pheromoneLifeValueLabel = document.getElementById("pheromoneLifeValue");
  foodRadiusInput = document.getElementById("foodRadius");
  foodRadiusValueLabel = document.getElementById("foodRadiusValue");
  bgColorInput = document.getElementById("bgColor");
  showPheromonesInput = document.getElementById("showPheromones");
  showObstaclesInput = document.getElementById("showObstacles");
  showHUDInput = document.getElementById("showHUD");
  debugSensorsInput = document.getElementById("debugSensors");
  debugQuadTreeInput = document.getElementById("debugQuadTree");
  pauseButton = document.getElementById("pauseButton");
  stepButton = document.getElementById("stepButton");
  resetButton = document.getElementById("resetButton");
  fpsValueLabel = document.getElementById("fpsValue");

  if (antCountInput) {
    antCountInput.value = String(Config.antCount);
    if (antCountValueLabel) antCountValueLabel.textContent = antCountInput.value;
    antCountInput.addEventListener("input", () => {
      const value = parseInt(antCountInput.value, 10);
      if (!Number.isNaN(value)) {
        Config.antCount = value;
        if (antCountValueLabel) antCountValueLabel.textContent = antCountInput.value;
      }
    });
  }

  if (antSpeedInput) {
    antSpeedInput.value = String(Config.antSpeed);
    if (antSpeedValueLabel) antSpeedValueLabel.textContent = antSpeedInput.value;
    antSpeedInput.addEventListener("input", () => {
      const value = parseInt(antSpeedInput.value, 10);
      if (!Number.isNaN(value)) {
        Config.antSpeed = value;
        if (antSpeedValueLabel) antSpeedValueLabel.textContent = antSpeedInput.value;
        const nest = getNest();
        if (nest) {
          for (const ant of nest.ants) ant.speed = Config.antSpeed;
        }
      }
    });
  }

  if (antSightInput) {
    antSightInput.value = String(Config.antSight);
    if (antSightValueLabel) antSightValueLabel.textContent = antSightInput.value;
    antSightInput.addEventListener("input", () => {
      const value = parseInt(antSightInput.value, 10);
      if (!Number.isNaN(value)) {
        Config.antSight = value;
        if (antSightValueLabel) antSightValueLabel.textContent = antSightInput.value;
        const nest = getNest();
        if (nest) {
          for (const ant of nest.ants) ant.sight = Config.antSight;
        }
      }
    });
  }

  if (pheromoneLifeInput) {
    pheromoneLifeInput.value = String(Config.pheromoneLife);
    if (pheromoneLifeValueLabel) pheromoneLifeValueLabel.textContent = pheromoneLifeInput.value;
    pheromoneLifeInput.addEventListener("input", () => {
      const value = parseInt(pheromoneLifeInput.value, 10);
      if (!Number.isNaN(value)) {
        Config.pheromoneLife = value;
        if (pheromoneLifeValueLabel) pheromoneLifeValueLabel.textContent = pheromoneLifeInput.value;
      }
    });
  }

  if (foodRadiusInput) {
    foodRadiusInput.value = String(Config.foodSpawnRadius);
    if (foodRadiusValueLabel) foodRadiusValueLabel.textContent = foodRadiusInput.value;
    foodRadiusInput.addEventListener("input", () => {
      const value = parseInt(foodRadiusInput.value, 10);
      if (!Number.isNaN(value)) {
        Config.foodSpawnRadius = value;
        if (foodRadiusValueLabel) foodRadiusValueLabel.textContent = foodRadiusInput.value;
      }
    });
  }

  if (bgColorInput) {
    bgColorInput.value = Config.backgroundColor;
    bgColorInput.addEventListener("input", () => {
      Config.backgroundColor = bgColorInput.value;
    });
  }

  if (showPheromonesInput) {
    showPheromonesInput.checked = Config.showPheromones;
    showPheromonesInput.addEventListener("change", () => {
      Config.showPheromones = showPheromonesInput.checked;
    });
  }

  if (showObstaclesInput) {
    showObstaclesInput.checked = Config.showObstacles;
    showObstaclesInput.addEventListener("change", () => {
      Config.showObstacles = showObstaclesInput.checked;
    });
  }

  if (showHUDInput) {
    showHUDInput.checked = Config.showHUD;
    showHUDInput.addEventListener("change", () => {
      Config.showHUD = showHUDInput.checked;
    });
  }

  const debug = getDebug();
  if (debugSensorsInput) {
    debugSensorsInput.checked = !!debug.sensors;
    debugSensorsInput.addEventListener("change", () => {
      setDebug("sensors", debugSensorsInput.checked);
    });
  }
  if (debugQuadTreeInput) {
    debugQuadTreeInput.checked = !!debug.quadTree;
    debugQuadTreeInput.addEventListener("change", () => {
      setDebug("quadTree", debugQuadTreeInput.checked);
    });
  }

  if (pauseButton) {
    pauseButton.addEventListener("click", () => {
      const next = !getPaused();
      setPaused(next);
    });
  }

  if (stepButton) {
    stepButton.addEventListener("click", () => {
      requestStep();
    });
  }

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      resetSimulation();
    });
  }
}

export function syncPauseUI(paused) {
  if (pauseButton) {
    pauseButton.textContent = paused ? "Resume" : "Pause";
  }
}

export function syncDebugUI(debug) {
  if (debugSensorsInput) debugSensorsInput.checked = !!debug.sensors;
  if (debugQuadTreeInput) debugQuadTreeInput.checked = !!debug.quadTree;
}

export function updateFPSUI(fps) {
  if (fpsValueLabel) {
    fpsValueLabel.textContent = fps.toFixed(1);
  }
}

export function setUIPanelVisible(visible) {
  if (!uiPanel) return;
  uiPanel.style.display = visible ? "block" : "none";
}

export function syncHUDUI() {
  if (showHUDInput) {
    showHUDInput.checked = !!Config.showHUD;
  }
}
