import { Vector } from "./vector.js";
import { Config } from "./config.js";
export var PheromoneType;
(function (PheromoneType) {
    PheromoneType[PheromoneType["BLUE"] = 0] = "BLUE";
    PheromoneType[PheromoneType["RED"] = 1] = "RED";
})(PheromoneType || (PheromoneType = {}));
export class Pheromone {
    constructor(x, y, type) {
        // Type-specific lifetime with global fallback.
        if (type === PheromoneType.BLUE) {
            this.lifeAmount = Config.bluePheromoneLife != null ? Config.bluePheromoneLife : Config.pheromoneLife;
        }
        else {
            this.lifeAmount = Config.redPheromoneLife != null ? Config.redPheromoneLife : Config.pheromoneLife;
        }
        this.life = this.lifeAmount;
        this.pos = new Vector(x, y);
        this.type = type;
    }
    draw(p) {
        const normLife = this.lifeAmount > 0 ? this.life / this.lifeAmount : 0;
        let alpha = normLife * 255;
        let radius = 3;

        // Type-specific diffusion controls with global defaults.
        let useDiffusion;
        let strength;
        if (this.type === PheromoneType.BLUE) {
            useDiffusion = Config.bluePheromoneDiffusionEnabled != null ? Config.bluePheromoneDiffusionEnabled : Config.pheromoneDiffusionEnabled;
            strength = Config.bluePheromoneDiffusionStrength != null ? Config.bluePheromoneDiffusionStrength : Config.pheromoneDiffusionStrength;
        }
        else {
            useDiffusion = Config.redPheromoneDiffusionEnabled != null ? Config.redPheromoneDiffusionEnabled : Config.pheromoneDiffusionEnabled;
            strength = Config.redPheromoneDiffusionStrength != null ? Config.redPheromoneDiffusionStrength : Config.pheromoneDiffusionStrength;
        }
        if (strength == null)
            strength = 1.0;

        if (useDiffusion) {
            const ageFactor = 1 - normLife; // 0 = fresh, 1 = old
            // Older pheromones spread out and fade, similar to the sensing kernel.
            radius += ageFactor * 3 * strength;
            alpha *= 1 - 0.6 * ageFactor * strength;
        }

        // Apply global visual caps, if configured.
        if (Config.pheromoneMaxRadius != null) {
            radius = Math.min(radius, Config.pheromoneMaxRadius);
        }
        const intensityFactor = Config.pheromoneMaxIntensity != null ? Config.pheromoneMaxIntensity : 1.0;
        if (intensityFactor !== 1.0) {
            alpha *= intensityFactor;
        }
        if (alpha > 255)
            alpha = 255;
        if (alpha < 0)
            alpha = 0;

            const hexToRgb = (hex, fallback) => {
                if (!hex || typeof hex !== "string") return fallback;
                let h = hex.trim();
                if (h[0] === "#") h = h.slice(1);
                if (h.length === 3) {
                    h = h.split("").map((c) => c + c).join("");
                }
                if (h.length !== 6) return fallback;
                const num = parseInt(h, 16);
                if (Number.isNaN(num)) return fallback;
                return {
                    r: (num >> 16) & 255,
                    g: (num >> 8) & 255,
                    b: num & 255,
                };
            };

            const blueDefaults = { r: 66, g: 135, b: 245 };
            const redDefaults = { r: 253, g: 33, b: 8 };
            const blueRGB = hexToRgb(Config.pheromoneBlueColor, blueDefaults);
            const redRGB = hexToRgb(Config.pheromoneRedColor, redDefaults);

            if (this.type === PheromoneType.BLUE) {
                p.noStroke();
                p.fill(blueRGB.r, blueRGB.g, blueRGB.b, alpha);
            }
            else {
                p.noStroke();
                p.fill(redRGB.r, redRGB.g, redRGB.b, alpha);
        }
        // Diameter is 2 * radius
        p.circle(this.pos.x, this.pos.y, radius * 2);
    }
}
