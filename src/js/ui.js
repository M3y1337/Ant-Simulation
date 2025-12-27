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
let antHeadingQuantizationSelect = null;
let antSightInput = null;
let antSightValueLabel = null;
let simulationSpeedInput = null;
let simulationSpeedValueLabel = null;
let simWidthInput = null;
let simHeightInput = null;
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
let useImageMapInput = null;
let mapUseImageSizeInput = null;
let mapImagePathInput = null;
let mapImageFileInput = null;
let mapImageChooseButton = null;
let mapSampleStepInput = null;
let mapShowAllCellsInput = null;
let nestPlacementModeSelect = null;
let mapShowNestMarkerInput = null;
let mapNestUseCellSizeInput = null;
let mapNestCellSizeScaleInput = null;
let mapFoodColorInput = null;
let mapObstacleColorInput = null;
let mapNestColorInput = null;
let mapFoodDepletedColorInput = null;
let mapColorToleranceInput = null;
let mapColorToleranceValueLabel = null;
let mapPaletteMinDistanceInput = null;
let mapPaletteMinDistanceValueLabel = null;
let mapFoodColorToleranceInput = null;
let mapObstacleColorToleranceInput = null;
let mapNestColorToleranceInput = null;
let generatePaletteButton = null;
let applyMorphologyButton = null;
let mapObstacleDilateIterationsInput = null;
let mapObstacleErodeIterationsInput = null;
let mapFoodDilateIterationsInput = null;
let mapFoodErodeIterationsInput = null;
let mapNestDilateIterationsInput = null;
let mapNestErodeIterationsInput = null;
let mapFoodRenderCellsOnlyInput = null;
let mapFoodPlacementCellsOnlyInput = null;
let pixelNestAsCellInput = null;
let showNestFoodCountInput = null;
let colorDistanceMethodSelect = null;
let palettePreviewContainer = null;
let autoAssignPaletteButton = null;
let applyPaletteRolesButton = null;
let configPathInput = null;
let loadConfigButton = null;
let saveConfigButton = null;
let configFileInput = null;
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
let exportWorldButton = null;
let startButton = null;
let resetCameraButton = null;
let fpsValueLabel = null;
let uiPanel = null;
let hudHelp = null;
let useClusteredPheromonesInput = null;
let antColorInput = null;
let antSizeInput = null;
let antWidthInput = null;
let redPheromoneColorInput = null;
let bluePheromoneColorInput = null;
let foodColorInput = null;
let obstacleColorInput = null;
let nestColorInput = null;
let nestTextColorInput = null;
let autoStartSimulationInput = null;
let pauseWhenNoFoodInput = null;
let statusMessageLabel = null;
let paletteColors = [];
let paletteRoles = [];

// Advanced / prestart-only controls for Config options
let antPheromoneFrequencyInput = null;
let obstacleAvoidanceRandomnessInput = null;
let obstacleAvoidStrengthInput = null;
let wanderSpeedFactorInput = null;
let trailSpeedFactorInput = null;
let headedToFoodSpeedFactorInput = null;
let headedHomeSpeedFactorInput = null;
let obstacleSideSpeedFactorInput = null;
let obstacleFrontSpeedFactorInput = null;
let collisionTurnMinDegreesInput = null;
let collisionTurnMaxDegreesInput = null;
let collisionPauseFramesInput = null;
let boundaryNudgeDistanceInput = null;
let foodPickupPauseFramesInput = null;
let foodDropPauseFramesInput = null;
let postPauseEaseFramesInput = null;
let postPauseMinSpeedFactorInput = null;

let useCamBoundsInput = null;
let camLiniencyInput = null;
let quadTreeCapacityInput = null;

let redPheromoneLifeInput = null;
let bluePheromoneLifeInput = null;
let redPheromoneDiffusionEnabledInput = null;
let redPheromoneDiffusionStrengthInput = null;
let bluePheromoneDiffusionEnabledInput = null;
let bluePheromoneDiffusionStrengthInput = null;

let mapSampleDepthInput = null;
let mapFoodUnitsPerCellInput = null;

let foodClusterColorInput = null;
let foodClusterTextColorInput = null;
let obstacleLineWidthInput = null;
let obstacleQueryMethodSelect = null;
let pheromoneMaxRadiusInput = null;
let pheromoneMaxIntensityInput = null;
let skipPheromoneOnCollisionPauseInput = null;
let pixelModeInput = null;
let pixelUseCellObstaclesInput = null;

