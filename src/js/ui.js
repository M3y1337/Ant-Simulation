import { Config } from "./config.js";

let antCountInput = null;
let antCountValueLabel = null;
let antSpeedInput = null;
let antSpeedValueLabel = null;
let antSteeringStrengthInput = null;
let antSteeringStrengthValueLabel = null;
let antFoVInput = null;
let antFoVValueLabel = null;
let antWanderStrengthInput = null;
let antWanderStrengthValueLabel = null;
let antSightInput = null;
let antSightValueLabel = null;
let simulationSpeedInput = null;
let simulationSpeedValueLabel = null;
let pheromoneLifeInput = null;
let pheromoneLifeValueLabel = null;
let pheromoneLowScoreThresholdInput = null;
let pheromoneLowScoreThresholdValueLabel = null;
let pheromoneIgnoreProbabilityInput = null;
let pheromoneIgnoreProbabilityValueLabel = null;
let pheromoneDiffusionInput = null;
let pheromoneDiffusionStrengthInput = null;
let pheromoneDiffusionStrengthValueLabel = null;
let searchersFollowHomePheromonesInput = null;
let searcherHomePheromoneWeightInput = null;
let searcherHomePheromoneWeightValueLabel = null;
let foodRadiusInput = null;
let foodRadiusValueLabel = null;
let foodClusterCellSizeInput = null;
let foodClusterCellSizeValueLabel = null;
let pheromoneClusterCellSizeInput = null;
let pheromoneClusterCellSizeValueLabel = null;
let bgColorInput = null;
let showPheromonesInput = null;
let showObstaclesInput = null;
let showHUDInput = null;
let useRedPheromonesInput = null;
let useBluePheromonesInput = null;
let useClusteredFoodInput = null;
let showFoodCountsInput = null;
let debugSensorsInput = null;
let debugQuadTreeInput = null;
let debugAntStateInput = null;
let pauseButton = null;
let stepButton = null;
let resetButton = null;
let fpsValueLabel = null;
let uiPanel = null;
let hudHelp = null;

