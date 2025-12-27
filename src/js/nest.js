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
        // Choose a visual radius: in image map mode, optionally
        // draw the nest as a cell-sized circle while keeping
        // the logical nest radius (used for behaviour) unchanged.
        let drawRadius = this.radius;
        if (Config.useImageMap && Config.mapNestUseCellSize && ImageMap && ImageMap.cellWidth && ImageMap.cellHeight) {
            const base = Math.min(ImageMap.cellWidth, ImageMap.cellHeight) * 0.5;
            const scale = Config.mapNestCellSizeScale != null ? Config.mapNestCellSizeScale : 0.9;
            drawRadius = base * scale;
        }
        p.noStroke();
        p.fill(Config.nestColor || "#ce5114");
        p.circle(this.pos.x, this.pos.y, drawRadius * 2);
        p.fill(Config.nestTextColor || 255);
        // Scale counter text size with nest size and counter digits, clamped to reasonable limits.
        const txtSize = Math.min(Math.max(drawRadius * 0.8 * Math.max(2, String(this.counter).length), 12), 60);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(txtSize);
        p.text(`${this.counter}`, this.pos.x, this.pos.y);
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
