// initial code from https://generativeartistry.com/tutorials/triangular-mesh/
// Help with perlin noise from Chat GPT
let lines = [];
let noiseOffset = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  generateLines();
}

function generateLines() {
  const gap = windowWidth / 8; 
  const sizeX = windowWidth;
  const sizeY = windowHeight;

  // Create the lines with random points
  for (let y = gap / 2; y <= sizeY; y += gap) {
    let odd = y % (gap * 2) === 0;
    let line = [];
    for (let x = gap / 4; x <= sizeX; x += gap) {
      line.push({
        x: x + (random() * 0.8 - 0.4) * gap + (odd ? gap / 2 : 0),
        y: y + (random() * 0.8 - 0.4) * gap,
      });
    }
    lines.push(line);
  }
}

function drawTriangle(pointA, pointB, pointC, index) {
  let r = Math.floor(noise(index * 0.1 + noiseOffset) * 255);
  let g = Math.floor(noise(index * 0.1 + noiseOffset + 100) * 255);
  let b = Math.floor(noise(index * 0.1 + noiseOffset + 200) * 255);
  
  fill(r, g, b);
  stroke(0);

  beginShape();
  vertex(pointA.x, pointA.y);
  vertex(pointB.x, pointB.y);
  vertex(pointC.x, pointC.y);
  endShape(CLOSE);
}

function draw() {
  background(200);

  let odd = true;

  // Draw the triangles
  for (let y = 0; y < lines.length - 1; y++) {
    odd = !odd;
    let dotLine = [];
    for (let i = 0; i < lines[y].length; i++) {
      // Calculate new positions using Perlin noise for a flowing effect
      let xOffset = (noise(lines[y][i].x * 0.01 + noiseOffset) - 0.5) * 40; // Adjust this value for flow
      let yOffset = (noise(lines[y][i].y * 0.01 + noiseOffset + 1000) - 0.5) * 40; // Adjust this value for flow
      let point = {
        x: lines[y][i].x + xOffset,
        y: lines[y][i].y + yOffset,
      };

      dotLine.push(odd ? point : lines[y + 1][i]);
      dotLine.push(odd ? lines[y + 1][i] : point);
    }
    for (let i = 0; i < dotLine.length - 2; i++) {
      drawTriangle(dotLine[i], dotLine[i + 1], dotLine[i + 2], i); // Pass the index to drawTriangle
    }
  }

  // Increment the noise offset for movement
  noiseOffset += 0.01;
}
