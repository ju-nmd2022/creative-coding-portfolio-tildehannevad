function setup() {
  createCanvas(700, 700);
  noiseDetail(8, 0.6);
}

// I used chatGPT to figure out the perlin noise effect

const size = 100;
const layers = 14;

function getRandomValue(pos, variance) {
  return pos + map(Math.random(), 0, 1, -variance, variance);
}

function drawLayers(x, y, size, layers, noiseOffset) {
  const variance = size / 3;
  noFill();
  strokeWeight(2.9);

  const r = map(noise(noiseOffset), 0, 1, 0, 255);
  const g = map(noise(noiseOffset + 100), 0, 1, 0, 255);
  const b = map(noise(noiseOffset + 200), 0, 1, 0, 255);
  stroke(r, g, b);

  for (let i = 0; i < layers; i++) {
    if (Math.random() > 0.8) {
      continue;
    }

    const s = (size / layers) * i;
    const half = s / 2;

    beginShape();
    vertex(
      getRandomValue(x - half, variance),
      getRandomValue(y - half, variance)
    );
    vertex(
      getRandomValue(x + half, variance),
      getRandomValue(y - half, variance)
    );
    vertex(
      getRandomValue(x + half, variance),
      getRandomValue(y + half, variance)
    );
    vertex(
      getRandomValue(x - half, variance),
      getRandomValue(y + half, variance)
    );
    endShape(CLOSE);
  }
}

function draw() {
  background(114, 114, 114);
  let noiseOffset = 0;

  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 6; x++) {
      drawLayers(
        size / 2 + x * size,
        size / 2 + y * size,
        size,
        layers,
        noiseOffset
      );
      noiseOffset += 0.1;
    }
  }

  noLoop();
}
