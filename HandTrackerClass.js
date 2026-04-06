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

    this.prevHands = [];
    this.avgIndexX = null;
    this.avgIndexY = null;
    this.avgThumbX = null;
    this.avgThumbY = null;
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
        for (let i = 0; i < this.currentHand.keypoints.length; i++) {
          let kp = this.currentHand.keypoints[i];
          
          let avgKpX = kp.x;
          let avgKpY = kp.y;
          for (let j = 0; j < this.prevHands.length; j++) {
            avgKpX += this.prevHands[j].keypoints[i].x;
            avgKpY += this.prevHands[j].keypoints[i].y
          }
          
          avgKpX = avgKpX / (this.prevHands.length + 1);
          avgKpY = avgKpY / (this.prevHands.length + 1);
          
          noStroke();
          if (i == 8 || i == 4) {
            if (i == 8) {
              this.avgIndexX = avgKpX;
              this.avgIndexY = avgKpY;
            } else {
              this.avgThumbX = avgKpX;
              this.avgThumbY = avgKpY;
            }

            fill(0, 255, 0);
          } else {
            fill(255, 0, 255);
          }
          circle(avgKpX, avgKpY, this.keyPointRadius);
        }

        this.prevHands.unshift(this.currentHand);
        if (this.prevHands.length > 5) this.prevHands.pop();
        
      }
    }
  }
}