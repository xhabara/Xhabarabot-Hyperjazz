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

let soundRecorder;
let recording;
let saveButton;
let isRecording = false;
let needsSaving = false;

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
  saveCanvas("HyperjazzSketch", "png");
}

function startSketch() {
  mySound1.loop();
  mySound2.loop();
  mySound3.loop();
  loop();
}

function setup() {
  createCanvas(800, 600);
  background(22);

  // Audio setup
  mySound1.setVolume(0.5);
  mySound2.setVolume(0.3);
  mySound3.setVolume(0.3);

  // Start/Stop Button
  startButton = createButton("Start/Stop");
  startButton.position(20, 20);
  startButton.mousePressed(startStop);
  startButton.style('background-color', '#ff0000');
  startButton.style('color', '#ffffff');
  startButton.style('font-size', '13px');
  
// Tempo Slider
tempoSlider = createSlider(0.2, 3, 1, 0.1); 
tempoSlider.position(550, 20);
tempoSlider.style('width', '200px');
tempoSlider.style('-webkit-appearance', 'none');
tempoSlider.style('appearance', 'none');
tempoSlider.style('background', '#F9F9F4');
tempoSlider.style('outline', '10px');
tempoSlider.style('opacity', '100');
tempoSlider.style('border-radius', '12px');
tempoSlider.style('height', '15px');
  tempoSlider.hide();



  // Autonomous Mode Button
  let autonomousButton = createButton("XHABARABOT TAKEOVER"); 
  autonomousButton.position(145, 20);
  autonomousButton.mousePressed(() => {
    autonomousMode = !autonomousMode;
    autonomousButton.html(autonomousMode ? "STOP XHABARABOT MODE" : "XHABARABOT TAKEOVER");
    if (autonomousMode) {
    tempoSlider.show();  
  } else {
    tempoSlider.hide();  
  }

  });
  autonomousButton.style('background-color', '#0000ff');
  autonomousButton.style('color', '#ffffff');
  autonomousButton.style('font-size', '13px');
  
  // Recorder setup and Save button
  soundRecorder = new p5.SoundRecorder();
  recording = new p5.SoundFile();
  saveButton = createButton("Start Recording");
  saveButton.position(350, 20);
  saveButton.mousePressed(toggleRecording);
  saveButton.style('background-color', '#00ff00');
  saveButton.style('color', '#000000');
  saveButton.style('font-size', '13px');
}


function toggleRecording() {
  isRecording = !isRecording;
  if (isRecording) {
    // Start recording
    soundRecorder.setInput(mySound1, mySound2, mySound3);  // Listen to these sounds
    soundRecorder.record(recording);  // Start recording to the file
    saveButton.html("Download Recording");  // Change button label
  } else {
      soundRecorder.stop();  // Stop the recording
    needsSaving = true;  // Flag that we want to save once the recording is done
  }
}

function normalizeAndSave() {
  let buffer = recording.buffer;
  
  if (buffer) {
    let maxVal = 0;
    let sampleRate = 100;  

    // Find a "representative" max value by sampling
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      let data = buffer.getChannelData(channel);
      for (let i = 0; i < data.length; i += sampleRate) {
        maxVal = Math.max(maxVal, Math.abs(data[i]));
      }
    }

    // Calculate normalization factor
    let normalizeFactor = 0.8 / maxVal;  // 0.8 or any non-peaking value 

    // Apply normalization factor
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      let data = buffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        data[i] *= normalizeFactor;
      }
    }

    // Save the recording
    saveSound(recording, 'HyperjazzNormalizedRecording.wav');
  }
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
  let tempo = tempoSlider.value(); 

  if (!paused) {
    let randomColor = color(random(255), random(255), random(255));
    let ellipseSize = map(dist(mouseX, mouseY, pmouseX, pmouseY), 0, 1, 1, 5);
    
    if (autonomousMode) {
      let disruptionX = mouseX - width / 2;
      let disruptionY = mouseY - height / 2;

      mouseX = noise(frameCount * 0.05 * tempo + disruptionX * 0.001) * width; 
      mouseY = noise(frameCount * 0.05 * tempo + 1000 + disruptionY * 0.001) * height; 
     
      mySound1.rate((sin(frameCount * 0.1) + disruptionX * 0.01) * tempo); 
mySound2.rate((cos(frameCount * 0.2) + disruptionY * 0.01) * tempo); 
mySound3.rate(tan(frameCount * 0.03) * 2 * tempo);


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
  
  if (needsSaving && recording.isLoaded()) {
    normalizeAndSave();
    needsSaving = false;
  }

}

// Created by Rully Shabara 2023
