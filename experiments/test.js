// This code is from https://generativeartistry.com/tutorials/circle-packing/
// with some modifications.
let circles = [];
const minRadius = 4;
const maxRadius = 90;
const totalCircles = 500;
const createCircleAttempts = 500;
let size;

function setup() {
  createCanvas(innerWidth, innerHeight);
  size = min(innerWidth, innerHeight);
  noLoop();
  background(255);
  for (let i = 0; i < totalCircles; i++) {
    createAndDrawCircle();
  }
}

function createAndDrawCircle() {
  let newCircle;
  let circleSafeToDraw = false;
  for (let tries = 0; tries < createCircleAttempts; tries++) {
    newCircle = {
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size),
      radius: minRadius,
    };

    if (doesCircleHaveACollision(newCircle)) {
      continue;
    } else {
      circleSafeToDraw = true;
      break;
    }
  }

  if (!circleSafeToDraw) {
    return;
  }

  for (let radiusSize = minRadius; radiusSize < maxRadius; radiusSize++) {
    newCircle.radius = radiusSize;
    if (doesCircleHaveACollision(newCircle)) {
      newCircle.radius--;
      break;
    }
  }

  circles.push(newCircle);
  noStroke();
  fill(255, 0, 55);
  ellipse(newCircle.x, newCircle.y, newCircle.radius * 2);
}

function doesCircleHaveACollision(circle) {
  for (let i = 0; i < circles.length; i++) {
    let otherCircle = circles[i];
    let a = circle.radius + otherCircle.radius;
    let x = circle.x - otherCircle.x;
    let y = circle.y - otherCircle.y;

    if (a >= Math.sqrt(x * x + y * y)) {
      return true;
    }
  }

  if (circle.x + circle.radius >= size || circle.x - circle.radius <= 0) {
    return true;
  }

  if (circle.y + circle.radius >= size || circle.y - circle.radius <= 0) {
    return true;
  }

  return false;
}

function draw() {
  background(255);
  for (let circle of circles) {
    fill(255, 0, 55);
    noStroke();
    ellipse(circle.x, circle.y, circle.radius * 2);
  }
}

function mousePressed() {
  for (let i = circles.length - 1; i >= 0; i--) {
    let circle = circles[i];
    let d = dist(mouseX, mouseY, circle.x, circle.y);
    if (d < circle.radius) {
      circles.splice(i, 1);
      redraw();
      break;
    }
  }
}
