let mySound1;
let mySound2;
let mySound3;

let ellipses = [];
let paused = true;
let firstMouseClick = false;
let prevMouseX = 0;
let prevMouseY = 0;

let startButton;

window.addEventListener("keydown", function (e) {
  if (e.key === "s") {
    saveSketch();
  } else if (e.key === " ") {
    paused = !paused;
  }
});

function preload() {
  mySound1 = loadSound("RullyShabaraSampleR01.wav");
  mySound2 = loadSound("RullyShabaraSampleR03.wav");
  mySound3 = loadSound("RullyShabaraSampleV03.mp3");
}

function saveSketch() {
  saveCanvas("mySketch", "png");
}

function startSketch() {
  mySound1.loop();
  mySound2.loop();
  mySound3.loop();
  loop();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(22);

  mySound1.setVolume(1);
  mySound2.setVolume(1);
  mySound3.setVolume(1);

  startButton = createButton("Start/Stop");
  startButton.position(20, 20);
  startButton.mousePressed(startStop);
}

function startStop() {
  paused = !paused;
  if (paused) {
    startButton.html("Start");
    mySound1.stop();
    mySound2.stop();
    mySound3.stop();
    clear();
  } else {
    startButton.html("Double Click Stop");
    startSketch();
  }
}

function draw() {
  if (!paused) {
    let randomSound = Math.floor(Math.random() * 3) + 1;

    let randomColor = color(random(255), random(255), random(255));
    let randomShape = Math.floor(Math.random() * 2) + 1;

    if (randomSound === 1) {
      mySound1.rate(map(mouseX, 0, width, 0.5, 10));

      if (mouseIsPressed === true) {
        mySound1.setVolume(70);
      } else {
        mySound1.setVolume(10);
      }
    } else if (randomSound === 2) {
      mySound2.rate(map(mouseX, 0, width, 1, 3));

      if (mouseIsPressed === true) {
        mySound2.setVolume(20);
      } else {
        mySound2.setVolume(5);
      }
    } else {
      mySound3.rate(map(mouseX, 1, width, 10, 1));

      if (mouseIsPressed === true) {
        mySound3.setVolume(5);
      } else {
        mySound3.setVolume(0.8);
      }
    }

    if (!paused) {
      if (prevMouseY === mouseY) {
        fill(255);
      } else {
        fill(randomColor);
      }

      stroke(0);
      strokeWeight(5);

      let ellipseSize = map(dist(mouseX, mouseY, pmouseX, pmouseY), 0, 1, 1, 5);

      if (ellipses === 1) {
        ellipse(mouseX, mouseY, ellipseSize, ellipseSize);
      } else {
        rect(mouseX, mouseY, ellipseSize, ellipseSize);
      }
    }
  }
}

//Created by Rully Shabara.