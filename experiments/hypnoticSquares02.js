//Code taken from https://generativeartistry.com/tutorials/hypnotic-squares/ with some adjustments

let finalSize = 3;
let offset = 2;
let directions = [-1, 0, 1];
let size = 700;
let tileStep;
let startSize;
let startSteps;
let noiseOffsetX = 0;
let noiseOffsetY = 1000;

function setup() {
  createCanvas(size, size);
  tileStep = (size - offset * 2) / 7;
  startSize = tileStep;
  frameRate(2);
}

function drawRect(x, y, width, height, xMovement, yMovement, steps) {
  let r = noise(noiseOffsetX + x * 0.01, noiseOffsetY + y * 0.01) * 255;
  let g = noise(noiseOffsetX + x * 0.02, noiseOffsetY + y * 0.02) * 255;
  let b = noise(noiseOffsetX + x * 0.03, noiseOffsetY + y * 0.03) * 255;
  stroke(r, g, b);
  strokeWeight(3);
  rect(x, y, width, height);

  if (steps >= 0) {
    let newSize = startSize * (steps / startSteps) + finalSize;
    let newX = x + (width - newSize) / 2;
    let newY = y + (height - newSize) / 2;
    newX = newX - ((x - newX) / (steps + 2)) * xMovement;
    newY = newY - ((y - newY) / (steps + 2)) * yMovement;
    drawRect(newX, newY, newSize, newSize, xMovement, yMovement, steps - 1);
  }
}

function draw() {
  background(255);
  noiseOffsetX += 0.1;
  noiseOffsetY += 0.1;
  for (let x = offset; x < size - offset; x += tileStep) {
    for (let y = offset; y < size - offset; y += tileStep) {
      startSteps = 2 + Math.ceil(Math.random() * 3);
      drawRect(
        x + random(-2, 2),
        y + random(-2, 2),
        startSize,
        startSize,
        1,
        1,
        startSteps - 1
      );
      let xDirection =
        directions[Math.floor(Math.random() * directions.length)];
      let yDirection =
        directions[Math.floor(Math.random() * directions.length)];
      drawRect(
        x + random(-2, 2),
        y + random(-2, 2),
        startSize,
        startSize,
        xDirection,
        yDirection,
        startSteps - 1
      );
    }
  }
}
