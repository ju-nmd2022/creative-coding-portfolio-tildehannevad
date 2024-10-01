// Bassimas code with some modifications.
let handpose;
let video;
let predictions = [];
let thumbsUp = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(440, 280);
  video.hide();

  handpose = ml5.handpose(video, modelReady);
  handpose.on("predict", (results) => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Model ready!");
}

// Background
function draw() {
  background(0, 70);
  for (let i = 0; i < width; i += 20) {
    stroke(255, random(100, 255));
    line(i, random(height), i, height);
  }

  // Center the video
  image(video, (width - 440) / 2, (height - 280) / 2, 440, 280);

  thumbsUp = false;
  for (let i = 0; i < predictions.length; i++) {
    let prediction = predictions[i];

    let indexFinger = prediction.landmarks[8];
    let thumb = prediction.landmarks[4];
    let wrist = prediction.landmarks[0];

    // Thumbs-up logic
    if (
      thumb[1] < wrist[1] &&
      thumb[0] > indexFinger[0] &&
      Math.abs(thumb[0] - indexFinger[0]) < 50 &&
      Math.abs(thumb[1] - indexFinger[1]) > 30
    ) {
      thumbsUp = true;
    }
  }

  // Thumbs-up reaction
  if (thumbsUp) {
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER);
    text("Good job!!", width / 2, height / 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