// options:
//  - getNest(): Nest | null
//  - getDebug(): { sensors: boolean; quadTree: boolean; antState: boolean }
//  - setDebug(key: "sensors" | "quadTree" | "antState", value: boolean): void
//  - getPaused(): boolean
//  - setPaused(value: boolean): void
//  - requestStep(): void
//  - resetSimulation(): void
//  - exportWorld(): void
//  - startSimulation(): void
//  - resetCamera(): void
//  - generatePalette(): void
export function setupUI(options) {
  const {
    getNest,
    getDebug,
    setDebug,
    getPaused,
    setPaused,
    requestStep,
    resetSimulation,
    exportWorld,
    startSimulation,
    resetCamera,
    generatePalette,
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
  antHeadingQuantizationSelect = document.getElementById("antHeadingQuantizationDirections");
  antSightInput = document.getElementById("antSight");
  antSightValueLabel = document.getElementById("antSightValue");
  simulationSpeedInput = document.getElementById("simulationSpeed");
  simulationSpeedValueLabel = document.getElementById("simulationSpeedValue");
  simWidthInput = document.getElementById("simWidth");
  simHeightInput = document.getElementById("simHeight");
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
  useImageMapInput = document.getElementById("useImageMap");
  mapUseImageSizeInput = document.getElementById("mapUseImageSize");
  mapImagePathInput = document.getElementById("mapImagePath");
  mapImageFileInput = document.getElementById("mapImageFileInput");
  mapImageChooseButton = document.getElementById("mapImageChooseButton");
  mapSampleStepInput = document.getElementById("mapSampleStep");
  mapShowAllCellsInput = document.getElementById("mapShowAllCells");
  nestPlacementModeSelect = document.getElementById("nestPlacementMode");
  mapShowNestMarkerInput = document.getElementById("mapShowNestMarker");
  mapNestUseCellSizeInput = document.getElementById("mapNestUseCellSize");
  mapNestCellSizeScaleInput = document.getElementById("mapNestCellSizeScale");
  mapFoodColorInput = document.getElementById("mapFoodColor");
  mapObstacleColorInput = document.getElementById("mapObstacleColor");
  mapNestColorInput = document.getElementById("mapNestColor");
  pixelNestAsCellInput = document.getElementById("pixelNestAsCell");
  showNestFoodCountInput = document.getElementById("showNestFoodCount");
  mapFoodDepletedColorInput = document.getElementById("mapFoodDepletedColor");
  mapColorToleranceInput = document.getElementById("mapColorTolerance");
  mapColorToleranceValueLabel = document.getElementById("mapColorToleranceValue");
  mapPaletteMinDistanceInput = document.getElementById("mapPaletteMinDistance");
  mapPaletteMinDistanceValueLabel = document.getElementById("mapPaletteMinDistanceValue");
  mapFoodColorToleranceInput = document.getElementById("mapFoodColorTolerance");
  mapObstacleColorToleranceInput = document.getElementById("mapObstacleColorTolerance");
  mapNestColorToleranceInput = document.getElementById("mapNestColorTolerance");
  generatePaletteButton = document.getElementById("generatePaletteButton");
  applyMorphologyButton = document.getElementById("applyMorphologyButton");
  mapObstacleDilateIterationsInput = document.getElementById("mapObstacleDilateIterations");
  mapObstacleErodeIterationsInput = document.getElementById("mapObstacleErodeIterations");
  mapFoodDilateIterationsInput = document.getElementById("mapFoodDilateIterations");
  mapFoodErodeIterationsInput = document.getElementById("mapFoodErodeIterations");
  mapNestDilateIterationsInput = document.getElementById("mapNestDilateIterations");
  mapNestErodeIterationsInput = document.getElementById("mapNestErodeIterations");
  mapFoodRenderCellsOnlyInput = document.getElementById("mapFoodRenderCellsOnly");
  mapFoodPlacementCellsOnlyInput = document.getElementById("mapFoodPlacementCellsOnly");
  colorDistanceMethodSelect = document.getElementById("colorDistanceMethod");
  palettePreviewContainer = document.getElementById("palettePreview");
  autoAssignPaletteButton = document.getElementById("autoAssignPaletteButton");
  applyPaletteRolesButton = document.getElementById("applyPaletteRolesButton");
    configPathInput = document.getElementById("configPath");
    loadConfigButton = document.getElementById("loadConfigButton");
    saveConfigButton = document.getElementById("saveConfigButton");
    configFileInput = document.getElementById("configFileInput");
  showPheromonesInput = document.getElementById("showPheromones");
  useClusteredPheromonesInput = document.getElementById("useClusteredPheromones");
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
  exportWorldButton = document.getElementById("exportWorldButton");
  startButton = document.getElementById("startButton");
  resetCameraButton = document.getElementById("resetCameraButton");
  fpsValueLabel = document.getElementById("fpsValue");
  statusMessageLabel = document.getElementById("statusMessage");

  // Advanced / prestart-only controls
  antPheromoneFrequencyInput = document.getElementById("antPheromoneFrequency");
  obstacleAvoidanceRandomnessInput = document.getElementById("obstacleAvoidanceRandomness");
  obstacleAvoidStrengthInput = document.getElementById("obstacleAvoidStrength");
  wanderSpeedFactorInput = document.getElementById("wanderSpeedFactor");
  trailSpeedFactorInput = document.getElementById("trailSpeedFactor");
  headedToFoodSpeedFactorInput = document.getElementById("headedToFoodSpeedFactor");
  headedHomeSpeedFactorInput = document.getElementById("headedHomeSpeedFactor");
  obstacleSideSpeedFactorInput = document.getElementById("obstacleSideSpeedFactor");
  obstacleFrontSpeedFactorInput = document.getElementById("obstacleFrontSpeedFactor");
  collisionTurnMinDegreesInput = document.getElementById("collisionTurnMinDegrees");
  collisionTurnMaxDegreesInput = document.getElementById("collisionTurnMaxDegrees");
  collisionPauseFramesInput = document.getElementById("collisionPauseFrames");
  boundaryNudgeDistanceInput = document.getElementById("boundaryNudgeDistance");
  foodPickupPauseFramesInput = document.getElementById("foodPickupPauseFrames");
  foodDropPauseFramesInput = document.getElementById("foodDropPauseFrames");
  postPauseEaseFramesInput = document.getElementById("postPauseEaseFrames");
  postPauseMinSpeedFactorInput = document.getElementById("postPauseMinSpeedFactor");

  useCamBoundsInput = document.getElementById("useCamBounds");
  camLiniencyInput = document.getElementById("camLiniency");
  quadTreeCapacityInput = document.getElementById("quadTreeCapacity");

  redPheromoneLifeInput = document.getElementById("redPheromoneLife");
  bluePheromoneLifeInput = document.getElementById("bluePheromoneLife");
  redPheromoneDiffusionEnabledInput = document.getElementById("redPheromoneDiffusionEnabled");
  redPheromoneDiffusionStrengthInput = document.getElementById("redPheromoneDiffusionStrength");
  bluePheromoneDiffusionEnabledInput = document.getElementById("bluePheromoneDiffusionEnabled");
  bluePheromoneDiffusionStrengthInput = document.getElementById("bluePheromoneDiffusionStrength");

  mapSampleDepthInput = document.getElementById("mapSampleDepth");
  mapFoodUnitsPerCellInput = document.getElementById("mapFoodUnitsPerCell");

  foodClusterColorInput = document.getElementById("foodClusterColor");
  foodClusterTextColorInput = document.getElementById("foodClusterTextColor");
  obstacleLineWidthInput = document.getElementById("obstacleLineWidth");
  obstacleQueryMethodSelect = document.getElementById("obstacleQueryMethod");
  pheromoneMaxRadiusInput = document.getElementById("pheromoneMaxRadius");
  pheromoneMaxIntensityInput = document.getElementById("pheromoneMaxIntensity");
  skipPheromoneOnCollisionPauseInput = document.getElementById("skipPheromoneOnCollisionPause");
  pixelModeInput = document.getElementById("pixelMode");
  pixelUseCellObstaclesInput = document.getElementById("pixelUseCellObstacles");

  antColorInput = document.getElementById("antColor");
  antSizeInput = document.getElementById("antSize");
  antWidthInput = document.getElementById("antWidth");
  redPheromoneColorInput = document.getElementById("redPheromoneColor");
  bluePheromoneColorInput = document.getElementById("bluePheromoneColor");
  foodColorInput = document.getElementById("foodColor");
  obstacleColorInput = document.getElementById("obstacleColor");
  nestColorInput = document.getElementById("nestColor");
  nestTextColorInput = document.getElementById("nestTextColor");
  autoStartSimulationInput = document.getElementById("autoStartSimulation");
  pauseWhenNoFoodInput = document.getElementById("pauseWhenNoFood");

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

  if (antHeadingQuantizationSelect) {
    const dirs = Config.antHeadingQuantizationDirections != null ? Config.antHeadingQuantizationDirections : 0;
    antHeadingQuantizationSelect.value = String(dirs);
    antHeadingQuantizationSelect.addEventListener("change", () => {
      const v = parseInt(antHeadingQuantizationSelect.value, 10);
      if (!Number.isNaN(v) && (v === 0 || v === 4 || v === 8)) {
        Config.antHeadingQuantizationDirections = v;
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

  if (antPheromoneFrequencyInput) {
    antPheromoneFrequencyInput.value = String(Config.antPheromoneFrequency);
    antPheromoneFrequencyInput.addEventListener("input", () => {
      const value = parseInt(antPheromoneFrequencyInput.value, 10);
      if (!Number.isNaN(value) && value > 0) {
        Config.antPheromoneFrequency = value;
      }
    });
  }

  if (obstacleAvoidanceRandomnessInput) {
    obstacleAvoidanceRandomnessInput.value = String(Config.obstacleAvoidanceRandomness);
    obstacleAvoidanceRandomnessInput.addEventListener("input", () => {
      const value = parseFloat(obstacleAvoidanceRandomnessInput.value);
      if (!Number.isNaN(value) && value >= 0) {
        Config.obstacleAvoidanceRandomness = value;
      }
    });
  }

  if (obstacleAvoidStrengthInput) {
    obstacleAvoidStrengthInput.value = String(Config.obstacleAvoidStrength);
    obstacleAvoidStrengthInput.addEventListener("input", () => {
      const value = parseFloat(obstacleAvoidStrengthInput.value);
      if (!Number.isNaN(value) && value >= 0) {
        Config.obstacleAvoidStrength = value;
      }
    });
  }

  if (wanderSpeedFactorInput) {
    wanderSpeedFactorInput.value = String(Config.wanderSpeedFactor);
    wanderSpeedFactorInput.addEventListener("input", () => {
      const value = parseFloat(wanderSpeedFactorInput.value);
      if (!Number.isNaN(value) && value >= 0) {
        Config.wanderSpeedFactor = value;
      }
    });
  }

  if (trailSpeedFactorInput) {
    trailSpeedFactorInput.value = String(Config.trailSpeedFactor);
    trailSpeedFactorInput.addEventListener("input", () => {
      const value = parseFloat(trailSpeedFactorInput.value);
      if (!Number.isNaN(value) && value >= 0) {
        Config.trailSpeedFactor = value;
      }
    });
  }

  if (headedToFoodSpeedFactorInput) {
    headedToFoodSpeedFactorInput.value = String(Config.headedToFoodSpeedFactor);
    headedToFoodSpeedFactorInput.addEventListener("input", () => {
      const value = parseFloat(headedToFoodSpeedFactorInput.value);
      if (!Number.isNaN(value) && value >= 0) {
        Config.headedToFoodSpeedFactor = value;
      }
    });
  }

  if (headedHomeSpeedFactorInput) {
    headedHomeSpeedFactorInput.value = String(Config.headedHomeSpeedFactor);
    headedHomeSpeedFactorInput.addEventListener("input", () => {
      const value = parseFloat(headedHomeSpeedFactorInput.value);
      if (!Number.isNaN(value) && value >= 0) {
        Config.headedHomeSpeedFactor = value;
      }
    });
  }

  if (obstacleSideSpeedFactorInput) {
    obstacleSideSpeedFactorInput.value = String(Config.obstacleSideSpeedFactor);
    obstacleSideSpeedFactorInput.addEventListener("input", () => {
      const value = parseFloat(obstacleSideSpeedFactorInput.value);
      if (!Number.isNaN(value) && value >= 0) {
        Config.obstacleSideSpeedFactor = value;
      }
    });
  }

  if (obstacleFrontSpeedFactorInput) {
    obstacleFrontSpeedFactorInput.value = String(Config.obstacleFrontSpeedFactor);
    obstacleFrontSpeedFactorInput.addEventListener("input", () => {
      const value = parseFloat(obstacleFrontSpeedFactorInput.value);
      if (!Number.isNaN(value) && value >= 0) {
        Config.obstacleFrontSpeedFactor = value;
      }
    });
  }

  if (collisionTurnMinDegreesInput) {
    collisionTurnMinDegreesInput.value = String(Config.collisionTurnMinDegrees);
    collisionTurnMinDegreesInput.addEventListener("input", () => {
      const value = parseFloat(collisionTurnMinDegreesInput.value);
      if (!Number.isNaN(value) && value >= 0) {
        Config.collisionTurnMinDegrees = value;
      }
    });
  }

  if (collisionTurnMaxDegreesInput) {
    collisionTurnMaxDegreesInput.value = String(Config.collisionTurnMaxDegrees);
    collisionTurnMaxDegreesInput.addEventListener("input", () => {
      const value = parseFloat(collisionTurnMaxDegreesInput.value);
      if (!Number.isNaN(value) && value >= 0) {
        Config.collisionTurnMaxDegrees = value;
      }
    });
  }

  if (collisionPauseFramesInput) {
    collisionPauseFramesInput.value = String(Config.collisionPauseFrames);
    collisionPauseFramesInput.addEventListener("input", () => {
      const value = parseInt(collisionPauseFramesInput.value, 10);
      if (!Number.isNaN(value) && value >= 0) {
        Config.collisionPauseFrames = value;
      }
    });
  }

  if (boundaryNudgeDistanceInput) {
    boundaryNudgeDistanceInput.value = String(Config.boundaryNudgeDistance);
    boundaryNudgeDistanceInput.addEventListener("input", () => {
      const value = parseFloat(boundaryNudgeDistanceInput.value);
      if (!Number.isNaN(value) && value >= 0) {
        Config.boundaryNudgeDistance = value;
      }
    });
  }

  if (foodPickupPauseFramesInput) {
    foodPickupPauseFramesInput.value = String(Config.foodPickupPauseFrames);
    foodPickupPauseFramesInput.addEventListener("input", () => {
      const value = parseInt(foodPickupPauseFramesInput.value, 10);
      if (!Number.isNaN(value) && value >= 0) {
        Config.foodPickupPauseFrames = value;
      }
    });
  }

  if (foodDropPauseFramesInput) {
    foodDropPauseFramesInput.value = String(Config.foodDropPauseFrames);
    foodDropPauseFramesInput.addEventListener("input", () => {
      const value = parseInt(foodDropPauseFramesInput.value, 10);
      if (!Number.isNaN(value) && value >= 0) {
        Config.foodDropPauseFrames = value;
      }
    });
  }

  if (postPauseEaseFramesInput) {
    postPauseEaseFramesInput.value = String(Config.postPauseEaseFrames);
    postPauseEaseFramesInput.addEventListener("input", () => {
      const value = parseInt(postPauseEaseFramesInput.value, 10);
      if (!Number.isNaN(value) && value >= 0) {
        Config.postPauseEaseFrames = value;
      }
    });
  }

  if (postPauseMinSpeedFactorInput) {
    postPauseMinSpeedFactorInput.value = String(Config.postPauseMinSpeedFactor);
    postPauseMinSpeedFactorInput.addEventListener("input", () => {
      const value = parseFloat(postPauseMinSpeedFactorInput.value);
      if (!Number.isNaN(value) && value >= 0) {
        Config.postPauseMinSpeedFactor = value;
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

  if (autoStartSimulationInput) {
    autoStartSimulationInput.checked = !!Config.autoStartSimulation;
    autoStartSimulationInput.addEventListener("change", () => {
      Config.autoStartSimulation = autoStartSimulationInput.checked;
    });
  }

  if (pauseWhenNoFoodInput) {
    pauseWhenNoFoodInput.checked = !!Config.pauseWhenNoFood;
    pauseWhenNoFoodInput.addEventListener("change", () => {
      Config.pauseWhenNoFood = pauseWhenNoFoodInput.checked;
    });
  }

  if (pixelModeInput) {
    pixelModeInput.checked = !!Config.pixelMode;
    pixelModeInput.addEventListener("change", () => {
      Config.pixelMode = pixelModeInput.checked;
      // Pixel mode affects how the world is rendered and how
      // positions are interpreted, so rebuild the simulation.
      resetSimulation();
    });
  }

  if (pixelUseCellObstaclesInput) {
    pixelUseCellObstaclesInput.checked = !!Config.pixelUseCellObstacles;
    pixelUseCellObstaclesInput.addEventListener("change", () => {
      Config.pixelUseCellObstacles = pixelUseCellObstaclesInput.checked;
      // Changing obstacle representation requires a rebuild.
      resetSimulation();
    });
  }

  if (simWidthInput) {
    simWidthInput.value = String(Config.simulationWidth);
    simWidthInput.addEventListener("input", () => {
      const value = parseInt(simWidthInput.value, 10);
      if (!Number.isNaN(value) && value > 0) {
        Config.simulationWidth = value;
        resetSimulation();
      }
    });
  }

  if (simHeightInput) {
    simHeightInput.value = String(Config.simulationHeight);
    simHeightInput.addEventListener("input", () => {
      const value = parseInt(simHeightInput.value, 10);
      if (!Number.isNaN(value) && value > 0) {
        Config.simulationHeight = value;
        resetSimulation();
      }
    });
  }

  if (useCamBoundsInput) {
    useCamBoundsInput.checked = !!Config.useCamBounds;
    useCamBoundsInput.addEventListener("change", () => {
      Config.useCamBounds = useCamBoundsInput.checked;
    });
  }

  if (camLiniencyInput) {
    camLiniencyInput.value = String(Config.camLiniency);
    camLiniencyInput.addEventListener("input", () => {
      const value = parseFloat(camLiniencyInput.value);
      if (!Number.isNaN(value) && value >= 0) {
        Config.camLiniency = value;
      }
    });
  }

  if (quadTreeCapacityInput) {
    quadTreeCapacityInput.value = String(Config.quadTreeCapacity);
    quadTreeCapacityInput.addEventListener("input", () => {
      const value = parseInt(quadTreeCapacityInput.value, 10);
      if (!Number.isNaN(value) && value > 0) {
        Config.quadTreeCapacity = value;
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

  if (redPheromoneLifeInput) {
    const life = Config.redPheromoneLife != null ? Config.redPheromoneLife : "";
    redPheromoneLifeInput.value = life === "" ? "" : String(life);
    redPheromoneLifeInput.placeholder = String(Config.pheromoneLife);
    redPheromoneLifeInput.addEventListener("input", () => {
      const value = parseInt(redPheromoneLifeInput.value, 10);
      if (Number.isNaN(value)) {
        Config.redPheromoneLife = null;
      } else if (value >= 0) {
        Config.redPheromoneLife = value;
      }
    });
  }

  if (bluePheromoneLifeInput) {
    const life = Config.bluePheromoneLife != null ? Config.bluePheromoneLife : "";
    bluePheromoneLifeInput.value = life === "" ? "" : String(life);
    bluePheromoneLifeInput.placeholder = String(Config.pheromoneLife);
    bluePheromoneLifeInput.addEventListener("input", () => {
      const value = parseInt(bluePheromoneLifeInput.value, 10);
      if (Number.isNaN(value)) {
        Config.bluePheromoneLife = null;
      } else if (value >= 0) {
        Config.bluePheromoneLife = value;
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

  if (pheromoneMaxRadiusInput) {
    const val = Config.pheromoneMaxRadius != null ? Config.pheromoneMaxRadius : "";
    pheromoneMaxRadiusInput.value = val === "" ? "" : String(val);
    pheromoneMaxRadiusInput.addEventListener("input", () => {
      const value = parseFloat(pheromoneMaxRadiusInput.value);
      if (Number.isNaN(value)) {
        Config.pheromoneMaxRadius = null;
      } else if (value > 0) {
        Config.pheromoneMaxRadius = value;
      }
    });
  }

  if (pheromoneMaxIntensityInput) {
    const val = Config.pheromoneMaxIntensity != null ? Config.pheromoneMaxIntensity : 1.0;
    pheromoneMaxIntensityInput.value = String(val);
    pheromoneMaxIntensityInput.addEventListener("input", () => {
      let value = parseFloat(pheromoneMaxIntensityInput.value);
      if (Number.isNaN(value)) return;
      if (value < 0) value = 0;
      Config.pheromoneMaxIntensity = value;
    });
  }

  if (redPheromoneDiffusionEnabledInput) {
    const effective = Config.redPheromoneDiffusionEnabled != null
      ? Config.redPheromoneDiffusionEnabled
      : Config.pheromoneDiffusionEnabled;
    redPheromoneDiffusionEnabledInput.checked = !!effective;
    redPheromoneDiffusionEnabledInput.addEventListener("change", () => {
      Config.redPheromoneDiffusionEnabled = redPheromoneDiffusionEnabledInput.checked;
    });
  }

  if (redPheromoneDiffusionStrengthInput) {
    const strength = Config.redPheromoneDiffusionStrength != null
      ? Config.redPheromoneDiffusionStrength
      : Config.pheromoneDiffusionStrength;
    redPheromoneDiffusionStrengthInput.value = String(strength);
    redPheromoneDiffusionStrengthInput.addEventListener("input", () => {
      const value = parseFloat(redPheromoneDiffusionStrengthInput.value);
      if (Number.isNaN(value)) {
        Config.redPheromoneDiffusionStrength = null;
      } else if (value >= 0) {
        Config.redPheromoneDiffusionStrength = value;
      }
    });
  }

  if (bluePheromoneDiffusionEnabledInput) {
    const effective = Config.bluePheromoneDiffusionEnabled != null
      ? Config.bluePheromoneDiffusionEnabled
      : Config.pheromoneDiffusionEnabled;
    bluePheromoneDiffusionEnabledInput.checked = !!effective;
    bluePheromoneDiffusionEnabledInput.addEventListener("change", () => {
      Config.bluePheromoneDiffusionEnabled = bluePheromoneDiffusionEnabledInput.checked;
    });
  }

  if (bluePheromoneDiffusionStrengthInput) {
    const strength = Config.bluePheromoneDiffusionStrength != null
      ? Config.bluePheromoneDiffusionStrength
      : Config.pheromoneDiffusionStrength;
    bluePheromoneDiffusionStrengthInput.value = String(strength);
    bluePheromoneDiffusionStrengthInput.addEventListener("input", () => {
      const value = parseFloat(bluePheromoneDiffusionStrengthInput.value);
      if (Number.isNaN(value)) {
        Config.bluePheromoneDiffusionStrength = null;
      } else if (value >= 0) {
        Config.bluePheromoneDiffusionStrength = value;
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

  if (skipPheromoneOnCollisionPauseInput) {
    skipPheromoneOnCollisionPauseInput.checked = !!Config.skipPheromoneOnCollisionPause;
    skipPheromoneOnCollisionPauseInput.addEventListener("change", () => {
      Config.skipPheromoneOnCollisionPause = skipPheromoneOnCollisionPauseInput.checked;
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

  if (foodClusterColorInput) {
    foodClusterColorInput.value = Config.foodClusterColor || "#00ff00";
    foodClusterColorInput.addEventListener("input", () => {
      Config.foodClusterColor = foodClusterColorInput.value;
    });
  }

  if (foodClusterTextColorInput) {
    foodClusterTextColorInput.value = Config.foodClusterTextColor || "#000000";
    foodClusterTextColorInput.addEventListener("input", () => {
      Config.foodClusterTextColor = foodClusterTextColorInput.value;
    });
  }

  if (obstacleLineWidthInput) {
    obstacleLineWidthInput.value = String(Config.obstacleLineWidth != null ? Config.obstacleLineWidth : 3);
    obstacleLineWidthInput.addEventListener("input", () => {
      const value = parseFloat(obstacleLineWidthInput.value);
      if (!Number.isNaN(value) && value > 0) {
        Config.obstacleLineWidth = value;
      }
    });
  }

  if (obstacleQueryMethodSelect) {
    const method = Config.obstacleQueryMethod != null ? Config.obstacleQueryMethod : 0;
    obstacleQueryMethodSelect.value = String(method);
    obstacleQueryMethodSelect.addEventListener("change", () => {
      const v = parseInt(obstacleQueryMethodSelect.value, 10);
      if (!Number.isNaN(v)) {
        Config.obstacleQueryMethod = v;
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

  if (antColorInput) {
    antColorInput.value = Config.antColor || "#ffffff";
    antColorInput.addEventListener("input", () => {
      Config.antColor = antColorInput.value;
    });
  }

  if (redPheromoneColorInput) {
    redPheromoneColorInput.value = Config.pheromoneRedColor || "#fd2108";
    redPheromoneColorInput.addEventListener("input", () => {
      Config.pheromoneRedColor = redPheromoneColorInput.value;
    });
  }

  if (bluePheromoneColorInput) {
    bluePheromoneColorInput.value = Config.pheromoneBlueColor || "#4287f5";
    bluePheromoneColorInput.addEventListener("input", () => {
      Config.pheromoneBlueColor = bluePheromoneColorInput.value;
    });
  }

  if (foodColorInput) {
    foodColorInput.value = Config.foodColor || "#00ff00";
    foodColorInput.addEventListener("input", () => {
      Config.foodColor = foodColorInput.value;
    });
  }

  if (obstacleColorInput) {
    obstacleColorInput.value = Config.obstacleColor || "#ffaf00";
    obstacleColorInput.addEventListener("input", () => {
      Config.obstacleColor = obstacleColorInput.value;
    });
  }

  if (nestColorInput) {
    nestColorInput.value = Config.nestColor || "#ce5114";
    nestColorInput.addEventListener("input", () => {
      Config.nestColor = nestColorInput.value;
    });
  }

  if (nestTextColorInput) {
    nestTextColorInput.value = Config.nestTextColor || "#ffffff";
    nestTextColorInput.addEventListener("input", () => {
      Config.nestTextColor = nestTextColorInput.value;
    });
  }

  if (antSizeInput) {
    antSizeInput.value = String(Config.antSize != null ? Config.antSize : 15);
    antSizeInput.addEventListener("input", () => {
      const value = parseInt(antSizeInput.value, 10);
      if (!Number.isNaN(value) && value > 0) {
        Config.antSize = value;
      }
    });
  }

  if (antWidthInput) {
    antWidthInput.value = String(Config.antWidth != null ? Config.antWidth : 5);
    antWidthInput.addEventListener("input", () => {
      const value = parseInt(antWidthInput.value, 10);
      if (!Number.isNaN(value) && value > 0) {
        Config.antWidth = value;
      }
    });
  }

  if (configPathInput) {
    configPathInput.value = Config.configPath || "";
    configPathInput.addEventListener("input", () => {
      Config.configPath = configPathInput.value;
    });
  }

  if (useImageMapInput) {
    useImageMapInput.checked = !!Config.useImageMap;
    useImageMapInput.addEventListener("change", () => {
      Config.useImageMap = useImageMapInput.checked;
      // Rebuild simulation to apply mode change
      resetSimulation();
    });
  }

  if (mapShowAllCellsInput) {
    mapShowAllCellsInput.checked = !!Config.mapShowAllCells;
    mapShowAllCellsInput.addEventListener("change", () => {
      Config.mapShowAllCells = mapShowAllCellsInput.checked;
    });
  }

  if (nestPlacementModeSelect) {
    const mode = Config.nestPlacementMode != null ? Config.nestPlacementMode : 2;
    nestPlacementModeSelect.value = String(mode);
    nestPlacementModeSelect.addEventListener("change", () => {
      const value = parseInt(nestPlacementModeSelect.value, 10);
      if (!Number.isNaN(value)) {
        Config.nestPlacementMode = value;
      }
    });
  }

  if (mapShowNestMarkerInput) {
    mapShowNestMarkerInput.checked = !!Config.mapShowNestMarker;
    mapShowNestMarkerInput.addEventListener("change", () => {
      Config.mapShowNestMarker = mapShowNestMarkerInput.checked;
    });
  }

  if (mapNestUseCellSizeInput) {
    mapNestUseCellSizeInput.checked = !!Config.mapNestUseCellSize;
    mapNestUseCellSizeInput.addEventListener("change", () => {
      Config.mapNestUseCellSize = mapNestUseCellSizeInput.checked;
    });
  }

  if (pixelNestAsCellInput) {
    pixelNestAsCellInput.checked = !!Config.pixelNestAsCell;
    pixelNestAsCellInput.addEventListener("change", () => {
      Config.pixelNestAsCell = pixelNestAsCellInput.checked;
    });
  }

  if (mapNestCellSizeScaleInput) {
    mapNestCellSizeScaleInput.value = String(
      Config.mapNestCellSizeScale != null ? Config.mapNestCellSizeScale : 0.9
    );
    mapNestCellSizeScaleInput.addEventListener("input", () => {
      const value = parseFloat(mapNestCellSizeScaleInput.value);
      if (!Number.isNaN(value) && value > 0) {
        Config.mapNestCellSizeScale = value;
      }
    });
  }

  if (showNestFoodCountInput) {
    showNestFoodCountInput.checked = !!Config.showNestFoodCount;
    showNestFoodCountInput.addEventListener("change", () => {
      Config.showNestFoodCount = showNestFoodCountInput.checked;
    });
  }

  if (mapUseImageSizeInput) {
    mapUseImageSizeInput.checked = !!Config.mapUseImageSize;
    mapUseImageSizeInput.addEventListener("change", () => {
      Config.mapUseImageSize = mapUseImageSizeInput.checked;
      resetSimulation();
    });
  }

  if (mapImagePathInput) {
    mapImagePathInput.value = Config.mapImagePath || "";
    mapImagePathInput.addEventListener("input", () => {
      Config.mapImagePath = mapImagePathInput.value;
      // Note: new image path will be used next time the page/sketch is reloaded.
    });
  }

  if (mapImageChooseButton && mapImageFileInput) {
    mapImageChooseButton.addEventListener("click", () => {
      mapImageFileInput.value = "";
      mapImageFileInput.click();
    });

    mapImageFileInput.addEventListener("change", () => {
      const file = mapImageFileInput.files && mapImageFileInput.files[0];
      if (!file) return;

      const url = URL.createObjectURL(file);
      Config.mapImagePath = url;
      if (mapImagePathInput) {
        mapImagePathInput.value = file.name || "";
      }
      // Rebuild simulation to apply the new image map.
      resetSimulation();
    });
  }

  if (mapSampleStepInput) {
    mapSampleStepInput.value = String(Config.mapSampleStep || 4);
    mapSampleStepInput.addEventListener("input", () => {
      const value = parseInt(mapSampleStepInput.value, 10);
      if (!Number.isNaN(value) && value > 0) {
        Config.mapSampleStep = value;
        resetSimulation();
      }
    });
  }

  if (mapSampleDepthInput) {
    mapSampleDepthInput.value = String(Config.mapSampleDepth != null ? Config.mapSampleDepth : 3);
    mapSampleDepthInput.addEventListener("input", () => {
      const value = parseInt(mapSampleDepthInput.value, 10);
      if (!Number.isNaN(value) && value > 0) {
        Config.mapSampleDepth = value;
        resetSimulation();
      }
    });
  }

  if (mapFoodColorInput) {
    mapFoodColorInput.value = Config.mapFoodColor || "#00ff00";
    mapFoodColorInput.addEventListener("input", () => {
      Config.mapFoodColor = mapFoodColorInput.value;
      resetSimulation();
    });
  }

  if (mapObstacleColorInput) {
    mapObstacleColorInput.value = Config.mapObstacleColor || "#000000";
    mapObstacleColorInput.addEventListener("input", () => {
      Config.mapObstacleColor = mapObstacleColorInput.value;
      resetSimulation();
    });
  }

  if (mapNestColorInput) {
    mapNestColorInput.value = Config.mapNestColor || "#0000ff";
    mapNestColorInput.addEventListener("input", () => {
      Config.mapNestColor = mapNestColorInput.value;
      resetSimulation();
    });
  }

  if (mapFoodDepletedColorInput) {
    mapFoodDepletedColorInput.value = Config.mapFoodDepletedColor || "#000000";
    mapFoodDepletedColorInput.addEventListener("input", () => {
      Config.mapFoodDepletedColor = mapFoodDepletedColorInput.value;
    });
  }

  if (mapFoodUnitsPerCellInput) {
    mapFoodUnitsPerCellInput.value = String(Config.mapFoodUnitsPerCell != null ? Config.mapFoodUnitsPerCell : 10);
    mapFoodUnitsPerCellInput.addEventListener("input", () => {
      const value = parseInt(mapFoodUnitsPerCellInput.value, 10);
      if (!Number.isNaN(value) && value >= 0) {
        Config.mapFoodUnitsPerCell = value;
        resetSimulation();
      }
    });
  }

  if (mapColorToleranceInput) {
    mapColorToleranceInput.value = String(Config.mapColorTolerance != null ? Config.mapColorTolerance : 60);
    if (mapColorToleranceValueLabel) mapColorToleranceValueLabel.textContent = mapColorToleranceInput.value;
    mapColorToleranceInput.addEventListener("input", () => {
      const value = parseFloat(mapColorToleranceInput.value);
      if (!Number.isNaN(value)) {
        Config.mapColorTolerance = value;
        if (mapColorToleranceValueLabel) mapColorToleranceValueLabel.textContent = mapColorToleranceInput.value;
        resetSimulation();
      }
    });
  }

  if (mapFoodColorToleranceInput) {
    const base = Config.mapColorTolerance != null ? Config.mapColorTolerance : 60;
    const val = Config.mapFoodColorTolerance != null ? Config.mapFoodColorTolerance : "";
    mapFoodColorToleranceInput.value = val === "" ? "" : String(val);
    mapFoodColorToleranceInput.placeholder = String(base);
    mapFoodColorToleranceInput.addEventListener("input", () => {
      const v = parseFloat(mapFoodColorToleranceInput.value);
      if (Number.isNaN(v)) {
        Config.mapFoodColorTolerance = null;
      } else if (v >= 0) {
        Config.mapFoodColorTolerance = v;
      }
    });
  }

  if (mapObstacleColorToleranceInput) {
    const base = Config.mapColorTolerance != null ? Config.mapColorTolerance : 60;
    const val = Config.mapObstacleColorTolerance != null ? Config.mapObstacleColorTolerance : "";
    mapObstacleColorToleranceInput.value = val === "" ? "" : String(val);
    mapObstacleColorToleranceInput.placeholder = String(base);
    mapObstacleColorToleranceInput.addEventListener("input", () => {
      const v = parseFloat(mapObstacleColorToleranceInput.value);
      if (Number.isNaN(v)) {
        Config.mapObstacleColorTolerance = null;
      } else if (v >= 0) {
        Config.mapObstacleColorTolerance = v;
      }
    });
  }

  if (mapNestColorToleranceInput) {
    const base = Config.mapColorTolerance != null ? Config.mapColorTolerance : 60;
    const val = Config.mapNestColorTolerance != null ? Config.mapNestColorTolerance : "";
    mapNestColorToleranceInput.value = val === "" ? "" : String(val);
    mapNestColorToleranceInput.placeholder = String(base);
    mapNestColorToleranceInput.addEventListener("input", () => {
      const v = parseFloat(mapNestColorToleranceInput.value);
      if (Number.isNaN(v)) {
        Config.mapNestColorTolerance = null;
      } else if (v >= 0) {
        Config.mapNestColorTolerance = v;
      }
    });
  }

  const bindMorphIterations = (input, key) => {
    if (!input) return;
    input.value = String(Config[key] != null ? Config[key] : 0);
    input.addEventListener("input", () => {
      const v = parseInt(input.value, 10);
      if (!Number.isNaN(v) && v >= 0) {
        Config[key] = v;
      }
    });
  };

  bindMorphIterations(mapObstacleDilateIterationsInput, "mapObstacleDilateIterations");
  bindMorphIterations(mapObstacleErodeIterationsInput, "mapObstacleErodeIterations");
  bindMorphIterations(mapFoodDilateIterationsInput, "mapFoodDilateIterations");
  bindMorphIterations(mapFoodErodeIterationsInput, "mapFoodErodeIterations");
  bindMorphIterations(mapNestDilateIterationsInput, "mapNestDilateIterations");
  bindMorphIterations(mapNestErodeIterationsInput, "mapNestErodeIterations");

  if (mapPaletteMinDistanceInput) {
    const initial = Config.mapPaletteMinDistance != null ? Config.mapPaletteMinDistance : (Config.mapColorTolerance != null ? Config.mapColorTolerance : 60);
    mapPaletteMinDistanceInput.value = String(initial);
    if (mapPaletteMinDistanceValueLabel) mapPaletteMinDistanceValueLabel.textContent = mapPaletteMinDistanceInput.value;
    mapPaletteMinDistanceInput.addEventListener("input", () => {
      const value = parseFloat(mapPaletteMinDistanceInput.value);
      if (!Number.isNaN(value)) {
        Config.mapPaletteMinDistance = value;
        if (mapPaletteMinDistanceValueLabel) mapPaletteMinDistanceValueLabel.textContent = mapPaletteMinDistanceInput.value;
        // Recompute palette + image map on next reset.
        resetSimulation();
      }
    });
  }

  if (mapFoodRenderCellsOnlyInput) {
    mapFoodRenderCellsOnlyInput.checked = !!Config.mapFoodRenderCellsOnly;
    mapFoodRenderCellsOnlyInput.addEventListener("change", () => {
      Config.mapFoodRenderCellsOnly = mapFoodRenderCellsOnlyInput.checked;
    });
  }

  if (mapFoodPlacementCellsOnlyInput) {
    mapFoodPlacementCellsOnlyInput.checked = !!Config.mapFoodPlacementCellsOnly;
    mapFoodPlacementCellsOnlyInput.addEventListener("change", () => {
      Config.mapFoodPlacementCellsOnly = mapFoodPlacementCellsOnlyInput.checked;
    });
  }

  if (colorDistanceMethodSelect) {
    const method = Config.colorDistanceMethod != null ? Config.colorDistanceMethod : 0;
    colorDistanceMethodSelect.value = String(method);
    colorDistanceMethodSelect.addEventListener("change", () => {
      const value = parseInt(colorDistanceMethodSelect.value, 10);
      if (!Number.isNaN(value)) {
        Config.colorDistanceMethod = value;
        resetSimulation();
      }
    });
  }

  if (autoAssignPaletteButton) {
    autoAssignPaletteButton.addEventListener("click", () => {
      if (!paletteColors || !paletteColors.length || !palettePreviewContainer) return;

      const metrics = paletteColors.map(([r, g, b], idx) => {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const sat = max > 0 ? (max - min) / max : 0;
        return { idx, lum, sat };
      });

      if (!paletteRoles || paletteRoles.length !== paletteColors.length) {
        paletteRoles = paletteColors.map(() => "none");
      }

      const byLum = [...metrics].sort((a, b) => a.lum - b.lum);
      const darkest = byLum[0];
      const obstacleIdx = darkest ? darkest.idx : null;

      let foodIdx = null;
      let bestFoodScore = -Infinity;
      for (const m of metrics) {
        if (m.idx === obstacleIdx) continue;
        const score = m.sat * 2 + Math.max(0, m.lum / 255 - 0.3);
        if (score > bestFoodScore) {
          bestFoodScore = score;
          foodIdx = m.idx;
        }
      }

      let nestIdx = null;
      let bestNestScore = -Infinity;
      for (const m of metrics) {
        if (m.idx === obstacleIdx || m.idx === foodIdx) continue;
        const midLum = Math.abs(m.lum / 255 - 0.5);
        const score = m.sat - midLum;
        if (score > bestNestScore) {
          bestNestScore = score;
          nestIdx = m.idx;
        }
      }

      let depletedIdx = null;
      for (const m of byLum) {
        if (m.idx === obstacleIdx) continue;
        if (m.lum < 80) {
          depletedIdx = m.idx;
          break;
        }
      }

      paletteRoles = paletteColors.map(() => "none");
      if (obstacleIdx != null) paletteRoles[obstacleIdx] = "obstacle";
      if (foodIdx != null) paletteRoles[foodIdx] = "food";
      if (nestIdx != null) paletteRoles[nestIdx] = "nest";
      if (depletedIdx != null) paletteRoles[depletedIdx] = "depleted";

      const selects = palettePreviewContainer.querySelectorAll("select[data-palette-index]");
      selects.forEach((select) => {
        const idx = parseInt(select.getAttribute("data-palette-index") || "0", 10);
        const role = paletteRoles[idx] || "none";
        select.value = role;
      });
    });
  }

  if (applyPaletteRolesButton) {
    applyPaletteRolesButton.addEventListener("click", () => {
      if (!paletteColors || !paletteColors.length) return;

      const findIndexForRole = (role) => {
        if (!paletteRoles || paletteRoles.length !== paletteColors.length) return null;
        const idx = paletteRoles.findIndex((r) => r === role);
        return idx >= 0 ? idx : null;
      };

      const rgbToHex = (r, g, b) => {
        const toHex = (v) => {
          const clamped = Math.max(0, Math.min(255, Math.round(v)));
          return clamped.toString(16).padStart(2, "0");
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      };

      const applyRole = (role, applyFn) => {
        const idx = findIndexForRole(role);
        if (idx == null) return;
        const [r, g, b] = paletteColors[idx];
        const hex = rgbToHex(r, g, b);
        applyFn(hex);
      };

      applyRole("food", (hex) => {
        Config.mapFoodColor = hex;
        if (mapFoodColorInput) mapFoodColorInput.value = hex;
        // Keep main food color swatch in sync with image-map food color.
        Config.foodColor = hex;
        if (foodColorInput) foodColorInput.value = hex;
      });

      applyRole("obstacle", (hex) => {
        Config.mapObstacleColor = hex;
        if (mapObstacleColorInput) mapObstacleColorInput.value = hex;
        // Keep main obstacle color swatch in sync.
        Config.obstacleColor = hex;
        if (obstacleColorInput) obstacleColorInput.value = hex;
      });

      applyRole("nest", (hex) => {
        Config.mapNestColor = hex;
        if (mapNestColorInput) mapNestColorInput.value = hex;
        // Keep main nest color swatch in sync.
        Config.nestColor = hex;
        if (nestColorInput) nestColorInput.value = hex;
      });

      applyRole("depleted", (hex) => {
        Config.mapFoodDepletedColor = hex;
        if (mapFoodDepletedColorInput) mapFoodDepletedColorInput.value = hex;
      });

      resetSimulation();
    });
  }

  if (applyMorphologyButton) {
    applyMorphologyButton.addEventListener("click", () => {
      // Rebuild the simulation so the current morphology
      // parameters are applied to the image map, obstacles,
      // nest placement, and food.
      resetSimulation();
    });
  }

  if (generatePaletteButton && typeof generatePalette === "function") {
    generatePaletteButton.addEventListener("click", () => {
      generatePalette();
    });
  }

  if (loadConfigButton && configFileInput) {
    loadConfigButton.addEventListener("click", () => {
      configFileInput.value = "";
      configFileInput.click();
    });

    configFileInput.addEventListener("change", () => {
      const file = configFileInput.files && configFileInput.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result);
          if (parsed && typeof parsed === "object") {
            for (const key of Object.keys(parsed)) {
              if (Object.prototype.hasOwnProperty.call(Config, key)) {
                Config[key] = parsed[key];
              }
            }
            if (configPathInput && parsed.configPath) {
              configPathInput.value = parsed.configPath;
            }
            resetSimulation();
        // After loading a new config, sync all UI controls to reflect it.
        refreshUIFromConfig();
          }
        } catch (e) {
          console.error("Failed to parse config JSON", e);
        }
      };
      reader.readAsText(file);
    });
  }

  if (saveConfigButton) {
    saveConfigButton.addEventListener("click", () => {
      const json = JSON.stringify(Config, null, 2);
      let filename = Config.configPath || "config.json";
      // Strip directories if present
      const slash = filename.lastIndexOf("/");
      if (slash !== -1) filename = filename.slice(slash + 1);
      if (!filename.toLowerCase().endsWith(".json")) {
        filename += ".json";
      }

      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
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

  if (resetCameraButton && typeof resetCamera === "function") {
    resetCameraButton.addEventListener("click", () => {
      resetCamera();
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

  if (startButton && typeof startSimulation === "function") {
    startButton.addEventListener("click", () => {
      startSimulation();
    });
  }

  if (exportWorldButton && typeof exportWorld === "function") {
    exportWorldButton.addEventListener("click", () => {
      exportWorld();
    });
  }

  // Make slider value labels clickable for direct numeric entry.
  if (uiPanel) {
    const controls = uiPanel.querySelectorAll(".control");
    controls.forEach((control) => {
      const range = control.querySelector("input[type='range']");
      const valueSpan = control.querySelector(".value");
      if (!range || !valueSpan) return;

      valueSpan.classList.add("editable-value");
      valueSpan.title = "Click to enter a specific value";

      valueSpan.addEventListener("click", () => {
        const current = range.value;
        const min = range.min !== "" ? parseFloat(range.min) : null;
        const max = range.max !== "" ? parseFloat(range.max) : null;
        const step = range.step !== "" && range.step !== "any" ? parseFloat(range.step) : null;

        const result = window.prompt("Enter value", current);
        if (result == null) return;
        let v = parseFloat(result);
        if (Number.isNaN(v)) return;

        if (min != null && v < min) v = min;
        if (max != null && v > max) v = max;
        if (step != null && step > 0) {
          v = Math.round(v / step) * step;
        }

        range.value = String(v);
        // Reuse existing input handlers to update Config + labels.
        range.dispatchEvent(new Event("input", { bubbles: true }));
      });
    });

    // Collapsible sections: clicking the header toggles visibility.
    const sectionHeaders = uiPanel.querySelectorAll(".ui-section-header");
    sectionHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const section = header.parentElement;
        if (!section) return;
        section.classList.toggle("collapsed");
      });
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

export function updateStatusMessage(message) {
  if (!statusMessageLabel) return;
  statusMessageLabel.textContent = message || "";
}

export function updateFPSUI(fps) {
  if (fpsValueLabel) {
    fpsValueLabel.textContent = fps.toFixed(1);
  }
}

export function updatePalettePreview(colors) {
  if (!palettePreviewContainer) return;
  // Clear existing swatches
  while (palettePreviewContainer.firstChild) {
    palettePreviewContainer.removeChild(palettePreviewContainer.firstChild);
  }
  if (!colors || !colors.length) {
    paletteColors = [];
    paletteRoles = [];
    return;
  }

  paletteColors = colors.slice();
  if (!paletteRoles || paletteRoles.length !== paletteColors.length) {
    paletteRoles = paletteColors.map(() => "none");
  }

  paletteColors.forEach((c, index) => {
    const [r, g, b] = c;

    const row = document.createElement("div");
    row.className = "palette-row";

    const indexSpan = document.createElement("span");
    indexSpan.className = "palette-index";
    indexSpan.textContent = String(index + 1);

    const swatch = document.createElement("span");
    swatch.className = "palette-swatch";
    swatch.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    const select = document.createElement("select");
    select.className = "palette-role-select";
    select.setAttribute("data-palette-index", String(index));

    const roles = [
      { value: "none", label: "(none)" },
      { value: "food", label: "Food" },
      { value: "obstacle", label: "Obstacle" },
      { value: "nest", label: "Nest" },
      { value: "depleted", label: "Depleted food" },
    ];

    roles.forEach(({ value, label }) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = label;
      select.appendChild(opt);
    });

    select.value = paletteRoles[index] || "none";
    select.addEventListener("change", () => {
      paletteRoles[index] = select.value;
    });

    row.appendChild(indexSpan);
    row.appendChild(swatch);
    row.appendChild(select);
    palettePreviewContainer.appendChild(row);
  });
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

export function refreshUIFromConfig() {
  // Ants
  if (antCountInput) {
    antCountInput.value = String(Config.antCount);
    if (antCountValueLabel) antCountValueLabel.textContent = antCountInput.value;
  }
  if (antSpeedInput) {
    antSpeedInput.value = String(Config.antSpeed);
    if (antSpeedValueLabel) antSpeedValueLabel.textContent = antSpeedInput.value;
  }
  if (antSteeringStrengthInput) {
    antSteeringStrengthInput.value = String(Config.antSteeringStrength);
    if (antSteeringStrengthValueLabel) antSteeringStrengthValueLabel.textContent = antSteeringStrengthInput.value;
  }
  if (antFoVInput) {
    antFoVInput.value = String(Config.antFoVDegrees);
    if (antFoVValueLabel) antFoVValueLabel.textContent = antFoVInput.value;
  }
  if (antWanderStrengthInput) {
    antWanderStrengthInput.value = String(Config.antWanderStrength);
    if (antWanderStrengthValueLabel) antWanderStrengthValueLabel.textContent = antWanderStrengthInput.value;
  }
  if (antSightInput) {
    antSightInput.value = String(Config.antSight);
    if (antSightValueLabel) antSightValueLabel.textContent = antSightInput.value;
  }
  if (antHeadingQuantizationSelect) {
    const dirs = Config.antHeadingQuantizationDirections != null ? Config.antHeadingQuantizationDirections : 0;
    antHeadingQuantizationSelect.value = String(dirs);
  }

  if (antPheromoneFrequencyInput) {
    antPheromoneFrequencyInput.value = String(Config.antPheromoneFrequency);
  }
  if (obstacleAvoidanceRandomnessInput) {
    obstacleAvoidanceRandomnessInput.value = String(Config.obstacleAvoidanceRandomness);
  }
  if (obstacleAvoidStrengthInput) {
    obstacleAvoidStrengthInput.value = String(Config.obstacleAvoidStrength);
  }
  if (wanderSpeedFactorInput) {
    wanderSpeedFactorInput.value = String(Config.wanderSpeedFactor);
  }
  if (trailSpeedFactorInput) {
    trailSpeedFactorInput.value = String(Config.trailSpeedFactor);
  }
  if (headedToFoodSpeedFactorInput) {
    headedToFoodSpeedFactorInput.value = String(Config.headedToFoodSpeedFactor);
  }
  if (headedHomeSpeedFactorInput) {
    headedHomeSpeedFactorInput.value = String(Config.headedHomeSpeedFactor);
  }
  if (obstacleSideSpeedFactorInput) {
    obstacleSideSpeedFactorInput.value = String(Config.obstacleSideSpeedFactor);
  }
  if (obstacleFrontSpeedFactorInput) {
    obstacleFrontSpeedFactorInput.value = String(Config.obstacleFrontSpeedFactor);
  }
  if (collisionTurnMinDegreesInput) {
    collisionTurnMinDegreesInput.value = String(Config.collisionTurnMinDegrees);
  }
  if (collisionTurnMaxDegreesInput) {
    collisionTurnMaxDegreesInput.value = String(Config.collisionTurnMaxDegrees);
  }
  if (collisionPauseFramesInput) {
    collisionPauseFramesInput.value = String(Config.collisionPauseFrames);
  }
  if (boundaryNudgeDistanceInput) {
    boundaryNudgeDistanceInput.value = String(Config.boundaryNudgeDistance);
  }
  if (foodPickupPauseFramesInput) {
    foodPickupPauseFramesInput.value = String(Config.foodPickupPauseFrames);
  }
  if (foodDropPauseFramesInput) {
    foodDropPauseFramesInput.value = String(Config.foodDropPauseFrames);
  }
  if (postPauseEaseFramesInput) {
    postPauseEaseFramesInput.value = String(Config.postPauseEaseFrames);
  }
  if (postPauseMinSpeedFactorInput) {
    postPauseMinSpeedFactorInput.value = String(Config.postPauseMinSpeedFactor);
  }

  // Simulation & world
  if (simulationSpeedInput) {
    simulationSpeedInput.value = String(Config.simulationSpeed);
    if (simulationSpeedValueLabel) simulationSpeedValueLabel.textContent = simulationSpeedInput.value;
  }
  if (simWidthInput) {
    simWidthInput.value = String(Config.simulationWidth);
  }
  if (simHeightInput) {
    simHeightInput.value = String(Config.simulationHeight);
  }
  if (pixelModeInput) {
    pixelModeInput.checked = !!Config.pixelMode;
  }
  if (pixelUseCellObstaclesInput) {
    pixelUseCellObstaclesInput.checked = !!Config.pixelUseCellObstacles;
  }
  if (useCamBoundsInput) {
    useCamBoundsInput.checked = !!Config.useCamBounds;
  }
  if (camLiniencyInput) {
    camLiniencyInput.value = String(Config.camLiniency);
  }
  if (quadTreeCapacityInput) {
    quadTreeCapacityInput.value = String(Config.quadTreeCapacity);
  }
  if (bgColorInput) {
    bgColorInput.value = Config.backgroundColor;
  }
  if (autoStartSimulationInput) {
    autoStartSimulationInput.checked = !!Config.autoStartSimulation;
  }
  if (pauseWhenNoFoodInput) {
    pauseWhenNoFoodInput.checked = !!Config.pauseWhenNoFood;
  }

  // Pheromones
  if (pheromoneLifeInput) {
    pheromoneLifeInput.value = String(Config.pheromoneLife);
    if (pheromoneLifeValueLabel) pheromoneLifeValueLabel.textContent = pheromoneLifeInput.value;
  }
  if (redPheromoneLifeInput) {
    const life = Config.redPheromoneLife != null ? Config.redPheromoneLife : "";
    redPheromoneLifeInput.value = life === "" ? "" : String(life);
  }
  if (bluePheromoneLifeInput) {
    const life = Config.bluePheromoneLife != null ? Config.bluePheromoneLife : "";
    bluePheromoneLifeInput.value = life === "" ? "" : String(life);
  }
  if (pheromoneLowScoreThresholdInput) {
    pheromoneLowScoreThresholdInput.value = String(Config.pheromoneLowScoreThreshold);
    if (pheromoneLowScoreThresholdValueLabel) pheromoneLowScoreThresholdValueLabel.textContent = pheromoneLowScoreThresholdInput.value;
  }
  if (pheromoneIgnoreProbabilityInput) {
    pheromoneIgnoreProbabilityInput.value = String(Config.pheromoneIgnoreProbability);
    if (pheromoneIgnoreProbabilityValueLabel) pheromoneIgnoreProbabilityValueLabel.textContent = pheromoneIgnoreProbabilityInput.value;
  }
  if (pheromoneDiffusionInput) {
    pheromoneDiffusionInput.checked = !!Config.pheromoneDiffusionEnabled;
  }
  if (pheromoneDiffusionStrengthInput) {
    pheromoneDiffusionStrengthInput.value = String(Config.pheromoneDiffusionStrength);
    if (pheromoneDiffusionStrengthValueLabel) pheromoneDiffusionStrengthValueLabel.textContent = pheromoneDiffusionStrengthInput.value;
  }
  if (pheromoneMaxRadiusInput) {
    const val = Config.pheromoneMaxRadius != null ? Config.pheromoneMaxRadius : "";
    pheromoneMaxRadiusInput.value = val === "" ? "" : String(val);
  }
  if (pheromoneMaxIntensityInput) {
    const val = Config.pheromoneMaxIntensity != null ? Config.pheromoneMaxIntensity : 1.0;
    pheromoneMaxIntensityInput.value = String(val);
  }
  if (redPheromoneDiffusionEnabledInput) {
    const effective = Config.redPheromoneDiffusionEnabled != null
      ? Config.redPheromoneDiffusionEnabled
      : Config.pheromoneDiffusionEnabled;
    redPheromoneDiffusionEnabledInput.checked = !!effective;
  }
  if (redPheromoneDiffusionStrengthInput) {
    const strength = Config.redPheromoneDiffusionStrength != null
      ? Config.redPheromoneDiffusionStrength
      : Config.pheromoneDiffusionStrength;
    redPheromoneDiffusionStrengthInput.value = String(strength);
  }
  if (bluePheromoneDiffusionEnabledInput) {
    const effective = Config.bluePheromoneDiffusionEnabled != null
      ? Config.bluePheromoneDiffusionEnabled
      : Config.pheromoneDiffusionEnabled;
    bluePheromoneDiffusionEnabledInput.checked = !!effective;
  }
  if (bluePheromoneDiffusionStrengthInput) {
    const strength = Config.bluePheromoneDiffusionStrength != null
      ? Config.bluePheromoneDiffusionStrength
      : Config.pheromoneDiffusionStrength;
    bluePheromoneDiffusionStrengthInput.value = String(strength);
  }
  if (searchersFollowHomePheromonesInput) {
    searchersFollowHomePheromonesInput.checked = !!Config.searchersFollowHomePheromones;
  }
  if (searcherHomePheromoneWeightInput) {
    searcherHomePheromoneWeightInput.value = String(Config.searcherHomePheromoneWeight);
    if (searcherHomePheromoneWeightValueLabel) searcherHomePheromoneWeightValueLabel.textContent = searcherHomePheromoneWeightInput.value;
  }
  if (skipPheromoneOnCollisionPauseInput) {
    skipPheromoneOnCollisionPauseInput.checked = !!Config.skipPheromoneOnCollisionPause;
  }

  // Food & obstacles
  if (foodRadiusInput) {
    foodRadiusInput.value = String(Config.foodSpawnRadius);
    if (foodRadiusValueLabel) foodRadiusValueLabel.textContent = foodRadiusInput.value;
  }
  if (foodClusterCellSizeInput) {
    foodClusterCellSizeInput.value = String(Config.foodClusterCellSize);
    if (foodClusterCellSizeValueLabel) foodClusterCellSizeValueLabel.textContent = foodClusterCellSizeInput.value;
  }
  if (pheromoneClusterCellSizeInput) {
    pheromoneClusterCellSizeInput.value = String(Config.pheromoneClusterCellSize);
    if (pheromoneClusterCellSizeValueLabel) pheromoneClusterCellSizeValueLabel.textContent = pheromoneClusterCellSizeInput.value;
  }
  if (foodClusterColorInput) {
    foodClusterColorInput.value = Config.foodClusterColor || "#00ff00";
  }
  if (foodClusterTextColorInput) {
    foodClusterTextColorInput.value = Config.foodClusterTextColor || "#000000";
  }
  if (obstacleLineWidthInput) {
    obstacleLineWidthInput.value = String(Config.obstacleLineWidth != null ? Config.obstacleLineWidth : 3);
  }
  if (obstacleQueryMethodSelect) {
    const method = Config.obstacleQueryMethod != null ? Config.obstacleQueryMethod : 0;
    obstacleQueryMethodSelect.value = String(method);
  }
  if (showPheromonesInput) {
    showPheromonesInput.checked = !!Config.showPheromones;
  }
  if (useClusteredPheromonesInput) {
    useClusteredPheromonesInput.checked = !!Config.useClusteredPheromones;
  }
  if (useClusteredFoodInput) {
    useClusteredFoodInput.checked = !!Config.useClusteredFood;
  }
  if (showFoodCountsInput) {
    showFoodCountsInput.checked = !!Config.showFoodCounts;
  }
  if (showObstaclesInput) {
    showObstaclesInput.checked = !!Config.showObstacles;
  }

  // Entity colors
  if (antColorInput) {
    antColorInput.value = Config.antColor || "#ffffff";
  }
  if (redPheromoneColorInput) {
    redPheromoneColorInput.value = Config.pheromoneRedColor || "#fd2108";
  }
  if (bluePheromoneColorInput) {
    bluePheromoneColorInput.value = Config.pheromoneBlueColor || "#4287f5";
  }
  if (foodColorInput) {
    foodColorInput.value = Config.foodColor || "#00ff00";
  }
  if (obstacleColorInput) {
    obstacleColorInput.value = Config.obstacleColor || "#ffaf00";
  }
  if (nestColorInput) {
    nestColorInput.value = Config.nestColor || "#ce5114";
  }
  if (nestTextColorInput) {
    nestTextColorInput.value = Config.nestTextColor || "#ffffff";
  }
  if (antSizeInput) {
    antSizeInput.value = String(Config.antSize != null ? Config.antSize : 15);
  }
  if (antWidthInput) {
    antWidthInput.value = String(Config.antWidth != null ? Config.antWidth : 5);
  }

  // Image map
  if (useImageMapInput) {
    useImageMapInput.checked = !!Config.useImageMap;
  }
  if (mapUseImageSizeInput) {
    mapUseImageSizeInput.checked = !!Config.mapUseImageSize;
  }
  if (mapShowAllCellsInput) {
    mapShowAllCellsInput.checked = !!Config.mapShowAllCells;
  }
  if (mapImagePathInput) {
    mapImagePathInput.value = Config.mapImagePath || "";
  }
  if (mapSampleStepInput) {
    mapSampleStepInput.value = String(Config.mapSampleStep || 4);
  }
  if (mapSampleDepthInput) {
    mapSampleDepthInput.value = String(Config.mapSampleDepth != null ? Config.mapSampleDepth : 3);
  }
  if (mapFoodColorInput) {
    mapFoodColorInput.value = Config.mapFoodColor || "#00ff00";
  }
  if (mapObstacleColorInput) {
    mapObstacleColorInput.value = Config.mapObstacleColor || "#000000";
  }
  if (mapNestColorInput) {
    mapNestColorInput.value = Config.mapNestColor || "#0000ff";
  }
  if (mapFoodDepletedColorInput) {
    mapFoodDepletedColorInput.value = Config.mapFoodDepletedColor || "#000000";
  }
  if (mapFoodUnitsPerCellInput) {
    mapFoodUnitsPerCellInput.value = String(Config.mapFoodUnitsPerCell != null ? Config.mapFoodUnitsPerCell : 10);
  }
  if (mapColorToleranceInput) {
    mapColorToleranceInput.value = String(Config.mapColorTolerance != null ? Config.mapColorTolerance : 60);
    if (mapColorToleranceValueLabel) mapColorToleranceValueLabel.textContent = mapColorToleranceInput.value;
  }
  if (mapFoodColorToleranceInput) {
    const val = Config.mapFoodColorTolerance != null ? Config.mapFoodColorTolerance : "";
    mapFoodColorToleranceInput.value = val === "" ? "" : String(val);
  }
  if (mapObstacleColorToleranceInput) {
    const val = Config.mapObstacleColorTolerance != null ? Config.mapObstacleColorTolerance : "";
    mapObstacleColorToleranceInput.value = val === "" ? "" : String(val);
  }
  if (mapNestColorToleranceInput) {
    const val = Config.mapNestColorTolerance != null ? Config.mapNestColorTolerance : "";
    mapNestColorToleranceInput.value = val === "" ? "" : String(val);
  }
  if (mapPaletteMinDistanceInput) {
    const initial = Config.mapPaletteMinDistance != null ? Config.mapPaletteMinDistance : (Config.mapColorTolerance != null ? Config.mapColorTolerance : 60);
    mapPaletteMinDistanceInput.value = String(initial);
    if (mapPaletteMinDistanceValueLabel) mapPaletteMinDistanceValueLabel.textContent = mapPaletteMinDistanceInput.value;
  }
  if (mapObstacleDilateIterationsInput) {
    mapObstacleDilateIterationsInput.value = String(Config.mapObstacleDilateIterations != null ? Config.mapObstacleDilateIterations : 0);
  }
  if (mapObstacleErodeIterationsInput) {
    mapObstacleErodeIterationsInput.value = String(Config.mapObstacleErodeIterations != null ? Config.mapObstacleErodeIterations : 0);
  }
  if (mapFoodDilateIterationsInput) {
    mapFoodDilateIterationsInput.value = String(Config.mapFoodDilateIterations != null ? Config.mapFoodDilateIterations : 0);
  }
  if (mapFoodErodeIterationsInput) {
    mapFoodErodeIterationsInput.value = String(Config.mapFoodErodeIterations != null ? Config.mapFoodErodeIterations : 0);
  }
  if (mapNestDilateIterationsInput) {
    mapNestDilateIterationsInput.value = String(Config.mapNestDilateIterations != null ? Config.mapNestDilateIterations : 0);
  }
  if (mapNestErodeIterationsInput) {
    mapNestErodeIterationsInput.value = String(Config.mapNestErodeIterations != null ? Config.mapNestErodeIterations : 0);
  }
  if (colorDistanceMethodSelect) {
    const method = Config.colorDistanceMethod != null ? Config.colorDistanceMethod : 0;
    colorDistanceMethodSelect.value = String(method);
  }
  if (nestPlacementModeSelect) {
    const mode = Config.nestPlacementMode != null ? Config.nestPlacementMode : 2;
    nestPlacementModeSelect.value = String(mode);
  }
  if (mapShowNestMarkerInput) {
    mapShowNestMarkerInput.checked = !!Config.mapShowNestMarker;
  }
  if (mapNestUseCellSizeInput) {
    mapNestUseCellSizeInput.checked = !!Config.mapNestUseCellSize;
  }
  if (mapNestCellSizeScaleInput) {
    mapNestCellSizeScaleInput.value = String(
      Config.mapNestCellSizeScale != null ? Config.mapNestCellSizeScale : 0.9
    );
  }
  if (mapFoodRenderCellsOnlyInput) {
    mapFoodRenderCellsOnlyInput.checked = !!Config.mapFoodRenderCellsOnly;
  }
  if (mapFoodPlacementCellsOnlyInput) {
    mapFoodPlacementCellsOnlyInput.checked = !!Config.mapFoodPlacementCellsOnly;
  }

  // Config section
  if (configPathInput) {
    configPathInput.value = Config.configPath || "";
  }

  // Debug & HUD
  syncHUDUI();
  const debug = typeof getDebug === "function" ? getDebug() : { sensors: false, quadTree: false, antState: false };
  syncDebugUI(debug);
}
