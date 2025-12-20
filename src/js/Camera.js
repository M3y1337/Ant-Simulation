export class Camera {
  constructor(p) {
    this.p = p;
    this.layer = p; // p5 instance or graphics
    this.renderer = this.layer._renderer;
    this.offset = { x: 0, y: 0 };
    this.zoom = 1;
    this.bounds = null;
  }

  begin() {
    this.renderer.translate(this.renderer.width / 2, this.renderer.height / 2);
    this.layer.scale(this.zoom);
    this.renderer.translate(this.offset.x, this.offset.y);
  }

  end() {
    this.renderer.resetMatrix();
  }

  pan(dx, dy) {
    this.checkBounds();
    this.offset.x += dx / this.zoom;
    this.offset.y += dy / this.zoom;
  }

  setBounds(x, y, w, h) {
    this.bounds = { x, y, w, h };
  }

  checkBounds() {
    if (this.bounds) {
      let x = this.offset.x;
      let y = this.offset.y;
      let w = this.bounds.w / this.zoom;
      let h = this.bounds.h / this.zoom;

      if (x < this.bounds.x) {
        x = this.bounds.x;
      } else if (x > this.bounds.x + w) {
        x = this.bounds.x + w;
      }

      if (y < this.bounds.y) {
        y = this.bounds.y;
      } else if (y > this.bounds.y + h) {
        y = this.bounds.y + h;
      }

      this.offset.x = x;
      this.offset.y = y;
    }
  } 

  zoomAt(delta, mx, my, forceNew = null, canvasWidth = this.layer.width, canvasHeight = this.layer.height) {
    let zoomFactor = 1.05;
    let newZoom = delta > 0 ? this.zoom / zoomFactor : this.zoom * zoomFactor;
    if (forceNew !== null) {
      newZoom = forceNew;
    }

    // Use main canvas size for UI interactions
    let canvasCenterX = canvasWidth / 2;
    let canvasCenterY = canvasHeight / 2;

    // Convert mouse position to world coordinates (relative to current offset/zoom)
    let worldX = (mx - canvasCenterX) / this.zoom - this.offset.x;
    let worldY = (my - canvasCenterY) / this.zoom - this.offset.y;

    // Update zoom
    this.zoom = newZoom;

    // Adjust offset so the point under the mouse stays in place
    this.offset.x = (mx - canvasCenterX) / this.zoom - worldX;
    this.offset.y = (my - canvasCenterY) / this.zoom - worldY;
  }

  // Convert world to screen coordinates
  worldToScreen(wx, wy) {
    let sx = (wx + this.offset.x) * this.zoom + this.renderer.width / 2;
    let sy = (wy + this.offset.y) * this.zoom + this.renderer.height / 2;
    return {x: sx, y: sy};
  }

  // Convert screen to world coordinates
  screenToWorld(sx, sy) {
    let wx = (sx - this.renderer.width / 2) / this.zoom - this.offset.x;
    let wy = (sy - this.renderer.height / 2) / this.zoom - this.offset.y;
    return {x: wx, y: wy};
  }
}