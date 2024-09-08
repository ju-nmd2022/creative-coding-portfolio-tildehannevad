class Agent {
    constructor(x, y, maxSpeed, maxForce) {
      this.position = createVector(x, y);
      this.lastPosition = createVector(x, y);
      this.acceleration = createVector(0, 0);
      this.velocity = createVector(-100, 0);
      this.maxSpeed = maxSpeed;
      this.maxForce = maxForce;
    }
  
    follow(desiredDirection) {
      desiredDirection = desiredDirection.copy();
      desiredDirection.mult(this.maxSpeed);
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
      this.acceleration.mult(0);
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
  
    //I used ChatGPT to get the agents to avoid eachother
    avoidCollisions() {
      const desiredSeparation = 40;
      let steer = createVector(0, 0);
      let count = 0;
      for (let other of agents) {
        let distance = p5.Vector.dist(this.position, other.position);
        if (distance > 0 && distance < desiredSeparation) {
          let diff = p5.Vector.sub(this.position, other.position);
          diff.normalize();
          diff.div(distance);
          steer.add(diff);
          count++;
        }
      }
      if (count > 0) {
        steer.div(count);
        steer.setMag(this.maxSpeed);
        steer.sub(this.velocity);
        steer.limit(this.maxForce);
      }
      this.applyForce(steer);
    }
  
    draw() {
      push();
      noStroke();
      fill(0, 150, 255, 150);
      ellipse(this.position.x, this.position.y, 20, 20);
      pop();
    }
  }
  
  function setup() {
    createCanvas(innerWidth, innerHeight);
    background(229, 227, 218);
    field = generateField();
    generateAgents();
  }
  
  function generateField() {
    let field = [];
    noiseSeed(Math.random() * 100);
    for (let x = 0; x < maxCols; x++) {
      field.push([]);
      for (let y = 0; y < maxRows; y++) {
        const value = noise(x / divider, y / divider) * Math.PI * 2;
        field[x].push(p5.Vector.fromAngle(value));
      }
    }
    return field;
  }
  
  function generateAgents() {
    agents = []; 
    for (let i = 0; i < 100; i++) {
      let agent = new Agent(
        Math.random() * innerWidth,
        Math.random() * innerHeight,
        4,
        0.5
      );
      agents.push(agent);
    }
  }
  
  //I used chatGPT get the agents to generete when mouse is pressed
  function mousePressed() {
    for (let agent of agents) {
      agent.position.set(mouseX, mouseY);
      agent.lastPosition.set(mouseX, mouseY);
      agent.velocity.set(0, 0); 
    }
  }
  
  const fieldSize = 50;
  const maxCols = Math.ceil(innerWidth / fieldSize);
  const maxRows = Math.ceil(innerHeight / fieldSize);
  const divider = 50;
  let field;
  let agents = [];
  
  function draw() {
    background(229, 227, 218, 70); 
    for (let agent of agents) {
      const x = Math.floor(agent.position.x / fieldSize);
      const y = Math.floor(agent.position.y / fieldSize);
      const desiredDirection = field[x][y];
      agent.follow(desiredDirection);
      agent.avoidCollisions();
      agent.update();
      agent.checkBorders();
      agent.draw();
    }
  }
  
  