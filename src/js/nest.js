import { Vector } from "./vector.js";
import { Ant } from "./ant.js";
import { distSquared } from "./helper.js";
import { Global } from "./global.js";
import { Food } from "./food.js";
import { Config } from "./config.js";
import { ImageMap } from "./imagemap.js";
export class Nest {
    constructor(x, y, antAmount) {
        this.ants = [];
        this.counter = 0;
        this.radius = 50;
        this.pos = new Vector(x, y);
        const spacing = 2 * Math.PI / antAmount;
        for (let i = 0; i < antAmount; i++)
            this.ants.push(new Ant(x, y, i * spacing, this));
    }
    draw(p) {
            // Visual nest representation.
            // In image map / pixel mode, optionally use a crisp, cell-aligned
            // shape; otherwise fall back to the original circular nest.
            let drawRadius = this.radius;
            const useCellSize = Config.useImageMap && ImageMap && ImageMap.cellWidth && ImageMap.cellHeight;

            if (Config.pixelMode && Config.pixelNestAsCell && useCellSize) {
                const base = Math.min(ImageMap.cellWidth, ImageMap.cellHeight) * 0.5;
                const scale = Config.mapNestCellSizeScale != null ? Config.mapNestCellSizeScale : 0.9;
                drawRadius = base * scale;

                const w = drawRadius * 2;
                const h = drawRadius * 2;

                p.noStroke();
                p.rectMode(p.CENTER);
                // Outer solid block.
                p.fill(Config.nestColor || "#ce5114");
                p.rect(this.pos.x, this.pos.y, w, h);
                // Inner highlight to give a subtle pixel-art feel.
                const inset = Math.max(1, Math.min(w, h) * 0.25);
                p.fill(255, 255, 255, 40);
                p.rect(this.pos.x, this.pos.y, w - inset, h - inset);
            }
            else {
                // Original circular nest.
                if (Config.useImageMap && Config.mapNestUseCellSize && useCellSize) {
                    const base = Math.min(ImageMap.cellWidth, ImageMap.cellHeight) * 0.5;
                    const scale = Config.mapNestCellSizeScale != null ? Config.mapNestCellSizeScale : 0.9;
                    drawRadius = base * scale;
                }
                p.noStroke();
                p.fill(Config.nestColor || "#ce5114");
                p.circle(this.pos.x, this.pos.y, drawRadius * 2);
            }

            // Counter text (optionally drawn in both modes).
            if (Config.showNestFoodCount) {
                p.fill(Config.nestTextColor || 255);
                const txtSize = Math.min(Math.max(drawRadius * 0.8 * Math.max(2, String(this.counter).length), 12), 60);
                p.textAlign(p.CENTER, p.CENTER);
                p.textSize(txtSize);
                p.text(`${this.counter}`, this.pos.x, this.pos.y);
            }
    }
    spawnFood(x, y, radius) {
        for (let i = -radius; i < radius; i += 10) {
            for (let j = -radius; j < radius; j += 10) {
                if (distSquared(x, y, x + i, y + j) < radius * radius)
                    Global.food.insert(new Food(x + i, y + j));
            }
        }
    }
}
