import { Pheromone, PheromoneType } from "./pheromone.js";
import { Global } from "./global.js";
import { getObstaclesNearLine } from "./obstacle.js";
import { Rectangle } from "./quadtree.js";
import { Vector, fromAngle, clone } from "./vector.js";
import { lineCollision, distSquared } from "./helper.js";
import { Config } from "./config.js";
import { onMapFoodConsumed, ImageMap, isLineBlockedByObstacleCells } from "./imagemap.js";
export class Ant {
    constructor(x, y, direction, nest) {
        this.hasFood = false;
        this.movingToFood = false;
        this.framesUntilPheromone = Config.antPheromoneFrequency;
        this.speed = Config.antSpeed;
        this.sight = Config.antSight;
        this.FoV = (Config.antFoVDegrees * Math.PI) / 180;
        this.steeringStrength = Config.antSteeringStrength;
        this.wanderStrength = Config.antWanderStrength;
        this.pos = new Vector(x, y);
        this.velocity = fromAngle(direction, 1);
        this.desiredVel = clone(this.velocity);
        this.nest = nest;
        this.stateTags = [];
        this.pauseFrames = 0;
        this.lastPheromoneDetected = false;
        this.lastObstacleHitSeverity = 0; // 0 = none, 1 = side, 2 = front/strong
        this.postPauseFramesRemaining = 0;
        this.wasPausedLastFrame = false;
        this.suppressPheromoneDropThisFrame = false;
    }
    draw(p) {
        const h = Config.antSize || 15;
        const w = Config.antWidth || 5;
        const angle = Math.atan2(this.velocity.y, this.velocity.x);
        p.push();
        p.translate(this.pos.x, this.pos.y);
        p.rotate(angle);
        p.noStroke();
        p.fill(Config.antColor || 255);
        p.beginShape();
        p.vertex(0, 0);
        p.vertex(-h, -w / 2);
        p.vertex(-h, w / 2);
        p.endShape(p.CLOSE);
        p.pop();
    }
    steer() {
        // Reset current state tags for this frame
        this.stateTags = [];
        this.lastPheromoneDetected = false;
        if (this.hasFood) {
            this.stateTags.push("has food");
        }
        // Check for food in the ant's FoV
        if (!this.hasFood) {
            this.findFood();
            if (this.movingToFood) {
                this.stateTags.push("moving to food");
            }
            else {
                this.stateTags.push("searching food");
            }
        } else {
            // Check if nest is in radius
            const maxDistToNestSq = (this.nest.radius + this.sight) * (this.nest.radius + this.sight);
            const distNestSq = distSquared(this.pos.x, this.pos.y, this.nest.pos.x, this.nest.pos.y);
            if (distNestSq < maxDistToNestSq) {
                const bearing = new Vector(this.nest.pos.x - this.pos.x, this.nest.pos.y - this.pos.y);
                this.desiredVel = bearing.normalize();
                this.stateTags.push("heading home");
            }
        }
        // Check for pheromones
        let pheromoneDetected = false;
        let pheromoneTypeLabel = null;
        if (!this.movingToFood) {
            const [FL, F, FR] = this.countPheromones();
            const maxPheromoneScore = Math.max(FL, F, FR);
            if (maxPheromoneScore > 0) {
                pheromoneDetected = true;
                pheromoneTypeLabel = this.hasFood ? "home" : "food";
            }
            if ((F > FL) && (F > FR)) { 
                // Go straight
            } else if (FL > FR)
                this.desiredVel.rotate(-this.FoV / 2, true);
            else if (FR > FL)
                this.desiredVel.rotate(this.FoV / 2, true);
            else if (FL === FR && FL > 0) {    
                const angle = (Math.random() < 0.5 ? -1 : 1) * this.FoV / 4;
                this.desiredVel.rotate(angle, true);
            } else {
                // No pheromones detected, do nothing (for now)
            }
        }
        if (pheromoneDetected && pheromoneTypeLabel) {
            this.lastPheromoneDetected = true;
            this.stateTags.push(`following ${pheromoneTypeLabel} pheromone`);
        }
        // Avoid obstacles
        this.avoidObstacles();
        // Slight random wander
        const angle = Math.random() * 2 * Math.PI - Math.PI;
        this.desiredVel.rotate(angle * this.wanderStrength, true);
        // Steer the ant
        this.applySteer();
    }
    move() {
        if (this.pauseFrames > 0) {
            this.pauseFrames--;
            this.wasPausedLastFrame = true;
            return;
        }

        if (this.wasPausedLastFrame) {
            this.postPauseFramesRemaining = Config.postPauseEaseFrames || 0;
            this.wasPausedLastFrame = false;
        }

        let effectiveSpeed = this.speed;

        // Modulate speed based on whether we are following a pheromone trail or just wandering.
        if (this.lastPheromoneDetected) {
            effectiveSpeed *= Config.trailSpeedFactor;
        } else {
            effectiveSpeed *= Config.wanderSpeedFactor;
        }

        // Additional modulation based on high-level intent.
        if (this.movingToFood && !this.hasFood) {
            effectiveSpeed *= Config.headedToFoodSpeedFactor;
        } else if (this.hasFood) {
            effectiveSpeed *= Config.headedHomeSpeedFactor;
        }

        // Further slow down based on recent actual collisions.
        if (this.lastObstacleHitSeverity === 1) {
            effectiveSpeed *= Config.obstacleSideSpeedFactor;
        } else if (this.lastObstacleHitSeverity === 2) {
            effectiveSpeed *= Config.obstacleFrontSpeedFactor;
        }

        // Ease out of pauses: ramp speed from a minimum factor back to full.
        if (this.postPauseFramesRemaining > 0 && Config.postPauseEaseFrames > 0) {
            const total = Config.postPauseEaseFrames;
            const progressed = total - this.postPauseFramesRemaining;
            const alpha = Math.max(0, Math.min(1, progressed / total));
            const minFactor = Config.postPauseMinSpeedFactor != null ? Config.postPauseMinSpeedFactor : 0.4;
            const easeFactor = minFactor + (1 - minFactor) * alpha;
            effectiveSpeed *= easeFactor;
            this.postPauseFramesRemaining--;
        }

        // Proposed movement in this frame.
        const step = this.velocity.scalarMultiply(effectiveSpeed);
        let nextPos = this.pos.add(step);

        // Hard collision test along the movement segment. In normal
        // mode use line segments; in pixel-mode image-map cell
        // obstacle mode, test against obstacle cells instead.
        let collidedWithObstacle = false;
        const useCellObstacles = Config.pixelMode && Config.useImageMap && Config.pixelUseCellObstacles;
        if (useCellObstacles) {
            if (isLineBlockedByObstacleCells(this.pos.x, this.pos.y, nextPos.x, nextPos.y)) {
                collidedWithObstacle = true;
            }
        }
        else if (Global.obstacles && Global.obstacles.length > 0) {
            const obstacles = getObstaclesNearLine(this.pos.x, this.pos.y, nextPos.x, nextPos.y);
            for (const o of obstacles) {
                if (lineCollision(this.pos.x, this.pos.y, nextPos.x, nextPos.y, o.x1, o.y1, o.x2, o.y2)) {
                    collidedWithObstacle = true;
                    break;
                }
            }
        }

        // Strict simulation bounds: ants are clamped to the world rectangle
        // and "bounce" by turning around if they hit an edge.
        const worldWidth = Config.simulationWidth;
        const worldHeight = Config.simulationHeight;
        let hitBoundary = false;
        let hitLeft = false, hitRight = false, hitTop = false, hitBottom = false;
        if (worldWidth != null && worldHeight != null) {
            if (nextPos.x < 0) {
                nextPos.x = 0;
                hitBoundary = true;
                hitLeft = true;
            } else if (nextPos.x > worldWidth) {
                nextPos.x = worldWidth;
                hitBoundary = true;
                hitRight = true;
            }
            if (nextPos.y < 0) {
                nextPos.y = 0;
                hitBoundary = true;
                hitTop = true;
            } else if (nextPos.y > worldHeight) {
                nextPos.y = worldHeight;
                hitBoundary = true;
                hitBottom = true;
            }
        }

        if (collidedWithObstacle || hitBoundary) {
            // Treat as a strong obstacle hit: turn the ant around to avoid
            // repeated penetration. Speed slow-down is applied on the
            // following frames based on this collision state.

            // For interior obstacle collisions, do not advance into the wall.
            if (collidedWithObstacle && !hitBoundary) {
                nextPos = this.pos;
            }
            if (hitBoundary) {
                // Reflect velocity away from the touched edges.
                if (hitLeft) {
                    this.velocity.x = Math.abs(this.velocity.x) || this.speed;
                } else if (hitRight) {
                    this.velocity.x = -Math.abs(this.velocity.x) || -this.speed;
                }
                if (hitTop) {
                    this.velocity.y = Math.abs(this.velocity.y) || this.speed;
                } else if (hitBottom) {
                    this.velocity.y = -Math.abs(this.velocity.y) || -this.speed;
                }

                // Small jitter so they don't run perfectly parallel to the wall.
                const jitterDeg = 10;
                const jitterRad = (Math.PI / 180) * jitterDeg;
                const jitter = (Math.random() * 2 - 1) * jitterRad;
                this.velocity.rotate(jitter, true);
                this.desiredVel = clone(this.velocity);

                // Nudge slightly back inside the world so they don't get stuck on the exact edge.
                const nudgeDist = Config.boundaryNudgeDistance != null ? Config.boundaryNudgeDistance : 2;
                const dir = this.velocity.normalize();
                nextPos = nextPos.add(dir.scalarMultiply(nudgeDist));

                // Re-clamp just in case the nudge overshoots.
                if (worldWidth != null && worldHeight != null) {
                    if (nextPos.x < 0) nextPos.x = 0;
                    else if (nextPos.x > worldWidth) nextPos.x = worldWidth;
                    if (nextPos.y < 0) nextPos.y = 0;
                    else if (nextPos.y > worldHeight) nextPos.y = worldHeight;
                }
            } else if (collidedWithObstacle) {
                // Turn away from interior obstacles using configurable turn range.
                const minDeg = Config.collisionTurnMinDegrees != null ? Config.collisionTurnMinDegrees : 120;
                const maxDeg = Config.collisionTurnMaxDegrees != null ? Config.collisionTurnMaxDegrees : 180;
                const minRad = (minDeg * Math.PI) / 180;
                const maxRad = (maxDeg * Math.PI) / 180;
                const angle = minRad + Math.random() * (maxRad - minRad);
                const sign = Math.random() < 0.5 ? -1 : 1;
                this.velocity.rotate(sign * angle, true);
                this.desiredVel = clone(this.velocity);
            }

            const collisionPause = Config.collisionPauseFrames != null ? Config.collisionPauseFrames : 0;
            if (collisionPause > 0) {
                this.pauseFrames = Math.max(this.pauseFrames, collisionPause);
            }

                        if (Config.skipPheromoneOnCollisionPause) {
                            this.suppressPheromoneDropThisFrame = true;
                        }
        }

        this.pos.assign(nextPos);
        // In pixel mode, snap positions to the centres of image-map cells
        // to keep movement visually aligned to the underlying grid.
        if (Config.pixelMode && ImageMap && ImageMap.cols && ImageMap.rows) {
            const cellW = ImageMap.cellWidth;
            const cellH = ImageMap.cellHeight;
            if (cellW > 0 && cellH > 0) {
                let col = Math.round(this.pos.x / cellW - 0.5);
                let row = Math.round(this.pos.y / cellH - 0.5);
                if (col < 0) col = 0;
                else if (col >= ImageMap.cols) col = ImageMap.cols - 1;
                if (row < 0) row = 0;
                else if (row >= ImageMap.rows) row = ImageMap.rows - 1;
                this.pos.x = (col + 0.5) * cellW;
                this.pos.y = (row + 0.5) * cellH;
            }
        }
        const insideNestRadiusSq = this.nest.radius * this.nest.radius;
        if (distSquared(this.pos.x, this.pos.y, this.nest.pos.x, this.nest.pos.y) < insideNestRadiusSq) {
            if (this.hasFood) {
                this.hasFood = false;
                this.desiredVel.rotate(Math.PI, true);
                this.nest.counter++;
                this.pauseFrames = Config.foodDropPauseFrames || 0;
            }
        }
        if (this.framesUntilPheromone === 0) {
            if (!this.suppressPheromoneDropThisFrame) {
                if (this.hasFood) {
                    Global.redPheromones.insert(new Pheromone(this.pos.x, this.pos.y, PheromoneType.RED));
                } else {
                    Global.bluePheromones.insert(new Pheromone(this.pos.x, this.pos.y, PheromoneType.BLUE));
                }
                this.framesUntilPheromone = Config.antPheromoneFrequency;
            }
            // Clear suppression after we've respected it for one frame.
            this.suppressPheromoneDropThisFrame = false;
        }
        else {
            this.framesUntilPheromone--;
        }

        // Update collision severity based solely on actual collisions or
        // boundary hits from this frame, not on sensor-based avoidance.
        this.lastObstacleHitSeverity = (collidedWithObstacle || hitBoundary) ? 2 : 0;
    }
    applySteer() {
        const subtracted = this.desiredVel.subtract(this.velocity);
        const desiredSteer = subtracted.scalarMultiply(this.steeringStrength);
        const acc = desiredSteer.limit(this.steeringStrength);
        this.velocity.add(acc, true);
        this.velocity.limit(this.speed, true);

        // Optional heading quantization: snap the velocity direction to
        // 4- or 8-way headings while preserving its current magnitude.
        const dirs = Config.antHeadingQuantizationDirections || 0;
        if (dirs === 4 || dirs === 8) {
            const angle = Math.atan2(this.velocity.y, this.velocity.x);
            const step = (2 * Math.PI) / dirs;
            const snapped = Math.round(angle / step) * step;
            const mag = this.velocity.magnitude();
            const snappedVec = fromAngle(snapped, 1).scalarMultiply(mag);
            this.velocity.assign(snappedVec);
        }
    }
    findFood() {
        let minDist = Infinity;
        let closest;
        const foodRange = new Rectangle(this.pos.x, this.pos.y, this.sight, this.sight);
        const pool = Global.food.query(foodRange);
        for (let i = 0; i < pool.length; i++) { 
            const distanceSq = distSquared(this.pos.x, this.pos.y, pool[i].value.pos.x, pool[i].value.pos.y);
            if (distanceSq < minDist) {
                // Ants cannot find food that is behind obstacles or
                // obstacle cells (in pixel-mode cell obstacle mode).
                const useCellObstacles = Config.pixelMode && Config.useImageMap && Config.pixelUseCellObstacles;
                let blocked = false;
                if (useCellObstacles) {
                    blocked = isLineBlockedByObstacleCells(this.pos.x, this.pos.y, pool[i].value.pos.x, pool[i].value.pos.y);
                }
                else {
                    const obstacles = getObstaclesNearLine(this.pos.x, this.pos.y, pool[i].value.pos.x, pool[i].value.pos.y);
                    for (let j of obstacles) {
                        if (lineCollision(this.pos.x, this.pos.y, pool[i].value.pos.x, pool[i].value.pos.y, j.x1, j.y1, j.x2, j.y2)) {
                            blocked = true;
                            break;
                        }
                    }
                }
                if (blocked) {
                    continue;
                }
                minDist = distanceSq;
                closest = pool[i];
            }
        }
        const sightSq = this.sight * this.sight;
        if (closest && minDist <= sightSq) {
            this.movingToFood = true;
            const bearing = new Vector(closest.value.pos.x - this.pos.x, closest.value.pos.y - this.pos.y);
            this.desiredVel = bearing.normalize();
            const eatDistSq = 10 * 10;
            if (minDist < eatDistSq) {
                this.hasFood = true;
                this.movingToFood = false;
                this.desiredVel.rotate(Math.PI, true);
                const food = closest.value;
                if (food && food.mapCellIndex != null) {
                    onMapFoodConsumed(food.mapCellIndex);
                }
                closest.flagged = true;
                this.pauseFrames = Config.foodPickupPauseFrames || 0;
            }
        }
    }
    countPheromones() {
        const { sensors, sensorRadius } = this.getSensorInfo();
        const sensorRadiusSq = sensorRadius * sensorRadius;
        const scores = [0, 0, 0];
        const pheromoneRange = new Rectangle(this.pos.x, this.pos.y, this.sight, this.sight);
        const accumulateFromTree = (tree, scoreFn, weight = 1.0, useDiffusion, diffusionStrength) => {
            for (let i of tree.query(pheromoneRange)) {
                const pheromone = i.value;
                const base = pheromone.life / pheromone.lifeAmount;
                let baseValue = scoreFn(base) * weight;
                if (baseValue <= 0) continue;

                for (let idx = 0; idx < sensors.length; idx++) {
                    const sensor = sensors[idx];
                    const dSq = distSquared(pheromone.pos.x, pheromone.pos.y, sensor.x, sensor.y);
                    if (dSq >= sensorRadiusSq) continue;

                    let value = baseValue;
                    if (useDiffusion) {
                        // Age-dependent diffusion kernel: older pheromones diffuse further but more weakly.
                        const ageFactor = 1 - base; // 0 = fresh, 1 = old
                        const strength = diffusionStrength != null ? diffusionStrength : 1.0;
                        const sigmaBase = sensorRadius * 0.4;
                        const sigma = sigmaBase * (1 + ageFactor * strength); // stronger diffusion => larger sigma
                        const twoSigmaSq = 2 * sigma * sigma;
                        const distWeight = Math.exp(-dSq / twoSigmaSq);
                        // Slightly bias toward preserving total mass while diffusing.
                        value = baseValue * distWeight;
                    }

                    scores[idx] += value;
                }
            }
        };

        // Determine which pheromone type to consider based on whether the ant has food.
        // Home pherhormones (blue) are dropped by ants searching for food, and followed by ants carrying food in order to return home.
        // Food pheromones (red) are dropped by ants carrying food, and followed by ants searching for food in order to find food sources.
        const redUseDiff = Config.redPheromoneDiffusionEnabled != null ? Config.redPheromoneDiffusionEnabled : Config.pheromoneDiffusionEnabled;
        let redStrength = Config.redPheromoneDiffusionStrength != null ? Config.redPheromoneDiffusionStrength : Config.pheromoneDiffusionStrength;
        if (redStrength == null)
            redStrength = 1.0;

        const blueUseDiff = Config.bluePheromoneDiffusionEnabled != null ? Config.bluePheromoneDiffusionEnabled : Config.pheromoneDiffusionEnabled;
        let blueStrength = Config.bluePheromoneDiffusionStrength != null ? Config.bluePheromoneDiffusionStrength : Config.pheromoneDiffusionStrength;
        if (blueStrength == null)
            blueStrength = 1.0;

        if (this.hasFood) {
            // Ants carrying food follow home (blue) pheromones in the forward direction.
            if (Config.useBluePheromones) {
                accumulateFromTree(Global.bluePheromones, (base) => base, 1.0, blueUseDiff, blueStrength);
            }
        } else {
            // Searchers always consider food (red) pheromones if enabled.
            if (Config.useRedPheromones) {
                accumulateFromTree(Global.redPheromones, (base) => base, 1.0, redUseDiff, redStrength);
            }
            // Optionally let searchers also follow home (blue) pheromones using an inverted score,
            // so they tend to move toward older parts of the trail (away from the nest).
            if (Config.searchersFollowHomePheromones && Config.useBluePheromones && Config.searcherHomePheromoneWeight > 0) {
                accumulateFromTree(
                    Global.bluePheromones,
                    (base) => 1 - base,
                    Config.searcherHomePheromoneWeight,
                    blueUseDiff,
                    blueStrength
                );
            }
        }
        const maxScore = Math.max(scores[0], scores[1], scores[2]);
        if (maxScore > 0 && maxScore < Config.pheromoneLowScoreThreshold) {
            if (Math.random() < Config.pheromoneIgnoreProbability) {
                return [0, 0, 0];
            }
        }
        return scores;
    }
    getSensorInfo() {
        const sensorAngle = this.FoV / 2;
        const otherAngle = (Math.PI - sensorAngle) / 2;
        const pointDistance = this.sight * Math.sin(sensorAngle) / Math.sin(otherAngle);
        const sensorRadius = Math.floor(pointDistance) / 2;
        const sensors = [
            this.pos.add(this.desiredVel.rotate(-sensorAngle).scalarMultiply(this.sight)),
            this.pos.add(this.desiredVel.scalarMultiply(this.sight)),
            this.pos.add(this.desiredVel.rotate(sensorAngle).scalarMultiply(this.sight))
        ];
        return { sensors, sensorRadius };
    }
    // Debug helper for visualizing pheromone sensors
    debugDrawSensors(p) {
        const { sensors, sensorRadius } = this.getSensorInfo();
        p.push();
        p.noFill();
        p.stroke(0, 255, 255, 128);
        p.strokeWeight(1);
        for (let sensor of sensors) {
            p.line(this.pos.x, this.pos.y, sensor.x, sensor.y);
            p.circle(sensor.x, sensor.y, sensorRadius * 2);
        }
        p.pop();
    }
    // Debug helper for visualizing the ant's current behavior/state
    debugDrawState(p) {
        if (!this.stateTags || this.stateTags.length === 0) {
            return;
        }
        const label = this.stateTags.join(", ");
        p.push();
        p.fill(255);
        p.noStroke();
        p.textAlign(p.CENTER, p.BOTTOM);
        p.textSize(10);
        p.text(label, this.pos.x, this.pos.y - 20);
        p.pop();
    }
    avoidObstacles() {
        // Use the three sensors to decide which way to turn around obstacles.
        // Left sensor collision -> turn right; right sensor collision -> turn left;
        // center-only collision -> choose a random side. Then, on the preferred side,
        // scan for a collision-free direction, with a bit of configurable randomness
        // in the turn angle.
        const spacing = Math.PI / 12;
        const { sensors } = this.getSensorInfo();

        const sensorHits = [false, false, false]; // [left, center, right]
        const checkHit = (sensorPos) => {
            const line = {
                x1: this.pos.x,
                y1: this.pos.y,
                x2: sensorPos.x,
                y2: sensorPos.y,
            };
            const useCellObstacles = Config.pixelMode && Config.useImageMap && Config.pixelUseCellObstacles;
            if (useCellObstacles) {
                return isLineBlockedByObstacleCells(line.x1, line.y1, line.x2, line.y2);
            }
            const obstacles = getObstaclesNearLine(line.x1, line.y1, line.x2, line.y2);
            for (let o of obstacles) {
                if (lineCollision(line.x1, line.y1, line.x2, line.y2, o.x1, o.y1, o.x2, o.y2)) {
                    return true;
                }
            }
            return false;
        };

        for (let idx = 0; idx < sensors.length; idx++) {
            if (sensors[idx]) {
                sensorHits[idx] = checkHit(sensors[idx]);
            }
        }

        const hitLeft = sensorHits[0];
        const hitCenter = sensorHits[1];
        const hitRight = sensorHits[2];

        // Determine preferred turn direction: +1 = right, -1 = left, 0 = no bias.
        let preferredSign = 0;
        if (hitLeft && !hitRight) {
            preferredSign = 1; // obstacle on left -> turn right
        } else if (hitRight && !hitLeft) {
            preferredSign = -1; // obstacle on right -> turn left
        } else if (hitCenter && !hitLeft && !hitRight) {
            preferredSign = Math.random() < 0.5 ? -1 : 1; // center only -> random side
        }

        // If no sensors see an obstacle, keep current desiredVel.
        if (!hitLeft && !hitCenter && !hitRight) {
            return;
        }

        const randomness = Config.obstacleAvoidanceRandomness || 0;
        const jitterBase = randomness > 0 ? 1 + (Math.random() * 2 - 1) * randomness : 1;

        const tryDirection = (multiplier) => {
            let angle = multiplier * spacing;
            if (multiplier !== 0) {
                angle *= jitterBase;
            }
            const newVelocity = this.desiredVel.rotate(angle);
            const sightEnd = this.pos.add(newVelocity.scalarMultiply(this.sight));
            const line = {
                x1: this.pos.x,
                y1: this.pos.y,
                x2: sightEnd.x,
                y2: sightEnd.y,
            };
            const obstacles = getObstaclesNearLine(line.x1, line.y1, line.x2, line.y2);
            for (let o of obstacles) {
                if (lineCollision(line.x1, line.y1, line.x2, line.y2, o.x1, o.y1, o.x2, o.y2)) {
                    return false; // still colliding
                }
            }
            const strength = Config.obstacleAvoidStrength != null ? Config.obstacleAvoidStrength : 1.0;
            if (strength >= 1) {
                this.desiredVel = newVelocity;
            } else if (strength > 0) {
                const blended = this.desiredVel
                    .add(newVelocity.subtract(this.desiredVel).scalarMultiply(strength))
                    .normalize();
                this.desiredVel = blended;
            }
            return true;
        };

        const maxSteps = Math.floor((2 * Math.PI) / spacing);

        if (preferredSign === 0) {
            // No clear side preference: fall back to symmetric fan scan around desiredVel.
            for (let i = 0; i < maxSteps; i++) {
                let multiplier = -i / 2;
                if (i % 2 !== 0) {
                    multiplier = (i + 1) / 2;
                }
                if (tryDirection(multiplier)) {
                    break;
                }
            }
        } else {
            // Biased scan: start straight, then fan out primarily on the preferred side.
            for (let i = 0; i < maxSteps; i++) {
                let multiplier;
                if (i === 0) {
                    multiplier = 0;
                } else {
                    const magIndex = Math.ceil(i / 2);
                    const sign = i % 2 === 1 ? preferredSign : -preferredSign;
                    multiplier = sign * magIndex;
                }
                if (tryDirection(multiplier)) {
                    break;
                }
            }
        }
    }
}
