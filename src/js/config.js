export const Config = {
  // World / visuals
  configPath: "cfg/imagemapconfig01.json", // optional JSON config URL/path for loading/saving
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
  mapPaletteMinDistance: 60,
  mapFoodUnitsPerCell: 3,
  mapFoodDepletedColor: "#000000",
  mapUseImageSize: false,
  mapShowAllCells: false,
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
  foodPickupPauseFrames: 15,
  foodDropPauseFrames: 8,
  postPauseEaseFrames: 10,
  postPauseMinSpeedFactor: 0.2,

  // Pheromones
  pheromoneLife: 200,
  pheromoneLowScoreThreshold: 0.05,
  pheromoneIgnoreProbability: 0.5,
  pheromoneDiffusionEnabled: true,
  pheromoneDiffusionStrength: 1.0,
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
};
