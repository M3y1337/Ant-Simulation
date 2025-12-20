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
        const normLife = this.lifeAmount > 0 ? this.life / this.lifeAmount : 0;
        let alpha = normLife * 255;
        let radius = 3;

        if (Config.pheromoneDiffusionEnabled) {
            const ageFactor = 1 - normLife; // 0 = fresh, 1 = old
            const strength = Config.pheromoneDiffusionStrength != null ? Config.pheromoneDiffusionStrength : 1.0;
            // Older pheromones spread out and fade, similar to the sensing kernel.
            radius += ageFactor * 3 * strength;
            alpha *= 1 - 0.6 * ageFactor * strength;
        }

        if (this.type === PheromoneType.BLUE) {
            p.noStroke();
            p.fill(66, 135, 245, alpha);
        }
        else {
            p.noStroke();
            p.fill(253, 33, 8, alpha);
        }
        // Diameter is 2 * radius
        p.circle(this.pos.x, this.pos.y, radius * 2);
    }
}
