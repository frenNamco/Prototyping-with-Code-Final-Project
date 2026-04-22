class Canvas {
  constructor(tracker, w, h) {
    this.width = w * 0.85;
    this.height = h * 0.75;
    this.x = width/2 - this.width/2;
    this.y = tracker.videoHeight;
    this.painting = createGraphics(w, h);
    this.color = "white";
  }

  drawCanvas(screen) {
    screen.noStroke();
    screen.fill(this.color);
    screen.rect(this.x, this.y, this.width, this.height);
    screen.image(this.painting, 0, 0);
  }

  clearCanvas() {
    this.painting.clear();
  }
};