// options:
//  - getNest(): Nest | null
//  - getDebug(): { sensors: boolean; quadTree: boolean; antState: boolean }
//  - setDebug(key: "sensors" | "quadTree" | "antState", value: boolean): void
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
  antSteeringStrengthInput = document.getElementById("antSteeringStrength");
  antSteeringStrengthValueLabel = document.getElementById("antSteeringStrengthValue");
  antFoVInput = document.getElementById("antFoV");
  antFoVValueLabel = document.getElementById("antFoVValue");
  antWanderStrengthInput = document.getElementById("antWanderStrength");
  antWanderStrengthValueLabel = document.getElementById("antWanderStrengthValue");
  antSightInput = document.getElementById("antSight");
  antSightValueLabel = document.getElementById("antSightValue");
  simulationSpeedInput = document.getElementById("simulationSpeed");
  simulationSpeedValueLabel = document.getElementById("simulationSpeedValue");
  pheromoneLifeInput = document.getElementById("pheromoneLife");
  pheromoneLifeValueLabel = document.getElementById("pheromoneLifeValue");
  pheromoneLowScoreThresholdInput = document.getElementById("pheromoneLowScoreThreshold");
  pheromoneLowScoreThresholdValueLabel = document.getElementById("pheromoneLowScoreThresholdValue");
  pheromoneIgnoreProbabilityInput = document.getElementById("pheromoneIgnoreProbability");
  pheromoneIgnoreProbabilityValueLabel = document.getElementById("pheromoneIgnoreProbabilityValue");
  pheromoneDiffusionInput = document.getElementById("pheromoneDiffusion");
  pheromoneDiffusionStrengthInput = document.getElementById("pheromoneDiffusionStrength");
  pheromoneDiffusionStrengthValueLabel = document.getElementById("pheromoneDiffusionStrengthValue");
  searchersFollowHomePheromonesInput = document.getElementById("searchersFollowHomePheromones");
  searcherHomePheromoneWeightInput = document.getElementById("searcherHomePheromoneWeight");
  searcherHomePheromoneWeightValueLabel = document.getElementById("searcherHomePheromoneWeightValue");
  foodRadiusInput = document.getElementById("foodRadius");
  foodRadiusValueLabel = document.getElementById("foodRadiusValue");
  foodClusterCellSizeInput = document.getElementById("foodClusterCellSize");
  foodClusterCellSizeValueLabel = document.getElementById("foodClusterCellSizeValue");
  pheromoneClusterCellSizeInput = document.getElementById("pheromoneClusterCellSize");
  pheromoneClusterCellSizeValueLabel = document.getElementById("pheromoneClusterCellSizeValue");
  bgColorInput = document.getElementById("bgColor");
  showPheromonesInput = document.getElementById("showPheromones");
  const useClusteredPheromonesInput = document.getElementById("useClusteredPheromones");
  useRedPheromonesInput = document.getElementById("useRedPheromones");
  useBluePheromonesInput = document.getElementById("useBluePheromones");
  useClusteredFoodInput = document.getElementById("useClusteredFood");
  showFoodCountsInput = document.getElementById("showFoodCounts");
  showObstaclesInput = document.getElementById("showObstacles");
  showHUDInput = document.getElementById("showHUD");
  hudHelp = document.getElementById("hudHelp");
  debugSensorsInput = document.getElementById("debugSensors");
  debugQuadTreeInput = document.getElementById("debugQuadTree");
  debugAntStateInput = document.getElementById("debugAntState");
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

  if (antSteeringStrengthInput) {
    antSteeringStrengthInput.value = String(Config.antSteeringStrength);
    if (antSteeringStrengthValueLabel) antSteeringStrengthValueLabel.textContent = antSteeringStrengthInput.value;
    antSteeringStrengthInput.addEventListener("input", () => {
      const value = parseFloat(antSteeringStrengthInput.value);
      if (!Number.isNaN(value)) {
        Config.antSteeringStrength = value;
        if (antSteeringStrengthValueLabel) antSteeringStrengthValueLabel.textContent = antSteeringStrengthInput.value;
        const nest = getNest();
        if (nest) {
          for (const ant of nest.ants) ant.steeringStrength = Config.antSteeringStrength;
        }
      }
    });
  }

  if (antFoVInput) {
    antFoVInput.value = String(Config.antFoVDegrees);
    if (antFoVValueLabel) antFoVValueLabel.textContent = antFoVInput.value;
    antFoVInput.addEventListener("input", () => {
      const valueDeg = parseFloat(antFoVInput.value);
      if (!Number.isNaN(valueDeg)) {
        Config.antFoVDegrees = valueDeg;
        if (antFoVValueLabel) antFoVValueLabel.textContent = antFoVInput.value;
        const fovRad = (valueDeg * Math.PI) / 180;
        const nest = getNest();
        if (nest) {
          for (const ant of nest.ants) ant.FoV = fovRad;
        }
      }
    });
  }

  if (antWanderStrengthInput) {
    antWanderStrengthInput.value = String(Config.antWanderStrength);
    if (antWanderStrengthValueLabel) antWanderStrengthValueLabel.textContent = antWanderStrengthInput.value;
    antWanderStrengthInput.addEventListener("input", () => {
      const value = parseFloat(antWanderStrengthInput.value);
      if (!Number.isNaN(value)) {
        Config.antWanderStrength = value;
        if (antWanderStrengthValueLabel) antWanderStrengthValueLabel.textContent = antWanderStrengthInput.value;
        const nest = getNest();
        if (nest) {
          for (const ant of nest.ants) ant.wanderStrength = Config.antWanderStrength;
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

  if (simulationSpeedInput) {
    simulationSpeedInput.value = String(Config.simulationSpeed);
    if (simulationSpeedValueLabel) simulationSpeedValueLabel.textContent = simulationSpeedInput.value;
    simulationSpeedInput.addEventListener("input", () => {
      const value = parseFloat(simulationSpeedInput.value);
      if (!Number.isNaN(value)) {
        Config.simulationSpeed = value;
        if (simulationSpeedValueLabel) simulationSpeedValueLabel.textContent = simulationSpeedInput.value;
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

  if (pheromoneLowScoreThresholdInput) {
    pheromoneLowScoreThresholdInput.value = String(Config.pheromoneLowScoreThreshold);
    if (pheromoneLowScoreThresholdValueLabel) pheromoneLowScoreThresholdValueLabel.textContent = pheromoneLowScoreThresholdInput.value;
    pheromoneLowScoreThresholdInput.addEventListener("input", () => {
      const value = parseFloat(pheromoneLowScoreThresholdInput.value);
      if (!Number.isNaN(value)) {
        Config.pheromoneLowScoreThreshold = value;
        if (pheromoneLowScoreThresholdValueLabel) pheromoneLowScoreThresholdValueLabel.textContent = pheromoneLowScoreThresholdInput.value;
      }
    });
  }

  if (pheromoneIgnoreProbabilityInput) {
    pheromoneIgnoreProbabilityInput.value = String(Config.pheromoneIgnoreProbability);
    if (pheromoneIgnoreProbabilityValueLabel) pheromoneIgnoreProbabilityValueLabel.textContent = pheromoneIgnoreProbabilityInput.value;
    pheromoneIgnoreProbabilityInput.addEventListener("input", () => {
      const value = parseFloat(pheromoneIgnoreProbabilityInput.value);
      if (!Number.isNaN(value)) {
        Config.pheromoneIgnoreProbability = value;
        if (pheromoneIgnoreProbabilityValueLabel) pheromoneIgnoreProbabilityValueLabel.textContent = pheromoneIgnoreProbabilityInput.value;
      }
    });
  }

  if (pheromoneDiffusionInput) {
    pheromoneDiffusionInput.checked = Config.pheromoneDiffusionEnabled;
    pheromoneDiffusionInput.addEventListener("change", () => {
      Config.pheromoneDiffusionEnabled = pheromoneDiffusionInput.checked;
    });
  }

  if (pheromoneDiffusionStrengthInput) {
    pheromoneDiffusionStrengthInput.value = String(Config.pheromoneDiffusionStrength);
    if (pheromoneDiffusionStrengthValueLabel) pheromoneDiffusionStrengthValueLabel.textContent = pheromoneDiffusionStrengthInput.value;
    pheromoneDiffusionStrengthInput.addEventListener("input", () => {
      const value = parseFloat(pheromoneDiffusionStrengthInput.value);
      if (!Number.isNaN(value)) {
        Config.pheromoneDiffusionStrength = value;
        if (pheromoneDiffusionStrengthValueLabel) pheromoneDiffusionStrengthValueLabel.textContent = pheromoneDiffusionStrengthInput.value;
      }
    });
  }

  if (searchersFollowHomePheromonesInput) {
    searchersFollowHomePheromonesInput.checked = Config.searchersFollowHomePheromones;
    searchersFollowHomePheromonesInput.addEventListener("change", () => {
      Config.searchersFollowHomePheromones = searchersFollowHomePheromonesInput.checked;
    });
  }

  if (searcherHomePheromoneWeightInput) {
    searcherHomePheromoneWeightInput.value = String(Config.searcherHomePheromoneWeight);
    if (searcherHomePheromoneWeightValueLabel) searcherHomePheromoneWeightValueLabel.textContent = searcherHomePheromoneWeightInput.value;
    searcherHomePheromoneWeightInput.addEventListener("input", () => {
      const value = parseFloat(searcherHomePheromoneWeightInput.value);
      if (!Number.isNaN(value)) {
        Config.searcherHomePheromoneWeight = value;
        if (searcherHomePheromoneWeightValueLabel) searcherHomePheromoneWeightValueLabel.textContent = searcherHomePheromoneWeightInput.value;
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

  if (foodClusterCellSizeInput) {
    foodClusterCellSizeInput.value = String(Config.foodClusterCellSize);
    if (foodClusterCellSizeValueLabel) foodClusterCellSizeValueLabel.textContent = foodClusterCellSizeInput.value;
    foodClusterCellSizeInput.addEventListener("input", () => {
      const value = parseInt(foodClusterCellSizeInput.value, 10);
      if (!Number.isNaN(value)) {
        Config.foodClusterCellSize = value;
        if (foodClusterCellSizeValueLabel) foodClusterCellSizeValueLabel.textContent = foodClusterCellSizeInput.value;
      }
    });
  }

  if (pheromoneClusterCellSizeInput) {
    pheromoneClusterCellSizeInput.value = String(Config.pheromoneClusterCellSize);
    if (pheromoneClusterCellSizeValueLabel) pheromoneClusterCellSizeValueLabel.textContent = pheromoneClusterCellSizeInput.value;
    pheromoneClusterCellSizeInput.addEventListener("input", () => {
      const value = parseInt(pheromoneClusterCellSizeInput.value, 10);
      if (!Number.isNaN(value)) {
        Config.pheromoneClusterCellSize = value;
        if (pheromoneClusterCellSizeValueLabel) pheromoneClusterCellSizeValueLabel.textContent = pheromoneClusterCellSizeInput.value;
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

  if (useClusteredPheromonesInput) {
    useClusteredPheromonesInput.checked = Config.useClusteredPheromones;
    useClusteredPheromonesInput.addEventListener("change", () => {
      Config.useClusteredPheromones = useClusteredPheromonesInput.checked;
    });
  }

  if (useClusteredFoodInput) {
    useClusteredFoodInput.checked = Config.useClusteredFood;
    useClusteredFoodInput.addEventListener("change", () => {
      Config.useClusteredFood = useClusteredFoodInput.checked;
    });
  }

  if (showFoodCountsInput) {
    showFoodCountsInput.checked = Config.showFoodCounts;
    showFoodCountsInput.addEventListener("change", () => {
      Config.showFoodCounts = showFoodCountsInput.checked;
    });
  }

  if (useRedPheromonesInput) {
    useRedPheromonesInput.checked = Config.useRedPheromones;
    useRedPheromonesInput.addEventListener("change", () => {
      Config.useRedPheromones = useRedPheromonesInput.checked;
    });
  }

  if (useBluePheromonesInput) {
    useBluePheromonesInput.checked = Config.useBluePheromones;
    useBluePheromonesInput.addEventListener("change", () => {
      Config.useBluePheromones = useBluePheromonesInput.checked;
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
      if (hudHelp) hudHelp.style.display = Config.showHUD ? "block" : "none";
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
  if (debugAntStateInput) {
    debugAntStateInput.checked = !!debug.antState;
    debugAntStateInput.addEventListener("change", () => {
      setDebug("antState", debugAntStateInput.checked);
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
  if (debugAntStateInput) debugAntStateInput.checked = !!debug.antState;
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
  if (hudHelp) {
    hudHelp.style.display = Config.showHUD ? "block" : "none";
  }
}
