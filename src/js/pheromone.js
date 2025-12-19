import { Vector } from "./vector.js";
import { Config } from "./config.js";
export var PheromoneType;
(function (PheromoneType) {
    PheromoneType[PheromoneType["BLUE"] = 0] = "BLUE";
    PheromoneType[PheromoneType["RED"] = 1] = "RED";
})(PheromoneType || (PheromoneType = {}));
export class Pheromone {
    constructor(x, y, type) {
        this.lifeAmount = Config.pheromoneLife;
        this.life = this.lifeAmount;
        this.pos = new Vector(x, y);
        this.type = type;
    }
    draw(p) {
        const alpha = (this.life / this.lifeAmount) * 255;
        if (this.type === PheromoneType.BLUE) {
            p.noStroke();
            p.fill(66, 135, 245, alpha);
        }
        else {
            p.noStroke();
            p.fill(253, 33, 8, alpha);
        }
        // Diameter is 2 * radius (3)
        p.circle(this.pos.x, this.pos.y, 6);
    }
}
