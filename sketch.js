class HandTracker {
  constructor() {
    this.video = null;
    this.videoWidth = null;
    this.videoHeight = null;
    this.widthMod = 0.2;
    this.heightMod = 0.2;

    this.hands = [];
    this.handPose = null;
    this.currentHand = null;
    this.keyPointRadius = this.widthMod * 33.333;
  }

  preload() {
    this.handPose = ml5.handPose({ flipped: true });
  }

  setup(w, h) {
    this.videoWidth = w * this.widthMod;
    this.videoHeight = h * this.heightMod;
    this.video = createCapture(VIDEO, { flipped: true });
    this.video.size(this.videoWidth, this.videoHeight);
    this.video.hide();

    this.handPose.detectStart(this.video, (results) => {
      this.hands = results;
    });
  }

  drawKeypoints() {
    if (this.hands.length > 0) {
      this.currentHand = this.hands[0];

      
      if (this.currentHand.confidence > 0.1) {
        for (let kp of this.currentHand.keypoints) {
          if (kp.name == "index_finger_tip") {
            fill(0, 255, 0);
          } else {
            fill(255, 0, 255);
          }
          noStroke();

          circle(kp.x, kp.y, this.keyPointRadius);
        }
      }
    }
  }
}

class Cursor {
  constructor() {
    this.x = null;
    this.y = null;

    this.radius = 20;
    this.color = "red"

    this.indexKeypoint = null;
    this.indexKeypointX = null;
    this.indexKeypointY = null;

    this.thumbKeypoint = null;
    this.thumbKeypointX = null;
    this.thumbKeypointY = null;

    this.click = false;
  }

  updateCursor(tracker) {
    if (tracker.hands[0] != undefined) {
      this.indexKeypoint = tracker.hands[0].keypoints[8];
      this.thumbKeypoint = tracker.hands[0].keypoints[4];

      this.indexKeypointX = this.indexKeypoint.x;
      this.indexKeypointY = this.indexKeypoint.y;
      this.thumbKeypointX = this.thumbKeypoint.x;
      this.thumbKeypointY = this.thumbKeypoint.y;

      let midDistanceX = (this.indexKeypointX + this.thumbKeypointX) / 2;
      let midDistanceY = (this.indexKeypointY + this.thumbKeypointY) / 2; 

      this.x = map(midDistanceX, 0, tracker.videoWidth, 0, width);
      this.y = map(midDistanceY, 0, tracker.videoHeight, 0, height);
    } else {
      this.x = mouseX;
      this.y = mouseY;
    }
  }

  drawCursor() {
    fill(this.color);
    noStroke();
    circle(this.x, this.y, this.radius);
  }

  checkClick(tracker) {
    if (tracker.hands[0] != undefined) {
      let fingerDistance = dist(this.indexKeypointX, this.indexKeypointY, this.thumbKeypointX, this.thumbKeypointY);
    
      if (fingerDistance < 8) {
        this.color = "green";
        this.click = true;
      } else {
        this.color = "red";
        this.click = false;
      }
    }
  }
};

class Canvas {

};


let tracker;
let cursor;

function preload() {
  tracker = new HandTracker();
  cursor = new Cursor();
  tracker.preload();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  tracker.setup(width, height);
}

function draw() {
  background(220);
  image(tracker.video, 0, 0, tracker.videoWidth, tracker.videoHeight);
  tracker.drawKeypoints();

  cursor.updateCursor(tracker);
  cursor.checkClick(tracker);
  cursor.drawCursor();

  if (cursor.click) {
    
  }
}