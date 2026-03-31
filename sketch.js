class HandTracker {
  constructor() {
    this.hands = [];
    this.handPose = null;
    this.video = null;
  }

  preload() {
    this.handPose = ml5.handPose({ flipped: true });
  }

  setup(w, h) {
    this.video = createCapture(VIDEO, { flipped: true });
    this.video.size(w, h);
    this.video.hide();

    this.handPose.detectStart(this.video, (results) => {
      this.hands = results;
    });
  }

  drawKeypoints() {
    if (this.hands.length > 0) {
      let hand = this.hands[0];

      if (hand.confidence > 0.1) {
        for (let kp of hand.keypoints) {
          console.log(kp);
          fill(255, 0, 255);
          noStroke();

           circle(kp.x, kp.y, 20);
        }
      }
    }
  }

  drawCursor() {
    
  }
}



let tracker;

function preload() {
  tracker = new HandTracker();
  tracker.preload();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  tracker.setup(width * 0.5, height * 0.5);
}

function draw() {
  background(220);
  image(tracker.video, 0, 0, 0.5 * width, 0.5 * height);
  tracker.drawKeypoints();
}