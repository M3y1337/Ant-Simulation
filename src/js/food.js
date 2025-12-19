import { Vector } from "./vector.js";
export class Food {
    constructor(x, y) {
        this.pos = new Vector(x, y);
    }
    draw(p) {
        p.noStroke();
        p.fill(0, 255, 0);
        p.circle(this.pos.x, this.pos.y, 6);
    }
}
