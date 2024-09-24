//Using Bassima's code
let handpose;
let video;
let predictions = [];

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handpose = ml5.handpose(video, modelReady);
  handpose.on("predict", (results) => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  image(video, 0, 0, width, height);

  for (let i = 0; i < predictions.length; i++) {
    let prediction = predictions[i];

    let indexFinger = prediction.landmarks[8];
    let thumb = prediction.landmarks[4];

    let centerX = (indexFinger[0] + thumb[0]) / 2;
    let centerY = (indexFinger[1] + thumb[1]) / 2;

    let distance = dist(indexFinger[0], indexFinger[1], thumb[0], thumb[1]);

    noStroke();
    fill(255, 0, 0);
    ellipse(centerX, centerY, distance);
  }
}
