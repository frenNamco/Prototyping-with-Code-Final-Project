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

    this.drips = [];

    this.mode = "hand";
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

  sprayPaint(canvas, x, y, radius, density, col) {
    for (let i = 0; i < density; i++) {
      let angle = random(TWO_PI);
      let r = randomGaussian(0, radius / 3);
      let sx = x + cos(angle) * r;
      let sy = y + sin(angle) * r;
      canvas.painting.noStroke();
      canvas.painting.fill(red(col), green(col), blue(col), random(100, 200));
      canvas.painting.circle(sx, sy, random(1, 3));
    }
}

  draw(screen, canvas) {
    if (this.click && this.withinCanvas) {
      let col = color(this.drawColor);
      let density = floor(this.drawRadius * this.drawRadius * 0.1);
      this.sprayPaint(canvas, this.x, this.y, this.drawRadius, density, col);

      // occasionally spawn a drip
      if (random() < 0.02) {
        this.drips.push({
          x: this.x,
          y: this.y,
          speed: random(0.3, 1.2),
          col: col,
          len: 0,
          maxLen: random(20, 80)
        });
      }

      this.spraySound.playMode('untilDone');
      this.spraySound.play();
    } else {
      this.spraySound.stop();
    }

    // update drips
    for (let d of this.drips) {
      if (d.len < d.maxLen) {
        canvas.painting.stroke(red(d.col), green(d.col), blue(d.col), map(d.len, 0, d.maxLen, 200, 0));
        canvas.painting.strokeWeight(random(1, 3));
        canvas.painting.point(d.x + random(-1, 1), d.y + d.len);
        d.len += d.speed;
      }
    }

    screen.image(canvas.painting, 0, 0);
  }
};
