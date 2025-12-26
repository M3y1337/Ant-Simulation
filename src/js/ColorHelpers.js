// Helper functions for color manipulation and distance calculations
export function colorDistanceRGBSum(c1, c2) {
  let [r1, g1, b1] = c1;
  let [r2, g2, b2] = c2;

  // Calculate the absolute differences between the RGB values
  let dr = r1 - r2;
  let dg = g1 - g2;
  let db = b1 - b2;

  // Return the sum 
  return dr + dg + db;
}

export function colorDistanceRGB(c1, c2) {
  let [r1, g1, b1] = c1;
  let [r2, g2, b2] = c2;

  let dr = r1 - r2;
  let dg = g1 - g2;
  let db = b1 - b2;

  return dr * dr + dg * dg + db * db;
}

export function rgbToHsv(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  let s = max === 0 ? 0 : delta / max;
  let v = max;

  return [h, s, v]; // Hue, Saturation, Value
}

export function colorDistanceHSV(c1, c2) {
  // Convert colors to HSV 
  let [h1, s1, v1] = rgbToHsv(...c1);
  let [h2, s2, v2] = rgbToHsv(...c2);

  // Calculate the differences in HSV space
  let hDiff = h1 - h2;
  if (hDiff < 0) hDiff += 360; // Ensure positive difference
  if (hDiff > 180) hDiff = 360 - hDiff; // Wrap around the hue circle 

  let sDiff = s1 - s2;
  let vDiff = v1 - v2;

  return hDiff * hDiff + sDiff * sDiff + vDiff * vDiff;
}

