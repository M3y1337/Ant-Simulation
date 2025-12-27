export class Camera {
  constructor(p) {
    this.p = p;
    this.layer = p; // p5 instance or graphics
    this.renderer = this.layer._renderer;
    this.offset = { x: 0, y: 0 };
    this.zoom = 1;
    // World-space bounds for the camera center, if enabled.
    // Stored as { minX, minY, maxX, maxY } in world coordinates.
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

  pan(dx, dy, boundsCheck = false) {
    this.offset.x += dx / this.zoom;
    this.offset.y += dy / this.zoom;
    if (boundsCheck && this.bounds) {
      this.checkBounds();
    }
  }

  // Set world-space bounds for the camera center.
  // minX/minY/maxX/maxY are in world coordinates.
  setBounds(minX, minY, maxX, maxY) {
    this.bounds = { minX, minY, maxX, maxY };
    this.checkBounds();
  }

  checkBounds() {
    if (!this.bounds) return;

    const { minX, minY, maxX, maxY } = this.bounds;
    if (minX == null || minY == null || maxX == null || maxY == null) return;

    // Current camera center in world space.
    let centerX = -this.offset.x;
    let centerY = -this.offset.y;

    // Half of the visible viewport in world units at the current zoom.
    const halfViewW = this.renderer.width / (2 * this.zoom);
    const halfViewH = this.renderer.height / (2 * this.zoom);

    // Allowed range for the camera center so that the viewport stays inside bounds.
    let minCenterX = minX + halfViewW;
    let maxCenterX = maxX - halfViewW;
    let minCenterY = minY + halfViewH;
    let maxCenterY = maxY - halfViewH;

    // If the world (plus margins) is smaller than the viewport, just lock to the center.
    if (minCenterX > maxCenterX) {
      centerX = (minX + maxX) * 0.5;
    } else {
      if (centerX < minCenterX) centerX = minCenterX;
      else if (centerX > maxCenterX) centerX = maxCenterX;
    }

    if (minCenterY > maxCenterY) {
      centerY = (minY + maxY) * 0.5;
    } else {
      if (centerY < minCenterY) centerY = minCenterY;
      else if (centerY > maxCenterY) centerY = maxCenterY;
    }

    this.offset.x = -centerX;
    this.offset.y = -centerY;
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

    // Keep the view within bounds after zoom changes.
    this.checkBounds();
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

/*function exportImage({
  filename = 'output',
  resolutionMultiplier = 3,
  exportWidth = 0,
  exportHeight = 0,
  exportType = 'current',
  worldBounds = null,
  baseCamera = null,
  drawFunc,
  backgroundCol = null, // assumed background color (r, g, b)
  bgAlpha = 50,       // assumed background alpha (0-255)
  additivePasses = 0, // if 0, auto-determine based on bgAlpha
  opacityThreshold = 0.01, // when to consider it visually 'full'
  exportOthershapes = true,
  exportCameraJson = true,
  pixlD = 1,
}) {
  const baseW = width;
  const baseH = height;
  let exportW = exportWidth > 0 ? exportWidth : baseW * resolutionMultiplier;
  let exportH = exportHeight > 0 ? exportHeight : baseH * resolutionMultiplier;

  if (!worldBounds) {
    worldBounds = {
      minX: 0,
      minY: 0,
      maxX: exportW,
      maxY: exportW
    };
  }

  // Create offscreen canvas
  let pg = createGraphics(exportW, exportH);
  pg.pixelDensity(pixlD);

  let exportCam = new Camera(pg);

  exportCam.baseScale = resolutionMultiplier;

  if (exportType === 'current') {
    exportCam.offset = baseCamera.offset.copy();
    exportCam.zoom = baseCamera.zoom * resolutionMultiplier;
  } else if (exportType === 'full') {
    let worldW = worldBounds.maxX - worldBounds.minX;
    let worldH = worldBounds.maxY - worldBounds.minY;
    let zoomFactor = min(baseW, baseH) / max(worldW, worldH);
    exportCam.zoom = zoomFactor;

    let centerX = (worldBounds.minX + worldBounds.maxX) / 2;
    let centerY = (worldBounds.minY + worldBounds.maxY) / 2;
    exportCam.offset.set(-centerX, -centerY);
  }

  // Determine number of passes if not provided
  if (additivePasses === 0) {
    let decayFactor = 1 - (bgAlpha / 255);
    additivePasses = Math.ceil(Math.log(opacityThreshold) / Math.log(decayFactor));
    console.log(`Calculated ${additivePasses} additive passes based on bgAlpha ${bgAlpha}`);
  }

  if (backgroundCol) {
    pg.background(red(backgroundCol), green(backgroundCol), blue(backgroundCol), 255);
  }
  let donePasses = 0;
  for (let i = 0; i < additivePasses; i++) {
    donePasses = drawFunc(pg, exportCam, donePasses);
    if (donePasses > additivePasses / 2) {
      saveCanvas(pg, filename + '_' + i, 'png');
    }
    donePasses++;
  }

  //console.log(`Exported image: ${filename}.png at ${exportW}x${exportH} with ${donePasses} passes`);
  //pg.remove();
  //pg = undefined;
  setTimeout(() => {
    console.log(`Exported image: ${filename}.png at ${exportW}x${exportH} with ${donePasses} passes in 7000ms`);
    pg.remove();
    pg = undefined;
    console.debug("Starting loop() again...");
    loop();
    // console.debug("Saving lowres image...");
    // saveCanvas(frameCount + '_current_view_lowres.png');
    if (exportOthershapes) {
      exportFoundationShapes();
      let lrg = [];
      for (let group of largeMouseTracks) {
        for (let shape of group.shapes) {
          lrg.push(shape);
        }
      }
      exportSVG(lrg, frameCount + '_mouseTracksLarge.svg');
      exportSVG(mouseTracks, frameCount + '_mouseTracks.svg');
      exportGrid(fullGrid, frameCount + '_fullgrid');
      if (!displacedPixels) {
        let displaced = createDisplacedGridcopy(fullGrid, fullGrid.cellW * 0.5, [COLORCONTENT, SHAPECONTENT], [COLORCONTENT]);
        exportGrid(displaced, frameCount + '_displaced_grid');
      } else {
        exportGrid(displacedPixels, frameCount + '_displaced_grid');
      }
      saveStrings(cam.exportCamData(), frameCount + '_camdata.json');
    }
  }, 7000);
}*/