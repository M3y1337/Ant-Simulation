import { Pheromone, PheromoneType } from "./pheromone.js";
import { Global } from "./global.js";
import { Rectangle } from "./quadtree.js";
import { Vector, fromAngle, clone } from "./vector.js";
import { lineCollision, dist } from "./helper.js";
import { Config } from "./config.js";
export class Ant {
    constructor(x, y, direction, nest) {
        this.hasFood = false;
        this.movingToFood = false;
        this.framesUntilPheromone = Config.antPheromoneFrequency;
        this.speed = Config.antSpeed;
        this.sight = Config.antSight;
        this.FoV = 3 * Math.PI / 4;
        this.steeringStrength = 0.6;
        this.pos = new Vector(x, y);
        this.velocity = fromAngle(direction, 1);
        this.desiredVel = clone(this.velocity);
        this.nest = nest;
    }
    draw(p) {
        const h = 30;
        const w = 20;
        const angle = Math.atan2(this.velocity.y, this.velocity.x);
        p.push();
        p.translate(this.pos.x, this.pos.y);
        p.rotate(angle);
        p.noStroke();
        p.fill(255);
        p.beginShape();
        p.vertex(0, 0);
        p.vertex(-h, -w / 2);
        p.vertex(-h, w / 2);
        p.endShape(p.CLOSE);
        p.pop();
    }
    steer() {
        // Check for food in the ant's FoV
        if (!this.hasFood)
            this.findFood();
        else {
            // Check if nest is in radius
            if (dist(this.pos.x, this.pos.y, this.nest.pos.x, this.nest.pos.y) < this.nest.radius + this.sight) {
                const bearing = new Vector(this.nest.pos.x - this.pos.x, this.nest.pos.y - this.pos.y);
                this.desiredVel = bearing.normalize();
            }
        }
        // Check for pheromones
        if (!this.movingToFood) {
            const [FL, F, FR] = this.countPheromones();
            if ((F > FL) && (F > FR)) { }
            else if (FL > FR)
                this.desiredVel.rotate(-this.FoV / 2, true);
            else if (FR > FL)
                this.desiredVel.rotate(this.FoV / 2, true);
            else { }
        }
        // Avoid obstacles
        this.avoidObstacles();
        // Slight random wander
        const wanderStrength = 0.05;
        const angle = Math.random() * 2 * Math.PI - Math.PI;
        this.desiredVel.rotate(angle * wanderStrength, true);
        // Steer the ant
        this.applySteer();
    }
    move() {
        this.pos.add(this.velocity.scalarMultiply(this.speed), true);
        if (dist(this.pos.x, this.pos.y, this.nest.pos.x, this.nest.pos.y) < this.nest.radius) {
            if (this.hasFood) {
                this.hasFood = false;
                this.desiredVel.rotate(Math.PI, true);
                this.nest.counter++;
            }
        }
        if (this.framesUntilPheromone === 0) {
            if (this.hasFood)
                Global.redPheromones.insert(new Pheromone(this.pos.x, this.pos.y, PheromoneType.RED));
            else
                Global.bluePheromones.insert(new Pheromone(this.pos.x, this.pos.y, PheromoneType.BLUE));
            this.framesUntilPheromone = Config.antPheromoneFrequency;
        }
        else
            this.framesUntilPheromone--;
    }
    applySteer() {
        const subtracted = this.desiredVel.subtract(this.velocity);
        const desiredSteer = subtracted.scalarMultiply(this.steeringStrength);
        const acc = desiredSteer.limit(this.steeringStrength);
        this.velocity.add(acc, true);
        this.velocity.limit(this.speed, true);
    }
    findFood() {
        let minDist = Infinity;
        let closest;
        let index = -1;
        const foodRange = new Rectangle(this.pos.x, this.pos.y, this.sight, this.sight);
        const pool = Global.food.query(foodRange);
        for (let i = 0; i < pool.length; i++) {
            const distance = dist(this.pos.x, this.pos.y, pool[i].value.pos.x, pool[i].value.pos.y);
            if (distance < minDist) {
                // Check for collisions against all obstacles (more robust than spatially
                // filtering by obstacle midpoint, which can miss long segments like borders)
                let collided = false;
                for (let j of Global.obstacles) {
                    if (lineCollision(this.pos.x, this.pos.y, pool[i].value.pos.x, pool[i].value.pos.y, j.x1, j.y1, j.x2, j.y2))
                        collided = true;
                }
                if (collided)
                    continue;
                minDist = distance;
                closest = pool[i];
                index = i;
            }
        }
        if (closest && minDist <= this.sight) {
            this.movingToFood = true;
            const bearing = new Vector(closest.value.pos.x - this.pos.x, closest.value.pos.y - this.pos.y);
            this.desiredVel = bearing.normalize();
            if (minDist < 10) {
                this.hasFood = true;
                this.movingToFood = false;
                this.desiredVel.rotate(Math.PI, true);
                closest.flagged = true;
            }
        }
    }
    countPheromones() {
        const { sensors, sensorRadius } = this.getSensorInfo();
        const scores = [0, 0, 0];
        const pool = this.hasFood ? Global.bluePheromones : Global.redPheromones;
        const pheromoneRange = new Rectangle(this.pos.x, this.pos.y, this.sight, this.sight);
        for (let i of pool.query(pheromoneRange)) {
            const pheromone = i.value;
            const distances = [];
            for (let j of sensors)
                distances.push(dist(pheromone.pos.x, pheromone.pos.y, j.x, j.y));
            for (let j in scores) {
                if (distances[j] < sensorRadius)
                    scores[j] += pheromone.life / pheromone.lifeAmount;
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
    avoidObstacles() {
        // Scan routes starting from the desired direction and check if it collides
        const spacing = Math.PI / 12;
        for (let i = 0; i < 2 * Math.PI / spacing; i++) {
            let multiplier = -i / 2;
            if (i % 2 !== 0)
                multiplier = (i + 1) / 2;
            const newVelocity = this.desiredVel.rotate(multiplier * spacing);
            // Check for any obstacles
            const sightEnd = this.pos.add(newVelocity.scalarMultiply(this.sight));
            const line = {
                x1: this.pos.x,
                y1: this.pos.y,
                x2: sightEnd.x,
                y2: sightEnd.y
            };
            let collided = false;
            for (let o of Global.obstacles) {
                const collision = lineCollision(line.x1, line.y1, line.x2, line.y2, o.x1, o.y1, o.x2, o.y2);
                if (collision)
                    collided = true;
            }
            // If no collision, break and set the velocity
            if (!collided) {
                this.desiredVel = newVelocity;
                break;
            }
        }
    }
}
