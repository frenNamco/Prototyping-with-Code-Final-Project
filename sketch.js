let video 
let handPose;
let hands = [];

function preload() {
  handPose = ml5.handPose({flipped:true});
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO, {flipped:true});
  video.hide();
  handPose.detectStart(video, gotHands);
}

function draw() {
  image(video, 0, 0);
  if (hands.length > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];
          fill(255, 0, 255);
          noStroke();
          circle(keypoint.x, keypoint.y, 16);
        }
      }
    }

  }

}