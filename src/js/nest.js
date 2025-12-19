import { Vector } from "./vector.js";
import { Ant } from "./ant.js";
import { dist } from "./helper.js";
import { Global } from "./global.js";
import { Food } from "./food.js";
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
        p.noStroke();
        p.fill("#ce5114");
        p.circle(this.pos.x, this.pos.y, this.radius * 2);
        p.fill(255);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(30);
        p.text(`${this.counter}`, this.pos.x, this.pos.y);
    }
    spawnFood(x, y, radius) {
        for (let i = -radius; i < radius; i += 10) {
            for (let j = -radius; j < radius; j += 10) {
                if (dist(x, y, x + i, y + j) < radius)
                    Global.food.insert(new Food(x + i, y + j));
            }
        }
    }
}
