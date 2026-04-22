class Cursor {
  constructor(canOutline, canBackground, spraySound, paintSplash) {
    this.x = null;
    this.y = null;

    this.color = "red";
    this.drawColor = "black";
    this.drawRadius = 20;

    this.indexKeypoint = null;
    this.indexKeypointX = null;
    this.indexKeypointY = null;

    this.thumbKeypoint = null;
    this.thumbKeypointX = null;
    this.thumbKeypointY = null;

    this.click = false;
    this.withinCanvas = false;

    this.paintCanOutline = canOutline;
    this.paintCanBackground = canBackground;
    this.paintSplash = paintSplash
    this.paintSplashWidth = 50;
    this.paintSplashHeight = 50;

    this.spraySound = spraySound;

    this.mode = "mouse";
  }

  updateCursor(tracker) {
    if (tracker.hands[0] != undefined && this.mode == "hand") {
      this.indexKeypoint = tracker.hands[0].keypoints[8];
      this.thumbKeypoint = tracker.hands[0].keypoints[4];

      this.indexKeypointX = tracker.avgIndexX;
      this.indexKeypointY = tracker.avgIndexY;
      this.thumbKeypointX = tracker.avgThumbX;
      this.thumbKeypointY = tracker.avgThumbY;

      let midDistanceX = (this.indexKeypointX + this.thumbKeypointX) / 2;
      let midDistanceY = (this.indexKeypointY + this.thumbKeypointY) / 2; 


      this.x = map(midDistanceX, tracker.videoX, tracker.videoX + tracker.videoWidth, 0, width);
      this.y = map(midDistanceY, 0, tracker.videoHeight, 0, height);
    } else if (this.mode == "mouse") {
      this.x = mouseX;
      this.y = mouseY;
    }

  }

  drawCursor(screen, w, h) {
    if (this.withinCanvas) {
      screen.image(this.paintCanOutline, this.x - w/2, this.y, w, h);
      screen.tint(this.drawColor);
      screen.image(this.paintCanBackground, this.x - w/2, this.y, w, h);
      screen.noTint();
    }

  }

  checkClick(tracker) {
    if (tracker.hands[0] != undefined && this.mode == "hand") {
      let fingerDistance = dist(this.indexKeypointX, this.indexKeypointY, this.thumbKeypointX, this.thumbKeypointY);
      if (fingerDistance < 13) {
        this.color = "green";
        this.click = true;
      } else {
        this.color = "red";
        this.click = false;
      }
    } else if (mouseIsPressed && mouseButton == LEFT && this.mode == "mouse") {
      this.color = "green";
      this.click = true;
    } else {
      this.color = "red";
      this.click = false;
    }
  }

  checkLocation(canvas) {
    if (this.x < (canvas.x + canvas.width) && this.x > canvas.x && this.y < (canvas.y + canvas.height) && this.y > canvas.y) {
      this.withinCanvas = true;
    } else {
      this.withinCanvas = false;
    }
  }

  draw(screen, canvas) {
    if (this.click && this.withinCanvas) {
      canvas.painting.fill(this.drawColor);
      canvas.painting.noStroke();
      canvas.painting.circle(this.x, this.y, this.drawRadius);
      // canvas.painting.tint(this.drawColor);
      // canvas.painting.image(this.paintSplash, this.x - this.paintSplashWidth/2, this.y - this.paintSplashHeight/2, this.paintSplashWidth, this.paintSplashHeight);
      // canvas.painting.noTint();
      this.spraySound.playMode('untilDone');
      this.spraySound.play();
    } else {
      this.spraySound.stop();
    }


    screen.image(canvas.painting, 0, 0);
  }
};
