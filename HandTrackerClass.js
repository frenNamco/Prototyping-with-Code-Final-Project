class HandTracker {
  constructor() {
    this.video = null;
    this.videoWidth = null;
    this.videoHeight = null;
    this.widthMod = 0.15;
    this.heightMod = 0.15;

    this.hands = [];
    this.handPose = null;
    this.currentHand = null;
    this.keyPointRadius = this.widthMod * 33.333;

    this.smoothed = []; // smoothed keypoint positions
    this.smoothing = 0.5; // 0 = no smoothing, higher = more smoothing (and more lag)
    this.avgIndexX = null;
    this.avgIndexY = null;
    this.avgThumbX = null;
    this.avgThumbY = null;
  }

  preload() {
    this.handPose = ml5.handPose({ flipped: true, maxHands: 1 });
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
        // Initialize smoothed array on first detection
        if (this.smoothed.length === 0) {
          this.smoothed = this.currentHand.keypoints.map(kp => ({ x: kp.x, y: kp.y }));
        }

        for (let i = 0; i < this.currentHand.keypoints.length; i++) {
          let kp = this.currentHand.keypoints[i];
          // Lerp: blend previous smoothed position toward new position
          this.smoothed[i].x = lerp(kp.x, this.smoothed[i].x, this.smoothing);
          this.smoothed[i].y = lerp(kp.y, this.smoothed[i].y, this.smoothing);

          let sx = this.smoothed[i].x;
          let sy = this.smoothed[i].y;

          noStroke();
          if (i === 8 || i === 4) {
            if (i === 8) {
              this.avgIndexX = sx;
              this.avgIndexY = sy;
            } else {
              this.avgThumbX = sx;
              this.avgThumbY = sy;
            }
            fill(0, 255, 0);
          } else {
            fill(255, 0, 255);
          }
          circle(sx, sy, this.keyPointRadius);
        }
      }
    }
  }
}
