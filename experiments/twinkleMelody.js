// ChatGPT helped me with the twinkleMelody and currentNoteIndex
let agents = [];
let numAgents = 7;
let bounceSound;
let soundReady = false;

// Create an array with the frequencies in the melody
const twinkleMelody = [
  261.63, 261.63, 392.0, 392.0, 440.0, 440.0, 392.0, 349.23, 349.23, 329.63,
  329.63, 293.66, 293.66, 261.63,
];
let currentNoteIndex = 0; // To keep track of the current note

const pitchShift = new Tone.PitchShift(-12).toDestination();
const reverb = new Tone.Reverb().toDestination();

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0, 0, 51);
}

function generateAgents() {
  for (let i = 0; i < numAgents; i++) {
    let agent = new Agent(random(width), random(height));
    agents.push(agent);
  }
}

// Function to draw a star
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

class Agent {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-2, 2), random(-2, 2)); // Random initial velocity
    this.radius = 35; // Set radius for collision detection
  }

  update() {
    this.position.add(this.velocity);

    // Check for wall collisions and bounce
    if (this.position.x < 0 || this.position.x > width) {
      this.velocity.x *= -1; // Reverse velocity
      this.playBounceSound();
    }
    if (this.position.y < 0 || this.position.y > height) {
      this.velocity.y *= -1; // Reverse velocity
      this.playBounceSound();
    }

    // Check for collisions with other agents
    for (let other of agents) {
      if (other !== this && this.isCollidingWith(other)) {
        this.handleCollisionWith(other);
      }
    }
  }

  isCollidingWith(other) {
    let distance = dist(
      this.position.x,
      this.position.y,
      other.position.x,
      other.position.y
    );
    return distance < this.radius + other.radius;
  }

  handleCollisionWith(other) {
    // Swap velocities
    let temp = this.velocity.copy();
    this.velocity = other.velocity;
    other.velocity = temp;

    this.playBounceSound();
  }

  playBounceSound() {
    if (soundReady) {
      // Play the current note in the melody
      bounceSound.frequency.setValueAtTime(
        twinkleMelody[currentNoteIndex],
        Tone.now()
      );
      bounceSound.start();
      setTimeout(() => {
        bounceSound.stop();
      }, 100);

      // Move to the next note in the melody
      currentNoteIndex = (currentNoteIndex + 1) % twinkleMelody.length;
    }
  }

  draw() {
    fill(255, 255, 51);
    noStroke();
    drawStar(this.position.x, this.position.y, 20, 50, 5); // Draw the agent
  }
}

function draw() {
  background(0, 0, 51); // Clear the background each frame
  for (let agent of agents) {
    agent.update(); // Update each agent's position
    agent.draw(); // Draw each agent
  }
}

window.addEventListener("load", () => {});

function mousePressed() {
  if (!soundReady) {
    bounceSound = new Tone.Oscillator(twinkleMelody[0], "triangle")
      .connect(pitchShift)
      .connect(reverb)
      .toDestination();
    bounceSound.volume.value = -12;
    soundReady = true; // Set soundReady to true
    generateAgents();
    bounceSound.start();
  }

  // Start the bounce sound if ready
  if (soundReady) {
  }
}
