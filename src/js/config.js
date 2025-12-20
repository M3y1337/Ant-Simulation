export const Config = {
  // World / visuals
  simulationWidth: 3000,
  simulationHeight: 3000,
  camLiniency: 0.2, // extra space beyond simulation bounds for camera panning
  simulationSpeed: 1.0,
  antCount: 50,
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

  // Rendering detail
  pheromoneClusterCellSize: 8,
  foodClusterCellSize: 10,
  quadTreeCapacity: 4,
};
