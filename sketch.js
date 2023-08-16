let mySound1;
let mySound2;
let mySound3;

let ellipses = [];
let paused = true;
let firstMouseClick = false;
let prevMouseX = 0;
let prevMouseY = 0;

let startButton;
let autonomousMode = false;

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
  
  tempoSlider = createSlider(0.5, 2, 1, 0.1); 
  tempoSlider.position(420, 20);

  let autonomousButton = createButton("XHABARABOT TAKEOVER"); 
  autonomousButton.position(150, 20);
  autonomousButton.mousePressed(() => {
    autonomousMode = !autonomousMode;
    autonomousButton.html(autonomousMode ? "STOP XHABARABOT MODE" : "XHABARABOT TAKEOVER");
  });
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

let autonomousButton = createButton("XHABARABOT TAKEOVER");
autonomousButton.position(150, 20);
autonomousButton.mousePressed(() => {
  autonomousMode = !autonomousMode;
  autonomousButton.html(autonomousMode ? "STOP XHABARABOT MODE" : "XHABARABOT TAKEOVER");
});

function draw() {
  let tempo = tempoSlider.value(); 

  if (!paused) {
    let randomColor = color(random(255), random(255), random(255));
    let ellipseSize = map(dist(mouseX, mouseY, pmouseX, pmouseY), 0, 1, 1, 5);
    
    if (autonomousMode) {
      let disruptionX = mouseX - width / 2;
      let disruptionY = mouseY - height / 2;

      mouseX = noise(frameCount * 0.05 * tempo + disruptionX * 0.001) * width; 
      mouseY = noise(frameCount * 0.05 * tempo + 1000 + disruptionY * 0.001) * height; 
      mySound1.rate((sin(frameCount * 0.1 * tempo) + disruptionX * 0.01) * tempo); 
      mySound2.rate((cos(frameCount * 0.2 * tempo) + disruptionY * 0.01) * tempo); 
      mySound3.rate(tan(frameCount * 0.03 * tempo) * 2 * tempo); // Apply tempo
      mySound1.setVolume(random(1, 50) + abs(disruptionX) * 1);
      mySound2.setVolume(random(5, 2) + abs(disruptionY) * 0.1);
      mySound3.setVolume(random(2, 10));
    } else {
      let randomSound = Math.floor(Math.random() * 3) + 1;
      if (randomSound === 1) {
        mySound1.rate(map(mouseX, 0, width, 0.5, 10));
        mySound1.setVolume(mouseIsPressed ? 70 : 10);
      } else if (randomSound === 2) {
        mySound2.rate(map(mouseX, 0, width, 1, 3));
        mySound2.setVolume(mouseIsPressed ? 20 : 5);
      } else {
        mySound3.rate(map(mouseX, 1, width, 10, 1));
        mySound3.setVolume(mouseIsPressed ? 5 : 0.8);
      }
    }

    fill(prevMouseY === mouseY ? 255 : randomColor);
    stroke(0);
    strokeWeight(5);

    if (ellipses === 1) {
      ellipse(mouseX, mouseY, ellipseSize, ellipseSize);
    } else {
      rect(mouseX, mouseY, ellipseSize, ellipseSize);
    }
  }
}



//Created by Rully Shabara.
