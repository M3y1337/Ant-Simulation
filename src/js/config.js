export const Config = {
  // World / visuals
  configPath: "", // optional JSON config URL/path for loading/saving
  simulationWidth: 1920,
  simulationHeight: 1080,
  useCamBounds: false,
  camLiniency: 0.2, // extra space beyond simulation bounds for camera panning
  simulationSpeed: 1.0,
  useImageMap: false,
  mapImagePath: "",
  mapSampleDepth: 3,
  mapSampleStep: 2,
  mapFoodColor: "#00ff00",
  mapObstacleColor: "#000000",
  mapNestColor: "#0000ff",
  mapColorTolerance: 60,
  // Optional per-kind overrides; when null, fall back to mapColorTolerance
  mapFoodColorTolerance: null,
  mapObstacleColorTolerance: null,
  mapNestColorTolerance: null,
  mapPaletteMinDistance: 60,
  mapFoodUnitsPerCell: 3,
  mapFoodDepletedColor: "#000000",
  mapUseImageSize: false,
  mapShowAllCells: false,
  // Morphological filters (iterations in cell space)
  // Erode: shrink regions; Dilate: expand regions.
  mapFoodErodeIterations: 0,
  mapFoodDilateIterations: 0,
  mapObstacleErodeIterations: 0,
  mapObstacleDilateIterations: 0,
  mapNestErodeIterations: 0,
  mapNestDilateIterations: 0,
  // 0: HSL, 1: HSV, 2: RGB, 3: CIEDE2000
  colorDistanceMethod: 0,
  // Nest placement (image map mode):
  // 0 = Simulation center
  // 1 = Center of all nest cells
  // 2 = Center of largest nest blob
  // 3 = Random nest cell
  nestPlacementMode: 2,
  // When using an image map, optionally still draw the nest circle/text marker.
  mapShowNestMarker: true,
  // In image map mode, optionally draw the nest as a
  // smaller, cell-sized circle instead of using the
  // logical nest radius.
  mapNestUseCellSize: false,
  mapNestCellSizeScale: 0.9,
  // Entity colors / draw params
  antColor: "#ffffff",
  antSize: 15,
  antWidth: 5,
  pheromoneRedColor: "#fd2108",
  pheromoneBlueColor: "#4287f5",
  foodColor: "#00ff00",
  foodClusterColor: "#00ff00",
  foodClusterTextColor: "#000000",
  obstacleColor: "#ffaf00",
  nestColor: "#ce5114",
  nestTextColor: "#ffffff",
  antCount: 100,
  foodSpawnRadius: 50,
  backgroundColor: "#242424",
  obstacleLineWidth: 3,
  // Obstacle line-of-sight query method:
  // 0 = fixed grid index (default), 1 = QuadTree query
  obstacleQueryMethod: 0,

  // Rendering toggles
  showHUD: true,
  showObstacles: true,
  showPheromones: true,
  useClusteredPheromones: false,
  useClusteredFood: true,
  showFoodCounts: true,

  // Ant behaviour
  antSpeed: 5,
  antSight: 80,
  antPheromoneFrequency: 4, // frames between pheromone drops
  antSteeringStrength: 0.7,
  antFoVDegrees: 135,
  antWanderStrength: 0.05,
  obstacleAvoidanceRandomness: 0.3,
  obstacleAvoidStrength: 0.6,
  wanderSpeedFactor: 0.85,
  trailSpeedFactor: 1.1,
  headedToFoodSpeedFactor: 1.0,
  headedHomeSpeedFactor: 1.0,
  obstacleSideSpeedFactor: 0.7,
  obstacleFrontSpeedFactor: 0.4,
  // Hard collision / boundary response
  collisionTurnMinDegrees: 120,
  collisionTurnMaxDegrees: 180,
  collisionPauseFrames: 4,
  boundaryNudgeDistance: 2,
  foodPickupPauseFrames: 15,
  foodDropPauseFrames: 8,
  postPauseEaseFrames: 10,
  postPauseMinSpeedFactor: 0.2,

  // Pheromones
  pheromoneLife: 200, // legacy default
  // Type-specific lifetimes (fallback to pheromoneLife when null)
  redPheromoneLife: null,
  bluePheromoneLife: null,
  pheromoneLowScoreThreshold: 0.05,
  pheromoneIgnoreProbability: 0.5,
  // Global diffusion defaults
  pheromoneDiffusionEnabled: true,
  pheromoneDiffusionStrength: 1.0,
  // Visual caps for pheromones
  // Optional maximum rendered radius (pixels) for any pheromone blob when diffusion is applied.
  // null = no explicit cap beyond the normal diffusion formulas.
  pheromoneMaxRadius: null,
  // Global intensity multiplier for pheromones (0..1 typical).
  // 1.0 keeps current brightness; lower values dim all pheromone visuals.
  pheromoneMaxIntensity: 1.0,
  // Type-specific diffusion overrides (fallback to global when null)
  redPheromoneDiffusionEnabled: null,
  redPheromoneDiffusionStrength: null,
  bluePheromoneDiffusionEnabled: null,
  bluePheromoneDiffusionStrength: null,
  useRedPheromones: true,
  useBluePheromones: true,
  searchersFollowHomePheromones: false,
  searcherHomePheromoneWeight: 1.0,

  // Simulation flow
  pauseWhenNoFood: true,
  autoStartSimulation: false,

  // Rendering detail
  pheromoneClusterCellSize: 8,
  foodClusterCellSize: 10,
  quadTreeCapacity: 4,
  // When using an image map, optionally render and place food only via cells.
  mapFoodRenderCellsOnly: false,
  mapFoodPlacementCellsOnly: false,
  // Whether to suppress the pheromone drop on frames where a collision pause is triggered.
  // When true, ants will not drop a pheromone on the exact frame they begin a collision pause.
  skipPheromoneOnCollisionPause: true,
};
