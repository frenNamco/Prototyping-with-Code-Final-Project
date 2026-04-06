class Cursor {
  constructor() {
    this.x = null;
    this.y = null;
    this.px = null;
    this.py = null;

    this.radius = 20;
    this.color = "red";
    this.drawColor = "black";

    this.indexKeypoint = null;
    this.indexKeypointX = null;
    this.indexKeypointY = null;

    this.thumbKeypoint = null;
    this.thumbKeypointX = null;
    this.thumbKeypointY = null;

    this.click = false;
    this.withinCanvas = false;

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

      this.x = map(midDistanceX, 0, tracker.videoWidth, 0, width);
      this.y = map(midDistanceY, 0, tracker.videoHeight, 0, height);
    } else if (this.mode == "mouse") {
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
    if (this.x < width && this.x > canvas.x && this.y < height && this.y > 0) {
      this.withinCanvas = true;
    } else {
      this.withinCanvas = false;
    }
  }

  draw(canvas) {
    if (this.click && this.withinCanvas && this.px != null) {
      canvas.painting.fill(this.drawColor);
      canvas.painting.strokeWeight(8);
      canvas.painting.line(this.px, this.py, this.x, this.y);
    }

    this.px = this.x;
    this.py = this.y;
    image(canvas.painting, 0, 0);
  }
};
