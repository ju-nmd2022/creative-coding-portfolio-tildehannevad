// This code is from https://generativeartistry.com/tutorials/circle-packing/
// with some modifications.
let shapes = [];
const minSize = 7;
const maxSize = 90;
const totalShapes = 500;
const createShapeAttempts = 500;
const padding = 10; // Define the padding value
let canvasSize;

function setup() {
  createCanvas(700, 800);
  canvasSize = min(700, 800);
  noLoop();
  background(255);
  for (let i = 0; i < totalShapes; i++) {
    createAndDrawShape();
  }
}

function createAndDrawShape() {
  let newShape;
  let shapeSafeToDraw = false;
  const shapeType = random(["circle", "square", "triangle"]);

  for (let tries = 0; tries < createShapeAttempts; tries++) {
    newShape = {
      type: shapeType,
      x: Math.floor(Math.random() * canvasSize),
      y: Math.floor(Math.random() * canvasSize),
      size: minSize,
    };

    if (doesShapeHaveACollision(newShape)) {
      continue;
    } else {
      shapeSafeToDraw = true;
      break;
    }
  }

  if (!shapeSafeToDraw) {
    return;
  }

  for (let size = minSize; size < maxSize; size++) {
    newShape.size = size;
    if (doesShapeHaveACollision(newShape)) {
      newShape.size--;
      break;
    }
  }

  shapes.push(newShape);
  noStroke();
  fill(255, 0, 55);
  drawShape(newShape);
}

function doesShapeHaveACollision(shape) {
  for (let i = 0; i < shapes.length; i++) {
    let otherShape = shapes[i];
    let distance = dist(shape.x, shape.y, otherShape.x, otherShape.y);

    if (shape.type === "circle" && otherShape.type === "circle") {
      let minDistance = shape.size + otherShape.size + padding;
      if (distance < minDistance) {
        return true;
      }
    } else if (shape.type === "square" && otherShape.type === "square") {
      let minDistance = shape.size + otherShape.size + padding;
      if (distance < minDistance) {
        return true;
      }
    } else if (shape.type === "triangle" && otherShape.type === "triangle") {
      let minDistance =
        ((shape.size + otherShape.size) * Math.sqrt(3)) / 2 + padding;
      if (distance < minDistance) {
        return true;
      }
    } else {
      let minDistance = shape.size + otherShape.size + padding;
      if (distance < minDistance) {
        return true;
      }
    }
  }

  if (
    shape.x + shape.size + padding >= canvasSize ||
    shape.x - shape.size - padding <= 0
  ) {
    return true;
  }

  if (
    shape.y + shape.size + padding >= canvasSize ||
    shape.y - shape.size - padding <= 0
  ) {
    return true;
  }

  return false;
}

function drawShape(shape) {
  switch (shape.type) {
    case "circle":
      ellipse(shape.x, shape.y, shape.size * 2);
      break;
    case "square":
      rect(
        shape.x - shape.size,
        shape.y - shape.size,
        shape.size * 2,
        shape.size * 2
      );
      break;
    case "triangle":
      triangle(
        shape.x,
        shape.y - shape.size,
        shape.x - (shape.size * Math.sqrt(3)) / 2,
        shape.y + shape.size / 2,
        shape.x + (shape.size * Math.sqrt(3)) / 2,
        shape.y + shape.size / 2
      );
      break;
  }
}

function draw() {
  background(255);
  for (let shape of shapes) {
    fill(255, 0, 55);
    noStroke();
    drawShape(shape);
  }
}

function mousePressed() {
  for (let i = shapes.length - 1; i >= 0; i--) {
    let shape = shapes[i];
    let d = dist(mouseX, mouseY, shape.x, shape.y);

    if (shape.type === "circle" && d < shape.size) {
      shapes.splice(i, 1);
      redraw();
      break;
    } else if (
      shape.type === "square" &&
      mouseX > shape.x - shape.size &&
      mouseX < shape.x + shape.size &&
      mouseY > shape.y - shape.size &&
      mouseY < shape.y + shape.size
    ) {
      shapes.splice(i, 1);
      redraw();
      break;
    } else if (shape.type === "triangle") {
      let areaOrig = area(
        shape.x,
        shape.y - shape.size,
        shape.x - (shape.size * Math.sqrt(3)) / 2,
        shape.y + shape.size / 2,
        shape.x + (shape.size * Math.sqrt(3)) / 2,
        shape.y + shape.size / 2
      );

      let area1 = area(
        mouseX,
        mouseY,
        shape.x - (shape.size * Math.sqrt(3)) / 2,
        shape.y + shape.size / 2,
        shape.x + (shape.size * Math.sqrt(3)) / 2,
        shape.y + shape.size / 2
      );
      let area2 = area(
        shape.x,
        shape.y - shape.size,
        mouseX,
        mouseY,
        shape.x + (shape.size * Math.sqrt(3)) / 2,
        shape.y + shape.size / 2
      );
      let area3 = area(
        shape.x,
        shape.y - shape.size,
        shape.x - (shape.size * Math.sqrt(3)) / 2,
        shape.y + shape.size / 2,
        mouseX,
        mouseY
      );

      if (Math.abs(areaOrig - (area1 + area2 + area3)) < 0.1) {
        shapes.splice(i, 1);
        redraw();
        break;
      }
    }
  }
}

function area(x1, y1, x2, y2, x3, y3) {
  return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);
}