export function rgbToHSL(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let delta = max - min;

  let h, s, l = (max + min) / 2;

  if (delta === 0) {
    h = s = 0; // achromatic
  } else {
    s = l < 0.5 ? delta / (max + min) : delta / (2 - max - min);

    switch (max) {
      case r: h = (g - b) / delta + (g < b ? 6 : 0); break;
      case g: h = (b - r) / delta + 2; break;
      case b: h = (r - g) / delta + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100]; // Hue, Saturation, Lightness
}

export function colorDistanceHSL(c1, c2, isHSL = false, normalize = false) {

  let [h1, s1, l1] = isHSL ? [...c1] : rgbToHSL(...c1);
  let [h2, s2, l2] = isHSL ? [...c2] : rgbToHSL(...c2);

  let hDiff = h1 - h2;
  if (hDiff < 0) hDiff += 360; // Ensure positive difference
  if (hDiff > 180) hDiff = 360 - hDiff; // Wrap around the hue circle 

  let sDiff = Math.abs(s1 - s2);
  let lDiff = Math.abs(l1 - l2);

  /*if (normalize) {
    let maxDiff = max(hDiff, sDiff, lDiff);
    if (maxDiff > 0) {
      hDiff /= maxDiff;
      sDiff /= maxDiff;
      lDiff /= maxDiff;
    }
    // Normalize the differences to be between 0 and 1
    hDiff = constrain(hDiff, 0, 1);
    sDiff = constrain(sDiff, 0, 1);
    lDiff = constrain(lDiff, 0, 1);
  } */

  return hDiff * hDiff + sDiff * sDiff + lDiff * lDiff;
}

export function rgbToCielab(r, g, b) {
  // Convert RGB to XYZ
  r /= 255;
  g /= 255;
  b /= 255;

  if (r > 0.04045) r = Math.pow((r + 0.055) / 1.055, 2.4);
  else r /= 12.92;

  if (g > 0.04045) g = Math.pow((g + 0.055) / 1.055, 2.4);
  else g /= 12.92;

  if (b > 0.04045) b = Math.pow((b + 0.055) / 1.055, 2.4);
  else b /= 12.92;

  r *= 100;
  g *= 100;
  b *= 100;

  let x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  let y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
  let z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;

  x /= 95.047;
  y /= 100;
  z /= 108.883;

  // Convert XYZ to CIE-L*ab
  x = x > .008856 ? Math.pow(x, 1 / 3) : (x * 7.787) + (.137931034);
  y = y > .008856 ? Math.pow(y, 1 / 3) : (y * 7.787) + (.137931034);
  z = z > .008856 ? Math.pow(z, 1 / 3) : (z * 7.787) + (.137931034);

  let l = (116 * y) - 16;
  let a = (x - y) * 500;
  let b2 = (y - z) * 200;

  return [l, a, b2];
}

export function colorDistanceCIEDE2000(c1, c2) {
  let [l1, a1, b1] = rgbToCielab(...c1);
  let [l2, a2, b2] = rgbToCielab(...c2);

  c1 = Math.sqrt(a1 * a1 + b1 * b1);
  c2 = Math.sqrt(a2 * a2 + b2 * b2);

  let deltaL = l2 - l1;
  let deltaA = a2 - a1;
  let deltaB = b2 - b1;
  let deltaC = c2 - c1;

  //let deltaH = Math.sqrt(deltaA * deltaA + deltaB * deltaB - deltaC * deltaC); // not sure why this is here

  // Calculate the average values
  let Lavg = (l1 + l2) / 2;
  let Cavg = (c1 + c2) / 2;
  let Aavg = (a1 + a2) / 2;
  let Bavg = (b1 + b2) / 2;

  // Calculate the weighting factors
  let G = 0.5 * (1 - Math.sqrt(Math.pow(Cavg, 7) / (Math.pow(Cavg, 7) + Math.pow(25, 7))));

  // Adjust the average values
  Aavg *= (1 + G);
  Cavg *= (1 + G);

  // Calculate the hue angle
  let hAvg = Math.atan2(Bavg, Aavg);

  // Calculate the hue difference
  let deltaHPrime = Math.sqrt(deltaA * deltaA + deltaB * deltaB - deltaC * deltaC); // not sure why this is named this way
  let deltaTheta = 30 * Math.exp(-Math.pow((hAvg - 2 * Math.PI) / 25, 2));
  let deltaHPrimeAdjusted = deltaHPrime - deltaTheta;

  let deltaLPrime = deltaL / (1 + 0.015 * Math.pow(Lavg - 50, 2) / Math.sqrt(20 + Math.pow(Lavg - 50, 2)));
  let deltaCPrime = deltaC / (1 + 0.045 * Cavg);
  let deltaHPrimeFinal = deltaHPrimeAdjusted / (1 + 0.015 * Cavg);

  let deltaE = Math.sqrt(Math.pow(deltaLPrime, 2) + Math.pow(deltaCPrime, 2) + Math.pow(deltaHPrimeFinal, 2));
  return deltaE;
}

/** 
* Main function to get color distance using specified method
* @param {Array|{r:number,g:number,b:number}|p5.Color} c1 - First color
* @param {Array|{r:number,g:number,b:number}|p5.Color} c2 - Second color
* @param {number|string} method - Method to use for distance calculation (0: HSL, 1: HSV, 2: RGB, 3: CIEDE2000) or case-insensitive string. Defaults to 0 (HSL).
* @returns {number} - Color distance
*/
export function getColorDistance(c1, c2, method = 0) {
  // Normalize input colors to [r, g, b] arrays.
  const toRGBArray = (c) => {
    if (!c) return [0, 0, 0];

    // Support p5.Color when available (global mode)
    if (typeof p5 !== "undefined" && c instanceof p5.Color) {
      return [red(c), green(c), blue(c)];
    }

    // Plain object with r/g/b
    if (!Array.isArray(c) && typeof c === "object" && c.r != null && c.g != null && c.b != null) {
      return [c.r, c.g, c.b];
    }

    // Assume array-like [r,g,b]
    const arr = Array.isArray(c) ? c : [0, 0, 0];
    return [arr[0] || 0, arr[1] || 0, arr[2] || 0];
  };

  const a = toRGBArray(c1);
  const b = toRGBArray(c2);

  // Normalize method to a numeric mode 0..3
  let mode = 0;
  if (typeof method === "number") {
    mode = method;
  } else if (typeof method === "string") {
    const m = method.toLowerCase();
    if (m === "" || m === "hsl") mode = 0;
    else if (m === "hsv") mode = 1;
    else if (m === "rgb") mode = 2;
    else if (m === "lab" || m === "ciede2000" || m === "cie") mode = 3;
    else {
      console.debug("Unknown color distance method string:", method, "- defaulting to HSL");
      mode = 0;
    }
  }

  switch (mode) {
    case 1:
      return colorDistanceHSV(a, b);
    case 2:
      return colorDistanceRGB(a, b);
    case 3:
      return colorDistanceCIEDE2000(a, b);
    case 0:
    default:
      return colorDistanceHSL(a, b);
  }
}

export function buildRGBArray(img, sample = 1) {
  if (sample < 1) {
    console.warn("Sample size must be at least 1, defaulting to 1.");
    sample = 1;
  }
  // Step 1: Extract all pixels
  let colors = [];
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x += sample) {
      let index = 4 * (y * img.width + x);
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      colors.push([r, g, b]);
    }
  }

  return colors;

}

