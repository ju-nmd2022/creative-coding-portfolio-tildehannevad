//Code taken from https://generativeartistry.com/tutorials/hypnotic-squares/ with some adjustments

let finalSize = 3;
let offset = 2;
let directions = [-1, 0, 1];
let size = 700;
let tileStep;
let startSize;
let startSteps;

function setup() {
  createCanvas(size, size);
  tileStep = (size - offset * 2) / 7;
  startSize = tileStep;
  background(255);
  noLoop();
}

function drawRect(x, y, width, height, xMovement, yMovement, steps) {
  rect(x, y, width, height);
  stroke(random(255), random(255), random(255));
  strokeWeight(2);

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
  for (let x = offset; x < size - offset; x += tileStep) {
    for (let y = offset; y < size - offset; y += tileStep) {
      startSteps = 2 + Math.ceil(Math.random() * 3);
      drawRect(x, y, startSize, startSize, 1, 1, startSteps - 1);
      let xDirection = directions[Math.floor(Math.random() * directions.length)];
      let yDirection = directions[Math.floor(Math.random() * directions.length)];
      drawRect(x, y, startSize, startSize, xDirection, yDirection, startSteps - 1);
    }
  }
}
