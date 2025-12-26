import { Vector } from "./vector.js";
import { Config } from "./config.js";
export class Food {
    constructor(x, y) {
        this.pos = new Vector(x, y);
        // Optional link back to an image-map cell index when using image-based maps.
        this.mapCellIndex = null;
    }
    draw(p) {
        p.noStroke();
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

        const defaults = { r: 0, g: 255, b: 0 };
        const rgb = hexToRgb(Config.foodColor, defaults);
        const radius = Config.foodRenderRadius != null ? Config.foodRenderRadius : 6;
        p.fill(rgb.r, rgb.g, rgb.b);
        p.circle(this.pos.x, this.pos.y, radius);
    }
}