export function getColorPalette(img, depth = 2, sample = 1, minDist = 50, colorDistanceMethod = 0, filterGrey = false, greyThresh = 35) {
  // Extract all pixels from the image
  img.loadPixels();
  let colors = buildRGBArray(img, sample);

  // Filter out grey colors if needed
  if (filterGrey) {
    //console.log("Filtering out grey colors from the palette.");
    colors = colors.filter(c => {
      let [r, g, b] = c;
      // If any one color is far enough from another color, it's not grey
      return Math.abs(r - g) > greyThresh || Math.abs(g - b) > greyThresh || Math.abs(b - r) > greyThresh;
    });
  }

  // Generate the palette using median cut algorithm
  let palette = medianCut(colors, depth);

  // Sort the palette by luminance
  palette.sort((a, b) => {
    let luminanceA = Math.floor(0.299 * a[0] + 0.587 * a[1] + 0.114 * a[2]);
    let luminanceB = Math.floor(0.299 * b[0] + 0.587 * b[1] + 0.114 * b[2]);
    return luminanceB - luminanceA;
  });

  // Reduce palette by removing colors that are too close to each other
  palette = reduceColorPalette(palette, minDist, colorDistanceMethod, filterGrey, greyThresh);

  // Palette values are kept as RGB triplets for UI/hex usage.
  return palette.map(([r, g, b]) => [Math.round(r), Math.round(g), Math.round(b)]);
}

export function HSLtoRGB(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hueToRGB = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hueToRGB(p, q, h + 1 / 3);
    g = hueToRGB(p, q, h);
    b = hueToRGB(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


export function reduceColorPalette(palette, minDist = 50, colorDistanceMethod = 0) {
  let reducedPalette = [palette[0]];

  for (let i = 1; i < palette.length; i++) {
    let isDistinct = true;
    for (let j = 0; j < reducedPalette.length; j++) {
      if (getColorDistance(palette[i], reducedPalette[j], colorDistanceMethod) < minDist) {
        isDistinct = false;
        break;
      }
    }
    if (isDistinct) {
      reducedPalette.push(palette[i]);
    }
  }

  return reducedPalette;
}

export function medianCut(cube, depth) {
  // Step 2: Median cut recursive function
  if (cube.length === 0) return [];

  if (depth === 0 || cube.length <= 1) {
    // Return average color
    let r = 0, g = 0, b = 0;
    for (let c of cube) {
      r += c[0];
      g += c[1];
      b += c[2];
    }
    let len = cube.length;
    return [[Math.round(r / len), Math.round(g / len), Math.round(b / len)]];
  }

  // Find the channel with greatest range
  let rMin = 255, rMax = 0;
  let gMin = 255, gMax = 0;
  let bMin = 255, bMax = 0;
  for (let c of cube) {
    rMin = Math.min(rMin, c[0]); rMax = Math.max(rMax, c[0]);
    gMin = Math.min(gMin, c[1]); gMax = Math.max(gMax, c[1]);
    bMin = Math.min(bMin, c[2]); bMax = Math.max(bMax, c[2]);
  }

  let rRange = rMax - rMin;
  let gRange = gMax - gMin;
  let bRange = bMax - bMin;

  let channel = 0;
  if (gRange >= rRange && gRange >= bRange) {
    channel = 1;
  } else if (bRange >= rRange && bRange >= gRange) {
    channel = 2;
  }

  // Sort colors by that channel
  cube.sort((a, b) => a[channel] - b[channel]);

  // Split in half
  let mid = Math.floor(cube.length / 2);
  let left = cube.slice(0, mid);
  let right = cube.slice(mid);

  // Recurse
  return medianCut(left, depth - 1).concat(medianCut(right, depth - 1));
}




