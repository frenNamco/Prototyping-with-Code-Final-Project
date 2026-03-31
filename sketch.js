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
    // Arrow function preserves `this` context
    this.handPose.detectStart(this.video, (results) => {
      this.hands = results;
    });
  }

  draw() {
    if (this.hands.length > 0) {
      for (let hand of this.hands) {
        if (hand.confidence > 0.01) {
          for (let kp of hand.keypoints) {
            fill(255, 0, 255);
            noStroke();
            circle(kp.x, kp.y, 10);
          }
        }
      }
    }
  }
}

let tracker;

function preload() {
  tracker = new HandTracker();
  tracker.preload();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  tracker.setup(width * 0.1, height * 0.1);
}

function draw() {
  background(220);
  image(tracker.video, 0, 0, 0.1 * width, 0.1 * height);
  tracker.draw();
}