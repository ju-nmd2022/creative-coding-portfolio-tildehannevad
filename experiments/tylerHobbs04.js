// Inspired by the Tyler Hobbs 03
let fieldSize = 50;
let maxCols,
  maxRows,
  divider = 50;
let field,
  agents = [];
let obstacles = [];

// Chat GPT helped with the agents behaviors, flocking, separation and cohesion
class Agent {
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-1, 1), random(-1, 1))
      .normalize()
      .mult(maxSpeed);
    this.acceleration = createVector(0, 0);
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration).limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  checkBorders() {
    if (this.position.x < 0) {
      this.position.x = innerWidth;
    } else if (this.position.x > innerWidth) {
      this.position.x = 0;
    }

    if (this.position.y < 0) {
      this.position.y = innerHeight;
    } else if (this.position.y > innerHeight) {
      this.position.y = 0;
    }
  }

  // Collision detection with multiple obstacles
  bounceOffObstacles(obstacles) {
    for (let obstacle of obstacles) {
      const halfSize = obstacle.size / 2;
      const distanceX = this.position.x - obstacle.position.x;
      const distanceY = this.position.y - obstacle.position.y;

      // Check for collision on each side
      if (Math.abs(distanceX) < halfSize && Math.abs(distanceY) < halfSize) {
        if (Math.abs(distanceX) > Math.abs(distanceY)) {
          // Bounce vertically
          this.velocity.y *= -1; // Reverse vertical velocity
          this.position.y +=
            distanceY > 0
              ? halfSize - Math.abs(distanceY)
              : -halfSize + Math.abs(distanceY);
        } else {
          // Bounce horizontally
          this.velocity.x *= -1; // Reverse horizontal velocity
          this.position.x +=
            distanceX > 0
              ? halfSize - Math.abs(distanceX)
              : -halfSize + Math.abs(distanceX);
        }

        // Slow the velocity to simulate energy loss
        this.velocity.mult(0.8);
      }
    }
  }

  flock(agents) {
    let alignment = this.align(agents);
    let cohesion = this.cohere(agents);
    let separation = this.separate(agents);

    this.applyForce(alignment);
    this.applyForce(cohesion);
    this.applyForce(separation);
  }

  // Alignment behavior
  align(agents) {
    let alignment = createVector(0, 0);
    let count = 0;

    for (let other of agents) {
      let distance = p5.Vector.dist(this.position, other.position);
      if (other !== this && distance < 50) {
        alignment.add(other.velocity);
        count++;
      }
    }

    if (count > 0) {
      alignment
        .div(count)
        .setMag(this.maxSpeed)
        .sub(this.velocity)
        .limit(this.maxForce);
    }

    return alignment;
  }

  // Cohesion behavior
  cohere(agents) {
    let cohesion = createVector(0, 0);
    let count = 0;

    for (let other of agents) {
      let distance = p5.Vector.dist(this.position, other.position);
      if (other !== this && distance < 50) {
        cohesion.add(other.position);
        count++;
      }
    }

    if (count > 0) {
      cohesion.div(count);
      let diff = p5.Vector.sub(cohesion, this.position)
        .setMag(this.maxSpeed)
        .sub(this.velocity)
        .limit(this.maxForce);
      return diff;
    }
    return createVector(0, 0);
  }

  // Separation behavior
  separate(agents) {
    let separation = createVector(0, 0);
    let count = 0;

    for (let other of agents) {
      let distance = p5.Vector.dist(this.position, other.position);
      if (other !== this && distance < 40) {
        let diff = p5.Vector.sub(this.position, other.position)
          .normalize()
          .div(distance);
        separation.add(diff);
        count++;
      }
    }

    if (count > 0) {
      separation
        .div(count)
        .setMag(this.maxSpeed)
        .sub(this.velocity)
        .limit(this.maxForce);
    }

    return separation;
  }

  follow(desiredDirection) {
    if (desiredDirection) {
      desiredDirection = desiredDirection.copy().mult(this.maxSpeed);
      let steer = p5.Vector.sub(desiredDirection, this.velocity);
      steer.limit(this.maxForce);
      this.applyForce(steer);
    }
  }

  draw() {
    push();
    noStroke();

    const centerX = width / 2,
      centerY = height / 2;
    const maxDistance = dist(centerX, centerY, 0, 0);
    const distanceFromCenter = dist(
      this.position.x,
      this.position.y,
      centerX,
      centerY
    );

    const size = map(distanceFromCenter, 0, maxDistance, 30, 10);
    const colorValue = map(this.velocity.mag(), 0, this.maxSpeed, 0, 255);

    fill(colorValue, 150, 255, 150);
    ellipse(this.position.x, this.position.y, size, size);
    pop();
  }
}

class Obstacle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.size = 60;
  }

  draw() {
    fill(255, 0, 0);
    rect(
      this.position.x - this.size / 2,
      this.position.y - this.size / 2,
      this.size,
      this.size
    );
  }
}

function setup() {
  createCanvas(innerWidth, innerHeight);
  background(229, 227, 218);
  field = generateField();
  maxCols = Math.ceil(innerWidth / fieldSize);
  maxRows = Math.ceil(innerHeight / fieldSize);
  generateAgents();
  // Generate initial obstacle
  addObstacle(random(40, innerWidth - 40), random(40, innerHeight - 40));
}

function generateField() {
  let field = [];
  noiseSeed(Math.random() * 100);
  for (let x = 0; x < maxCols; x++) {
    field[x] = [];
    for (let y = 0; y < maxRows; y++) {
      const value = noise(x / divider, y / divider) * Math.PI * 2;
      field[x][y] = p5.Vector.fromAngle(value);
    }
  }
  return field;
}

function generateAgents() {
  agents = [];
  for (let i = 0; i < 100; i++) {
    agents.push(
      new Agent(
        random(40, innerWidth - 40),
        random(40, innerHeight - 40),
        4,
        0.5
      )
    );
  }
}

// Function to add an obstacle on mouse click
function mousePressed() {
  addObstacle(mouseX, mouseY);
}

// Add an obstacle to the obstacles array
function addObstacle(x, y) {
  obstacles.push(new Obstacle(x, y));
}

function draw() {
  background(229, 227, 218, 70);
  field = generateField();

  // Draw all obstacles
  for (let obstacle of obstacles) {
    obstacle.draw();
  }

  for (let agent of agents) {
    const x = Math.floor(agent.position.x / fieldSize);
    const y = Math.floor(agent.position.y / fieldSize);
    const desiredDirection = field[x] && field[x][y];

    agent.follow(desiredDirection); // Make agents follow the field direction
    agent.bounceOffObstacles(obstacles); // Bounce off multiple obstacles
    agent.flock(agents); // Call flocking behavior
    agent.update();
    agent.checkBorders();
    agent.draw();
  }
}
