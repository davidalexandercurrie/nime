const socket = io("ws://localhost:3000");

socket.on("connect", () => {
  // either with send()
  socket.send("Hello!");
});

let video;
let poseNet;
let poses = [];
let drumLine = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  drumLine = windowHeight / 2;
  previousLeftValue = windowHeight;
  previousRightValue = windowHeight;

  video = createCapture(VIDEO);
  video.size(width, height);

  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', function(results) {
    poses = results;
  });
  video.hide();
}

function modelReady() {
  select('#status').html('');
}

function draw() {
  // image(video, 0, 0, width, height);
  background("#f2faf4");
  drawShape();

  push();
  noStroke();
  fill("#15ff00");
  rect(0, drumLine, width, 10);
  pop();
}

function mousePressed() {
  drumLine = mouseY;
}

const vertexLabels = ["rightWrist", "leftWrist", "leftKnee", "rightKnee"];
let vertices = {};

function getDistance(point1, point2){
  let y = point2.x - point1.x;
  let x = point2.y - point2.y;
  
  return Math.sqrt(x * x + y * y);
}

function definePitch() {
  const middleBottomGround = {
    x: (vertices.rightKnee.x + vertices.leftKnee.x)/2,
    y: (vertices.rightKnee.y + vertices.leftKnee.y)/2
  };

  const middleTopGround = {
    x: (vertices.rightWrist.x + vertices.leftWrist.x)/2,
    y: (vertices.rightWrist.y + vertices.leftWrist.y)/2
  };

  return getDistance(middleTopGround, middleBottomGround);
}

function defineNote() {
  const middleLeftSide = {
    x: (vertices.leftWrist.x + vertices.leftKnee.x)/2,
    y: (vertices.leftWrist.y + vertices.leftKnee.y)/2
  };

  const middleRightSide = {
    x: (vertices.rightWrist.x + vertices.rightKnee.x)/2,
    y: (vertices.rightWrist.y + vertices.rightKnee.y)/2
  };

  return getDistance(middleRightSide, middleLeftSide);
}

let previousLeftValue;
let previousRightValue;

function drawShape()  {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    vertices = {};
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[j];
      if (vertexLabels.includes(keypoint.part)) {
        vertices[keypoint.part] = {
          x: keypoint.position.x,
          y: keypoint.position.y
        }
      }
    }

    // draw the shape
    if (vertices.rightKnee.y < drumLine && previousRightValue > drumLine) {
      fill("#15ff00");
      socket.emit("playDrum1");
    } else if (vertices.leftKnee.y < drumLine && previousLeftValue > drumLine) {
      fill("#15ff00");
      socket.emit("playDrum2");
    } else {
      let pitch = definePitch();
      let note = defineNote();
      fill("#241c94");
      socket.emit("makeSound", {pitch: pitch, note: note});
    }

    previousRightValue = vertices.rightKnee.y;
    previousLeftValue = vertices.leftKnee.y;

    beginShape();
    for(let i = 0; i < vertexLabels.length; i++) {
      vertex(vertices[vertexLabels[i]].x, vertices[vertexLabels[i]].y);
    }
    endShape(CLOSE);
  }
}
