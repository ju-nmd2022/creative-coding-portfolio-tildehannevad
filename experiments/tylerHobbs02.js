class Agent {
  constructor(x, y, maxSpeed, maxForce) {
    this.position = createVector(x, y);
    this.lastPosition = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.maxSpeed = maxSpeed;
    this.maxForce = maxForce;
    this.noiseOffset = random(10);
    this.noiseIncrement = 0.001;
  }

  //I used chatGPT to figure out the follow mouse function
  followMouse() {
    const mouse = createVector(mouseX, mouseY);
    const desiredDirection = p5.Vector.sub(mouse, this.position);
    desiredDirection.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desiredDirection, this.velocity);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.lastPosition = this.position.copy();
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0.1);

    this.noiseOffset += this.noiseIncrement;
  }

  checkBorders() {
    if (this.position.x < 0) {
      this.position.x = innerWidth;
      this.lastPosition.x = innerWidth;
    } else if (this.position.x > innerWidth) {
      this.position.x = 0;
      this.lastPosition.x = 0;
    }
    if (this.position.y < 0) {
      this.position.y = innerHeight;
      this.lastPosition.y = innerHeight;
    } else if (this.position.y > innerHeight) {
      this.position.y = 0;
      this.lastPosition.y = 0;
    }
  }

  draw() {
    push();
    let r = map(noise(this.noiseOffset), 0, 1, 0, 255);
    let g = map(noise(this.noiseOffset + 100), 0, 1, 0, 255);
    let b = map(noise(this.noiseOffset + 200), 0, 1, 0, 255);
    stroke(r, g, b);
    strokeWeight(30);
    line(
      this.lastPosition.x,
      this.lastPosition.y,
      this.position.x,
      this.position.y
    );
    pop();
  }

}

function setup() {
  createCanvas(innerWidth, innerHeight);
  background(0);
  generateAgents();
}

function generateAgents() {
  agents = [];
  for (let i = 0; i < 20; i++) {
    let agent = new Agent(
      Math.random() * innerWidth,
      Math.random() * innerHeight,
      3,
      0.05
    );
    agents.push(agent);
  }
}

function reset() {
  generateAgents();
}

let agents = [];

function draw() {
  background(0, 0, 0, 1);

  for (let agent of agents) {
    agent.followMouse();
    agent.update();
    agent.checkBorders();
    agent.draw();
  }
}
