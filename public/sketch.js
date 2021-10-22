let video;
let poseNet;
let poses = [];

// todo: send the pitch and sounds via socket io
// add visual aesthetics ?

function setup() {
  createCanvas(windowWidth, windowHeight);
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
}

const vertexLabels = ["rightWrist", "leftWrist", "leftKnee", "rightKnee"];
let vertices = {};

function definePitch() {
  const middleBottomGround = {
    x: (vertices.rightKnee.x + vertices.leftKnee.x)/2,
    y: (vertices.rightKnee.y + vertices.leftKnee.y)/2
  };

  const middleTopGround = {
    x: (vertices.rightWrist.x + vertices.leftWrist.x)/2,
    y: (vertices.rightWrist.y + vertices.leftWrist.y)/2
  };

  return middleTopGround - middleBottomGround;
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

  return middleRightSide - middleLeftSide;
}

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
    fill("#241c94");
    beginShape();
    for(let i = 0; i < vertexLabels.length; i++) {
      vertex(vertices[vertexLabels[i]].x, vertices[vertexLabels[i]].y);
    }
    endShape(CLOSE);
  }
}
