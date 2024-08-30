function setup() {
  createCanvas(700, 700);
}

const size = 100;
const layers = 14;

function getRandomValue(pos, variance) {
  return pos + map(Math.random(), 0, 1, -variance, variance);
}

function getRandomColor() {
  return color(random(255), random(255), random(255));
}

function drawLayers(x, y, size, layers) {
  // const half = size / 2;
  const variance = size / 3;
  noFill();
  strokeWeight(4);

  const rectColor = getRandomColor();
  stroke(rectColor);

  for (let i = 0; i < layers; i++) {
    if (Math.random() > 0.8) {
      continue;
    }
  }

  //   rectMode(CENTER);
  for (let i = 0; i < layers; i++) {
    if (Math.random() > 0.8) {
      continue;
    }
    const s = (size / layers) * i;
    const half = s / 2;

    // ChatGPT to help me with the if statements

if (Math.random() > 0.5) {
    // Draw an ellipse
    const ellipseColor = getRandomColor();
    stroke(ellipseColor);
    ellipse(
      getRandomValue(x, variance),
      getRandomValue(y, variance),
      s, // width
      s  // height
    );
  } else {
    // Draw a polygon
    const rectColor = getRandomColor();
    stroke(rectColor); }

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

  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 6; x++) {
      drawLayers(size / 2 + x * size, size / 2 + y * size, size, layers);
    }
  }

  // noLoop();
}
