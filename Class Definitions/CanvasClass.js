class Canvas {
  constructor(tracker, w, h) {
    this.x = tracker.videoWidth;
    this.y = 0;
    
    this.width = w * 0.85;
    this.height = h;
    this.painting = createGraphics(w, h);
    this.color = "white";
  }

  drawCanvas(screen) {
    screen.fill(this.color);
    screen.rect(this.x, this.y, this.width, this.height);
    screen.image(this.painting, 0, 0);
  }
};